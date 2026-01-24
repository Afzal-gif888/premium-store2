import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import Icon from './AppIcon';
import '@testing-library/jest-dom'; // Ensure jest-dom matchers are available

test('AppIcon renders valid lucide icon', () => {
    const { container } = render(<Icon name="ShoppingBag" />);
    // Lucide icons render as SVGs
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('lucide-shopping-bag');
});

test('AppIcon handles missing icon gracefully', () => {
    // Depending on implementation, it might render null or a fallback
    // Based on previous reads, let's just check it doesn't crash
    const { container } = render(<Icon name="NonExistentIcon" />);
    expect(container).toBeDefined();
});
