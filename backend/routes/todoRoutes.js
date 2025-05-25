const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

// GET all todos
router.get('/', async (req, res) => {
  try {
    console.log('GET /todos request received');
    const todos = await Todo.find().sort({ createdAt: -1 });
    console.log(`Found ${todos.length} todos`);
    return res.json(todos);
  } catch (err) {
    console.error('Error fetching todos:', err);
    return res.status(500).json({ 
      message: err.message,
      error: true,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack 
    });
  }
});

// GET a single todo
router.get('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE a todo
router.post('/', async (req, res) => {
  try {
    console.log('POST /todos request received:', req.body);
    const todo = new Todo({
      title: req.body.title,
      description: req.body.description,
      completed: req.body.completed,
      priority: req.body.priority,
      dueDate: req.body.dueDate
    });

    const newTodo = await todo.save();
    console.log('Todo created successfully:', newTodo._id);
    return res.status(201).json(newTodo);
  } catch (err) {
    console.error('Error creating todo:', err);
    return res.status(400).json({ 
      message: err.message,
      error: true,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack 
    });
  }
});

// UPDATE a todo
router.put('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    if (req.body.title !== undefined) todo.title = req.body.title;
    if (req.body.description !== undefined) todo.description = req.body.description;
    if (req.body.completed !== undefined) todo.completed = req.body.completed;
    if (req.body.priority !== undefined) todo.priority = req.body.priority;
    if (req.body.dueDate !== undefined) todo.dueDate = req.body.dueDate;

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a todo
router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Todo deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
