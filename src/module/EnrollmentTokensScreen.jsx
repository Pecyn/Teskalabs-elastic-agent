import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Container } from 'reactstrap';
import { DataTableCard2, DateTime, usePubSub } from 'asab_webui_components';
import { useQuery } from '@tanstack/react-query';
import { getEnrollmentTokens, getPolicies } from '../services/fleetApi.js';
import { makeFleetLoader, POLL_INTERVAL } from '../services/fleetLoader.js';
import { TokenModal } from './TokenModal.jsx';

const BADGE = {
	display: 'inline-block',
	padding: '0.35em 0.65em',
	fontSize: '0.75em',
	fontWeight: 700,
	lineHeight: 1,
	borderRadius: '0.375rem',
	whiteSpace: 'nowrap',
};
const ACTIVE_STYLE = { ...BADGE, backgroundColor: '#198754', color: '#fff' };
const INACTIVE_STYLE = { ...BADGE, backgroundColor: '#3d4349', color: '#fff' };

const getColumns = (t, setOpenToken) => [
	{
		title: (
			<span>
				<i className="bi bi-tag me-1" />
				{t('ElasticAgent|Token name')}
			</span>
		),
		sort: 'name',
		colStyle: { width: '20%' },
		render: ({ row }) => <strong>{row.name}</strong>,
	},
	{
		title: (
			<span>
				<i className="bi bi-file-earmark-text me-1" />
				{t('ElasticAgent|Policy')}
			</span>
		),
		sort: 'policy',
		colStyle: { width: '18%' },
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
				<i className="bi bi-circle me-1" />
				{t('ElasticAgent|Active')}
			</span>
		),
		sort: 'active',
		colStyle: { width: '10%' },
		render: ({ row }) => (
			<span style={row.active ? ACTIVE_STYLE : INACTIVE_STYLE}>
				{row.active ? t('ElasticAgent|Active') : t('ElasticAgent|Inactive')}
			</span>
		),
	},
	{
		title: (
			<span>
				<i className="bi bi-calendar-plus me-1" />
				{t('ElasticAgent|Created at')}
			</span>
		),
		sort: 'created_at',
		colStyle: { width: '12%' },
		render: ({ row }) => <DateTime value={row.created_at} />,
	},
	{
		colStyle: { width: '12%' },
		render: ({ row }) => (
			<button
				type="button"
				className="btn btn-sm btn-outline-secondary"
				onClick={() => setOpenToken({ name: row.name, token: row.token })}
			>
				<i className="bi bi-eye me-1" />
				{t('ElasticAgent|View token')}
			</button>
		),
	},
];

const loader = makeFleetLoader(
	getEnrollmentTokens,
	{
		name: 'name',
		policy: 'policy_id',
		active: 'active',
		created_at: 'created_at',
	},
	(token, policyMap = {}) => ({
		id: token.id,
		name: token.name,
		policy_id: token.policy_id,
		policy_name: policyMap[token.policy_id] ?? null,
		token: token.api_key,
		active: token.active,
		created_at: token.created_at,
	}),
);

export function EnrollmentTokensScreen() {
	const { t } = useTranslation();
	const { app } = usePubSub();
	const [openToken, setOpenToken] = useState({ name: '', token: '' });
	const firstTick = useRef(true);
	const { dataUpdatedAt } = useQuery({
		queryKey: ['enrollment-tokens-tick'],
		queryFn: () => Promise.resolve(Date.now()),
		refetchInterval: POLL_INTERVAL,
		staleTime: 0,
	});

	const { data: policiesData } = useQuery({
		queryKey: ['policies-for-tokens'],
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
				columns={getColumns(t, setOpenToken)}
				initialLimit={20}
				loader={loader}
				loaderParams={policyMap}
				header={
					<div>
						<h5 className="mb-0">
							<i className="bi bi-key me-2" />
							{t('ElasticAgent|Enrollment Tokens')}
						</h5>
					</div>
				}
			/>
			<TokenModal
				isOpen={!!openToken.token}
				toggle={() => setOpenToken({ name: '', token: '' })}
				tokenName={openToken.name}
				tokenValue={openToken.token}
			/>
		</Container>
	);
}
