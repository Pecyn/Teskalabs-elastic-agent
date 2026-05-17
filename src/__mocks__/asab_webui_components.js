const React = require('react');

module.exports = {
	DateTime: ({ value }) => React.createElement('span', { 'data-testid': 'datetime' }, value),
	CopyableInput: ({ value }) =>
		React.createElement('input', { type: 'text', defaultValue: value, readOnly: true }),
	Spinner: () => React.createElement('div', { role: 'status', 'data-testid': 'spinner' }),
	usePubSub: () => ({ app: { PubSub: { publish: () => {} } } }),
	DataTableCard2: ({ columns = [], loader, loaderParams, header }) => {
		const [rows, setRows] = React.useState([]);
		React.useEffect(() => {
			if (!loader) return;
			loader({ params: {}, loaderParams })
				.then(({ rows: r }) => setRows(r))
				.catch(() => {});
		}, [loaderParams]);
		return React.createElement(
			'div',
			{ 'data-testid': 'datatable' },
			header,
			rows.map((row, i) =>
				React.createElement(
					'div',
					{ key: i, 'data-testid': 'row' },
					columns.map((col, j) =>
						col.render
							? React.createElement('div', { key: j }, col.render({ row }))
							: null,
					),
				),
			),
		);
	},
	DataTableFilter2: () => React.createElement('div', { 'data-testid': 'filter' }),
	DataTableAdvFilterSingleValue2: () => React.createElement('div'),
	DataTableAdvFilterMultiValue2: () => React.createElement('div'),
};
