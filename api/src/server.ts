import { db } from "./config/database";
import Express from 'express';
import bodyParser from 'body-parser';
import usuarioRouter from "./routes/usuarioRoute";
import treinoRouter from "./routes/treinoRouter";
import exercicioRouter from "./routes/exerciciosRouter";
import cors from "cors"

const app = Express()

app.use(cors())
app.use(Express.json());
app.use(bodyParser.json());

app.use('/',usuarioRouter)
app.use('/',treinoRouter)
app.use('/',exercicioRouter)


db.initialize().then(async () => {
    console.log('Conectado ao Banco');
    app.listen(5000, () => {
        console.log('Servidor rodando na porta 5000');
    })
}) 