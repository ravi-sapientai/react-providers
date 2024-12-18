const React = require('react');
const { render, screen, fireEvent } = require('@testing-library/react');
require('@testing-library/jest-dom');

// Mock components
const mockComponents = {
  MenuButton: ({ clicked, onClick, children, href, target }) => (
    React.createElement('button', { onClick, 'data-clicked': clicked, 'data-href': href, 'data-target': target }, children)
  ),
  MainInfo: () => React.createElement('div', { 'data-testid': 'main-info' }, 'MainInfo'),
  TodoMVC: () => React.createElement('div', { 'data-testid': 'todo-mvc' }, 'TodoMVC'),
  CommentsEntry: () => React.createElement('div', { 'data-testid': 'comments-entry' }, 'CommentsEntry'),
};

// Mock the imports
jest.mock('../../src/common/MenuButton', () => mockComponents.MenuButton, { virtual: true });
jest.mock('../../src/info/MainInfo', () => mockComponents.MainInfo, { virtual: true });
jest.mock('../../src/todoMVC/Entry', () => mockComponents.TodoMVC, { virtual: true });
jest.mock('../../src/comments/Entry', () => mockComponents.CommentsEntry, { virtual: true });
jest.mock('../../src/styles.css', () => ({}), { virtual: true });
jest.mock('../../src/logo.svg', () => 'mocked-logo.svg', { virtual: true });

// Import App component
const App = require('../../src/App').default;

describe('App Component', () => {
  beforeEach(() => {
    render(React.createElement(App));
  });

  it('renders the header with correct title and version', () => {
    expect(screen.getByText('React-providers')).toBeInTheDocument();
    expect(screen.getByText('2.0')).toBeInTheDocument();
  });

  it('renders all menu buttons', () => {
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('TodoMVC example')).toBeInTheDocument();
    expect(screen.getByText('Comments example')).toBeInTheDocument();
    expect(screen.getByText('GitHub')).toBeInTheDocument();
  });

  it('renders MainInfo component by default', () => {
    expect(screen.getByTestId('main-info')).toBeInTheDocument();
    expect(screen.queryByTestId('todo-mvc')).not.toBeInTheDocument();
    expect(screen.queryByTestId('comments-entry')).not.toBeInTheDocument();
  });

  it('switches to TodoMVC view when clicking TodoMVC example button', () => {
    fireEvent.click(screen.getByText('TodoMVC example'));
    expect(screen.getByTestId('todo-mvc')).toBeInTheDocument();
    expect(screen.queryByTestId('main-info')).not.toBeInTheDocument();
    expect(screen.queryByTestId('comments-entry')).not.toBeInTheDocument();
  });

  it('switches to Comments view when clicking Comments example button', () => {
    fireEvent.click(screen.getByText('Comments example'));
    expect(screen.getByTestId('comments-entry')).toBeInTheDocument();
    expect(screen.queryByTestId('main-info')).not.toBeInTheDocument();
    expect(screen.queryByTestId('todo-mvc')).not.toBeInTheDocument();
  });

  it('switches back to MainInfo view when clicking About button', () => {
    fireEvent.click(screen.getByText('TodoMVC example'));
    fireEvent.click(screen.getByText('About'));
    expect(screen.getByTestId('main-info')).toBeInTheDocument();
    expect(screen.queryByTestId('todo-mvc')).not.toBeInTheDocument();
    expect(screen.queryByTestId('comments-entry')).not.toBeInTheDocument();
  });

  it('renders GitHub button with correct attributes', () => {
    const githubButton = screen.getByText('GitHub');
    expect(githubButton).toHaveAttribute('data-href', 'https://github.com/xnimorz/react-providers');
    expect(githubButton).toHaveAttribute('data-target', '_blank');
  });

  it('renders version link with correct attributes', () => {
    const versionLink = screen.getByText('2.0');
    expect(versionLink).toHaveAttribute('href', 'https://github.com/xnimorz/react-providers/blob/master/CHANGELOG.md');
    expect(versionLink).toHaveAttribute('target', '_blank');
  });
});