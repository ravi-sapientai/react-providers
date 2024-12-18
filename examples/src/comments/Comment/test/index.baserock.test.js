import React from 'react';
import { render, screen } from '@testing-library/react';
import Comment from '../../../../src/comments/Comment/index.js';

// Mock the CSS import
jest.mock('../styles.css', () => ({}));

describe('Comment component', () => {
  it('renders the user name and comment text correctly', () => {
    const user = { name: 'John Doe' };
    const comment = { text: 'This is a test comment' };
    
    const { container } = render(<Comment user={user} comment={comment} />);
    
    expect(container.textContent).toContain('John Doe');
    expect(container.textContent).toContain('This is a test comment');
  });

  it('applies correct CSS classes', () => {
    const user = { name: 'Jane Smith' };
    const comment = { text: 'Another test comment' };
    
    const { container } = render(<Comment user={user} comment={comment} />);
    
    expect(container.querySelector('.comment')).toBeTruthy();
    expect(container.querySelector('.comment__autor')).toBeTruthy();
    expect(container.querySelector('.comment__text')).toBeTruthy();
  });

  it('handles empty user name', () => {
    const user = { name: '' };
    const comment = { text: 'Comment with empty user name' };
    
    const { container } = render(<Comment user={user} comment={comment} />);
    
    expect(container.textContent).toContain('Comment with empty user name');
    expect(container.querySelector('.comment__autor').textContent).toBe('');
  });

  it('handles empty comment text', () => {
    const user = { name: 'Alice' };
    const comment = { text: '' };
    
    const { container } = render(<Comment user={user} comment={comment} />);
    
    expect(container.textContent).toContain('Alice');
    expect(container.querySelector('.comment__text').textContent).toBe('');
  });

  it('handles long user names and comment texts', () => {
    const user = { name: 'This is a very long user name that might cause layout issues' };
    const comment = { text: 'This is an extremely long comment text that could potentially cause wrapping or layout problems in the UI. We need to ensure that the component can handle such long texts gracefully.' };
    
    const { container } = render(<Comment user={user} comment={comment} />);
    
    expect(container.textContent).toContain(user.name);
    expect(container.textContent).toContain(comment.text);
  });
});