import express from 'express';
import { engine } from 'express-handlebars';
import configRoutes from './routes/index.js';
import session from 'express-session';

const app = express();

app.use(
    session({
        secret: 'yourSecretKey',
        resave: false,
        saveUninitialized: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine(
    'handlebars',
    engine({
        defaultLayout: 'main',
    })
);
app.set('view engine', 'handlebars');
app.set('views', './views');

configRoutes(app);

app.listen(3002, () => {
    console.log("Server is running at http://localhost:3002");
});
