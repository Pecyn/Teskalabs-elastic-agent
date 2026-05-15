import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Container, Card, CardHeader, CardBody, Alert } from 'reactstrap';
import { DateTime } from 'asab_webui_components';
import { getPolicyById } from '../services/fleetApi.js';

function CardBodyItem({ label, children }) {
	return (
		<div className="row align-items-center mb-1">
			<dt className="col-sm-3">{label}</dt>
			<dd className="col-sm-9 mb-0">{children}</dd>
		</div>
	);
}

function PolicyDetailSkeleton() {
	return (
		<Container className="mt-3">
			<Card>
				<CardHeader>
					<h5 className="mb-0 placeholder-glow">
						<span className="placeholder col-3" />
					</h5>
				</CardHeader>
				<CardBody>
					<dl className="mb-0 placeholder-glow">
						{Array(5).fill(0).map((_, i) => (
							<div key={i} className="row align-items-center mb-1">
								<dt className="col-sm-3">
									<span className="placeholder col-6" />
								</dt>
								<dd className="col-sm-9 mb-0">
									<span className="placeholder col-12" />
								</dd>
							</div>
						))}
					</dl>
				</CardBody>
			</Card>
		</Container>
	);
}

export function PolicyDetailScreen() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { data, isPending, error } = useQuery({
		queryKey: ['policy', id],
		queryFn: () => getPolicyById(id),
		select: (response) => {
			const policy = response.item;
			return {
				id: policy.id,
				name: policy.name,
				description: policy.description,
				agents: policy.agents,
				namespace: policy.namespace,
				created_at: policy.created_at,
				updated_at: policy.updated_at,
			};
		},
	});

	if (isPending) return <PolicyDetailSkeleton />;

	if (error)
		return (
			<Container className="mt-3">
				<Alert color="danger">{error.message}</Alert>
			</Container>
		);

	return (
		<Container className="mt-3">
			<Card>
				<CardHeader>
					<div className="d-flex align-items-center gap-2">
						<button
							type="button"
							className="btn btn-outline-secondary btn-sm"
							onClick={() => navigate('/policies')}
						>
							<i className="bi bi-chevron-left" />
						</button>
						<h5 className="mb-0">
							<i className="bi bi-file-earmark-text me-2" />
							{data.name}
						</h5>
					</div>
				</CardHeader>
				<CardBody>
					<dl className="mb-0">
						<CardBodyItem
							label={
								<>
									<i className="bi bi-text-left me-1" />
									{t('ElasticAgent|Description')}
								</>
							}
						>
							<span>{data.description || <span className="text-muted">—</span>}</span>
						</CardBodyItem>

						<CardBodyItem
							label={
								<>
									<i className="bi bi-hdd-network me-1" />
									{t('ElasticAgent|Agents')}
								</>
							}
						>
							<span className="badge bg-primary">{data.agents}</span>
						</CardBodyItem>

						<CardBodyItem
							label={
								<>
									<i className="bi bi-diagram-3 me-1" />
									{t('ElasticAgent|Namespace')}
								</>
							}
						>
							<span>{data.namespace}</span>
						</CardBodyItem>

						<CardBodyItem
							label={
								<>
									<i className="bi bi-calendar-plus me-1" />
									{t('ElasticAgent|Created at')}
								</>
							}
						>
							<div className="py-2">
								<DateTime value={data.created_at} />
							</div>
						</CardBodyItem>

						<CardBodyItem
							label={
								<>
									<i className="bi bi-calendar-check me-1" />
									{t('ElasticAgent|Last updated')}
								</>
							}
						>
							<div className="py-2">
								{data.updated_at
									? <DateTime value={data.updated_at} />
									: <span className="text-muted">—</span>}
							</div>
						</CardBodyItem>
					</dl>
				</CardBody>
			</Card>
		</Container>
	);
}
