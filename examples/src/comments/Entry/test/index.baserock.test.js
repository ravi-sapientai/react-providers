import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock the dependencies
jest.mock('react-providers', () => ({
  AppProvider: ({ children }) => <div data-testid="app-provider">{children}</div>,
}));

jest.mock('../../models/users', () => ({}));
jest.mock('../../models/comments', () => ({}));

jest.mock('../../Description', () => () => <div data-testid="description">Description Component</div>);
jest.mock('../../CommentsPage', () => () => <div data-testid="comments-page">CommentsPage Component</div>);

// Import the component after mocking dependencies
import Entry from '../../../../src/comments/Entry/index.js';

describe('Entry Component', () => {
  it('renders AppProvider with correct contexts', () => {
    render(<Entry />);
    const appProvider = screen.getByTestId('app-provider');
    expect(appProvider).toBeInTheDocument();
  });

  it('renders Description component', () => {
    render(<Entry />);
    const description = screen.getByTestId('description');
    expect(description).toBeInTheDocument();
  });

  it('renders CommentsPage component', () => {
    render(<Entry />);
    const commentsPage = screen.getByTestId('comments-page');
    expect(commentsPage).toBeInTheDocument();
  });

  it('renders the github link with correct href', () => {
    render(<Entry />);
    const link = screen.getByRole('link', { name: /https:\/\/github\.com\/xnimorz\/react-providers\/tree\/master\/examples\/src\/comments/ });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://github.com/xnimorz/react-providers/tree/master/examples/src/comments');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('renders the correct text for the github link', () => {
    render(<Entry />);
    const text = screen.getByText(/View this example on github:/);
    expect(text).toBeInTheDocument();
  });
});