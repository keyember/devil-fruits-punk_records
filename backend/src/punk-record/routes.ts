import { Router, type Request, type Response } from 'express';
import type { PrismaClient } from '@prisma/client';
import { getDevilFruitByExternalId, listDevilFruits } from './api.js';

function positiveInteger(value: unknown): number | undefined {
  if (typeof value !== 'string' || !/^\d+$/.test(value)) return undefined;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : undefined;
}

export function createDevilFruitRouter(prisma: PrismaClient): Router {
  const router = Router();

  router.get('/devil-fruits', async (req: Request, res: Response) => {
    const page = req.query.page === undefined ? undefined : positiveInteger(req.query.page);
    const limit = req.query.limit === undefined ? undefined : positiveInteger(req.query.limit);

    if (req.query.page !== undefined && page === undefined) {
      res.status(400).json({ error: 'page must be a positive integer' });
      return;
    }
    if (req.query.limit !== undefined && limit === undefined) {
      res.status(400).json({ error: 'limit must be a positive integer' });
      return;
    }

    try {
      const result = await listDevilFruits(prisma, {
        page,
        limit,
        search: typeof req.query.search === 'string' ? req.query.search : undefined,
        type: typeof req.query.type === 'string' ? req.query.type : undefined,
      });
      res.json(result);
    } catch (error) {
      console.error('Failed to list Devil Fruits', error);
      res.status(500).json({ error: 'Unable to load Devil Fruits' });
    }
  });

  router.get('/devil-fruits/:externalId', async (req: Request, res: Response) => {
    const externalId = positiveInteger(req.params.externalId);
    if (externalId === undefined) {
      res.status(400).json({ error: 'externalId must be a positive integer' });
      return;
    }

    try {
      const fruit = await getDevilFruitByExternalId(prisma, externalId);
      if (!fruit) {
        res.status(404).json({ error: 'Devil Fruit not found' });
        return;
      }
      res.json(fruit);
    } catch (error) {
      console.error('Failed to load Devil Fruit', error);
      res.status(500).json({ error: 'Unable to load Devil Fruit' });
    }
  });

  return router;
}
