const React = require('react');

module.exports = {
	DateTime: ({ value }) => React.createElement('span', { 'data-testid': 'datetime' }, value),
	CopyableInput: ({ value }) =>
		React.createElement('input', { type: 'text', defaultValue: value, readOnly: true }),
	DataTableCard2: () => React.createElement('div', { 'data-testid': 'datatable' }),
	DataTableFilter2: () => React.createElement('div', { 'data-testid': 'filter' }),
	DataTableAdvFilterSingleValue2: () => React.createElement('div'),
	DataTableAdvFilterMultiValue2: () => React.createElement('div'),
};
