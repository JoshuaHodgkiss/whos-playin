import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

//todos: filter by date to only show upcoming matches and maybe limit to next 2 weeks DONE

//need to use the proxy in development instead of direct. 
// proxy is set up and the url will be like "http://localhost:3001/api/matches/FAC" FAC being the competition code


//add more leagues
//add teams dropdown filter with options taken from data
//add leagues filter with options taken from data
//add team logos if possible

const DEVELOPMENT = true; //set to true to use local proxy should come from an env file

const CHAMP_API_TOKEN = "d299e99eeff34cd29095a0d674422b2d";
const BASE_CHAMP_URL_DEV = "http://localhost:3001/api/champions-league/matches";
const BASE_CHAMP_URL_PROD = "https://api.football-data.org/v4";

const FOOTBALL_API_TOKEN = "a67e983ea3ff81ce272d3a46057ec144";
const BASE_FOOTBALL_API_DEV = "http://localhost:3001/football-api";
const BASE_FOOTBALL_API_PROD = "" //"https://v3.football.api-sports.io";

const BASE_WORLDCUP_API_DEV = 'https://worldcup26.ir/get';
const BASE_WORLDCUP_API_PROD = "";

export const WORLDCUP_ENDPOINTS = {
  GAMES: 'games',
  GROUPS: 'groups',
  // TEAMS: 'teams',
  // STADIUMS: 'stadiums',
};

const CACHE_TTL = 1000 * 60 * 60; // 1 hour cache
const CURRENT_YEAR_STRING = new Date().getFullYear().toString();

async function getCached(key: string) {
  const json = await AsyncStorage.getItem(key);
  if (!json) return null;

  const { timestamp, data } = JSON.parse(json);
  const expired = Date.now() - timestamp > CACHE_TTL;

  return expired ? null : data;
}

async function setCached(key: string, data: any) {
  await AsyncStorage.setItem(
    key,
    JSON.stringify({
      timestamp: Date.now(),
      data,
    })
  );
}

export async function fetchChampMatchesCached(competitionCode: string) {
  const cacheKey = `champ_matches_${competitionCode}`;
  const cached = await getCached(cacheKey);

  if (cached) {
    return cached; // Return cached version
  }

  let url = ''
  if (DEVELOPMENT === true) {
    url = `${BASE_CHAMP_URL_DEV}/${competitionCode}`;
  } else {
    url = `${BASE_CHAMP_URL_PROD}/competitions/${competitionCode}`;
  }

  const res = await fetch(url, {
    headers: {
      "X-Auth-Token": CHAMP_API_TOKEN
    },
  });

  if (!res.ok) throw new Error(`API error ${res.status}`);

  const json = await res.json();
  await setCached(cacheKey, json);

  return json;
}

export async function fetchFootballApiCached(competitionCode: string, year: string) {
  const cacheKey = `football_api_${competitionCode}_${year}`;
  const cached = await getCached(cacheKey);

  if (cached) {
    return cached; // Return cached version
  }

  let url = ''
  if (DEVELOPMENT === true) {
    url = `${BASE_FOOTBALL_API_DEV}/${competitionCode}/${year}`;
  } else {
    //not correct yet
    url = `${BASE_CHAMP_URL_PROD}/competitions/${competitionCode}/${year}`;
  }

  console.log('fetchFootballApiCached url', url);

  const res = await fetch(url, {
    headers: {
      "X-Auth-Token": FOOTBALL_API_TOKEN
    },
  });

  if (!res.ok) throw new Error(`API error ${res.status}`);

  const json = await res.json();
  await setCached(cacheKey, json);

  return json;
}

export async function fetchWorldCupApiCached(endpoint: string) {
  const cacheKey = `worldcup26_${endpoint}`;
  const cached = await getCached(cacheKey);

  if (cached) {
    return cached;
  }

  let url = '';

  if (DEVELOPMENT === true) {
    // If you're proxying through your local server
    url = `${BASE_WORLDCUP_API_DEV}/${endpoint}`;
  } else {
    url = `${BASE_WORLDCUP_API_PROD}/${endpoint}`;
  }

  console.log('fetchWorldCupApiCached url', url);

  const res = await fetch(url, {
      headers: {
      "Cross-Origin-Opener-Policy": "*",
    },
  });

  if (!res.ok) {
    throw new Error(`WorldCup26 API error: ${res.status}`);
  }

  const json = await res.json();

  await setCached(cacheKey, json);

  return json;
}


