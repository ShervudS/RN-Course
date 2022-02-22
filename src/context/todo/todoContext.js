import React, { useContext, useState } from 'react';

export const TodoContext = React.createContext();
export const useTodo = () => useContext(TodoContext);

export const TodoState = ({ children }) => {
  const [todoId, setTodoId] = useState(null);
  const [todos, setTodos] = useState([]);

  return (
    <TodoContext.Provider value={{ todos, setTodos, todoId, setTodoId }}>
      {children}
    </TodoContext.Provider>
  );
};
