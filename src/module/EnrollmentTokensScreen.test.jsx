import { screen, fireEvent, waitFor } from '@testing-library/react';
import { getEnrollmentTokens, getPolicies } from '../services/fleetApi.js';
import { EnrollmentTokensScreen } from './EnrollmentTokensScreen.jsx';
import { renderWithProviders } from '../test-utils.jsx';

jest.mock('../services/fleetApi.js');
jest.mock('react-i18next', () => ({
	useTranslation: () => ({ t: (k) => k }),
}));

const TOKEN = {
	id: 't1',
	name: 'Default Token',
	policy_id: 'p1',
	api_key: 'abc-123',
	active: true,
	created_at: '2026-05-17T10:00:00Z',
};

beforeEach(() => {
	jest.clearAllMocks();
	getPolicies.mockResolvedValue({ total: 0, items: [] });
	getEnrollmentTokens.mockResolvedValue({ total: 0, items: [] });
});

// Cycle 1 — policy column shows policy name
test('policy column shows policy name', async () => {
	getEnrollmentTokens.mockResolvedValue({ total: 1, items: [TOKEN] });
	getPolicies.mockResolvedValue({ total: 1, items: [{ id: 'p1', name: 'My Policy' }] });
	renderWithProviders(<EnrollmentTokensScreen />);
	expect(await screen.findByText(/My Policy/)).toBeInTheDocument();
});

// Cycle 2 — policy column shows policy id in parentheses
test('policy column shows policy id in parentheses', async () => {
	getEnrollmentTokens.mockResolvedValue({ total: 1, items: [TOKEN] });
	getPolicies.mockResolvedValue({ total: 1, items: [{ id: 'p1', name: 'My Policy' }] });
	renderWithProviders(<EnrollmentTokensScreen />);
	expect(await screen.findByText(/\(p1\)/)).toBeInTheDocument();
});

// Cycle 8 — modal body shows the token value
test('modal body shows the token value', async () => {
	getEnrollmentTokens.mockResolvedValue({ total: 1, items: [TOKEN] });
	renderWithProviders(<EnrollmentTokensScreen />);
	fireEvent.click(await screen.findByRole('button', { name: /view token/i }));
	expect(await screen.findByText('abc-123')).toBeInTheDocument();
});

// Cycle 9 — Copy button copies token to clipboard
test('Copy button copies token to clipboard', async () => {
	Object.assign(navigator, { clipboard: { writeText: jest.fn() } });
	getEnrollmentTokens.mockResolvedValue({ total: 1, items: [TOKEN] });
	renderWithProviders(<EnrollmentTokensScreen />);
	fireEvent.click(await screen.findByRole('button', { name: /view token/i }));
	await screen.findByText('abc-123');
	fireEvent.click(screen.getByRole('button', { name: /ElasticAgent\|Copy/i }));
	expect(navigator.clipboard.writeText).toHaveBeenCalledWith('abc-123');
});

// Cycle 10 — Close button dismisses the modal
test('Close button dismisses the modal', async () => {
	getEnrollmentTokens.mockResolvedValue({ total: 1, items: [TOKEN] });
	renderWithProviders(<EnrollmentTokensScreen />);
	fireEvent.click(await screen.findByRole('button', { name: /view token/i }));
	await screen.findByText('abc-123');
	fireEvent.click(screen.getByRole('button', { name: /ElasticAgent\|Close/i }));
	await waitFor(() => expect(screen.queryByText('abc-123')).not.toBeInTheDocument());
});

// Cycle 7 — modal title contains the token name
test('modal title contains the token name', async () => {
	getEnrollmentTokens.mockResolvedValue({ total: 1, items: [TOKEN] });
	renderWithProviders(<EnrollmentTokensScreen />);
	fireEvent.click(await screen.findByRole('button', { name: /view token/i }));
	expect(screen.getByRole('dialog')).toHaveTextContent('Default Token');
});

// Cycle 6 — clicking "View token" opens a modal
test('clicking "View token" opens a modal', async () => {
	getEnrollmentTokens.mockResolvedValue({ total: 1, items: [TOKEN] });
	renderWithProviders(<EnrollmentTokensScreen />);
	fireEvent.click(await screen.findByRole('button', { name: /view token/i }));
	expect(screen.getByRole('dialog')).toBeInTheDocument();
});

// Cycle 5 — View token button appears per row
test('"View token" button appears per row', async () => {
	getEnrollmentTokens.mockResolvedValue({ total: 1, items: [TOKEN] });
	renderWithProviders(<EnrollmentTokensScreen />);
	expect(await screen.findByRole('button', { name: /view token/i })).toBeInTheDocument();
});

// Cycle 4 — token value not visible inline in the table
test('token value is not displayed inline in the table', async () => {
	getEnrollmentTokens.mockResolvedValue({ total: 1, items: [TOKEN] });
	renderWithProviders(<EnrollmentTokensScreen />);
	await screen.findByText('Default Token');
	expect(screen.queryByDisplayValue('abc-123')).not.toBeInTheDocument();
});

// Cycle 3 — unknown policy shows only (id), no name
test('policy column shows only id when policy is unknown', async () => {
	getEnrollmentTokens.mockResolvedValue({ total: 1, items: [{ ...TOKEN, policy_id: 'unknown-id' }] });
	getPolicies.mockResolvedValue({ total: 1, items: [{ id: 'p1', name: 'My Policy' }] });
	renderWithProviders(<EnrollmentTokensScreen />);
	expect(await screen.findByText(/\(unknown-id\)/)).toBeInTheDocument();
	expect(screen.queryByText(/My Policy/)).not.toBeInTheDocument();
});
