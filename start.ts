import express, { type Application } from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import http from 'node:http';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app: Application = express();

app.use(cors({
    origin: '*',
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }
}));

app.use(express.static(path.join(__dirname, 'public')));

import apiV1Router from './routes/api_v1.js';
app.use('/api/v1', apiV1Router);

import errorMiddleware from './middleware/errors.js';
errorMiddleware(app);

import './components/logger.js';

//------------------starting-----------------------------
const port: string | number | boolean = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/* Create HTTP server. */
const server: http.Server = http.createServer(app);

/* Listen on provided port */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val: string): string | number | boolean {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        return val; // named pipe
    }
    if (port >= 0) {
        return port; // port number
    }
    return false;
}

function onError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    switch (error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening(): void {
    const addr = server.address();
    if (addr === null) return;

    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
    console.log(`Listening on ${bind}`);
}