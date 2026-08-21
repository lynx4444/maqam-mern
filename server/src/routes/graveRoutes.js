import express from 'express';
import {
  getGraves,
  searchGraves,
  getGraveById,
  createGrave,
  updateGrave,
  deleteGrave,
} from '../controllers/graveController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';
import { uploadGravePhoto } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes for visitors / map
router.get('/', getGraves);
router.get('/search', searchGraves);
router.get('/:id', getGraveById);

// Admin-protected CRUD routes
router.post('/', protect, requireAdmin, uploadGravePhoto.single('photo'), createGrave);
router.put('/:id', protect, requireAdmin, uploadGravePhoto.single('photo'), updateGrave);
router.delete('/:id', protect, requireAdmin, deleteGrave);

export default router;
