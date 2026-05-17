import { screen } from '@testing-library/react';
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
	expiration: null,
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

// Cycle 3 — unknown policy shows only (id), no name
test('policy column shows only id when policy is unknown', async () => {
	getEnrollmentTokens.mockResolvedValue({ total: 1, items: [{ ...TOKEN, policy_id: 'unknown-id' }] });
	getPolicies.mockResolvedValue({ total: 1, items: [{ id: 'p1', name: 'My Policy' }] });
	renderWithProviders(<EnrollmentTokensScreen />);
	expect(await screen.findByText(/\(unknown-id\)/)).toBeInTheDocument();
	expect(screen.queryByText(/My Policy/)).not.toBeInTheDocument();
});
