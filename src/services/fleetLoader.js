export const POLL_INTERVAL = 30_000;

// DataTable params (p, i, f) → Fleet API params (page, perPage, kuery)
export function makeFleetLoader(apiFn, mapRow) {
	return async ({ params, loaderParams }) => {
		const data = await apiFn({
			page: params.p ?? 1,
			perPage: params.i ?? 20,
			...(params.f && { kuery: params.f }),
		});
		return {
			count: data.total ?? (data.items ?? []).length,
			rows: (data.items ?? []).map(item => mapRow(item, loaderParams)),
		};
	};
}
