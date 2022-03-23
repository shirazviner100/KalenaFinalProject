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

const AddNewEventAlert = (props) => {
  //states to form input values
  const [color, setColor] = React.useState("blue");
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const [description, setDescription] = React.useState("");
  const [address, setAddress] = React.useState("");

  //states to check if the event as to repeat
  const [isMonthly, setIsMonthly] = React.useState(false);
  const [isWeekly, setIsWeekly] = React.useState(false);
  const [repeatState, setReapeatState] = React.useState("");

  //all day state
  const [allDay, setAllDay] = React.useState(false);

  //runs every time that isWeekly state changes
  React.useEffect(() => {
    repeatChange();
  }, [isWeekly]);

  //runs every time that isMonthly state changes
  React.useEffect(() => {
    repeatChange();
  }, [isMonthly]);

  //function check if only one repeat choise was choosen
  const repeatChange = () => {
    if (isWeekly && isMonthly) setReapeatState("has-danger");
    else setReapeatState("has-success");
  };

  //The function changes the color value according to the title
  const { title } = props;
  React.useEffect(() => {
    if (title === "Workout") {
      setColor("workout");
    } else if (title === "Work") {
      setColor("work");
    } else if (title === "Medical Care") {
      setColor("azure");
    } else if (title === "General") {
      setColor("red");
    }
  }, [title]);

  //changing the dates depanding on date typr (end or start)
  const onDateTimeChange = (selectedDate, date) => {
    if (date === "start") {
      setStartDate(selectedDate._d);
    } else {
      setEndDate(selectedDate._d);
    }
  };

  //function send request to the caledar page to add the event by the input values
  const handleConfirm = () => {
    let validation = true;
    let ifRepeat;

    if (allDay) {
      let startDateUpdate = startDate.setHours(9, 0, 0, 0);
      setStartDate(startDateUpdate);
      let endDateUpdate = endDate.setHours(22, 0, 0, 0);
      setEndDate(endDateUpdate);
    }

    if (repeatState === "has-success")
      ifRepeat = isWeekly ? "weekly" : isMonthly ? "monthly" : "None";
    else ifRepeat = "None";

    props.onConfirm(
      props.title,
      address,
      description,
      ifRepeat,
      startDate,
      endDate,
      color,
      allDay,
      validation
    );
  };

  return (
    <ReactBSAlert
      style={{
        height: "20cm",
        width: "20cm",
        display: "block",
        marginTop: "-100px",
      }}
      title={"Add " + props.title + " Schedule"}
      onConfirm={handleConfirm}
      onCancel={() => props.onCancel()}
      closeBtnStyle={closeButtonStyle}
      confirmBtnBsStyle="success"
      cancelBtnBsStyle="danger"
      confirmBtnText="Add"
      cancelBtnText="Cancel"
      showCloseButton
      allowEscape
      showCancel
      btnSize=""
    >
      <Form className="form-horizontal" style={{ marginTop: "2cm" }}>
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
        <Row>
          <Label md="3">Repeat:</Label>
          <Col md="7">
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
            <Col md="10">
              <Label style={{ color: "red" }} className="error">
                You can`t pick 2 checkbox.
              </Label>
            </Col>
          </Row>
        ) : null}
        <br />
        <Row>
          <Label sm="3"></Label>
          <Col sm="4">
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
        <Row>
          <img
            style={{
              height: "4cm",
              width: "8cm",
              marginLeft: "auto",
              marginRight: "auto",
            }}
            alt="Back"
            src={require("assets/img/" + props.title + ".jpg").default}
          />
        </Row>
      </Form>
      <br />
      <br />
    </ReactBSAlert>
  );
};

export default AddNewEventAlert;
