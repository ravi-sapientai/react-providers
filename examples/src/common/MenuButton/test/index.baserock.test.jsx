import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MenuButton from '../../../../src/common/MenuButton/index';

// Mock the CSS import
jest.mock('../styles.css', () => ({}));

describe('MenuButton', () => {
  // Test case for rendering as a button
  test('renders as a button when href is not provided', () => {
    render(<MenuButton>Click me</MenuButton>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('menuButton');
    expect(button).not.toHaveClass('menuButton_active');
  });

  // Test case for rendering as a link
  test('renders as a link when href is provided', () => {
    render(<MenuButton href="/test">Click me</MenuButton>);
    const link = screen.getByRole('link', { name: /click me/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveClass('menuButton');
    expect(link).not.toHaveClass('menuButton_active');
    expect(link).toHaveAttribute('href', '/test');
  });

  // Test case for active state
  test('applies active class when clicked prop is true', () => {
    render(<MenuButton clicked={true}>Active Button</MenuButton>);
    const button = screen.getByRole('button', { name: /active button/i });
    expect(button).toHaveClass('menuButton');
    expect(button).toHaveClass('menuButton_active');
  });

  // Test case for passing additional props
  test('passes additional props to the rendered element', () => {
    render(<MenuButton data-testid="custom-button" onClick={() => {}}>Test Button</MenuButton>);
    const button = screen.getByTestId('custom-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('data-testid', 'custom-button');
  });

  // Test case for different content types
  test('renders with different content types', () => {
    render(
      <MenuButton>
        <span>Complex content</span>
      </MenuButton>
    );
    const button = screen.getByRole('button');
    expect(button).toContainHTML('<span>Complex content</span>');
  });

  // Test case for accessibility
  test('has correct accessibility attributes', () => {
    render(<MenuButton aria-label="Menu toggle">Toggle</MenuButton>);
    const button = screen.getByRole('button', { name: /menu toggle/i });
    expect(button).toHaveAttribute('aria-label', 'Menu toggle');
  });
});