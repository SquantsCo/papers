import { Router } from 'express';
import { lookupArxiv } from '../controllers/arxivController';

const router = Router();

router.post('/lookup', lookupArxiv);

export default router;
