import React from "react";
import { hoursArray } from "../DataTables/hoursArray";
import "./HourRows.css";
import dayjs from "dayjs";
import ro from "dayjs/locale/ro";
import { relative } from "path";
dayjs.locale(ro);

const HourRows2 = () => {
  const array = hoursArray.map((hour, index) => {
    let hourText = "";
    if (hour === 0) {
      hourText = null;
    } else {
      hourText = dayjs(hour, "Hmm").format("HH:mm");
    }

    let style = {
      backgroundColor: "rgba(230,230,230,0.5)",
      gridColumnStart: 1,
      gridColumnEnd: 10,
      height: "3.5vh",
      display: "grid",
      zIndex: 5
    };

    if (index % 2 === 0) {
      style = {
        backgroundColor: "rgba(230,230,230,0.5)",
        gridColumnStart: 1,
        gridColumnEnd: 10,
        height: "3.5vh",
        display: "grid",
        zIndex: 5
      };
    } else {
      style = {
        gridColumnStart: 1,
        gridColumnEnd: 10,
        height: "3.5vh",
        display: "grid",
        zIndex: 5
      };
    }

    return (
      <React.Fragment key={hour + "background"}>
        <div style={style} className="overflow-hidden tc">
          <p
            style={{
              padding: "0px",
              margin: "0px",
              height: "2vh",
              display: "table-cell",
              verticalAlign: "middle",
              textAlign: "center"
            }}
          ></p>
        </div>
      </React.Fragment>
    );
  });

  return <React.Fragment>{array}</React.Fragment>;
};

export default React.memo(HourRows2);
