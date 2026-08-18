import React from 'react';
import TaskList from './TaskList';
import { CheckCircle2, ListTodo, Sparkles } from 'lucide-react';

const TaskSection = ({ title, count, tasks, type, onToggle, onDelete }) => {
  const isPending = type === 'pending';

  return (
    <section className={`task-section ${type}-section`}>
      <div className="section-header">
        <div className="section-title-group">
          {isPending ? (
            <ListTodo className="section-icon pending-icon" size={20} />
          ) : (
            <CheckCircle2 className="section-icon completed-icon" size={20} />
          )}
          <h2 className="section-title">{title}</h2>
        </div>
        <span className="section-count-badge">
          {count} {count === 1 ? 'task' : 'tasks'}
        </span>
      </div>

      <div className="section-divider" />

      {tasks.length > 0 ? (
        <TaskList tasks={tasks} onToggle={onToggle} onDelete={onDelete} />
      ) : (
        <div className="empty-state">
          {isPending ? (
            <div className="empty-state-card pending-empty">
              <div className="empty-emoji">🎉</div>
              <h3 className="empty-title">No pending tasks</h3>
              <p className="empty-subtitle">You're all caught up!</p>
            </div>
          ) : (
            <div className="empty-state-card completed-empty">
              <Sparkles size={28} className="empty-icon-muted" />
              <p className="empty-subtitle">No completed tasks yet.</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default TaskSection;
