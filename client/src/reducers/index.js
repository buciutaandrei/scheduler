import {
  SELECT_PROGRAMARE,
  HANDLE_FORM_CHANGE,
  SELECT_DATE,
  SELECT_EDIT_DATE,
  FETCH_PROGRAMARI_SUCCESS,
  FETCH_PROGRAMARI_STARTED,
  FETCH_EDIT_PROGRAMARI_SUCCESS,
  FETCH_EDIT_PROGRAMARI_STARTED,
  ADD_PROGRAMARE_SUCCESS,
  ADD_PROGRAMARE_STARTED,
  DELETE_PROGRAMARE_STARTED,
  DELETE_PROGRAMARE_SUCCESS,
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

const initialState = {
  modalState: false,
  deleting: false,
  adding: false,
  loading: true,
  selectedDate: new Date(),
  formChange: {},
  selectedProgramare: { nume: "", prenume: "", telefon: "" },
  programari: [],
  loggedIn: false,
  loginErrors: {},
  programariEdit: [],
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
          { selectedProgramare: action.payload },
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
    case DELETE_PROGRAMARE_STARTED: {
      return Object.assign({}, state, { deleting: true });
    }
    case DELETE_PROGRAMARE_SUCCESS: {
      return Object.assign({}, state, { deleting: false });
    }
    case ADD_PROGRAMARE_STARTED: {
      return Object.assign({}, state, { adding: true });
    }
    case SELECT_PROGRAMARE: {
      return Object.assign({}, state, {
        selectedProgramare: action.payload
      });
    }
    case HANDLE_FORM_CHANGE: {
      const oldState = state.selectedProgramare;
      const newState = Object.assign({}, oldState, action.payload);

      return Object.assign({}, state, { selectedProgramare: newState });
    }

    case SELECT_DATE: {
      return Object.assign({}, state, { selectedDate: action.payload });
    }

    case FETCH_PROGRAMARI_SUCCESS: {
      return Object.assign(
        {},
        state,
        { programari: action.payload },
        { loading: false }
      );
    }

    case FETCH_PROGRAMARI_STARTED: {
      return Object.assign({}, state, { loading: true });
    }

    case FETCH_EDIT_PROGRAMARI_SUCCESS: {
      return Object.assign({}, state, { programariEdit: action.payload });
    }

    case FETCH_EDIT_PROGRAMARI_STARTED: {
      return Object.assign({}, state);
    }

    case ADD_HOURS_ARRAY: {
      const newState = Object.assign({}, state, { hoursArray: "" });
      return Object.assign({}, newState, { hoursArray: action.payload });
    }

    case ADD_PROGRAMARE_SUCCESS: {
      return Object.assign({}, state, {
        adding: false
      });
    }

    case SET_ERROR: {
      return Object.assign({}, state, {
        error: true,
        errorContent: action.payload
      });
    }

    case SET_PROGRAMARI: {
      return Object.assign(
        {},
        state,
        { programari: action.payload },
        { loading: false }
      );
    }

    case SET_PROGRAMARI_EDIT: {
      return Object.assign({}, state, { programariEdit: action.payload });
    }

    default:
      return state;
  }
}
export default rootReducer;
