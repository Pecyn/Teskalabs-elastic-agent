import React from 'react';
import { Container } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { DataTableCard2, DateTime, CopyableInput } from 'asab_webui_components';
import { MOCK_TOKENS } from './mockData.js';

const loader = async ({ params }) => {
	const page = Number(params.p ?? 1);
	const limit = Number(params.i ?? 20);
	const start = (page - 1) * limit;
	return { count: MOCK_TOKENS.length, rows: MOCK_TOKENS.slice(start, start + limit) };
};

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
			<span className={`badge ${row.active ? 'bg-success' : 'bg-secondary'}`}>
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
	const columns = getColumns(t);
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
