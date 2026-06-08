import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EvoPreferencesDrawer } from './evo-preferences-drawer';
import type { ColumnPref } from './evo-preferences-drawer';

describe('EvoPreferencesDrawer', () => {
  const mockColumns: ColumnPref[] = [
    { key: 'id', label: 'ID', visible: true, required: true },
    { key: 'name', label: 'Name', visible: true, required: true },
    { key: 'email', label: 'Email', visible: true },
    { key: 'phone', label: 'Phone', visible: false },
    { key: 'address', label: 'Address', visible: false },
  ];

  const defaultProps = {
    opened: true,
    onClose: vi.fn(),
    columns: mockColumns,
    onChange: vi.fn(),
    onReset: vi.fn(),
  };

  it('renders when opened', () => {
    render(<EvoPreferencesDrawer {...defaultProps} />);

    expect(screen.getByText('Preferences')).toBeDefined();
    expect(screen.getByText('Column visibility')).toBeDefined();
    expect(screen.getByText('Reset all')).toBeDefined();
  });

  it('does not render when closed', () => {
    render(<EvoPreferencesDrawer {...defaultProps} opened={false} />);

    expect(screen.queryByText('Preferences')).toBeNull();
  });

  it('renders all column options', () => {
    render(<EvoPreferencesDrawer {...defaultProps} />);

    mockColumns.forEach(column => {
      expect(screen.getByText(column.label)).toBeDefined();
    });
  });

  it('shows correct checkbox states', () => {
    render(<EvoPreferencesDrawer {...defaultProps} />);

    // Find checkboxes by their container structure and text content
    expect(screen.getByText('ID')).toBeDefined();
    expect(screen.getByText('Name')).toBeDefined();
    expect(screen.getByText('Email')).toBeDefined();
    expect(screen.getByText('Phone')).toBeDefined();

    // Check that checkboxes are present
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBe(5); // 5 columns in mock data
  });

  it('disables required columns', () => {
    render(<EvoPreferencesDrawer {...defaultProps} />);

    // Check that required column labels are present and marked as disabled
    expect(screen.getByText('ID')).toBeDefined();
    expect(screen.getByText('Name')).toBeDefined();

    // Find disabled checkboxes
    const disabledCheckboxes = screen.getAllByRole('checkbox').filter(cb => cb.disabled);
    expect(disabledCheckboxes.length).toBe(2); // ID and Name are required/disabled
  });

  it('calls onChange when checkbox is toggled', () => {
    const onChange = vi.fn();
    render(<EvoPreferencesDrawer {...defaultProps} onChange={onChange} />);

    // Find all checkboxes and click the first enabled one (should be email)
    const checkboxes = screen.getAllByRole('checkbox').filter(cb => !cb.disabled);
    expect(checkboxes.length).toBeGreaterThan(0);

    fireEvent.click(checkboxes[0]);

    expect(onChange).toHaveBeenCalled();
  });

  it('calls onReset when reset button is clicked', () => {
    const onReset = vi.fn();
    render(<EvoPreferencesDrawer {...defaultProps} onReset={onReset} />);

    const resetButton = screen.getByText('Reset all');
    fireEvent.click(resetButton);

    expect(onReset).toHaveBeenCalled();
  });

  it('filters columns based on search input', () => {
    render(<EvoPreferencesDrawer {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText('Search preferences…');
    fireEvent.change(searchInput, { target: { value: 'email' } });

    expect(screen.getByText('Email')).toBeDefined();
    expect(screen.queryByText('Phone')).toBeNull();
    expect(screen.queryByText('Address')).toBeNull();
  });
});