import React, { useState, useEffect } from 'react';
import { useTodoContext } from '../context/TodoContext';
import { FaPlus, FaEdit, FaTimes, FaClock, FaFlag } from 'react-icons/fa';

const TodoForm = () => {
  const { addTodo, editTodo, updateTodo, clearEditTodo } = useTodoContext();
  
  const [todo, setTodo] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: ''
  });

  // Set form data when editing a todo
  useEffect(() => {
    if (editTodo) {
      setTodo({
        title: editTodo.title,
        description: editTodo.description || '',
        priority: editTodo.priority || 'medium',
        dueDate: editTodo.dueDate ? new Date(editTodo.dueDate).toISOString().split('T')[0] : ''
      });
    }
  }, [editTodo]);

  const handleChange = (e) => {
    setTodo({ ...todo, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!todo.title.trim()) {
      return;
    }

    if (editTodo) {
      updateTodo(editTodo._id, todo);
    } else {
      addTodo(todo);
    }

    // Reset form
    setTodo({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: ''
    });
  };

  const handleCancel = () => {
    clearEditTodo();
    setTodo({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: ''
    });
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
    <div className="todo-form-container">
      <div className="section-title">
        <h2>
          {editTodo ? (
            <><FaEdit className="icon-margin-right" /> Edit Todo</>
          ) : (
            <><FaPlus className="icon-margin-right" /> Add New Todo</>
          )}
        </h2>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">What needs to be done?</label>
          <input
            type="text"
            id="title"
            name="title"
            className="form-control"
            value={todo.title}
            onChange={handleChange}
            placeholder="Enter task title..."
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description (optional)</label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            value={todo.description}
            onChange={handleChange}
            placeholder="Add details about this task..."
            rows="3"
          ></textarea>
        </div>
        
        <div className="form-row">
          <div className="form-group priority-group">
            <label htmlFor="priority">
              <FaFlag className="icon-margin-right" /> Priority
            </label>
            <div className="priority-selector">
              <div 
                className={`priority-option ${todo.priority === 'low' ? 'active' : ''}`}
                onClick={() => setTodo({...todo, priority: 'low'})}
              >
                <span className={getPriorityClass('low')}>Low</span>
              </div>
              <div 
                className={`priority-option ${todo.priority === 'medium' ? 'active' : ''}`}
                onClick={() => setTodo({...todo, priority: 'medium'})}
              >
                <span className={getPriorityClass('medium')}>Medium</span>
              </div>
              <div 
                className={`priority-option ${todo.priority === 'high' ? 'active' : ''}`}
                onClick={() => setTodo({...todo, priority: 'high'})}
              >
                <span className={getPriorityClass('high')}>High</span>
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="dueDate">
              <FaClock className="icon-margin-right" /> Due Date (optional)
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              className="form-control"
              value={todo.dueDate}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {editTodo ? (
              <><FaEdit /> Update Todo</>
            ) : (
              <><FaPlus /> Add Todo</>
            )}
          </button>
          
          {editTodo && (
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleCancel}
            >
              <FaTimes /> Cancel
            </button>
          )}
        </div>
      </form>
      
      <style jsx="true">{`
        .todo-form-container {
          background-color: var(--card-color);
          padding: 0;
          border-radius: var(--radius-md);
          margin-bottom: 2rem;
          box-shadow: var(--shadow-sm);
        }
        
        .form-row {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        
        .icon-margin-right {
          margin-right: 8px;
        }
        
        .priority-selector {
          display: flex;
          gap: 10px;
          margin-top: 8px;
        }
        
        .priority-option {
          flex: 1;
          padding: 8px 12px;
          text-align: center;
          border-radius: var(--radius-md);
          background-color: rgba(0, 0, 0, 0.03);
          cursor: pointer;
          transition: all var(--transition-normal);
          border: 2px solid transparent;
        }
        
        .priority-option:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }
        
        .priority-option.active {
          border-color: var(--primary-light);
          background-color: rgba(67, 97, 238, 0.1);
        }
        
        @media (min-width: 768px) {
          .form-row {
            flex-direction: row;
          }
          
          .form-row .form-group {
            flex: 1;
          }
        }
        
        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }
        
        textarea {
          resize: vertical;
        }
        
        label {
          display: flex;
          align-items: center;
          font-size: 0.95rem;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
        }
        
        input, textarea, select {
          transition: all var(--transition-normal);
        }
        
        input:focus, textarea:focus, select:focus {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.15);
        }
      `}</style>
    </div>
  );
};

export default TodoForm;
