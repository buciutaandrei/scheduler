import axios from "axios";
import {
  SELECT_PROGRAMARE,
  HANDLE_FORM_CHANGE,
  SELECT_DATE,
  SELECT_EDIT_DATE,
  FETCH_PROGRAMARI_STARTED,
  FETCH_EDIT_PROGRAMARI_STARTED,
  ADD_PROGRAMARE_STARTED,
  DELETE_PROGRAMARE_STARTED,
  TOGGLE_ADD_MODAL,
  ADD_HOURS_ARRAY,
  USER_LOGGING_STARTED,
  USER_LOGGING_SUCCESS,
  USER_LOGGING_ERROR,
  LOGGING_OUT,
  SET_PROGRAMARI,
  SET_PROGRAMARI_EDIT,
  SET_ERROR
} from "../constants/action-types";
import moment from "moment";
import setAuthToken from "../Containers/LoginPage/setAuthToken";
import jwt_decode from "jwt-decode";
import io from "socket.io-client";

let socket = io.connect();

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

export function setProgramari(payload) {
  return { type: SET_PROGRAMARI, payload };
}

export function setProgramariEdit(payload) {
  return { type: SET_PROGRAMARI_EDIT, payload };
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

export function deleteProgramare(payload) {
  return dispatch => {
    dispatch({ type: DELETE_PROGRAMARE_STARTED });
    socket.emit("deleteItems", payload);
  };
}

export function addProgramare(payload) {
  return dispatch => {
    dispatch({ type: ADD_PROGRAMARE_STARTED });
    socket.emit("addItems", payload);
  };
}

export function selectProgramare(payload) {
  return { type: SELECT_PROGRAMARE, payload };
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

export function fetchProgramari(payload) {
  return dispatch => {
    dispatch({ type: FETCH_PROGRAMARI_STARTED });
    const collection = moment(payload).format("DDMMY");
    socket.emit("fetchItems", collection);
  };
}

export function fetchEditProgramari(payload) {
  return dispatch => {
    dispatch({ type: FETCH_EDIT_PROGRAMARI_STARTED });
    const collection = moment(payload).format("DDMMY");
    socket.emit("fetchEditItems", collection);
  };
}
