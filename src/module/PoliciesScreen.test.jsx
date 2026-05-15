import { screen, fireEvent, waitFor } from '@testing-library/react';
import { getPolicies, getAgentsByPolicy, getPolicyFull } from '../services/fleetApi.js';
import { PoliciesScreen } from './PoliciesScreen.jsx';
import { renderWithProviders } from '../test-utils.jsx';

jest.mock('../services/fleetApi.js');
jest.mock('react-i18next', () => ({
	useTranslation: () => ({ t: (k) => k }),
}));

const POLICIES = [
	{ id: 'p1', name: 'Default Policy', description: 'desc1', updated_at: '2024-01-01T00:00:00Z' },
	{ id: 'p2', name: 'Production Policy', description: 'desc2', updated_at: '2024-02-01T00:00:00Z' },
];

const AGENTS_MIXED = [
	{ local_metadata: { elastic: { agent: { unprivileged: true } } } },
	{ local_metadata: { elastic: { agent: { unprivileged: true } } } },
	{ local_metadata: { elastic: { agent: { unprivileged: false } } } },
	{ local_metadata: {} },
];

beforeEach(() => {
	jest.clearAllMocks();
	getPolicies.mockResolvedValue({ total: 2, items: POLICIES });
	getAgentsByPolicy.mockResolvedValue({ list: [] });
	getPolicyFull.mockResolvedValue({ name: 'Default Policy', namespace: 'default' });
});

// Cycle 1 — getAgentsByPolicy is called per policy
it('calls getAgentsByPolicy for each policy after load', async () => {
	renderWithProviders(<PoliciesScreen />);
	await waitFor(() => {
		expect(getAgentsByPolicy).toHaveBeenCalledWith('p1');
		expect(getAgentsByPolicy).toHaveBeenCalledWith('p2');
	});
});

// Cycle 2 — privilege counts render as "X / Y (total)"
it('displays unprivileged / privileged counts', async () => {
	getPolicies.mockResolvedValue({ total: 1, items: [POLICIES[0]] });
	getAgentsByPolicy.mockResolvedValue({ list: AGENTS_MIXED });
	renderWithProviders(<PoliciesScreen />);
	expect(await screen.findByText('2 / 2 (4)')).toBeInTheDocument();
});

// Cycle 3 — clicking "View policy" opens modal
it('clicking "View policy" opens the modal', async () => {
	getPolicies.mockResolvedValue({ total: 1, items: [POLICIES[0]] });
	renderWithProviders(<PoliciesScreen />);
	fireEvent.click(await screen.findByRole('button', { name: /view policy/i }));
	expect(screen.getByRole('dialog')).toBeInTheDocument();
});

// Cycle 4 — modal fetches getPolicyFull and shows YAML
it('modal shows YAML from getPolicyFull', async () => {
	getPolicies.mockResolvedValue({ total: 1, items: [POLICIES[0]] });
	getPolicyFull.mockResolvedValue({ name: 'Default Policy', namespace: 'default' });
	renderWithProviders(<PoliciesScreen />);
	fireEvent.click(await screen.findByRole('button', { name: /view policy/i }));
	await waitFor(() => expect(getPolicyFull).toHaveBeenCalledWith('p1'));
	expect(await screen.findByText(/name: Default Policy/)).toBeInTheDocument();
});

// Cycle 5 — Copy button writes YAML to clipboard
it('Copy button writes YAML content to clipboard', async () => {
	Object.assign(navigator, { clipboard: { writeText: jest.fn() } });
	getPolicies.mockResolvedValue({ total: 1, items: [POLICIES[0]] });
	getPolicyFull.mockResolvedValue({ name: 'Default Policy', namespace: 'default' });
	renderWithProviders(<PoliciesScreen />);
	fireEvent.click(await screen.findByRole('button', { name: /view policy/i }));
	await screen.findByText(/name: Default Policy/);
	fireEvent.click(screen.getByRole('button', { name: /ElasticAgent\|Copy/i }));
	expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
		expect.stringContaining('name: Default Policy'),
	);
});

// Cycle 6 — Close button dismisses modal
it('Close button dismisses the modal', async () => {
	getPolicies.mockResolvedValue({ total: 1, items: [POLICIES[0]] });
	getPolicyFull.mockResolvedValue({ name: 'Default Policy', namespace: 'default' });
	renderWithProviders(<PoliciesScreen />);
	fireEvent.click(await screen.findByRole('button', { name: /view policy/i }));
	await screen.findByText(/name: Default Policy/);
	fireEvent.click(screen.getByRole('button', { name: /ElasticAgent\|Close/i }));
	await waitFor(() =>
		expect(screen.queryByText(/name: Default Policy/)).not.toBeInTheDocument(),
	);
});
