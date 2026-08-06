export type ApiDevilFruit = {
  externalId: number;
  name: string;
  romanizedName?: string | null;
  type?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  status?: string | null;
};

export type DevilFruitPage = {
  data: ApiDevilFruit[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type DisplayDevilFruit = {
  id: string;
  originalName: string;
  translatedName: string;
  type: 'Paramecia' | 'Logia' | 'Zoan';
  description: string;
  ability: string;
  imageUrl?: string | null;
  user?: string;
};

export type DisplayDevilFruitPage = {
  data: DisplayDevilFruit[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

function normalizeType(type: string | null | undefined): DisplayDevilFruit['type'] {
  if (type?.toLowerCase().includes('logia')) return 'Logia';
  if (type?.toLowerCase().includes('zoan')) return 'Zoan';
  return 'Paramecia';
}

function mapDevilFruit(fruit: ApiDevilFruit): DisplayDevilFruit {
  return {
    id: String(fruit.externalId),
    originalName: fruit.name,
    translatedName: fruit.romanizedName ?? fruit.name,
    type: normalizeType(fruit.type),
    description: fruit.description ?? 'Données manquantes dans les archives.',
    ability: fruit.status ?? 'Capacité non renseignée.',
    imageUrl: fruit.imageUrl,
  };
}

export async function fetchDevilFruitPage(page = 1, limit = 24): Promise<DisplayDevilFruitPage> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  const response = await fetch(`${API_URL}/api/punk-records/devil-fruits?${params}`);
  if (!response.ok) throw new Error(`API request failed with status ${response.status}`);

  const payload = (await response.json()) as DevilFruitPage;
  return { ...payload, data: payload.data.map(mapDevilFruit) };
}

export async function fetchDevilFruits(): Promise<DisplayDevilFruit[]> {
  return (await fetchDevilFruitPage(1, 100)).data;
}
