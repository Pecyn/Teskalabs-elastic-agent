export const POLL_INTERVAL = 30_000;

// DataTable params (p, i, s{field}=a|d, f) → Fleet API params (page, perPage, sort_field, sort_order, kuery)
export function makeFleetLoader(apiFn, sortFieldMap, mapRow) {
	return async ({ params }) => {
		const sortEntry = Object.entries(params).find(
			([k, v]) => k.startsWith('s') && k.length > 1 && (v === 'a' || v === 'd'),
		);
		const data = await apiFn({
			page: params.p ?? 1,
			perPage: params.i ?? 20,
			...(sortEntry && {
				sort_field: sortFieldMap[sortEntry[0].slice(1)],
				sort_order: sortEntry[1] === 'a' ? 'ASC' : 'DESC',
			}),
			...(params.f && { kuery: params.f }),
		});
		return {
			count: data.total ?? (data.items ?? []).length,
			rows: (data.items ?? []).map(mapRow),
		};
	};
}
