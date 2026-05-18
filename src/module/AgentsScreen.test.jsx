import { screen } from '@testing-library/react';
import { getAgents, getPolicies } from '../services/fleetApi.js';
import { AgentsScreen } from './AgentsScreen.jsx';
import { renderWithProviders } from '../test-utils.jsx';

jest.mock('../services/fleetApi.js');
jest.mock('react-i18next', () => ({
	useTranslation: () => ({ t: (k) => k }),
}));

const AGENT = {
	id: 'a1',
	policy_id: 'p1',
	status: 'online',
	agent: { version: '9.4.0' },
	last_checkin: '2026-05-17T10:13:00Z',
	local_metadata: { host: { hostname: 'my-host' }, os: { name: 'Linux' } },
};

beforeEach(() => {
	jest.clearAllMocks();
	getPolicies.mockResolvedValue({ total: 0, items: [] });
	getAgents.mockResolvedValue({ total: 0, items: [] });
});

// Cycle 6 — policy column shows policy name
test('policy column shows policy name', async () => {
	getAgents.mockResolvedValue({ total: 1, items: [AGENT] });
	getPolicies.mockResolvedValue({ total: 1, items: [{ id: 'p1', name: 'My Policy' }] });
	renderWithProviders(<AgentsScreen />);
	expect(await screen.findByText(/My Policy/)).toBeInTheDocument();
});

// Cycle 7 — policy ID shown in parentheses below name
test('policy column shows policy id in parentheses', async () => {
	getAgents.mockResolvedValue({ total: 1, items: [AGENT] });
	getPolicies.mockResolvedValue({ total: 1, items: [{ id: 'p1', name: 'My Policy' }] });
	renderWithProviders(<AgentsScreen />);
	expect(await screen.findByText(/\(p1\)/)).toBeInTheDocument();
});

// Cycle 8 — unknown policy shows only (id), no name
test('policy column shows only id when policy is unknown', async () => {
	getAgents.mockResolvedValue({ total: 1, items: [{ ...AGENT, policy_id: 'unknown-id' }] });
	getPolicies.mockResolvedValue({ total: 1, items: [{ id: 'p1', name: 'My Policy' }] });
	renderWithProviders(<AgentsScreen />);
	expect(await screen.findByText(/\(unknown-id\)/)).toBeInTheDocument();
	expect(screen.queryByText(/My Policy/)).not.toBeInTheDocument();
});
