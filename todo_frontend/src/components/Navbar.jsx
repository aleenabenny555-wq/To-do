import React from 'react';
import { CheckSquare, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ totalTasks, completedTasks }) => {
  const { user, logout } = useAuth();
  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-icon-wrapper">
            <CheckSquare className="brand-icon" size={22} />
          </div>
          <div className="brand-text">
            <span className="brand-name">Minimalist</span>
            <span className="brand-tag">Tasks</span>
          </div>
        </div>

        <div className="navbar-right">
          {totalTasks > 0 && (
            <div className="progress-pill" title={`${completedTasks} of ${totalTasks} completed`}>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="progress-label">
                {completedTasks}/{totalTasks} Done ({percentage}%)
              </span>
            </div>
          )}

          {user && (
            <div className="user-profile-badge">
              <div className="user-avatar" title={`Logged in as ${user.username}`}>
                <UserIcon size={14} />
              </div>
              <span className="username-text">{user.username}</span>
              <button
                type="button"
                className="logout-btn"
                onClick={logout}
                title="Sign out"
                aria-label="Sign out"
              >
                <LogOut size={16} />
                <span className="logout-text">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
