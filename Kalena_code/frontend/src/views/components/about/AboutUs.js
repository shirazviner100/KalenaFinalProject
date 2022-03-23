import React from "react";

// reactstrap components
import { Card, CardHeader, CardBody, CardTitle, Row, Col } from "reactstrap";

//component to tell about Kalena project
//static component with no actions
const AboutUs = () => {
  return (
    <>
      <div className="content">
        <div
          style={{
            margin: "auto",
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            style={{ height: "6.5cm", width: "20cm" }}
            alt="..."
            src={require("assets/img/logoT.png").default}
          />
        </div>
        <br />
        <br />
        <Row>
          <Col>
            <Card className="card-stats">
              <CardHeader>
                <CardTitle tag="h3">WHO ARE WE?</CardTitle>
              </CardHeader>
              <CardBody>
                <div>
                  <p style={{ color: "#85e49d" }}>
                    We are a group of 4 students:
                    <br />
                    Hadar, Shiraz, Ronen and Chen.
                    <br />
                    Who study computer science at the Tel Aviv-Yafo Academic
                    College.
                    <br />
                    We see Kalena as a significant help to the student, an added
                    value that is expressed in the proper planning
                    <br />
                    and management of times, centralization, collaboration and
                    technological progress.
                  </p>{" "}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card className="card-stats">
              <CardHeader>
                <CardTitle tag="h3">WHAT IS KALENA</CardTitle>
              </CardHeader>
              <CardBody>
                <div>
                  <p style={{ color: "#85e49d" }}>
                    'Kalena' is a web application that enables personal calendar
                    management,
                    <br />
                    which includes the student's hours system by entering a
                    degree studied.
                    <br />
                    This application allows synchronization between college
                    courses and personal life.
                    <br />
                    The uniqueness of 'Kalena' is that it automatically finds
                    time for scheduling appointments,
                    <br />
                    by an algorithm that searches free time windows in the
                    calendars of selected participants.
                  </p>{" "}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card className="card-stats">
              <CardHeader>
                <CardTitle tag="h3">WHY DO YOU NEED KALENA?</CardTitle>
              </CardHeader>
              <CardBody>
                <div>
                  <p style={{ color: "#85e49d" }}>
                    During the degree we and many students we spoke to,
                    <br />
                    encountered difficulties in coordinating meetings in favor
                    of carrying out projects led by two or more staff members.
                    <br />
                    The difficulties are mainly due to inconsistencies in times.
                    <br />
                    Each student has a different curriculum and external
                    pursuits that conflict with other students' times,
                    <br />
                    so when a multi-participant meeting is needed finding a free
                    time together can take a long time
                    <br />
                    and sometimes even leads to debates about priorities.
                    <br />
                    Therefore Kalena will help you easily and efficiently find
                    free time together.
                  </p>{" "}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default AboutUs;
