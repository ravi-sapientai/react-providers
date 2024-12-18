import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import TodoInput from '../../../../src/todoMVC/TodoInput/index.js';

// Mock the react-providers module
jest.mock('react-providers', () => ({
  use: (obj) => (Component) => Component,
}));

// Mock the todos model
const mockTodos = {
  add: jest.fn(),
};
jest.mock('../../models/todos', () => mockTodos);

describe('TodoInput Component', () => {
  beforeEach(() => {
    mockTodos.add.mockClear();
  });

  it('renders without crashing', () => {
    render(<TodoInput />);
    expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument();
  });

  it('has the correct class name', () => {
    render(<TodoInput />);
    expect(screen.getByPlaceholderText('What needs to be done?')).toHaveClass('new-todo');
  });

  it('calls todos.add when Enter key is pressed', () => {
    render(<TodoInput todos={mockTodos} />);
    const input = screen.getByPlaceholderText('What needs to be done?');
    
    fireEvent.change(input, { target: { value: 'New Todo' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', which: 13 });

    expect(mockTodos.add).toHaveBeenCalledWith('New Todo');
  });

  it('clears input value after adding todo', () => {
    render(<TodoInput todos={mockTodos} />);
    const input = screen.getByPlaceholderText('What needs to be done?');
    
    fireEvent.change(input, { target: { value: 'New Todo' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', which: 13 });

    expect(input.value).toBe('');
  });

  it('does not call todos.add when other keys are pressed', () => {
    render(<TodoInput todos={mockTodos} />);
    const input = screen.getByPlaceholderText('What needs to be done?');
    
    fireEvent.change(input, { target: { value: 'New Todo' } });
    fireEvent.keyDown(input, { key: 'A', code: 'KeyA', which: 65 });

    expect(mockTodos.add).not.toHaveBeenCalled();
    expect(input.value).toBe('New Todo');
  });

  it('does not call todos.add when Enter is pressed with empty input', () => {
    render(<TodoInput todos={mockTodos} />);
    const input = screen.getByPlaceholderText('What needs to be done?');
    
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', which: 13 });

    expect(mockTodos.add).not.toHaveBeenCalled();
  });
});