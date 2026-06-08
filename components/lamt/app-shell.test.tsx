import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppShell } from './app-shell';

// Mock Next.js router
const mockUsePathname = vi.fn(() => '/');
vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}));

describe('AppShell', () => {
  const defaultProps = {
    children: <div>Test Content</div>,
    navigation: [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
    ],
    user: {
      name: 'Test User',
      role: 'Admin',
      initials: 'TU',
    },
  };

  it('renders the app shell with navigation', () => {
    render(<AppShell {...defaultProps} />);

    // Check if navigation items are rendered
    expect(screen.getByText('Home')).toBeDefined();
    expect(screen.getByText('About')).toBeDefined();

    // Check if user info is rendered
    expect(screen.getByText('TU')).toBeDefined(); // User initials

    // Check if content is rendered
    expect(screen.getByText('Test Content')).toBeDefined();
  });

  it('handles null navigation items gracefully', () => {
    const propsWithNullItems = {
      ...defaultProps,
      navigation: [
        { label: 'Home', href: '/' },
        null as any, // This should be filtered out
        { label: 'About', href: '/about' },
        { label: '', href: '/empty' } as any, // This should be filtered out
      ],
    };

    expect(() => {
      render(<AppShell {...propsWithNullItems} />);
    }).not.toThrow();

    // Should only render valid navigation items
    expect(screen.getByText('Home')).toBeDefined();
    expect(screen.getByText('About')).toBeDefined();
  });

  it('shows active navigation state correctly', () => {
    mockUsePathname.mockReturnValue('/about');

    render(<AppShell {...defaultProps} />);

    const aboutLink = screen.getByText('About').closest('a');
    expect(aboutLink?.getAttribute('aria-current')).toBe('page');
  });

  it('renders with custom logo', () => {
    render(<AppShell {...defaultProps} logo="Custom Logo" />);

    expect(screen.getByText('Custom Logo')).toBeDefined();
  });

  it('renders notification count when provided', () => {
    render(<AppShell {...defaultProps} notificationCount={5} />);

    // The notification count should be rendered somewhere in the component
    expect(screen.getByText('5')).toBeDefined();
  });
});