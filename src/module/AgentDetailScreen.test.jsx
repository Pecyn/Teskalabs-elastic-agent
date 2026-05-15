import { screen, fireEvent, waitFor } from '@testing-library/react';
import { getAgentById, getAgentLogs } from '../services/fleetApi.js';
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

const RENDER_OPTS = { route: '/agents/agent-1', path: '/agents/:id' };

// ── Existing tests (unchanged) ────────────────────────────────────────────────

test('renders agent hostname when API succeeds', async () => {
	getAgentById.mockResolvedValue(AGENT_RESPONSE);
	renderWithProviders(<AgentDetailScreen />, RENDER_OPTS);
	expect(await screen.findByText('my-host')).toBeInTheDocument();
});

test('shows loading skeleton while fetching', () => {
	getAgentById.mockImplementation(() => new Promise(() => {}));
	renderWithProviders(<AgentDetailScreen />, RENDER_OPTS);
	expect(document.querySelector('.placeholder')).toBeInTheDocument();
	expect(screen.queryByText('my-host')).not.toBeInTheDocument();
});

test('shows error message when API fails', async () => {
	getAgentById.mockRejectedValue(new Error('Network error'));
	renderWithProviders(<AgentDetailScreen />, RENDER_OPTS);
	expect(await screen.findByText(/Network error/)).toBeInTheDocument();
});

// ── Logs tab cycles ───────────────────────────────────────────────────────────

describe('Logs tab', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		getAgentById.mockResolvedValue(AGENT_RESPONSE);
	});

	// Cycle 7 — default tab shows details, LogsTab not mounted
	it('shows agent details by default without calling getAgentLogs', async () => {
		renderWithProviders(<AgentDetailScreen />, RENDER_OPTS);

		expect(await screen.findByText('my-host')).toBeInTheDocument();
		expect(getAgentLogs).not.toHaveBeenCalled();
	});

	// Cycle 8 — clicking Logs tab triggers fetch
	it('fetches logs only after clicking Logs tab', async () => {
		getAgentLogs.mockResolvedValue([]);
		renderWithProviders(<AgentDetailScreen />, RENDER_OPTS);
		await screen.findByText('my-host');

		fireEvent.click(screen.getByText('ElasticAgent|Logs'));

		await waitFor(() => expect(getAgentLogs).toHaveBeenCalledWith('agent-1'));
	});

	// Cycle 9 — log rows render
	it('renders a row for each log entry', async () => {
		getAgentLogs.mockResolvedValue([
			{
				timestamp: '2026-05-15T08:15:00.000Z',
				level: 'info',
				component: 'filebeat',
				message: 'Checkin succeeded',
				error: null,
			},
		]);
		renderWithProviders(<AgentDetailScreen />, RENDER_OPTS);
		await screen.findByText('my-host');

		fireEvent.click(screen.getByText('ElasticAgent|Logs'));

		expect(await screen.findByText('Checkin succeeded')).toBeInTheDocument();
		expect(screen.getByText('filebeat')).toBeInTheDocument();
	});

	// Cycle 10 — error state
	it('shows Alert when getAgentLogs rejects', async () => {
		getAgentLogs.mockRejectedValue(new Error('Elasticsearch error: 403 Forbidden'));
		renderWithProviders(<AgentDetailScreen />, RENDER_OPTS);
		await screen.findByText('my-host');

		fireEvent.click(screen.getByText('ElasticAgent|Logs'));

		expect(await screen.findByRole('alert')).toBeInTheDocument();
		expect(screen.getByText(/403 Forbidden/)).toBeInTheDocument();
	});

	// Cycle 11 — null error field renders empty cell
	it('shows empty error cell when error is null', async () => {
		getAgentLogs.mockResolvedValue([
			{
				timestamp: '2026-05-15T08:00:00Z',
				level: 'info',
				component: 'elastic-agent',
				message: 'ok',
				error: null,
			},
		]);
		renderWithProviders(<AgentDetailScreen />, RENDER_OPTS);
		await screen.findByText('my-host');

		fireEvent.click(screen.getByText('ElasticAgent|Logs'));
		await screen.findByText('ok');

		const rows = screen.getAllByRole('row');
		expect(rows[1].cells[4].textContent).toBe('');
	});
});
