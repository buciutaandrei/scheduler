import React, { useState } from "react";
import DatePicker from "../../Components/DatePicker/DatePicker.js";
import "tachyons";
import Button from "@material-ui/core/Button";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import { connect } from "react-redux";
import { toggleAddModal, loggingOut } from "../../actions/index";

import "./LeftPanel.css";

const mapDispatchToProps = dispatch => {
  return {
    toggleAddModal: toggleModal => dispatch(toggleAddModal(toggleModal)),
    loggingOut: logOut => dispatch(loggingOut(logOut))
  };
};

const LeftPanel = props => {
  const [drawer, toggleDrawer] = useState(true);

  return (
    <SwipeableDrawer
      open={drawer}
      onOpen={() => toggleDrawer(true)}
      onClose={() => toggleDrawer(false)}
    >
      <div className="shadow-5 leftPanelSwipe">
        <div className="datePickerWrapper ma4 pa3 shadow-3">
          <DatePicker />
        </div>
        <Button
          style={{
            position: "absolute",
            padding: "1.5rem",
            bottom: "0",
            left: "0",
            width: "23rem",
            height: "2rem",
            color: "#fafafa",
            letterSpacing: "2px",
            zIndex: "20"
          }}
          onClick={props.loggingOut}
        >
          Log out
        </Button>
      </div>
    </SwipeableDrawer>
  );
};

export default connect(null, mapDispatchToProps)(LeftPanel);
