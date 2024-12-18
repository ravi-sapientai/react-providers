import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from '../../../../src/common/Button/index';

// Mock the CSS import
jest.mock('../../../../src/common/Button/styles.css', () => ({}));

describe('Button Component', () => {
  test('renders an anchor element when href prop is provided', () => {
    render(<Button href="https://example.com">Click me</Button>);
    const linkElement = screen.getByRole('link', { name: /click me/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', 'https://example.com');
    expect(linkElement).toHaveClass('button');
  });

  test('renders a button element when href prop is not provided', () => {
    render(<Button onClick={() => {}}>Click me</Button>);
    const buttonElement = screen.getByRole('button', { name: /click me/i });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass('button');
  });

  test('passes through additional props to anchor element', () => {
    render(<Button href="https://example.com" target="_blank" rel="noopener noreferrer">External Link</Button>);
    const linkElement = screen.getByRole('link', { name: /external link/i });
    expect(linkElement).toHaveAttribute('target', '_blank');
    expect(linkElement).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('passes through additional props to button element', () => {
    render(<Button type="submit" disabled>Submit</Button>);
    const buttonElement = screen.getByRole('button', { name: /submit/i });
    expect(buttonElement).toHaveAttribute('type', 'submit');
    expect(buttonElement).toBeDisabled();
  });

  test('applies only the default button class', () => {
    render(<Button className="custom-class">Custom Button</Button>);
    const buttonElement = screen.getByRole('button', { name: /custom button/i });
    expect(buttonElement).toHaveClass('button');
    expect(buttonElement).not.toHaveClass('custom-class');
  });

  // Additional test to ensure type safety
  test('accepts and passes through various prop types', () => {
    const handleClick = jest.fn();
    render(
      <Button
        onClick={handleClick}
        disabled={false}
        aria-label="Test button"
        data-testid="test-button"
      >
        Test
      </Button>
    );
    const buttonElement = screen.getByTestId('test-button');
    expect(buttonElement).toHaveAttribute('aria-label', 'Test button');
    expect(buttonElement).not.toBeDisabled();
    buttonElement.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});