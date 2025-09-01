
'use client';

import { useState, useEffect } from 'react';

// Placeholder hook for fetching job list
export function useJobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setJobs([]);
      setLoading(false);
    }, 1000);
  }, []);

  return { jobs, loading };
}
