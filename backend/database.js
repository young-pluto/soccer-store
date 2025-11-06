const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'commerce.db');
const db = new sqlite3.Database(dbPath);

const initializeDatabase = () => {
  db.serialize(() => {
    // Ensure userId support on cart table
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        image TEXT,
        description TEXT
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS cart (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        productId INTEGER NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        userId TEXT DEFAULT 'public',
        FOREIGN KEY (productId) REFERENCES products(id)
      )
    `);

    // Backfill/alter: add userId column if missing (older DBs)
    db.all(`PRAGMA table_info(cart)`, (err, columns) => {
      if (!err && columns && !columns.find(c => c.name === 'userId')) {
        db.run(`ALTER TABLE cart ADD COLUMN userId TEXT DEFAULT 'public'`);
      }
    });

    // Insert mock products (only if table is empty)
    db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
      if (row.count === 0) {
        const products = [
          // Premium Football Boots
          { name: 'Nike Mercurial Superfly 9 Elite', price: 289.99, image: 'https://thumblr.uniid.it/product/335804/404a74d8766c.jpg?width=3840&format=webp&q=75', description: 'Elite-level football boots with aerodynamic design and precision control' },
          { name: 'Adidas Predator Edge+', price: 279.99, image: 'https://images.prodirectsport.com/ProductImages/Main/266941_Main_Thumb_1246724.jpg', description: 'Revolutionary control and spin with rubberized Facet elements' },
          { name: 'Nike Phantom GX Elite', price: 269.99, image: 'https://static.nike.com/a/images/t_web_pdp_936_v2/f_auto/d7a05137-69bd-4e56-825b-498f5617360c/PHANTOM+GX+ELITE+FG+SE.png', description: 'Premium boots engineered for deadly strikes and precise control' },
          { name: 'Puma Future Ultimate', price: 259.99, image: 'https://contents.mediadecathlon.com/p2522430/k$cf977cac1a71e7429eb2bdf62546914d/picture.jpg', description: 'Adaptive fit with FUZIONFIT+ compression technology' },
          
          // Iconic Club Jerseys
          { name: 'FC Barcelona Home Jersey 2024/25', price: 89.99, image: 'https://static.nike.com/a/images/t_web_pdp_936_v2/f_auto/9a477f39-480c-41e8-9937-0e9e20312167/FCB+M+NK+DF+JSY+SS+STAD+HM.png', description: 'Official Barça home kit with iconic blaugrana stripes' },
          { name: 'Real Madrid Away Jersey 2024/25', price: 89.99, image: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/3308086a783f43b2a6b309b13c693f71_9366/Real_Madrid_24-25_Away_Jersey_Orange_IU5013_HM1.jpg', description: 'Los Blancos away kit with premium Adidas technology' },
          { name: 'Manchester United Home Jersey', price: 84.99, image: 'https://thumblr.uniid.it/product/353725/fb4a75438f32.jpg?width=3840&format=webp&q=75', description: 'Red Devils home jersey with classic collar design' },
          { name: 'PSG Jordan Third Jersey', price: 94.99, image: 'https://static.nike.com/a/images/t_web_pdp_936_v2/f_auto,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/12637e3d-d6b8-4579-9ef6-7c8ac5bb11c8/PSG+M+NK+DF+JSY+SS+STAD+3R.png', description: 'Exclusive Jordan x PSG collaboration jersey' },
          
          // Match Footballs
          { name: 'FIFA World Cup 2026 Official Ball', price: 169.99, image: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Trionda_%28cropped%29.jpg', description: 'Official match ball with advanced panel technology' },
          { name: 'Adidas Champions League Pro Ball', price: 149.99, image: 'https://m.media-amazon.com/images/I/61Am00PHPDL._AC_UF894,1000_QL80_.jpg', description: 'Official UEFA Champions League match ball with starball design' },
          { name: 'Nike Premier League Flight Ball', price: 139.99, image: 'https://preview.redd.it/premier-league-instagram-the-nike-flight-the-official-ball-v0-xq3q0io761ed1.jpeg?auto=webp&s=26446002a12434750ffc46e63a59b1e806ab8f27', description: 'Official Premier League match ball with aerodynamic grooves' },
          
          // Training Gear
          { name: 'Nike Academy Pro Training Pants', price: 64.99, image: 'https://m.media-amazon.com/images/I/41KkSKgyPzL.jpg', description: 'Professional training pants with Dri-FIT technology' },
          { name: 'Adidas Tiro Track Suit', price: 94.99, image: 'https://assets.myntassets.com/w_412,q_30,dpr_3,fl_progressive,f_webp/assets/images/13536260/2021/3/12/9d5d66c1-94c2-438b-8886-2d8cccbc8b8a1615529737429CamisolesInnocenceWomenCamisolesInnocenceWomenCamisolesInnoc1.jpg', description: 'Complete tracksuit with iconic 3-stripes design' },
          { name: 'Puma teamFINAL Training Jersey', price: 44.99, image: 'https://m.media-amazon.com/images/I/61OPBC2hp+L.jpg', description: 'Lightweight training jersey with moisture management' },
          
          // Premium Accessories
          { name: 'Nike Mercurial Shin Guards', price: 34.99, image: 'https://scssports.in/cdn/shop/files/1_a3d6143f-61c8-4932-be96-d0c8e4e3f1a4.jpg?v=1761741871', description: 'Low-profile protection with anatomical left/right design' },
          { name: 'Adidas Captain Armband', price: 14.99, image: 'https://gfx.r-gol.com/media/res/products/880/158880/hs9766_1.jpg', description: 'Official captain armband with adjustable strap' },
          { name: 'Nike Academy Team Backpack', price: 54.99, image: 'https://m.media-amazon.com/images/I/71GOGtUO8yL._AC_UY1100_.jpg', description: 'Spacious backpack with separate boot compartment' },
          
          // Goalkeeper Equipment
          { name: 'Adidas Predator Pro GK Gloves', price: 124.99, image: 'https://m.media-amazon.com/images/I/71-oi+ZRlCL._AC_UF894,1000_QL80_.jpg', description: 'Professional goalkeeper gloves with URG 4.0 grip foam' },
          { name: 'Puma Future Grip GK Gloves', price: 114.99, image: 'https://images-cdn.ubuy.co.in/66d738683315724b70648388-puma-mens-future-ultimate-nc-goalkeeper.jpg', description: 'Elite grip technology with 4mm foam for ultimate control' },
          
          // Elite Boots
          { name: 'Adidas X Speedportal+', price: 299.99, image: 'https://thumblr.uniid.it/product/250659/f84aa5fea82a.jpg?width=3840&format=webp&q=75', description: 'Ultimate speed boots with carbon fiber SPEEDFRAME outsole' }
        ];

        const stmt = db.prepare('INSERT INTO products (name, price, image, description) VALUES (?, ?, ?, ?)');
        products.forEach(product => {
          stmt.run(product.name, product.price, product.image, product.description);
        });
        stmt.finalize();
        console.log('Mock football products inserted!');
      }
    });
  });
};

module.exports = { db, initializeDatabase };