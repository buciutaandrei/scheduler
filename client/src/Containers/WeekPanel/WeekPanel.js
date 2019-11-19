import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HourRows from "../../Components/HourRows/HourRows";
import "./WeekPanel.css";
import { connect } from "react-redux";
import { hoursArray } from "../../Components/DataTables/hoursArray";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Loop from "@material-ui/icons/Loop";
import { toggleAddModal, fetchAppointments } from "../../actions/index";
import TableBackground from "../../Components/TableBackground/TableBackground";
import dayjs from "dayjs";
import ro from "dayjs/locale/ro";
import weekday from "dayjs/plugin/weekday";
dayjs.locale(ro);
dayjs.extend(weekday);

const mapStateToProps = state => {
  return {
    appointments: state.appointments,
    selectedDate: state.selectedDate
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleAddModal: toggleModal => dispatch(toggleAddModal(toggleModal)),
    fetchAppointments: appointments => dispatch(fetchAppointments(appointments))
  };
};

const WeekPanel = props => {
  const [weekNumber, setWeekNumber] = useState(dayjs());

  useEffect(() => {
    props.fetchAppointments(weekNumber);
  }, [weekNumber]);

  const handleEdit = event => {
    props.toggleAddModal(
      Object.assign({}, event, {
        edit: true,
        editDate: event.selectedDate,
        editRoom: event.room,
        room: ""
      })
    );
  };

  const emptyState = { name: "", firstName: "", telefon: "" };

  const days = [];
  const rooms = ["1", "2", "3"];
  for (let i = 0; i < 5; ++i) {
    days.push(
      dayjs(weekNumber, "week")
        .startOf("week")
        .add(i, "d")
        .format("dddd DD.MM")
    );
  }
  const daysHeader = days.map((days, i) => {
    return (
      <div
        key={days}
        className="tc f4 pa2"
        style={{
          zIndex: 10,
          gridColumn: `${i * 3 + 2} / span 3`,
          gridRowStart: "1"
        }}
      >
        {days}
      </div>
    );
  });
  const roomsHeader = days.map((days, i) => {
    const roomsList = rooms.map((room, j) => {
      return (
        <div
          key={`${room}${days}`}
          className="tc f5 pa2"
          style={{
            zIndex: 10,
            gridColumnStart: `${i * 3 + 2 + j}`,
            gridRowStart: "2"
          }}
        >
          {room}
        </div>
      );
    });
    return roomsList;
  });

  const arrayAppointments = props.appointments.map(appointment => {
    let hourIndex = hoursArray.indexOf(appointment.ora) + 2;
    let roomIndex =
      Number(appointment.room) +
      3 * dayjs(appointment.selectedDate).weekday() +
      1;
    let timespan = appointment.timespan;
    let bgColor = `bg-${appointment.medic}`;
    let pacientName = "";
    if (appointment.timespan === 1) {
      pacientName = `${appointment.name}`;
    } else {
      pacientName = `${appointment.name} ${appointment.firstName}`;
    }
    return (
      <div
        id={`${appointment.index}`}
        key={`${appointment.index}`}
        className={`appointment pt1 tc dib black-90 shadow-4 ${bgColor}`}
        style={{
          gridColumn: roomIndex,
          gridRow: `${hourIndex} / span ${timespan}`,
          zIndex: "9",
          overflow: "hidden"
        }}
        onClick={() => handleEdit(appointment)}
      >
        {pacientName}
      </div>
    );
  });

  return (
    <React.Fragment>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: "#357edd",
          zIndex: "-1"
        }}
        className="shadow-3 topBar"
      ></div>
      <div
        style={{
          position: "absolute",
          width: "90%",
          zIndex: "1",
          marginTop: "5rem",
          alignSelf: "center"
        }}
      >
        <TableBackground />
      </div>
      <div className="weekTableWrapper">
        <Link to="/">
          <Fab
            style={{
              position: "absolute",
              bottom: "1rem",
              right: "1rem",
              backgroundColor: "#74adff",
              color: "white",
              width: "4rem",
              height: "4rem",
              zIndex: "20"
            }}
          >
            <Loop />
          </Fab>
        </Link>
        <Fab
          className="addFab"
          aria-label="add"
          style={{
            position: "absolute",
            top: "3.5rem",
            right: "1rem",
            backgroundColor: "#74adff",
            color: "white",
            width: "4rem",
            height: "4rem",
            zIndex: "20"
          }}
          onClick={() => props.toggleAddModal(emptyState)}
        >
          <AddIcon style={{ fontSize: "2.5rem" }} />
        </Fab>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <button
            style={{
              backgroundColor: "transparent",
              color: "#fafafa",
              border: "none",
              fontSize: "1.5rem"
            }}
            onClick={() => {
              setWeekNumber(dayjs(weekNumber).subtract(1, "week"));
            }}
          >
            &#8592;
          </button>
          <div
            style={{ color: "#fafafa", cursor: "default" }}
            className="f3 pa2"
          >
            {dayjs(weekNumber)
              .startOf("week")
              .format("DD.MM.YYYY")}{" "}
            -{" "}
            {dayjs(weekNumber)
              .startOf("week")
              .add(4, "d")
              .format("DD.MM.YYYY")}
          </div>
          <button
            style={{
              backgroundColor: "transparent",
              color: "#fafafa",
              border: "none",
              fontSize: "1.5rem"
            }}
            onClick={() => {
              setWeekNumber(dayjs(weekNumber).add(1, "week"));
            }}
          >
            &#8594;
          </button>
        </div>
        <div
          style={{
            display: "grid",
            gridAutoFlow: "column",
            gridTemplateColumns: "5% repeat(auto-fill, 6.33%)"
          }}
        >
          {daysHeader}
          {roomsHeader}
          {arrayAppointments}
          <div
            style={{ display: "table-cell", gridRow: "2", gridColumn: "1" }}
          ></div>
          <HourRows />
        </div>
      </div>
    </React.Fragment>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(WeekPanel);
