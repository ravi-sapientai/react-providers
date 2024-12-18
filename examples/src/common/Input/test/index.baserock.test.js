import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Input from '../../../../src/common/Input/index.js';

describe('Input component', () => {
  it('renders an input element with default class', () => {
    render(<Input />);
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveClass('input');
  });

  it('applies additional props to the input element', () => {
    render(<Input placeholder="Enter text" type="email" />);
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toHaveAttribute('placeholder', 'Enter text');
    expect(inputElement).toHaveAttribute('type', 'email');
  });

  it('allows overriding the default className', () => {
    render(<Input className="custom-input" />);
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toHaveClass('custom-input');
    expect(inputElement).not.toHaveClass('input');
  });

  it('passes through other HTML attributes', () => {
    render(<Input data-testid="test-input" aria-label="Test Input" />);
    const inputElement = screen.getByTestId('test-input');
    expect(inputElement).toHaveAttribute('aria-label', 'Test Input');
  });
});