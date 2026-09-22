import fs from 'fs';
import path from 'path';

const CATEGORY_NAMES = {
  aesthetic: [
    'Pastel Aura Cloud', 'Holographic Stardust Sparkle', 'Celestial Moon Phases',
    'Crystal Quartz Prism', 'Sparkling Rainbow Prism', 'Golden Sunset Flare',
    'Aesthetic Soft Glow', 'Cosmic Nebula Swirl', 'Dreamy Pastel Halo',
    'Prism Light Beam', 'Glittering Star Dust', 'Vaporwave Sunset Disk',
    'Aesthetic Cloud Whisper', 'Ethereal Magic Shimmer', 'Golden Hour Glow',
    'Chroma Light Leak', 'Luminescent Starlight', 'Galaxy Orbit Ring',
    'Mystic Crystal Orb', 'Pastel Watercolor Splash'
  ],
  vintage: [
    'Retro 35mm Film Camera', 'Vintage Vinyl Record Disc', 'Retro Cassette Mixtape',
    'Airmail Postage Stamp', 'Vintage Polaroid Photo Frame', 'Antique Brass Pocket Watch',
    'Vintage Washi Paper Tape', 'Classic Rotary Dial Telephone', 'Vintage Handwritten Letter',
    'Vintage French Perfume Bottle', 'Classic Matchbox Flame', 'Vintage Feather Quill Pen',
    'Antique Brass Key', 'Retro Handheld Game Boy', 'Vintage Newspaper Clipping',
    'Old Paper Scroll Border', 'Vintage Floral Ephemera', 'Retro Gramophone Horn',
    'Antique Ticket Stub', 'Vintage Coffee Postmark'
  ],
  butterfly: [
    'Golden Monarch Butterfly', 'Blue Morpho Butterfly', 'Glitter Emerald Butterfly',
    'Dreamy Violet Butterfly', 'Glittering Fairy Wing Pair', 'Iridescent Glass Butterfly',
    'Pastel Butterfly Pair', 'Shimmering Amber Butterfly', 'Golden Glitter Butterfly Crown',
    'Cyan Neon Butterfly', 'Velvet Purple Swallowtail', 'Rose Gold Butterfly Flutter',
    'Celestial Star Butterfly', 'Lace Wing Fairy Butterfly', 'Prism Wing Butterfly',
    'Glow In The Dark Butterfly', 'Watercolor Garden Butterfly', 'Midnight Shadow Butterfly',
    'Crystal Butterfly Brooch', 'Spring Blossom Butterfly'
  ],
  cute: [
    'Cute Boba Milk Tea', 'Kawaii Fluffy Bunny', 'Sweet Strawberry Milk Box',
    'Cute Blushing Kitty Face', 'Cute Panda Bear Hug', 'Sweet Honey Bee Jar',
    'Cute Marshmallow Ghost', 'Cute Shiba Inu Puppy Face', 'Sweet Peach Fruit Cluster',
    'Cute Sleeping Moon Cloud', 'Cute Dino Avocado Mascot', 'Cute Happy French Toast',
    'Sweet Glazed Donut Ring', 'Cute Baby Penguin in Beanie', 'Cute Little Sprout Seedling',
    'Cute Smiling Sun Mascot', 'Sweet Strawberry Swirl Cone', 'Cute Smiling Potted Cactus',
    'Cozy Teddy Bear Hug', 'Sweet Pastel Cupcake'
  ],
  flower: [
    'Pink Daisy Blossom', 'Blushing Cherry Blossom', 'Pastel Lavender Bouquet',
    'Wild Garden Rose Bloom', 'Botanical Sunflower Bouquet', 'Pastel Peony Blossom',
    'Pastel Spring Tulip Garland', 'Romantic Red Velvet Rose', 'Spring Lotus Water Lily',
    'Minimalist Eucalyptus Sprig', 'Pastel Pink Hydrangea', 'Delicate Baby Breath Wreath',
    'Blooming Poppy Wildflower', 'Pastel Dahlia Floral Crown', 'Fresh White Jasmine Petals',
    'Autumn Golden Maple Leaf', 'Blooming Tropical Hibiscus', 'Festive Evergreen Wreath',
    'Pastel Geometric Flower', 'Botanical Fresh Green Leaves'
  ],
  y2k: [
    'Y2K Cyber Heart Hologram', 'Cyberpunk Neon Diamond', 'Y2K Metallic Chrome Flame',
    'Vaporwave Grid Horizon', 'Y2K Rainbow Compact Disc', 'Y2K Cyber Butterfly Heart',
    'Y2K Chrome Bubble Letters', 'Y2K Holographic Star Flare', 'Y2K Acid Smiley Face',
    'Y2K Tribal Chrome Heart', 'Y2K Liquid Chrome Droplets', 'Cyberpunk Pixel Heart',
    'Chrome Tribal Flame Cross', 'Y2K Starburst Sparkle', 'Cyber Matrix Wireframe',
    'Holo Glitter CD Shimmer', 'Y2K Digital Barcode', 'Retro Cyberpunk Crosshair',
    'Cyber Glitch Love Icon', 'Chrome Metal Wings'
  ],
  neon: [
    'Neon Glowing Angel Wings', 'Neon Cyber Star Burst', 'Neon Electric Lightning Flare',
    'Neon Floating Saturn Planet', 'Neon Pink Love Script', 'Neon Blue Crescent Moon',
    'Neon Sunset Palm Silhouette', 'Neon Cyber Laser Crosshair', 'Neon Glowing Heart Outline',
    'Neon Alien Cosmic Beam', 'Neon Violet Starburst Glow', 'Neon Electric Music Note',
    'Neon Pink Flame Aura', 'Neon Cyberpunk Futuristic City', 'Neon Glowing Lotus Flower',
    'Neon Cyan Butterfly Flutter', 'Neon Glowing Diamond Gem', 'Neon Cosmic Rocket',
    'Neon Retro Sunglasses', 'Neon Electric Cactus'
  ],
  anime: [
    'Anime Sparkle Eyes Highlight', 'Chibi Angel Feather Wings', 'Anime Magic Wand Star',
    'Kawaii Ramen Noodle Bowl', 'Anime Sweat Drop Emoji', 'Chibi Cat Ear Headband',
    'Anime Speed Action Lines', 'Kawaii Sakura Bento Box', 'Anime Manga Speech Bubble',
    'Chibi Kitsune Fox Mask', 'Anime Magic Spell Circle', 'Kawaii Strawberry Dango',
    'Chibi Devil Horns and Tail', 'Anime Heart Emotion Cloud', 'Kawaii Onigiri Rice Ball',
    'Chibi Magical Girl Ribbon', 'Anime Cherry Blossom Petals', 'Kawaii Shiba Inu Dango',
    'Anime Power Aura Flame', 'Chibi Sleeping Cloud Pillow'
  ]
};

