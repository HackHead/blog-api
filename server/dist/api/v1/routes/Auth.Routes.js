import { Router } from 'express';
import AuthController from '../controllers/Auth.Controllers.js';
import log from '../../../middleware/log.js';
import hasAccess from '../../../middleware/hasAccess.js';
const router = Router();
router.use(log);
router
    .post('/tokens', hasAccess('fullAccess'), AuthController.createToken)
    .get('/tokens', hasAccess('fullAccess'), AuthController.getTokens)
    .delete('/tokens/:id', hasAccess('fullAccess'), AuthController.deleteToken)
    // .post('/users', AuthController.createUser)
    .post('/logout', AuthController.logout)
    .post('/login', AuthController.login)
    .get('/me', AuthController.me);
export default router;
