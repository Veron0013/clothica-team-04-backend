import { Router } from 'express';
import { celebrate } from 'celebrate';
import { getCurrentUser, updateUserProfile } from '../controllers/userController.js';
import { upload } from '../middleware/multer.js';
import { authenticate } from '../middleware/authenticate.js';
import { updateUserSchema } from '../validations/userValidation.js';

const router = Router();

router.patch('/users/me', authenticate, upload.single('avatar'), celebrate(updateUserSchema), updateUserProfile);
router.get('/users/me', authenticate, getCurrentUser);

export default router;
