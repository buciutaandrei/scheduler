//importing React stuff and Custom Components
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  addProgramare,
  handleFormChange,
  toggleAddModal,
  deleteProgramare,
  fetchProgramari,
  fetchEditProgramari
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
import MomentLocaleUtils from "react-day-picker/moment";
import moment from "moment";
import "moment/locale/ro";

const mapDispatchToProps = dispatch => {
  return {
    addProgramare: programare => dispatch(addProgramare(programare)),
    fetchProgramari: programari => dispatch(fetchProgramari(programari)),
    fetchEditProgramari: programari =>
      dispatch(fetchEditProgramari(programari)),
    handleFormChange: formChange => dispatch(handleFormChange(formChange)),
    toggleAddModal: toggleModal => dispatch(toggleAddModal(toggleModal)),
    deleteProgramare: programare => dispatch(deleteProgramare(programare))
  };
};

const mapStateToProps = state => {
  return {
    programari: state.programari,
    selectedProgramare: state.selectedProgramare,
    modalState: state.modalState,
    selectedDate: state.selectedDate,
    adding: state.adding,
    programariEdit: state.programariEdit,
    hoursArray: state.hoursArray
  };
};

const AddAppointment = props => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [freeHoursArray, setFreeHoursArray] = useState([]);

  useEffect(() => {
    props.fetchEditProgramari(props.selectedDate);
    const newDate = new Date(props.selectedDate);
    setSelectedDate(newDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.selectedDate]);

  const {
    nume,
    prenume,
    ora,
    durata,
    medic,
    cabinet
  } = props.selectedProgramare;

  const disabled =
    nume === undefined ||
    nume === "" ||
    prenume === undefined ||
    prenume === "" ||
    ora === undefined ||
    ora === "" ||
    durata === undefined ||
    medic === undefined ||
    cabinet === undefined ||
    cabinet === "";

  const handleDateSelect = event => {
    setSelectedDate(event);
    props.handleFormChange({ cabinet: "" });
    props.fetchEditProgramari(event);
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
    props.programariEdit.map(programare => {
      if (value === programare.cabinet) {
        const startTime = moment(programare.ora, "Hmm").format("HH:mm");
        for (let i = 0; i < programare.durata; i++) {
          const busyHours = moment(startTime, "HH:mm")
            .add(i * 0.5, "h")
            .format("Hmm");
          busyHoursArray = busyHoursArray.concat(Number(busyHours));
        }
      }
      return null;
    });

    if (selectedProgramare.edit) {
      theseHours = [];
      for (let i = 0; i < selectedProgramare.durata; i++) {
        theseHours.push(
          Number(
            moment(selectedProgramare.ora, "Hmm")
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
        label: moment(hour, "Hmm").format("HH:mm"),
        value: moment(hour, "Hmm").format("Hmm")
      };
      availableHoursList.push(item);
      return null;
    });
    setFreeHoursArray(availableHoursList);
  };

  const addProgramare = () => {
    let programare = props.selectedProgramare;
    let index = `${programare.cabinet}${moment(programare.ora, "Hmm").format(
      "HHmm"
    )}`;
    programare = Object.assign({}, programare, {
      index: index,
      selectedDate: selectedDate
    });
    props.handleFormChange({ index: index });
    props.addProgramare(programare);
    props.toggleAddModal(programare);
    setFreeHoursArray([]);
  };

  const programareDelete = () => {
    const { editDate, index } = props.selectedProgramare;
    const payload = Object.assign(
      {},
      { selectedDate: editDate },
      { id: index }
    );
    props.deleteProgramare(payload);
  };

  const submitClick = () => {
    if (props.selectedProgramare.edit) {
      programareDelete();
      setTimeout(() => addProgramare(), 100);
      setTimeout(() => props.fetchEditProgramari(props.selectedDate), 100);
    } else {
      addProgramare();
      setTimeout(() => props.fetchEditProgramari(props.selectedDate), 100);
    }
  };

  const doctorList = [
    { label: "Dr. A", value: "red" },
    { label: "Dr. B", value: "green" },
    { label: "Dr. C", value: "blue" }
  ];
  const cabinetList = [
    { label: "Cabinet 1", value: "1" },
    { label: "Cabinet 2", value: "2" },
    { label: "Cabinet 3", value: "3" }
  ];
  const durataList = [
    { label: "30 min", value: "1" },
    { label: "1 ora", value: "2" },
    { label: "1 ora si 30 min", value: "3" },
    { label: "2 ore", value: "4" }
  ];

  const { modalState, toggleAddModal, selectedProgramare } = props;

  return (
    <div>
      <Modal
        open={modalState}
        toggle={() => toggleAddModal(selectedProgramare)}
        size="lg"
      >
        <ModalHeader>Programare</ModalHeader>
        <ModalBody style={{ padding: "0" }}>
          <div className="addAppointmentForm pv5">
            <div>
              <DayPicker
                localeUtils={MomentLocaleUtils}
                locale="ro"
                selectedDays={selectedDate}
                onDayClick={event => handleDateSelect(event)}
                disabledDays={{ daysOfWeek: [0, 6] }}
              />
            </div>
            <div className="flex flex-row" style={{ width: "min-content" }}>
              <div>
                <div className="ma2 mb3">
                  <InputText
                    id="nume"
                    placeholder="Nume"
                    value={selectedProgramare.nume}
                    onChange={handleChange}
                    style={{ width: "200px" }}
                  />
                </div>
                <div className="ma2 mb3">
                  <InputText
                    id="prenume"
                    placeholder="Prenume"
                    value={selectedProgramare.prenume}
                    onChange={handleChange}
                    style={{ width: "200px" }}
                  />
                </div>
                <div className="ma2 mb3">
                  <InputText
                    id="telefon"
                    placeholder="Telefon"
                    value={selectedProgramare.telefon}
                    onChange={handleChange}
                    style={{ width: "200px" }}
                  />
                </div>
              </div>
              <div>
                <Dropdown
                  id="medic"
                  value={selectedProgramare.medic}
                  options={doctorList}
                  onChange={handleChange}
                  placeholder="Alege medicul"
                  className="ma2"
                  style={{ width: "200px" }}
                />
                <Dropdown
                  id="cabinet"
                  value={selectedProgramare.cabinet}
                  options={cabinetList}
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
                  value={selectedProgramare.ora}
                  options={freeHoursArray}
                  onChange={handleChange}
                  placeholder="Alege ora"
                  className="ma2"
                  style={{ width: "200px" }}
                />
                <Dropdown
                  id="durata"
                  value={selectedProgramare.durata}
                  options={durataList}
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
            disabled={disabled}
            onClick={submitClick}
          >
            Save
          </Button>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddAppointment);
