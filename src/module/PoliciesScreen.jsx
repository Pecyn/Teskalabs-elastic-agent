import { useTranslation } from 'react-i18next';
import { Container } from 'reactstrap';
import { DataTableCard2, DateTime } from 'asab_webui_components';
import { getPolicies } from '../services/fleetApi.js';
import { makeFleetLoader } from '../services/fleetLoader.js';

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

const loader = makeFleetLoader(
	getPolicies,
	{
		name:            'name',
		description:     'description',
		agents_enrolled: 'agents',
		created_at:      'created_at',
	},
	(policy) => ({
		id:              policy.id,
		name:            policy.name,
		description:     policy.description,
		agents_enrolled: policy.agents,
		created_at:      policy.created_at,
	})
);

export function PoliciesScreen() {
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
							<i className="bi bi-file-earmark-text me-2" />
							{t('ElasticAgent|Policies')}
						</h5>
					</div>
				}
			/>
		</Container>
	);
}
