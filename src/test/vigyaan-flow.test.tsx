import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import VigyaanDigitalLibrary from '@/pages/VigyaanDigitalLibrary';

const requestStoreState = {
  getPendingIssueRequests: () => [],
  getPendingReturnRequests: () => [],
  fulfillRequest: vi.fn(),
};

const bookStoreState = {
  issueBook: vi.fn(),
  returnBook: vi.fn(),
};

const vigyaanStoreState = {
  isOpen: true,
  openVigyaan: vi.fn(),
  closeVigyaan: vi.fn(),
};

vi.mock('@/store/requestStore', () => ({
  default: (selector) => (typeof selector === 'function' ? selector(requestStoreState) : requestStoreState),
}));

vi.mock('@/store/bookStore', () => ({
  default: (selector) => (typeof selector === 'function' ? selector(bookStoreState) : bookStoreState),
}));

vi.mock('@/store/vigyaanStore', () => ({
  default: (selector) => (typeof selector === 'function' ? selector(vigyaanStoreState) : vigyaanStoreState),
}));

vi.mock('@/components/QRScanner', () => ({
  default: ({ title, description }) => (
    <div data-testid="mock-qr-scanner">
      <p>{title}</p>
      <p>{description}</p>
    </div>
  ),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
  },
}));

describe('Vigyaan close flow', () => {
  it('replaces the close confirmation with the scanner instead of showing both', async () => {
    render(
      <MemoryRouter initialEntries={['/vigyaan']}>
        <VigyaanDigitalLibrary />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /close vigyaan/i }));
    expect(screen.getByText(/admin verification is required to close the digital library/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /verify & close/i }));

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: /close vigyaan\?/i })).not.toBeInTheDocument();
    });
    expect(screen.getByTestId('mock-qr-scanner')).toBeInTheDocument();
    expect(screen.getByText('Admin Verification')).toBeInTheDocument();
  });
});