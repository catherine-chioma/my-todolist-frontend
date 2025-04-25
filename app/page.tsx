'use client';
import { useState } from 'react';

interface Todo {
  id: number;
  text: string;
  isEditing: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    if (!newTodo.trim()) return;
    const newTask: Todo = {
      id: Date.now(),
      text: newTodo.trim(),
      isEditing: false,
    };
    setTodos([newTask, ...todos]);
    setNewTodo('');
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
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

  const updateTodo = (id: number, newText: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: newText, isEditing: false } : todo
    ));
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


