import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

export function TokenModal({ isOpen, toggle, tokenName, tokenValue }) {
	const { t } = useTranslation();
	const [copied, setCopied] = useState(false);

	return (
		<Modal isOpen={isOpen} toggle={toggle} style={{ maxWidth: 'max-content', minWidth: '30rem' }}>
			<ModalHeader toggle={toggle}><span className="me-3">'{tokenName}'</span></ModalHeader>
			<ModalBody>
				<pre style={{ fontSize: '1rem', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
					{tokenValue}
				</pre>
			</ModalBody>
			<ModalFooter>
				<Button
					color={copied ? 'success' : 'secondary'}
					onClick={() => {
						navigator.clipboard.writeText(tokenValue);
						setCopied(true);
						setTimeout(() => setCopied(false), 2000);
					}}
				>
					{copied
						? <><i className="bi bi-check2 me-1" />{t('ElasticAgent|Copied!')}</>
						: <><i className="bi bi-clipboard me-1" />{t('ElasticAgent|Copy')}</>}
				</Button>
				<Button color="secondary" onClick={toggle}>{t('ElasticAgent|Close')}</Button>
			</ModalFooter>
		</Modal>
	);
}
