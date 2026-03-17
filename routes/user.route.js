import express from 'express'
import { signin,signup,signout,getUser,updateProfile } from '../controllers/user.controller.js';
import { isAuthenticated } from '../middelware/auth.middleware.js';
const router=express.Router();
router.post('/sign-up',signup);
router.post('/sign-in',signin)
router.get('/sign-out', isAuthenticated,signout);//jb hi isko route krege phle user isAuth or not hai ya nhi check krega fhir jo na hai hoga
router.get('/me',isAuthenticated,getUser);//jb hi isko route krege phle user isAuth or not hai ya nhi check krega fhir jo na hai hoga
router.put('/update-profile',isAuthenticated,updateProfile)//jb hi isko route krege phle user isAuth or not hai ya nhi check krega fhir jo na hai hoga
export default router;