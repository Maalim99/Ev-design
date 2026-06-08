import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KpiCard } from './kpi-card';
import { TrendingUp, DollarSign } from 'lucide-react';

describe('KpiCard', () => {
  const defaultProps = {
    title: 'Total Revenue',
    value: '$125,430',
    icon: <DollarSign />,
  };

  it('renders basic KPI card with title and value', () => {
    render(<KpiCard {...defaultProps} />);

    expect(screen.getByText('Total Revenue')).toBeDefined();
    expect(screen.getByText('$125,430')).toBeDefined();
  });

  it('renders icon when provided', () => {
    render(<KpiCard {...defaultProps} />);

    // Icon should be present in the DOM (Lucide icons render as SVG)
    const iconElement = screen.getByRole('img', { hidden: true });
    expect(iconElement).toBeDefined();
  });

  it('renders description when provided', () => {
    render(
      <KpiCard
        {...defaultProps}
        description="Monthly recurring revenue"
      />
    );

    expect(screen.getByText('Monthly recurring revenue')).toBeDefined();
  });

  it('renders trend information when provided', () => {
    render(
      <KpiCard
        {...defaultProps}
        trend={{
          value: '+12.5%',
          direction: 'up',
          period: 'vs last month',
        }}
      />
    );

    expect(screen.getByText('+12.5%')).toBeDefined();
    expect(screen.getByText('vs last month')).toBeDefined();
  });

  it('applies correct trend styling for upward trend', () => {
    render(
      <KpiCard
        {...defaultProps}
        trend={{
          value: '+12.5%',
          direction: 'up',
        }}
      />
    );

    const trendElement = screen.getByText('+12.5%');
    expect(trendElement.className).toContain('text-lamt-success');
  });

  it('applies correct trend styling for downward trend', () => {
    render(
      <KpiCard
        {...defaultProps}
        trend={{
          value: '-5.2%',
          direction: 'down',
        }}
      />
    );

    const trendElement = screen.getByText('-5.2%');
    expect(trendElement.className).toContain('text-lamt-danger');
  });

  it('renders without trend when not provided', () => {
    render(<KpiCard {...defaultProps} />);

    // Should not find any trend-specific text
    expect(screen.queryByText('%')).toBeNull();
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

    expect(container.firstChild?.className).toContain('custom-class');
  });
});