import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Container } from 'reactstrap';
import { Link } from 'react-router';
import { DataTableCard2, DateTime, usePubSub } from 'asab_webui_components';
import { useQuery } from '@tanstack/react-query';
import { getAgents } from '../services/fleetApi.js';
import { makeFleetLoader, POLL_INTERVAL } from '../services/fleetLoader.js';
import { STATUS_STYLE, UNKNOWN_STYLE, STATUS_KEY } from './agentStatus.js';

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
		name: 'local_metadata.host.hostname',
		status: 'status',
		policy: 'policy_id',
		version: 'agent.version',
		last_activity: 'last_checkin',
		os: 'local_metadata.os.name',
	},
	(agent) => ({
		id: agent.id,
		name: agent.local_metadata?.host?.hostname ?? agent.id,
		status: agent.status,
		policy: agent.policy_id,
		version: agent.agent?.version,
		last_activity: agent.last_checkin,
		os: agent.local_metadata?.os?.name,
	}),
);

export function AgentsScreen() {
	const { t } = useTranslation();
	const { app } = usePubSub();
	const firstTick = useRef(true);
	const { dataUpdatedAt } = useQuery({
		queryKey: ['agents-tick'],
		queryFn: () => Promise.resolve(Date.now()),
		refetchInterval: POLL_INTERVAL,
		staleTime: 0,
	});

	useEffect(() => {
		if (firstTick.current) { firstTick.current = false; return; }
		app.PubSub.publish('Application.reload!', { mode: 'transparent' });
	}, [dataUpdatedAt]);

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