export function useGetLeagueData() {

  const [premDataToDisplay, setPremDataToDisplay] = useState<MatchData[] | null>(null);
  const [champLeagueDataToDisplay, setChampLeagueDataToDisplay] = useState<MatchData[] | null>(null);

  const [allMatchesToDisplay, setAllMatchesToDisplay] = useState<MatchData[] | null>(null);
  const [loading, setLoading] = useState(true);

  const date = new Date();
  const TODAY = date.toISOString().split('T')[0]; // 'YYYY-MM-DD'
  const CUT_OFF = new Date(date.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 'YYYY-MM-DD' two weeks from today

  useEffect(() => {
    const fetchPremData = async () => {
      try {
        const url =
          "https://raw.githubusercontent.com/openfootball/football.json/master/2025-26/en.1.json";
        const response = await fetch(url);
        const json = await response.json();
        //console.log("fetched league data:", json);
        const premDataFromJson: MatchData[] = json.matches.map((match: any) => ({
          date: match.date,
          time: match.time,
          team1: match.team1,
          team2: match.team2,
          league: json.name
          //league: 'Premier League'
        }));
        //setPremData(premDataFromJson);

        setPremDataToDisplay(premDataFromJson.filter((match: MatchData) => {
          return match.date >= TODAY && match.date <= CUT_OFF;
        }));

      } catch (error) {
        console.error("Error fetching league:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPremData();
  }, []);

  useEffect(() => {
    const champLeague = fetchChampMatchesCached("CL");
    console.log('champLeague', champLeague);
    champLeague.then((data) => {
      const champLeagueDataFromApi: MatchData[] = data.matches.map((match: any) => ({
        date: match.utcDate.split('T')[0],
        time: match.utcDate.split('T')[1].slice(0, 5),
        team1: match.homeTeam.name,
        team2: match.awayTeam.name,
        league: data.competition.name
      }));
      //setChampLeagueData(champLeagueDataFromApi);

      setChampLeagueDataToDisplay(champLeagueDataFromApi.filter((match: MatchData) => {
        return match.date >= TODAY && match.date <= CUT_OFF;
      }));
    }).catch((error) => {
      console.error("Error fetching Champions League data:", error);
    });

  }, []);

  useEffect(() => {
    const worldCupGames = fetchWorldCupApiCached(WORLDCUP_ENDPOINTS.GAMES);
    console.log('worldCupGames', worldCupGames);

  }, []);



  // useEffect(() => {
  //   const faCup = fetchFootballApiCached("45", CURRENT_YEAR_STRING); //45 is FA cup
  //   console.log('faCup', faCup);
  //   faCup.then((data) => {
  //     console.log('faCup data', data);

  //     // const faCupDataFromApi: MatchData[] = data.matches.map((match: any) => ({
  //     //   date: match.utcDate.split('T')[0],
  //     //   time: match.utcDate.split('T')[1].slice(0, 5),
  //     //   team1: match.homeTeam.name,
  //     //   team2: match.awayTeam.name,
  //     //   league: data.competition.name
  //     // }));

  //     // setFADataToDisplay(faCupDataFromApi.filter((match: MatchData) => {
  //     //   return match.date >= TODAY && match.date <= CUT_OFF;
  //     // }));

  //   }).catch((error) => {
  //     console.error("Error fetching FA data:", error);
  //   });

  // }, []);

  useEffect(() => {
    const combinedMatches = [... (premDataToDisplay || []), ... (champLeagueDataToDisplay || [])];
    // Sort by date
    combinedMatches.sort((a, b) => a.date.localeCompare(b.date));
    setAllMatchesToDisplay(combinedMatches);

  }, [premDataToDisplay, champLeagueDataToDisplay]);

  return { premDataToDisplay, allMatchesToDisplay, loading };
}

export type MatchData = {
  date: string;
  time: string;
  team1: string;
  team2: string;
  league: string;
}