# Punk Record

The project is being expanded from a Devil Fruit catalogue into a local One Piece knowledge base.

## Backend direction

- The remote API is accessed through `OnePieceClient`.
- Synchronization is isolated from HTTP controllers.
- Resources are imported with idempotent `upsert` operations.
- The local database remains the source used by the frontend.
- Each synchronization returns fetched, created, updated and failed counters.

## Planned resources

Characters, crews, Devil Fruits, islands, organizations, ships, sagas, arcs, chapters, volumes and episodes.

## Configuration

The API base URL and language should be provided by the backend environment. The client intentionally accepts an injected `fetcher`, which makes it straightforward to test requests without making network calls.

## Next steps

1. Validate all documented API routes and response envelopes.
2. Map the current Prisma schema to the resource models.
3. Add migrations and Prisma-backed stores.
4. Expose local paginated endpoints.
5. Add scheduled and manual synchronization commands.
6. Build the resource search and detail pages in the frontend.
