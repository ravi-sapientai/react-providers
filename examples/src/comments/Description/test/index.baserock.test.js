import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Description from '../../../../src/comments/Description/index.js';

describe('Description Component', () => {
  it('renders without crashing', () => {
    render(<Description />);
    expect(screen.getByText(/The main goal of this example/i)).toBeInTheDocument();
  });

  it('contains the correct text content', () => {
    render(<Description />);
    
    expect(screen.getByText(/The main goal of this example is to show how to work with dependencies between your contexts./i)).toBeInTheDocument();
    expect(screen.getByText(/Try to click to "load comments and users" button./i)).toBeInTheDocument();
    expect(screen.getByText(/Here we simulated some async operations by setTimeout and implemented comments context that depends on user context./i)).toBeInTheDocument();
    expect(screen.getByText(/Also, the example shows you how to work with components that depends on several contexts./i)).toBeInTheDocument();
    
    expect(screen.getByText(/Open react dev-tools to get more information how dependencies between several contexts are resolved./i)).toBeInTheDocument();
  });

  it('renders two paragraphs', () => {
    render(<Description />);
    const paragraphs = screen.getAllByText(/.+/);
    expect(paragraphs).toHaveLength(2);
  });

  it('has the correct class name', () => {
    const { container } = render(<Description />);
    expect(container.firstChild).toHaveClass('text');
  });
});