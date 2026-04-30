# Car Service Center Operations Platform

A polished client-demo prototype for managing car service center operations from vehicle arrival through plate confirmation, service order creation, mechanic workflow updates, live TV display, vehicle history, and manager analytics.

## Key Features

- Mock ANPR plate detection with confidence score and manual correction
- Reception check-in flow for existing and new vehicles
- Service package and add-on selection with estimated price and duration
- Active jobs dashboard with search and filtering
- Mechanic tablet Kanban board with live workflow updates and status logs
- Customer TV display with privacy setting and auto-refresh
- Vehicle history by plate number with service timeline
- Admin analytics with KPIs, charts, bay utilization, and mechanic workload
- Local JSON seed data for a reliable demo flow

## Tech Stack

- Next.js with TypeScript
- Tailwind CSS
- Local JSON database for the prototype
- Next.js API routes
- lucide-react icons
- Recharts analytics charts
- Polling-based refresh for prototype realtime behavior

## Install

```bash
npm install
```

## Seed Demo Data

```bash
npm run seed
```

## Run

```bash
npm run dev
```

Open `http://localhost:3000`.

## Client Demo Flow

1. Open `/check-in`.
2. Upload any vehicle image.
3. Click **Detect Plate** to run the mock ANPR pipeline.
4. Confirm or edit the detected plate.
5. Select an existing vehicle or create a new one.
6. Choose a package and add-ons in `/service-selection/[plate]`.
7. Create the order and review it in `/jobs`.
8. Open `/mechanic` and move the vehicle through workflow stages.
9. Open `/tv` to show the customer-facing live status board.
10. Open `/admin` for KPIs and charts.
11. Open `/vehicles` to search by plate and review service history.

## Seeded Demo Data

Seed includes realistic Sri Lankan customer names, vehicles, service packages, mechanics, bays, and active jobs:

- `CAB-4589` in Washing Bay
- `ABC-1234` in Oil Change
- `WP-CAR-2211` Waiting
- `CAA-7788` in Final Check
- `KI-9090` Ready for Delivery

## Future Implementation Plan

- Real camera capture and entry gate integration
- Real ANPR provider integration through `lib/anpr.ts`
- Supabase or PostgreSQL backend
- WebSocket/Supabase Realtime updates
- Customer SMS/WhatsApp notifications
- Billing and invoice module
- Inventory and parts management
- Role-based authentication and audit trails

## Prototype Limitations

- ANPR is mocked and returns prepared realistic plate numbers.
- Realtime updates use polling instead of WebSockets.
- Package editing in Settings is visual for the prototype, except TV privacy which is persisted.
- Authentication is intentionally omitted for demo speed.
