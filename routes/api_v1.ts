import express, { Router } from 'express';
// Импортируем контроллер (убедитесь, что путь верный и файл будет .ts)
import AdminController from '../http/controllers/adminController.js';

const router: Router = express.Router();

// Создаем экземпляр контроллера один раз, чтобы не плодить их в каждом роуте
const admin = new AdminController();

// GET запросы
router.get('/users/list', admin.users.bind(admin));
router.get('/promo/list', admin.list.bind(admin));

// POST запросы
router.post('/promo/create', admin.createPromo.bind(admin));
router.post('/email/bind', admin.emailBind.bind(admin));
router.post('/email/uncouple', admin.emailUncouple.bind(admin));

// DELETE запрос
router.delete('/promo/delete/:promo_id', admin.deletePromo.bind(admin));

export default router;
