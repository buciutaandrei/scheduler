//importing React stuff and Custom Components
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  addAppointment,
  handleFormChange,
  toggleAddModal,
  deleteAppointment,
  fetchAppointments,
  fetchEditAppointments
} from "../../actions/index";
import { hoursArray } from "../DataTables/hoursArray";

//importing styles
import { Button, Modal, ModalBody, ModalHeader } from "shards-react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import "primereact/resources/themes/nova-light/theme.css";
import "primereact/resources/primereact.min.css";
import "./AddAppointment.css";

//importing  DayPicker and Moment
import DayPicker from "react-day-picker";
import "react-day-picker/lib/style.css";
import localeUtils from "../../ro.js";
import dayjs from "dayjs";
import ro from "dayjs/locale/ro";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
dayjs.locale(ro);

const mapDispatchToProps = dispatch => {
  return {
    addAppointment: appointment => dispatch(addAppointment(appointment)),
    fetchAppointments: appointments =>
      dispatch(fetchAppointments(appointments)),
    fetchEditAppointments: appointments =>
      dispatch(fetchEditAppointments(appointments)),
    handleFormChange: formChange => dispatch(handleFormChange(formChange)),
    toggleAddModal: toggleModal => dispatch(toggleAddModal(toggleModal)),
    deleteAppointment: appointment => dispatch(deleteAppointment(appointment))
  };
};

const mapStateToProps = state => {
  return {
    appointments: state.appointments,
    selectedAppointment: state.selectedAppointment,
    modalState: state.modalState,
    selectedDate: state.selectedDate,
    adding: state.adding,
    appointmentsEdit: state.appointmentsEdit,
    hoursArray: state.hoursArray,
    zileLibere: state.zileLibere
  };
};

