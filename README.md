# Beauty Supply Inventory

A small Express and EJS app for managing a beauty supply store's inventory. Track products, the categories they belong to, and the suppliers who provide them, with stock status flags that show what is running low.

## Features

- Full create, read, update, and delete for products, categories, and suppliers
- Search products by name or SKU
- Stock status badges: **In Stock**, **Low Stock** (at or below the reorder level), and **Out of Stock**
- Category and supplier pages that list their products
- Delete protection: a category or supplier that still has products can't be deleted until those products are removed or reassigned
- Responsive layout with a sidebar on desktop and a collapsible menu on mobile

## Tech Stack

- [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/) via [`pg`](https://node-postgres.com/)
- [express-validator](https://express-validator.github.io/) for form validation
- [EJS](https://ejs.co/) for templates
- Plain CSS (no framework)

## Running Locally

1. Install dependencies:

   ```sh
   npm install
   ```

2. Create a `.env` file in the project root with your PostgreSQL connection string:

   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/beauty_supply
   ```

3. Create and seed the tables (this drops and recreates `products`, `suppliers`, and `categories`):

   ```sh
   node db/create_and_seed_tables.js <your-database-url>
   ```

4. Start the dev server:

   ```sh
   npm run dev
   ```

   The app runs at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app.js                  Express setup, middleware, routes, error handlers
controllers/            Request handlers and validation rules
  categoryController.js
  productController.js
  supplierController.js
db/
  pool.js               PostgreSQL connection pool
  queries.js            All SQL queries
  create_and_seed_tables.js   Creates the schema and inserts sample data
routes/                 Route definitions for each resource
utils/
  stockStatus.js        Works out In / Low / Out of Stock for a product
views/                  EJS templates
  partials/             Header, footer, stock badge, validation errors, icons
public/
  styles.css            All styling
  nav-toggle.js         Mobile menu toggle
  images/               Logo and favicon
```

## Routes

| Resource   | Path                                                                                                       |
| ---------- | ---------------------------------------------------------------------------------------------------------- |
| Products   | `/products`, `/products/create`, `/products/:id`, `/products/:id/update`, `/products/:id/delete`           |
| Categories | `/categories`, `/categories/create`, `/categories/:id`, `/categories/:id/update`, `/categories/:id/delete` |
| Suppliers  | `/suppliers`, `/suppliers/create`, `/suppliers/:id`, `/suppliers/:id/update`, `/suppliers/:id/delete`      |

`/` redirects to `/products`. Search uses `/products?q=term`. A non-numeric `:id` or any unknown route renders the 404 page.

## Validation

Failed submissions re-render the form with the error messages shown.

- **Product:** SKU 1–30 characters and unique; name 1–150 characters; a category and a supplier are required; price is a number from 0 up; quantity and reorder level are whole numbers, 0 or more
- **Category:** name 1–100 characters and unique; description optional
- **Supplier:** name 1–150 characters; email must be valid (up to 150 characters); phone up to 20 characters; address up to 255 characters; delivery time is a whole number of days, 0 or more

## Design

- A warm brown, cream, burgundy and pink palette, defined as CSS variables
- [Croissant One](https://fonts.google.com/specimen/Croissant+One) for headings and [Poppins](https://fonts.google.com/specimen/Poppins) for body text
- Fluid type and spacing scales generated with [Utopia](https://utopia.fyi/), so text and spacing grow smoothly between phone and desktop widths
- [Josh Comeau's CSS reset](https://www.joshwcomeau.com/css/custom-css-reset/)

## Notes

- Data persists in PostgreSQL. Re-running the seed script resets it to the sample data.
- Fonts load from Google Fonts.
- Logo icon by [Magnific](https://www.magnific.com/icon/heart_123021).
