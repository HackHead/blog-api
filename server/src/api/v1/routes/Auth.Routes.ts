import { Router } from "express";
import AuthController from "../controllers/Auth.Controllers.js";
import log from "../../../middleware/log.js";

const router = Router();

router.use(log)

router
    .post('/tokens', AuthController.createToken)
    .post('/users', AuthController.createUser)

export default router;