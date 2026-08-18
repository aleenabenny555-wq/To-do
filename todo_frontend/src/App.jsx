import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from './context/AuthContext';
import { taskService } from './services/api';
import Navbar from './components/Navbar';
import TaskInput from './components/TaskInput';
import TaskSection from './components/TaskSection';
import AuthModal from './components/AuthModal';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

function App() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch tasks from Django backend API
  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      setError('');
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (err) {
      console.error('Failed to load tasks:', err);
      setError('Could not connect to Django server. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    } else {
      setTasks([]);
    }
  }, [isAuthenticated, fetchTasks]);

  // Handler: Add a new task
  const handleAddTask = async (title) => {
    try {
      const newTask = await taskService.createTask(title);
      // Prepend to tasks list
      setTasks((prevTasks) => [newTask, ...prevTasks]);
    } catch (err) {
      console.error('Failed to create task:', err);
      throw err;
    }
  };

  // Handler: Toggle completion (Pending <-> Completed)
  const handleToggleTask = async (taskToToggle) => {
    const updatedStatus = !taskToToggle.is_completed;
    
    // Optimistic UI update
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === taskToToggle.id ? { ...t, is_completed: updatedStatus } : t
      )
    );

    try {
      const updatedTask = await taskService.updateTask(taskToToggle.id, {
        is_completed: updatedStatus,
      });
      // Synchronize with server response
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
      );
    } catch (err) {
      console.error('Failed to toggle task status:', err);
      // Revert optimistic update
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === taskToToggle.id ? { ...t, is_completed: taskToToggle.is_completed } : t
        )
      );
      setError('Failed to update task status.');
    }
  };

  // Handler: Delete task
  const handleDeleteTask = async (taskId) => {
    // Keep snapshot for potential rollback
    const originalTasks = [...tasks];
    
    // Optimistic deletion
    setTasks((prevTasks) => prevTasks.filter((t) => t.id !== taskId));

    try {
      await taskService.deleteTask(taskId);
    } catch (err) {
      console.error('Failed to delete task:', err);
      // Revert if error occurs
      setTasks(originalTasks);
      setError('Failed to delete task.');
    }
  };

  if (authLoading) {
    return (
      <div className="fullscreen-loader">
        <Loader2 className="spinner" size={36} />
        <p>Loading Minimalist Tasks...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthModal />;
  }

  const pendingTasks = tasks.filter((t) => !t.is_completed);
  const completedTasks = tasks.filter((t) => t.is_completed);

  return (
    <div className="app-container">
      <Navbar
        totalTasks={tasks.length}
        completedTasks={completedTasks.length}
      />

      <main className="main-content">
        <div className="dashboard-card">
          {/* Header Section */}
          <header className="dashboard-header">
            <h1 className="dashboard-title">My Tasks</h1>
            <p className="dashboard-subtitle">
              Stay organized and get things done.
            </p>

            {/* Task Creation Input */}
            <TaskInput onAddTask={handleAddTask} disabled={loading} />
          </header>

          {/* Error Banner */}
          {error && (
            <div className="error-banner">
              <AlertCircle size={18} />
              <span>{error}</span>
              <button
                type="button"
                className="retry-btn"
                onClick={fetchTasks}
                title="Retry connection"
              >
                <RefreshCw size={14} />
                <span>Retry</span>
              </button>
            </div>
          )}

          {/* Main Task Sections */}
          {loading && tasks.length === 0 ? (
            <div className="tasks-loading-state">
              <Loader2 className="spinner" size={28} />
              <p>Fetching your tasks from Django database...</p>
            </div>
          ) : (
            <div className="task-sections-container">
              {/* Pending Tasks Section */}
              <TaskSection
                title="Pending Tasks"
                count={pendingTasks.length}
                tasks={pendingTasks}
                type="pending"
                onToggle={handleToggleTask}
                onDelete={handleDeleteTask}
              />

              {/* Completed Section */}
              <TaskSection
                title="Completed"
                count={completedTasks.length}
                tasks={completedTasks}
                type="completed"
                onToggle={handleToggleTask}
                onDelete={handleDeleteTask}
              />
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>
          Minimalist Tasks &bull; Django REST Framework + React &bull; Secure User Isolation
        </p>
      </footer>
    </div>
  );
}

export default App;
