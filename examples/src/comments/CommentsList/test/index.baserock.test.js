import React from 'react';
import { render, screen } from '@testing-library/react';
import CommentsList from '../../../../src/comments/CommentsList/index.js';
import statuses from '../../models/statuses';

// Mock the dependencies
jest.mock('react-providers', () => ({
  use: (obj) => (Component) => Component,
}));

jest.mock('../../../common/Loader', () => function MockLoader() {
  return <div data-testid="loader">Loading...</div>;
});

jest.mock('../../Comment', () => function MockComment({ id, comment, user }) {
  return <div data-testid={`comment-${id}`}>{comment.text} - {user?.name || 'Unknown User'}</div>;
});

describe('CommentsList', () => {
  it('renders loader when comments are fetching', () => {
    const props = {
      comments: {
        data: {
          status: statuses.fetching,
          list: [],
        },
      },
      users: {
        data: {},
      },
    };

    render(<CommentsList {...props} />);
    expect(screen.getByTestId('loader')).toBeTruthy();
  });

  it('renders comments when data is available', () => {
    const props = {
      comments: {
        data: {
          status: statuses.success,
          list: [
            { id: 1, text: 'Comment 1', user: 'user1' },
            { id: 2, text: 'Comment 2', user: 'user2' },
          ],
        },
      },
      users: {
        data: {
          user1: { name: 'User One' },
          user2: { name: 'User Two' },
        },
      },
    };

    render(<CommentsList {...props} />);
    expect(screen.getByTestId('comment-1')).toBeTruthy();
    expect(screen.getByTestId('comment-2')).toBeTruthy();
    expect(screen.getByText('Comment 1 - User One')).toBeTruthy();
    expect(screen.getByText('Comment 2 - User Two')).toBeTruthy();
  });

  it('renders empty list when no comments are available', () => {
    const props = {
      comments: {
        data: {
          status: statuses.success,
          list: [],
        },
      },
      users: {
        data: {},
      },
    };

    render(<CommentsList {...props} />);
    expect(screen.queryByTestId(/comment-/)).toBeNull();
  });

  it('renders correctly with missing user data', () => {
    const props = {
      comments: {
        data: {
          status: statuses.success,
          list: [
            { id: 1, text: 'Comment 1', user: 'user1' },
          ],
        },
      },
      users: {
        data: {},
      },
    };

    render(<CommentsList {...props} />);
    expect(screen.getByTestId('comment-1')).toBeTruthy();
    expect(screen.getByText('Comment 1 - Unknown User')).toBeTruthy();
  });
});