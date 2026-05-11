import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Container, Card, CardHeader, CardBody } from 'reactstrap';
import { DateTime, CopyableInput } from 'asab_webui_components';
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
	const [data, setData] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const agent = MOCK_AGENTS.find((a) => a.id === id) ?? null;
		setData(agent);
		setIsLoading(false);
	}, [id]);

	if (isLoading)
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

	if (!data)
		return (
			<Container className="mt-3">
				<Card>
					<CardHeader />
					<CardBody>
						<dl className="mb-0" />
					</CardBody>
				</Card>
			</Container>
		);

	return (
		<Container className="mt-3">
			<Card>
				<CardHeader className="d-flex align-items-center gap-2">
					<button
						type="button"
						className="btn btn-outline-secondary btn-sm"
						onClick={() => (cameFromAgents ? navigate(-1) : navigate('/agents'))}
					>
						<i className="bi bi-chevron-left" />
					</button>
					<h5 className="mb-0">
						<i className="bi bi-pc-display me-2" />
						{data.name}
					</h5>
					<span className={`badge ms-1 ${STATUS_BADGE[data.status] ?? 'bg-secondary'}`}>
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
