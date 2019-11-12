import React, { useEffect } from "react";
import "./MainPage.css";
import "tachyons";
import { CssBaseline } from "@material-ui/core";
import { connect } from "react-redux";
import LoadingOverlay from "react-loading-overlay";
import LeftPanel from "../LeftPanel/LeftPanel";
import AddAppointment from "../../Components/AddAppointment/AddAppointment";
import "shards-ui/dist/css/shards.min.css";
import WeekPanel from "../WeekPanel/WeekPanel";
import DayPanel from "../DayPanel/DayPanel";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import io from "socket.io-client";
import moment from "moment";
import {
  deleteProgramare,
  toggleAddModal,
  setProgramari,
  setProgramariEdit,
  fetchProgramari,
  selectDate
} from "../../actions/index";

const mapStateToProps = state => {
  return {
    loading: state.loading,
    error: state.error,
    errorContent: state.errorContent,
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

const MainPage = props => {
  useEffect(() => {
    const firstDay = moment(props.selectedDate).startOf("week");
    props.fetchProgramari(firstDay);
    const socket = io.connect("/");
    socket.on("dataFetch", input => {
      props.setProgramari(input);
    });
    socket.on("refresh", input => {
      const data = moment(input, "DDMMY").format();
      props.fetchProgramari(data);
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

  if (props.error) {
    const errorArray = props.errorContent.map(eroare => {
      return <p>{eroare.toString()}</p>;
    });

    return <div>{errorArray}</div>;
  } else {
    return (
      <BrowserRouter>
        <CssBaseline />
        <LoadingOverlay active={props.loading} spinner>
          <div className="appWrapper flex flex-wrap">
            <Switch>
              <Route exact path="/">
                <LeftPanel />
                <div
                  className="panelFiller"
                  style={{ height: "100%", width: "23rem" }}
                ></div>
                <DayPanel />
              </Route>
              <Route path="/week">
                <WeekPanel />
              </Route>
            </Switch>
            <AddAppointment />
          </div>
        </LoadingOverlay>
      </BrowserRouter>
    );
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainPage);
