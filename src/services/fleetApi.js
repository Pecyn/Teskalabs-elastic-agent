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
