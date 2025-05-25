import React from 'react';
import './App.css';
import Header from './components/Header';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import SummarySection from './components/SummarySection';
import { useTodoContext } from './context/TodoContext';
import { FaSpinner } from 'react-icons/fa';

function App() {
  const { loading } = useTodoContext();

  return (
    <div className="app py-4">
      <div className="container">
        <Header />
        
        <div className="main-content">
          <div className="todos-section card p-4 mb-4">
            <TodoForm />
            {loading ? (
              <div className="d-flex justify-center align-center py-5">
                <div className="loader"></div>
                <span className="ml-3">Loading your todos...</span>
              </div>
            ) : (
              <TodoList />
            )}
          </div>
          
          <div className="card p-4">
            <SummarySection />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
