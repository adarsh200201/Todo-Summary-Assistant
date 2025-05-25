import React from 'react';
import { useTodoContext } from '../context/TodoContext';
import { FaEdit, FaTrash, FaCheckCircle, FaRegCircle, FaClock, FaFlag, FaExclamationTriangle } from 'react-icons/fa';

const TodoItem = ({ todo }) => {
  const { deleteTodo, setEditTodo, updateTodo } = useTodoContext();

  const handleToggleComplete = () => {
    updateTodo(todo._id, { ...todo, completed: !todo.completed });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    
    // Check if due date is today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(date);
    dueDate.setHours(0, 0, 0, 0);
    
    if (dueDate.getTime() === today.getTime()) {
      return 'Today';
    }
    
    // Check if due date is tomorrow
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (dueDate.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    }
    
    // Check if due date is overdue
    if (dueDate < today) {
      return `Overdue (${date.toLocaleDateString()})`;
    }
    
    return date.toLocaleDateString();
  };
  
  // Check if todo is overdue
  const isOverdue = () => {
    if (!todo.dueDate || todo.completed) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(todo.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    return dueDate < today;
  };
  
  // Get due date class
  const getDueDateClass = () => {
    if (!todo.dueDate) return '';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(todo.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    if (dueDate < today) {
      return 'overdue';
    } else if (dueDate.getTime() === today.getTime()) {
      return 'due-today';
    }
    
    return '';
  };

  // Get priority badge styles
  const getPriorityClass = (priority) => {
    switch(priority) {
      case 'high': return 'badge badge-high';
      case 'medium': return 'badge badge-medium';
      case 'low': return 'badge badge-low';
      default: return 'badge badge-medium';
    }
  };
  
  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''} ${isOverdue() ? 'overdue' : ''}`}>
      <div className="todo-checkbox" onClick={handleToggleComplete}>
        {todo.completed ? 
          <FaCheckCircle className="check-icon completed" /> : 
          <FaRegCircle className="check-icon" />
        }
      </div>
      
      <div className="todo-text">
        <h3 className={todo.completed ? 'todo-completed' : ''}>
          {todo.title}
        </h3>
        {todo.description && (
          <p className={`todo-description ${todo.completed ? 'todo-completed' : ''}`}>
            {todo.description}
          </p>
        )}
        <div className="todo-meta">
          {todo.priority && (
            <span className={`${getPriorityClass(todo.priority)}`}>
              <FaFlag className="meta-icon" /> {todo.priority}
            </span>
          )}
          {todo.dueDate && (
            <span className={`due-date ${isOverdue() ? 'overdue-text' : ''}`}>
              {isOverdue() ? <FaExclamationTriangle /> : <FaClock />} {formatDate(todo.dueDate)}
            </span>
          )}
          <span className="created-date">
            Added: {new Date(todo.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      
      <div className="todo-actions">
        <button
          className="icon-btn edit"
          onClick={() => setEditTodo(todo)}
          title="Edit"
        >
          <FaEdit />
        </button>
        
        <button
          className="icon-btn delete"
          onClick={() => deleteTodo(todo._id)}
          title="Delete"
        >
          <FaTrash />
        </button>
      </div>
      
      <style jsx="true">{`
        .todo-item {
          position: relative;
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 1rem;
          align-items: flex-start;
        }
        
        .todo-checkbox {
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          padding-top: 0.25rem;
        }
        
        .check-icon {
          font-size: 1.4rem;
          color: var(--text-secondary);
          transition: all var(--transition-normal);
        }
        
        .check-icon:hover {
          color: var(--primary-color);
          transform: scale(1.1);
        }
        
        .check-icon.completed {
          color: var(--success-color);
        }
        
        .todo-description {
          margin-top: 0.25rem;
          color: var(--text-secondary);
          font-size: 0.95rem;
        }
        
        .todo-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-top: 0.75rem;
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
        
        .meta-icon {
          font-size: 0.7rem;
          margin-right: 4px;
          vertical-align: middle;
        }
        
        .badge {
          display: inline-flex;
          align-items: center;
        }
        
        .due-date.overdue {
          color: var(--danger-color);
          font-weight: 500;
        }
        
        .due-date.due-today {
          color: var(--warning-color);
          font-weight: 500;
        }
        
        .created-date {
          opacity: 0.7;
          font-size: 0.75rem;
        }
        
        @media (max-width: 576px) {
          .todo-meta {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default TodoItem;
