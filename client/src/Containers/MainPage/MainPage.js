import React from "react";
import "./MainPage.css";
import "tachyons";
import AppointmentCards from "../../Components/AppointmentCards/AppointmentCards";
import { CssBaseline } from "@material-ui/core";
import { connect } from "react-redux";
import LoadingOverlay from "react-loading-overlay";
import LeftPanel from "../LeftPanel/LeftPanel";
import AddAppointment from "../../Components/AddAppointment/AddAppointment";
import TableBackground from "../../Components/TableBackground/TableBackground";
import HourRows from "../../Components/HourRows/HourRows";
import "shards-ui/dist/css/shards.min.css";
import RefreshIcon from "@material-ui/icons/Refresh";
import { Fab } from "@material-ui/core";

const mapStateToProps = state => {
  return {
    loading: state.loading,
    error: state.error,
    errorContent: state.errorContent
  };
};

const MainPage = props => {
  if (props.error) {
    const errorArray = props.errorContent.map(eroare => {
      return <p>{eroare.toString()}</p>;
    });

    return <div>{errorArray}</div>;
  } else {
    return (
      <React.Fragment>
        <CssBaseline />
        <LoadingOverlay active={props.loading} spinner>
          <div className="appWrapper flex flex-wrap">
            <LeftPanel />
            <Fab
              className=""
              style={{
                backgroundColor: "#74adff",
                color: "white",
                position: "absolute",
                top: "1rem",
                right: "2rem",
                height: "auto",
                width: "auto"
              }}
              onClick={() => props.fetchProgramari(props.selectedDate)}
            >
              <RefreshIcon className="ma2" style={{ fontSize: "2.5rem" }} />
            </Fab>
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
                Cabinetul 1
              </div>
              <div
                className="f4 tc"
                style={{
                  padding: "1.1rem",
                  gridColumnStart: "3",
                  gridRowStart: "1"
                }}
              >
                Cabinetul 2
              </div>
              <div
                className="f4 tc"
                style={{
                  padding: "1.1rem",
                  gridColumnStart: "4",
                  gridRowStart: "1"
                }}
              >
                Cabinetul 3
              </div>
              <AppointmentCards />
            </div>
            <AddAppointment />
          </div>
        </LoadingOverlay>
      </React.Fragment>
    );
  }
};

export default connect(mapStateToProps)(MainPage);
