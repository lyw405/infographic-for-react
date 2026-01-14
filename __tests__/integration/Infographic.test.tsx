import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { Infographic } from '../../src/components';

const mockRenderer = {
  render: vi.fn(),
  update: vi.fn(),
  toDataURL: vi.fn().mockResolvedValue('data:image/svg+xml;base64,test'),
  getTypes: vi.fn(() => ['test-type']),
  destroy: vi.fn(),
  on: vi.fn(),
  off: vi.fn(),
};

vi.mock('../../src/hooks/useRenderer', () => ({
  useRenderer: () => ({
    render: vi.fn(),
    update: vi.fn(),
    toDataURL: mockRenderer.toDataURL,
    getTypes: mockRenderer.getTypes,
    destroy: mockRenderer.destroy,
  }),
}));

vi.mock('../../src/hooks/useInfographic', () => ({
  useInfographic: () => ({
    toDataURL: mockRenderer.toDataURL,
    getTypes: mockRenderer.getTypes,
    update: mockRenderer.update,
    destroy: mockRenderer.destroy,
  }),
}));

describe('Infographic Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render container element', () => {
    const { container } = render(<Infographic dsl='{"test":"value"}' />);
    const divElement = container.querySelector('[data-infographic-container]');
    expect(divElement).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(<Infographic dsl='{"test":"value"}' className="custom-class" />);
    const divElement = container.querySelector('[data-infographic-container]');
    expect(divElement).toHaveClass('custom-class');
  });

  it('should apply custom width and height', () => {
    const { container } = render(<Infographic dsl='{"test":"value"}' width={800} height={600} />);
    const divElement = container.querySelector('[data-infographic-container]');
    expect(divElement).toHaveStyle({ width: '800px', height: '600px' });
  });

  it('should expose ref methods', () => {
    const ref: any = { current: null };
    render(<Infographic dsl='{"test":"value"}' ref={ref} />);

    expect(ref.current).toBeDefined();
    expect(typeof ref.current.toDataURL).toBe('function');
    expect(typeof ref.current.update).toBe('function');
    expect(typeof ref.current.destroy).toBe('function');
    expect(typeof ref.current.getTypes).toBe('function');
  });
});
