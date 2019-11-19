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

const initialState = {
  modalState: false,
  deleting: false,
  adding: false,
  loading: false,
  selectedDate: new Date(),
  formChange: {},
  selectedAppointment: { name: "", firstName: "", telefon: "" },
  appointments: [],
  loggedIn: false,
  loginErrors: {},
  appointmentsEdit: [],
  error: false
};

function rootReducer(state = initialState, action) {
  if (typeof state === "undefined") {
    state = initialState;
  }

  switch (action.type) {
    case LOGGING_OUT: {
      return Object.assign({}, state, { loggedIn: false });
    }

    case SELECT_EDIT_DATE: {
      return Object.assign({}, state, action.payload);
    }

    case TOGGLE_ADD_MODAL: {
      if (action.payload !== undefined) {
        return Object.assign(
          {},
          state,
          { selectedAppointment: action.payload },
          { modalState: !state.modalState }
        );
      } else {
        return Object.assign({}, state, { modalState: !state.modalState });
      }
    }

    case USER_LOGGING_STARTED: {
      return Object.assign({}, state, action.payload);
    }
    case USER_LOGGING_SUCCESS: {
      return Object.assign({}, state, { loggedIn: true });
    }
    case USER_LOGGING_ERROR: {
      return Object.assign({}, state, { loginErrors: action.payload });
    }
    case DELETE_APPOINTMENT_STARTED: {
      return Object.assign({}, state, { deleting: true });
    }

    case ADD_APPOINTMENT_STARTED: {
      return Object.assign({}, state, { adding: true });
    }
    case SELECT_APPOINTMENT: {
      return Object.assign({}, state, {
        selectedAppointment: action.payload
      });
    }
    case HANDLE_FORM_CHANGE: {
      const oldState = state.selectedAppointment;
      const newState = Object.assign({}, oldState, action.payload);

      return Object.assign({}, state, { selectedAppointment: newState });
    }

    case SELECT_DATE: {
      return Object.assign({}, state, { selectedDate: action.payload });
    }

    case FETCH_APPOINTMENTS_STARTED: {
      return Object.assign({}, state, { loading: true });
    }

    case FETCH_EDIT_APPOINTMENTS_STARTED: {
      return Object.assign({}, state);
    }

    case ADD_HOURS_ARRAY: {
      const newState = Object.assign({}, state, { hoursArray: "" });
      return Object.assign({}, newState, { hoursArray: action.payload });
    }

    case SET_ERROR: {
      return Object.assign({}, state, {
        error: true,
        errorContent: action.payload
      });
    }

    case SET_APPOINTMENTS: {
      return Object.assign(
        {},
        state,
        { appointments: action.payload },
        { loading: false }
      );
    }

    case SET_APPOINTMENTS_EDIT: {
      return Object.assign({}, state, { appointmentsEdit: action.payload });
    }

    default:
      return state;
  }
}
export default rootReducer;
