# LivestockPro · Frontend Client

Single-page application for the **LivestockPro** cattle-management platform. Built with React 19 + Vite + TypeScript, it consumes the [`server`](../server) REST API behind a Bearer-token auth layer and ships full **Dashboard**, **Fincas**, **Razas**, **Ganado** (with movements) and **Transacciones** modules. The UI leans on Chart.js for analytics, Zod for client-side validation and Zustand for the auth session.

## Tech Stack

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-5-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-4-3068B7?style=for-the-badge&logo=zod&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-5-000000?style=for-the-badge&logoColor=white)
![react-hot-toast](https://img.shields.io/badge/react--hot--toast-2-FF4C4C?style=for-the-badge)
![Chart.js](https://img.shields.io/badge/Chart.js-4-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)
![react-chartjs-2](https://img.shields.io/badge/react--chartjs--2-5-FF6384?style=for-the-badge)

### Login

![Login screen](https://ik.imagekit.io/5zi86k8wt/Projects/LivestockPro/Foto19.png?tr=w-1400,q-80,fo-auto)

Two-pane `/login` screen: the left `FirstPanel` carries a full-bleed farm photograph with the `LivestockPro` brand mark, the right `LoginForm` is a centered card with email + password fields, an inline visibility toggle for the password, and a primary submit button that shows a spinner while `useLogin().isPending` is true. When the Axios interceptor bounces the user here with `?expired=true`, a small orange banner appears above the form.

### Dashboard

![Dashboard](https://ik.imagekit.io/5zi86k8wt/Projects/LivestockPro/Foto1.png?tr=w-1400,q-80,fo-auto)
![Dashboard](https://ik.imagekit.io/5zi86k8wt/Projects/LivestockPro/Foto2.png?tr=w-1400,q-80,fo-auto)

`/` after login. A `PeriodFilter` row (Period / Land / Custom range) sits at the top, followed by a six-tile `KpiCard` grid (Cattle, Lands, Races, Income, Expenses, Net Profit) and three chart rows — `CattleOverTimeChart`, the financial pair (`IncomeExpenseBarChart` + `ExpensesDonutChart`), the `MonthlyTrendLineChart`, and the livestock triple (`CattleByRaceBarChart` / `CattleByLandBarChart` / `CattleByGenderDonutChart`). Every chart shows a `ChartSkeleton` while loading and an `Actualizando datos…` hint when a background refetch fires.

### Lands (Fincas)

![Lands](https://ik.imagekit.io/5zi86k8wt/Projects/LivestockPro/Foto3.png?tr=w-1400,q-80,fo-auto)
![Lands](https://ik.imagekit.io/5zi86k8wt/Projects/LivestockPro/Foto4.png?tr=w-1400,q-80,fo-auto)
![Lands](https://ik.imagekit.io/5zi86k8wt/Projects/LivestockPro/Foto5.png?tr=w-1400,q-80,fo-auto)
![Lands](https://ik.imagekit.io/5zi86k8wt/Projects/LivestockPro/Foto6.png?tr=w-1400,q-80,fo-auto)

`/lands` — grid of land cards with name, `Activa` / `Inactiva` pill, `Alquilada` / `Propia` pill, location, cattle count, and the two icon actions (`edit` / `delete`). The `Crear` button in the page header opens the unified `Form` modal (name + location + rented/owned segmented control + active toggle on edit) inside the shared `<Overlay>`.

### Races (Razas)

![Races](https://ik.imagekit.io/5zi86k8wt/Projects/LivestockPro/Foto7.png?tr=w-1400,q-80,fo-auto)
![Races](https://ik.imagekit.io/5zi86k8wt/Projects/LivestockPro/Foto8.png?tr=w-1400,q-80,fo-auto)
![Races](https://ik.imagekit.io/5zi86k8wt/Projects/LivestockPro/Foto9.png?tr=w-1400,q-80,fo-auto)
![Races](https://ik.imagekit.io/5zi86k8wt/Projects/LivestockPro/Foto10.png?tr=w-1400,q-80,fo-auto)

`/races` — twin of the Lands page, intentionally symmetric: name pill, cattle count, same icon actions, same `Form` / `DeleteForm` modals. The dropdown exposed by `useRace().getRacesToDropdown` is what feeds the `Raza` filter and the `Raza` form field on the Cattle page.

### Cattle (Ganado)

![Cattle list](https://ik.imagekit.io/5zi86k8wt/Projects/LivestockPro/Foto11.png?tr=w-1400,q-80,fo-auto)
![Cattle list](https://ik.imagekit.io/5zi86k8wt/Projects/LivestockPro/Foto12.png?tr=w-1400,q-80,fo-auto)
![Cattle list](https://ik.imagekit.io/5zi86k8wt/Projects/LivestockPro/Foto13.png?tr=w-1400,q-80,fo-auto)
![Cattle list](https://ik.imagekit.io/5zi86k8wt/Projects/LivestockPro/Foto14.png?tr=w-1400,q-80,fo-auto)

`/cattle` — filter bar (search by `arete`, gender, race, land) + grid of cattle cards showing the `arete`, the `Hembra` / `Macho` pill, the assigned land and race, and three icon actions: `compare_arrows` (movement), `edit`, `delete`. The `Aplicar` / `Limpiar` pair runs the [draft vs applied](#cattle-and-transactions-draft-vs-applied-filters) pattern so the network call is only fired on demand.

### Cattle movement

![Cattle list](https://ik.imagekit.io/5zi86k8wt/Projects/LivestockPro/Foto15.png?tr=w-1400,q-80,fo-auto)

`MovementForm` opened from `compare_arrows`. The `type` segmented control drives the rest of the form: `Mover de finca` requires a destination different from the source (the `.refine` in `createCattleMovementSchema` enforces it), `Venta` / `Fallecimiento` / `Traslado` only need notes. On success the cattle list, lands list and dashboard stats all refetch in parallel.

### Transactions (Transacciones)

![Transactions](https://ik.imagekit.io/5zi86k8wt/Projects/LivestockPro/Foto16.png?tr=w-1400,q-80,fo-auto)
![Transactions](https://ik.imagekit.io/5zi86k8wt/Projects/LivestockPro/Foto17.png?tr=w-1400,q-80,fo-auto)
![Transactions](https://ik.imagekit.io/5zi86k8wt/Projects/LivestockPro/Foto18.png?tr=w-1400,q-80,fo-auto)

`/transactions` — filter bar with date-range text inputs (auto-formatted as `YYYY/MM/DD`), a `Tipo` dropdown, a **conditional** `Categoría` dropdown that only appears once a type is picked, and `Aplicar` / `Limpiar`. The grid renders cards with the `Ingreso` / `Gasto` pill, the category pill, the formatted date, a truncated description and the amount in colones.

## What the Auth module does

Implements a simple Bearer-token session against the server's `/auth/login` flow.

- Email + password login form with **client-side Zod validation** (mirrors the server schema) in `features/auth/login.schema.ts`.
- On success, the token returned by the server is stored in the Zustand `useAuthStore` (`stores/auth.store.ts:1`) and the user is `navigate("/", { replace: true })`-ed into the protected layout.
- `ProtectedRoute` (`components/layout/ProtectedRoute.tsx:4`) reads `useAuthStore.token`. If it's null the user is redirected to `/login` (no `state.from`, no splash — login is a separate route).
- Logout lives in the `Sidebar` (`components/layout/Sidebar.tsx:15`): it just calls `useAuthStore.getState().logout()` and `navigate("/login", { replace: true })`. No server call, no cache reset, just client-side state clearing.
- **Session-expired flow**: the Axios response interceptor (`lib/apiClient.ts:18`) catches any `401` whose URL is **not** `/auth/login`, calls `logout()` and `window.location.href = "/login?expired=true"` (full reload). The `Login` page (`features/auth/pages/Login.tsx:6`) reads `?expired=true` from the search params and shows a `Tu sesión expiró. Iniciá sesión nuevamente.` banner above the form.

### Project-level decisions

| Decision                                                                       | Where it lives                              | Why                                                                                                                      |
| ------------------------------------------------------------------------------ | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| One single `useAuthStore` Zustand slice exposing `token`, `setToken`, `logout` | `stores/auth.store.ts`                      | The whole app only needs the token to attach `Authorization: Bearer …`; there is no `/me` to bootstrap.                  |
| `useLogin` returns `{ login, isPending, globalError, clearError }`             | `features/auth/hooks/useLogin.tsx:10`       | Forwards a flat surface to the form; the global error is a local `useState` because it is purely a login-screen concern. |
| `LoginForm` validates with Zod **before** calling the mutation                 | `features/auth/components/LoginForm.tsx:29` | Mirrors the server schema; the network call is never made for an invalid payload.                                        |

## What the Dashboard module does

`/` is the landing page after login and renders analytics over cattle, lands, races and transactions. It is **always-on** (no filter-first empty state): it boots with `period = "THIS_MONTH"` and `landValue = "ALL"`, fires `GET /dashboard/stats` on mount, and re-fires whenever any of the three filters change.

### Filters & flow

- `PeriodFilter` (`features/dashboard/components/PeriodFilter.tsx:26`) exposes three controls in a single row:
  - **Período** — `CustomDropDown` with `Este mes` / `Últimos 3 meses` / `Últimos 6 meses` / `Últimos 12 meses` / `Este año` / `Personalizado`.
  - **Finca** — `CustomDropDown` populated from `landApi.getLandsToDropdown()` (query key `["lands-dropdown"]`, warmed via `prefetchQuery` in `useDashboard.tsx:89`).
  - **Rango personalizado** — two date inputs (`Desde` / `Hasta`) only shown when `period === "CUSTOM"`. The input mask auto-formats as `YYYY/MM/DD` (`formatInput` in `PeriodFilter.tsx:17`).
- `useDashboard` (`features/dashboard/hooks/useDashboard.tsx:81`) converts the chosen period into an ISO `{ dateFrom, dateTo }` pair via `resolvePeriodRange` and `landId` is `undefined` when the user picks `Todas las fincas`. The React Query key is composed of `[QUERY_KEY, appliedFilters]`, so any filter change triggers a refetch automatically.
- The page footer shows `Actualizando datos…` while `isFetching && !isLoading`, so background re-fetches are visible but not blocking.

### Panels

Six `KpiCard`s sit at the top, then three chart rows render in parallel. Currency is formatted as `₡<value with US-locale thousand separators>` (`formatCurrency` in `DashboardPage.tsx:13`).

| Block                                                 | Source hook    | What it shows                                                                                                                                                                         |
| ----------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| KPI grid (6 `KpiCard`s)                               | `useDashboard` | `Ganado Activo`, `Fincas Activas` (or `Fincas Filtradas` when a land is picked), `Razas Activas`, `Ingresos`, `Gastos`, `Utilidad Neta` (positive/negative tone flips with the sign). |
| `CattleOverTimeChart` (line)                          | `useDashboard` | `livestock.cattleOverTime` — cabezas de ganado por mes desglosadas por finca.                                                                                                         |
| `IncomeExpenseBarChart` (bar)                         | `useDashboard` | `financial.monthly` — ingresos vs gastos por mes.                                                                                                                                     |
| `ExpensesDonutChart` (doughnut)                       | `useDashboard` | `financial.expensesByCategory` — gastos agrupados por `SALE` / `PURCHASE` / `SALARY` / `SUPPLY`.                                                                                      |
| `MonthlyTrendLineChart` (line)                        | `useDashboard` | Tendencia mensual sobre el mismo `financial.monthly`.                                                                                                                                 |
| `CattleByRaceBarChart` / `CattleByLandBarChart` (bar) | `useDashboard` | Distribución del ganado por raza y por finca.                                                                                                                                         |
| `CattleByGenderDonutChart` (doughnut)                 | `useDashboard` | `MALE` vs `FEMALE`.                                                                                                                                                                   |

Every chart receives `isLoading` and renders a `ChartSkeleton` while pending. When a finca is selected, a footnote (`DashboardPage.tsx:112`) reminds the user that the filter only affects cattle metrics — finances are not scoped to a land.

## What the Lands module does

`/lands` is the **Fincas** CRUD over the `lands` API. Same shell as every other module: `PageHeader` + grid of cards + modal-based mutations.

### Listing

- **Header** with `Crear` button → opens the create modal.
- **Grid** of cards (`5` per row on `xl`) showing the land `name`, an `Activa` / `Inactiva` pill, an `Alquilada` / `Propia` pill, the `ubication` with a `location_on` icon, the cattle count (`_count.Cattles`) and two icon-only actions:
  - `edit` — opens the update modal pre-filled with the current values.
  - `delete` — opens the confirmation modal.
- **Loading state**: centred primary-colour spinner.
- **Empty state**: a `grass` icon + `No hay fincas registradas` panel prompting the user to create their first land.
- The page is intentionally **non-paginated** — `GET /lands` returns the full list and the client renders whatever it gets.

### Mutations

All three hooks (`createLand`, `updateLand`, `deleteLand` in `useLand.tsx:7`) call `Promise.all` to **invalidate `["lands"]`, `["dashboard-stats"]` and `["dropdown"]`** on success, so a CRUD on a finca refreshes the dashboard totals, the lands dropdown, the races dropdown and the land list at once.

| Action     | UX                                                                                                                                                                                                                                                                                                                                        |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Create** | `Crear` in the page header → `Form` modal with `name`, `ubication`, `isRented` (`Propia` / `Alquilada` segmented control) → Zod `safeParse` → `createLand.mutate` → `CustomToast` (`Exito` / success) + `onClose`. Errors from a `400` are mapped to the field that failed; everything else goes to a `serverError` panel above the form. |
| **Update** | `edit` in the card → same `Form` modal pre-filled, with an extra `Activa` toggle pill that only renders when `editedLand` is set → `updateLand.mutate({id, data})` → same toast policy.                                                                                                                                                   |
| **Delete** | `delete` in the card → `DeleteForm` confirmation modal with the land name and `Cancelar` / `Eliminar` (`Eliminar` is the primary danger-coloured button).                                                                                                                                                                                 |

The form's submit button shows an inline spinner while `isCreating || isUpdating` is true; both modals are rendered inside a shared `<Overlay>` (`components/ui/Overlay.tsx:6`).

## What the Races module does

`/races` is the **Razas** CRUD over the `races` API. It is intentionally a near-twin of `Lands` — same card layout, same modal pattern, same invalidation rules — so the two modules stay symmetric and easy to onboard.

### Listing

- **Header** with `Crear` button.
- **Grid** of cards showing the race `name`, the `Activa` / `Inactiva` pill, the cattle count (`_count.Cattles`) and the same `edit` / `delete` icon buttons.
- **Loading state** / **empty state** mirror the Lands page.
- No pagination — `GET /races` returns the full list.

### Mutations

All three hooks (`createRace`, `updateRace`, `deleteRace` in `useRace.tsx:7`) invalidate `["races"]`, `["dashboard-stats"]` and `["dropdown"]` on success, so changing a race also refreshes the dashboard totals and the races dropdown used by the cattle form.

| Action     | UX                                                                                                                                                                            |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Create** | `Crear` in the page header → `Form` modal with `name` (Zod-validated) → `createRace.mutate` → `CustomToast` + close.                                                          |
| **Update** | `edit` in the card → `Form` modal pre-filled with the race name + an `Activa` toggle (only shown when `editedRace` is set) → `updateRace.mutate({id, data})` → toast + close. |
| **Delete** | `delete` in the card → `DeleteForm` confirmation modal with the race name + `Cancelar` / `Eliminar`.                                                                          |

`useRace` also exposes `getRacesToDropdown` (query key `["races", "dropdown"]`) which the `Cattle` page consumes to render the `<CustomDropDown>` for `Raza` in the filter bar and in the create form.

## What the Cattle module does

`/cattle` is the **Ganado** CRUD over the `cattles` API, plus a **movements** sub-flow for changing a head of cattle's state. This is the most feature-complete page in the app.

### Listing

- **Header** with `Crear` button.
- **Filter bar** (`Cattle.tsx:50`) — a single row with: a search input (`Buscar por arete…`), a `Género` `CustomDropDown` (`Todos` / `Hembras` / `Machos`), a `Raza` dropdown fed by `useRace().getRacesToDropdown`, a `Finca` dropdown fed by `useLand().getLandsToDropdown`, and `Aplicar` / `Limpiar` buttons. The dropdowns reflect the **draft** filters; the network call is only fired when the user clicks `Aplicar` (see the [draft vs applied pattern](#cattle-and-transactions-draft-vs-applied-filters)).
- **Grid** of cards (`5` per row on `xl`) showing the `arete` (`name`), a `Hembra` / `Macho` pill, the assigned `Finca` and `Raza`, and three icon actions:
  - `compare_arrows` — opens the **movement** modal (move / sell / die / transfer).
  - `edit` — opens the update modal.
  - `delete` — opens the confirmation modal.
- **Loading state** / **empty state** mirror the other modules.
- **Pagination** footer: counter `Mostrando N animales de M paginas.` + `Anterior` / `Siguiente` buttons, each disabled on the corresponding edge via `pagination?.hasPrevPage` / `hasNextPage`. The page count is currently hard-wired (`useCattle.tsx:53` always sends `page=1, limit=10`) so the buttons serve as a UI affordance; wiring the real page number is a one-line follow-up.

### Mutations

The three CRUD hooks (`createCattle`, `updateCattle`, `deleteCattle` in `useCattle.tsx:14`) invalidate `["cattle"]`, `["lands"]`, `["races"]` and `["dashboard-stats"]` on success, so any change to a head of cattle refreshes the dashboard totals and the dropdowns in one shot.

| Action     | UX                                                                                                                                                                                                                                                                  |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Create** | `Crear` in the page header → `Form` modal with `arete` (`name`), `gender` (`Macho` / `Hembra` segmented control), `landId` and `raceId` dropdowns → Zod `safeParse` (`createCattleSchema` in `cattle.schema.ts:3`) → `createCattle.mutate` → `CustomToast` + close. |
| **Update** | `edit` in the card → same `Form` modal pre-filled with the cattle record → `updateCattle.mutate({id, data})` → toast + close.                                                                                                                                       |
| **Delete** | `delete` in the card → `DeleteForm` confirmation modal with the arete + `Cancelar` / `Eliminar`.                                                                                                                                                                    |

### Cattle movements

`compare_arrows` opens `MovementForm` (`features/cattle/components/MovementForm.tsx`), which posts to `POST /cattles/{id}/movements` via `useCattleMovement` (`features/cattle/hooks/useCattleMovement.tsx:7`). The form is schema-driven by `createCattleMovementSchema` (`cattle.schema.ts:16`):

- `type` — `Mover de finca` / `Venta` / `Fallecimiento` / `Traslado` (the human-readable labels live in `CATTLE_MOVEMENT_LABELS` in `cattle.d.ts:18`).
- `fromLandId` — required, pre-filled with the cattle's current land.
- `toLandId` — required **only** for `MOVED`, and a `.refine` in the schema enforces that it must be different from `fromLandId` ("Selecciona una finca de destino diferente").
- `notes` — optional, capped at 500 chars.

On success, `useCattleMovement` invalidates `["cattle"]`, `["lands"]` and `["dashboard-stats"]` so a sale / death / move is reflected everywhere instantly.

## What the Transactions module does

`/transactions` is the **Transacciones** CRUD over the `transactions` API. It is the only module that models money (income vs expense), so the filter bar is the most elaborate in the app.

### Listing

- **Header** with `Crear` button.
- **Filter bar** (`Transaction.tsx:178`) — `Fecha inicio` / `Fecha fin` text inputs (auto-formatted as `YYYY/MM/DD` via `handleOnChangeDate`), a `Tipo` `CustomDropDown` (`Todos` / `Ingreso` / `Gasto`), a **conditional** `Categoría` dropdown that only appears once a `Tipo` is picked, and `Aplicar` / `Limpiar` buttons. The same [draft vs applied pattern](#cattle-and-transactions-draft-vs-applied-filters) keeps the dropdowns snappy while the network call is only fired when the user clicks `Aplicar`.
- **Date validation gate** (`handleValidateFilters` in `Transaction.tsx:99`) is the only place in the app that pre-validates the draft before the user clicks `Aplicar`: malformed dates, future dates, or `end < start` all surface as a red `CustomToast` without firing a request.
- **Grid** of cards (`6` per row on `xl`) showing the `Ingreso` / `Gasto` pill, the category pill (e.g. `Venta`, `Compra`, `Salario`, `Insumo`), the formatted date, a truncated `description` and the amount (`₡<amount.toLocaleString("en-US")>`), plus `edit` / `delete` icon actions.
- **Loading state** / **empty state** mirror the other modules.
- **Pagination** footer mirrors the cattle page; again, `page` is currently hard-wired to `1` and the buttons act as a UI placeholder.

### Mutations

The three CRUD hooks (`createTransaction`, `updateTransaction`, `deleteTransaction` in `useTransaction.tsx:45`) invalidate `["transaction"]` and `["dashboard-stats"]` on success, so any income / expense reflects in the dashboard `Ingresos` / `Gastos` / `Utilidad Neta` KPIs immediately.

| Action     | UX                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Create** | `Crear` in the page header → `Form` modal with `type` (`Ingreso` / `Gasto` segmented control), `category` (the dropdown options swap based on the chosen type — `Venta` for income, `Compra` / `Salario` / `Insumo` for expense), `amount` (string, parsed as a positive float), `date` (`YYYY/MM/DD`, not in the future) and `description` (1–500 chars) → Zod `safeParse` (`createTransactionSchema` in `transaction.schema.ts:3`) → `createTransaction.mutate` → `CustomToast` + close. |
| **Update** | `edit` in the card → same `Form` modal pre-filled with the transaction → `updateTransaction.mutate({id, data})` → toast + close.                                                                                                                                                                                                                                                                                                                                                           |
| **Delete** | `delete` in the card → `DeleteForm` confirmation modal + `Cancelar` / `Eliminar`.                                                                                                                                                                                                                                                                                                                                                                                                          |

## Cross-cutting concerns

These are the pieces the feature modules share. They're documented here once instead of repeated per feature.

### Cattle and Transactions: draft vs applied filters

Both `useCattle` (`features/cattle/hooks/useCattle.tsx:18`) and `useTransaction` (`features/transaction/hooks/useTransaction.tsx:49`) keep **two** filter states side-by-side:

```
filters       // what the user is currently editing
applyFilters  // what the React Query actually uses
```

The dropdowns write to `filters`; the network call only re-keys when `setApplyFilters(filters)` runs (the `Aplicar` button). `Limpiar` resets **both** in one shot. The benefit: typing in the search box or toggling a dropdown does not refetch on every keystroke; the user controls when a request is fired.

### 401 → logout → `/login?expired=true`

`src/lib/apiClient.ts` is the single place where 401 handling lives. The flow is intentionally simpler than a refresh-token flow because the server only issues a single Bearer token:

```
request fails with 401
  ├─ url includes /auth/login
  │    → propagate as AxiosError (let the form show it)
  └─ any other endpoint
       → useAuthStore.getState().logout()  // clear token
       → window.location.href = "/login?expired=true"  // full reload
```

`useAuthStore` (`stores/auth.store.ts:9`) is the **only** place where `token` is read or written; the request interceptor (`apiClient.ts:8`) attaches `Authorization: Bearer <token>` on every outgoing request, the response interceptor clears it on `401`, and the `Sidebar` clears it on manual logout. There is no React Query `["me"]` cache to invalidate — a hard reload through `window.location.href` resets the whole app state.

### `useClickOutside` hook

`src/hooks/useClickOutside.tsx` is the shared helper behind every overlay-based UI primitive (`CustomDropDown`, future menus / popovers). It takes a `ref`, an `isOpen` flag and an `onClose` callback, and attaches a `mousedown` listener only while `isOpen` is true, so closed dropdowns pay zero listener cost.

### Reusable UI primitives

| Component        | Purpose                                                                                               | Lives in                                          |
| ---------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `Overlay`        | Fixed full-screen backdrop + `z-50` flex centring                                                     | `components/ui/Overlay.tsx`                       |
| `PageHeader`     | Title + description + optional primary action button                                                  | `components/ui/PageHeader.tsx`                    |
| `CustomDropDown` | Custom dropdown (chevron + listbox, click-outside via `useClickOutside`, animated rotate)             | `components/ui/CustomDropDown.tsx`                |
| `InputText`      | Styled text input with optional inline error                                                          | `components/ui/InputText.tsx`                     |
| `Button`         | Primary button with optional inline spinner while `isLoading`                                         | `components/ui/Button.tsx`                        |
| `CustomToast`    | Toast UI with a coloured left rail (green / red), rendered through `react-hot-toast`'s `toast.custom` | `components/ui/CustomToast.tsx`                   |
| `KpiCard`        | Dashboard KPI tile with icon + `tone` (neutral / positive / negative)                                 | `features/dashboard/components/KpiCard.tsx`       |
| `ChartSkeleton`  | Loading placeholder used by every dashboard chart                                                     | `features/dashboard/components/ChartSkeleton.tsx` |

### Layout

- **`Layout`** at `components/layout/Layout.tsx:5` wraps every protected page with a fixed `<Sidebar />` (left rail, `w-64`) and a flex column of `<Header />` + `<Outlet />`. The sidebar declares its navigation items in a single `NAV_LINKS` array (`components/layout/Sidebar.tsx:4`), so adding a route means adding one entry.
- **`Header`** is currently a thin top border placeholder — feature work goes here.
- **`Sidebar`** shows the `LivestockPro` logo (`material-symbols-outlined` `agriculture` icon), the five nav links and a footer with a `Logout` action that clears the Zustand token and navigates to `/login`.

## Project layout

```
src/
├── App.tsx                                 # QueryClientProvider + RouterProvider + Toaster
├── main.tsx                                # React root + StrictMode
├── router.tsx                              # /login (public) + ProtectedRoute → Layout → internal routes
├── index.css                               # Tailwind v4 + brand tokens (primary, text-primary, …)
├── lib/
│   └── apiClient.ts                        # axios instance + request (Bearer) and response (401 → logout) interceptors
├── stores/
│   └── auth.store.ts                       # Zustand: token + setToken + logout
├── hooks/
│   └── useClickOutside.tsx                 # shared helper used by CustomDropDown and future popovers
├── types/
│   └── index.d.ts                          # ApiResponse<T>, ApiErrorResponse, PaginationResult
├── components/
│   ├── layout/
│   │   ├── Layout.tsx                      # Sidebar + Header + <Outlet />
│   │   ├── Sidebar.tsx                     # NAV_LINKS + Logout button
│   │   ├── Header.tsx                      # placeholder (top border)
│   │   └── ProtectedRoute.tsx              # gate based on useAuthStore.token
│   ├── ui/
│   │   ├── Button.tsx                      # inline spinner, variants via className
│   │   ├── CustomDropDown.tsx              # dropdown wired to useClickOutside
│   │   ├── CustomToast.tsx                 # toast with green / red rail
│   │   ├── InputText.tsx                   # styled input + inline error
│   │   ├── Overlay.tsx                     # backdrop + z-50
│   │   └── PageHeader.tsx                  # title + description + optional CTA
│   └── icons/                              # (reserved for extracted SVG icons)
└── features/
    ├── auth/
    │   ├── api.ts                          # authApi.login → POST /auth/login
    │   ├── auth.d.ts                       # UserCredentials
    │   ├── auth.adapter.ts                 # (reserved for DTO ↔ domain transforms)
    │   ├── login.schema.ts                 # Zod: email + password
    │   ├── hooks/useLogin.tsx              # useMutation + useAuthStore.setToken + navigate("/")
    │   ├── components/
    │   │   ├── FirstPanel.tsx              # hero with background image for /login
    │   │   ├── InputPassword.tsx           # input with visibility toggle
    │   │   └── LoginForm.tsx               # form with Zod + reads ?expired=true
    │   └── pages/Login.tsx                 # <FirstPanel /> + <LoginForm />
    ├── dashboard/
    │   ├── api.ts                          # DashboardApi.getStats(filters)
    │   ├── dashboard.d.ts                  # KPIs / financial / livestock / period / filters
    │   ├── hooks/useDashboard.tsx          # period state + landId + appliedFilters + useQuery
    │   ├── components/
    │   │   ├── PeriodFilter.tsx            # Period / Land / Custom range
    │   │   ├── KpiCard.tsx                 # KPI tile with tone
    │   │   ├── ChartSkeleton.tsx           # loading state for the charts
    │   │   ├── chartColors.ts              # palette shared by every chart
    │   │   ├── CattleOverTimeChart.tsx
    │   │   ├── CattleByGenderDonutChart.tsx
    │   │   ├── CattleByRaceBarChart.tsx
    │   │   ├── CattleByLandBarChart.tsx
    │   │   ├── IncomeExpenseBarChart.tsx
    │   │   ├── ExpensesDonutChart.tsx
    │   │   └── MonthlyTrendLineChart.tsx
    │   └── pages/DashboardPage.tsx         # composes the 6 KpiCards + 3 chart rows
    ├── land/
    │   ├── api.ts                          # CRUD + getLandsToDropdown
    │   ├── land.d.ts                       # Land / LandPayload / LandError / LandToDropdown
    │   ├── land.adapter.ts                 # (reserved)
    │   ├── land.schema.ts                  # Zod: createLandSchema
    │   ├── hooks/useLand.tsx               # useQuery list + 3 mutations (invalidate lands, dashboard-stats, dropdown)
    │   ├── components/
    │   │   ├── Form.tsx                    # unified create + update
    │   │   └── DeleteForm.tsx              # delete confirmation
    │   └── pages/Land.tsx                  # grid of cards + Overlay hosting Form / DeleteForm
    ├── race/
    │   ├── api.ts                          # CRUD + getRacesToDropdown
    │   ├── race.d.ts                       # Race / RacePayload / RaceError / RaceToDropdown
    │   ├── race.adapter.ts                 # (reserved)
    │   ├── race.schema.ts                  # Zod: createRaceSchema
    │   ├── hooks/useRace.tsx               # same pattern as useLand
    │   ├── components/
    │   │   ├── Form.tsx
    │   │   └── DeleteForm.tsx
    │   └── pages/Race.tsx                  # twin of Land.tsx
    ├── cattle/
    │   ├── api.ts                          # CRUD + createCattleMovement
    │   ├── cattle.d.ts                     # Cattle / CattlePayload / CattleFilters / CattleMovementPayload / CATTLE_MOVEMENT_LABELS
    │   ├── cattle.adapter.ts               # (reserved)
    │   ├── cattle.schema.ts                # Zod: createCattleSchema + createCattleMovementSchema
    │   ├── hooks/
    │   │   ├── useCattle.tsx               # filters (draft + applied) + CRUD + GENDER_OPTIONS
    │   │   └── useCattleMovement.tsx       # useMutation for /movements
    │   ├── components/
    │   │   ├── Form.tsx                    # create + update
    │   │   ├── DeleteForm.tsx
    │   │   └── MovementForm.tsx            # Move / Sale / Death / Transfer
    │   └── pages/Cattle.tsx                # filter bar + grid + pagination + modals
    ├── transaction/
    │   ├── api.ts                          # CRUD (normalises dates to ISO before sending)
    │   ├── transaction.d.ts                # Transaction / TransactionPayload / TransactionFilters / PaginatedTransactionResponse
    │   ├── transaction.schema.ts           # Zod: createTransactionSchema (amount > 0, valid non-future date)
    │   ├── hooks/useTransaction.tsx        # filters (draft + applied) + CRUD + TRANSACTION_TYPE_OPTIONS / INCOME / EXPENSE
    │   ├── components/
    │   │   ├── Form.tsx
    │   │   └── DeleteForm.tsx
    │   └── pages/Transaction.tsx           # filter bar with date validation + grid + pagination + modals
    └── user/                               # scaffold (placeholders for a future user-management module)
        ├── api.ts                          # empty
        ├── user.d.ts                       # empty
        ├── user.adapter.ts                 # empty
        ├── hooks/                          # empty
        ├── components/                     # empty
        └── pages/                          # empty
```

Every `features/<name>/` follows the same convention: `api.ts`, `*.d.ts` (types), optional `*.schema.ts` (Zod), `*.adapter.ts` (DTO ↔ domain, currently reserved), `hooks/`, `components/`, `pages/`. Modules with a "list with filters" page (`cattle`, `transaction`) keep the **draft vs applied** filter pattern in their `useX` hook; modules that are simple CRUDs (`land`, `race`) do not. Bootstrap a new module by copying `land/` and rewriting the names — `auth/` adds a `*.schema.ts` and reads a token, `dashboard/` is read-only and skips the mutation hooks, and `cattle/` is the only one with a second `useCattleMovement` hook.
