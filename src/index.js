const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory storage for todos
let todos = [];
let nextId = 1;

app.get('/', (req, res) => {
    res.json({ status: "ok" });
});

app.get('/health', (req, res) => {
    res.json({ status: "healthy" });
});

// GET all todos
app.get('/api/todos', (req, res) => {
    res.json(todos);
});

// GET a single todo by ID
app.get('/api/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const todo = todos.find(t => t.id === id);
    
    if (!todo) {
        return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json(todo);
});

// POST - Create a new todo
app.post('/api/todos', (req, res) => {
    const { title, completed } = req.body;
    
    // Validation
    if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ error: 'Title is required and must be a non-empty string' });
    }
    
    const newTodo = {
        id: nextId++,
        title: title.trim(),
        completed: completed || false
    };
    
    todos.push(newTodo);
    res.status(201).json(newTodo);
});

// PUT - Update a todo
app.put('/api/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { title, completed } = req.body;
    const todoIndex = todos.findIndex(t => t.id === id);
    
    if (todoIndex === -1) {
        return res.status(404).json({ error: 'Todo not found' });
    }
    
    // Validation
    if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
        return res.status(400).json({ error: 'Title must be a non-empty string' });
    }
    
    // Update todo
    if (title !== undefined) {
        todos[todoIndex].title = title.trim();
    }
    if (completed !== undefined) {
        todos[todoIndex].completed = completed;
    }
    
    res.json(todos[todoIndex]);
});

// DELETE a todo
app.delete('/api/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const todoIndex = todos.findIndex(t => t.id === id);
    
    if (todoIndex === -1) {
        return res.status(404).json({ error: 'Todo not found' });
    }
    
    const deletedTodo = todos.splice(todoIndex, 1)[0];
    res.json(deletedTodo);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});