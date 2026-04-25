import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Send, Loader2, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const getAIResponse = (query, books) => {
  const q = query.toLowerCase();
  // Simple keyword-based recommendations (replace with actual AI API call)
  let recommended = [];

  if (q.includes('machine learning') || q.includes('ml') || q.includes('ai') || q.includes('artificial intelligence')) {
    recommended = books.filter((b) => b.category === 'AI/ML');
  } else if (q.includes('algorithm') || q.includes('data structure')) {
    recommended = books.filter((b) => b.category === 'Algorithms' || b.category === 'Data Structures');
  } else if (q.includes('network')) {
    recommended = books.filter((b) => b.category === 'Networking');
  } else if (q.includes('database') || q.includes('sql')) {
    recommended = books.filter((b) => b.category === 'Database');
  } else if (q.includes('software') || q.includes('clean code') || q.includes('design pattern')) {
    recommended = books.filter((b) => b.category === 'Software Engineering');
  } else if (q.includes('operating system') || q.includes('os')) {
    recommended = books.filter((b) => b.category === 'Operating Systems');
  } else {
    // Search by keywords in title/author
    recommended = books.filter((b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
  }

  if (recommended.length > 0) {
    const bookList = recommended.map((b) => `• **${b.title}** by ${b.author} — ${b.emoji} (Shelf: ${b.shelf})`).join('\n');
    return `Based on your interest, I recommend these books from our library:\n\n${bookList}\n\nWould you like to know more about any of these books?`;
  }

  return `I couldn't find specific books matching "${query}" in our library. Try asking about topics like:\n\n• Machine Learning & AI\n• Algorithms & Data Structures\n• Software Engineering\n• Computer Networks\n• Operating Systems\n• Databases\n\nOr ask me for general reading advice!`;
};

const AIAssistant = ({ books }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '👋 Hi! I\'m your AI Library Assistant. Ask me for book recommendations based on your interests, course, or topics you want to explore. I\'ll help you find the perfect book from our collection!',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // TODO: Replace with actual AI API call (e.g., Groq, Gemini)
    // const response = await aiAPI.chat({ message: input, context: books });
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));
    const response = getAIResponse(userMsg.content, books);

    setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
    setIsLoading(false);
  };

  return (
    <div className="glass-card glow overflow-hidden">
      <div className="flex items-center gap-2 border-b border-border/30 px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">AI Library Assistant</h3>
          <p className="text-[10px] text-muted-foreground">Powered by AI • Ask for book recommendations</p>
        </div>
      </div>

      <div className="h-64 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Bot className="h-3 w-3 text-primary" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/50 text-foreground'
              }`}
            >
              {msg.content.split('\n').map((line, j) => (
                <p key={j} className={j > 0 ? 'mt-1' : ''}>
                  {line.split('**').map((part, k) =>
                    k % 2 === 1 ? <strong key={k}>{part}</strong> : part
                  )}
                </p>
              ))}
            </div>
            {msg.role === 'user' && (
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted/50">
                <User className="h-3 w-3 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Bot className="h-3 w-3 text-primary" />
            </div>
            <div className="rounded-xl bg-muted/50 px-3 py-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="border-t border-border/30 p-3">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for book recommendations..."
            className="bg-muted/30 border-border/50"
          />
          <Button type="submit" size="sm" disabled={!input.trim() || isLoading} className="bg-primary text-primary-foreground px-3">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;
