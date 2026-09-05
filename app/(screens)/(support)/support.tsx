import Sidebar from "@/components/(sidebar-menu)/sidebar-menu";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { api } from "@/services/api";
import { getSupportStyles } from "@/styles/support.styles";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import AlertModal from "@/components/(alert-modal)/alert-modal";
import ConfirmModal from "@/components/(confirm-modal)/confirm-modal";

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
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const styles = getSupportStyles(colors, isMobile);

  const { user, signOut } = useAuth();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [replyText, setReplyText] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [nextAllowedAt, setNextAllowedAt] = useState<Date | null>(null);
  const [now, setNow] = useState(new Date());

  // Controle de Modais de Alerta e Confirmação
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
    onClose?: () => void;
  }>({
    visible: false,
    title: "",
    message: "",
  });

  const [confirmConfig, setConfirmConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
  }>({
    visible: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const showAlert = (title: string, message: string, onClose?: () => void) => {
    setAlertConfig({ visible: true, title, message, onClose });
  };

  const closeAlert = () => {
    const callback = alertConfig.onClose;
    setAlertConfig({
      visible: false,
      title: "",
      message: "",
      onClose: undefined,
    });
    if (callback) {
      setTimeout(() => callback(), 200);
    }
  };

  const closeConfirm = () => {
    setConfirmConfig((prev) => ({ ...prev, visible: false }));
  };

  const emitSessionExpiredAlert = (msg?: string) => {
    showAlert(
      "Sessão expirada",
      msg || "Sua sessão expirou. Faça login novamente.",
      () => {
        signOut();
      }
    );
  };

  const fetchTickets = async () => {
    try {
      const response = await api.get("/support/tickets");
      const data: Ticket[] = response.data;
      setTickets(data);

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
    } catch (error: any) {
      if (error?.response?.status === 401) {
        emitSessionExpiredAlert();
      } else {
        showAlert("Erro", "Não foi possível carregar os chamados.");
      }
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

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
      showAlert("Atenção", "Preencha o assunto e a mensagem.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/support/tickets", { subject, message });
      showAlert("Sucesso", "Chamado aberto com sucesso!");
      setSubject("");
      setMessage("");
      fetchTickets();
    } catch (error: any) {
      if (error?.response?.status === 401) {
        emitSessionExpiredAlert();
      } else if (error?.response?.status === 429) {
        const nextAllowed = error.response.data?.next_allowed_at;
        if (nextAllowed) setNextAllowedAt(new Date(nextAllowed));
        showAlert(
          "Aguarde",
          error.response.data?.msg ??
            "Você já abriu um chamado nas últimas 24 horas."
        );
      } else {
        showAlert("Erro", "Falha ao abrir chamado.");
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
    } catch (error: any) {
      if (error?.response?.status === 401) {
        emitSessionExpiredAlert();
      } else {
        showAlert("Erro", "Não foi possível enviar a resposta.");
      }
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
      if (error?.response?.status === 401) {
        emitSessionExpiredAlert();
      } else {
        showAlert(
          "Erro",
          error?.response?.data?.msg ?? "Não foi possível atualizar o status."
        );
      }
    }
  };

  const confirmUpdateStatus = (
    ticketId: number,
    status: Ticket["status"],
    statusName: string
  ) => {
    setConfirmConfig({
      visible: true,
      title: "Alterar Status",
      message: `Deseja alterar o status do chamado para "${statusName}"?`,
      confirmText: "Confirmar",
      cancelText: "Cancelar",
      onConfirm: () => {
        closeConfirm();
        handleUpdateStatus(ticketId, status);
      },
    });
  };

  return (
    <>
      <View style={styles.container}>
        <Sidebar activeScreen="Suporte" />

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.greeting}>Olá,</Text>
          <Text style={styles.userName}>{user?.name}</Text>

          <Text style={styles.sectionTitle}>
            {user?.is_admin ? "Painel de Atendimento" : "Suporte & Chamados"}
          </Text>

          {!user?.is_admin && (
            <View style={styles.cardSection}>
              <Text style={styles.formTitle}>Novo Chamado</Text>

              {!canCreateTicket && (
                <Text style={styles.cooldownText}>
                  Você poderá abrir um novo chamado em{" "}
                  {formatCountdown(cooldownRemainingMs)}
                </Text>
              )}

              <TextInput
                style={styles.input}
                placeholder="Assunto"
                placeholderTextColor={colors.gray}
                value={subject}
                onChangeText={setSubject}
                editable={canCreateTicket}
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Descreva seu problema..."
                placeholderTextColor={colors.gray}
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
                  <ActivityIndicator color={colors.iconeOutColor} />
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
            <ActivityIndicator
              size="large"
              color={colors.primary}
              style={{ marginTop: 20 }}
            />
          ) : (
            tickets.map((ticket) => {
              const isClosed = ticket.status === "closed";
              const canUserClose = !user?.is_admin && !isClosed;

              return (
                <View key={ticket.id} style={styles.ticketCard}>
                  <View style={styles.ticketHeader}>
                    <Text style={styles.ticketSubject}>{ticket.subject}</Text>
                    <Text
                      style={[
                        styles.statusBadge,
                        { backgroundColor: STATUS_COLORS[ticket.status] },
                      ]}
                    >
                      {STATUS_LABELS[ticket.status]}
                    </Text>
                  </View>

                  {user?.is_admin && ticket.user?.email && (
                    <Text style={styles.userEmailText}>
                      {ticket.user.email}
                    </Text>
                  )}

                  {/* Histórico de Mensagens */}
                  <View style={styles.messagesContainer}>
                    {ticket.messages.map((msg) => (
                      <View
                        key={msg.id}
                        style={[
                          styles.messageBubble,
                          msg.is_admin
                            ? styles.adminMessageBubble
                            : styles.userMessageBubble,
                        ]}
                      >
                        <Text style={styles.messageSender}>
                          {msg.is_admin ? "Suporte" : msg.user?.name}
                        </Text>
                        <Text style={styles.messageText}>{msg.message}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Responder Chamado */}
                  {!isClosed && (
                    <View style={styles.replyContainer}>
                      <TextInput
                        style={[styles.input, styles.replyInput]}
                        placeholder="Responder..."
                        placeholderTextColor={colors.gray}
                        value={replyText[ticket.id] || ""}
                        onChangeText={(val) =>
                          setReplyText({ ...replyText, [ticket.id]: val })
                        }
                      />
                      <TouchableOpacity
                        style={[styles.button, styles.replyButton]}
                        onPress={() => handleSendReply(ticket.id)}
                      >
                        <Text style={styles.buttonText}>Enviar</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* Ações de Status */}
                  <View style={styles.actionsContainer}>
                    {user?.is_admin && ticket.status === "open" && (
                      <TouchableOpacity
                        style={[
                          styles.button,
                          { backgroundColor: colors.yellow },
                        ]}
                        onPress={() =>
                          confirmUpdateStatus(
                            ticket.id,
                            "in_progress",
                            "Em Análise"
                          )
                        }
                      >
                        <Text
                          style={[
                            styles.buttonText,
                            { color: colors.textColor },
                          ]}
                        >
                          Marcar Em Análise
                        </Text>
                      </TouchableOpacity>
                    )}

                    {user?.is_admin &&
                      ticket.status !== "resolved" &&
                      !isClosed && (
                        <TouchableOpacity
                          style={[
                            styles.button,
                            { backgroundColor: colors.green },
                          ]}
                          onPress={() =>
                            confirmUpdateStatus(
                              ticket.id,
                              "resolved",
                              "Resolvido"
                            )
                          }
                        >
                          <Text style={styles.buttonText}>
                            Marcar Resolvido
                          </Text>
                        </TouchableOpacity>
                      )}

                    {(user?.is_admin || canUserClose) && !isClosed && (
                      <TouchableOpacity
                        style={[
                          styles.button,
                          { backgroundColor: colors.gray },
                        ]}
                        onPress={() =>
                          confirmUpdateStatus(ticket.id, "closed", "Fechado")
                        }
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

      {/* Modal de Alerta */}
      <AlertModal
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={closeAlert}
      />

      {/* Modal de Confirmação */}
      <ConfirmModal
        visible={confirmConfig.visible}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText}
        cancelText={confirmConfig.cancelText}
        onConfirm={confirmConfig.onConfirm}
        onCancel={closeConfirm}
      />
    </>
  );
}
