import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Container } from 'reactstrap';
import { DataTableCard2, DateTime, usePubSub } from 'asab_webui_components';
import { useQuery } from '@tanstack/react-query';
import { getPolicies, getAgentsByPolicy } from '../services/fleetApi.js';
import { POLL_INTERVAL } from '../services/fleetLoader.js';
import { PolicyFullModal } from './PolicyFullModal.jsx';

const SORT_FIELD_MAP = {
	name: 'name',
	description: 'description',
	updated_at: 'updated_at',
};

async function loadPolicies({ params }) {
	const sortEntry = Object.entries(params).find(
		([k, v]) => k.startsWith('s') && k.length > 1 && (v === 'a' || v === 'd'),
	);
	const sortKey = sortEntry?.[0].slice(1);

	const data = await getPolicies({
		page: params.p ?? 1,
		perPage: params.i ?? 20,
		...(sortEntry && SORT_FIELD_MAP[sortKey] && {
			sort_field: SORT_FIELD_MAP[sortKey],
			sort_order: sortEntry[1] === 'a' ? 'ASC' : 'DESC',
		}),
		...(params.f && { kuery: params.f }),
	});

	const policies = data.items ?? [];
	const agentResults = await Promise.all(policies.map((p) => getAgentsByPolicy(p.id)));

	const rows = policies.map((policy, i) => {
		const agents = agentResults[i].list ?? agentResults[i].items ?? [];
		const unprivileged = agents.filter(
			(a) => a.local_metadata?.elastic?.agent?.unprivileged === true,
		).length;
		const privileged = agents.length - unprivileged;
		return {
			id: policy.id,
			name: policy.name,
			description: policy.description,
			updated_at: policy.updated_at,
			unprivileged,
			privileged,
			total: agents.length,
		};
	});

	return { count: data.total ?? policies.length, rows };
}

const getColumns = (t, setOpenPolicy) => [
	{
		title: (
			<span>
				<i className="bi bi-file-earmark-text me-1" />
				{t('ElasticAgent|Policy name')}
			</span>
		),
		sort: 'name',
		colStyle: { width: '20%' },
		render: ({ row }) => <strong>{row.name}</strong>,
	},
	{
		title: (
			<span>
				<i className="bi bi-text-left me-1" />
				{t('ElasticAgent|Description')}
			</span>
		),
		sort: 'description',
		colStyle: { width: '27%' },
		render: ({ row }) => <span>{row.description}</span>,
	},
	{
		title: (
			<span>
				<i className="bi bi-shield-check me-1" />
				{t('ElasticAgent|Unprivileged / Privileged')}
			</span>
		),
		colStyle: { width: '16%' },
		render: ({ row }) => (
			<span>{row.unprivileged} / {row.privileged} ({row.total})</span>
		),
	},
	{
		title: (
			<span>
				<i className="bi bi-calendar-check me-1" />
				{t('ElasticAgent|Last updated')}
			</span>
		),
		sort: 'updated_at',
		colStyle: { width: '23%' },
		render: ({ row }) => row.updated_at
			? <DateTime value={row.updated_at} />
			: <span className="text-muted">—</span>,
	},
	{
		colStyle: { width: '14%' },
		render: ({ row }) => (
			<button
				type="button"
				className="btn btn-sm btn-outline-secondary"
				onClick={() => setOpenPolicy({ id: row.id, name: row.name })}
			>
				<i className="bi bi-eye me-1" />
				{t('ElasticAgent|View policy')}
			</button>
		),
	},
];

export function PoliciesScreen() {
	const { t } = useTranslation();
	const { app } = usePubSub();
	const [openPolicy, setOpenPolicy] = useState({ id: null, name: '' });
	const firstTick = useRef(true);
	const { dataUpdatedAt } = useQuery({
		queryKey: ['policies-tick'],
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
				columns={getColumns(t, setOpenPolicy)}
				initialLimit={20}
				loader={loadPolicies}
				header={
					<div>
						<h5 className="mb-0">
							<i className="bi bi-file-earmark-text me-2" />
							{t('ElasticAgent|Policies')}
						</h5>
					</div>
				}
			/>
			<PolicyFullModal
				isOpen={!!openPolicy.id}
				toggle={() => setOpenPolicy({ id: null, name: '' })}
				policyId={openPolicy.id}
				policyName={openPolicy.name}
			/>
		</Container>
	);
}
