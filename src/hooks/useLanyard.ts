import { useState, useEffect, useCallback } from 'react';
import type { LanyardData, LanyardResponse, DiscordStatus } from '@/types/lanyard';

const DISCORD_USER_ID = '834869554798395392';
const LANYARD_API_URL = `https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`;

interface UseLanyardReturn {
  data: LanyardData | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useLanyard(): UseLanyardReturn {
  const [data, setData] = useState<LanyardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(LANYARD_API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result: LanyardResponse = await response.json();
      if (result.success) {
        setData(result.data);
      } else {
        throw new Error('API returned unsuccessful response');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    
    // Poll every 30 seconds for updates
    const interval = setInterval(fetchData, 30000);
    
    return () => clearInterval(interval);
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function getAvatarUrl(userId: string, avatarId: string, size: number = 256): string {
  return `https://cdn.discordapp.com/avatars/${userId}/${avatarId}.png?size=${size}`;
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
