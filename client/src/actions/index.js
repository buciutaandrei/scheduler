import axios from "axios";
import {
  SELECT_APPOINTMENT,
  HANDLE_FORM_CHANGE,
  SELECT_DATE,
  SELECT_EDIT_DATE,
  FETCH_APPOINTMENTS_STARTED,
  FETCH_EDIT_APPOINTMENTS_STARTED,
  ADD_APPOINTMENT_STARTED,
  DELETE_APPOINTMENT_STARTED,
  TOGGLE_ADD_MODAL,
  ADD_HOURS_ARRAY,
  USER_LOGGING_STARTED,
  USER_LOGGING_SUCCESS,
  USER_LOGGING_ERROR,
  LOGGING_OUT,
  SET_APPOINTMENTS,
  SET_APPOINTMENTS_EDIT,
  SET_ERROR
} from "../constants/action-types";
import setAuthToken from "../Containers/LoginPage/setAuthToken";
import jwt_decode from "jwt-decode";
import io from "socket.io-client";
import dayjs from "dayjs";
import ro from "dayjs/locale/ro";
dayjs.locale(ro);

let socket = io.connect("/");

export function userLogging(payload) {
  return dispatch => {
    dispatch({ type: USER_LOGGING_STARTED });
    axios
      .post(`/api/users/login`, payload)
      .then(res => {
        const { token } = res.data;
        localStorage.setItem("jwtToken", token);
        setAuthToken(token);
        const decoded = jwt_decode(token);
        dispatch({ type: USER_LOGGING_SUCCESS, payload: decoded });
      })
      .catch(err =>
        dispatch({ type: USER_LOGGING_ERROR, payload: err.response.data })
      );
  };
}

export function setError(payload) {
  return { type: SET_ERROR, payload };
}

export function setAppointments(payload) {
  return { type: SET_APPOINTMENTS, payload };
}

export function setAppointmentsEdit(payload) {
  return { type: SET_APPOINTMENTS_EDIT, payload };
}

export function setUser(payload) {
  return { type: USER_LOGGING_SUCCESS, payload };
}

export function loggingOut(payload) {
  localStorage.removeItem("jwtToken");
  setAuthToken(false);
  return { type: LOGGING_OUT, payload };
}

export function toggleAddModal(payload) {
  return { type: TOGGLE_ADD_MODAL, payload };
}

export function selectEditDate(payload) {
  return { type: SELECT_EDIT_DATE, payload };
}

export function deleteAppointment(payload) {
  return dispatch => {
    dispatch({ type: DELETE_APPOINTMENT_STARTED });
    socket.emit("deleteItems", payload);
  };
}

export function addAppointment(payload) {
  return dispatch => {
    dispatch({ type: ADD_APPOINTMENT_STARTED });
    socket.emit("addItems", payload);
  };
}

export function selectAppointment(payload) {
  return { type: SELECT_APPOINTMENT, payload };
}

export function handleFormChange(payload) {
  return { type: HANDLE_FORM_CHANGE, payload };
}

export function selectDate(payload) {
  return { type: SELECT_DATE, payload };
}

export function addHoursArray(payload) {
  return { type: ADD_HOURS_ARRAY, payload };
}

export function fetchAppointments(payload) {
  return dispatch => {
    dispatch({ type: FETCH_APPOINTMENTS_STARTED });
    const collection = dayjs(payload)
      .startOf("week")
      .format("DDMMYYYY");
    socket.emit("fetchItems", collection);
  };
}

export function fetchEditAppointments(payload) {
  return dispatch => {
    dispatch({ type: FETCH_EDIT_APPOINTMENTS_STARTED });
    const collection = dayjs(payload)
      .startOf("week")
      .format("DDMMYYYY");
    socket.emit("fetchEditItems", collection);
  };
}
