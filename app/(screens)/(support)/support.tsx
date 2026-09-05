import Sidebar from "@/components/(sidebar-menu)/sidebar-menu";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { styles } from "@/styles/(components)/support.styles";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Message {
  id: number;
  message: string;
  is_admin: boolean;
  user: { name: string };
  created_at: string;
}

interface Ticket {
  id: number;
  subject: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  created_at: string;
  user: { name: string; email: string };
  messages: Message[];
}

const STATUS_LABELS: Record<Ticket["status"], string> = {
  open: "Aberto",
  in_progress: "Em Análise",
  resolved: "Resolvido",
  closed: "Fechado",
};

const STATUS_COLORS: Record<Ticket["status"], string> = {
  open: "#2563EB",
  in_progress: "#D97706",
  resolved: "#059669",
  closed: "#6B7280",
};

const TICKET_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24h

function formatCountdown(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(
    s
  ).padStart(2, "0")}`;
}

export default function SupportScreen() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [replyText, setReplyText] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [nextAllowedAt, setNextAllowedAt] = useState<Date | null>(null);
  const [now, setNow] = useState(new Date());

  const fetchTickets = async () => {
    try {
      const response = await api.get("/support/tickets");
      const data: Ticket[] = response.data;
      setTickets(data);

      // Para não-admin: calcula quando pode abrir o próximo chamado
      // com base no último chamado criado.
      if (!user?.is_admin && data.length > 0) {
        const lastCreatedAt = data.reduce(
          (latest, t) =>
            new Date(t.created_at) > new Date(latest) ? t.created_at : latest,
          data[0].created_at
        );

        const next = new Date(
          new Date(lastCreatedAt).getTime() + TICKET_COOLDOWN_MS
        );
        setNextAllowedAt(next);
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os chamados.");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Atualiza o relógio a cada segundo para o timer de 24h
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const cooldownRemainingMs = useMemo(() => {
    if (!nextAllowedAt) return 0;
    return nextAllowedAt.getTime() - now.getTime();
  }, [nextAllowedAt, now]);

  const canCreateTicket = cooldownRemainingMs <= 0;

  const handleCreateTicket = async () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert("Atenção", "Preencha o assunto e a mensagem.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/support/tickets", { subject, message });
      Alert.alert("Sucesso", "Chamado aberto com sucesso!");
      setSubject("");
      setMessage("");
      fetchTickets();
    } catch (error: any) {
      if (error?.response?.status === 429) {
        const nextAllowed = error.response.data?.next_allowed_at;
        if (nextAllowed) setNextAllowedAt(new Date(nextAllowed));
        Alert.alert(
          "Aguarde",
          error.response.data?.msg ??
            "Você já abriu um chamado nas últimas 24 horas."
        );
      } else {
        Alert.alert("Erro", "Falha ao abrir chamado.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async (ticketId: number) => {
    const text = replyText[ticketId];
    if (!text || !text.trim()) return;

    try {
      await api.post(`/support/tickets/${ticketId}/reply`, { message: text });
      setReplyText({ ...replyText, [ticketId]: "" });
      fetchTickets();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível enviar a resposta.");
    }
  };

  const handleUpdateStatus = async (
    ticketId: number,
    status: Ticket["status"]
  ) => {
    try {
      await api.patch(`/support/tickets/${ticketId}/status`, { status });
      fetchTickets();
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error?.response?.data?.msg ?? "Não foi possível atualizar o status."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Sidebar activeScreen="Suporte" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.greeting}>Olá, {user?.name}</Text>
        <Text style={{ marginBottom: 15, color: "#6B7280" }}>
          {user?.is_admin ? "Painel de Atendimento (ADM)" : "Seus Chamados"}
        </Text>

        {/* Formulário de Novo Chamado (Apenas para não-admins) */}
        {!user?.is_admin && (
          <View style={styles.formGroup}>
            <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
              Novo Chamado
            </Text>

            {!canCreateTicket && (
              <Text style={{ color: "#D97706", marginBottom: 8 }}>
                Você poderá abrir um novo chamado em{" "}
                {formatCountdown(cooldownRemainingMs)}
              </Text>
            )}

            <TextInput
              style={styles.input}
              placeholder="Assunto"
              value={subject}
              onChangeText={setSubject}
              editable={canCreateTicket}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descreva seu problema..."
              multiline
              numberOfLines={4}
              value={message}
              onChangeText={setMessage}
              editable={canCreateTicket}
            />
            <TouchableOpacity
              style={[styles.button, !canCreateTicket && { opacity: 0.5 }]}
              onPress={handleCreateTicket}
              disabled={loading || !canCreateTicket}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>
                  {canCreateTicket
                    ? "Abrir Chamado"
                    : "Aguarde para abrir outro"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Lista de Chamados */}
        {fetching ? (
          <ActivityIndicator size="large" style={{ marginTop: 20 }} />
        ) : (
          tickets.map((ticket) => {
            const isClosed = ticket.status === "closed";
            const canUserClose = !user?.is_admin && !isClosed;

            return (
              <View
                key={ticket.id}
                style={{
                  padding: 12,
                  backgroundColor: "#F3F4F6",
                  borderRadius: 8,
                  marginVertical: 8,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{ fontWeight: "bold", fontSize: 16, flexShrink: 1 }}
                  >
                    {ticket.subject}
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "bold",
                      color: "#FFFFFF",
                      backgroundColor: STATUS_COLORS[ticket.status],
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                      borderRadius: 12,
                      overflow: "hidden",
                    }}
                  >
                    {STATUS_LABELS[ticket.status]}
                  </Text>
                </View>

                {user?.is_admin && ticket.user?.email && (
                  <Text
                    style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}
                  >
                    {ticket.user.email}
                  </Text>
                )}

                {/* Histórico de Mensagens */}
                {ticket.messages.map((msg) => (
                  <View
                    key={msg.id}
                    style={{
                      marginVertical: 4,
                      padding: 8,
                      borderRadius: 6,
                      backgroundColor: msg.is_admin ? "#E0E7FF" : "#FFFFFF",
                      alignSelf: msg.is_admin ? "flex-start" : "flex-end",
                      maxWidth: "85%",
                    }}
                  >
                    <Text style={{ fontSize: 10, color: "#4B5563" }}>
                      {msg.is_admin ? "Suporte" : msg.user?.name}
                    </Text>
                    <Text style={{ fontSize: 14 }}>{msg.message}</Text>
                  </View>
                ))}

                {/* Campo para Responder (só se o chamado não estiver fechado) */}
                {!isClosed && (
                  <View style={{ flexDirection: "row", marginTop: 8, gap: 6 }}>
                    <TextInput
                      style={[styles.input, { flex: 1, marginBottom: 0 }]}
                      placeholder="Responder..."
                      value={replyText[ticket.id] || ""}
                      onChangeText={(val) =>
                        setReplyText({ ...replyText, [ticket.id]: val })
                      }
                    />
                    <TouchableOpacity
                      style={[styles.button, { width: 80 }]}
                      onPress={() => handleSendReply(ticket.id)}
                    >
                      <Text style={styles.buttonText}>Enviar</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Ações de status */}
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 6,
                    marginTop: 10,
                  }}
                >
                  {user?.is_admin && ticket.status === "open" && (
                    <TouchableOpacity
                      style={[styles.button, { backgroundColor: "#D97706" }]}
                      onPress={() =>
                        handleUpdateStatus(ticket.id, "in_progress")
                      }
                    >
                      <Text style={styles.buttonText}>Marcar Em Análise</Text>
                    </TouchableOpacity>
                  )}

                  {user?.is_admin &&
                    ticket.status !== "resolved" &&
                    !isClosed && (
                      <TouchableOpacity
                        style={[styles.button, { backgroundColor: "#059669" }]}
                        onPress={() =>
                          handleUpdateStatus(ticket.id, "resolved")
                        }
                      >
                        <Text style={styles.buttonText}>Marcar Resolvido</Text>
                      </TouchableOpacity>
                    )}

                  {(user?.is_admin || canUserClose) && !isClosed && (
                    <TouchableOpacity
                      style={[styles.button, { backgroundColor: "#6B7280" }]}
                      onPress={() => handleUpdateStatus(ticket.id, "closed")}
                    >
                      <Text style={styles.buttonText}>Fechar Chamado</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
