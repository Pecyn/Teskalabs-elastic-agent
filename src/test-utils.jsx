import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function renderWithProviders(ui, { route = '/', path = '/' } = {}) {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false } },
	});
	return render(
		<QueryClientProvider client={queryClient}>
			<MemoryRouter initialEntries={[route]}>
				<Routes>
					<Route path={path} element={ui} />
				</Routes>
			</MemoryRouter>
		</QueryClientProvider>
	);
}
