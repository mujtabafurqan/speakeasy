export interface JobResponse {
  job_id: string;
  status: string;
  audio_url?: string;
}

export interface StatusResponse {
  status: string;
  audio_url?: string;
  error_message?: string;
  created_at?: string;
  started_at?: string;
  completed_at?: string;
}

export interface PodcastResponse {
  id: string;
  url: string;
  title: string;
  audio_url?: string;
  status: string;
  created_at: string;
  duration: number;
}

export type JobStatus = 'idle' | 'pending' | 'processing' | 'completed' | 'failed' | 'error';