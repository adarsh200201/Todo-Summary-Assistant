import React from 'react';
import { FaTasks, FaRobot, FaSlack } from 'react-icons/fa';

const Header = () => {
  return (
    <header className="header mb-5">
      <div className="logo-container d-flex align-center justify-center mb-2">
        <div className="logo-icon">
          <FaTasks />
        </div>
      </div>
      
      <h1 className="text-center mb-2">
        <span className="gradient-text">Todo</span> Summary Assistant
      </h1>
      
      <p className="subtitle text-center mb-4">
        Manage your tasks and get AI-powered summaries
      </p>
      
      <div className="features-container d-flex justify-center mb-3">
        <div className="feature-item">
          <div className="feature-icon">
            <FaTasks />
          </div>
          <p>Organize Tasks</p>
        </div>
        
        <div className="feature-item">
          <div className="feature-icon">
            <FaRobot />
          </div>
          <p>AI Summaries</p>
        </div>
        
        <div className="feature-item">
          <div className="feature-icon">
            <FaSlack />
          </div>
          <p>Slack Integration</p>
        </div>
      </div>
      
      <style jsx="true">{`
        .header {
          text-align: center;
          margin-bottom: 2.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--border-color);
        }
        
        .logo-container {
          margin-bottom: 1rem;
        }
        
        .logo-icon {
          font-size: 2.5rem;
          color: var(--primary-color);
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.5rem;
        }
        
        .header h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          font-weight: 700;
        }
        
        .gradient-text {
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .subtitle {
          color: var(--text-secondary);
          font-size: 1.1rem;
          max-width: 500px;
          margin: 0 auto 1.5rem;
        }
        
        .features-container {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 1.5rem;
        }
        
        .feature-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        
        .feature-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: rgba(67, 97, 238, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary-color);
          font-size: 1.2rem;
          margin-bottom: 0.25rem;
        }
        
        .feature-item p {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-secondary);
          margin: 0;
        }
        
        @media (max-width: 576px) {
          .features-container {
            gap: 1rem;
          }
          
          .header h1 {
            font-size: 2rem;
          }
          
          .subtitle {
            font-size: 0.95rem;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
