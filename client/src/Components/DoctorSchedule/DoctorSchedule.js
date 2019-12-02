import React, { useState, useEffect } from "react";
import { Button, Modal, ModalBody, ModalHeader } from "shards-react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import "primereact/resources/themes/nova-light/theme.css";
import "primereact/resources/primereact.min.css";
import DayPicker, { DateUtils } from "react-day-picker";
import "react-day-picker/lib/style.css";
import localeUtils from "../../ro.js";
import dayjs from "dayjs";
import ro from "dayjs/locale/ro";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
dayjs.locale(ro);

const DoctorSchedule = props => {
  const [modalState, toggleModal] = useState(true);
  const [selectedDoctor, selectDoctor] = useState("");
  const [dateArray, setDateArray] = useState({
    from: undefined,
    to: undefined
  });
  const [zileLibere, setZileLibere] = useState({});

  useEffect(() => {}, []);

  const doctorList = [
    { label: "Dr. A", value: "red" },
    { label: "Dr. B", value: "green" },
    { label: "Dr. C", value: "blue" }
  ];

  const programDrA = [
    {
      from: "10122019",
      to: "17122019",
      beginHour: "830",
      endHour: "1230"
    },
    {
      from: "18122019",
      to: "21122019",
      beginHour: "1230",
      endHour: "1930"
    },
    {
      from: "22122019",
      to: "25122019",
      beginHour: "830",
      endHour: "1230"
    }
  ];

  const handleDateSelect = event => {
    const range = DateUtils.addDayToRange(event, dateArray);
    setDateArray(range);
  };

  const from = dateArray.from;
  const to = dateArray.to;

  return (
    <Modal open={modalState} toggle={() => toggleModal(!modalState)}>
      <ModalHeader>Program Medici</ModalHeader>
      <ModalBody>
        <div>
          <div style={{ display: "flex", direction: "column" }}>
            <Dropdown
              id="medic"
              value={selectedDoctor}
              options={doctorList}
              onChange={event => selectDoctor(event.value)}
              placeholder="Alege medicul"
              className="ma2"
              style={{ width: "200px" }}
            />
            <DayPicker
              localeUtils={localeUtils}
              locale="ro"
              selectedDays={[from, { from, to }]}
              modifiers={{ start: from, end: to }}
              onDayClick={handleDateSelect}
              disabledDays={{ daysOfWeek: [0, 6] }}
            />
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default DoctorSchedule;