const AddAppointment = props => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [freeHoursArray, setFreeHoursArray] = useState([]);

  useEffect(() => {
    props.fetchEditAppointments(props.selectedDate);
    const newDate = new Date(props.selectedDate);
    setSelectedDate(newDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.selectedDate]);

  const {
    name,
    firstName,
    ora,
    timespan,
    medic,
    room,
    edit
  } = props.selectedAppointment;

  const deleteDisabled = !edit;
  const saveDisabled =
    name === undefined ||
    name === "" ||
    firstName === undefined ||
    firstName === "" ||
    ora === undefined ||
    ora === "" ||
    timespan === undefined ||
    medic === undefined ||
    room === undefined ||
    room === "";

  const handleDateSelect = event => {
    setSelectedDate(event);
    props.handleFormChange({ room: "" });
    props.fetchEditAppointments(event);
  };

  const handleChange = event => {
    let target = event.target.id;
    let value = event.target.value;
    let payload = { [target]: value };
    props.handleFormChange({ ...payload });
  };

  const busyHours = value => {
    props.handleFormChange({ ora: "" });
    let theseHours = [];
    let busyHoursArray = [0];
    let availableHoursArray = [];
    let availableHoursList = [];
    props.appointmentsEdit.map(appointment => {
      if (
        value === appointment.room &&
        dayjs(selectedDate).format("DDMM") ===
          dayjs(appointment.selectedDate).format("DDMM")
      ) {
        const startTime = dayjs(appointment.ora, "HHmm").format("HH:mm");
        for (let i = 0; i < appointment.timespan; i++) {
          const busyHours = dayjs(startTime, "HH:mm")
            .add(i * 0.5, "h")
            .format("HHmm");
          busyHoursArray = busyHoursArray.concat(busyHours);
        }
      }
      return null;
    });

    if (selectedAppointment.edit) {
      theseHours = [];
      for (let i = 0; i < selectedAppointment.timespan; i++) {
        theseHours.push(
          Number(
            dayjs(selectedAppointment.ora, "HHmm")
              .add(0.5 * i, "h")
              .format("HHmm")
          )
        );
      }
      const temp = new Set(theseHours);
      theseHours = [...new Set([...busyHoursArray].filter(x => !temp.has(x)))];
    }

    const temp = new Set(busyHoursArray);
    availableHoursArray = [
      ...new Set([...hoursArray].filter(x => !temp.has(x)))
    ];

    availableHoursArray.map(hour => {
      const item = {
        label: dayjs(hour, "HHmm").format("HH:mm"),
        value: dayjs(hour, "HHmm").format("HHmm")
      };
      availableHoursList.push(item);
      return null;
    });
    setFreeHoursArray(availableHoursList);
  };

  const addAppointment = () => {
    let appointment = props.selectedAppointment;
    let index = `${dayjs(appointment.selectedDate).format("DD")}${
      appointment.room
    }${dayjs(appointment.ora, "HHmm").format("HHmm")}`;
    appointment = Object.assign({}, appointment, {
      index: index,
      selectedDate: selectedDate
    });
    props.handleFormChange({ index: index });
    props.addAppointment(appointment);
    props.toggleAddModal(appointment);
    setFreeHoursArray([]);
  };

  const appointmentDelete = () => {
    const { editDate, index } = props.selectedAppointment;
    const payload = Object.assign(
      {},
      { selectedDate: editDate },
      { id: index }
    );
    props.deleteAppointment(payload);
  };

  const submitClick = () => {
    if (props.selectedAppointment.edit) {
      appointmentDelete();
      setTimeout(() => addAppointment(), 100);
      setTimeout(() => props.fetchEditAppointments(props.selectedDate), 100);
    } else {
      addAppointment();
      setTimeout(() => props.fetchEditAppointments(props.selectedDate), 100);
    }
  };

  const doctorList = [
    { label: "Dr. A", value: "red" },
    { label: "Dr. B", value: "green" },
    { label: "Dr. C", value: "blue" }
  ];
  const roomList = [
    { label: "Cabinet 1", value: "1" },
    { label: "Cabinet 2", value: "2" },
    { label: "Cabinet 3", value: "3" }
  ];
  const timespanList = [
    { label: "30 min", value: "1" },
    { label: "1 ora", value: "2" },
    { label: "1 ora si 30 min", value: "3" },
    { label: "2 ore", value: "4" }
  ];

  const { modalState, toggleAddModal, selectedAppointment } = props;

  return (
    <div>
      <Modal
        open={modalState}
        toggle={() => toggleAddModal(selectedAppointment)}
        size="lg"
        style={{ zIndex: 10 }}
      >
        <ModalHeader>Appointment</ModalHeader>
        <ModalBody style={{ padding: "0" }}>
          <div className="addAppointmentForm pv5">
            <div>
              <DayPicker
                localeUtils={localeUtils}
                locale="ro"
                selectedDays={selectedDate}
                onDayClick={event => handleDateSelect(event)}
                disabledDays={[...props.zileLibere, { daysOfWeek: [0, 6] }]}
              />
            </div>
            <div className="flex flex-row" style={{ width: "min-content" }}>
              <div>
                <div className="ma2 mb3">
                  <InputText
                    id="name"
                    placeholder="Nume"
                    value={selectedAppointment.name}
                    onChange={handleChange}
                    style={{ width: "200px" }}
                  />
                </div>
                <div className="ma2 mb3">
                  <InputText
                    id="firstName"
                    placeholder="Prenume"
                    value={selectedAppointment.firstName}
                    onChange={handleChange}
                    style={{ width: "200px" }}
                  />
                </div>
                <div className="ma2 mb3">
                  <InputText
                    id="telefon"
                    placeholder="Telefon"
                    value={selectedAppointment.telefon}
                    onChange={handleChange}
                    style={{ width: "200px" }}
                  />
                </div>
              </div>
              <div>
                <Dropdown
                  id="medic"
                  value={selectedAppointment.medic}
                  options={doctorList}
                  onChange={handleChange}
                  placeholder="Alege medicul"
                  className="ma2"
                  style={{ width: "200px" }}
                />
                <Dropdown
                  id="room"
                  value={selectedAppointment.room}
                  options={roomList}
                  onChange={event => {
                    handleChange(event);
                    busyHours(event.target.value);
                  }}
                  placeholder="Alege cabinetul"
                  className="ma2"
                  style={{ width: "200px" }}
                />
                <Dropdown
                  id="ora"
                  value={selectedAppointment.ora}
                  options={freeHoursArray}
                  onChange={handleChange}
                  placeholder="Alege ora"
                  className="ma2"
                  style={{ width: "200px" }}
                />
                <Dropdown
                  id="timespan"
                  value={selectedAppointment.timespan}
                  options={timespanList}
                  onChange={handleChange}
                  placeholder="Alege durata"
                  className="ma2"
                  style={{ width: "200px" }}
                />
              </div>
            </div>
          </div>
          <Button
            style={{ position: "absolute", right: "20px", bottom: "20px" }}
            disabled={saveDisabled}
            onClick={submitClick}
          >
            Save
          </Button>
          <Button
            style={{ position: "absolute", left: "20px", bottom: "20px" }}
            onClick={() => {
              appointmentDelete();
              toggleAddModal();
            }}
            theme="danger"
            disabled={deleteDisabled}
          >
            Delete
          </Button>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(AddAppointment));
