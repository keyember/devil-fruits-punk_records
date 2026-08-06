# Punk Records API

## Devil Fruits — list

`GET /api/punk-records/devil-fruits?page=1&limit=24&search=fire&type=Logia`

- `page`: page number, default `1`.
- `limit`: number of records per page, default `24`, maximum `100`.
- `search`: case-insensitive search on the fruit name.
- `type`: exact fruit type filter (`Paramecia`, `Logia` or `Zoan`).

Response shape:

```json
{
  "data": [],
  "page": 1,
  "limit": 24,
  "total": 0,
  "totalPages": 0
}
```

## Devil Fruits — detail

`GET /api/punk-records/devil-fruits/:externalId`

Returns the fruit identified by its remote API identifier or `404` when it does not exist.
