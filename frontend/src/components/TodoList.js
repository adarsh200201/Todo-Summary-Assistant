import React, { useState, useEffect } from 'react';
import { useTodoContext } from '../context/TodoContext';
import TodoItem from './TodoItem';
import { FaTasks, FaFilter, FaSort, FaChevronDown } from 'react-icons/fa';

const TodoList = () => {
  const { todos } = useTodoContext();
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [filter, setFilter] = useState('all'); // all, active, completed
  const [sortBy, setSortBy] = useState('date-desc'); // date-desc, date-asc, priority
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Apply filters and sorting whenever todos, filter, or sortBy changes
  useEffect(() => {
    let result = [...todos];
    
    // Apply filter
    if (filter === 'active') {
      result = result.filter(todo => !todo.completed);
    } else if (filter === 'completed') {
      result = result.filter(todo => todo.completed);
    }
    
    // Apply sorting
    if (sortBy === 'date-desc') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'date-asc') {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === 'priority') {
      const priorityValues = { 'high': 3, 'medium': 2, 'low': 1 };
      result.sort((a, b) => priorityValues[b.priority] - priorityValues[a.priority]);
    } else if (sortBy === 'due-date') {
      result.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    }
    
    setFilteredTodos(result);
  }, [todos, filter, sortBy]);

  // Get counts
  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;

  if (todos.length === 0) {
    return (
      <div className="todo-list-empty card">
        <div className="empty-state">
          <div className="empty-icon">
            <FaTasks />
          </div>
          <h3>No todos yet</h3>
          <p>Add a new todo to get started!</p>
        </div>
        <style jsx="true">{`
          .todo-list-empty {
            text-align: center;
            padding: 3rem 2rem;
            border-radius: var(--radius-md);
            color: var(--text-secondary);
          }
          
          .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }
          
          .empty-icon {
            font-size: 3rem;
            color: var(--border-color);
            margin-bottom: 1rem;
          }
          
          h3 {
            color: var(--text-primary);
            margin-bottom: 0.5rem;
          }
          
          p {
            color: var(--text-secondary);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="todo-list">
      <div className="section-title">
        <h2>
          <FaTasks className="icon-margin-right" /> Your Todos
          <span className="todo-count">{todos.length}</span>
        </h2>
        
        <div className="list-actions">
          <div className="dropdown">
            <button 
              className="btn btn-outline"
              onClick={() => {
                setShowFilterMenu(!showFilterMenu);
                setShowSortMenu(false);
              }}
            >
              <FaFilter /> Filter <FaChevronDown className="small-icon" />
            </button>
            {showFilterMenu && (
              <div className="dropdown-menu">
                <button 
                  className={`dropdown-item ${filter === 'all' ? 'active' : ''}`}
                  onClick={() => setFilter('all')}
                >
                  All <span className="badge">{todos.length}</span>
                </button>
                <button 
                  className={`dropdown-item ${filter === 'active' ? 'active' : ''}`}
                  onClick={() => setFilter('active')}
                >
                  Active <span className="badge">{activeCount}</span>
                </button>
                <button 
                  className={`dropdown-item ${filter === 'completed' ? 'active' : ''}`}
                  onClick={() => setFilter('completed')}
                >
                  Completed <span className="badge">{completedCount}</span>
                </button>
              </div>
            )}
          </div>
          
          <div className="dropdown">
            <button 
              className="btn btn-outline"
              onClick={() => {
                setShowSortMenu(!showSortMenu);
                setShowFilterMenu(false);
              }}
            >
              <FaSort /> Sort <FaChevronDown className="small-icon" />
            </button>
            {showSortMenu && (
              <div className="dropdown-menu">
                <button 
                  className={`dropdown-item ${sortBy === 'date-desc' ? 'active' : ''}`}
                  onClick={() => setSortBy('date-desc')}
                >
                  Newest First
                </button>
                <button 
                  className={`dropdown-item ${sortBy === 'date-asc' ? 'active' : ''}`}
                  onClick={() => setSortBy('date-asc')}
                >
                  Oldest First
                </button>
                <button 
                  className={`dropdown-item ${sortBy === 'priority' ? 'active' : ''}`}
                  onClick={() => setSortBy('priority')}
                >
                  Priority
                </button>
                <button 
                  className={`dropdown-item ${sortBy === 'due-date' ? 'active' : ''}`}
                  onClick={() => setSortBy('due-date')}
                >
                  Due Date
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="todo-items-container">
        {filteredTodos.map(todo => (
          <TodoItem key={todo._id} todo={todo} />
        ))}
        
        {filteredTodos.length === 0 && (
          <div className="no-match-message">
            <p>No todos match your current filter.</p>
          </div>
        )}
      </div>
      
      <style jsx="true">{`
        .todo-list {
          margin-top: 2rem;
        }
        
        .icon-margin-right {
          margin-right: 8px;
        }
        
        .todo-count {
          background-color: var(--primary-color);
          color: white;
          font-size: 0.75rem;
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-full);
          margin-left: 0.5rem;
          vertical-align: middle;
        }
        
        .list-actions {
          display: flex;
          gap: 0.5rem;
        }
        
        .dropdown {
          position: relative;
        }
        
        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          z-index: 10;
          margin-top: 0.25rem;
          background-color: var(--card-color);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-md);
          min-width: 180px;
          overflow: hidden;
        }
        
        .dropdown-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          cursor: pointer;
          transition: all var(--transition-fast);
          color: var(--text-primary);
        }
        
        .dropdown-item:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }
        
        .dropdown-item.active {
          background-color: rgba(67, 97, 238, 0.1);
          color: var(--primary-color);
          font-weight: 500;
        }
        
        .small-icon {
          font-size: 0.7rem;
          margin-left: 0.25rem;
        }
        
        .no-match-message {
          text-align: center;
          padding: 2rem;
          color: var(--text-secondary);
          font-style: italic;
        }
        
        .todo-items-container {
          margin-top: 1rem;
        }
        
        @media (max-width: 576px) {
          .section-title {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          
          .list-actions {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
};

export default TodoList;