async function fetchCategoryUrls(cat) {
  try {
    const res = await fetch(`https://picsart.com/stickers/${cat}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (!res.ok) return [];
    const html = await res.text();
    const matches = html.match(/https:\/\/(?:yearly-cdn\.picsart\.com\/cdn140|pastatic\.picsart\.com\/cms-pastatic|cdn140\.picsart\.com)[^"'\s]+\.(?:png|webp)/g) || [];
    return [...new Set(matches)];
  } catch (err) {
    console.error(`Failed to fetch ${cat}:`, err.message);
    return [];
  }
}

async function build() {
  console.log('🚀 Fetching fresh PicsArt stickers for each category...');
  const allStickers = [];
  const categories = Object.keys(CATEGORY_NAMES);

  for (const cat of categories) {
    const urls = await fetchCategoryUrls(cat);
    console.log(`📡 Category "${cat}" found ${urls.length} stickers`);
    const namePool = CATEGORY_NAMES[cat];
    const catLabel = cat.charAt(0).toUpperCase() + cat.slice(1);

    urls.forEach((url, idx) => {
      const baseName = namePool[idx % namePool.length];
      const name = idx >= namePool.length ? `${baseName} (Variant)` : baseName;
      allStickers.push({
        id: `${cat}-${idx + 1}`,
        name: name,
        category: catLabel,
        url: url
      });
    });
  }

  // If some categories had few results, load existing dataset as fallback
  if (allStickers.length < 50) {
    console.log('⚠️ Network limited, loading local backup data with category mapping...');
    const localData = JSON.parse(fs.readFileSync('src/data/picsartStickers.json', 'utf-8'));
    allStickers.push(...localData);
  }

  console.log(`🎉 Total compiled stickers: ${allStickers.length}`);

  fs.writeFileSync('src/data/picsartStickers.json', JSON.stringify(allStickers, null, 2), 'utf-8');
  fs.writeFileSync('server/data/picsartStickers.json', JSON.stringify(allStickers, null, 2), 'utf-8');
  console.log('💾 Saved successfully to src and server data directories!');
}

build();
