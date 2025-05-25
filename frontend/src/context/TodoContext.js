import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Create context
const TodoContext = createContext();

// API base URL - use environment variable or default to localhost for development
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Initial state
const initialState = {
  todos: [],
  loading: false,
  error: null,
  editTodo: null,
  summary: null,
  summaryLoading: false,
  slackStatus: null
};

// Reducer function
const todoReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: true
      };
    case 'GET_TODOS':
      return {
        ...state,
        todos: action.payload,
        loading: false,
        error: null
      };
    case 'ADD_TODO':
      return {
        ...state,
        todos: [action.payload, ...state.todos],
        loading: false
      };
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo._id !== action.payload),
        loading: false
      };
    case 'UPDATE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo => 
          todo._id === action.payload._id ? action.payload : todo
        ),
        loading: false,
        editTodo: null
      };
    case 'SET_EDIT_TODO':
      return {
        ...state,
        editTodo: action.payload
      };
    case 'CLEAR_EDIT_TODO':
      return {
        ...state,
        editTodo: null
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'SET_SUMMARY_LOADING':
      return {
        ...state,
        summaryLoading: true,
        slackStatus: null
      };
    case 'SET_SUMMARY':
      return {
        ...state,
        summary: action.payload,
        summaryLoading: false
      };
    case 'SET_SLACK_STATUS':
      return {
        ...state,
        slackStatus: action.payload,
        summaryLoading: false
      };
    default:
      return state;
  }
};

// Create provider
export const TodoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  // Get all todos on component mount
  useEffect(() => {
    getTodos();
  }, []);

  // Get all todos
  const getTodos = async () => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const response = await axios.get(`${API_URL}/todos`);
      dispatch({
        type: 'GET_TODOS',
        payload: response.data
      });
    } catch (error) {
      console.error('Error fetching todos:', error);
      // Handle common API errors
      let errorMessage = 'Failed to fetch todos';
      
      if (error.code === 'ECONNREFUSED' || error.code === 'ECONNABORTED') {
        errorMessage = 'Server connection failed. Please check if the backend server is running.';
      } else if (error.response) {
        if (error.response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error.response.status === 404) {
          errorMessage = 'API endpoint not found. Please check server configuration.';
        }
        // Include any error message from the server if available
        errorMessage = error.response.data?.message || errorMessage;
      }
      
      dispatch({
        type: 'SET_ERROR',
        payload: errorMessage
      });
      toast.error(errorMessage);
      
      // Return empty array as fallback
      dispatch({
        type: 'GET_TODOS',
        payload: []
      });
    }
  };

  // Add todo
  const addTodo = async (todo) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const response = await axios.post(`${API_URL}/todos`, todo);
      dispatch({
        type: 'ADD_TODO',
        payload: response.data
      });
      toast.success('Todo added successfully');
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Failed to add todo'
      });
      toast.error('Failed to add todo');
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      await axios.delete(`${API_URL}/todos/${id}`);
      dispatch({
        type: 'DELETE_TODO',
        payload: id
      });
      toast.success('Todo deleted successfully');
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Failed to delete todo'
      });
      toast.error('Failed to delete todo');
    }
  };

  // Update todo
  const updateTodo = async (id, updatedTodo) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const response = await axios.put(`${API_URL}/todos/${id}`, updatedTodo);
      dispatch({
        type: 'UPDATE_TODO',
        payload: response.data
      });
      toast.success('Todo updated successfully');
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Failed to update todo'
      });
      toast.error('Failed to update todo');
    }
  };

  // Set todo to edit
  const setEditTodo = (todo) => {
    dispatch({ type: 'SET_EDIT_TODO', payload: todo });
  };

  // Clear edit todo
  const clearEditTodo = () => {
    dispatch({ type: 'CLEAR_EDIT_TODO' });
  };

  // Generate summary and send to Slack
  const generateSummary = async () => {
    dispatch({ type: 'SET_SUMMARY_LOADING' });
    try {
      const response = await axios.post(`${API_URL}/summarize`);
      
      dispatch({
        type: 'SET_SUMMARY',
        payload: response.data.summary
      });
      
      dispatch({
        type: 'SET_SLACK_STATUS',
        payload: { success: true, message: 'Summary sent to Slack successfully' }
      });
      
      toast.success('Summary sent to Slack successfully');
    } catch (error) {
      dispatch({
        type: 'SET_SUMMARY',
        payload: null
      });
      
      dispatch({
        type: 'SET_SLACK_STATUS',
        payload: { 
          success: false, 
          message: error.response?.data?.message || 'Failed to generate summary or send to Slack'
        }
      });
      
      toast.error('Failed to generate summary or send to Slack');
    }
  };

  return (
    <TodoContext.Provider
      value={{
        todos: state.todos,
        loading: state.loading,
        error: state.error,
        editTodo: state.editTodo,
        summary: state.summary,
        summaryLoading: state.summaryLoading,
        slackStatus: state.slackStatus,
        getTodos,
        addTodo,
        deleteTodo,
        updateTodo,
        setEditTodo,
        clearEditTodo,
        generateSummary
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

// Custom hook to use the todo context
export const useTodoContext = () => {
  return useContext(TodoContext);
};
