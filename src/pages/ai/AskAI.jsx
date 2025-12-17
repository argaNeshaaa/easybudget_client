import { useState, useEffect, useRef } from "react";
import { Sidebar, Header } from "../../components/ui/Navbar";
import { Send, Bot, User, Sparkles, Loader2, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { api, aiApi } from "../../api/axios"; 
import "../../assets/styles/global.css";

export default function AskAI() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Halo! Saya Natan 🤖.\n\nSaya sudah menganalisis data keuanganmu bulan ini. Ada yang ingin ditanyakan? \n\n*Contoh: 'Apakah saya boros bulan ini?' atau 'Berikan saran penghematan'.*",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  const messagesEndRef = useRef(null);
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { id: Date.now(), sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await aiApi.post("/ai/chat", { message: userMsg.text }, {
          headers: { Authorization: `Bearer ${token}` }
      });

      const aiMsg = { 
        id: Date.now() + 1, 
        sender: "ai", 
        text: res.data.data.reply 
      };
      setMessages((prev) => [...prev, aiMsg]);

    } catch (err) {
      console.error("Error AI:", err);
      const errorMsg = { 
        id: Date.now() + 1, 
        sender: "ai", 
        text: "Maaf, terjadi kesalahan saat menghubungi server AI. Coba lagi nanti ya." 
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
      setMessages([{
          id: 1,
          sender: "ai",
          text: "Halo! Saya Nathan 🤖. Ada yang bisa saya bantu mengenai keuanganmu hari ini?",
      }]);
  };

  return (
    <div className="h-screen w-screen font-gabarito overflow-hidden flex flex-col">
      <Sidebar />
      <Header />

      {/* --- MAIN CONTENT CONTAINER --- */}
      {/* Mobile: Full Width, Desktop: Offset left for sidebar */}
      <div className="fixed top-[5rem] left-0 lg:left-[18%] right-0 bottom-0 bg-background dark:bg-background-dark p-4 lg:p-6 z-0">
        
        {/* CHAT CARD WRAPPER */}
        <div className="relative bg-background-box dark:bg-background-box-dark w-full h-full max-w-[1920px] mx-auto rounded-2xl shadow-lg flex flex-col overflow-hidden border border-border dark:border-border-dark">
          
          {/* HEADER CHAT */}
          <div className="p-4 border-b border-border dark:border-border-dark flex justify-between items-center bg-background-card dark:bg-background-card-dark z-10 shrink-0">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                    <Sparkles size={20} />
                </div>
                <div>
                    <h2 className="font-bold text-text-black dark:text-text-white text-base md:text-lg">Tanya Natan</h2>
                    <p className="text-[10px] md:text-xs text-gray-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Online • Powered by Gemini
                    </p>
                </div>
            </div>
            <button 
                onClick={handleReset}
                className="text-gray-400 hover:text-red-500 transition p-2 rounded-full hover:bg-gray-50 active:scale-95"
                title="Hapus Chat"
            >
                <Trash2 size={18} />
            </button>
          </div>

          {/* AREA PESAN (SCROLLABLE) */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 scroll-smooth">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 md:gap-4 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {/* Avatar AI */}
                {msg.sender === "ai" && (
                  <div className="w-8 h-8 min-w-[2rem] bg-blue-600 rounded-full flex items-center justify-center text-white shadow-md mt-1 shrink-0">
                    <Bot size={16} />
                  </div>
                )}

                {/* Bubble Pesan */}
                <div
                  className={`max-w-[85%] md:max-w-[75%] p-3 md:p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
                  }`}
                >
                  {msg.sender === "ai" ? (
                    <ReactMarkdown 
                        components={{
                            ul: ({node, ...props}) => <ul className="list-disc pl-4 mt-2 mb-2" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal pl-4 mt-2 mb-2" {...props} />,
                            strong: ({node, ...props}) => <span className="font-bold text-blue-700" {...props} />,
                            p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />
                        }}
                    >
                        {msg.text}
                    </ReactMarkdown>
                  ) : (
                    msg.text
                  )}
                </div>

                {/* Avatar User */}
                {msg.sender === "user" && (
                  <div className="w-8 h-8 min-w-[2rem] bg-gray-800 rounded-full flex items-center justify-center text-white shadow-md mt-1 shrink-0">
                    <User size={16} />
                  </div>
                )}
              </div>
            ))}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex gap-3 md:gap-4 justify-start">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-md shrink-0">
                    <Bot size={16} />
                </div>
                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-200 shadow-sm flex items-center gap-2">
                    <Loader2 className="animate-spin text-blue-600" size={16} />
                    <span className="text-xs text-gray-500 animate-pulse">Sedang mengetik...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT AREA */}
          <div className="p-3 md:p-4 bg-background-card dark:bg-background-card-dark border-t border-border dark:border-border-dark shrink-0">
            <form 
                onSubmit={handleSend}
                className="flex items-center gap-2 md:gap-3 bg-background-box dark:bg-background-box-dark p-1.5 md:p-2 rounded-full border border-transparent focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition"
            >
              <input
                type="text"
                className="flex-1 bg-transparent px-3 md:px-4 py-2 outline-none text-text-grey dark:text-text-grey-dark text-sm placeholder-text-grey dark:placeholder-text-grey-dark"
                placeholder="Ketik pesan..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2.5 md:p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md shrink-0"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
              </button>
            </form>
            <p className="text-center text-[10px] text-gray-400 mt-2 hidden md:block">
                AI dapat membuat kesalahan. Selalu cek kembali data penting Anda.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}