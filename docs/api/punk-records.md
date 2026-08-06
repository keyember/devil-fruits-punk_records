# Punk Records API

## List

`GET /api/punk-records?page=1&limit=24&search=fire&category=paramecia`

- `page`: page number, default `1`.
- `limit`: number of records per page, default `24`, maximum `100`.
- `search`: case-insensitive search on the record name.
- `category`: exact category filter.

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

## Detail

`GET /api/punk-records/:id`

Returns the record or `404` when it does not exist.
