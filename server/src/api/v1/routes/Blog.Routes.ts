import { Router } from 'express';
import log from '../../../middleware/log.js';
import BlogControllers from '../controllers/Blog.Controllers.js';
import hasAccess from '../../../middleware/hasAccess.js';

const router = Router();

router.use(log);
/**
* @swagger
* /api/v1/articles:
*  get:
*    summary: Получить список статей
*    tags:
*      - Articles
*    responses:
*      200:
*        description: Успешный ответ
*    parameters:
*      - name: category
*        in: query
*        description: Фильтровать статьи по категории
*        schema:
*          type: string
*    examples:
*      - name: Пример запроса
*        value: |
*          GET /api/articles?category=technology HTTP/1.1
*          Host: example.com
*          {
*            "title": "Новая статья",
*            "content": "Текст статьи",
*            "category": "technology"
*          }
*/

router
  .post('/articles', BlogControllers.createArticle)
  .post('/articles/:id/localization', BlogControllers.createArticleLocalization)
  .post('/categories', BlogControllers.createCategory)
  .post('/categories/:id/localization', BlogControllers.createCategoryLocalization)
  .get('/articles', BlogControllers.getArticles)
  .get('/categories', BlogControllers.getCategories)
  .get('/categories/:id', BlogControllers.getCategory)
  .delete('/categories', BlogControllers.deleteCategories)
  .delete('/categories/:id', BlogControllers.deleteCategory)
  .delete('/artticles', BlogControllers.deleteArticles)
  .delete('/artticles/id', BlogControllers.deleteArticle)
  .delete('/categories/translation/id', BlogControllers.deleteCategoryTranslation)
  .delete('/articles/translation/id', BlogControllers.deleteArticleTranslation)
  .patch('/artticles', (req, res) => { })
  .patch('/artticles/id', (req, res) => { })
  .patch('/categories/translation/id', (req, res) => { })
  .patch('/articles/translation/id', (req, res) => { })


export default router;
