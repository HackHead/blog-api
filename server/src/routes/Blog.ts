import { API_VERSION } from "../config/configLoader.ts";
import { Router } from "../deps.ts";
import isAuth from "../middleware/isAuth.ts";

const router = new Router({
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    prefix: `/api/${API_VERSION}`,
});

router
    .get('/articles', (ctx) => {
        // Get all articles
        ctx.response.body = {name: ''};
        try {
            
        } catch (error) {
            ctx.response.body = {error};
        }
    })
    .post('/articles', (ctx) => {
        // Create new article
        ctx.response.body = {name: ''};
    })
    .get('/articles/:id', (ctx) => {
        // Get specific article by id
        ctx.response.body = {name: ''};
    })
    .patch('/articles/:id', isAuth, (ctx) => {
        // Update specific article
        ctx.response.body = {name: ''};
    })
    .delete('/articles/:id', isAuth, (ctx) => {
        // Delete specifiy article
        ctx.response.body = {name: ''};
    })
    .get('/categories', (ctx) => {
        // Get all categories
        ctx.response.body = {name: ''};
    })
    .post('/categories', (ctx) => {
        // Create new category
        ctx.response.body = {name: ''};
    })
    .get('/categories/:id', (ctx) => {
        // Get specific category by id
        ctx.response.body = {name: ''};
    })
    .patch('/categories/:id', isAuth,  (ctx) => {
        // Update specific category
        ctx.response.body = {name: ''};
    })
    .delete('/categories/:id', isAuth, (ctx) => {
        // Delete specifiy category
        ctx.response.body = {name: ''};
    })

export default router;