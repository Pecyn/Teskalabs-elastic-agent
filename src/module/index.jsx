import React from 'react';
import { Navigate } from 'react-router';
import { Module } from 'asab_webui_components';

import { AgentsScreen } from './AgentsScreen.jsx';
import { AgentDetailScreen } from './AgentDetailScreen.jsx';
import { PoliciesScreen } from './PoliciesScreen.jsx';
import { EnrollmentTokensScreen } from './EnrollmentTokensScreen.jsx';

export default class ElasticAgentModule extends Module {
	constructor(app, name) {
		super(app, 'ElasticAgentModule');

		app.Router.addRoute({
			path: '/',
			component: () =>
				React.createElement(Navigate, { to: '/agents', replace: true }),
		});

		app.Router.addRoute({
			path: '/agents',
			name: 'Agents',
			component: AgentsScreen,
		});

		app.Router.addRoute({
			path: '/agents/:id',
			name: 'Agent Detail',
			component: AgentDetailScreen,
		});

		app.Router.addRoute({
			path: '/policies',
			name: 'Policies',
			component: PoliciesScreen,
		});

		app.Router.addRoute({
			path: '/enrollment-tokens',
			name: 'Enrollment Tokens',
			component: EnrollmentTokensScreen,
		});

		app.Navigation.addItem({
			name: 'Agents',
			icon: 'bi bi-hdd-network',
			url: '/agents',
		});

		app.Navigation.addItem({
			name: 'Policies',
			icon: 'bi bi-file-earmark-text',
			url: '/policies',
		});

		app.Navigation.addItem({
			name: 'Enrollment Tokens',
			icon: 'bi bi-key',
			url: '/enrollment-tokens',
		});
	}
}
