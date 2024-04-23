import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import https from 'https';
import siteRoutes from './routes/site';
import { resquesIntercepter } from './utils/requestIntercepter';
import adminRoutes from './routes/admin';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.all('*', resquesIntercepter);

app.use('/admin', adminRoutes);
app.use('/', siteRoutes);

const runServer = (port: number, server: http.Server) => {
    server.listen(port, ()=>{
        console.log(`Running at PORT ${port}`);
    });
}

const regularServer = http.createServer(app);

if(process.env.NODE_ENV === 'production') {
    //TODO: Configurar SSL
    //TODO: Rodar server na 80 e na 443
}else{
    const serverPort: number = process.env.PORT ? parseInt(process.env.PORT) : 9000;
    runServer(serverPort, regularServer);
}