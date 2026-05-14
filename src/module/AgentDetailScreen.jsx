import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Container, Card, CardHeader, CardBody, Alert } from 'reactstrap';
import { DateTime, CopyableInput } from 'asab_webui_components';
import { getAgentById } from '../services/fleetApi.js';
import { POLL_INTERVAL } from '../services/fleetLoader.js';

const BADGE = {
	display: 'inline-block',
	padding: '0.35em 0.65em',
	fontSize: '0.75em',
	fontWeight: 700,
	lineHeight: 1,
	borderRadius: '0.375rem',
	whiteSpace: 'nowrap',
};

const STATUS_STYLE = {
	online: { ...BADGE, backgroundColor: '#198754', color: '#fff' },
	active: { ...BADGE, backgroundColor: '#198754', color: '#fff' },
	offline: { ...BADGE, backgroundColor: '#3d4349', color: '#fff' },
	inactive: { ...BADGE, backgroundColor: '#3d4349', color: '#fff' },
	degraded: { ...BADGE, backgroundColor: '#fd7e14', color: '#fff' },
	enrolling: { ...BADGE, backgroundColor: '#0dcaf0', color: '#000' },
	updating: { ...BADGE, backgroundColor: '#0d6efd', color: '#fff' },
	unenrolled: { ...BADGE, backgroundColor: '#dc3545', color: '#fff' },
	error: { ...BADGE, backgroundColor: '#dc3545', color: '#fff' },
};

const UNKNOWN_STYLE = { ...BADGE, backgroundColor: '#3d4349', color: '#fff' };

const STATUS_KEY = {
	online: 'ElasticAgent|Online',
	active: 'ElasticAgent|Active',
	offline: 'ElasticAgent|Offline',
	inactive: 'ElasticAgent|Inactive',
	degraded: 'ElasticAgent|Degraded',
	enrolling: 'ElasticAgent|Enrolling',
	updating: 'ElasticAgent|Updating',
	unenrolled: 'ElasticAgent|Unenrolled',
	error: 'ElasticAgent|Error',
};

function CardBodyItem({ label, children }) {
	return (
		<div className="row align-items-center mb-1">
			<dt className="col-sm-3">{label}</dt>
			<dd className="col-sm-9 mb-0">{children}</dd>
		</div>
	);
}

export function AgentDetailScreen() {
	const { id } = useParams();
	const navigate = useNavigate();
	const location = useLocation();
	const cameFromAgents = location.state?.from === 'agents';
	const { t } = useTranslation();
	const { data, isPending, error } = useQuery({
		queryKey: ['agent', id],
		queryFn: () => getAgentById(id),
		refetchInterval: POLL_INTERVAL,
		select: (response) => {
			const agent = response.item;
			const ip = Array.isArray(agent.local_metadata?.host?.ip)
				? agent.local_metadata.host.ip.join(', ')
				: agent.local_metadata?.host?.ip;
			return {
				id: agent.id,
				name: agent.local_metadata?.host?.hostname ?? agent.id,
				status: agent.status,
				hostname: agent.local_metadata?.host?.hostname,
				ip,
				policy: agent.policy_id,
				version: agent.agent?.version,
				os: agent.local_metadata?.os?.full ?? agent.local_metadata?.os?.name,
				enrolled_at: agent.enrolled_at,
				last_activity: agent.last_checkin,
			};
		},
	});

	if (isPending)
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
							{Array(7)
								.fill(0)
								.map((_, i) => (
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

	if (error)
		return (
			<Container className="mt-3">
				<Alert color="danger">{error.message}</Alert>
			</Container>
		);

	return (
		<Container className="mt-3">
			<Card>
				<CardHeader className="d-flex align-items-center gap-2">
					<button
						type="button"
						className="btn btn-outline-secondary btn-sm"
						onClick={() =>
							cameFromAgents ? navigate(-1) : navigate('/agents')
						}
					>
						<i className="bi bi-chevron-left" />
					</button>
					<h5 className="mb-0">
						<i className="bi bi-pc-display me-2" />
						{data.name}
					</h5>
					<span
						className="ms-1"
						style={STATUS_STYLE[data.status] ?? UNKNOWN_STYLE}
					>
						{t(STATUS_KEY[data.status] ?? 'ElasticAgent|Unknown')}
					</span>
				</CardHeader>
				<CardBody>
					<dl className="mb-0">
						<CardBodyItem
							label={
								<>
									<i className="bi bi-hash me-1" />
									{t('ElasticAgent|ID')}
								</>
							}
						>
							<CopyableInput value={data.id} type="text" />
						</CardBodyItem>

						<CardBodyItem
							label={
								<>
									<i className="bi bi-hdd me-1" />
									{t('ElasticAgent|Hostname')}
								</>
							}
						>
							<CopyableInput value={data.hostname} type="text" />
						</CardBodyItem>

						<CardBodyItem
							label={
								<>
									<i className="bi bi-hdd-network me-1" />
									{t('ElasticAgent|IP address')}
								</>
							}
						>
							<CopyableInput value={data.ip} type="text" />
						</CardBodyItem>

						<CardBodyItem
							label={
								<>
									<i className="bi bi-file-earmark-text me-1" />
									{t('ElasticAgent|Policy')}
								</>
							}
						>
							<span>{data.policy}</span>
						</CardBodyItem>

						<CardBodyItem
							label={
								<>
									<i className="bi bi-tag me-1" />
									{t('ElasticAgent|Version')}
								</>
							}
						>
							<span>{data.version}</span>
						</CardBodyItem>

						<CardBodyItem
							label={
								<>
									<i className="bi bi-display me-1" />
									{t('ElasticAgent|OS')}
								</>
							}
						>
							<span>{data.os}</span>
						</CardBodyItem>

						<CardBodyItem
							label={
								<>
									<i className="bi bi-calendar-plus me-1" />
									{t('ElasticAgent|Enrolled at')}
								</>
							}
						>
							<div className="py-2">
								<DateTime value={data.enrolled_at} />
							</div>
						</CardBodyItem>

						<CardBodyItem
							label={
								<>
									<i className="bi bi-clock me-1" />
									{t('ElasticAgent|Last activity')}
								</>
							}
						>
							<div className="py-2">
								<DateTime value={data.last_activity} />
							</div>
						</CardBodyItem>
					</dl>
				</CardBody>
			</Card>
		</Container>
	);
}
