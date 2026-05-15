import { getAgentLogs } from './fleetApi.js';

beforeAll(() => {
	process.env.ELASTICSEARCH_AGENT_LOGS_API_KEY = 'test-key';
});

function mockFetch(hits = [], { ok = true, status = 200 } = {}) {
	global.fetch = jest.fn().mockResolvedValue({
		ok,
		status,
		statusText: ok ? 'OK' : 'Forbidden',
		json: () => Promise.resolve({ hits: { hits } }),
	});
}

const makeHit = (overrides = {}) => ({
	_source: {
		'@timestamp': '2026-05-15T08:15:00.000Z',
		message: 'Checkin request succeeded',
		log: { level: 'info' },
		component: { id: 'elastic-agent' },
		error: null,
		...overrides,
	},
});

describe('getAgentLogs', () => {
	// Cycle 1 — tracer bullet: maps response hits
	it('maps response hits to log entries', async () => {
		mockFetch([makeHit()]);

		const result = await getAgentLogs('agent-123');

		expect(result).toHaveLength(1);
		expect(result[0]).toEqual({
			timestamp: '2026-05-15T08:15:00.000Z',
			level: 'info',
			component: 'elastic-agent',
			message: 'Checkin request succeeded',
			error: undefined,
		});
	});

	// Cycle 2 — correct endpoint and method
	it('POSTs to /es-api/logs-elastic_agent-*/_search', async () => {
		mockFetch();
		await getAgentLogs('agent-1');

		expect(global.fetch).toHaveBeenCalledWith(
			'/es-api/logs-elastic_agent-*/_search?ignore_unavailable=true',
			expect.objectContaining({ method: 'POST' })
		);
	});

	// Cycle 3 — agent ID filter
	it('filters by elastic_agent.id', async () => {
		mockFetch();
		await getAgentLogs('agent-xyz');

		const body = JSON.parse(global.fetch.mock.calls[0][1].body);
		expect(body.query.bool.filter).toContainEqual({
			term: { 'elastic_agent.id': 'agent-xyz' },
		});
	});

	// Cycle 4 — time range filter
	it('includes last-1-day range filter', async () => {
		mockFetch();
		await getAgentLogs('agent-1');

		const body = JSON.parse(global.fetch.mock.calls[0][1].body);
		expect(body.query.bool.filter).toContainEqual({
			range: { '@timestamp': { gte: 'now-1d' } },
		});
	});

	// Cycle 5 — size and sort
	it('requests size 100 sorted by timestamp desc', async () => {
		mockFetch();
		await getAgentLogs('agent-1');

		const body = JSON.parse(global.fetch.mock.calls[0][1].body);
		expect(body.size).toBe(100);
		expect(body.sort).toEqual([{ '@timestamp': { order: 'desc' } }]);
	});

	// Cycle 6 — error handling
	it('throws when response is not ok', async () => {
		mockFetch([], { ok: false, status: 403 });
		await expect(getAgentLogs('agent-1')).rejects.toThrow('403');
	});
});
