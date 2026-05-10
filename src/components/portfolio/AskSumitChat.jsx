import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ask-sumit`;
const ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const SUGGESTIONS = [
  'What does Sumit do?',
  'Show me his best projects',
  'Is he available for hire?',
  'What tech stack does he use?',
];

export default function AskSumitChat({ profile }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Hey! 👋 I'm **Ask Sumit** — an AI trained on Sumit's portfolio, projects, and experience. Ask me anything!` },
  ]);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, streaming]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  const send = async (text) => {
    const content = (text ?? input).trim();
    if (!content || streaming) return;
    setInput('');
    const next = [...messages, { role: 'user', content }, { role: 'assistant', content: '' }];
    setMessages(next);
    setStreaming(true);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const res = await fetch(FN_URL, {
        method: 'POST',
        signal: ctrl.signal,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ANON}`,
          'apikey': ANON,
        },
        body: JSON.stringify({
          messages: next.filter((m, i) => !(i === next.length - 1 && m.role === 'assistant' && !m.content))
            .map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        let err = 'Something went wrong.';
        try { const j = await res.json(); err = j.error || err; } catch {}
        setMessages(m => {
          const c = [...m];
          c[c.length - 1] = { role: 'assistant', content: `⚠️ ${err}` };
          return c;
        });
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';
      let acc = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split('\n');
        buf = lines.pop() || '';
        for (const line of lines) {
          const t = line.trim();
          if (!t.startsWith('data:')) continue;
          const data = t.slice(5).trim();
          if (!data || data === '[DONE]') continue;
          try {
            const json = JSON.parse(data);
            const delta = json.choices?.[0]?.delta?.content;
            if (delta) {
              acc += delta;
              setMessages(m => {
                const c = [...m];
                c[c.length - 1] = { role: 'assistant', content: acc };
                return c;
              });
            }
          } catch {}
        }
      }
    } catch (e) {
      if (e.name !== 'AbortError') {
        setMessages(m => {
          const c = [...m];
          c[c.length - 1] = { role: 'assistant', content: '⚠️ Connection error. Please try again.' };
          return c;
        });
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 group"
            aria-label="Ask Sumit"
          >
            <span className="absolute inset-0 rounded-full bg-[#8B1A1A]/30 animate-ping" />
            <span className="relative flex items-center gap-2 pl-4 pr-5 py-3.5 rounded-full bg-gradient-to-br from-[#8B1A1A] to-[#a52828] text-white shadow-2xl shadow-[#8B1A1A]/40 font-medium">
              <span className="relative">
                <MessageCircle className="w-5 h-5" />
                <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300" />
              </span>
              <span className="hidden sm:inline text-sm">Ask Sumit</span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed z-50 bottom-4 right-4 left-4 sm:left-auto sm:bottom-6 sm:right-6 sm:w-[400px] h-[80vh] sm:h-[600px] max-h-[calc(100vh-2rem)] flex flex-col bg-white rounded-3xl shadow-2xl shadow-black/30 border border-[#e8e0e0] overflow-hidden"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-br from-[#8B1A1A] to-[#a52828] text-white p-4 flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-white/30 bg-white/10 flex-shrink-0">
                {profile?.photo_url ? (
                  <img src={profile.photo_url} alt="Sumit" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-lg font-bold">S</div>
                )}
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-[#8B1A1A]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 font-semibold">
                  Ask Sumit
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                </div>
                <div className="text-[11px] text-white/70">AI assistant · Online</div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-9 h-9 rounded-full hover:bg-white/15 flex items-center justify-center transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#faf9f7]">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-[#1a1a1a] text-white rounded-br-md'
                        : 'bg-white text-[#1a1a1a] border border-[#ece6e3] rounded-bl-md shadow-sm'
                    }`}
                  >
                    {m.role === 'assistant' && !m.content && streaming ? (
                      <span className="flex items-center gap-1.5 text-[#8B1A1A]">
                        <span className="w-1.5 h-1.5 bg-[#8B1A1A] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-[#8B1A1A] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-[#8B1A1A] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </span>
                    ) : m.role === 'assistant' ? (
                      <div className="prose prose-sm max-w-none prose-p:my-1.5 prose-a:text-[#8B1A1A] prose-ul:my-1.5 prose-li:my-0 prose-strong:text-[#1a1a1a]">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                    ) : (
                      m.content
                    )}
                  </div>
                </div>
              ))}

              {/* Suggestions */}
              {messages.length === 1 && !streaming && (
                <div className="pt-2 space-y-2">
                  <p className="text-[11px] uppercase tracking-wider text-[#999] font-medium px-1">Try asking</p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map(s => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="text-xs px-3 py-1.5 rounded-full bg-white border border-[#e8d8d8] text-[#8B1A1A] hover:bg-[#8B1A1A] hover:text-white hover:border-[#8B1A1A] transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-[#ece6e3] p-3 bg-white">
              <div className="flex items-end gap-2 bg-[#faf9f7] rounded-2xl border border-[#ece6e3] focus-within:border-[#8B1A1A] transition-colors p-1.5">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Ask about Sumit's work..."
                  disabled={streaming}
                  className="flex-1 bg-transparent resize-none outline-none px-3 py-2 text-sm placeholder:text-[#aaa] max-h-32"
                />
                <button
                  onClick={() => send()}
                  disabled={streaming || !input.trim()}
                  className="w-9 h-9 flex-shrink-0 rounded-xl bg-gradient-to-br from-[#8B1A1A] to-[#a52828] text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#8B1A1A]/40 transition-all"
                  aria-label="Send"
                >
                  {streaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-[#aaa] text-center mt-2">AI-generated · May not always be accurate</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
