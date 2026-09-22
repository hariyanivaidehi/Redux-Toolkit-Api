import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Path to data file
const dataPath = path.resolve(__dirname, 'data/picsartStickers.json');

// In-memory stickers store
let stickers = [];

// Initialize stickers from disk
function loadStickers() {
  try {
    if (fs.existsSync(dataPath)) {
      const raw = fs.readFileSync(dataPath, 'utf-8');
      stickers = JSON.parse(raw);
      console.log(`✅ Loaded ${stickers.length} PicsArt stickers from disk!`);
    } else {
      console.log('⚠️ picsartStickers.json not found on disk, using empty array.');
    }
  } catch (err) {
    console.error('Failed to load stickers data:', err.message);
  }
}
loadStickers();

// ==========================
// 🎨 PICSART STICKER API ROUTES
// ==========================

// 1. GET (Read all stickers or filter by category/search)
app.get('/api/stickers', (req, res) => {
  const { category, search } = req.query;
  let results = [...stickers];

  if (category && category.toLowerCase() !== 'all') {
    results = results.filter((s) => s.category && s.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      (s) =>
        (s.name && s.name.toLowerCase().includes(q)) ||
        (s.category && s.category.toLowerCase().includes(q))
    );
  }

  res.json({
    success: true,
    count: results.length,
    stickers: results,
    data: results, // backwards compatibility
  });
});

// Alias: /api/products also returns stickers
app.get('/api/products', (req, res) => {
  res.json({
    success: true,
    count: stickers.length,
    data: stickers.map((s) => ({
      ...s,
      title: s.name,
      thumbnail: s.url,
      price: 0,
      rating: 4.8,
      stock: 100,
    })),
  });
});

// 2. CREATE (POST add custom sticker)
app.post('/api/stickers', (req, res) => {
  const { name, category, url } = req.body;

  if (!url) {
    return res.status(400).json({ success: false, message: 'Sticker Image URL is required!' });
  }

  const newSticker = {
    id: `custom-${Date.now()}`,
    name: name || `Sticker #${stickers.length + 1}`,
    category: category || 'Custom',
    url,
  };

  stickers.unshift(newSticker);

  // Save to disk
  try {
    fs.writeFileSync(dataPath, JSON.stringify(stickers, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving sticker to file:', err.message);
  }

  res.status(201).json({
    success: true,
    message: 'Sticker added successfully!',
    data: newSticker,
    sticker: newSticker,
  });
});

// 3. UPDATE (PUT edit sticker)
app.put('/api/stickers/:id', (req, res) => {
  const { id } = req.params;
  const index = stickers.findIndex((s) => String(s.id) === String(id));

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Sticker not found!' });
  }

  stickers[index] = {
    ...stickers[index],
    ...req.body,
  };

  // Save to disk
  try {
    fs.writeFileSync(dataPath, JSON.stringify(stickers, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error updating sticker to file:', err.message);
  }

  res.json({
    success: true,
    message: 'Sticker updated successfully!',
    data: stickers[index],
    sticker: stickers[index],
  });
});

// 4. DELETE (DELETE remove sticker)
app.delete('/api/stickers/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = stickers.length;
  stickers = stickers.filter((s) => String(s.id) !== String(id));

  if (stickers.length === initialLength) {
    return res.status(404).json({ success: false, message: 'Sticker not found!' });
  }

  // Save to disk
  try {
    fs.writeFileSync(dataPath, JSON.stringify(stickers, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving after delete:', err.message);
  }

  res.json({ success: true, message: 'Sticker deleted successfully!', id });
});

// 5. LIVE SCRAPER (POST scrape PicsArt live for any category or keyword)
app.post('/api/stickers/scrape', async (req, res) => {
  try {
    const category = (req.body.category || req.query.category || 'aesthetic').toLowerCase();
    const targetUrl = `https://picsart.com/stickers/${category}`;

    console.log(`📡 [PicsArt Scraper] Scraping URL: ${targetUrl}...`);
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: `PicsArt responded with HTTP ${response.status}`,
      });
    }

    const html = await response.text();
    const imgMatches =
      html.match(
        /https:\/\/(?:yearly-cdn\.picsart\.com\/cdn140|pastatic\.picsart\.com\/cms-pastatic|cdn140\.picsart\.com)[^"'\s]+\.(?:png|webp)/g
      ) || [];

    const uniqueUrls = [...new Set(imgMatches)];

    const newStickers = uniqueUrls.map((imgUrl, idx) => ({
      id: `${category}-${Date.now()}-${idx}`,
      category: category.charAt(0).toUpperCase() + category.slice(1),
      name: `${category.charAt(0).toUpperCase() + category.slice(1)} #${idx + 1}`,
      url: imgUrl,
    }));

    // Merge and deduplicate
    const seen = new Set(stickers.map((s) => s.url));
    let addedCount = 0;

    for (const item of newStickers) {
      if (!seen.has(item.url)) {
        seen.add(item.url);
        stickers.unshift(item);
        addedCount++;
      }
    }

    // Persist to disk
    try {
      fs.writeFileSync(dataPath, JSON.stringify(stickers, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving scraped stickers:', err.message);
    }

    console.log(`🎉 Scraped ${newStickers.length} stickers (${addedCount} newly added) for "${category}"`);

    res.json({
      success: true,
      message: `Scraped ${newStickers.length} stickers (${addedCount} new) for "${category}"`,
      category,
      addedCount,
      totalStickers: stickers.length,
      stickers: newStickers,
    });
  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 PicsArt Sticker Server running on http://localhost:${PORT}`);
});