import React, { useEffect, useState } from "react";
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
import {
  deleteAppointment,
  toggleAddModal,
  setAppointments,
  setAppointmentsEdit,
  fetchAppointments,
  selectDate,
  setZileLibere
} from "../../actions/index";
import dayjs from "dayjs";
import ro from "dayjs/locale/ro";
import DoctorSchedule from "../../Components/DoctorSchedule/DoctorSchedule";
dayjs.locale(ro);

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
    deleteAppointment: appointment => dispatch(deleteAppointment(appointment)),
    toggleAddModal: toggleModal => dispatch(toggleAddModal(toggleModal)),
    setAppointments: appointments => dispatch(setAppointments(appointments)),
    setAppointmentsEdit: appointments =>
      dispatch(setAppointmentsEdit(appointments)),
    fetchAppointments: appointments =>
      dispatch(fetchAppointments(appointments)),
    selectDate: date => dispatch(selectDate(date))
  };
};

const MainPage = props => {
  useEffect(() => {
    const firstDay = dayjs(props.selectedDate).startOf("week");
    props.fetchAppointments(firstDay);

    const socket = io.connect("/");
    socket.on("dataFetch", input => {
      props.setAppointments(input);
    });
    socket.on("refresh", input => {
      const data = dayjs(input, "DDMMYYYY").format();
      props.fetchAppointments(data);
    });
    socket.on("dataFetchEdit", input => {
      props.setAppointmentsEdit(input);
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
  }, [props.selectedDate]);

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
                <DayPanel />
              </Route>
              <Route path="/week">
                <WeekPanel />
              </Route>
            </Switch>
            <DoctorSchedule />
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
)(React.memo(MainPage));
