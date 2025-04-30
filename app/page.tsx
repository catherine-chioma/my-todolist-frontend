'use client';

import { useState, useEffect } from 'react';
import axios from 'axios'; // You can also use fetch if you prefer

interface Todo {
  id: number;
  text: string;
  isEditing: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');

  // Fetch todos from the backend on initial load
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/todos');
        const fetchedTodos = response.data; // Assuming the data is in an array of todos
        setTodos(fetchedTodos);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    fetchTodos();
  }, []); // Empty dependency array means this runs once when the component mounts

  const addTodo = async () => {
    if (!newTodo.trim()) return;

    const newTask: Todo = {
      id: Date.now(), // Temporary ID, your backend will assign its own ID
      text: newTodo.trim(),
      isEditing: false,
    };

    try {
      // Post the new todo to the backend
      const response = await axios.post('http://localhost:5000/api/todos', {
        title: newTask.text,
        completed: false,
      });
      // Add the new todo to the local state if successful
      setTodos([response.data, ...todos]);
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`);
      // Remove the deleted todo from local state
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const startEditing = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, isEditing: true } : todo
    ));
  };

  const cancelEditing = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, isEditing: false } : todo
    ));
  };

  const updateTodo = async (id: number, newText: string) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/todos/${id}`, {
        title: newText,
        completed: false, // Adjust if you want to update completion status as well
      });

      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, text: newText, isEditing: false } : todo
      ));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">My To-Do List</h1>
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Enter a task..."
          className="p-2 border rounded w-64"
        />
        <button onClick={addTodo} className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600">
          Add
        </button>
      </div>
      <ul className="w-full max-w-md space-y-2">
        {todos.map(todo => (
          <li key={todo.id} className="bg-white p-3 rounded shadow flex justify-between items-center">
            {todo.isEditing ? (
              <>
                <input
                  type="text"
                  defaultValue={todo.text}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') updateTodo(todo.id, (e.target as HTMLInputElement).value);
                    if (e.key === 'Escape') cancelEditing(todo.id);
                  }}
                  className="border rounded px-2 py-1 w-full mr-2"
                />
                <button onClick={() => cancelEditing(todo.id)} className="text-sm text-gray-500">Cancel</button>
              </>
            ) : (
              <>
                <span>{todo.text}</span>
                <div className="flex gap-2">
                  <button onClick={() => startEditing(todo.id)} className="text-blue-500 text-sm">Edit</button>
                  <button onClick={() => deleteTodo(todo.id)} className="text-red-500 text-sm">Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

