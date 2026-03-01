export interface DiscordUser {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  bot: boolean;
  clan: string | null;
  global_name: string | null;
  avatar_decoration_data: null;
  display_name: string;
  public_flags: number;
}

export interface SpotifyData {
  track_id: string;
  timestamps: {
    start: number;
    end: number;
  };
  album: string;
  album_art_url: string;
  artist: string;
  song: string;
}

export interface Activity {
  id: string;
  name: string;
  type: number;
  timestamps?: {
    start: number;
    end?: number;
  };
  created_at: number;
  details?: string;
  state?: string;
  assets?: {
    large_text?: string;
    large_image?: string;
    small_text?: string;
    small_image?: string;
  };
  party?: {
    id?: string;
  };
  application_id?: string;
  sync_id?: string;
  flags?: number;
}

export interface LanyardData {
  spotify: SpotifyData | null;
  discord_user: DiscordUser;
  discord_status: 'online' | 'idle' | 'dnd' | 'offline';
  activities: Activity[];
  listening_to_spotify: boolean;
  active_on_discord_web: boolean;
  active_on_discord_desktop: boolean;
  active_on_discord_mobile: boolean;
}

export interface LanyardResponse {
  success: boolean;
  data: LanyardData;
}

export type DiscordStatus = 'online' | 'idle' | 'dnd' | 'offline';

export const statusColors: Record<DiscordStatus, string> = {
  online: '#23A559',
  idle: '#F0B232',
  dnd: '#F23F43',
  offline: '#80848E',
};

export const statusLabels: Record<DiscordStatus, string> = {
  online: 'Online',
  idle: 'Idle',
  dnd: 'Do Not Disturb',
  offline: 'Offline',
};
