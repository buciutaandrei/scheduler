import React from "react";
import { connect } from "react-redux";
import { hoursArray } from "../../Components/DataTables/hoursArray";
import "./AppointmentCards.css";
import { toggleAddModal } from "../../actions/index";
import dayjs from "dayjs";
import ro from "dayjs/locale/ro";
dayjs.locale(ro);

const mapStateToProps = state => {
  return {
    appointments: state.appointments,
    selectedDate: state.selectedDate
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleAddModal: toggleModal => dispatch(toggleAddModal(toggleModal))
  };
};

const programDrA = [
  {
    from: "10122019",
    to: "17122019",
    room: "1",
    beginHour: "0830",
    endHour: "1230"
  },
  {
    from: "10122019",
    to: "17122019",
    room: "3",
    beginHour: "1530",
    endHour: "1930"
  }
];

const doctorAvailable = props => {
  let array = [];
  const program = programDrA.map(program => {
    const from = dayjs(program.from, "DDMMYYYY");
    const to = dayjs(program.to, "DDMMYYYY");
    const current = dayjs(props.selectedDate);
    const isBefore =
      to.year() >= current.year() &&
      to.month() >= current.month() &&
      to.date() >= current.date();
    const isAfter =
      from.year() <= current.year() &&
      from.month() <= current.month() &&
      from.date() <= current.date();
    const isBetween = isBefore && isAfter;

    if (isBetween) {
      array = array.concat(program);
    }
  });
  console.log(array);
  const divArray = array.map(data => {
    let hourIndexStart = hoursArray.indexOf(data.beginHour) + 1;
    let hourIndexEnd = hoursArray.indexOf(data.endHour) + 1;
    let roomIndex = Number(data.room) + 1;
    return (
      <div
        style={{
          gridColumn: roomIndex,
          gridRowStart: `${hourIndexStart}`,
          gridRowEnd: `${hourIndexEnd}`,
          zIndex: 2,
          backgroundColor: "rgba(229,115,115,0.3)"
        }}
      ></div>
    );
  });
  return divArray;
};

const AppointmentCards = props => {
  const { appointments, selectedDate } = props;

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

  const doctorName = data => {
    switch (data) {
      case "red": {
        return "dr. A";
      }
      case "green": {
        return "dr. B";
      }
      case "blue": {
        return "dr. C";
      }
      default:
        return "no medic";
    }
  };

  const array = appointments.map(appointment => {
    if (
      dayjs(appointment.selectedDate).format("DDMM") ===
      dayjs(selectedDate).format("DDMM")
    ) {
      let hourIndex = hoursArray.indexOf(appointment.ora) + 1;
      let roomIndex = Number(appointment.room) + 1;
      let timespan = appointment.timespan;
      let bgColor = `bg-${appointment.medic}`;
      const medic = doctorName(appointment.medic);
      let style = {};
      let cellStyle = {};
      if (timespan === "1") {
        style = {
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gridGap: "1px",
          alignContent: "center",
          height: "100%"
        };
      } else if (timespan === "2") {
        style = {
          alignContent: "center",
          display: "grid",
          gridTemplateColumns: "50% 50%",
          height: "100%"
        };
        cellStyle = { gridColumn: "1 / span 2" };
      } else {
        style = {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100%"
        };
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
            marginTop: "5px",
            marginBottom: "5px"
          }}
          onClick={() => handleEdit(appointment)}
        >
          <div style={style}>
            <span
              style={{
                textOverflow: "hidden",
                height: "1rem",
                overflow: "hidden"
              }}
            >
              {appointment.name} {appointment.firstName}
            </span>
            <span>{appointment.telefon}</span>
            <span style={cellStyle}>{medic}</span>
          </div>
        </div>
      );
    } else {
      return null;
    }
  });
  return (
    <React.Fragment>
      {array}
      {doctorAvailable(props)}
    </React.Fragment>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(AppointmentCards));
