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
    const response = await axios.get(url);
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

    res.json(metadata);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Unable to fetch metadata" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
