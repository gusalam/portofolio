import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, Mic, MicOff, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/useLanguage";

interface Message {
  role: "user" | "assistant";
  content: string;
}

type ViewMode = "selection" | "chat" | "voice";

const AIChat = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("selection");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Halo! Saya Tanya Fikih, asisten AI Anda. Tanyakan apa saja tentang keahlian, proyek, atau pengalaman Fikih!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    // Initialize Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'id-ID';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setTranscript(transcript);
        handleVoiceMessage(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        toast.error('Gagal mendeteksi suara. Silakan coba lagi.');
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript("");
      recognitionRef.current.start();
      setIsListening(true);
      toast.success("Mulai mendengarkan...");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      synthesisRef.current = null;
    }
  };

  const speakText = (text: string) => {
    // Stop any ongoing speech first to prevent overlapping
    stopSpeaking();
    
    synthesisRef.current = new SpeechSynthesisUtterance(text);
    synthesisRef.current.lang = 'id-ID';
    synthesisRef.current.rate = 1;
    synthesisRef.current.pitch = 1;
    window.speechSynthesis.speak(synthesisRef.current);
  };

  const handleVoiceMessage = async (voiceText: string) => {
    if (!voiceText.trim()) return;

    const userMessage: Message = { role: "user", content: voiceText };
    setMessages((prev) => [...prev, userMessage]);
    setTranscript("");
    setIsTyping(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: [...messages, userMessage],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Gagal mendapatkan respons dari AI");
      }

      const data = await response.json();
      
      const assistantMessage: Message = { 
        role: "assistant", 
        content: data.message 
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      
      // Speak the response
      speakText(data.message);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Gagal mengirim pesan. Silakan coba lagi.");
      const errorMessage: Message = { 
        role: "assistant", 
        content: "Maaf, terjadi kesalahan. Silakan coba lagi." 
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: [...messages, userMessage],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Gagal mendapatkan respons dari AI");
      }

      const data = await response.json();
      
      const assistantMessage: Message = { 
        role: "assistant", 
        content: data.message 
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Gagal mengirim pesan. Silakan coba lagi.");
      const errorMessage: Message = { 
        role: "assistant", 
        content: "Maaf, terjadi kesalahan. Silakan coba lagi." 
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => {
            setIsOpen(true);
            setViewMode("selection");
          }}
          size="lg"
          className="fixed bottom-6 right-6 z-50 rounded-full shadow-2xl bg-primary hover:bg-primary/90 box-glow animate-glow-pulse flex items-center gap-2 px-6 h-14"
          aria-label="Open chat"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="font-poppins font-medium">{t("ai.assistant")}</span>
        </Button>
      )}

      {/* Main Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[32rem] shadow-2xl border-primary/30 bg-card/95 backdrop-blur-lg animate-scale-in box-glow">
          <CardHeader className="border-b border-primary/20 bg-gradient-primary">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white font-orbitron text-lg">
                    Tanya Fikih
                  </CardTitle>
                  <p className="text-white/80 text-xs font-poppins">
                    {viewMode === "selection" ? "Pilih Mode" : viewMode === "chat" ? "Chat Mode" : "Voice Mode"}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsOpen(false);
                  setViewMode("selection");
                  stopListening();
                  window.speechSynthesis.cancel();
                }}
                className="text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0 flex flex-col h-[calc(32rem-5rem)]">
            {/* Mode Selection */}
            {viewMode === "selection" && (
              <div className="flex-1 flex flex-col items-center justify-center p-8 gap-6">
                <h3 className="font-orbitron text-xl text-foreground mb-2">Pilih Mode Percakapan</h3>
                <Button
                  onClick={() => setViewMode("chat")}
                  size="lg"
                  className="w-full h-24 bg-primary hover:bg-primary/90 text-white font-poppins text-lg flex flex-col gap-2 box-glow-hover"
                >
                  <MessageSquare className="w-8 h-8" />
                  <span>Chat Text</span>
                </Button>
                <Button
                  onClick={() => setViewMode("voice")}
                  size="lg"
                  className="w-full h-24 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-poppins text-lg flex flex-col gap-2 box-glow-hover"
                >
                  <Mic className="w-8 h-8" />
                  <span>Suara Real-Time</span>
                </Button>
              </div>
            )}

            {/* Chat Mode */}
            {viewMode === "chat" && (
              <>
                <div className="border-b border-primary/20 p-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("selection")}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ← Kembali
                  </Button>
                </div>
                <ScrollArea ref={scrollRef} className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          message.role === "user" ? "justify-end" : "justify-start"
                        } animate-fade-in`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                            message.role === "user"
                              ? "bg-primary text-white"
                              : "bg-muted text-foreground"
                          }`}
                        >
                          <p className="text-sm font-poppins">{message.content}</p>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-2xl px-4 py-3">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                <div className="border-t border-primary/20 p-4">
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Tanya apa saja..."
                      className="flex-1 font-poppins bg-muted border-primary/20 focus:border-primary"
                    />
                    <Button
                      onClick={handleSend}
                      size="icon"
                      className="bg-primary hover:bg-primary/90 box-glow-hover"
                      disabled={!input.trim() || isTyping}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Voice Mode */}
            {viewMode === "voice" && (
              <>
                <div className="border-b border-primary/20 p-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setViewMode("selection");
                      stopListening();
                      window.speechSynthesis.cancel();
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ← Kembali
                  </Button>
                </div>
                <ScrollArea ref={scrollRef} className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          message.role === "user" ? "justify-end" : "justify-start"
                        } animate-fade-in`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                            message.role === "user"
                              ? "bg-primary text-white"
                              : "bg-muted text-foreground"
                          }`}
                        >
                          <p className="text-sm font-poppins">{message.content}</p>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-2xl px-4 py-3">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                          </div>
                        </div>
                      </div>
                    )}
                    {transcript && (
                      <div className="flex justify-end">
                        <div className="bg-primary/20 text-foreground rounded-2xl px-4 py-2 max-w-[80%]">
                          <p className="text-sm font-poppins italic">{transcript}</p>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                <div className="border-t border-primary/20 p-6 flex flex-col items-center gap-4">
                  <p className="text-sm text-muted-foreground font-poppins text-center">
                    {isListening ? "Mendengarkan..." : isTyping ? "AI sedang berpikir..." : "Tekan tombol untuk mulai bicara"}
                  </p>
                  <Button
                    onClick={() => {
                      if (isListening) {
                        stopListening();
                        stopSpeaking();
                      } else {
                        startListening();
                      }
                    }}
                    size="lg"
                    disabled={isTyping}
                    className={`w-20 h-20 rounded-full ${
                      isListening 
                        ? "bg-destructive hover:bg-destructive/90 animate-pulse" 
                        : "bg-primary hover:bg-primary/90"
                    } box-glow`}
                  >
                    {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default AIChat;
