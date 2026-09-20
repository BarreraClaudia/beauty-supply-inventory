import express from 'express';
import path from 'node:path';
import categoryRouter from './routes/categoryRouter.js';

const app = express();

const port = process.env.PORT || 3000;

const __dirname = path.join(import.meta.dirname);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const assetsPath = path.join(__dirname, 'public');
app.use(express.static(assetsPath));

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.redirect('/categories'));
app.use('/categories', categoryRouter);

app.listen(port, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Listening on port ${port} (•‿•)`);
});
