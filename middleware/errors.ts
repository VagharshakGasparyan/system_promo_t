import { Application, Request, Response, NextFunction } from 'express';
import createError, { HttpError } from 'http-errors';

export default (app: Application): void => {

    app.use((req: Request, res: Response, next: NextFunction) => {
        next(createError(404));
    });

    app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        const status = err.status || 500;

        res.status(status).send({
            errors: err.message,
            status: status
        });
    });
};