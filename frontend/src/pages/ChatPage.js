import React, { useState, useRef, useEffect } from 'react';
import { aiAPI, manifestoAPI, partyAPI } from '../services/api';
import { LoadingSpinner } from '../components/common';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'नमस्ते! I\'m VaadaBot 🤖 — your AI guide for Indian election manifestos and political promises. Ask me anything about party promises, manifesto comparisons, or political history!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // RAG mode
  const [mode, setMode] = useState('general'); // general | rag
  const [manifestos, setManifestos] = useState([]);
  const [selectedManifesto, setSelectedManifesto] = useState('');
  const [parties, setParties] = useState([]);

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    manifestoAPI.getAll().then(r => setManifestos(r.data || [])).catch(() => {});
    partyAPI.getAll().then(r => setParties(r.data || [])).catch(() => {});
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      let response;
      if (mode === 'rag' && selectedManifesto) {
        const { data } = await aiAPI.askManifesto(selectedManifesto, input);
        response = data.answer;
        if (data.sources?.length) {
          response += '\n\n📄 *Sources:* ' + data.sources[0].category;
}
      } else {
        const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));
        const { data } = await aiAPI.chat(apiMessages);
        response = data.response;
      }
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: '❌ Error: ' + (e.response?.data?.message || e.message) }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestedQuestions = [
    'What did BJP promise about farmers in 2019?',
    'Compare AAP and Congress on education',
    'Which party has best healthcare promises?',
    'What is NYAY scheme?',
  ];

  const getManifestoLabel = (m) => {
    const party = parties.find(p => p._id === (m.party?._id || m.party));
    return `${party?.abbreviation || '?'} - ${m.election}`;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 h-full">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">🤖 VaadaBot — AI Chat</h1>
        <p className="text-gray-600 text-sm">Ask anything about Indian politics and election promises</p>
      </div>

      {/* Mode switcher */}
      <div className="card p-3 mb-4 flex items-center gap-4 flex-wrap">
        <div className="flex gap-2">
          <button onClick={() => setMode('general')}
            className={`px-3 py-1.5 rounded text-sm font-medium ${mode === 'general' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}>
            💬 General Chat
          </button>
          <button onClick={() => setMode('rag')}
            className={`px-3 py-1.5 rounded text-sm font-medium ${mode === 'rag' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}>
            📄 Ask Manifesto (RAG)
          </button>
        </div>

        {mode === 'rag' && (
          <select value={selectedManifesto} onChange={e => setSelectedManifesto(e.target.value)}
            className="border border-gray-200 rounded px-3 py-1.5 text-sm flex-1 focus:outline-none focus:border-primary">
            <option value="">Select a manifesto...</option>
            {manifestos.filter(m => m.status === 'indexed').map(m => (
              <option key={m._id} value={m._id}>{getManifestoLabel(m)}</option>
            ))}
          </select>
        )}
      </div>

      {/* Chat window */}
      <div className="card mb-4 h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`msg-appear flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
              msg.role === 'user'
                ? 'bg-primary text-white rounded-br-none'
                : 'bg-gray-100 text-gray-800 rounded-bl-none'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-none px-4 py-3">
              <div className="flex gap-1 items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Suggested questions */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {suggestedQuestions.map(q => (
            <button key={q} onClick={() => setInput(q)}
              className="text-xs px-3 py-1.5 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition-colors">
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          placeholder={mode === 'rag' ? 'Ask about this manifesto...' : 'Ask about any party, promise, or election...'}
          className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
          disabled={loading || (mode === 'rag' && !selectedManifesto)}
        />
        <button onClick={sendMessage} disabled={loading || !input.trim() || (mode === 'rag' && !selectedManifesto)}
          className="btn-primary flex items-center gap-1 disabled:opacity-60">
          {loading ? <LoadingSpinner size="sm" /> : 'Send'}
        </button>
      </div>
      {mode === 'rag' && !selectedManifesto && (
        <p className="text-xs text-amber-600 mt-1">⚠️ Select an indexed manifesto to use RAG mode</p>
      )}
    </div>
  );
}
