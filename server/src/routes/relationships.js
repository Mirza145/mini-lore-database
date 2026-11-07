import { Router } from 'express';
import {
  createRelationship,
  deleteRelationship,
  listRelationships,
  updateRelationship,
} from '../controllers/relationshipController.js';
import { asyncHandler, validateObjectId } from '../middleware/errorHandler.js';

const router = Router();

router.route('/').get(asyncHandler(listRelationships)).post(asyncHandler(createRelationship));

router
  .route('/:id')
  .patch(validateObjectId(), asyncHandler(updateRelationship))
  .delete(validateObjectId(), asyncHandler(deleteRelationship));

export default router;
