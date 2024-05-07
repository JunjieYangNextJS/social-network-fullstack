const express = require('express');
const { SitemapStream, streamToPromise } = require('sitemap');
const zlib = require('zlib');
const Post = require('./../models/postModel');

const router = express.Router();

const date = new Date().toISOString();

let sitemap;

router.get('/sitemap.xml', async function(req, res) {
  res.header('Content-Type', 'application/xml');
  res.header('Content-Encoding', 'gzip');

  // if we have a cached entry send it
  if (sitemap) return res.send(sitemap);

  try {
    // fetching todo records and mapping it the desired URL pattern
    const data = await Post.find();
    const posts = data.map(({ id }) => `/posts/${id}`);

    // Base url of our site
    const smStream = new SitemapStream({
      hostname: 'https://www.priders.net'
    });
    const pipeline = smStream.pipe(zlib.createGzip());

    // Write todo URL to the stream
    posts.forEach(item =>
      smStream.write({
        url: item,
        lastmod: date,
        changefreq: 'daily',
        priority: 0.7
      })
    );

    // Manually add all the other important URLs
    smStream.write({
      url: '/posts',
      lastmod: date,
      changefreq: 'monthly',
      priority: 0.9
    });
    smStream.write({
      url: '/stories',
      lastmod: date,
      changefreq: 'monthly',
      priority: 0.9
    });

    // cache the response
    streamToPromise(pipeline).then(sm => (sitemap = sm));
    smStream.end();

    // stream write the response
    pipeline.pipe(res).on('error', e => {
      throw e;
    });
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
});

module.exports = router;
