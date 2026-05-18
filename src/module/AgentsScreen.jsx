import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Container } from 'reactstrap';
import { Link } from 'react-router';
import { DataTableCard2, DateTime, usePubSub } from 'asab_webui_components';
import { useQuery } from '@tanstack/react-query';
import { getAgents, getPolicies } from '../services/fleetApi.js';
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
		colStyle: { width: '20%' },
		render: ({ row }) => (
			<span>
				{row.policy_name && <>{row.policy_name}<br /></>}
				({row.policy_id})
			</span>
		),
	},
	{
		title: (
			<span>
				<i className="bi bi-tag me-1" />
				{t('ElasticAgent|Version')}
			</span>
		),
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
		colStyle: { width: '13%' },
		render: ({ row }) => <span>{row.os}</span>,
	},
];

const loader = makeFleetLoader(
	getAgents,
	(agent, policyMap = {}) => ({
		id: agent.id,
		name: agent.local_metadata?.host?.hostname ?? agent.id,
		status: agent.status,
		policy_id: agent.policy_id,
		policy_name: policyMap[agent.policy_id] ?? null,
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

	const { data: policiesData } = useQuery({
		queryKey: ['policies-for-agents'],
		queryFn: () => getPolicies({ perPage: 10000 }),
		staleTime: POLL_INTERVAL,
	});

	const policyMap = useMemo(() => {
		const map = {};
		(policiesData?.items ?? []).forEach(p => { map[p.id] = p.name; });
		return map;
	}, [policiesData]);

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
				loaderParams={policyMap}
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
