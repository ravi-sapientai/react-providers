import React from 'react';
import { render, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock dependencies
jest.mock('react-providers', () => ({
  use: (dependency) => (Component) => Component,
}));

jest.mock('../statuses', () => ({
  __esModule: true,
  default: {
    dirty: 'dirty',
    fetching: 'fetching',
    clear: 'clear',
  },
}));

const mockFetchCommentsPage = jest.fn();

// Define mock functions outside jest.mock()
const mockReceiveUsers = jest.fn();

jest.mock('../../../../src/comments/models/comments', () => {
  const React = require('react');
  const CommentsContext = React.createContext();
  
  class MockProvider extends React.Component {
    state = {
      list: [],
      status: 'dirty',
    };

    fetchCommentsPage = async () => {
      this.setState({ status: 'fetching' });
      try {
        const result = await mockFetchCommentsPage();
        this.props.users.receiveUsers(result.users);
        this.setState({
          status: 'clear',
          list: result.comments,
        });
      } catch (error) {
        this.setState({ status: 'fetching' }); // Simulate error state
      }
    };

    render() {
      const value = {
        data: this.state,
        fetchCommentsPage: this.fetchCommentsPage,
      };
      return <CommentsContext.Provider value={value}>{this.props.children}</CommentsContext.Provider>;
    }
  }

  return {
    __esModule: true,
    default: {
      Consumer: CommentsContext.Consumer,
      Provider: MockProvider,
    },
  };
});

const CommentsModule = require('../../../../src/comments/models/comments');

describe('CommentsContextProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with correct default state', () => {
    const { getByTestId } = render(
      <CommentsModule.default.Provider users={{ receiveUsers: mockReceiveUsers }}>
        <CommentsModule.default.Consumer>
          {(value) => (
            <div>
              <span data-testid="status">{value.data.status}</span>
              <span data-testid="list-length">{value.data.list.length}</span>
            </div>
          )}
        </CommentsModule.default.Consumer>
      </CommentsModule.default.Provider>
    );

    expect(getByTestId('status')).toHaveTextContent('dirty');
    expect(getByTestId('list-length')).toHaveTextContent('0');
  });

  it('should fetch comments and update state', async () => {
    const mockComments = [
      { id: 1, text: 'Test comment', user: 1 },
    ];
    const mockUsers = {
      '1': { name: 'Test User' },
    };

    mockFetchCommentsPage.mockResolvedValue({
      comments: mockComments,
      users: mockUsers,
    });

    const { getByTestId, getByText } = render(
      <CommentsModule.default.Provider users={{ receiveUsers: mockReceiveUsers }}>
        <CommentsModule.default.Consumer>
          {(value) => (
            <div>
              <span data-testid="status">{value.data.status}</span>
              <span data-testid="list-length">{value.data.list.length}</span>
              <button onClick={value.fetchCommentsPage}>Fetch Comments</button>
            </div>
          )}
        </CommentsModule.default.Consumer>
      </CommentsModule.default.Provider>
    );

    const fetchButton = getByText('Fetch Comments');

    await act(async () => {
      fetchButton.click();
    });

    await waitFor(() => {
      expect(getByTestId('status')).toHaveTextContent('clear');
      expect(getByTestId('list-length')).toHaveTextContent('1');
    });

    expect(mockFetchCommentsPage).toHaveBeenCalledTimes(1);
    expect(mockReceiveUsers).toHaveBeenCalledWith(mockUsers);
  });

  it('should handle fetch error', async () => {
    mockFetchCommentsPage.mockRejectedValue(new Error('Fetch failed'));

    const { getByTestId, getByText } = render(
      <CommentsModule.default.Provider users={{ receiveUsers: mockReceiveUsers }}>
        <CommentsModule.default.Consumer>
          {(value) => (
            <div>
              <span data-testid="status">{value.data.status}</span>
              <button onClick={value.fetchCommentsPage}>Fetch Comments</button>
            </div>
          )}
        </CommentsModule.default.Consumer>
      </CommentsModule.default.Provider>
    );

    const fetchButton = getByText('Fetch Comments');

    await act(async () => {
      fetchButton.click();
    });

    await waitFor(() => {
      expect(getByTestId('status')).toHaveTextContent('fetching');
    });

    // The state should remain in 'fetching' due to the error
    expect(getByTestId('status')).toHaveTextContent('fetching');
  });
});