import { useState, useEffect } from 'react';
import { Container, Spinner, Alert } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { DataTableCard2, DateTime, CopyableInput } from 'asab_webui_components';
import { getEnrollmentTokens } from '../services/fleetApi.js';

const BADGE = {
	display: 'inline-block',
	padding: '0.35em 0.65em',
	fontSize: '0.75em',
	fontWeight: 700,
	lineHeight: 1,
	borderRadius: '0.375rem',
	whiteSpace: 'nowrap',
};
const ACTIVE_STYLE   = { ...BADGE, backgroundColor: '#198754', color: '#fff' };
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
			row.expires_at ? <DateTime value={row.expires_at} /> : <span className="text-muted">—</span>,
	},
];

export function EnrollmentTokensScreen() {
	const { t } = useTranslation();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [tokens, setTokens] = useState([]);

	useEffect(() => {
		getEnrollmentTokens()
			.then((data) => {
				setTokens(data.items ?? []);
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
		const rows = tokens.slice(start, start + limit).map((token) => ({
			id: token.id,
			name: token.name,
			policy: token.policy_id,
			token: token.api_key,
			active: token.active,
			created_at: token.created_at,
			expires_at: token.expiration,
		}));
		return { count: tokens.length, rows };
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
							<i className="bi bi-key me-2" />
							{t('ElasticAgent|Enrollment Tokens')}
						</h5>
					</div>
				}
			/>
		</Container>
	);
}
