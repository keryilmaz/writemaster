import { useState, useEffect } from 'react';
import { generateContent, refineContent } from './services/claude';
import { formatList } from './config/formats';
import { styleList } from './config/styles';

function App() {
  const [apiKey, setApiKey] = useState('');
  const [keyOpen, setKeyOpen] = useState(false);
  const [idea, setIdea] = useState('');
  const [formats, setFormats] = useState(() => {
    const saved = localStorage.getItem('writer-formats');
    return saved ? JSON.parse(saved) : ['tweet'];
  });
  const [style, setStyle] = useState(() => localStorage.getItem('writer-style') || 'naval');
  const [outputs, setOutputs] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [refineInput, setRefineInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { localStorage.setItem('writer-formats', JSON.stringify(formats)); }, [formats]);
  useEffect(() => { localStorage.setItem('writer-style', style); }, [style]);

  const toggleFormat = (id) => {
    if (formats.includes(id)) {
      if (formats.length > 1) setFormats(formats.filter(f => f !== id));
    } else {
      setFormats([...formats, id]);
    }
  };

  const generate = async () => {
    if (!apiKey || !idea.trim()) return;
    setError('');
    setIsGenerating(true);
    setOutputs({});

    await Promise.all(
      formats.map(async (format) => {
        try {
          const result = await generateContent(apiKey, idea.trim(), format, style);
          setOutputs(prev => ({ ...prev, [format]: result }));
        } catch (err) {
          setError(err.message);
        }
      })
    );
    setIsGenerating(false);
  };

  const refine = async () => {
    if (!refineInput.trim() || Object.keys(outputs).length === 0) return;
    setIsRefining(true);
    const newOutputs = {};
    for (const [format, content] of Object.entries(outputs)) {
      try {
        newOutputs[format] = await refineContent(apiKey, content, refineInput.trim(), format, style);
      } catch (err) {
        setError(err.message);
      }
    }
    setOutputs(newOutputs);
    setRefineInput('');
    setIsRefining(false);
  };

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && !isGenerating) {
        e.preventDefault();
        generate();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [apiKey, idea, formats, style, isGenerating]);

  const copy = (text) => navigator.clipboard.writeText(text);

  return (
    <div className="min-h-screen p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-12 text-neutral-500">
        <span>writemaster</span>
        <div className="flex items-center gap-2">
          {keyOpen ? (
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onBlur={() => apiKey && setKeyOpen(false)}
              onKeyDown={(e) => e.key === 'Enter' && apiKey && setKeyOpen(false)}
              placeholder="api key"
              autoFocus
              className="bg-transparent border-b border-neutral-800 px-2 py-1 w-32 text-white placeholder:text-neutral-600"
            />
          ) : (
            <button 
              onClick={() => setKeyOpen(true)}
              className={`p-1 ${apiKey ? 'text-white' : 'text-neutral-600 hover:text-neutral-400'}`}
              title={apiKey ? 'key set' : 'set api key'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Input */}
      <textarea
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        placeholder="idea"
        className="w-full bg-transparent border border-neutral-800 p-4 mb-8 min-h-[120px] resize-none text-white placeholder:text-neutral-600"
      />

      {/* Formats */}
      <div className="flex flex-wrap gap-2 mb-4">
        {formatList.map((f) => (
          <button
            key={f.id}
            onClick={() => toggleFormat(f.id)}
            className={`px-3 py-1 border ${formats.includes(f.id) ? 'border-white text-white' : 'border-neutral-800 text-neutral-600 hover:text-neutral-400'}`}
          >
            {f.name}
          </button>
        ))}
      </div>

      {/* Styles */}
      <div className="flex flex-wrap gap-2 mb-8">
        {styleList.map((s) => (
          <button
            key={s.id}
            onClick={() => setStyle(s.id)}
            className={`px-3 py-1 border ${style === s.id ? 'border-white text-white' : 'border-neutral-800 text-neutral-600 hover:text-neutral-400'}`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Generate */}
      <button
        onClick={generate}
        disabled={isGenerating || !apiKey || !idea.trim()}
        className="w-full py-3 border border-white text-white hover:bg-white hover:text-black disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white mb-8"
      >
        {isGenerating ? 'generating...' : 'generate'}
      </button>

      {/* Error */}
      {error && <p className="text-neutral-500 mb-4">error: {error}</p>}

      {/* Outputs */}
      {Object.entries(outputs).map(([formatId, content]) => (
        <div key={formatId} className="mb-8 border border-neutral-800">
          <div className="flex justify-between items-center px-4 py-2 border-b border-neutral-800 text-neutral-500">
            <span>{formatList.find(f => f.id === formatId)?.name}</span>
            <button onClick={() => copy(content)} className="hover:text-white">copy</button>
          </div>
          <div className="p-4 whitespace-pre-wrap normal-case">
            {formatId === 'thread' && content.includes('---')
              ? content.split('---').filter(t => t.trim()).map((tweet, i) => (
                  <div key={i} className={i > 0 ? 'mt-6 pt-6 border-t border-neutral-800' : ''}>
                    {tweet.trim()}
                  </div>
                ))
              : content
            }
          </div>
          <div className="px-4 py-2 border-t border-neutral-800 text-neutral-600">
            {content.length} chars · {content.split(/\s+/).filter(w => w).length} words
          </div>
        </div>
      ))}

      {/* Refine */}
      {Object.keys(outputs).length > 0 && !isGenerating && (
        <div className="flex gap-2">
          <input
            type="text"
            value={refineInput}
            onChange={(e) => setRefineInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && refine()}
            placeholder="refine"
            className="flex-1 bg-transparent border border-neutral-800 px-4 py-2 text-white placeholder:text-neutral-600"
          />
          <button
            onClick={refine}
            disabled={isRefining || !refineInput.trim()}
            className="px-4 py-2 border border-neutral-800 text-neutral-500 hover:text-white hover:border-white disabled:opacity-30"
          >
            {isRefining ? '...' : '→'}
          </button>
        </div>
      )}

      {/* Footer */}
      <p className="text-center text-neutral-700 mt-12">api key stays local</p>
    </div>
  );
}

export default App;
