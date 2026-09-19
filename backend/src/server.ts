import { createServer } from 'node:http';
import { createApp } from './app.js';
import { enviroment } from './config/enviroment.js';

const PORT = enviroment.PORT;

const bootstrap = async (): Promise<void> => {
    const app = createApp();
    const httpServer = createServer(app);

    httpServer.listen(PORT, () => {
        console.log(`API ejecutándose en puerto ${PORT}`);
    });
}

void bootstrap();
