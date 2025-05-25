import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './theme.css';
import App from './App';
import { TodoProvider } from './context/TodoContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TodoProvider>
      <App />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </TodoProvider>
  </React.StrictMode>
);
