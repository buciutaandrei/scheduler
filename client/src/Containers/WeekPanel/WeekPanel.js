import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HourRows from "../../Components/HourRows/HourRows";
import "./WeekPanel.css";
import { connect } from "react-redux";
import { hoursArray } from "../../Components/DataTables/hoursArray";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Loop from "@material-ui/icons/Loop";
import { toggleAddModal, fetchProgramari } from "../../actions/index";
import TableBackground from "../../Components/TableBackground/TableBackground";
import dayjs from "dayjs";
import ro from "dayjs/locale/ro";
import weekday from "dayjs/plugin/weekday";
dayjs.locale(ro);
dayjs.extend(weekday);

const mapStateToProps = state => {
  return {
    programari: state.programari,
    selectedDate: state.selectedDate
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleAddModal: toggleModal => dispatch(toggleAddModal(toggleModal)),
    fetchProgramari: programari => dispatch(fetchProgramari(programari))
  };
};

const WeekPanel = props => {
  const [weekNumber, setWeekNumber] = useState(dayjs());

  useEffect(() => {
    props.fetchProgramari(weekNumber);
  }, [weekNumber]);

  const handleEdit = event => {
    props.toggleAddModal(
      Object.assign({}, event, {
        edit: true,
        editDate: event.selectedDate,
        editCabinet: event.cabinet,
        cabinet: ""
      })
    );
  };

  const emptyState = { nume: "", prenume: "", telefon: "" };

  const days = [];
  const cabinete = ["1", "2", "3"];
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
  const cabineteHeader = days.map((days, i) => {
    const cabineteList = cabinete.map((cabinet, j) => {
      return (
        <div
          key={`${cabinet}${days}`}
          className="tc f5 pa2"
          style={{
            zIndex: 10,
            gridColumnStart: `${i * 3 + 2 + j}`,
            gridRowStart: "2"
          }}
        >
          {cabinet}
        </div>
      );
    });
    return cabineteList;
  });

  const arrayProgramari = props.programari.map(programare => {
    let hourIndex = hoursArray.indexOf(programare.ora) + 2;
    let cabinetIndex =
      Number(programare.cabinet) +
      3 * dayjs(programare.selectedDate).weekday() +
      1;
    let durata = programare.durata;
    let bgColor = `bg-${programare.medic}`;
    let pacientName = "";
    if (programare.durata === 1) {
      pacientName = `${programare.nume}`;
    } else {
      pacientName = `${programare.nume} ${programare.prenume}`;
    }
    return (
      <div
        id={`${programare.index}`}
        key={`${programare.index}`}
        className={`programare pt1 tc dib black-90 shadow-4 ${bgColor}`}
        style={{
          gridColumn: cabinetIndex,
          gridRow: `${hourIndex} / span ${durata}`,
          zIndex: "9",
          overflow: "hidden"
        }}
        onClick={() => handleEdit(programare)}
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
          {cabineteHeader}
          {arrayProgramari}
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
