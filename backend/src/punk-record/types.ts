export type PunkRecordResource =
  | 'characters'
  | 'crews'
  | 'devil-fruits'
  | 'islands'
  | 'organizations'
  | 'ships'
  | 'sagas'
  | 'arcs'
  | 'chapters'
  | 'volumes'
  | 'episodes';

export interface PunkRecordEntity {
  id: number | string;
  [key: string]: unknown;
}

export interface SyncStats {
  resource: PunkRecordResource;
  fetched: number;
  created: number;
  updated: number;
  failed: number;
  startedAt: string;
  finishedAt?: string;
  errors: Array<{ id?: number | string; message: string }>;
}

export interface SyncStore<T extends PunkRecordEntity> {
  upsert(entity: T): Promise<'created' | 'updated'>;
}
