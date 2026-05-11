import { useState, useEffect } from 'react';
import { Container, Spinner, Alert } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { DataTableCard2, DateTime } from 'asab_webui_components';
import { getAgents } from '../services/fleetApi.js';

const BADGE = {
	display: 'inline-block',
	padding: '0.35em 0.65em',
	fontSize: '0.75em',
	fontWeight: 700,
	lineHeight: 1,
	borderRadius: '0.375rem',
	whiteSpace: 'nowrap',
};

const STATUS_STYLE = {
	online:     { ...BADGE, backgroundColor: '#198754', color: '#fff' },
	active:     { ...BADGE, backgroundColor: '#198754', color: '#fff' },
	offline:    { ...BADGE, backgroundColor: '#3d4349', color: '#fff' },
	inactive:   { ...BADGE, backgroundColor: '#3d4349', color: '#fff' },
	degraded:   { ...BADGE, backgroundColor: '#fd7e14', color: '#fff' },
	enrolling:  { ...BADGE, backgroundColor: '#0dcaf0', color: '#000' },
	updating:   { ...BADGE, backgroundColor: '#0d6efd', color: '#fff' },
	unenrolled: { ...BADGE, backgroundColor: '#dc3545', color: '#fff' },
	error:      { ...BADGE, backgroundColor: '#dc3545', color: '#fff' },
};

const UNKNOWN_STYLE = { ...BADGE, backgroundColor: '#3d4349', color: '#fff' };

const STATUS_KEY = {
	online:     'ElasticAgent|Online',
	active:     'ElasticAgent|Active',
	offline:    'ElasticAgent|Offline',
	inactive:   'ElasticAgent|Inactive',
	degraded:   'ElasticAgent|Degraded',
	enrolling:  'ElasticAgent|Enrolling',
	updating:   'ElasticAgent|Updating',
	unenrolled: 'ElasticAgent|Unenrolled',
	error:      'ElasticAgent|Error',
};

const getColumns = (t) => [
	{
		title: (
			<span>
				<i className="bi bi-pc-display me-1" />
				{t('ElasticAgent|Agent name')}
			</span>
		),
		sort: 'name',
		colStyle: { width: '22%' },
		render: ({ row }) => (
			<Link to={`/agents/${row.id}`} state={{ from: 'agents' }}>
				{row.name}
			</Link>
		),
	},
	{
		title: (
			<span>
				<i className="bi bi-circle-fill me-1" />
				{t('ElasticAgent|Status')}
			</span>
		),
		sort: 'status',
		colStyle: { width: '13%' },
		render: ({ row }) => (
			<span style={STATUS_STYLE[row.status] ?? UNKNOWN_STYLE}>
				{t(STATUS_KEY[row.status] ?? 'ElasticAgent|Unknown')}
			</span>
		),
	},
	{
		title: (
			<span>
				<i className="bi bi-file-earmark-text me-1" />
				{t('ElasticAgent|Policy')}
			</span>
		),
		sort: 'policy',
		colStyle: { width: '20%' },
		render: ({ row }) => <span>{row.policy}</span>,
	},
	{
		title: (
			<span>
				<i className="bi bi-tag me-1" />
				{t('ElasticAgent|Version')}
			</span>
		),
		sort: 'version',
		colStyle: { width: '12%' },
		render: ({ row }) => <span>{row.version}</span>,
	},
	{
		title: (
			<span>
				<i className="bi bi-clock me-1" />
				{t('ElasticAgent|Last activity')}
			</span>
		),
		sort: 'last_activity',
		colStyle: { width: '20%' },
		render: ({ row }) => <DateTime value={row.last_activity} />,
	},
	{
		title: (
			<span>
				<i className="bi bi-display me-1" />
				{t('ElasticAgent|OS')}
			</span>
		),
		sort: 'os',
		colStyle: { width: '13%' },
		render: ({ row }) => <span>{row.os}</span>,
	},
];

export function AgentsScreen() {
	const { t } = useTranslation();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [agents, setAgents] = useState([]);

	useEffect(() => {
		getAgents()
			.then((data) => {
				setAgents(data.items ?? []);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message);
				setLoading(false);
			});
	}, []);

	const loader = async ({ params }) => {
		const page = Number(params.p ?? 1);
		const limit = Number(params.i ?? 20);
		const start = (page - 1) * limit;
		const rows = agents.slice(start, start + limit).map((agent) => ({
			id: agent.id,
			name: agent.local_metadata?.host?.hostname ?? agent.id,
			status: agent.status,
			policy: agent.policy_id,
			version: agent.agent?.version,
			last_activity: agent.last_checkin,
			os: agent.local_metadata?.os?.name,
		}));
		return { count: agents.length, rows };
	};

	const columns = getColumns(t);

	if (loading) {
		return (
			<Container className="h-100 d-flex align-items-center justify-content-center">
				<Spinner />
			</Container>
		);
	}

	if (error) {
		return (
			<Container className="h-100 pt-4">
				<Alert color="danger">{error}</Alert>
			</Container>
		);
	}

	return (
		<Container className="h-100">
			<DataTableCard2
				columns={columns}
				initialLimit={20}
				loader={loader}
				header={
					<div>
						<h5 className="mb-0">
							<i className="bi bi-hdd-network me-2" />
							{t('ElasticAgent|Agents')}
						</h5>
					</div>
				}
			/>
		</Container>
	);
}
