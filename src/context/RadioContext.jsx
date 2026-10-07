// src/context/RadioContext.jsx
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { MOCK_SONGS } from '../data/mockSongs';

const RadioContext = createContext(null);

export function RadioProvider({ children }) {
  const [songs, setSongs] = useState(() => MOCK_SONGS.map((s) => ({ ...s })));
  const [votedIds, setVotedIds] = useState([]);
  const votedRef = useRef(new Set());

  const vote = useCallback((id) => {
    if (votedRef.current.has(id)) return false;
    votedRef.current.add(id);
    setVotedIds(Array.from(votedRef.current));
    setSongs((prev) => prev.map((s) => (s.id === id ? { ...s, votes: s.votes + 1 } : s)));
    return true;
  }, []);

  const addSong = useCallback((song) => {
    setSongs((prev) => [song, ...prev]);
  }, []);

  const value = useMemo(
    () => ({
      songs,
      votedIds,
      hasVoted: (id) => votedIds.includes(id),
      vote,
      addSong,
    }),
    [songs, votedIds, vote, addSong]
  );

  return <RadioContext.Provider value={value}>{children}</RadioContext.Provider>;
}

export function useRadio() {
  const ctx = useContext(RadioContext);
  if (!ctx) throw new Error('useRadio 必须在 RadioProvider 内部使用');
  return ctx;
}