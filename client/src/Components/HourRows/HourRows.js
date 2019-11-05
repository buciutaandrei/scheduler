import React from "react";
import { hoursArray } from "../DataTables/hoursArray";
import "./HourRows.css";
import moment from "moment";

const hourRows = () => {
  const array = hoursArray.map(hour => {
    let hourText = "";
    if (hour === 0) {
      hourText = null;
    } else {
      hourText = moment(hour, "Hmm").format("HH:mm");
    }

    return (
      <React.Fragment key={hour}>
        <div
          style={{ backgroundColor: "rgba(0,0,0,0)" }}
          className="hourWrapper overflow-hidden tc"
        >
          <p
            style={{
              padding: "0px",
              margin: "0px",
              display: "table-cell",
              verticalAlign: "middle"
            }}
          >
            {hourText}
          </p>
        </div>
      </React.Fragment>
    );
  });

  return <React.Fragment>{array}</React.Fragment>;
};

export default hourRows;
