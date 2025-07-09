import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Send } from "lucide-react";
import { 
  Box, 
  Card, 
  CardContent, 
  TextField, 
  IconButton, 
  Typography,
  Avatar,
  Paper,
  Container,
  Divider,
  CircularProgress
} from "@mui/material";

const Chat = () => {
  const [messages, setMessages] = useState([
    { text: "¡Hola! ¿En qué puedo ayudarte?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatMessagesRef = useRef(null);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const { data } = await axios.post("https://backend-gis-1.onrender.com/api/chat", { message: input });
      setMessages([...newMessages, { text: data.response, sender: "bot" }]);
    } catch (error) {
      console.error("Error enviando mensaje:", error);
      setMessages([
        ...newMessages,
        { text: "Lo siento, ha ocurrido un error al procesar tu mensaje.", sender: "bot" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Card
        elevation={6}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          backgroundColor: "#ffffff",
          border: "1px solid rgba(0, 121, 107, 0.2)",
        }}
      >
        <Box
          sx={{
            p: 2,
            background: "linear-gradient(135deg,rgb(142, 169, 241),rgb(148, 169, 198))",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Avatar sx={{ bgcolor: "#e0f2f1", color: "#00796b" }}>G</Avatar>
          <Typography variant="h6" component="div" sx={{ color: "white", fontWeight: 500 }}>
            Gislive boutique clinica
          </Typography>
        </Box>

        <Divider />

        <CardContent
          ref={chatMessagesRef}
          sx={{
            height: 380,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            p: 2,
            backgroundColor: "#f5f7f9",
          }}
        >
          {messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                mb: 1,
              }}
            >
              {msg.sender === "bot" && (
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    mr: 1,
                    mt: 0.5,
                    bgcolor: "#00796b",
                    fontSize: "0.875rem",
                  }}
                >
                  G
                </Avatar>
              )}
              <Paper
                elevation={1}
                sx={{
                  maxWidth: "75%",
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: msg.sender === "user" ? "#00796b" : "white",
                  color: msg.sender === "user" ? "white" : "black",
                  boxShadow: msg.sender === "user" 
                    ? "0 2px 5px rgba(0, 0, 0, 0.1)" 
                    : "0 2px 5px rgba(0, 0, 0, 0.05)",
                  borderTopRightRadius: msg.sender === "user" ? 0 : 16,
                  borderTopLeftRadius: msg.sender === "bot" ? 0 : 16,
                }}
              >
                <Typography variant="body1">{msg.text}</Typography>
              </Paper>
              {msg.sender === "user" && (
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    ml: 1,
                    mt: 0.5,
                    bgcolor: "#e0f2f1",
                    color: "#00796b",
                    fontSize: "0.875rem",
                  }}
                >
                  U
                </Avatar>
              )}
            </Box>
          ))}
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 1 }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  mr: 1,
                  bgcolor: "#00796b",
                  fontSize: "0.875rem",
                }}
              >
                G
              </Avatar>
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CircularProgress size={20} thickness={5} sx={{ color: "#00796b" }} />
              </Paper>
            </Box>
          )}
        </CardContent>

        <Divider />

        <Box sx={{ p: 2, backgroundColor: "#f5f7f9" }}>
          <Box
            component="form"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              backgroundColor: "white",
              borderRadius: 3,
              p: 0.5,
              pl: 2,
              border: "1px solid rgba(0, 0, 0, 0.1)",
            }}
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
          >
            <TextField
              fullWidth
              variant="standard"
              placeholder="Escribe tu mensaje..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              InputProps={{
                disableUnderline: true,
              }}
            />
            <IconButton
              type="submit"
              disabled={loading}
              sx={{
                backgroundColor: "#00796b",
                color: "white",
                "&:hover": { backgroundColor: "#005a4f" },
                "&:disabled": { backgroundColor: "#ccc" },
                width: 40,
                height: 40,
              }}
            >
              {loading ? <CircularProgress size={24} thickness={4} sx={{ color: "white" }} /> : <Send size={20} />}
            </IconButton>
          </Box>
        </Box>
      </Card>
    </Container>
  );
};

export default Chat;