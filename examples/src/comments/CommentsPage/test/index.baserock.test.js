import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CommentsPage from '../../../../src/comments/CommentsPage/index.js';

// Mock the dependencies
jest.mock('../../../../src/comments/CommentsList', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="comments-list">Mocked CommentsList</div>)
}));

jest.mock('../../../../src/common/Button', () => ({
  __esModule: true,
  default: jest.fn(({ children, onClick }) => (
    <button onClick={onClick}>{children}</button>
  ))
}));

jest.mock('../../../../src/comments/models/comments', () => ({
  __esModule: true,
  default: {
    fetchCommentsPage: jest.fn()
  }
}));

jest.mock('react-providers', () => ({
  __esModule: true,
  use: jest.fn((providers) => (Component) => Component)
}));

describe('CommentsPage', () => {
  const mockFetchCommentsPage = jest.fn();
  const defaultProps = {
    comments: {
      fetchCommentsPage: mockFetchCommentsPage
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<CommentsPage {...defaultProps} />);
    expect(screen.getByText('Load comments and users')).toBeTruthy();
  });

  it('renders the CommentsList component', () => {
    render(<CommentsPage {...defaultProps} />);
    expect(screen.getByTestId('comments-list')).toBeTruthy();
  });

  it('calls fetchCommentsPage when the button is clicked', () => {
    render(<CommentsPage {...defaultProps} />);
    
    const button = screen.getByText('Load comments and users');
    fireEvent.click(button);
    
    expect(mockFetchCommentsPage).toHaveBeenCalledTimes(1);
  });

  it('applies the correct CSS class', () => {
    render(<CommentsPage {...defaultProps} />);
    const pageDiv = screen.getByText('Load comments and users').closest('div');
    expect(pageDiv).toHaveClass('commentsPage');
  });

  it('renders the Button component with correct props', () => {
    render(<CommentsPage {...defaultProps} />);
    
    const button = screen.getByText('Load comments and users');
    expect(button).toBeTruthy();
    expect(button.tagName).toBe('BUTTON');
  });

  it('passes the fetchCommentsPage function to the Button component', () => {
    render(<CommentsPage {...defaultProps} />);
    
    const button = screen.getByText('Load comments and users');
    fireEvent.click(button);
    
    expect(mockFetchCommentsPage).toHaveBeenCalledTimes(1);
  });
});