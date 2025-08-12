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

class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

class SpeakEasyAPI {
  private baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001';
  
  async submitUrl(url: string): Promise<JobResponse> {
    const response = await fetch(`${this.baseURL}/api/generate-async`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new APIError(response.status, errorText);
    }
    
    return response.json();
  }
  
  async pollJobStatus(jobId: string): Promise<StatusResponse> {
    const response = await fetch(`${this.baseURL}/api/status/${jobId}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new APIError(response.status, errorText);
    }
    
    return response.json();
  }
  
  async getLibrary(): Promise<PodcastResponse[]> {
    const response = await fetch(`${this.baseURL}/api/library`);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new APIError(response.status, errorText);
    }
    
    return response.json();
  }
}

export const api = new SpeakEasyAPI();
export { APIError };