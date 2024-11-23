import { Router } from 'express';
import authRouter from './auth';
import bookmarkRouter from './bookmark';
import searchRouter from './search';
import weatherRouter from './weather';
import hotRouter from './hot';
import systemRouter from './system';

const router = Router();

router.use('/auth', authRouter);
router.use('/bookmark', bookmarkRouter);
router.use('/search', searchRouter);
router.use('/weather', weatherRouter);
router.use('/hot', hotRouter);
router.use('/system', systemRouter);

export default router; 