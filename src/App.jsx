import { useState, useEffect } from 'react';
import { generateContent, refineContent } from './services/claude';
import { formatList } from './config/formats';
import { styleList } from './config/styles';

function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('writemaster-key') || '');
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
  useEffect(() => { localStorage.setItem('writemaster-key', apiKey); }, [apiKey]);

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
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="3.5" cy="3.5" r="3.5" fill="#FDFDFD"/>
          <circle cx="11.5" cy="3.5" r="3.5" fill="#FDFDFD"/>
          <circle cx="3.5" cy="11.5" r="3.5" fill="#FDFDFD"/>
        </svg>
        <div className="flex items-center gap-2 h-6">
          {keyOpen ? (
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onBlur={() => apiKey && setKeyOpen(false)}
              onKeyDown={(e) => e.key === 'Enter' && apiKey && setKeyOpen(false)}
              placeholder="Claude API Key"
              autoFocus
              className="bg-transparent w-44 text-white placeholder:text-neutral-600 h-6"
            />
          ) : (
            <button 
              onClick={() => setKeyOpen(true)}
              className={`h-6 flex items-center ${apiKey ? 'text-white' : 'text-neutral-600 hover:text-neutral-400'}`}
              title={apiKey ? 'key set' : 'set api key'}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.8002 9.8753L20.0194 10.5L20.0194 10.5L20.8002 9.8753ZM22.0002 11.3753L21.2194 12V12L22.0002 11.3753ZM22.0002 12.6247L21.2194 12V12L22.0002 12.6247ZM20.8002 14.1247L20.0194 13.5L20.0194 13.5L20.8002 14.1247ZM18 14.5L17.5528 15.3944C17.6916 15.4639 17.8448 15.5 18 15.5V14.5ZM16 13.5L16.4472 12.6056C16.1657 12.4648 15.8343 12.4648 15.5528 12.6056L16 13.5ZM14 14.5V15.5C14.1552 15.5 14.3084 15.4639 14.4472 15.3944L14 14.5ZM11.0141 9.01843L11.8165 8.42152L11.8165 8.42152L11.0141 9.01843ZM11.0141 14.9816L10.2118 14.3847V14.3847L11.0141 14.9816ZM6.5 12C6.5 11.7239 6.72386 11.5 7 11.5V13.5C7.82843 13.5 8.5 12.8284 8.5 12H6.5ZM7 11.5C7.27614 11.5 7.5 11.7239 7.5 12H5.5C5.5 12.8284 6.17157 13.5 7 13.5V11.5ZM7.5 12C7.5 12.2761 7.27614 12.5 7 12.5V10.5C6.17157 10.5 5.5 11.1716 5.5 12H7.5ZM7 12.5C6.72386 12.5 6.5 12.2761 6.5 12H8.5C8.5 11.1716 7.82843 10.5 7 10.5V12.5ZM6.5 13H7.5V11H6.5V13ZM7 16C4.79086 16 3 14.2091 3 12H1C1 15.3137 3.68629 18 7 18V16ZM3 12C3 9.79086 4.79086 8 7 8V6C3.68629 6 1 8.68629 1 12H3ZM20.0194 10.5L21.2194 12L22.7811 10.7506L21.5811 9.25061L20.0194 10.5ZM21.2194 12L20.0194 13.5L21.5811 14.7494L22.7811 13.2494L21.2194 12ZM20.0194 13.5H18V15.5H20.0194V13.5ZM18.4472 13.6056L16.4472 12.6056L15.5528 14.3944L17.5528 15.3944L18.4472 13.6056ZM15.5528 12.6056L13.5528 13.6056L14.4472 15.3944L16.4472 14.3944L15.5528 12.6056ZM11.9079 10.5H20.0194V8.5H11.9079V10.5ZM7 8C8.31459 8 9.48107 8.63311 10.2118 9.61533L11.8165 8.42152C10.7246 6.9539 8.97356 6 7 6V8ZM14 13.5H11.9079V15.5H14V13.5ZM10.2118 14.3847C9.48107 15.3669 8.31459 16 7 16V18C8.97356 18 10.7246 17.0461 11.8165 15.5785L10.2118 14.3847ZM11.9079 13.5C11.1751 13.5 10.5749 13.8967 10.2118 14.3847L11.8165 15.5785C11.8445 15.5408 11.8734 15.5183 11.8929 15.5074C11.9106 15.4976 11.9148 15.5 11.9079 15.5V13.5ZM20.0194 13.5L20.0194 13.5V15.5C20.6269 15.5 21.2016 15.2238 21.5811 14.7494L20.0194 13.5ZM11.9079 8.5C11.9148 8.5 11.9106 8.50239 11.8929 8.49258C11.8734 8.48172 11.8445 8.45923 11.8165 8.42152L10.2118 9.61533C10.5749 10.1033 11.1751 10.5 11.9079 10.5V8.5ZM21.2194 12V12L22.7811 13.2494C23.3655 12.519 23.3655 11.481 22.7811 10.7506L21.2194 12ZM21.5811 9.25061C21.2016 8.77618 20.6269 8.5 20.0194 8.5V10.5L20.0194 10.5L21.5811 9.25061Z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Input */}
      <textarea
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        placeholder="Type your idea here..."
        className="w-full bg-neutral-900 rounded-lg p-4 mb-8 min-h-[120px] resize-none text-white placeholder:text-neutral-600"
      />

      {/* Formats */}
      <div className="flex flex-wrap gap-2 mb-4">
        {formatList.map((f) => (
          <button
            key={f.id}
            onClick={() => toggleFormat(f.id)}
            className={`px-3 py-1 rounded-lg ${formats.includes(f.id) ? 'bg-white text-neutral-900' : 'bg-neutral-950 text-neutral-600 hover:text-neutral-400'}`}
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
            className={`px-3 py-1 rounded-lg ${style === s.id ? 'bg-white text-neutral-900' : 'bg-neutral-950 text-neutral-600 hover:text-neutral-400'}`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Generate */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={generate}
          disabled={isGenerating || !apiKey || !idea.trim()}
          className="flex-1 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 disabled:opacity-30"
        >
          {isGenerating ? 'Generating...' : 'Generate'}
        </button>
        <button
          onClick={() => {
            const fakeContent = {
              tweet: "The best time to start was yesterday. The second best time is now.\n\nStop waiting for permission. Stop waiting for perfect conditions.\n\nYour future self will thank you for starting today.",
              thread: "Here's what I learned after 10 years of building products:\n\n---\n\n1/ Ship fast, iterate faster.\n\nYour first version will be wrong. That's okay. The goal isn't perfection—it's learning.\n\n---\n\n2/ Talk to users obsessively.\n\nEvery week. Every day if you can. The answers are in their words, not your assumptions.\n\n---\n\n3/ Simple beats clever.\n\nIf you need to explain it, it's too complicated. The best products feel obvious in hindsight.",
              substack: "# The Art of Simplicity\n\nWe overcomplicate everything.\n\nOur products. Our processes. Our lives.\n\nBut the best solutions are almost always simple. Not easy—simple.\n\n## Why We Overcomplicate\n\nComplexity feels like progress. Adding features feels productive. But every addition is also a subtraction—of clarity, of focus, of ease.\n\n## The Path Forward\n\nStart by removing. What can you eliminate? What's not essential?\n\nThe goal isn't to do more. It's to do what matters.",
              shortEssay: "Simplicity is the ultimate sophistication.\n\nWe think complexity signals intelligence. It doesn't. It signals confusion.\n\nThe smartest people I know speak plainly. They cut through noise. They find the essence.\n\nThis isn't about dumbing down. It's about clearing up.\n\nWant to test your understanding? Explain it to a child. If you can't, you don't understand it well enough.",
              longEssay: "# On the Nature of Work\n\nWork has changed. Not just how we work, but what work means.\n\nA century ago, work was physical. You made things. You moved things. You fixed things. The value was tangible.\n\nToday, most work is invisible. We move information. We make decisions. We coordinate with others. The value is abstract.\n\n## The Knowledge Economy\n\nThis shift has profound implications. When work was physical, more hours meant more output. Simple math.\n\nBut knowledge work doesn't scale linearly. Sometimes an hour of deep focus produces more than a week of scattered effort.\n\n## The Future\n\nThe next evolution is already here. AI will handle the routine. What's left for us?\n\nCreativity. Judgment. Connection. The deeply human things.\n\nThe question isn't whether to adapt. It's how fast."
            };
            const newOutputs = {};
            formats.forEach(f => {
              if (fakeContent[f]) newOutputs[f] = fakeContent[f];
            });
            setOutputs(newOutputs);
          }}
          className="px-4 py-3 bg-neutral-800 text-neutral-500 rounded-lg hover:bg-neutral-700 hover:text-white"
        >
          Test
        </button>
      </div>

      {/* Error */}
      {error && <p className="text-neutral-500 mb-4">error: {error}</p>}

      {/* Outputs */}
      {Object.entries(outputs).map(([formatId, content]) => (
        <div key={formatId} className="mb-8 rounded-lg overflow-hidden">
          <div className="flex justify-between items-center px-4 py-2 bg-neutral-800 text-neutral-400">
            <span>{formatList.find(f => f.id === formatId)?.name}</span>
            <button onClick={() => copy(content)} className="hover:text-white">copy</button>
          </div>
          <div className="p-4 bg-neutral-900 whitespace-pre-wrap">
            {formatId === 'thread' && content.includes('---')
              ? content.split('---').filter(t => t.trim()).map((tweet, i) => (
                  <div key={i} className={i > 0 ? 'mt-6 pt-6 border-t border-neutral-800' : ''}>
                    {tweet.trim()}
                  </div>
                ))
              : content
            }
          </div>
          <div className="px-4 py-2 bg-neutral-950 text-neutral-600">
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
            className="flex-1 bg-neutral-950 border border-neutral-900 rounded-lg px-4 py-2 text-white placeholder:text-neutral-600"
          />
          <button
            onClick={refine}
            disabled={isRefining || !refineInput.trim()}
            className="px-4 py-2 bg-neutral-950 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-800 disabled:opacity-30"
          >
            {isRefining ? '...' : '→'}
          </button>
        </div>
      )}

    </div>
  );
}

export default App;
