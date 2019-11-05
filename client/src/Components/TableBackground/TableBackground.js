import React from "react";
import { hoursArray } from "../DataTables/hoursArray";
import "./TableBackground.css";

const TableBackground = () => {
  const array = hoursArray.map((hours, i) => {
    return (
      <React.Fragment key={`fragment${i}`}>
        <div
          className="trBackground"
          style={{
            display: "table",
            width: "100%"
          }}
        >
          <div
            className="tableBackground"
            style={{ width: "10%", height: "2rem" }}
          >
            {" "}
          </div>
          <div className="tableBackground" style={{ width: "30%" }}>
            {" "}
          </div>
          <div className="tableBackground" style={{ width: "30%" }}>
            {" "}
          </div>
          <div className="tableBackground" style={{ width: "30%" }}>
            {" "}
          </div>
        </div>
      </React.Fragment>
    );
  });

  return <React.Fragment>{array}</React.Fragment>;
};
export default TableBackground;
