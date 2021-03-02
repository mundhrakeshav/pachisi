import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";

const FiatPairCard = () => {
  return (
    <Row className="price-feeds-right-ui-wrapper">
      <Col>
        <Card className="price-feeds-card">
          <Card.Body>
            <Card.Title>Card Title</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </Card.Text>
            <Button variant="primary">Go somewhere</Button>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default FiatPairCard;
