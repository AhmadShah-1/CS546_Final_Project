import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import { engine } from 'express-handlebars';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import configRoutes from './routes/index.js';

dotenv.config();

mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB!'))
    .catch((err) => console.error('MongoDB connection error:', err));

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        name: 'AuthCookie',
        secret: process.env.SESSION_SECRET || 'defaultSecret',
        resave: false,
        saveUninitialized: true,
    })
);

// Serve static files
// We'll need the absolute path for the public folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));

app.engine('handlebars', engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

configRoutes(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
