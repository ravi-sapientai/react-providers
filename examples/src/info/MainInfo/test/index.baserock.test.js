import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MainInfo from '../../../../src/info/MainInfo/index.js';

// Mock the CSS import
jest.mock('../styles.css', () => ({}));

describe('MainInfo Component', () => {
  it('renders the main information paragraph', () => {
    render(<MainInfo />);
    const paragraph = screen.getByText(/React-providers is a library/i);
    expect(paragraph).toBeInTheDocument();
  });

  it('renders all list items', () => {
    render(<MainInfo />);
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(7);
  });

  it('renders the GitHub link', () => {
    render(<MainInfo />);
    const link = screen.getByRole('link', { name: /https:\/\/github\.com\/xnimorz\/react-providers/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://github.com/xnimorz/react-providers');
  });

  it('renders the code element', () => {
    render(<MainInfo />);
    const codeElement = screen.getByText('hoist-non-react-statics');
    expect(codeElement).toBeInTheDocument();
    expect(codeElement.tagName).toBe('CODE');
  });

  it('applies the correct CSS class', () => {
    const { container } = render(<MainInfo />);
    const mainInfoDiv = container.firstChild;
    expect(mainInfoDiv).toHaveClass('mainInfo');
  });
});