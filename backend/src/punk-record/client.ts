import type { PunkRecordEntity, PunkRecordResource } from './types.js';

export interface OnePieceClientOptions {
  baseUrl: string;
  language?: string;
  fetcher?: typeof fetch;
}

export class OnePieceApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = 'OnePieceApiError';
  }
}

const remoteResources: Record<PunkRecordResource, string> = {
  characters: 'characters',
  crews: 'crews',
  'devil-fruits': 'fruits',
  islands: 'islands',
  organizations: 'organizations',
  ships: 'ships',
  sagas: 'sagas',
  arcs: 'arcs',
  chapters: 'chapters',
  volumes: 'volumes',
  episodes: 'episodes',
};

export class OnePieceClient {
  private readonly fetcher: typeof fetch;
  private readonly language: string;

  constructor(private readonly options: OnePieceClientOptions) {
    this.fetcher = options.fetcher ?? fetch;
    this.language = options.language ?? 'fr';
  }

  async list<T extends PunkRecordEntity>(resource: PunkRecordResource): Promise<T[]> {
    const url = new URL(
      `/v2/${remoteResources[resource]}/${this.language}`,
      this.options.baseUrl.endsWith('/') ? this.options.baseUrl : `${this.options.baseUrl}/`,
    );
    const response = await this.fetcher(url, { headers: { accept: 'application/json' } });

    if (!response.ok) {
      throw new OnePieceApiError(`One Piece API returned ${response.status}`, response.status);
    }

    const payload = (await response.json()) as unknown;
    if (Array.isArray(payload)) return payload as T[];
    if (payload && typeof payload === 'object' && 'data' in payload && Array.isArray(payload.data)) {
      return payload.data as T[];
    }
    throw new OnePieceApiError(`Unexpected response for resource ${resource}`);
  }
}
