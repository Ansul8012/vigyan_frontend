import { act, render, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import QRScanner from '@/components/QRScanner';

let scannerInstance;
const startMock = vi.fn();
const stopMock = vi.fn();
const clearMock = vi.fn();

vi.mock('html5-qrcode', () => ({
  Html5Qrcode: vi.fn().mockImplementation(() => {
    scannerInstance = {
      start: startMock,
      stop: stopMock,
      clear: clearMock,
      getState: vi.fn(() => 2),
    };

    return scannerInstance;
  }),
}));

describe('QRScanner', () => {
  beforeEach(() => {
    vi.useRealTimers();
    startMock.mockReset();
    stopMock.mockReset();
    clearMock.mockReset();

    startMock.mockImplementation(async (_cameraConfig, _scanConfig, onSuccess) => {
      scannerInstance.onSuccess = onSuccess;
    });

    stopMock.mockResolvedValue(undefined);
    clearMock.mockResolvedValue(undefined);
  });

  it('stops camera cleanup before forwarding a successful scan', async () => {
    const events = [];
    stopMock.mockImplementation(async () => {
      events.push('stop');
    });

    const onScan = vi.fn(() => {
      events.push('onScan');
    });

    render(<QRScanner onScan={onScan} onClose={vi.fn()} />);

    await waitFor(() => expect(startMock).toHaveBeenCalled());

    await act(async () => {
      await scannerInstance.onSuccess('QR_LOGIN_OK');
    });

    expect(stopMock).toHaveBeenCalledTimes(1);
    expect(clearMock).toHaveBeenCalledTimes(1);
    expect(onScan).toHaveBeenCalledWith('QR_LOGIN_OK');
    expect(events).toEqual(['stop', 'onScan']);
  });
});