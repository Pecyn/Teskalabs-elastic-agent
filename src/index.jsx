import React from "react";
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const root = createRoot(document.getElementById('app'));
import { Application, I18nModule, AboutModule } from 'asab_webui_shell';

const queryClient = new QueryClient();

(async function init() {
	// Dynamically import your module(s)
	const { default: ElasticAgentModule } = await import('./module/index.jsx');

	const config = {
		title: "TeskaLabs Elastic Agent",
		website: "https://teskalabs.com",
		email: "info@teskalabs.com",
		brandImage: {
			light: {
				full: "media/logo/sidebar-logo-full.svg",
				minimized: "media/logo/sidebar-logo-minimized.svg",
			},
			dark: {
				full: "media/logo/sidebar-logo-full-dark.svg",
				minimized: "media/logo/sidebar-logo-minimized-dark.svg"
			}
		},
		sidebarLogo: {
			dark: {
				full: "media/logo/sidebar-logo-full-dark.svg",
				minimized: "media/logo/sidebar-logo-minimized-dark.svg"
			},
			light: {
				full: "media/logo/sidebar-logo-full.svg",
				minimized: "media/logo/sidebar-logo-minimized.svg"
			}
		},
		i18n: {
			fallbackLng: 'en',
			supportedLngs: ['en', 'cs'],
			debug: false,
			nsSeparator: false
		}
	};

	root.render(
		<HashRouter>
			<QueryClientProvider client={queryClient}>
				<Application
					configdefaults={config}
					modules={[I18nModule, AboutModule, ElasticAgentModule]}
				/>
			</QueryClientProvider>
		</HashRouter>,);
})();
