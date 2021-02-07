const axios = require("axios").default;
const timestamp = require("unix-timestamp");

const getCricketData = async (req, res) => {
  const response = await axios.get(
    "https://cricapi.com/api/matches?apikey=lnxWOlg0fFfJchga3Vw8CnGOZh42"
  );
  let matches = [];
  let matchList = []; //matchList will be sent to client

  matches = response["data"]["matches"];
  console.log(matches);
  matches.forEach((element) => {
    matchList.push({
      unique_id: element["unique_id"],
      timeEpoch: timestamp.fromDate(element["date"].split("T")[0]),
      date: element["date"].split("T")[0],
      "team-1": element["team-1"],
      "team-2": element["team-2"],
      type: element["type"],
      toss_winner_team: element["toss_winner_team"]
        ? element["toss_winner_team"]
        : null,
      winner_team: element["winner_team"] ? element["winner_team"] : null,
      squad: element["squad"],
      matchStarted: element["matchStarted"],
      winner_team_number: element["winner_team"]
        ? element["winner_team"] == element["team-1"]
          ? 1
          : 2
        : null,
      toss_winner_team_number:
        element["toss_winner_team"] && element["toss_winner_team"] !== "no toss"
          ? element["toss_winner_team"] == element["team-1"]
            ? 1
            : 2
          : null,
      squad: element["squad"],
    });
  });

  return res.json({ matchList });
};

const getFootballMatches = async (req, res) => {
  const response = await axios.get(
    "https://app.sportdataapi.com/api/v1/soccer/matches?apikey=5b6ebeb0-630b-11eb-889b-c3d00636415c&season_id=496&date_from=2021-01-31"
  );
  let matches = [];
  let matchList = []; //matchList will be sent to client
  matches = response.data.data;
  console.log(matches[0]);
  matches.forEach((element) => {
    const home_half_timeScore = () => {
      if (element["stats"]["ht_score"] === null) {
        return 0;
      } else {
        return parseInt(element["stats"]["ht_score"].split("-")[0]);
      }
    };

    const away_half_timeScore = () => {
      if (element["stats"]["ht_score"] === null) {
        return 0;
      } else {
        return parseInt(element["stats"]["ht_score"].split("-")[1]);
      }
    };

    const home_full_timeScore = () => {
      if (element["stats"]["ft_score"] === null) {
        return 0;
      } else {
        return parseInt(element["stats"]["ft_score"].split("-")[0]);
      }
    };

    const away_full_timeScore = () => {
      if (element["stats"]["ft_score"] === null) {
        return 0;
      } else {
        return parseInt(element["stats"]["ft_score"].split("-")[1]);
      }
    };

    // console.log(home_half_timeScore);
    // console.log(away_half_timeScore);
    // console.log(home_full_timeScore);
    // console.log(away_full_timeScore);

    matchList.push({
      matchId: element["match_id"],
      statusCode: element["status_code"],
      status: element["status"],
      match_start_time: timestamp.fromDate(
        element["match_start"].split(" ")[0]
      ),
      // half_time_score: element["stats"]["ht_score"],
      // full_time_score: element["stats"]["ft_score"],

      home_half_timeScore: home_half_timeScore(),
      away_half_timeScore: away_half_timeScore(),
      home_full_timeScore: home_full_timeScore(),
      away_full_timeScore: away_full_timeScore(),

      home_team: element["home_team"]["name"],
      away_team: element["away_team"]["name"],
      home_team_short_code: element["home_team"]["short_code"],
      away_team_short_code: element["away_team"]["short_code"],
      home_team_id: element["home_team"]["team_id"],
      away_team_id: element["home_team"]["team_id"],
    });
  });

  console.log(matchList);
  return res.json({ message: "Success", matchList });
};

const getFootballMatchData = async (req, res) => {};

module.exports = { getCricketData, getFootballMatchData, getFootballMatches };
