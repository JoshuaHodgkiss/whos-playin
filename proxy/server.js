import cors from "cors";
import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(cors());

//https://www.football-data.org/
const FOOTBALL_DATA_TOKEN = 'd299e99eeff34cd29095a0d674422b2d' //process.env.FOOTBALL_API_KEY;
const FOOTBALL_API_KEY = 'a67e983ea3ff81ce272d3a46057ec144';

const CURRENT_YEAR_STRING = new Date().getFullYear().toString();

app.get("/api/champions-league/matches/:competition", async (req, res) => {
  const { competition } = req.params;

  try {
    // Log incoming request briefly for debugging
    //console.log(`Proxy hit /api/champions-league/matches/${competition} - incoming origin: ${req.headers.origin || 'none'}`);

    const response = await fetch(
      `https://api.football-data.org/v4/competitions/${competition}/matches`,
      //`http://api.football-data.org/v4/${competition}/matches`,
      {
        headers: { 
          "X-Auth-Token": FOOTBALL_DATA_TOKEN,
          "Accept": "application/json",
          "Accept-Encoding": ""
        },
      }
    );

    //console.log('Response', response);

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

app.get("/football-api/:league/:season", async (req, res) => {
  const { league, season } = req.params;
  const seasonToUse = season || CURRENT_YEAR_STRING;

  try {
    console.log(`Proxy hit /football-api/${league}/${seasonToUse} - incoming origin: ${req.headers.origin || 'none'}`);

    // Masked key for debug
    // const maskedKey = FOOTBALL_API_KEY ? `${FOOTBALL_API_KEY.slice(0,4)}...${FOOTBALL_API_KEY.slice(-4)}` : 'no-key';
    // console.log(`Using football-api key (masked): ${maskedKey} (length=${FOOTBALL_API_KEY.length})`);

    console.log('URL FA CUP', `https://v3.football.api-sports.io/fixtures?league=${league}&season=${seasonToUse}`);

    const response = await fetch(
      `https://v3.football.api-sports.io/fixtures?league=${league}&season=${seasonToUse}`,
      {
        headers: { 
          "x-apisports-key": `${FOOTBALL_API_KEY}`, // or "X-Auth-Token", etc.
          "Accept": "application/json",
          "Accept-Encoding": ""
        },
      }
    );

    if (!response.ok) {
      const body = await response.text();
      console.error(`Upstream API error: ${response.status}`, body);
      return res.status(response.status).send(body);
    }

    const json = await response.json();
    res.json(json);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching data" });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Proxy running on http://localhost:${PORT}`));
