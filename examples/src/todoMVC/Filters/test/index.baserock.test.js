import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Filters from '../../../../src/todoMVC/Filters/index.js';

describe('Filter Component', () => {
  it('renders correctly and applies selected class when active', () => {
    const setFilter = jest.fn();
    const { rerender } = render(
      <Filters
        filter="all"
        filters={{ all: 'all', active: 'active', completed: 'completed' }}
        setFilter={setFilter}
      />
    );

    const allFilter = screen.getByText('All');
    expect(allFilter.className).toContain('selected');

    const activeFilter = screen.getByText('Active');
    expect(activeFilter.className).not.toContain('selected');

    rerender(
      <Filters
        filter="active"
        filters={{ all: 'all', active: 'active', completed: 'completed' }}
        setFilter={setFilter}
      />
    );

    expect(allFilter.className).not.toContain('selected');
    expect(activeFilter.className).toContain('selected');
  });

  it('calls setFilter with correct target when clicked', () => {
    const setFilter = jest.fn();
    render(
      <Filters
        filter="all"
        filters={{ all: 'all', active: 'active', completed: 'completed' }}
        setFilter={setFilter}
      />
    );

    const activeFilter = screen.getByText('Active');
    fireEvent.click(activeFilter);

    expect(setFilter).toHaveBeenCalledWith('active');
  });

  it('prevents default behavior on click', () => {
    const setFilter = jest.fn();
    render(
      <Filters
        filter="all"
        filters={{ all: 'all', active: 'active', completed: 'completed' }}
        setFilter={setFilter}
      />
    );

    const allFilter = screen.getByText('All');
    const clickEvent = fireEvent.click(allFilter);

    expect(clickEvent.defaultPrevented).toBe(true);
  });

  it('renders all filter options', () => {
    render(
      <Filters
        filter="all"
        filters={{ all: 'all', active: 'active', completed: 'completed' }}
        setFilter={() => {}}
      />
    );

    expect(screen.getByText('All')).toBeTruthy();
    expect(screen.getByText('Active')).toBeTruthy();
    expect(screen.getByText('Completed')).toBeTruthy();
  });
});