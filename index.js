require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('dns');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

let urls = [];

app.post('/api/shorturl', (req, res) => {
  dns.lookup(new URL(req.body.url).hostname, (err, address, family) => {
    if (err) {
      res.json({ error: 'invalid url' });
    } else {
      if (!urls.includes(req.body.url)) {
        urls.push(req.body.url);
      }
      res.json({ original_url: req.body.url, short_url: urls.indexOf(req.body.url) });
    }
  });
});

app.get('/api/shorturl/:short_url', (req, res) => {
  res.redirect(urls[req.params.short_url]);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
