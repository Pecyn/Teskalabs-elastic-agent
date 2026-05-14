import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Container } from 'reactstrap';
import { DataTableCard2, DateTime, CopyableInput, usePubSub } from 'asab_webui_components';
import { useQuery } from '@tanstack/react-query';
import { getEnrollmentTokens } from '../services/fleetApi.js';
import { makeFleetLoader, POLL_INTERVAL } from '../services/fleetLoader.js';

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

const getColumns = (t) => [
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
		render: ({ row }) => <span>{row.policy}</span>,
	},
	{
		title: (
			<span>
				<i className="bi bi-key me-1" />
				{t('ElasticAgent|Token')}
			</span>
		),
		colStyle: { width: '28%' },
		render: ({ row }) => <CopyableInput value={row.token} type="text" />,
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
		title: (
			<span>
				<i className="bi bi-calendar-x me-1" />
				{t('ElasticAgent|Expires at')}
			</span>
		),
		sort: 'expires_at',
		colStyle: { width: '12%' },
		render: ({ row }) =>
			row.expires_at ? (
				<DateTime value={row.expires_at} />
			) : (
				<span className="text-muted">—</span>
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
		expires_at: 'expiration',
	},
	(token) => ({
		id: token.id,
		name: token.name,
		policy: token.policy_id,
		token: token.api_key,
		active: token.active,
		created_at: token.created_at,
		expires_at: token.expiration,
	}),
);

export function EnrollmentTokensScreen() {
	const { t } = useTranslation();
	const { app } = usePubSub();
	const firstTick = useRef(true);
	const { dataUpdatedAt } = useQuery({
		queryKey: ['enrollment-tokens-tick'],
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
							<i className="bi bi-key me-2" />
							{t('ElasticAgent|Enrollment Tokens')}
						</h5>
					</div>
				}
			/>
		</Container>
	);
}
