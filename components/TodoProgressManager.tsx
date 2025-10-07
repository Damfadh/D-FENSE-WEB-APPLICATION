import { useState, useEffect } from 'react';

export interface TodoProgress {
  programId: string;
  userId: string;
  startDate: string;
  riskLevel: 'low' | 'medium' | 'high';
  location: 'urban' | 'rural';
  dailyProgress: {
    [day: number]: {
      [taskIndex: number]: boolean;
    };
  };
  completed: boolean;
  completionDate?: string;
}

export function useTodoProgress(riskLevel: 'low' | 'medium' | 'high', location: 'urban' | 'rural') {
  const [progress, setProgress] = useState<TodoProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const programId = `program_${today}_${riskLevel}_${location}`;
    const storageKey = `dfense_todo_progress_current`;
    
    // Load existing progress from localStorage
    const savedProgress = localStorage.getItem(storageKey);
    
    if (savedProgress) {
      const parsedProgress = JSON.parse(savedProgress);
      // Check if it's the same program (same date, risk level, location)
      if (parsedProgress.programId === programId) {
        setProgress(parsedProgress);
      } else {
        // Create new progress tracking for different parameters
        const newProgress: TodoProgress = {
          programId,
          userId: 'guest_user',
          startDate: today,
          riskLevel,
          location,
          dailyProgress: {
            1: {},
            2: {},
            3: {}
          },
          completed: false
        };
        setProgress(newProgress);
        localStorage.setItem(storageKey, JSON.stringify(newProgress));
      }
    } else {
      // Create new progress tracking
      const newProgress: TodoProgress = {
        programId,
        userId: 'guest_user',
        startDate: today,
        riskLevel,
        location,
        dailyProgress: {
          1: {},
          2: {},
          3: {}
        },
        completed: false
      };
      setProgress(newProgress);
      localStorage.setItem(storageKey, JSON.stringify(newProgress));
    }
    
    setLoading(false);
  }, [riskLevel, location]);

  const updateTaskCompletion = (day: number, taskIndex: number, completed: boolean) => {
    if (!progress) return;

    const updatedProgress = {
      ...progress,
      dailyProgress: {
        ...progress.dailyProgress,
        [day]: {
          ...progress.dailyProgress[day],
          [taskIndex]: completed
        }
      }
    };

    // Check if program is completed (all tasks for all days)
    const totalTasks = 7; // Each day has 7 tasks
    let completedTasks = 0;
    
    for (let d = 1; d <= 3; d++) {
      const dayProgress = updatedProgress.dailyProgress[d];
      for (let t = 0; t < totalTasks; t++) {
        if (dayProgress[t]) completedTasks++;
      }
    }

    if (completedTasks === totalTasks * 3) {
      updatedProgress.completed = true;
      updatedProgress.completionDate = new Date().toISOString().split('T')[0];
    }

    setProgress(updatedProgress);
    
    // Save to localStorage
    const storageKey = `dfense_todo_progress_current`;
    localStorage.setItem(storageKey, JSON.stringify(updatedProgress));

    // Also save to a general progress history
    saveToProgressHistory(updatedProgress);
  };

  const saveToProgressHistory = (currentProgress: TodoProgress) => {
    const historyKey = `dfense_progress_history_guest`;
    const existingHistory = localStorage.getItem(historyKey);
    
    let history: TodoProgress[] = [];
    if (existingHistory) {
      history = JSON.parse(existingHistory);
    }

    // Update or add current progress
    const existingIndex = history.findIndex(h => h.programId === currentProgress.programId);
    if (existingIndex >= 0) {
      history[existingIndex] = currentProgress;
    } else {
      history.push(currentProgress);
    }

    localStorage.setItem(historyKey, JSON.stringify(history));
  };

  const getTaskCompletion = (day: number, taskIndex: number): boolean => {
    return progress?.dailyProgress[day]?.[taskIndex] || false;
  };

  const getDayProgress = (day: number): { completed: number; total: number; percentage: number } => {
    if (!progress) return { completed: 0, total: 7, percentage: 0 };
    
    const dayTasks = progress.dailyProgress[day] || {};
    const completed = Object.values(dayTasks).filter(Boolean).length;
    const total = 7; // Each day has 7 tasks
    const percentage = Math.round((completed / total) * 100);
    
    return { completed, total, percentage };
  };

  const getOverallProgress = (): { completed: number; total: number; percentage: number } => {
    if (!progress) return { completed: 0, total: 21, percentage: 0 };
    
    let totalCompleted = 0;
    for (let day = 1; day <= 3; day++) {
      totalCompleted += getDayProgress(day).completed;
    }
    
    const total = 21; // 7 tasks × 3 days
    const percentage = Math.round((totalCompleted / total) * 100);
    
    return { completed: totalCompleted, total, percentage };
  };

  return {
    progress,
    loading,
    updateTaskCompletion,
    getTaskCompletion,
    getDayProgress,
    getOverallProgress
  };
}