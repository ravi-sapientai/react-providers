import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../../../../src/todoMVC/Footer/index.js';
import '@testing-library/jest-dom'; 

// Mock dependencies
jest.mock('react-providers', () => ({
  use: (obj) => (component) => component,
}));

jest.mock('../../models/todos', () => ({
  __esModule: true,
  default: {},
}));

jest.mock('../../Filters', () => {
  return function MockedFilters() {
    return <div data-testid="filters">Mocked Filters</div>;
  };
});

describe('Footer Component', () => {
  const mockProps = {
    todos: {
      data: {
        list: [
          { id: 1, completed: false },
          { id: 2, completed: true },
          { id: 3, completed: false },
        ],
      },
    },
    filter: 'all',
    filters: ['all', 'active', 'completed'],
    setFilter: jest.fn(),
  };

  it('renders the footer with correct number of incomplete items', () => {
    render(<Footer {...mockProps} />);
    
    const todoCount = screen.getByText('2');
    expect(todoCount).toBeInTheDocument();
    
    const itemsLeftText = screen.getByText('items left');
    expect(itemsLeftText).toBeInTheDocument();
  });

  it('renders "item left" when there is only one incomplete item', () => {
    const props = {
      ...mockProps,
      todos: {
        data: {
          list: [
            { id: 1, completed: false },
            { id: 2, completed: true },
          ],
        },
      },
    };
    
    render(<Footer {...props} />);
    
    const todoCount = screen.getByText('1');
    expect(todoCount).toBeInTheDocument();
    
    const itemLeftText = screen.getByText('item left');
    expect(itemLeftText).toBeInTheDocument();
  });

  it('renders the Filters component', () => {
    render(<Footer {...mockProps} />);
    
    const filtersComponent = screen.getByTestId('filters');
    expect(filtersComponent).toBeInTheDocument();
  });

  it('renders correctly when there are no todos', () => {
    const props = {
      ...mockProps,
      todos: {
        data: {
          list: [],
        },
      },
    };
    
    render(<Footer {...props} />);
    
    const todoCount = screen.getByText('0');
    expect(todoCount).toBeInTheDocument();
    
    const itemsLeftText = screen.getByText('items left');
    expect(itemsLeftText).toBeInTheDocument();
  });
});