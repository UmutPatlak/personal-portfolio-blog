import type { Post } from '@/types/post';

export const fallbackPosts: Post[] = [
  {
    id: 1,
    title: 'Architecting an OCPP Gateway Admin Panel: Lessons in Scalability & Mock-First Dev',
    slug: 'architecting-ocpp-gateway-admin-panel',
    summary:
      'How to design a mission-critical admin console for EV charging stations using React, TypeScript, Server-Sent Events, and a contract-driven mock-first API pattern.',
    content: `## The Challenge: Real-Time EV Charging at Scale

When building an admin platform for an OCPP (Open Charge Point Protocol) gateway, reliability and real-time observability are paramount. Operators need immediate insights into station connectivity, boot notifications, transaction statuses, and firmware updates across hundreds of charging points.

\`\`\`typescript
interface GatewayApi {
  getStations(params: StationFilterParams): Promise<StationListResponse>;
  streamStationEvents(stationId: string, onEvent: (event: StationEvent) => void): () => void;
  sendRemoteCommand(stationId: string, cmd: OCPPCommand): Promise<CommandResult>;
}
\`\`\`

### Mock-First API Architecture

To decouple frontend UI delivery from backend microservice deployments, we implemented a single unified TypeScript interface backed by both \`mockApi.ts\` and \`realApi.ts\`.

- **Type Safety:** Compile-time drift detection prevents breaking changes between API iterations.
- **Zero-Latency Prototyping:** UI flows for complex edge cases (e.g. timeout handling, transaction invalidation) can be tested deterministically.
- **Seamless Switch:** A single runtime environment toggle switches between offline mocked data and production SSE endpoints.

### Real-Time Updates with Server-Sent Events (SSE)

Unlike full-duplex WebSockets, SSE provides lightweight, auto-reconnecting unidirectional streams over standard HTTP/2, perfectly suited for charging station heartbeat feeds and meter values.

\`\`\`typescript
export function subscribeToStationStream(stationId: string) {
  const eventSource = new EventSource(\`/api/stations/\${stationId}/events\`);
  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    queryClient.setQueryData(['station', stationId], (prev) => updateStationState(prev, data));
  };
  return () => eventSource.close();
}
\`\`\`

### Key Takeaways
1. **Model state transitions strictly:** EV transactions have explicit lifecycle steps (*Preparing*, *Charging*, *SuspendedEV*, *Finishing*).
2. **Defensive UI states:** Never assume connectivity is always continuous; design clear reconnecting and offline badges.`,
    coverImage: null,
    tags: ['React', 'TypeScript', 'OCPP', 'Architecture', 'SSE'],
    status: 'published',
    readingTime: 5,
    authorId: 1,
    publishedAt: '2026-08-15T10:00:00.000Z',
    createdAt: '2026-08-15T10:00:00.000Z',
    updatedAt: '2026-08-15T10:00:00.000Z',
  },
  {
    id: 2,
    title: 'Solving Production Multi-Tenant Isolation & Transaction Invalidation in SaaS',
    slug: 'solving-multi-tenant-isolation-and-transaction-invalidation',
    summary:
      'Practical engineering insights from maintaining large-scale multi-operator EV charging station networks with Spring Boot, Angular, and PostgreSQL.',
    content: `## Real-World SaaS Challenges in EV Networks

Operating a multi-tenant platform serving 1,200+ EV charging stations across different corporate operators requires strict tenant isolation and resilient data reconciliation mechanisms.

### 1. Robust Tenant Isolation at the Query Layer

A common pitfall in multi-tenant SaaS architectures is leaking entity lookups when querying relational records. In Spring Boot / JPA or Drizzle ORM, multi-tenant predicates must be enforced universally at repository boundaries.

\`\`\`java
@Query("SELECT t FROM Transaction t WHERE t.tenantId = :tenantId AND t.status = :status")
Page<Transaction> findByTenantAndStatus(
    @Param("tenantId") String tenantId,
    @Param("status") TransactionStatus status,
    Pageable pageable
);
\`\`\`

### 2. Auto-Closing Zero-Energy Stale Transactions

In distributed hardware networks, chargers occasionally drop network connection mid-session or fail to send a \`StopTransaction\` frame. Over time, stale sessions accumulate, confusing end-users on consumer mobile apps.

We designed a scheduled reconciliation service that detects zero-energy transactions inactive for >24h:

1. Identifies inactive transactions matching criteria (\`energyConsumed == 0 && lastMeterTimestamp < now - 24h\`).
2. Dispatches an asynchronous CSMS cleanup event.
3. Transitions transaction status to \`INVALIDATED\` with an audit log reason.

\`\`\`typescript
// End-to-end filter predicate
const isInvalidTransaction = (tx: Transaction) =>
  tx.energyKwh === 0 &&
  Date.now() - new Date(tx.startedAt).getTime() > 24 * 60 * 60 * 1000;
\`\`\`

### Results
- Eliminated over 98% of orphaned charging session tickets in customer support.
- Streamlined data export jobs with bounded query windows and pagination caps.`,
    coverImage: null,
    tags: ['Spring Boot', 'PostgreSQL', 'Multi-Tenancy', 'Backend', 'SaaS'],
    status: 'published',
    readingTime: 4,
    authorId: 1,
    publishedAt: '2026-07-28T14:30:00.000Z',
    createdAt: '2026-07-28T14:30:00.000Z',
    updatedAt: '2026-07-28T14:30:00.000Z',
  },
  {
    id: 3,
    title: 'Modern Full-Stack DX: Pairing NestJS & Drizzle ORM with React 19',
    slug: 'modern-fullstack-dx-nestjs-drizzle-react19',
    summary:
      'Why the combination of NestJS for modular backend logic, Drizzle ORM for type-safe SQL, and React 19 provides unprecedented developer velocity.',
    content: `## The Modern TypeScript Full-Stack Stack

Over the past few years, the Node.js ecosystem has converged on solutions that maximize type safety from database schemas to client components.

### Why Drizzle ORM?

Unlike traditional heavy ORMs, Drizzle provides a lightweight SQL-like syntax that stays close to SQL while giving 100% end-to-end TypeScript inference:

\`\`\`typescript
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  content: text('content').notNull(),
  publishedAt: timestamp('published_at', { withTimezone: true }),
});

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
\`\`\`

### Clean Dependency Injection with NestJS

NestJS offers enterprise-grade architectural patterns out of the box:
- **Dependency Injection** for clean unit testing and modular service boundaries.
- **Guards & Interceptors** for JWT verification and global exception filters.
- **Fast compilation** with SWC and TypeScript.

### Conclusion

Pairing React 19 frontend with a modular NestJS/Drizzle backend provides rapid prototyping speed without sacrificing long-term maintainability.`,
    coverImage: null,
    tags: ['TypeScript', 'NestJS', 'Drizzle ORM', 'React', 'Full-Stack'],
    status: 'published',
    readingTime: 4,
    authorId: 1,
    publishedAt: '2026-07-10T09:15:00.000Z',
    createdAt: '2026-07-10T09:15:00.000Z',
    updatedAt: '2026-07-10T09:15:00.000Z',
  },
];
