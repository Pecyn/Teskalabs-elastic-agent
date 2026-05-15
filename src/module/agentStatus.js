const BADGE = {
	display: 'inline-block',
	padding: '0.35em 0.65em',
	fontSize: '0.75em',
	fontWeight: 700,
	lineHeight: 1,
	borderRadius: '0.375rem',
	whiteSpace: 'nowrap',
};

export const STATUS_STYLE = {
	online:    { ...BADGE, backgroundColor: '#198754', color: '#fff' },
	active:    { ...BADGE, backgroundColor: '#198754', color: '#fff' },
	offline:   { ...BADGE, backgroundColor: '#3d4349', color: '#fff' },
	inactive:  { ...BADGE, backgroundColor: '#3d4349', color: '#fff' },
	degraded:  { ...BADGE, backgroundColor: '#fd7e14', color: '#fff' },
	enrolling: { ...BADGE, backgroundColor: '#0dcaf0', color: '#000' },
	updating:  { ...BADGE, backgroundColor: '#0d6efd', color: '#fff' },
	unenrolled:{ ...BADGE, backgroundColor: '#dc3545', color: '#fff' },
	error:     { ...BADGE, backgroundColor: '#dc3545', color: '#fff' },
};

export const UNKNOWN_STYLE = { ...BADGE, backgroundColor: '#3d4349', color: '#fff' };

export const STATUS_KEY = {
	online:    'ElasticAgent|Online',
	active:    'ElasticAgent|Active',
	offline:   'ElasticAgent|Offline',
	inactive:  'ElasticAgent|Inactive',
	degraded:  'ElasticAgent|Degraded',
	enrolling: 'ElasticAgent|Enrolling',
	updating:  'ElasticAgent|Updating',
	unenrolled:'ElasticAgent|Unenrolled',
	error:     'ElasticAgent|Error',
};
