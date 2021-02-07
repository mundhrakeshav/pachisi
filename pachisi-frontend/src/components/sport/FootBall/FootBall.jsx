import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import SportsLeftColumn from "../sportsLeftColumn/sportsLeftColumn";
import FootBallCard from "./FootballCard/FootballCard";
const { axiosAPIInstance } = require("../../../context/baseAxios");

const FootBall = () => {
  //
  const [matchList, setMatchList] = useState([]);

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const response = await axiosAPIInstance.get("/sports/soccer");
    let matches = [];
    response.data.matchList.forEach((element, index) => {
      matches.push(<FootBallCard match={element} key={index} />);
    });
    setMatchList(matches);
    setLoading(false);
  };

  return (
    <Col>
      <Row>
        <img src="http://www.f-covers.com/cover/european-football-facebook-cover-timeline-banner-for-fb.jpg" />
      </Row>
      <Col xl={7} className="middle-column column-wrapper">
        {matchList}
      </Col>
    </Col>
  );
};

export default FootBall;
