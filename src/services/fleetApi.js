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

export function getAgents() {
	return request('/api/fleet/agents');
}

export function getAgentById(id) {
	return request(`/api/fleet/agents/${id}`);
}

export function getPolicies() {
	return request('/api/fleet/agent_policies');
}

export function getEnrollmentTokens() {
	return request('/api/fleet/enrollment_api_keys');
}
