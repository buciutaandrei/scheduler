import React from "react";
import "./DatePicker.css";
import DayPicker from "react-day-picker";
import "react-day-picker/lib/style.css";
import { connect } from "react-redux";
import { selectDate } from "../../actions/index";
import { fetchAppointments } from "../../actions/index";
import localeUtils from "../../ro.js";
import dayjs from "dayjs";
import ro from "dayjs/locale/ro";
dayjs.locale(ro);

const mapDispatchToProps = dispatch => {
  return {
    selectDate: selectedDate => dispatch(selectDate(selectedDate)),
    fetchAppointments: appointment => dispatch(fetchAppointments(appointment))
  };
};

const mapStateToProps = state => {
  return {
    selectedDate: state.selectedDate
  };
};

const DatePicker = props => {
  const handleDateSelect = event => {
    props.selectDate(event);
    props.fetchAppointments(event);
  };

  return (
    <div className="datePickerWrapper">
      <DayPicker
        localeUtils={localeUtils}
        locale="ro"
        selectedDays={new Date(props.selectedDate)}
        onDayClick={event => handleDateSelect(event)}
        disabledDays={{ daysOfWeek: [0, 6] }}
      />
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(DatePicker);
