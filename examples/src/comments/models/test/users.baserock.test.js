import React from 'react';
import { render } from '@testing-library/react';
import UsersContextModule from '../../../../src/comments/models/users.js';

const { Provider: UsersContextProvider, Consumer: UsersContextConsumer } = UsersContextModule;

describe('UsersContextProvider', () => {
  it('should initialize with an empty dictionary', () => {
    let contextValue;
    render(
      React.createElement(UsersContextProvider, null,
        React.createElement(UsersContextConsumer, null, (value) => {
          contextValue = value;
          return null;
        })
      )
    );

    expect(contextValue.data).toEqual({});
  });

  it('should update the dictionary when receiveUsers is called', () => {
    let contextValue;
    const { rerender } = render(
      React.createElement(UsersContextProvider, null,
        React.createElement(UsersContextConsumer, null, (value) => {
          contextValue = value;
          return null;
        })
      )
    );

    const newUsers = { user1: { name: 'John' }, user2: { name: 'Jane' } };

    contextValue.receiveUsers(newUsers);

    rerender(
      React.createElement(UsersContextProvider, null,
        React.createElement(UsersContextConsumer, null, (value) => {
          contextValue = value;
          return null;
        })
      )
    );

    expect(contextValue.data).toEqual(newUsers);
  });

  it('should provide receiveUsers method in the context value', () => {
    let contextValue;
    render(
      React.createElement(UsersContextProvider, null,
        React.createElement(UsersContextConsumer, null, (value) => {
          contextValue = value;
          return null;
        })
      )
    );

    expect(typeof contextValue.receiveUsers).toBe('function');
  });

  it('should render children components', () => {
    const TestChild = React.createElement('div', { 'data-testid': 'test-child' }, 'Test Child');
    const { getByTestId } = render(
      React.createElement(UsersContextProvider, null, TestChild)
    );

    expect(getByTestId('test-child')).toBeTruthy();
  });
});