import React from "react";

// react component used to create alerts
import ReactBSAlert from "react-bootstrap-sweetalert";

//react date tim picker import
import ReactDatetime from "react-datetime";

// reactstrap components
import { FormGroup, Label, Input, Row, Col, Form } from "reactstrap";

const closeButtonStyle = {
  backgroundImage: "linear-gradient(to bottom left, #fd5d93, #ec250d, #fd5d93)",
  color: "#ffffff",
  borderWidth: "1px",
  borderRadius: "30px",
  padding: "8px 18px",
};

const UpdateEventAlert = (props) => {
  //states to form input values
  const [startDate, setStartDate] = React.useState(props.eventToUpdate.start);
  const [endDate, setEndDate] = React.useState(props.eventToUpdate.end);
  const [description, setDescription] = React.useState(
    props.eventToUpdate.description
  );
  const [location, setLocation] = React.useState(props.eventToUpdate.location);

  //form states to get user inputes
  const [title, setTitle] = React.useState(props.eventToUpdate.title);
  const [titleState, setTitleState] = React.useState("");

  //check for title validation
  const changeTitle = (title) => {
    if (title === "Welcome to Kalena" || title === "") {
      setTitleState("has-danger");
    } else {
      setTitleState("has-success");
    }
    setTitle(title);
  };

  //changing the dates depanding on date typr (end or start)
  const onDateTimeChange = (selectedDate, date) => {
    if (date === "start") {
      setStartDate(selectedDate._d);
    } else {
      setEndDate(selectedDate._d);
    }
  };

  const handleConfirm = () => {
    if (startDate.getTime() > endDate.getTime()) props.dateError();
    else {
      props.eventToUpdate.title = title;
      props.eventToUpdate.start = startDate;
      props.eventToUpdate.end = endDate;
      props.eventToUpdate.description = description;
      props.eventToUpdate.location = location;

      props.onConfirm(props.eventToUpdate);
    }
  };

  return (
    <ReactBSAlert
      style={{
        height: "17cm",
        width: "20cm",
        display: "block",
        marginTop: "-100px",
      }}
      title={"Update Event"}
      onConfirm={handleConfirm}
      onCancel={() => props.onCancel()}
      closeBtnStyle={closeButtonStyle}
      confirmBtnBsStyle="success"
      cancelBtnBsStyle="danger"
      confirmBtnText="Update"
      cancelBtnText="Cancel"
      showCloseButton
      allowEscape
      showCancel
      btnSize=""
    >
      <Form className="form-horizontal" style={{ marginTop: "2cm" }}>
        <Row>
          <Label md="3">Title:</Label>
          <Col md="9">
            <FormGroup>
              <Input
                value={title}
                onChange={(event) => changeTitle(event.target.value)}
                type="text"
              />
              <Row>
                <Label md="1" style={{ fontSize: "10px", color: "red" }}>
                  *required
                </Label>
              </Row>
            </FormGroup>

            {titleState === "has-danger" && (
              <label style={{ color: "red" }} className="error">
                This field is required.
              </label>
            )}
          </Col>
        </Row>
        <Row>
          <Label md="3">Pick Starting Date:</Label>
          <Col md="9">
            <FormGroup>
              <ReactDatetime
                value={startDate}
                onChange={(e) => onDateTimeChange(e, "start")}
                inputProps={{
                  className: "form-control",
                  placeholder: "Datetime Picker Here",
                }}
              />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Label md="3">Pick Ending Date:</Label>
          <Col md="9">
            <FormGroup>
              <ReactDatetime
                value={endDate}
                onChange={(e) => onDateTimeChange(e, "end")}
                inputProps={{
                  className: "form-control",
                  placeholder: "Datetime Picker Here",
                }}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Label md="3">Description:</Label>
          <Col md="9">
            <FormGroup>
              <Input
                value={description}
                type="text"
                onChange={(event) => setDescription(event.target.value)}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Label md="3">Address:</Label>
          <Col md="9">
            <FormGroup>
              <Input
                value={location}
                type="text"
                onChange={(event) => setLocation(event.target.value)}
              />
            </FormGroup>
          </Col>
        </Row>
      </Form>
      <br />
      <br />
    </ReactBSAlert>
  );
};

export default UpdateEventAlert;
