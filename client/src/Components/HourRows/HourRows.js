import React from "react";
import { hoursArray } from "../DataTables/hoursArray";
import "./HourRows.css";
import dayjs from "dayjs";
import ro from "dayjs/locale/ro";
import { relative } from "path";
dayjs.locale(ro);

const hourRows = () => {
  const array = hoursArray.map(hour => {
    let hourText = "";
    if (hour === 0) {
      hourText = null;
    } else {
      hourText = dayjs(hour, "Hmm").format("HH:mm");
    }

    return (
      <React.Fragment key={hour}>
        <div
          style={{
            backgroundColor: "rgba(0,0,0,0)",
            gridColumnStart: 1,
            height: "3.5vh",
            display: "table",
            zIndex: 2
          }}
          className="overflow-hidden tc"
        >
          <p
            style={{
              padding: "0px",
              margin: "0px",
              height: "2vh",
              display: "table-cell",
              verticalAlign: "middle",
              textAlign: "center"
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

export default React.memo(hourRows);
