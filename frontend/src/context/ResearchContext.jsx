import React, { createContext, useContext, useState, useRef, useCallback } from 'react';

const ResearchContext = createContext(null);

export const ResearchProvider = ({ children }) => {
  const [query, setQuery] = useState('');
  const [isResearching, setIsResearching] = useState(false);
  const [memo, setMemo] = useState(null);
  const [cases, setCases] = useState([]);
  const [error, setError] = useState(null);
  const [agentStatuses, setAgentStatuses] = useState({
    intent: 'idle',
    researcher: 'idle',
    validation: 'idle',
    analysis: 'idle',
    memorandum: 'idle',
  });
  const [telemetry, setTelemetry] = useState([]);
  const [history, setHistory] = useState([]);

  // Lives at the top level — survives all route changes
  const abortControllerRef = useRef(null);

  const abortResearch = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsResearching(false);
  }, []);

  const handleResearch = useCallback(async (queryText) => {
    const q = typeof queryText === 'string' ? queryText : query;
    if (!q || isResearching) return;

    // Save current to history before starting new search
    setHistory(prev => {
      if (memo && cases.length > 0) {
        const exists = prev.find(h => h.query === memo.query);
        if (!exists) {
          return [{ id: Date.now().toString(), query: memo.query, memo, cases, telemetry, date: new Date().toLocaleTimeString() }, ...prev];
        }
      }
      return prev;
    });

    // Cancel any previous in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsResearching(true);
    setAgentStatuses({ intent: 'idle', researcher: 'idle', validation: 'idle', analysis: 'idle', memorandum: 'idle' });
    setTelemetry([]);
    setMemo(null);
    setCases([]);
    setError(null);

    try {
      const response = await fetch('http://localhost:5001/api/ask-lexagent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
        signal: controller.signal,
      });

      if (!response.body) throw new Error('ReadableStream not supported.');

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let sessionCases = [];

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.substring(6));
              if (data.type === 'error') {
                throw new Error(data.message);
              } else if (data.type === 'status') {
                setAgentStatuses(prev => ({ ...prev, [data.agent]: data.status }));
              } else if (data.type === 'telemetry') {
                setTelemetry(prev => [{
                  id: Date.now() + Math.random(),
                  timestamp: new Date().toLocaleTimeString([], { hour12: false }),
                  agent: data.agent,
                  message: data.message,
                }, ...prev].slice(0, 50));
              } else if (data.type === 'payload' && data.agent === 'critic') {
                sessionCases = data.data;
                setCases(sessionCases);
              }
            } catch (e) {
              console.error('Error parsing stream line:', e);
            }
          }
        }
      }

      setMemo({ query: q, cases: sessionCases });
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Research aborted by user or system.');
        return;
      }
      setError('Engine connection failed. Please ensure the backend is running.');
      console.error(err);
    } finally {
      setIsResearching(false);
      abortControllerRef.current = null;
    }
  }, [query, isResearching, memo, cases, telemetry]);

  const loadHistoryItem = useCallback((item) => {
    if (isResearching) return;
    
    // Save current to history before switching
    setHistory(prev => {
      let newHistory = prev;
      if (memo && cases.length > 0) {
        const exists = prev.find(h => h.query === memo.query);
        if (!exists) {
          newHistory = [{ id: Date.now().toString(), query: memo.query, memo, cases, telemetry, date: new Date().toLocaleTimeString() }, ...prev];
        }
      }
      return newHistory;
    });

    setQuery(item.query);
    setMemo(item.memo);
    setCases(item.cases);
    setTelemetry(item.telemetry);
    setAgentStatuses({ intent: 'completed', researcher: 'completed', validation: 'completed', analysis: 'completed', memorandum: 'completed' });
    setError(null);
  }, [isResearching, memo, cases, telemetry]);

  return (
    <ResearchContext.Provider value={{
      query, setQuery,
      isResearching,
      memo,
      cases,
      error,
      agentStatuses,
      telemetry,
      history,
      handleResearch,
      abortResearch,
      loadHistoryItem,
    }}>
      {children}
    </ResearchContext.Provider>
  );
};

export const useResearch = () => {
  const ctx = useContext(ResearchContext);
  if (!ctx) throw new Error('useResearch must be used inside <ResearchProvider>');
  return ctx;
};
