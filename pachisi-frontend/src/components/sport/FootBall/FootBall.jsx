import React, { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import SportsLeftColumn from "../sportsLeftColumn/sportsLeftColumn";
const { axiosAPIInstance } = require("../../../context/baseAxios");

const FootBall = () => {
  useEffect(() => {
    init();
  });

  const init = async () => {
    const response = await axiosAPIInstance.get("/sports/soccer");
    let matches = [];
    response.data.matchList.forEach((element, index) => {
      // matches.push(<MatchCard matchDetails={element} key={index} />);

      console.log(element);
    });
    console.log("Recieved MatchList", response);

    // setMatchList(matches);
    // console.log(response.data.matches);
    // setLoading(false);
  };

  return (
    <Row>
      <Col xl={7} className="middle-column column-wrapper">
        FootBall{" "}
      </Col>
    </Row>
  );
};

export default FootBall;
