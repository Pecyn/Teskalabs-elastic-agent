export const MOCK_AGENTS = [
	{ id: 'a1b2c3d4', name: 'prod-web-01', status: 'active', policy: 'Production Web', version: '8.13.0', last_activity: '2024-03-15T10:30:00Z', os: 'Ubuntu 22.04', enrolled_at: '2024-01-10T09:00:00Z', ip: '10.0.1.10', hostname: 'prod-web-01.internal' },
	{ id: 'e5f6g7h8', name: 'prod-db-01', status: 'active', policy: 'Production DB', version: '8.13.0', last_activity: '2024-03-15T10:25:00Z', os: 'CentOS 8', enrolled_at: '2024-01-12T11:00:00Z', ip: '10.0.1.20', hostname: 'prod-db-01.internal' },
	{ id: 'i9j0k1l2', name: 'staging-app-01', status: 'inactive', policy: 'Staging', version: '8.12.1', last_activity: '2024-03-14T08:00:00Z', os: 'Ubuntu 20.04', enrolled_at: '2024-02-01T14:00:00Z', ip: '10.0.2.10', hostname: 'staging-app-01.internal' },
	{ id: 'm3n4o5p6', name: 'dev-local-01', status: 'enrolling', policy: 'Development', version: '8.13.0', last_activity: '2024-03-15T10:00:00Z', os: 'macOS 14.3', enrolled_at: '2024-03-15T09:55:00Z', ip: '192.168.1.100', hostname: 'devmachine.local' },
	{ id: 'q7r8s9t0', name: 'prod-monitor-01', status: 'unenrolled', policy: 'Monitoring', version: '8.11.0', last_activity: '2024-02-28T16:00:00Z', os: 'Debian 11', enrolled_at: '2023-12-01T10:00:00Z', ip: '10.0.1.30', hostname: 'prod-monitor-01.internal' },
];

export const MOCK_POLICIES = [
	{ id: 'pol-001', name: 'Production Web', description: 'Monitoring policy for production web servers', agents_enrolled: 2, created_at: '2024-01-05T09:00:00Z' },
	{ id: 'pol-002', name: 'Production DB', description: 'Monitoring policy for database servers with log collection', agents_enrolled: 1, created_at: '2024-01-05T09:30:00Z' },
	{ id: 'pol-003', name: 'Staging', description: 'Policy for staging environment', agents_enrolled: 1, created_at: '2024-02-01T10:00:00Z' },
	{ id: 'pol-004', name: 'Development', description: 'Lightweight policy for developer machines', agents_enrolled: 1, created_at: '2024-03-01T09:00:00Z' },
	{ id: 'pol-005', name: 'Monitoring', description: 'Infrastructure monitoring for ops team', agents_enrolled: 0, created_at: '2023-11-15T08:00:00Z' },
];

export const MOCK_TOKENS = [
	{ id: 'tok-001', name: 'Production Web Token', policy: 'Production Web', token: 'AA==:prod-web-abc123xyz456def789', created_at: '2024-01-05T09:00:00Z', expires_at: '2025-01-05T09:00:00Z', active: true },
	{ id: 'tok-002', name: 'Production DB Token', policy: 'Production DB', token: 'BB==:prod-db-def012ghi345jkl678', created_at: '2024-01-05T09:30:00Z', expires_at: null, active: true },
	{ id: 'tok-003', name: 'Staging Token', policy: 'Staging', token: 'CC==:staging-mno901pqr234stu567', created_at: '2024-02-01T10:00:00Z', expires_at: '2024-08-01T10:00:00Z', active: false },
	{ id: 'tok-004', name: 'Development Token', policy: 'Development', token: 'DD==:dev-vwx890yza123bcd456ef', created_at: '2024-03-01T09:00:00Z', expires_at: null, active: true },
];
