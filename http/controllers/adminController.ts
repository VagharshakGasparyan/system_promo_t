import { type Request, type Response, type NextFunction } from 'express';
import { DB } from "../../components/pg_db.js";
import moment from "moment";

interface User {
    id: number;
    username: string;
    email: string;
}

interface Promo {
    id: number;
    active: boolean;
    code: string;
    p_limit: number;
    expiration_date: string | Date;
}
interface ApiResponse {
    data?: any;
    page?: number;
    perPage?: number;
    errors: string | object;
}

export default class AdminController {

    async users(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const page = Math.max(parseInt(req.query.page as string) || 1, 1);
            const perPage = Math.min(parseInt(req.query.perPage as string) || 10, 100);
            const offset = (page - 1) * perPage;

            const q = {
                text: `SELECT * FROM users ORDER BY id LIMIT $1 OFFSET $2;`,
                values: [perPage, offset]
            };

            const result = await DB<User>(q);

            const sendData: ApiResponse = {
                data: { users: result.rows },
                page,
                perPage,
                errors: {}
            };
            return res.send(sendData);
        } catch (e: any) {
            return res.status(422).send({ errors: e.message });
        }
    }

    async list(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const page = Math.max(parseInt(req.query.page as string) || 1, 1);
            const perPage = Math.min(parseInt(req.query.perPage as string) || 10, 100);
            const offset = (page - 1) * perPage;

            const q = {
                text: `SELECT * FROM promo ORDER BY id LIMIT $1 OFFSET $2;`,
                values: [perPage, offset]
            };

            const result = await DB<Promo>(q);

            return res.send({
                data: { promo: result.rows },
                page,
                perPage,
                errors: {}
            });
        } catch (e: any) {
            return res.status(422).send({ errors: e.message });
        }
    }

    async createPromo(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            let { code, active, expiration_date, p_limit } = req.body;

            const limit = Math.max(parseInt(p_limit) || 1, 1);
            const formattedDate = moment(expiration_date, "DD.MM.YYYY").format("YYYY-MM-DD");
            const isActive = active !== undefined ? active : true;

            const q = `INSERT INTO promo (active, code, p_limit, expiration_date)
                       VALUES ($1, $2, $3, $4);`;

            await DB({ text: q, values: [isActive, code, limit, formattedDate] });

            return res.send({ data: { info: 'The PromoCode created successfully.' }, errors: {} });
        } catch (e: any) {
            return res.status(422).send({ errors: e.message });
        }
    }

    async deletePromo(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const { promo_id } = req.params;
            const q = {
                text: `DELETE FROM promo WHERE id = $1;`,
                values: [promo_id]
            };
            await DB(q);
            return res.send({ data: { info: 'The PromoCode deleted successfully.' }, errors: {} });
        } catch (e: any) {
            return res.status(422).send({ errors: e.message });
        }
    }

    async emailBind(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const { email, promo_id } = req.body;

            // 1. Считаем текущее количество привязок
            const countRes = await DB<{ count: string }>({
                text: `SELECT COUNT(*) FROM promo_email WHERE promo_id = $1;`,
                values: [promo_id]
            });
            const count = parseInt(countRes.rows[0].count);

            // 2. Получаем лимит промокода
            const limitRes = await DB<Promo>({
                text: `SELECT p_limit FROM promo WHERE id = $1;`,
                values: [promo_id]
            });

            if (limitRes.rows.length === 0) {
                return res.status(404).send({ errors: "Promo not found" });
            }

            const p_limit = limitRes.rows[0].p_limit;

            if (count >= p_limit) {
                return res.status(422).send({ data: {}, errors: 'The promo code limit has been reached' });
            }

            // 3. Записываем
            await DB({
                text: `INSERT INTO promo_email (promo_id, user_email) VALUES ($1, $2);`,
                values: [promo_id, email]
            });

            return res.send({ data: { info: 'Success.' }, errors: {} });
        } catch (e: any) {
            return res.status(422).send({ errors: e.message });
        }
    }

    async emailUncouple(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const { email, promo_id } = req.body;
            await DB({
                text: `DELETE FROM promo_email WHERE promo_id = $1 AND user_email = $2;`,
                values: [promo_id, email]
            });
            return res.send({ data: { info: 'Success.' }, errors: {} });
        } catch (e: any) {
            return res.status(422).send({ errors: e.message });
        }
    }
}