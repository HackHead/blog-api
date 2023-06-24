import { Router } from 'express';
import log from '../../../middleware/log.js';
import BlogControllers from '../controllers/Blog.Controllers.js';
import hasAccess from '../../../middleware/hasAccess.js';

const router = Router();

router.use(log);
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
  .delete('/artticles', (req, res) => {}) 
  .delete('/artticles/id', (req, res) => {}) 
  .delete('/categories/translation/id', (req, res) => {}) 
  .delete('/articles/translation/id', (req, res) => {}) 
  .patch('/artticles', (req, res) => {}) 
  .patch('/artticles/id', (req, res) => {}) 
  .patch('/categories/translation/id', (req, res) => {}) 
  .patch('/articles/translation/id', (req, res) => {}) 


export default router;
