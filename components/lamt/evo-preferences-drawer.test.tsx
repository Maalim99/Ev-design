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

    const idCheckbox = screen.getByRole('checkbox', { name: /ID/i });
    const nameCheckbox = screen.getByRole('checkbox', { name: /Name/i });
    const emailCheckbox = screen.getByRole('checkbox', { name: /Email/i });
    const phoneCheckbox = screen.getByRole('checkbox', { name: /Phone/i });

    expect(idCheckbox.checked).toBe(true);
    expect(nameCheckbox.checked).toBe(true);
    expect(emailCheckbox.checked).toBe(true);
    expect(phoneCheckbox.checked).toBe(false);
  });

  it('disables required columns', () => {
    render(<EvoPreferencesDrawer {...defaultProps} />);

    const idCheckbox = screen.getByRole('checkbox', { name: /ID/i });
    const nameCheckbox = screen.getByRole('checkbox', { name: /Name/i });

    expect(idCheckbox.disabled).toBe(true);
    expect(nameCheckbox.disabled).toBe(true);
  });

  it('calls onChange when checkbox is toggled', () => {
    const onChange = vi.fn();
    render(<EvoPreferencesDrawer {...defaultProps} onChange={onChange} />);

    const emailCheckbox = screen.getByRole('checkbox', { name: /Email/i });
    fireEvent.click(emailCheckbox);

    expect(onChange).toHaveBeenCalledWith('email', false);
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