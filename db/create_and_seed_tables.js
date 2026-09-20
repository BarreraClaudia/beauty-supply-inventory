#! /usr/bin/env node

import { Client } from 'pg';

const databaseUrl = process.argv[2];

if (!databaseUrl) {
  console.error(
    'Please provide a database connection string as an argument: node db/create_and_seed_tables.js <url>',
  );
  process.exit(1);
}

const SQL = `
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS suppliers;
DROP TABLE IF EXISTS categories;

CREATE TABLE categories (
    category_id     INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name            VARCHAR(100) NOT NULL UNIQUE,
    description     TEXT,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE suppliers (
    supplier_id         INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name                VARCHAR(150) NOT NULL,
    email               VARCHAR(150),
    phone               VARCHAR(20),
    address             VARCHAR(255),
    delivery_time_days  INTEGER CHECK (delivery_time_days >= 0),
    created_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE products (
    product_id      INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    sku             VARCHAR(30) NOT NULL UNIQUE,
    name            VARCHAR(150) NOT NULL,
    description     TEXT,
    category_id     INTEGER NOT NULL REFERENCES categories(category_id) ON DELETE RESTRICT,
    supplier_id     INTEGER NOT NULL REFERENCES suppliers(supplier_id) ON DELETE RESTRICT,
    price           NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    quantity        INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    reorder_level   INTEGER NOT NULL DEFAULT 5,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO categories (name, description) VALUES
('Makeup', 'Cosmetics for face, eyes, and lips'),
('Skin Care', 'Cleansers, moisturizers, and treatments'),
('Hair Care', 'Shampoo, conditioner, and styling products'),
('Tools/Brushes', 'Application tools, brushes, and sponges'),
('Fragrance', 'Perfumes and body sprays');

INSERT INTO suppliers (name, email, phone, address, delivery_time_days) VALUES
('GlowSource Wholesale', 'orders@glowsource.com', '555-201-3344', '412 Palette Ave, Newark, NJ', 5),
('Bristle & Brush Co.', 'sales@bristlebrush.com', '555-772-9081', '90 Foam Rd, Austin, TX', 7),
('PureDerm Supply', 'contact@puredermsupply.com', '555-664-2210', '23 Clarity Ln, Portland, OR', 4),
('Luxe Locks Distribution', 'info@luxelocks.com', '555-390-6621', '77 Strand St, Charlotte, NC', 6),
('Bloom & Bottle Fragrance', 'wholesale@bloomandbottle.com', '555-118-4432', '15 Sillage Way, Miami, FL', 10);

INSERT INTO products (sku, name, description, category_id, supplier_id, price, quantity, reorder_level) VALUES
('MU-001', 'Matte Liquid Lipstick - Ruby', 'Long-wear matte lipstick in deep red', 1, 1, 14.99, 42, 10),
('MU-002', 'Dual Brow Pencil', 'Fine-tip brow pencil with spoolie', 1, 1, 9.50, 3, 10),
('SC-001', 'Hydrating Gel Cleanser', 'Gentle daily cleanser for all skin types', 2, 3, 18.00, 60, 15),
('SC-002', 'Vitamin C Serum', '10% vitamin C brightening serum', 2, 3, 27.50, 0, 8),
('HC-001', 'Argan Oil Shampoo', 'Sulfate-free shampoo with argan oil', 3, 4, 12.75, 25, 12),
('HC-002', 'Leave-In Repair Conditioner', 'Deep conditioning leave-in treatment', 3, 4, 15.20, 18, 12),
('TB-001', 'Angled Foundation Brush', 'Synthetic bristle brush for liquid foundation', 4, 2, 8.99, 55, 20),
('TB-002', 'Beauty Sponge Set (4-pack)', 'Latex-free blending sponges', 4, 2, 11.00, 30, 20),
('FR-001', 'Citrus Bloom Eau de Parfum', '50ml floral-citrus fragrance', 5, 5, 45.00, 12, 5),
('FR-002', 'Vanilla Musk Body Mist', '100ml lightweight body spray', 5, 5, 16.50, 0, 10);
`;

async function main() {
  console.log('seeding...');

  const client = new Client({
    connectionString: databaseUrl,
  });

  try {
    await client.connect();
    await client.query(SQL);
    console.log('done seeding');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
