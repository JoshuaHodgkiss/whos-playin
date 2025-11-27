import { useEffect, useState } from "react";

export function useGetLeagueData() {
  const [premData, setPremData] = useState<MatchData[] | null>(null);
  const [premDataToDisplay, setPremDataToDisplay] = useState<MatchData[] | null>(null);

  const [allMatches, setAllMatches] = useState<MatchData[] | null>(null);
  const [loading, setLoading] = useState(true);

  //todos: filter by date to only show upcoming matches and maybe limit to next 10 matches
  //add more leagues
  //add teams dropdown filter with options taken from data
  //add leagues filter with options taken from data
  //add team logos if possible
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
        console.log("fetched league data:", json);
        const premDataFromJson:MatchData[] = json.matches.map((match: any) => ({
          date: match.date,
          time: match.time,
          team1: match.team1,
          team2: match.team2,
          league: json.name
          //league: 'Premier League'
        }));
        setPremData(premDataFromJson);
        
      } catch (error) {
        console.error("Error fetching league:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPremData();
  }, []);

  return { premData, loading};
}

export type MatchData = {
  date: string;
  time: string;
  team1: string;
  team2: string;
  league: string;
}