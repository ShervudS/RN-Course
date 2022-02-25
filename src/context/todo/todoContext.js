import React, { useReducer, useContext } from 'react';
import { ScreenContext } from '../screen/screenContext';
import { Alert } from 'react-native';
import { Http } from '../../http';
import {
  ADD_TODO,
  UPDATE_TODO,
  REMOVE_TODO,
  SHOW_LOADER,
  HIDE_LOADER,
  CLEAR_ERROR,
  SHOW_ERROR,
  FETCH_TODOS,
} from '../types';

export const TodoContext = React.createContext();

const initialState = {
  todos: [],
  loading: false,
  error: null,
};

const handlers = {
  [ADD_TODO]: (state, { title, id }) => ({
    ...state,
    todos: [...state.todos, { id, title }],
  }),
  [REMOVE_TODO]: (state, { id }) => ({
    ...state,
    todos: state.todos.filter((todo) => todo.id !== id),
  }),
  [UPDATE_TODO]: (state, { id, title }) => ({
    ...state,
    todos: state.todos.map((todo) => {
      if (todo.id === id) {
        todo.title = title;
      }
      return todo;
    }),
  }),

  [SHOW_LOADER]: (state) => ({ ...state, loading: true }),
  [HIDE_LOADER]: (state) => ({ ...state, loading: false }),

  [CLEAR_ERROR]: (state) => ({ ...state, error: null }),
  [SHOW_ERROR]: (state, { error }) => ({ ...state, error }),

  [FETCH_TODOS]: (state, { todos }) => ({ ...state, todos }),
  DEFAULT: (state) => state,
};

const todoReducer = (state, action) => {
  const handler = handlers[action.type] || handlers.DEFAULT;
  return handler(state, action);
};

export const TodoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const { changeScreen } = useContext(ScreenContext);

  const addTodo = async (title) => {
    clearError();
    try {
      const data = await Http.post(
        'https://rn-todo-app-db8ba-default-rtdb.firebaseio.com/todos.json',
        { title }
      );
      dispatch({ type: ADD_TODO, title, id: data.name });
    } catch (e) {
      showError('Что-то пошло не так...');
      console.log(e);
    }
  };

  const removeTodo = (id) => {
    const removedTodo = state.todos.find((t) => t.id === id);
    Alert.alert(
      'Удаление элемента',
      `Вы уверены, что хотиту удалить ${removedTodo.title} ?`,
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            changeScreen(null);
            clearError();
            try {
              await Http.post(
                'https://rn-todo-app-db8ba-default-rtdb.firebaseio.com/todos.json'
              );
              dispatch({ type: REMOVE_TODO, id });
            } catch (e) {
              showError('Что-то пошло не так...');
              console.log(e);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const fetchTodos = async () => {
    showLoader();
    clearError();
    try {
      const data = await Http.get(
        'https://rn-todo-app-db8ba-default-rtdb.firebaseio.com/todos.json'
      );
      const todos = Object.keys(data).map((key) => ({ ...data[key], id: key }));
      dispatch({ type: FETCH_TODOS, todos });
    } catch (e) {
    } finally {
      hideLoader();
    }
  };

  const updateTodo = async (id, title) => {
    clearError();
    try {
      await Http.patch(
        `https://rn-todo-app-db8ba-default-rtdb.firebaseio.com/todos/${id}.json`
      );
      dispatch({ type: UPDATE_TODO, id, title });
    } catch (e) {
      showError('Что-то пошло не так...');
      console.log(e);
    }
  };

  const showLoader = () => dispatch({ type: SHOW_LOADER });

  const hideLoader = () => dispatch({ type: HIDE_LOADER });

  const showError = (error) => dispatch({ type: SHOW_ERROR, error });

  const clearError = () => dispatch({ type: CLEAR_ERROR });

  return (
    <TodoContext.Provider
      value={{
        todos: state.todos,
        loading: state.loading,
        error: state.error,
        addTodo,
        removeTodo,
        updateTodo,
        showLoader,
        hideLoader,
        showError,
        clearError,
        fetchTodos,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};
