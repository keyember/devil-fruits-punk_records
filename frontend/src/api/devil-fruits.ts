export type ApiDevilFruit = {
  externalId: number;
  name: string;
  romanizedName?: string | null;
  type?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  status?: string | null;
};

export type DisplayDevilFruit = {
  id: string;
  originalName: string;
  translatedName: string;
  type: string;
  description: string;
  ability: string;
  imageUrl?: string | null;
};

export type DisplayDevilFruitPage = {
  data: DisplayDevilFruit[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

function mapDevilFruit(fruit: ApiDevilFruit): DisplayDevilFruit {
  return {
    id: String(fruit.externalId),
    originalName: fruit.name.trim(),
    translatedName: fruit.romanizedName ?? fruit.name.trim(),
    type: fruit.type?.trim() || 'Inconnu',
    description: fruit.description?.trim() || 'Données manquantes dans les archives.',
    ability: fruit.status ?? 'Capacité non renseignée.',
    imageUrl: fruit.imageUrl,
  };
}

export async function fetchDevilFruitPage(
  page = 1,
  limit = 24,
  filters: { search?: string; type?: string } = {},
): Promise<DisplayDevilFruitPage> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (filters.search?.trim()) params.set('search', filters.search.trim());
  if (filters.type && filters.type !== 'all') params.set('type', filters.type);

  const response = await fetch(`${API_URL}/api/punk-records/devil-fruits?${params}`);
  if (!response.ok) throw new Error(`API request failed with status ${response.status}`);

  const payload = (await response.json()) as {
    data: ApiDevilFruit[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  return { ...payload, data: payload.data.map(mapDevilFruit) };
}
