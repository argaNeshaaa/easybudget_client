import { useState, useEffect, useRef } from "react";
import { Sidebar, Header } from "../../components/ui/Navbar";
import { Send, Bot, User, Sparkles, Loader2, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown"; // Agar teks AI rapi (bold/list)
import api from "../../api/axios";
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
  
  // Ref untuk auto-scroll ke bawah
  const messagesEndRef = useRef(null);
  const token = localStorage.getItem("token");

  // Fungsi Auto Scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Handle Kirim Pesan
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    // 1. Tambahkan pesan user ke chat
    const userMsg = { id: Date.now(), sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // 2. Panggil API Backend
      const res = await api.post("/ai/chat", { message: userMsg.text }, {
          headers: { Authorization: `Bearer ${token}` }
      });

      // 3. Tambahkan balasan AI ke chat
      const aiMsg = { 
        id: Date.now() + 1, 
        sender: "ai", 
        text: res.data.data.reply // Sesuaikan dengan struktur response controller
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

  // Handle Reset Chat
  const handleReset = () => {
      setMessages([{
          id: 1,
          sender: "ai",
          text: "Halo! Saya EasyBudget AI 🤖. Ada yang bisa saya bantu mengenai keuanganmu hari ini?",
      }]);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-gabarito">
      <Sidebar />
      <Header />

      <div className="fixed top-[10%] left-[18%] w-[82%] h-[90%] bg-[#E5E9F1] p-6 overflow-hidden">
        
        {/* CONTAINER CHAT (Putih) */}
        <div className="relative bg-white w-full h-full rounded-2xl shadow-lg flex flex-col overflow-hidden">
          
          {/* HEADER CHAT */}
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white z-10">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                    <Sparkles size={20} />
                </div>
                <div>
                    <h2 className="font-bold text-gray-800 text-lg">Tanya Nathan</h2>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Online • Powered by Gemini
                    </p>
                </div>
            </div>
            <button 
                onClick={handleReset}
                className="text-gray-400 hover:text-red-500 transition p-2 rounded-full hover:bg-gray-50"
                title="Hapus Chat"
            >
                <Trash2 size={18} />
            </button>
          </div>

          {/* AREA PESAN (SCROLLABLE) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-4 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {/* Avatar AI */}
                {msg.sender === "ai" && (
                  <div className="w-8 h-8 min-w-[2rem] bg-blue-600 rounded-full flex items-center justify-center text-white shadow-md mt-1">
                    <Bot size={16} />
                  </div>
                )}

                {/* Bubble Pesan */}
                <div
                  className={`max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
                  }`}
                >
                  {msg.sender === "ai" ? (
                    // Render Markdown untuk AI (Bold, List, Paragraph)
                    <ReactMarkdown 
                        components={{
                            ul: ({node, ...props}) => <ul className="list-disc pl-4 mt-2 mb-2" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal pl-4 mt-2 mb-2" {...props} />,
                            strong: ({node, ...props}) => <span className="font-bold text-blue-700" {...props} />
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
                  <div className="w-8 h-8 min-w-[2rem] bg-gray-800 rounded-full flex items-center justify-center text-white shadow-md mt-1">
                    <User size={16} />
                  </div>
                )}
              </div>
            ))}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex gap-4 justify-start">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-md">
                   <Bot size={16} />
                </div>
                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-200 shadow-sm flex items-center gap-2">
                   <Loader2 className="animate-spin text-blue-600" size={16} />
                   <span className="text-xs text-gray-500 animate-pulse">Sedang menganalisis keuanganmu...</span>
                </div>
              </div>
            )}
            
            {/* Invisible div untuk target scroll */}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT AREA */}
          <div className="p-4 bg-white border-t border-gray-100">
            <form 
                onSubmit={handleSend}
                className="flex items-center gap-3 bg-gray-100 p-2 rounded-full border border-transparent focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition"
            >
              <input
                type="text"
                className="flex-1 bg-transparent px-4 py-2 outline-none text-gray-700 text-sm"
                placeholder="Ketik pertanyaan seputar keuanganmu..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
              </button>
            </form>
            <p className="text-center text-[10px] text-gray-400 mt-2">
                AI dapat membuat kesalahan. Selalu cek kembali data penting Anda.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}