import Sidebar from "@/components/(sidebar-menu)/sidebar-menu";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { styles } from "@/styles/(components)/support.styles";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
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
  status: string;
  messages: Message[];
}

export default function SupportScreen() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [replyText, setReplyText] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchTickets = async () => {
    try {
      const response = await api.get("/support/tickets");
      setTickets(response.data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os chamados.");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

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
      Alert.alert("Erro", "Falha ao abrir chamado.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async (ticketId: number) => {
    const text = replyText[ticketId];
    if (!text || !text.trim()) return;

    try {
      await api.post(`/support/tickets/${ticketId}/reply`, { message: text });
      setReplyText((prev) => ({ ...prev, [ticketId]: "" }));
      fetchTickets();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível enviar a resposta.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <Sidebar activeScreen="Suporte" />

        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: 100 }]}
        >
          <Text style={styles.greeting}>Olá, {user?.name}</Text>
          <Text style={{ marginBottom: 15, color: "#6B7280" }}>
            {user?.is_admin ? "Painel de Atendimento (ADM)" : "Seus Chamados"}
          </Text>

          {/* Formulário de Novo Chamado */}
          {!user?.is_admin && (
            <View style={styles.formGroup}>
              <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                Novo Chamado
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Assunto"
                value={subject}
                onChangeText={setSubject}
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Descreva seu problema..."
                multiline
                numberOfLines={4}
                value={message}
                onChangeText={setMessage}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={handleCreateTicket}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.buttonText}>Abrir Chamado</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* Lista de Chamados */}
          {fetching ? (
            <ActivityIndicator size="large" style={{ marginTop: 20 }} />
          ) : tickets.length === 0 ? (
            <Text
              style={{ textAlign: "center", color: "#6B7280", marginTop: 20 }}
            >
              Nenhum chamado encontrado.
            </Text>
          ) : (
            tickets.map((ticket) => (
              <View
                key={ticket.id}
                style={{
                  padding: 12,
                  backgroundColor: "#F3F4F6",
                  borderRadius: 8,
                  marginVertical: 8,
                }}
              >
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                  [{ticket.status.toUpperCase()}] {ticket.subject}
                </Text>

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

                {/* Campo para Responder */}
                <View style={{ flexDirection: "row", marginTop: 8, gap: 6 }}>
                  <TextInput
                    style={[styles.input, { flex: 1, marginBottom: 0 }]}
                    placeholder="Responder..."
                    value={replyText[ticket.id] || ""}
                    onChangeText={(val) =>
                      setReplyText((prev) => ({ ...prev, [ticket.id]: val }))
                    }
                  />
                  <TouchableOpacity
                    style={[styles.button, { width: 80 }]}
                    onPress={() => handleSendReply(ticket.id)}
                  >
                    <Text style={styles.buttonText}>Enviar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
