# ASAB WebUI — App Setup Reference

This file documents how TeskaLabs ASAB WebUI libraries are used to bootstrap and structure a React app. Use it as a reference when starting a new ASAB-based project.

---

## Libraries

| Package | Role |
|---|---|
| `asab_webui_shell` | App frame — bootstraps layout, routing, Redux, theme, auth |
| `asab_webui_components` | UI toolkit — tables, date/time, cards, base classes for modules/services |

---

## Entry point — `src/index.jsx`

```jsx
import React from "react";
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router';
import { Application, I18nModule, AboutModule } from 'asab_webui_shell';

const root = createRoot(document.getElementById('app'));

(async function init() {
    // Dynamic import enables code splitting and async init order
    const { default: MyModule } = await import('./module/index.jsx');

    const config = {
        title: "App Title",
        website: "https://example.com",
        email: "info@example.com",
        brandImage: {
            light: { full: "media/logo/full.svg", minimized: "media/logo/min.svg" },
            dark:  { full: "media/logo/full-dark.svg", minimized: "media/logo/min-dark.svg" }
        },
        sidebarLogo: {
            light: { full: "media/logo/full.svg", minimized: "media/logo/min.svg" },
            dark:  { full: "media/logo/full-dark.svg", minimized: "media/logo/min-dark.svg" }
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
            <Application
                configdefaults={config}
                modules={[I18nModule, AboutModule, MyModule]}
            />
        </HashRouter>
    );
})();
```

**Key points:**

- `document.getElementById('app')` — must match `<div id="app">` in the static `public/index.html`.
- `HashRouter` — use instead of `BrowserRouter` for static file deployments. Hash-based URLs (`/#/path`) are never sent to the server, so no 404s on refresh.
- `async init()` IIFE — required because `await` cannot be used at the top level without ES module configuration. The async wrapper also allows awaiting remote config or auth checks before rendering.
- Dynamic `import()` — enables bundler code splitting. The module chunk is downloaded only when `init()` runs, not as part of the initial bundle.
- `modules` array — `Application` instantiates each class in order, passing the `app` object to each constructor. Built-in shell modules (`I18nModule`, `AboutModule`) and your own modules are treated identically.

---

## Module — `src/module/index.jsx`

```jsx
import React from 'react';
import { Navigate } from 'react-router';
import { Module } from 'asab_webui_components';

import { MyScreen } from './MyScreen.jsx';
import { DetailScreen } from './DetailScreen.jsx';

export default class MyApplicationModule extends Module {
    constructor(app, name) {
        super(app, 'MyApplicationModule'); // registers with the shell

        // Redirect root to a default route
        app.Router.addRoute({
            path: '/',
            component: () => React.createElement(Navigate, { to: '/my-screen', replace: true }),
        });

        // Register routes
        app.Router.addRoute({ path: '/my-screen', name: 'My Screen', component: MyScreen });
        app.Router.addRoute({ path: '/my-screen/:id', name: 'Detail', component: DetailScreen });

        // Register sidebar navigation items
        app.Navigation.addItem({
            name: 'My Screen',
            icon: 'bi bi-table',   // Bootstrap Icons class
            url: '/my-screen',
        });
    }
}
```

**Key points:**

- Extend `Module` from `asab_webui_components` — base class the shell requires.
- `super(app, 'ModuleName')` — always call first; registers the module instance with the shell.
- `app.Router.addRoute({ path, component, name? })` — maps a URL path to a React component rendered in the shell's main content area. `name` is optional (used for breadcrumbs/title).
- `app.Navigation.addItem({ name, icon, url })` — adds a link to the shell sidebar. Shell handles active state automatically.
- Routes and nav items are independent — a route without a nav item is reachable but not listed in the sidebar (e.g. detail pages). A route with `:param` captures a dynamic URL segment.
- `replace: true` on the redirect route prevents the back button from looping on `/`.

---

## Screen components

Screens are plain React components. They receive no special props from the shell — they use React Router hooks for URL data and `asab_webui_components` for UI primitives.

```jsx
// Route params
const { id } = useParams();          // from /my-screen/:id

// Navigation
const navigate = useNavigate();
const location = useLocation();      // location.state carries data passed via Link state

// Translations (provided by I18nModule)
const { t } = useTranslation();
t('Namespace|Key')

// Shell alert system (via PubSub)
const { app } = usePubSub();
app.addAlertFromException(error, t('Namespace|Error message'));
```

**Commonly used `asab_webui_components` in screens:**

| Component / Hook | Purpose |
|---|---|
| `DataTableCard2` | Full-featured data table with sorting, pagination, filters |
| `DateTime` | Locale-aware date/time display |
| `CopyableInput` | Read-only field with copy-to-clipboard button |
| `usePubSub()` | Access `app` instance and cross-component event bus |
| `Spinner` | Loading indicator |

---

## Built-in shell modules

Add to the `modules` array in `index.jsx` as needed:

| Module | What it does |
|---|---|
| `I18nModule` | Initializes `react-i18next` from the `i18n` config key |
| `AboutModule` | Adds an `/about` route using `title`, `website`, `email`, `brandImage` config |
| `AuthModule` | Login / logout / session management |
| `TenantModule` | Tenant switcher and active-tenant context for multi-tenant apps |
| `AttentionRequiredModule` | Attention badge and required-action flow |
| `InviteModule` | User invite flow |

---

## Config reference

```js
const config = {
    title: "",           // App name — used by AboutModule and TitleService
    website: "",         // Used by AboutModule
    email: "",           // Used by AboutModule
    brandImage: {        // Logo shown in About page
        light: { full: "", minimized: "" },
        dark:  { full: "", minimized: "" }
    },
    sidebarLogo: {       // Logo shown in Sidebar
        light: { full: "", minimized: "" },
        dark:  { full: "", minimized: "" }
    },
    i18n: {
        fallbackLng: 'en',
        supportedLngs: ['en'],
        debug: false,
        nsSeparator: false   // set false to allow pipe-separated keys: 'NS|Key'
    }
};
```
