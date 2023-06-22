import { Router } from "express";
import log from "../../../middleware/log.js";
import BlogControllers from "../controllers/Blog.Controllers.js";
import hasAccess from "../../../middleware/hasAccess.js";

const router = Router();

router.use(log)
router
    .post('/articles', BlogControllers.createArticle)
    .post('/articles/:id/localization', BlogControllers.createArticleLocalization)
    .post('/categories', BlogControllers.createCategory)
    .post('/categories/:id/localization', BlogControllers.createCategoryLocalization)
    .get('/articles', BlogControllers.getArticles)
    .get('/categories', BlogControllers.getCategories)
    .get('/categories/:id', BlogControllers.getCategory)
export default router;