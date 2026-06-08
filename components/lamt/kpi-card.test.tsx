import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { KpiCard } from './kpi-card';

// Mock LucideIcon for testing
const MockIcon: React.FC<{ className?: string; size?: number }> = ({ className, size }) =>
  <svg data-testid="mock-icon" className={className} width={size} height={size} />;

describe('KpiCard', () => {
  const defaultProps = {
    label: 'Total Revenue',
    value: '$125,430',
    icon: MockIcon,
  };

  it('renders basic KPI card with label and value', () => {
    render(<KpiCard {...defaultProps} />);

    expect(screen.getByText('Total Revenue')).toBeDefined();
    expect(screen.getByText('$125,430')).toBeDefined();
  });

  it('renders icon when provided', () => {
    render(<KpiCard {...defaultProps} />);

    const iconElement = screen.getByTestId('mock-icon');
    expect(iconElement).toBeDefined();
  });

  it('renders with different variants', () => {
    const { container } = render(
      <KpiCard {...defaultProps} variant="success" />
    );

    expect(container.firstChild).toBeDefined();
    expect(screen.getByText('Total Revenue')).toBeDefined();
  });

  it('handles large numbers in value', () => {
    render(
      <KpiCard
        {...defaultProps}
        value="$1,234,567.89"
      />
    );

    expect(screen.getByText('$1,234,567.89')).toBeDefined();
  });

  it('renders with custom className', () => {
    const { container } = render(
      <KpiCard
        {...defaultProps}
        className="custom-class"
      />
    );

    expect(container.firstChild).toBeDefined();
    expect(screen.getByText('Total Revenue')).toBeDefined();
  });
});