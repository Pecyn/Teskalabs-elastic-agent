import { useState, useEffect } from 'react';
import { Container, Spinner, Alert } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { DataTableCard2, DateTime } from 'asab_webui_components';
import { getPolicies } from '../services/fleetApi.js';

const getColumns = (t) => [
	{
		title: (
			<span>
				<i className="bi bi-file-earmark-text me-1" />
				{t('ElasticAgent|Policy name')}
			</span>
		),
		sort: 'name',
		colStyle: { width: '22%' },
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
		colStyle: { width: '35%' },
		render: ({ row }) => <span>{row.description}</span>,
	},
	{
		title: (
			<span>
				<i className="bi bi-hdd-network me-1" />
				{t('ElasticAgent|Agents enrolled')}
			</span>
		),
		sort: 'agents_enrolled',
		colStyle: { width: '18%' },
		render: ({ row }) => (
			<span className="badge bg-primary">{row.agents_enrolled}</span>
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
		colStyle: { width: '25%' },
		render: ({ row }) => <DateTime value={row.created_at} />,
	},
];

export function PoliciesScreen() {
	const { t } = useTranslation();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [policies, setPolicies] = useState([]);

	useEffect(() => {
		getPolicies()
			.then((data) => {
				setPolicies(data.items ?? []);
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
		const rows = policies.slice(start, start + limit).map((policy) => ({
			id: policy.id,
			name: policy.name,
			description: policy.description,
			agents_enrolled: policy.agents,
			created_at: policy.created_at,
		}));
		return { count: policies.length, rows };
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
							<i className="bi bi-file-earmark-text me-2" />
							{t('ElasticAgent|Policies')}
						</h5>
					</div>
				}
			/>
		</Container>
	);
}
