import yaml from 'js-yaml';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Alert } from 'reactstrap';
import { Spinner } from 'asab_webui_components';
import { getPolicyFull } from '../services/fleetApi.js';

export function PolicyFullModal({ isOpen, toggle, policyId, policyName }) {
	const { t } = useTranslation();
	const [copied, setCopied] = useState(false);
	const { data, isPending, error } = useQuery({
		queryKey: ['policy-full', policyId],
		queryFn: () => getPolicyFull(policyId),
		enabled: isOpen && !!policyId,
	});

	const yamlText = data ? yaml.dump(data) : '';

	return (
		<Modal isOpen={isOpen} toggle={toggle} size="lg">
			<ModalHeader toggle={toggle}>
				'{policyName}' {t('ElasticAgent|agent policy')}
			</ModalHeader>
			<ModalBody style={{ maxHeight: '60vh', overflowY: 'auto' }}>
				{isPending && <Spinner />}
				{error && <Alert color="danger">{error.message}</Alert>}
				{data && (
					<pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
						{yamlText}
					</pre>
				)}
			</ModalBody>
			<ModalFooter>
				<Button
					color={copied ? 'success' : 'secondary'}
					onClick={() => {
						navigator.clipboard.writeText(yamlText);
						setCopied(true);
						setTimeout(() => setCopied(false), 2000);
					}}
				>
					{copied
						? <><i className="bi bi-check2 me-1" />{t('ElasticAgent|Copied!')}</>
						: <><i className="bi bi-clipboard me-1" />{t('ElasticAgent|Copy')}</>}
				</Button>
				<Button color="secondary" onClick={toggle}>
					{t('ElasticAgent|Close')}
				</Button>
			</ModalFooter>
		</Modal>
	);
}
