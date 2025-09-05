const fs = require('fs');
const path = require('path');

const structure = {
  'package.json': `{
  "name": "furniture-store",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start -p 3000",
    "export": "next export"
  },
  "dependencies": {
    "next": "latest",
    "react": "latest",
    "react-dom": "latest"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.5",
    "tailwindcss": "^3.0.0"
  }
}`,
  'tailwind.config.js': `module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {}
  },
  plugins: []
}`,
  'postcss.config.js': `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
}`,
  'next.config.js': `module.exports = {
  reactStrictMode: true,
  output: 'export'
}`
};

const folders = [
  'pages',
  'pages/product',
  'components',
  'styles',
  'lib',
  'public',
  'public/images'
];

const files = {
  'styles/globals.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-white text-gray-800 antialiased;
}

a {
  @apply text-green-600 hover:text-green-700;
}`,
  'lib/api.js': `const products = [
  {
    id: 1,
    name: 'Стул Noa',
    price: 120,
    image: '/images/noa.jpg',
    colors: ['белый', 'серый', 'зелёный']
  },
  {
    id: 2,
    name: 'Кресло Luma',
    price: 240,
    image: '/images/luma.jpg',
    colors: ['бежевый', 'синий']
  }
];

export async function getAllProducts() {
  return products;
}

export async function getProductById(id) {
  return products.find(p => p.id === Number(id));
}`,
  'components/Header.jsx': `import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-5 py-4 flex justify-between items-center">
        <Link href="/"><a className="text-2xl font-bold">MB88</a></Link>
        <nav className="space-x-6">
          <Link href="/"><a>Главная</a></Link>
          <Link href="/catalog"><a>Каталог</a></Link>
          <Link href="/"><a>Контакты</a></Link>
        </nav>
      </div>
    </header>
  );
}`,
  'components/ProductCard.jsx': `import Link from 'next/link';

export default function ProductCard({ product }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-medium">{product.name}</h3>
        <p className="mt-2 text-green-600 font-semibold">${product.price}</p>
        <Link href={\`/product/\${product.id}\`}>
          <a className="mt-4 inline-block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
            Подробнее
          </a>
        </Link>
      </div>
    </div>
  );
}`,
  'components/Footer.jsx': `export default function Footer() {
  return (
    <footer className="bg-gray-100 mt-12">
      <div className="container mx-auto px-5 py-6 text-center text-sm text-gray-600">
        © 2025 MB88. Все права защищены.
      </div>
    </footer>
  );
}`,
  'pages/index.js': `import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <section className="h-screen flex flex-col justify-center items-center bg-gray-50">
        <h1 className="text-4xl font-semibold mb-4">
          Добавьте изысканности в свой интерьер
        </h1>
        <a href="/catalog" className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
          Перейти в каталог
        </a>
      </section>
      <Footer />
    </>
  );
}`,
  'pages/catalog.js': `import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { getAllProducts } from '../lib/api';

export default function Catalog({ products }) {
  return (
    <>
      <Header />
      <main className="container mx-auto px-5 py-10">
        <h2 className="text-2xl font-semibold mb-6">Каталог мебели</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(prod => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}

export async function getStaticProps() {
  const products = await getAllProducts();
  return { props: { products } };
}`,
  'pages/product/[id].js': `import { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getAllProducts, getProductById } from '../../lib/api';

export default function ProductPage({ product }) {
  const [qty, setQty] = useState(1);
  const [color, setColor] = useState(product.colors[0]);

  return (
    <>
      <Header />
      <main className="container mx-auto px-5 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <img src={product.image} alt={product.name} className="w-full lg:w-1/2 rounded" />
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-semibold">{product.name}</h2>
            <p className="mt-4 text-green-600 text-2xl font-bold">${product.price}</p>
            <div className="mt-6">
              <label className="block mb-2">Цвет:</label>
              <select value={color} onChange={e => setColor(e.target.value)} className="border rounded px-3 py-2">
                {product.colors.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="mt-6">
              <label className="block mb-2">Количество:</label>
              <input type="number" min="1" value={qty} onChange={e => setQty(Number(e.target.value))} className="border rounded px-3 py-2 w-20" />
            </div>
            <button className="mt-8 px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 transition">
              Добавить в корзину
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export async function getStaticPaths() {
  const products = await getAllProducts();
  const paths = products.map(p => ({ params: { id: p.id.toString() } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const product = await getProductById(params.id);
  return { props: { product } };
}`
};

// Создание папок
folders.forEach(folder => {
  fs.mkdirSync(folder, { recursive: true });
});

// Создание файлов
Object.entries(structure).forEach(([file, content]) => {
  fs.writeFileSync(file, content);
});
Object.entries(files).forEach(([file, content]) => {
  fs.writeFileSync(file, content);
});

console
