import React from "react";
import DatePicker from "../../Components/DatePicker/DatePicker.js";
import "tachyons";
import { Button } from "@material-ui/core";
import { connect } from "react-redux";
import { toggleAddModal, loggingOut } from "../../actions/index";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

const mapDispatchToProps = dispatch => {
  return {
    toggleAddModal: toggleModal => dispatch(toggleAddModal(toggleModal)),
    loggingOut: logOut => dispatch(loggingOut(logOut))
  };
};

const LeftPanel = props => {
  const emptyState = { nume: "", prenume: "", telefon: "" };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#357edd",
        height: "100%",
        width: "auto",
        zIndex: "10"
      }}
      className="shadow-5"
    >
      <div
        style={{
          backgroundColor: "#fafafa",
          borderRadius: "10%",
          zIndex: "20",
          height: "max-content"
        }}
        className="ma4 pa3 shadow-3"
      >
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
      <Fab
        aria-label="add"
        style={{
          position: "absolute",
          top: "1rem",
          left: "21rem",
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
    </div>
  );
};

export default connect(
  null,
  mapDispatchToProps
)(LeftPanel);
