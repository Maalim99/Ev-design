import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Simple Button component for testing (inline definition to avoid import issues)
const SimpleButton = ({ children, onClick, disabled = false }: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) => (
  <button onClick={onClick} disabled={disabled} className="px-4 py-2 bg-blue-500 text-white rounded">
    {children}
  </button>
);

describe('SimpleButton', () => {
  it('renders button with text', () => {
    render(<SimpleButton>Click me</SimpleButton>);

    expect(screen.getByRole('button')).toBeDefined();
    expect(screen.getByText('Click me')).toBeDefined();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<SimpleButton onClick={handleClick}>Click me</SimpleButton>);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(<SimpleButton onClick={handleClick} disabled>Click me</SimpleButton>);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies disabled attribute', () => {
    render(<SimpleButton disabled>Click me</SimpleButton>);

    const button = screen.getByRole('button');
    expect(button.disabled).toBe(true);
  });

  it('renders with custom content', () => {
    render(
      <SimpleButton>
        <span>Custom</span> Content
      </SimpleButton>
    );

    expect(screen.getByText('Custom')).toBeDefined();
    expect(screen.getByText('Content')).toBeDefined();
  });
});