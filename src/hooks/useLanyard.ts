import { useState, useEffect, useRef } from 'react';
import type { LanyardData, DiscordStatus } from '@/types/lanyard';

const DISCORD_USER_ID = '834869554798395392';
const LANYARD_WS = 'wss://api.lanyard.rest/socket';

interface UseLanyardReturn {
  data: LanyardData | null;
  loading: boolean;
  status: 'connecting' | 'connected' | 'error';
}

export function useLanyard(): UseLanyardReturn {
  const [data, setData] = useState<LanyardData | null>(null);
  const [status, setStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const socketRef = useRef<WebSocket | null>(null);
  const heartbeatIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    const connect = () => {
      setStatus('connecting');
      const ws = new WebSocket(LANYARD_WS);
      socketRef.current = ws;

      ws.onopen = () => {
        setStatus('connected');
        // Initialize with Subscribe
        ws.send(JSON.stringify({
          op: 2,
          d: { subscribe_to_id: DISCORD_USER_ID }
        }));
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        const { op, t, d } = message;

        switch (op) {
          case 0: // Dispatch
            if (t === 'INIT_STATE' || t === 'PRESENCE_UPDATE') {
              setData(d);
            }
            break;
          case 1: // Hello
            // Start heartbeat
            if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);
            heartbeatIntervalRef.current = window.setInterval(() => {
              ws.send(JSON.stringify({ op: 3 }));
            }, d.heartbeat_interval);
            break;
        }
      };

      ws.onclose = () => {
        setStatus('error');
        if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);
        // Attempt reconnect after 5s
        setTimeout(connect, 5000);
      };

      ws.onerror = () => {
        ws.close();
      };
    };

    connect();

    return () => {
      if (socketRef.current) socketRef.current.close();
      if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);
    };
  }, []);

  return { data, loading: !data, status };
}

export function getAvatarUrl(userId: string, avatarId: string | null, size: number = 256): string {
  // Fallback to default Discord avatar if avatarId is null (rare but possible)
  if (!avatarId) return `https://cdn.discordapp.com/embed/avatars/${parseInt(userId) % 5}.png`;
  
  // Handle animated avatars (gifs)
  const extension = avatarId.startsWith('a_') ? 'gif' : 'png';
  return `https://cdn.discordapp.com/avatars/${userId}/${avatarId}.${extension}?size=${size}`;
}

export function getAssetUrl(applicationId: string | undefined, assetId: string | undefined): string | null {
  if (!applicationId || !assetId) return null;

  if (assetId.startsWith('mp:')) {
    return `https://media.discordapp.net/${assetId.replace('mp:', '')}`;
  }

  return `https://cdn.discordapp.com/app-assets/${applicationId}/${assetId}.png`;
}

export function getDisplayName(discordUser: LanyardData['discord_user']): string {
  return discordUser.global_name || discordUser.display_name || discordUser.username;
}

export function getStatusColor(status: DiscordStatus): string {
  const colors: Record<DiscordStatus, string> = {
    online: '#23A559',
    idle: '#F0B232',
    dnd: '#F23F43',
    offline: '#80848E',
  };
  return colors[status];
}

export function getStatusLabel(status: DiscordStatus): string {
  const labels: Record<DiscordStatus, string> = {
    online: 'Online',
    idle: 'Idle',
    dnd: 'Do Not Disturb',
    offline: 'Offline',
  };
  return labels[status];
}
