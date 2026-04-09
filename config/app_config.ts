import dotenv from 'dotenv';
dotenv.config();

interface AppConfig {
    log: {
        format: string;
        ext: string;
        path: string;
    };
}

export const conf: AppConfig = {
    log: {
        format: 'YYYY_MM_DD',
        ext: '.log',
        path: 'logs',
    },
};
