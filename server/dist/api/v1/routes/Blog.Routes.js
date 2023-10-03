import { Router } from 'express';
import log from '../../../middleware/log.js';
import BlogControllers from '../controllers/Blog.Controllers.js';
import hasAccess from '../../../middleware/hasAccess.js';
const router = Router();
router.use(log);
/**
 * @swagger
 * /uploads/{filename}:
 *  get:
 *    summary: Получить определенное изображение
 *    description: Получить определенное изображение по имени
 *    parameters:
 *      - in: path
 *        name: filename
 *        required: true
 *        description: Название файла
 *        schema:
 *          type: string
 *    responses:
 *      '200':
 *        description: File uploaded successfully.
 *      '400':
 *        description: Invalid request payload.
 *      '500':
 *        description: Internal server error.
 * /categories:
 *   get:
 *     summary: Получить все категории и их переводы
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Принимает целое число от 1 до бесконечности, в случае если параметр не был предоставлен или был предоставлен но не был валидным - он автоматически принимает значение 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Лимит число от 1 до 100, в случае если не будет предоставлен - автоматически принимат значение 15
 *       - in: query
 *         name: lang
 *         schema:
 *           type: string
 *         description: Массив языков переводы на которые нужно получить (ru, ar, pl, es, en), например ?lang=ru,en,ar
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties :
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * /articles:
 *   get:
 *     summary: Получить все статьи и их переводы
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Принимает целое число от 1 до бесконечности, в случае если параметр не был предоставлен или был предоставлен но не был валидным - он автоматически принимает значение 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Лимит число от 1 до 100, в случае если не будет предоставлен - автоматически принимат значение 15
 *       - in: query
 *         name: lang
 *         schema:
 *           type: string
 *         description: Массив языков переводы на которые нужно получить (ru, ar, pl, es, en), например ?lang=ru,en,ar
 *       - in: query
 *         name: domain
 *         schema:
 *           type: integer
 *         description: Фильтровать по доменному имени (поле url), например ?domain=https://wwww.example.com
 *       - in: query
 *         name: categories
 *         schema:
 *           type: integer
 *         description: Фильтровать по категории например ?categories=3fa85f64-5717-4562-b3fc-2c963f66afa6
 *       - in: query
 *         name: pub_date
 *         schema:
 *           type: integer
 *         description: Получить статьи у которыз есть переводы с датой публикации после определенной даты например /pub_date=2023-07-08T07:19:25.493Z - плолучить статьи у которых есть переводы с датой публикациии послее 8 июля 2023б 19:25
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Article'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * /articles/{id}:
 *   get:
 *     summary: Получить статью по определенному id
 *     tags: [Articles]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                     $ref: '#/components/schemas/Article'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * /categories/{id}:
 *   get:
 *     summary: Получить категорию по определенному id
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                     $ref: '#/components/schemas/Category'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router
    .get('/languages', BlogControllers.getLanguages)
    .get('/domains', hasAccess('readOnly'), BlogControllers.getDomains)
    .post('/domains', hasAccess('readOnly'), BlogControllers.createDomain)
    .post('/articles', hasAccess('fullAccess'), BlogControllers.createArticle)
    .post('/articles/:id/localization', hasAccess('fullAccess'), BlogControllers.createArticleLocalization)
    .post('/categories', hasAccess('fullAccess'), BlogControllers.createCategory)
    .post('/categories/:id/localization', hasAccess('fullAccess'), BlogControllers.createCategoryLocalization)
    .get('/articles', hasAccess('readOnly'), BlogControllers.getArticles)
    .get('/articles/:id', hasAccess('readOnly'), BlogControllers.getArticleById)
    .get('/categories', hasAccess('readOnly'), BlogControllers.getCategories)
    .get('/categories/:id', hasAccess('readOnly'), BlogControllers.getCategory)
    .delete('/categories', hasAccess('fullAccess'), BlogControllers.deleteCategories)
    .delete('/domains/:id', hasAccess('fullAccess'), BlogControllers.deleteDomain)
    .delete('/categories/:id', hasAccess('fullAccess'), BlogControllers.deleteCategory)
    .delete('/articles/:id', hasAccess('fullAccess'), BlogControllers.deleteArticle)
    .delete('/categories/translation/:id', hasAccess('fullAccess'), BlogControllers.deleteCategoryTranslation)
    .patch('/articles/:id', hasAccess('fullAccess'), BlogControllers.updateArticle)
    .patch('/categories/:id', hasAccess('fullAccess'), BlogControllers.updateCategory)
    .patch('/domains/:id', hasAccess('fullAccess'), BlogControllers.updateDomain)
    .patch('/thumbnail/:id', hasAccess('fullAccess'), BlogControllers.updateThumbnail);
export default router;
/**
 * @swagger
 * components:
 *   schemas:
 *     Language:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID языка
 *         name:
 *           type: string
 *           description: Название для удобства
 *         code:
 *           type: string
 *           description: Локаль код
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Название для удобства
 *         updateAd:
 *           type: string
 *           format: date-time
 *           description: Локаль код
 *
 *     Error:
 *       type: object
 *       properties:
 *         statusCode:
 *           type: integer
 *           description: The status code of the error
 *         message:
 *           type: string
 *           description: The error message
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Article:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID
 *         name:
 *           type: string
 *           description: Name
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp
 *         author:
 *           $ref: '#/components/schemas/Author'
 *         thumbnail:
 *           $ref: '#/components/schemas/Thumbnail'
 *         domain:
 *           $ref: '#/components/schemas/Domain'
 *         category:
 *           $ref: '#/components/schemas/Category'
 *         locale:
 *           $ref: '#/components/schemas/Locale'
 *
 *     Author:
 *       type: object
 *       properties:
 *         first_name:
 *           type: string
 *           description: Имя
 *         last_name:
 *           type: string
 *           description: Фамилия
 *         full_name:
 *           type: string
 *           description: Ф.И
 *         email:
 *           type: string
 *           format: email
 *           description: Email
 *
 *     Thumbnail:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Id
 *         url:
 *           type: string
 *           description: Url
 *         alt:
 *           type: string
 *           description: Альтернативный текст
 *         width:
 *           type: integer
 *           description: Ширина изображения
 *         height:
 *           type: integer
 *           description: Высота изображения
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp
 *
 *     Domain:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Id
 *         ip_address:
 *           type: string
 *           format: ipv4
 *           description: IP адрес
 *         url:
 *           type: string
 *           format: uri
 *           description: URL
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Domain creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Domain update timestamp
 *
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID
 *         name:
 *           type: string
 *           description: UI название для удобства
 *         locale:
 *           properties:
*              en:
*                $ref: '#/components/schemas/CategoryTranslation'
*              ru:
*                $ref: '#/components/schemas/CategoryTranslation'
*              es:
*                $ref: '#/components/schemas/CategoryTranslation'
*              ar:
*                $ref: '#/components/schemas/CategoryTranslation'
*              pl:
*                $ref: '#/components/schemas/CategoryTranslation'
 *
 *     Locale:
 *       type: object
 *       properties:
 *         en:
 *           $ref: '#/components/schemas/ArticleTranslation'
 *         ru:
 *           $ref: '#/components/schemas/ArticleTranslation'
 *         es:
 *           $ref: '#/components/schemas/ArticleTranslation'
 *         ar:
 *           $ref: '#/components/schemas/ArticleTranslation'
 *         pl:
 *           $ref: '#/components/schemas/ArticleTranslation'
 *     CategoryTranslation:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID
 *         name:
 *           type: string
 *           description: Имя языка (для удобства)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: timestamp
 *         languageId:
 *           type: string
 *           format: uuid
 *           description: ID языка
 *         categoryId:
 *           type: string
 *           format: uuid
 *           description: id Категории
 *
 *     ArticleTranslation:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Language ID
 *         title:
 *           type: string
 *           description: Заголовок перевода
 *         pub_date:
 *           type: string
 *           format: date-time
 *           description: Дата публикации
 *         body:
 *           type: string
 *           format: uuid
 *           description: Текст поста
 *         excerpt:
 *           type: string
 *           description: Короткий текст
 *         slug:
 *           type: string
 *           description: slug возможно гто то будете использовать
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp
 *         languageId:
 *           type: string
 *           format: uuid
 *           description: Id языка
 *         articleId:
 *           type: string
 *           format: uuid
 *           description: id статьи к которой прикреплен перевод
 *     Meta:
 *       type: object
 *       properties: {} # Empty properties for the meta object
 */ 
