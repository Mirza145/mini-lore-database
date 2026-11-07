import { Router } from 'express';
import {
  createLoreEntry,
  deleteLoreEntry,
  getLoreEntry,
  listLoreEntries,
  updateLoreEntry,
} from '../controllers/loreEntryController.js';
import { asyncHandler, validateObjectId } from '../middleware/errorHandler.js';

const router = Router();

router.route('/').get(asyncHandler(listLoreEntries)).post(asyncHandler(createLoreEntry));

router
  .route('/:id')
  .get(validateObjectId(), asyncHandler(getLoreEntry))
  .patch(validateObjectId(), asyncHandler(updateLoreEntry))
  .delete(validateObjectId(), asyncHandler(deleteLoreEntry));

export default router;
