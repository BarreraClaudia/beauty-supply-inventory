import express from 'express';
import path from 'node:path';
import categoryRouter from './routes/categoryRouter.js';
import productRouter from './routes/productRouter.js';

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
app.use('/products', productRouter);

app.use((req, res) => {
  res.status(404).render('404');
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('500');
});

app.listen(port, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Listening on port ${port} (•‿•)`);
});
