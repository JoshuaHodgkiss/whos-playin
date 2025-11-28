import cors from "cors";
import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(cors());

const API_TOKEN = 'd299e99eeff34cd29095a0d674422b2d' //process.env.FOOTBALL_API_KEY;

app.get("/api/matches/:competition", async (req, res) => {
  const { competition } = req.params;

  try {
    // Log incoming request briefly for debugging
    console.log(`Proxy hit /api/matches/${competition} - incoming origin: ${req.headers.origin || 'none'}`);

    // Masked token for debug (do not log full secret in production)
    const masked = API_TOKEN ? `${API_TOKEN.slice(0,4)}...${API_TOKEN.slice(-4)}` : 'no-token';
    console.log(`Using API token (masked): ${masked} (length=${API_TOKEN.length})`);

    const response = await fetch(
      `https://api.football-data.org/v4/competitions/${competition}/matches`,
      //`http://api.football-data.org/v4/${competition}/matches`,
      {
        headers: { 
          "X-Auth-Token": API_TOKEN,
          "Accept": "application/json",
          "Accept-Encoding": ""
        },
      }
    );

    console.log('Response', response);

    if (!response.ok) {
      const body = await response.text();
      console.error(`Upstream API error: ${response.status} ${response.statusText}`, body);
      // forward status and body (useful for debugging)
      return res.status(response.status).send(body);
    }

    const json = await response.json();
    res.json(json);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching matches" });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Proxy running on http://localhost:${PORT}`));
