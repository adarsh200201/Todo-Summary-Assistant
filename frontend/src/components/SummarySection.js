import React from 'react';
import { useTodoContext } from '../context/TodoContext';
import { FaRobot, FaSlack, FaBrain, FaExclamationTriangle, FaCheckCircle, FaCalendarAlt } from 'react-icons/fa';

const SummarySection = () => {
  const { todos, summary, generateSummary, summaryLoading, slackStatus } = useTodoContext();
  
  const pendingTodos = todos.filter(todo => !todo.completed);
  const highPriorityCount = pendingTodos.filter(todo => todo.priority === 'high').length;

  const handleGenerateSummary = () => {
    generateSummary();
  };
  
  // Get today's date
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="summary-section">
      <div className="section-title">
        <h2>
          <FaBrain className="icon-margin-right" /> AI Summary
        </h2>
      </div>
      
      <div className="date-display">
        <FaCalendarAlt className="icon-margin-right" /> {formattedDate}
      </div>
      
      <div className="summary-container">
        <div className="info-card">
          <p className="summary-info">
            Get an AI-powered summary of your pending tasks and share it directly to Slack.
          </p>
          
          <div className="summary-stats">
            <div className="stat-item">
              <div className="stat-value">{pendingTodos.length}</div>
              <div className="stat-label">Pending Tasks</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{highPriorityCount}</div>
              <div className="stat-label">High Priority</div>
            </div>
          </div>
        </div>
        
        {pendingTodos.length === 0 ? (
          <div className="summary-placeholder">
            <FaExclamationTriangle className="empty-icon" />
            <p>No pending todos to summarize.</p>
            <p>Add some todos to get started!</p>
          </div>
        ) : (
          <>
            <button 
              className="btn btn-primary generate-btn"
              onClick={handleGenerateSummary}
              disabled={summaryLoading || pendingTodos.length === 0}
            >
              {summaryLoading ? (
                <>
                  <div className="loader"></div> Generating Summary...
                </>
              ) : (
                <>
                  <FaRobot /> Generate & Send to <FaSlack />
                </>
              )}
            </button>
            
            {summary && (
              <div className="summary-result">
                <div className="summary-header">
                  <div className="summary-icon">
                    {summary.includes('API quota exceeded') ? (
                      <FaExclamationTriangle className="warning-icon" />
                    ) : (
                      <FaRobot />
                    )}
                  </div>
                  <h3>
                    {summary.includes('API quota exceeded') ? 'Fallback Summary' : 'AI Summary'}
                    {summary.includes('API quota exceeded') && (
                      <span className="fallback-badge">Fallback</span>
                    )}
                  </h3>
                </div>
                <div className="summary-text">
                  {summary.includes('API quota exceeded') && (
                    <div className="fallback-notice">
                      <p><strong>Note:</strong> OpenAI API quota exceeded. Using fallback summary generator.</p>
                    </div>
                  )}
                  {summary.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </div>
            )}
            
            {slackStatus && (
              <div className={`notification ${slackStatus.success ? 'success' : 'error'}`}>
                {slackStatus.success ? (
                  <FaCheckCircle className="notification-icon" />
                ) : (
                  <FaExclamationTriangle className="notification-icon" />
                )}
                <span>{slackStatus.message}</span>
              </div>
            )}
          </>
        )}
      </div>
      
      <style jsx="true">{`
        .summary-section {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        
        .summary-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          flex: 1;
        }
        
        .icon-margin-right {
          margin-right: 8px;
        }
        
        .date-display {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
        }
        
        .info-card {
          background-color: rgba(67, 97, 238, 0.05);
          border-radius: var(--radius-md);
          padding: 1.25rem;
          border-left: 3px solid var(--primary-color);
        }
        
        .summary-info {
          font-size: 0.95rem;
          color: var(--text-primary);
          margin-bottom: 1rem;
        }
        
        .summary-stats {
          display: flex;
          gap: 1.5rem;
          margin-top: 1rem;
        }
        
        .stat-item {
          text-align: center;
          flex: 1;
        }
        
        .stat-value {
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--primary-color);
        }
        
        .stat-label {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-top: 0.25rem;
        }
        
        .generate-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          justify-content: center;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          margin: 0.5rem 0;
          transition: all var(--transition-normal);
        }
        
        .generate-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        
        .generate-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .summary-result {
          background-color: var(--card-color);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
          overflow: hidden;
          margin-top: 0.5rem;
        }
        
        .summary-header {
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .summary-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1rem;
        }
        
        .summary-header h3 {
          margin: 0;
          font-size: 1.1rem;
          color: var(--text-primary);
        }
        
        .summary-content {
          padding: 1.25rem;
          line-height: 1.6;
          font-size: 0.95rem;
          background-color: transparent;
          border-left: none;
        }
        
        .summary-placeholder {
          text-align: center;
          padding: 2.5rem 1.5rem;
          color: var(--text-secondary);
          background-color: rgba(0, 0, 0, 0.02);
          border-radius: var(--radius-md);
          border: 1px dashed var(--border-color);
        }
        
        .empty-icon {
          font-size: 2rem;
          color: var(--warning-color);
          margin-bottom: 1rem;
          opacity: 0.5;
        }
        
        .notification {
          display: flex;
          align-items: center;
        }
        
        .notification-icon {
          font-size: 1.2rem;
          margin-right: 0.75rem;
        }
      `}</style>
    </div>
  );
};

export default SummarySection;
