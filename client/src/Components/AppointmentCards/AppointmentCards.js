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
    console.log(event);
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
          marginTop: "-3px",
          alignContent: "center",
          height: "100%"
        };
      } else if (timespan === "2") {
        style = {
          alignContent: "center",
          marginTop: "-3px",
          display: "grid",
          gridTemplateColumns: "50% 50%",
          height: "100%"
        };
        cellStyle = { gridColumn: "1 / span 2" };
      } else {
        style = {
          display: "flex",
          flexDirection: "column",
          marginTop: "-3px",
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
            zIndex: "9"
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
  return <React.Fragment>{array}</React.Fragment>;
};

export default connect(mapStateToProps, mapDispatchToProps)(AppointmentCards);
