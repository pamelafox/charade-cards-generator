import { describe, it, expect, vi } from 'vitest';
import { triggerPrint } from '../../js/services/print-service.js';

describe('triggerPrint', () => {
  it('calls window.print()', () => {
    // Mock window.print
    const mockPrint = vi.fn();
    vi.stubGlobal('window', { print: mockPrint });

    triggerPrint();

    expect(mockPrint).toHaveBeenCalledOnce();

    vi.unstubAllGlobals();
  });
});
