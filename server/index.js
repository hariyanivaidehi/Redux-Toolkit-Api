import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors()); 
app.use(express.json()); 

let products = [
  {
    id: 1,
    title: 'iPhone 15 Pro',
    category: 'Smartphones',
    price: 999,
    rating: 4.8,
    stock: 25,
    thumbnail: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&auto=format&fit=crop&q=60',
    description: 'Latest Apple flagship with titanium body and A17 Pro chip.'
  },
  {
    id: 2,
    title: 'MacBook Air M3',
    category: 'Laptops',
    price: 1199,
    rating: 4.9,
    stock: 15,
    thumbnail: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&auto=format&fit=crop&q=60',
    description: 'Thin, fast laptop with Apple Silicon M3 power.'
  },
  {
    id: 3,
    title: 'Sony WH-1000XM5',
    category: 'Audio',
    price: 399,
    rating: 4.7,
    stock: 40,
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=60',
    description: 'Industry-leading noise canceling wireless headphones.'
  },
  {
    id: 4,
    title: 'Samsung Galaxy S24 Ultra',
    category: 'Smartphones',
    price: 1299,
    rating: 4.7,
    stock: 18,
    thumbnail: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&auto=format&fit=crop&q=60',
    description: 'AI-powered phone with 200MP camera and S-Pen.'
  },
  {
    id: 5,
    title: 'Apple Watch Ultra 2',
    category: 'Wearables',
    price: 799,
    rating: 4.6,
    stock: 30,
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=60',
    description: 'Rugged titanium smartwatch with precision GPS.'
  },
  {
    id: 6,
    title: 'Dell XPS 15',
    category: 'Laptops',
    price: 1499,
    rating: 4.5,
    stock: 12,
    thumbnail: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&auto=format&fit=crop&q=60',
    description: 'InfinityEdge 4K display and powerful Intel Core i7.'
  }
];

// Fetch large dataset from DummyJSON API on startup
const loadInitialProducts = async () => {
  try {
    const res = await fetch('https://dummyjson.com/products?limit=100');
    if (res.ok) {
      const data = await res.json();
      if (data && data.products && data.products.length > 0) {
        products = data.products.map((item) => ({
          id: item.id,
          title: item.title,
          category: item.category ? item.category.charAt(0).toUpperCase() + item.category.slice(1) : 'General',
          price: item.price,
          rating: item.rating || 4.5,
          stock: item.stock || 15,
          thumbnail: item.thumbnail || (item.images && item.images[0]) || 'https://via.placeholder.com/300',
          description: item.description || ''
        }));
        console.log(`✅ Loaded ${products.length} products successfully from DummyJSON API!`);
      }
    }
  } catch (err) {
    console.log('⚠️ Could not fetch from DummyJSON, using default products list.', err.message);
  }
};

loadInitialProducts();

// ==========================
// 📌 CRUD API ROUTES
// ==========================

// 1. READ (GET all products)
app.get('/api/products', (req, res) => {
  res.json({ success: true, count: products.length, data: products });
});

// 2. CREATE (POST new product)
app.post('/api/products', (req, res) => {
  const { title, category, price, rating, stock, thumbnail, description } = req.body;

  if (!title || !price) {
    return res.status(400).json({ success: false, message: 'Title and Price are required!' });
  }

  const newProduct = {
    id: Date.now(), // Unique ID
    title,
    category: category || 'General',
    price: Number(price),
    rating: Number(rating) || 4.5,
    stock: Number(stock) || 10,
    thumbnail: thumbnail || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=60',
    description: description || ''
  };

  products.unshift(newProduct); // આગળ add થશે
  res.status(201).json({ success: true, message: 'Product added successfully!', data: newProduct });
});

// 3. UPDATE (PUT edit product)
app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const index = products.findIndex((p) => p.id === Number(id));

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Product not found!' });
  }

  products[index] = {
    ...products[index],
    ...req.body,
    price: req.body.price ? Number(req.body.price) : products[index].price,
    rating: req.body.rating ? Number(req.body.rating) : products[index].rating,
  };

  res.json({ success: true, message: 'Product updated successfully!', data: products[index] });
});

// 4. DELETE (DELETE remove product)
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = products.length;
  products = products.filter((p) => p.id !== Number(id));

  if (products.length === initialLength) {
    return res.status(404).json({ success: false, message: 'Product not found!' });
  }

  res.json({ success: true, message: 'Product deleted successfully!', id: Number(id) });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});