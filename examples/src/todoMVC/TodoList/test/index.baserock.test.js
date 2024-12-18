import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoList from '../../../../src/todoMVC/TodoList/index.js';

// Mock dependencies
jest.mock('react-providers', () => ({
  use: (obj) => (Component) => Component,
}));

jest.mock('../../ToggleAll', () => {
  return function MockToggleAll() {
    return <div data-testid="toggle-all">ToggleAll</div>;
  };
});

jest.mock('../../Todo', () => {
  return function MockTodo({ todo }) {
    return <li data-testid={`todo-${todo.id}`}>Todo Item</li>;
  };
});

jest.mock('../../models/todos', () => ({
  __esModule: true,
  default: {},
}));

describe('TodoList Component', () => {
  const mockTodos = {
    data: {
      list: [
        { id: 1, text: 'Todo 1', completed: false },
        { id: 2, text: 'Todo 2', completed: true },
      ],
    },
    changeCompletedStateFromAllTodos: jest.fn(),
    rename: jest.fn(),
    remove: jest.fn(),
    changeCompletedState: jest.fn(),
  };

  const mockFilter = jest.fn((todos) => todos);

  it('renders without crashing', () => {
    render(<TodoList todos={mockTodos} filter={mockFilter} />);
    expect(screen.getByTestId('toggle-all')).toBeInTheDocument();
  });

  it('renders ToggleAll when todos are present', () => {
    render(<TodoList todos={mockTodos} filter={mockFilter} />);
    expect(screen.getByTestId('toggle-all')).toBeInTheDocument();
  });

  it('does not render ToggleAll when todos list is empty', () => {
    const emptyTodos = { ...mockTodos, data: { list: [] } };
    render(<TodoList todos={emptyTodos} filter={mockFilter} />);
    expect(screen.queryByTestId('toggle-all')).not.toBeInTheDocument();
  });

  it('renders correct number of Todo components', () => {
    render(<TodoList todos={mockTodos} filter={mockFilter} />);
    expect(screen.getAllByTestId(/^todo-/)).toHaveLength(2);
  });

  it('applies filter function to todos', () => {
    const customFilter = jest.fn(() => [mockTodos.data.list[0]]);
    render(<TodoList todos={mockTodos} filter={customFilter} />);
    expect(customFilter).toHaveBeenCalledWith(mockTodos.data.list);
    expect(screen.getAllByTestId(/^todo-/)).toHaveLength(1);
  });

  it('passes correct props to Todo components', () => {
    render(<TodoList todos={mockTodos} filter={mockFilter} />);
    expect(screen.getByTestId('todo-1')).toBeInTheDocument();
    expect(screen.getByTestId('todo-2')).toBeInTheDocument();
  });
});