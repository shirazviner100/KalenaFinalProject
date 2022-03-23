import React, { useContext } from "react";

import ReactBSAlert from "react-bootstrap-sweetalert";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
  Label,
  CardTitle,
  Table,
  Row,
  Col,
} from "reactstrap";

import LoadingSpinner from "components/FormElements/LoadingSpinner";
import AuthContext from "views/store/auth-context";

const MyCoursesPage = () => {
  const [alert, setAlert] = React.useState(null);

  const [isLoading, setIsLoading] = React.useState(false);

  let chosenCourses = {};

  const authCtx = useContext(AuthContext);

  //funcion reset all check box selection
  const resetCheckbox = () => {
    document
      .querySelectorAll("input[type=checkbox]")
      .forEach((el) => (el.checked = false));
    setIsLoading(false);
    hideAlert();
  };

  const hideAlert = () => {
    setIsLoading(false);
    setAlert(null);
  };

  // no chosen courses alert
  const emptyListAlert = () => {
    setAlert(
      <ReactBSAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="Sorry !"
        onConfirm={() => resetCheckbox()}
        confirmBtnBsStyle="success"
        confirmBtnText="OK"
        btnSize=""
      >
        No courses selected.
        <br />
        In order to remove courses from the system, mark the desired courses.
      </ReactBSAlert>
    );
  };

  // user courses list empty pop up
  const emptyUserCoursesList = () => {
    setAlert(
      <ReactBSAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="Sorry !!"
        onConfirm={() => hideAlert()}
        confirmBtnBsStyle="success"
        confirmBtnText="OK"
        btnSize=""
      >
        No courses in the system have been selected for you.
      </ReactBSAlert>
    );
  };

  // function that removes courses to the user
  const removeCoursesHandler = () => {
    setIsLoading(true);
    if (authCtx.userCourses.length === 0) emptyUserCoursesList();
    else {
      let studCourses = [];
      for (let key in chosenCourses) {
        if (chosenCourses[key] === 1) {
          studCourses.push(key);
        }
      }
      if (studCourses.length === 0) emptyListAlert();
      else {
        authCtx.deleteCourses(studCourses);
        resetCheckbox();
      }
    }
  };

  // function that checks if the course has been selected
  const checkBoxChangeHandler = (id) => {
    if (!chosenCourses.hasOwnProperty(id)) {
      chosenCourses[id] = 1;
    } else {
      if (chosenCourses[id] === 0) chosenCourses[id] = 1;
      else chosenCourses[id] = 0;
    }
  };

  return (
    <>
      <div className="content">
        {alert}
        <Row>
          {authCtx.isLoggedIn ? (
            <Col>
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">My Courses:</CardTitle>
                </CardHeader>
                <CardBody>
                  {isLoading && <LoadingSpinner asOverlay />}
                  <Table responsive>
                    <thead className="text-primary">
                      <tr>
                        <th className="text-center">Name</th>
                        <th className="text-center">From</th>
                        <th className="text-center">To</th>
                        <th className="text-center">Day</th>
                        <th className="text-center">Semester</th>
                        <th className="text-center">Lecturer</th>

                        <th className="text-center">Select</th>
                      </tr>
                    </thead>
                    <tbody>
                      {authCtx.userCourses.map((course) => (
                        <tr>
                          <td className="text-center">{course.title}</td>
                          <td className="text-center">
                            {course.start_date.substring(11, 16)}
                          </td>
                          <td className="text-center">
                            {course.end_date.substring(11, 16)}
                          </td>
                          <td className="text-center">{course.day}</td>
                          <td className="text-center">{course.semester}</td>
                          <td className="text-center">{course.lecturer}</td>

                          <td className="text-center">
                            <Input
                              type="checkbox"
                              onChange={() =>
                                checkBoxChangeHandler(course.obj_id)
                              }
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  <Button color="danger" onClick={removeCoursesHandler}>
                    <i className="tim-icons icon-simple-remove" /> Remove
                    Courses
                  </Button>
                </CardBody>
              </Card>
            </Col>
          ) : (
            <Card
              style={{ width: "20cm", marginLeft: "7cm", marginTop: "2cm" }}
            >
              <CardHeader>
                <CardTitle tag="h2">Hello</CardTitle>
              </CardHeader>
              <CardBody>
                <Label tag="h4">
                  In order to use our website you must log-in or register.
                </Label>
              </CardBody>
            </Card>
          )}
        </Row>
      </div>
    </>
  );
};

export default MyCoursesPage;
