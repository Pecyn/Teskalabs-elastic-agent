# DataTableCard2

`DataTableCard2` is the standard paginated, sortable, filterable data table from `asab_webui_components`. It stores its state (page, limit, sort, filters) in URL search params by default, so the view is bookmarkable and survives navigation.

## Minimal usage

```jsx
import { DataTableCard2 } from 'asab_webui_components';

const columns = [
    {
        title: 'Name',
        sort: 'name',                         // enables sort; value is the field key
        colStyle: { width: '40%' },           // <col> style — controls column width
        render: ({ row }) => <span>{row.name}</span>,
    },
    {
        title: 'Status',
        render: ({ row }) => <span>{row.status}</span>,
    },
];

// loader: async ({ params, loaderParams }) => ({ count: number, rows: array })
const loader = async ({ params }) => {
    const data = await fetchItems({ page: params.p, perPage: params.i });
    return { count: data.total, rows: data.items };
};

export function MyScreen() {
    return (
        <Container className="h-100">
            <DataTableCard2
                columns={columns}
                loader={loader}
                initialLimit={20}
                header={<h5 className="mb-0">My Items</h5>}
            />
        </Container>
    );
}
```

## DataTableCard2 props

| Prop | Type | Default | Description |
|---|---|---|---|
| `columns` | `Column[]` | required | Column definitions (see below) |
| `loader` | `function` | required | Async function that fetches data (see below) |
| `header` | `ReactNode` | — | Content rendered in the card header |
| `initialLimit` | `number` | `0` | Rows per page; `0` means auto-fit to container height |
| `loaderParams` | `any` | — | Extra data passed through to `loader`; re-fetches when this changes |
| `rowHeight` | `number` | `38` | Row height in px — used for auto-fit calculation and empty-row padding |
| `rowStyle` | `(row) => CSSProperties` | — | Per-row inline style callback |
| `disableParams` | `boolean` | — | Store state in React state instead of URL (use when multiple tables share a page) |
| `hideFooter` | `boolean` | `false` | Hide the pagination footer |
| `className` | `string` | — | Extra CSS class on the card wrapper |

## Column definition

```js
{
    title: ReactNode,          // header cell content
    sort: string,              // field key for sorting; omit to disable sort on this column
    sortDirection: 'a' | 'd', // initial sort direction when first clicked (default: 'a')
    colStyle: CSSProperties,   // applied to <col> — use for width
    thStyle: CSSProperties,    // applied to <th>
    tdStyle: CSSProperties,    // applied to each <td>
    render: ({ row, column, ridx }) => ReactNode,  // required — cell renderer
}
```

## Loader function

The loader receives `{ params, loaderParams, setRows, setCount }` and must return `{ count, rows }` (or call `setRows`/`setCount` directly for WebSocket/streaming cases).

URL params passed in `params`:

| Key | Meaning |
|---|---|
| `p` | Current page (integer, 1-based) |
| `i` | Items per page (integer) |
| `s{field}` | Sort direction for `field`: `'a'` (ASC) or `'d'` (DESC) |
| `f` | Simple text filter value |
| `a{field}` | Advanced filter value(s) for `field` (comma-separated for multi) |

## makeFleetLoader — project-specific helper

This project's `src/services/fleetLoader.js` wraps the Fleet API convention:

```js
import { makeFleetLoader } from '../services/fleetLoader.js';

const loader = makeFleetLoader(
    apiFn,          // ({ page, perPage, sort_field?, sort_order?, kuery? }) => Promise<{ total, items[] }>
    sortFieldMap,   // maps DataTable sort key → API field name, e.g. { name: 'local_metadata.host.hostname' }
    mapRow,         // (apiItem) => row object for the table
);
```

## Filters

All filter components must be rendered **inside** the `header` prop so they share the table's context.

**Simple text search** — sets `params.f`:
```jsx
import { DataTableFilter2 } from 'asab_webui_components';

header={
    <div className="d-flex gap-2 align-items-center">
        <h5 className="mb-0 flex-fill">Title</h5>
        <DataTableFilter2 />
    </div>
}
```

**Single-value dropdown filter** — sets `params.a{field}` to one value:
```jsx
import { DataTableAdvFilterSingleValue2 } from 'asab_webui_components';

<DataTableAdvFilterSingleValue2
    field={{ status: 'Status' }}   // { apiKey: 'Display label' }
    fieldItems={['online', 'offline', 'degraded']}
/>
```

**Multi-value dropdown filter** — sets `params.a{field}` to comma-separated values:
```jsx
import { DataTableAdvFilterMultiValue2 } from 'asab_webui_components';

<DataTableAdvFilterMultiValue2
    field={{ status: 'Status' }}
    fieldItems={['online', 'offline', 'degraded']}
/>
```

Active filter pills are rendered automatically above the table. Clicking the × on a pill removes that filter.

## Triggering a reload

Publish `Application.reload!` via PubSub from any component in the tree:

```jsx
const { app } = usePubSub();
app.PubSub.publish('Application.reload!');

// Transparent reload (no loading placeholders):
app.PubSub.publish('Application.reload!', { mode: 'transparent' });
```

## Multiple tables on one page

If two `DataTableCard2` components share the same route, their URL params would collide. Pass `disableParams` to both — state is kept in React state instead of the URL:

```jsx
<DataTableCard2 disableParams columns={cols1} loader={loader1} initialLimit={10} header={...} />
<DataTableCard2 disableParams columns={cols2} loader={loader2} initialLimit={10} header={...} />
```
