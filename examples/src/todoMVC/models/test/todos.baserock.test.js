// File: src/todoMVC/models/test/todos.test.js

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import TodosContextProvider from '../todos';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('TodosContextProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('initializes with empty list when localStorage is empty', () => {
    localStorage.getItem.mockReturnValue(null);
    const { getByTestId } = render(
      <TodosContextProvider.Provider>
        <TodosContextProvider.Consumer>
          {(context) => <div data-testid="todo-list">{JSON.stringify(context.data.list)}</div>}
        </TodosContextProvider.Consumer>
      </TodosContextProvider.Provider>
    );
    expect(getByTestId('todo-list').textContent).toBe('[]');
  });

  it('initializes with data from localStorage', () => {
    const mockData = JSON.stringify([{ id: 1, text: 'Test todo', completed: false }]);
    localStorage.getItem.mockReturnValue(mockData);
    const { getByTestId } = render(
      <TodosContextProvider.Provider>
        <TodosContextProvider.Consumer>
          {(context) => <div data-testid="todo-list">{JSON.stringify(context.data.list)}</div>}
        </TodosContextProvider.Consumer>
      </TodosContextProvider.Provider>
    );
    expect(getByTestId('todo-list').textContent).toBe(mockData);
  });

  it('adds a new todo', () => {
    const { getByText, getByTestId } = render(
      <TodosContextProvider.Provider>
        <TodosContextProvider.Consumer>
          {(context) => (
            <div>
              <button onClick={() => context.add('New todo')}>Add Todo</button>
              <div data-testid="todo-list">{JSON.stringify(context.data.list)}</div>
            </div>
          )}
        </TodosContextProvider.Consumer>
      </TodosContextProvider.Provider>
    );
    
    fireEvent.click(getByText('Add Todo'));
    expect(getByTestId('todo-list').textContent).toContain('New todo');
  });

  it('removes a todo', () => {
    localStorage.getItem.mockReturnValue(JSON.stringify([{ id: 1, text: 'Test todo', completed: false }]));
    
    const { getByText, queryByText } = render(
      <TodosContextProvider.Provider>
        <TodosContextProvider.Consumer>
          {(context) => (
            <div>
              <div>{context.data.list.map(todo => <span key={todo.id}>{todo.text}</span>)}</div>
              <button onClick={() => context.remove(1)}>Remove Todo</button>
            </div>
          )}
        </TodosContextProvider.Consumer>
      </TodosContextProvider.Provider>
    );
    
    expect(getByText('Test todo')).toBeTruthy();
    fireEvent.click(getByText('Remove Todo'));
    expect(queryByText('Test todo')).toBeNull();
  });

  it('renames a todo', () => {
    localStorage.getItem.mockReturnValue(JSON.stringify([{ id: 1, text: 'Test todo', completed: false }]));
    
    const { getByText } = render(
      <TodosContextProvider.Provider>
        <TodosContextProvider.Consumer>
          {(context) => (
            <div>
              <div>{context.data.list.map(todo => <span key={todo.id}>{todo.text}</span>)}</div>
              <button onClick={() => context.rename(1, 'Renamed todo')}>Rename Todo</button>
            </div>
          )}
        </TodosContextProvider.Consumer>
      </TodosContextProvider.Provider>
    );
    
    fireEvent.click(getByText('Rename Todo'));
    expect(getByText('Renamed todo')).toBeTruthy();
  });

  it('changes completed state of a todo', () => {
    localStorage.getItem.mockReturnValue(JSON.stringify([{ id: 1, text: 'Test todo', completed: false }]));
    
    const { getByText } = render(
      <TodosContextProvider.Provider>
        <TodosContextProvider.Consumer>
          {(context) => (
            <div>
              <div data-testid="todo-list">{JSON.stringify(context.data.list)}</div>
              <button onClick={() => context.changeCompletedState(1)}>Toggle Complete</button>
            </div>
          )}
        </TodosContextProvider.Consumer>
      </TodosContextProvider.Provider>
    );
    
    fireEvent.click(getByText('Toggle Complete'));
    expect(getByText(/"completed":true/)).toBeTruthy();
  });

  it('changes completed state of all todos', () => {
    localStorage.getItem.mockReturnValue(JSON.stringify([
      { id: 1, text: 'Todo 1', completed: false },
      { id: 2, text: 'Todo 2', completed: true }
    ]));
    
    const { getByText, getByTestId } = render(
      <TodosContextProvider.Provider>
        <TodosContextProvider.Consumer>
          {(context) => (
            <div>
              <div data-testid="todo-list">{JSON.stringify(context.data.list)}</div>
              <button onClick={context.changeCompletedStateFromAllTodos}>Toggle All</button>
            </div>
          )}
        </TodosContextProvider.Consumer>
      </TodosContextProvider.Provider>
    );
    
    fireEvent.click(getByText('Toggle All'));
    const updatedList = JSON.parse(getByTestId('todo-list').textContent);
    expect(updatedList.every(todo => todo.completed)).toBe(true);
  });

  it('updates localStorage when state changes', () => {
    const { getByText } = render(
      <TodosContextProvider.Provider>
        <TodosContextProvider.Consumer>
          {(context) => (
            <button onClick={() => context.add('New todo')}>Add Todo</button>
          )}
        </TodosContextProvider.Consumer>
      </TodosContextProvider.Provider>
    );
    
    fireEvent.click(getByText('Add Todo'));
    expect(localStorage.setItem).toHaveBeenCalledWith('[react-providers]todos', expect.any(String));
  });
});