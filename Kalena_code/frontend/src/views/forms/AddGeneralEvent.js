import React from "react";

// react component used to create alerts
import ReactBSAlert from "react-bootstrap-sweetalert";

//react date tim picker import
import ReactDatetime from "react-datetime";

// reactstrap components
import { FormGroup, Label, Row, Col, Input, Form } from "reactstrap";

const closeButtonStyle = {
  backgroundImage: "linear-gradient(to bottom left, #fd5d93, #ec250d, #fd5d93)",
  color: "#ffffff",
  borderWidth: "1px",
  borderRadius: "30px",
  padding: "8px 18px",
};

const AddGenralEvent = (props) => {
  //state to check repeat values
  const [isMonthly, setIsMonthly] = React.useState(false);
  const [isWeekly, setIsWeekly] = React.useState(false);
  const [repeatState, setReapeatState] = React.useState("");

  //form states to get user inputes
  const [title, setTitle] = React.useState("");
  const [titleState, setTitleState] = React.useState("");

  const [description, setDescription] = React.useState("");
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const [address, setAddress] = React.useState("");

  //all day state
  const [allDay, setAllDay] = React.useState(false);

  //function check if only one repeat choice was choosen
  const repeatChange = () => {
    if (isWeekly && isMonthly) setReapeatState("has-danger");
    else setReapeatState("has-success");
  };

  //runs every time that isWeekly state changes
  React.useEffect(() => {
    repeatChange();
  }, [isWeekly]);

  //runs every time that isMonthly state changes
  React.useEffect(() => {
    repeatChange();
  }, [isMonthly]);

  //check for title validation
  const changeTitle = (title) => {
    if (title === "") {
      setTitleState("has-danger");
    } else {
      setTitleState("has-success");
    }
    setTitle(title);
  };

  //function send request to the caledar page to add the event by the input values
  const handleConfirm = () => {
    let validation = true;
    let ifRepeat;

    if (allDay) {
      const startDateUpdate = startDate.setHours(9, 0, 0, 0);
      setStartDate(startDateUpdate);
      const endDateUpdate = endDate.setHours(22, 0, 0, 0);
      setEndDate(endDateUpdate);
    }

    if (titleState !== "has-success" || repeatState !== "has-success")
      validation = false;

    if (repeatState === "has-success")
      ifRepeat = isWeekly ? "weekly" : isMonthly ? "monthly" : "None";
    else ifRepeat = "None";

    props.onConfirm(
      title,
      address,
      description,
      ifRepeat,
      startDate,
      endDate,
      "red",
      allDay,
      validation
    );
  };

  //runs each time the page is loading
  React.useEffect(() => {
    if (props.resetDate) {
      setStartDate(new Date(props.resetDate.start.getTime()));
      setEndDate(new Date(props.resetDate.end.getTime()));
    }
  }, []);

  //changing the dates depanding on date typr (end or start)
  const onDateTimeChange = (selectedDate, date) => {
    if (date === "start") {
      setStartDate(selectedDate._d);
    } else {
      setEndDate(selectedDate._d);
    }
  };

  return (
    <ReactBSAlert
      style={{
        height: "21cm",
        width: "21cm",
        display: "block",
        marginTop: "-100px",
      }}
      title={"Add General Schedule"}
      onConfirm={handleConfirm}
      onCancel={() => props.onCancel()}
      closeBtnStyle={closeButtonStyle}
      confirmBtnBsStyle={titleState === "has-success" ? "success" : "title"}
      cancelBtnBsStyle="danger"
      confirmBtnText="Add"
      cancelBtnText="Cancel"
      showCloseButton
      allowEscape
      showCancel
      btnSize=""
    >
      <Form className="form-horizontal" style={{ marginTop: "1cm" }}>
        <Row>
          <Label md="3">Title:</Label>
          <Col md="9">
            <FormGroup>
              <Input
                value={title}
                type="text"
                onChange={(event) => changeTitle(event.target.value)}
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
                onChange={(e) => onDateTimeChange(e, "start")}
                selected={startDate}
                value={startDate}
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
                selected={endDate}
                onChange={(e) => onDateTimeChange(e, "end")}
                value={endDate}
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
                type="text"
                onChange={(event) => setAddress(event.target.value)}
              />
            </FormGroup>
          </Col>
        </Row>
        <br />
        <Row>
          <Label sm="3">Repeat: </Label>
          <Col sm="6">
            <FormGroup check inline>
              <Label style={{ color: "black" }} check>
                <Input
                  onChange={() => setIsWeekly(!isWeekly)}
                  defaultValue="Weekly"
                  id="Weekly"
                  name="WeeklyRepeat"
                  type="checkbox"
                />
                <span className="form-check-sign" />
                Weekly Repeat
              </Label>
            </FormGroup>
            <FormGroup check inline>
              <Label style={{ color: "black" }} check>
                <Input
                  onChange={() => setIsMonthly(!isMonthly)}
                  defaultValue="Monthly"
                  id="Monthly"
                  name="MonthlyRepeat"
                  type="checkbox"
                />
                <span className="form-check-sign" />
                Monthly Repeat
              </Label>
            </FormGroup>
          </Col>
        </Row>
        {repeatState === "has-danger" ? (
          <Row>
            <Col md="9">
              <Label style={{ color: "red" }} className="error">
                You can`t pick 2 checkbox.
              </Label>
            </Col>
          </Row>
        ) : null}
        <br />
        <Row>
          <Label sm="3"></Label>
          <Col sm="3">
            <FormGroup check inline>
              <Label style={{ color: "black" }} check>
                <Input
                  onChange={() => setAllDay(!allDay)}
                  defaultValue="all_day"
                  id="all_day"
                  name="all_day"
                  type="checkbox"
                />
                <span className="form-check-sign" />
                All day event
              </Label>
            </FormGroup>
          </Col>
        </Row>
        <br />
        <br />
        <Row>
          <img
            style={{
              height: "4cm",
              width: "8cm",
              marginLeft: "auto",
              marginRight: "auto",
            }}
            alt="Back"
            src={require("assets/img/task.jpg").default}
          />
        </Row>
      </Form>
      <br />
    </ReactBSAlert>
  );
};

export default AddGenralEvent;
