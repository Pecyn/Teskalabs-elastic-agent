import React from 'react';
import { Container } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { DataTableCard2, DateTime } from 'asab_webui_components';
import { MOCK_AGENTS } from './mockData.js';

const STATUS_BADGE = {
	active: 'bg-success',
	inactive: 'bg-secondary',
	enrolling: 'bg-warning text-dark',
	unenrolled: 'bg-danger',
};

const STATUS_KEY = {
	active: 'ElasticAgent|Active',
	inactive: 'ElasticAgent|Inactive',
	enrolling: 'ElasticAgent|Enrolling',
	unenrolled: 'ElasticAgent|Unenrolled',
};

const loader = async ({ params }) => {
	const page = Number(params.p ?? 1);
	const limit = Number(params.i ?? 20);
	const start = (page - 1) * limit;
	return { count: MOCK_AGENTS.length, rows: MOCK_AGENTS.slice(start, start + limit) };
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
			<span className={`badge ${STATUS_BADGE[row.status] ?? 'bg-secondary'}`}>
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
							<i className="bi bi-hdd-network me-2" />
							{t('ElasticAgent|Agents')}
						</h5>
					</div>
				}
			/>
		</Container>
	);
}
