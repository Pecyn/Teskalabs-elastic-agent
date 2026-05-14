import { screen } from '@testing-library/react';
import { getAgentById } from '../services/fleetApi.js';
import { AgentDetailScreen } from './AgentDetailScreen.jsx';
import { renderWithProviders } from '../test-utils.jsx';

jest.mock('../services/fleetApi.js');
jest.mock('react-i18next', () => ({
	useTranslation: () => ({ t: (k) => k }),
}));

const AGENT_RESPONSE = {
	item: {
		id: 'agent-1',
		status: 'online',
		local_metadata: {
			host: { hostname: 'my-host', ip: ['10.0.0.1'] },
			os: { full: 'Ubuntu 22.04' },
		},
		agent: { version: '8.12.0' },
		policy_id: 'policy-abc',
		enrolled_at: '2024-01-01T00:00:00Z',
		last_checkin: '2024-01-02T00:00:00Z',
	},
};

test('renders agent hostname when API succeeds', async () => {
	getAgentById.mockResolvedValue(AGENT_RESPONSE);
	renderWithProviders(<AgentDetailScreen />, {
		route: '/agents/agent-1',
		path: '/agents/:id',
	});
	expect(await screen.findByText('my-host')).toBeInTheDocument();
});

test('shows loading skeleton while fetching', () => {
	getAgentById.mockImplementation(() => new Promise(() => {}));
	renderWithProviders(<AgentDetailScreen />, {
		route: '/agents/agent-1',
		path: '/agents/:id',
	});
	expect(document.querySelector('.placeholder')).toBeInTheDocument();
	expect(screen.queryByText('my-host')).not.toBeInTheDocument();
});

test('shows error message when API fails', async () => {
	getAgentById.mockRejectedValue(new Error('Network error'));
	renderWithProviders(<AgentDetailScreen />, {
		route: '/agents/agent-1',
		path: '/agents/:id',
	});
	expect(await screen.findByText(/Network error/)).toBeInTheDocument();
});
