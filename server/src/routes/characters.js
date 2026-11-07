import { Router } from 'express';
import {
  createCharacter,
  deleteCharacter,
  getCharacter,
  listCharacters,
  updateCharacter,
} from '../controllers/characterController.js';
import { asyncHandler, validateObjectId } from '../middleware/errorHandler.js';

const router = Router();

router.route('/').get(asyncHandler(listCharacters)).post(asyncHandler(createCharacter));

router
  .route('/:id')
  .get(validateObjectId(), asyncHandler(getCharacter))
  .patch(validateObjectId(), asyncHandler(updateCharacter))
  .delete(validateObjectId(), asyncHandler(deleteCharacter));

export default router;
