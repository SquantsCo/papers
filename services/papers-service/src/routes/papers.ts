import { Router } from 'express';
import { 
  createPaper, 
  getPapers, 
  getPaperById, 
  updatePaper, 
  deletePaper 
} from '../controllers/papersController';

const router = Router();

router.post('/', createPaper);
router.get('/', getPapers);
router.get('/:id', getPaperById);
router.put('/:id', updatePaper);
router.delete('/:id', deletePaper);

export default router;
