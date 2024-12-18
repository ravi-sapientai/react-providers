import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ToggleAll from '../../../../src/todoMVC/ToggleAll/index.js';

describe('ToggleAll Component', () => {
  it('renders without crashing', () => {
    const { getByRole } = render(<ToggleAll />);
    const checkbox = getByRole('checkbox');
    expect(checkbox).toBeTruthy();
  });

  it('has the correct class and id', () => {
    const { getByRole } = render(<ToggleAll />);
    const checkbox = getByRole('checkbox');
    expect(checkbox.className).toBe('toggle-all');
    expect(checkbox.id).toBe('toggle-all');
  });

  it('calls changeCompletedStateFromAllTodos when checked', () => {
    const mockChangeCompletedState = jest.fn();
    const { getByRole } = render(
      <ToggleAll changeCompletedStateFromAllTodos={mockChangeCompletedState} />
    );
    const checkbox = getByRole('checkbox');
    
    fireEvent.click(checkbox);
    
    expect(mockChangeCompletedState).toHaveBeenCalledTimes(1);
  });

  it('renders a label for the checkbox', () => {
    const { container } = render(<ToggleAll />);
    const label = container.querySelector('label[for="toggle-all"]');
    expect(label).toBeTruthy();
  });

  it('does not call changeCompletedStateFromAllTodos when not provided', () => {
    const { getByRole } = render(<ToggleAll />);
    const checkbox = getByRole('checkbox');
    
    // This should not throw an error
    fireEvent.click(checkbox);
    // We're just checking that the click doesn't cause an error
    expect(true).toBe(true);
  });
});