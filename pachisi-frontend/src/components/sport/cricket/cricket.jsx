import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import MatchCard from "./matchCard/matchCard";
const { axiosAPIInstance } = require("../../../context/baseAxios");

const Cricket = () => {
  const [matchList, setMatchList] = useState([]);

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    console.log("USE EFFECT FROM CRICKET.JSX");
    init();
  }, []);

  const init = async () => {
    const response = await axiosAPIInstance.get("/sports/cricket");
    let matches = [];
    response.data.matchList.forEach((element, index) => {
      matches.push(<MatchCard matchDetails={element} key={index} />);
    });
    console.log("Recieved MatchList", response);

    setMatchList(matches);
    console.log(matches);
    setLoading(false);
  };

  return (
    <Row>
      <Col>
        <img src="https://s3.amazonaws.com/99Covers-Facebook-Covers/watermark/1656.jpg" />
      </Col>
      <Col xl={7} className="middle-column column-wrapper">
        {matchList}
      </Col>
    </Row>
  );
};

export default Cricket;
