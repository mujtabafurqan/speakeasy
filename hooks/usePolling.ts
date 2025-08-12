import { useState, useEffect } from 'react';
import { api, StatusResponse, JobStatus } from '@/lib/api';

export function useJobPolling(jobId: string | null) {
  const [status, setStatus] = useState<JobStatus>('idle');
  const [result, setResult] = useState<StatusResponse | null>(null);
  
  useEffect(() => {
    if (!jobId) return;
    
    setStatus('pending');
    
    const pollInterval = setInterval(async () => {
      try {
        const response = await api.pollJobStatus(jobId);
        setResult(response);
        setStatus(response.status as JobStatus);
        
        if (['completed', 'failed'].includes(response.status)) {
          clearInterval(pollInterval);
        }
      } catch (error) {
        console.error('Polling error:', error);
        setStatus('error');
        clearInterval(pollInterval);
      }
    }, 5000); // Poll every 5 seconds
    
    return () => clearInterval(pollInterval);
  }, [jobId]);
  
  return { status, result };
}