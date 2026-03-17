import express from 'express'
import {getAllUsers,getMessages,sendMessage} from '../controllers/message.controller.js'
const router= express.Router();
import {isAuthenticated} from '../middelware/auth.middleware.js'
router.get('/users',isAuthenticated,getAllUsers);
router.get('/:id',isAuthenticated,getMessages);
router.post('/send/:id',isAuthenticated,sendMessage);

export default router;