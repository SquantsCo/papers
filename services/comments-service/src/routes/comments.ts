import { Router } from 'express';
import { 
  createComment,
  getCommentsByPaper,
  deleteComment
} from '../controllers/commentsController';

const router = Router();

router.post('/', createComment);
router.get('/paper/:paperId', getCommentsByPaper);
router.delete('/:id', deleteComment);

export default router;
