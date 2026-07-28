import React, { useEffect, useState, useRef } from 'react';
import { useAudioPlayer } from './AudioCore';

/**
 * Custom hook to synchronize playback across a group of users
 * via Django Channels WebSocket connection.
 */
export function useRoomSync(roomId, userToken) {
  const wsRef = useRef(null);
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudioPlayer();
  const [activeUsers, setActiveUsers] = useState([]);
  const [roomState, setRoomState] = useState(null);

  useEffect(() => {
    if (!roomId) return;

    let cancelled = false;

    fetch(`http://127.0.0.1:8000/api/rooms/${roomId}/state/`)
      .then((response) => response.json())
      .then((data) => {
        if (!cancelled) {
          setRoomState(data.room || null);
        }
      })
      .catch(() => {
        /* keep local fallback */
      });
    
    // Connect to Django Channels RoomConsumer
    wsRef.current = new WebSocket(`ws://127.0.0.1:8000/ws/listening_room/${roomId}/?token=${userToken}`);
    
    wsRef.current.onopen = () => {
      console.log('Connected to Collaborative Room:', roomId);
    };

    wsRef.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setRoomState((previous) => ({ ...(previous || {}), ...data }));
      if (data.action === 'PLAY' && data.track_id && data.track_id !== (currentTrack?.id || currentTrack?.track_id)) {
        // Force sync from another user
        playTrack(data.track_id);
      } else if (data.action === 'PAUSE' && isPlaying) {
        togglePlay();
      }
    };

    return () => {
      cancelled = true;
      if (wsRef.current) wsRef.current.close();
    };
  }, [roomId, userToken, currentTrack, isPlaying, playTrack, togglePlay]);

  const broadcastAction = (action, trackId, timestamp) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        action,
        track_id: trackId,
        timestamp
      }));
    }
  };

  return { broadcastAction, activeUsers, roomState };
}

/**
 * UI Component displaying the collaborative session.
 */
export function CollaborativeRoom({ roomId, token }) {
  const { broadcastAction, activeUsers, roomState } = useRoomSync(roomId, token);

  return (
    <div className="collaborative-room bg-slate-900 border border-slate-700 rounded-xl p-4 text-white">
      <h3 className="text-lg font-bold mb-2">Live Session: {roomId}</h3>
      <p className="text-sm text-slate-400">Listeners perfectly synced via WebSockets.</p>
      <p className="mt-2 text-xs text-slate-500">State: {roomState?.action || 'idle'} {roomState?.track_id ? `• ${roomState.track_id}` : ''}</p>
      
      <div className="mt-4 flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
        <span className="text-sm font-semibold">{activeUsers.length} Active Listeners</span>
      </div>
      
      <div className="mt-4 flex gap-4">
         <button onClick={() => broadcastAction('PLAY', 'song-123', 0)} className="bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2 rounded-lg text-sm font-bold">Sync Play</button>
         <button onClick={() => broadcastAction('PAUSE', null, 0)} className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-sm font-bold">Sync Pause</button>
      </div>
    </div>
  );
}
