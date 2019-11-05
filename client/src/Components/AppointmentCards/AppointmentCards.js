import React, { useEffect } from "react";
import { connect } from "react-redux";
import { hoursArray } from "../../Components/DataTables/hoursArray";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import "./AppointmentCards.css";
import {
  deleteProgramare,
  toggleAddModal,
  setProgramari,
  setProgramariEdit,
  fetchProgramari,
  selectDate
} from "../../actions/index";
import io from "socket.io-client";
import moment from "moment";

const mapStateToProps = state => {
  return {
    programari: state.programari,
    selectedDate: state.selectedDate
  };
};

const mapDispatchToProps = dispatch => {
  return {
    deleteProgramare: programare => dispatch(deleteProgramare(programare)),
    toggleAddModal: toggleModal => dispatch(toggleAddModal(toggleModal)),
    setProgramari: programari => dispatch(setProgramari(programari)),
    setProgramariEdit: programari => dispatch(setProgramariEdit(programari)),
    fetchProgramari: programari => dispatch(fetchProgramari(programari)),
    selectDate: date => dispatch(selectDate(date))
  };
};

const AppointmentCards = props => {
  useEffect(() => {
    props.fetchProgramari(props.selectedDate);
    const socket = io.connect();
    socket.on("dataFetch", input => {
      props.setProgramari(input);
    });
    socket.on("refresh", input => {
      const data = moment(input, "DDMMY").format();
      const newDate = new Date(data);
      props.fetchProgramari(data);
      props.selectDate(newDate);
    });
    socket.on("dataFetchEdit", input => {
      props.setProgramariEdit(input);
    });
    socket.on("error", error => {
      document.write(`Error: ${error} <br />`);
    });
    socket.on("connect_error", error => {
      document.write(`Eroare la conexiune. Reincercati. <br />`);
    });
    socket.on("connect_timeout", error => {
      document.write(`Conexiunea a expirat. <br />`);
    });
    socket.on("reconnect", () => {
      window.location.reload(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { programari, selectedDate, deleteProgramare } = props;

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

  const handleDelete = event => {
    const payload = Object.assign(
      {},
      { selectedDate: selectedDate },
      { id: event }
    );
    deleteProgramare(payload);
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

  const array = programari.map(programare => {
    let hourIndex = hoursArray.indexOf(Number(programare.ora)) + 1;
    let cabinetIndex = Number(programare.cabinet) + 1;
    let durata = programare.durata;
    let bgColor = `bg-${programare.medic}`;
    const medic = doctorName(programare.medic);
    let style = {};
    let iconStyle = {};
    let cellStyle = {};
    if (durata === "1") {
      iconStyle = { bottom: "0.5rem" };
      style = {
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gridGap: "1px",
        marginTop: "-3px",
        alignContent: "center",
        height: "100%"
      };
    } else if (durata === "2") {
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
        id={`${programare.index}`}
        key={`${programare.index}`}
        className={`programare pt1 tc dib black-90 shadow-4 ${bgColor}`}
        style={{
          gridColumn: cabinetIndex,
          gridRow: `${hourIndex} / span ${durata}`,
          zIndex: "9"
        }}
      >
        <div style={style}>
          <span
            style={{
              textOverflow: "hidden",
              height: "1rem",
              overflow: "hidden"
            }}
          >
            {programare.nume} {programare.prenume}
          </span>
          <span>{programare.telefon}</span>
          <span style={cellStyle}>{medic}</span>
        </div>
        <div className="editIcon" style={iconStyle}>
          <EditIcon onClick={() => handleEdit(programare)} />
        </div>
        <div className="deleteIcon" style={iconStyle}>
          <DeleteIcon onClick={() => handleDelete(`${programare.index}`)} />
        </div>
      </div>
    );
  });

  return <React.Fragment>{array}</React.Fragment>;
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppointmentCards);
