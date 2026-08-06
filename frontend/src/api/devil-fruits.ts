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

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

function normalizeType(type: string | null | undefined): DisplayDevilFruit['type'] {
  if (type?.toLowerCase().includes('logia')) return 'Logia';
  if (type?.toLowerCase().includes('zoan')) return 'Zoan';
  return 'Paramecia';
}

export async function fetchDevilFruits(): Promise<DisplayDevilFruit[]> {
  const response = await fetch(`${API_URL}/api/punk-records/devil-fruits?limit=100`);
  if (!response.ok) throw new Error(`API request failed with status ${response.status}`);

  const payload = (await response.json()) as DevilFruitPage;
  return payload.data.map((fruit) => ({
    id: String(fruit.externalId),
    originalName: fruit.name,
    translatedName: fruit.romanizedName ?? fruit.name,
    type: normalizeType(fruit.type),
    description: fruit.description ?? 'Données manquantes dans les archives.',
    ability: fruit.status ?? 'Capacité non renseignée.',
    imageUrl: fruit.imageUrl,
  }));
}
