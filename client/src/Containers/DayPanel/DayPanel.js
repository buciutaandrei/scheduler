import React from "react";
import { Link } from "react-router-dom";
import TableBackground from "../../Components/TableBackground/TableBackground";
import HourRows from "../../Components/HourRows/HourRows";
import AppointmentCards from "../../Components/AppointmentCards/AppointmentCards";
import Loop from "@material-ui/icons/Loop";
import Fab from "@material-ui/core/Fab";

const DayPanel = () => {
  return (
    <React.Fragment>
      <Link to="/week">
        <Fab
          style={{
            position: "absolute",
            top: "1rem",
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
      <div className="tableWrapper">
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            zIndex: "1",
            marginTop: "1.95rem"
          }}
        >
          <TableBackground />
        </div>
        <HourRows />
        <div
          className="f4 tc"
          style={{
            padding: "1.1rem",
            gridColumnStart: "2",
            gridRowStart: "1"
          }}
        >
          Cab. 1
        </div>
        <div
          className="f4 tc"
          style={{
            padding: "1.1rem",
            gridColumnStart: "3",
            gridRowStart: "1"
          }}
        >
          Cab. 2
        </div>
        <div
          className="f4 tc"
          style={{
            padding: "1.1rem",
            gridColumnStart: "4",
            gridRowStart: "1"
          }}
        >
          Cab. 3
        </div>
        <AppointmentCards />
      </div>
    </React.Fragment>
  );
};

export default DayPanel;
