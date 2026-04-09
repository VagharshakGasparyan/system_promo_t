import winston from 'winston';
import moment from 'moment';
import cron from 'node-cron';
import { conf } from '../config/app_config.js';

declare global {
    var log: winston.Logger;
}

let logger: winston.Logger;

const makeLog = (): void => {
    const now: string = moment().format(conf.log.format);

    logger = winston.createLogger({
        level: 'info',
        format: winston.format.simple(),
        transports: [
            new winston.transports.File({
                filename: `${conf.log.path}/${now}${conf.log.ext}`
            })
        ]
    });
    global.log = logger;
};

makeLog();

cron.schedule('0 0 * * *', () => {
    makeLog();
});


const logErrorToWinston = (err: Error | string | any): void => {
    const timestamp = moment().format('YYYY_MM_DD-HH:mm:ss');
    const message = err instanceof Error ? err.stack : err;
    global.log.error(`${timestamp}\n${message}\n\n`);
};

const errProcessEvents: Array<'uncaughtException' | 'uncaughtExceptionMonitor'> =
    ['uncaughtException', 'uncaughtExceptionMonitor'];

errProcessEvents.forEach((event) => {
    process.on(event, (err: Error) => {
        logErrorToWinston(err);
        process.exit(1);
    });
});

process.on('warning', (err: Error) => {
    logErrorToWinston(err);
});

const originalStderrWrite = process.stderr.write;

process.stderr.write = (chunk: string | Uint8Array, encoding?: any, callback?: any): boolean => {
    logErrorToWinston(chunk.toString());
    return originalStderrWrite.call(process.stderr, chunk, encoding, callback);
};

process.on('exit', (code: number) => {
    const timestamp = moment().format('YYYY_MM_DD-HH:mm:ss');
    global.log.error(`${timestamp}\nExit with code: ${code}\n\n`);
});