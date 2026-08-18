import React, { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';

const TaskInput = ({ onAddTask, disabled }) => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError('Please enter a task title');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await onAddTask(trimmedTitle);
      setTitle('');
    } catch (err) {
      setError(err.response?.data?.title?.[0] || 'Failed to add task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  return (
    <div className="task-input-wrapper">
      <form className="task-input-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            id="new-task-input"
            type="text"
            className={`task-input ${error ? 'input-error' : ''}`}
            placeholder="Enter a new task..."
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError('');
            }}
            onKeyDown={handleKeyDown}
            disabled={disabled || isSubmitting}
            autoComplete="off"
            maxLength={255}
          />
          <button
            id="add-task-btn"
            type="submit"
            className="add-task-btn"
            disabled={disabled || isSubmitting || !title.trim()}
          >
            {isSubmitting ? (
              <Loader2 className="btn-spinner" size={18} />
            ) : (
              <Plus size={18} />
            )}
            <span>Add Task</span>
          </button>
        </div>
      </form>
      {error && <p className="input-error-msg">{error}</p>}
    </div>
  );
};

export default TaskInput;
