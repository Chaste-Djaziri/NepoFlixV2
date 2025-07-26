const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://nepoflix.micorp.pro';
const CURRENT_DATE = new Date().toISOString().split('T')[0];

// Define your site structure
const pages = [
  // Main Pages
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/home', priority: '0.9', changefreq: 'daily' },
  { url: '/movies', priority: '0.8', changefreq: 'daily' },
  { url: '/tv', priority: '0.8', changefreq: 'daily' },
  { url: '/search', priority: '0.7', changefreq: 'weekly' },
  { url: '/watchlist', priority: '0.6', changefreq: 'weekly' },
  
  // Static Pages
  { url: '/about.html', priority: '0.5', changefreq: 'monthly' },
  { url: '/contact.html', priority: '0.5', changefreq: 'monthly' },
  { url: '/faq.html', priority: '0.5', changefreq: 'monthly' },
  { url: '/support.html', priority: '0.5', changefreq: 'monthly' },
  
  // Legal Pages
  { url: '/privacy.html', priority: '0.3', changefreq: 'yearly' },
  { url: '/terms.html', priority: '0.3', changefreq: 'yearly' },
  { url: '/disclaimer.html', priority: '0.3', changefreq: 'yearly' },
  
  // Special Pages
  { url: '/ios', priority: '0.4', changefreq: 'monthly' },
];

function generateSitemap() {
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`;

  pages.forEach(page => {
    sitemap += `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  });

  sitemap += '</urlset>';

  // Write to public directory
  const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemap);
  
  console.log('✅ Sitemap generated successfully!');
  console.log(`📁 Location: ${sitemapPath}`);
  console.log(`🔗 URL: ${SITE_URL}/sitemap.xml`);
  console.log(`📊 Total pages: ${pages.length}`);
}

// Run the generator
generateSitemap();