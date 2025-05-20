// server/server.js
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/api/meta", async (req, res) => {
  const { url } = req.body;
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    const $ = cheerio.load(response.data);
    const getMeta = (name) =>
      $(`meta[name='${name}']`).attr("content") ||
      $(`meta[property='og:${name}']`).attr("content") ||
      $(`meta[property='twitter:${name}']`).attr("content");

    const metadata = {
      title: $("title").text() || getMeta("title"),
      description: getMeta("description"),
      image: $(`meta[property='og:image']`).attr("content"),
    };

    res.json(metadata); // Fix: should be res.json(), not res.status.json()
  } catch (errors) {
    console.error(errors);
    res.status(500).json({ message: errors.message, errors });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
