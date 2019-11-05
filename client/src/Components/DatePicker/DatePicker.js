import React from "react";
import "./DatePicker.css";
import DayPicker from "react-day-picker";
import "react-day-picker/lib/style.css";
import MomentLocaleUtils from "react-day-picker/moment";
import { connect } from "react-redux";
import { selectDate } from "../../actions/index";
import { fetchProgramari } from "../../actions/index";

const mapDispatchToProps = dispatch => {
  return {
    selectDate: selectedDate => dispatch(selectDate(selectedDate)),
    fetchProgramari: programare => dispatch(fetchProgramari(programare))
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
    props.fetchProgramari(event);
  };

  return (
    <div className="datePickerWrapper">
      <DayPicker
        localeUtils={MomentLocaleUtils}
        locale="ro"
        selectedDays={props.selectedDate}
        onDayClick={event => handleDateSelect(event)}
        disabledDays={{ daysOfWeek: [0, 6] }}
      />
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DatePicker);
