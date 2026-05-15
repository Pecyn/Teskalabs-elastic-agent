const BASE = '/kibana-api';

const headers = {
	'Content-Type': 'application/json',
	'kbn-xsrf': 'true',
	...(process.env.KIBANA_API_KEY && {
		Authorization: `ApiKey ${process.env.KIBANA_API_KEY}`,
	}),
};

async function request(path) {
	const response = await fetch(`${BASE}${path}`, { headers });
	if (!response.ok) {
		throw new Error(`Fleet API error: ${response.status} ${response.statusText}`);
	}
	return response.json();
}

export function getAgents(params = {}) {
	const q = new URLSearchParams();
	if (params.page)       q.set('page', params.page);
	if (params.perPage)    q.set('perPage', params.perPage);
	if (params.sort_field) q.set('sort_field', params.sort_field);
	if (params.sort_order) q.set('sort_order', params.sort_order);
	if (params.kuery)      q.set('kuery', params.kuery);
	const qs = q.toString();
	return request(`/api/fleet/agents${qs ? `?${qs}` : ''}`);
}

export function getAgentById(id) {
	return request(`/api/fleet/agents/${id}`);
}

export function getPolicies(params = {}) {
	const q = new URLSearchParams();
	if (params.page)       q.set('page', params.page);
	if (params.perPage)    q.set('perPage', params.perPage);
	if (params.sort_field) q.set('sort_field', params.sort_field);
	if (params.sort_order) q.set('sort_order', params.sort_order);
	if (params.kuery)      q.set('kuery', params.kuery);
	const qs = q.toString();
	return request(`/api/fleet/agent_policies${qs ? `?${qs}` : ''}`);
}

export function getPolicyById(id) {
	return request(`/api/fleet/agent_policies/${id}`);
}

export const getPolicyFull = (policyId) =>
	request(`/api/fleet/agent_policies/${policyId}/full`);

export const getAgentsByPolicy = (policyId) =>
	request(`/api/fleet/agents?kuery=(fleet-agents.policy_id:"${policyId}")&perPage=10000&showInactive=false`);

export async function getAgentLogs(agentId) {
	const res = await fetch('/es-api/logs-elastic_agent-*/_search?ignore_unavailable=true', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `ApiKey ${process.env.ELASTICSEARCH_AGENT_LOGS_API_KEY}`,
		},
		body: JSON.stringify({
			query: {
				bool: {
					filter: [
						{ term: { 'elastic_agent.id': agentId } },
						{ range: { '@timestamp': { gte: 'now-1d' } } },
					],
				},
			},
			sort: [{ '@timestamp': { order: 'desc' } }],
			size: 100,
			_source: ['@timestamp', 'message', 'log.level', 'component.id', 'error.message'],
		}),
	});
	if (!res.ok) throw new Error(`Elasticsearch error: ${res.status} ${res.statusText}`);
	const data = await res.json();
	return data.hits.hits.map(h => ({
		timestamp: h._source['@timestamp'],
		level:     h._source.log?.level,
		component: h._source.component?.id,
		message:   h._source.message,
		error:     h._source.error?.message,
	}));
}

export function getEnrollmentTokens(params = {}) {
	const q = new URLSearchParams();
	if (params.page)       q.set('page', params.page);
	if (params.perPage)    q.set('perPage', params.perPage);
	if (params.sort_field) q.set('sort_field', params.sort_field);
	if (params.sort_order) q.set('sort_order', params.sort_order);
	if (params.kuery)      q.set('kuery', params.kuery);
	const qs = q.toString();
	return request(`/api/fleet/enrollment_api_keys${qs ? `?${qs}` : ''}`);
}
