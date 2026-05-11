import { useTranslation } from 'react-i18next';
import { Container } from 'reactstrap';
import { Link } from 'react-router';
import { DataTableCard2, DateTime } from 'asab_webui_components';
import { getAgents } from '../services/fleetApi.js';
import { makeFleetLoader } from '../services/fleetLoader.js';

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
				{t('ElasticAgent|Host')}
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

const loader = makeFleetLoader(
	getAgents,
	{
		name:          'local_metadata.host.hostname',
		status:        'status',
		policy:        'policy_id',
		version:       'agent.version',
		last_activity: 'last_checkin',
		os:            'local_metadata.os.name',
	},
	(agent) => ({
		id:            agent.id,
		name:          agent.local_metadata?.host?.hostname ?? agent.id,
		status:        agent.status,
		policy:        agent.policy_id,
		version:       agent.agent?.version,
		last_activity: agent.last_checkin,
		os:            agent.local_metadata?.os?.name,
	})
);

export function AgentsScreen() {
	const { t } = useTranslation();

	return (
		<Container className="h-100">
			<DataTableCard2
				columns={getColumns(t)}
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
