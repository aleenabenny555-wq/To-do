import React, { useState } from 'react';
import { Check, Trash2, Loader2, Clock } from 'lucide-react';

const TaskItem = ({ task, onToggle, onDelete }) => {
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggle = async () => {
    if (isToggling || isDeleting) return;
    try {
      setIsToggling(true);
      await onToggle(task);
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (isDeleting || isToggling) return;
    try {
      setIsDeleting(true);
      await onDelete(task.id);
    } finally {
      setIsDeleting(false);
    }
  };

  // Format relative or readable time
  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      id={`task-item-${task.id}`}
      className={`task-item ${task.is_completed ? 'completed' : 'pending'} ${
        isDeleting ? 'deleting' : ''
      }`}
    >
      <button
        type="button"
        className={`task-checkbox ${task.is_completed ? 'checked' : ''}`}
        onClick={handleToggle}
        disabled={isToggling || isDeleting}
        aria-label={task.is_completed ? 'Mark as incomplete' : 'Mark as completed'}
        id={`toggle-task-${task.id}`}
      >
        {isToggling ? (
          <Loader2 size={14} className="spinner" />
        ) : task.is_completed ? (
          <Check size={14} strokeWidth={3} />
        ) : null}
      </button>

      <div className="task-content" onClick={handleToggle}>
        <span className="task-title">{task.title}</span>
        {task.created_at && (
          <span className="task-meta">
            <Clock size={12} />
            <span>{formatTime(task.created_at)}</span>
          </span>
        )}
      </div>

      <button
        type="button"
        className="delete-task-btn"
        onClick={handleDelete}
        disabled={isDeleting || isToggling}
        aria-label="Delete task"
        title="Delete task"
        id={`delete-task-${task.id}`}
      >
        {isDeleting ? (
          <Loader2 size={16} className="spinner" />
        ) : (
          <Trash2 size={16} />
        )}
      </button>
    </div>
  );
};

export default TaskItem;
