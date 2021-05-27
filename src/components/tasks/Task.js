import React, { useState } from 'react';

// Reactstrap component
import { Row, Col, Tooltip } from 'reactstrap';

// Fontawesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfinity } from '@fortawesome/free-solid-svg-icons';
import { faUserLock } from '@fortawesome/free-solid-svg-icons';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

// Child component that renderes a single task in the list of tasks
const Task = (props) => {
  const { id, name, due_date, status, custom_fields } = props.task; // Destructuring
  // States with React Hooks
  const [tooltipOpen, setTooltipOpen] = useState(false);

  // Toggles tooltip
  const toggle = () => setTooltipOpen(!tooltipOpen);

  var deadlineColor = '';
  if (due_date !== null) {
    // Getting the date with the 'due_date' from the task
    var deadline = new Date(parseInt(due_date));
    // Getting the right date format
    var deadlineFormat = deadline.toISOString().slice(0, 10).toString();
    if (deadline <= new Date()) {
      deadlineColor = '#ff0f0f';
    }
  }

  var personalTask = false;
  for (let i = 0; i < custom_fields.length; i++) {
    if (
      custom_fields[i].id === '97466020-1ea9-42ce-bdf1-afdcfa21914d' &&
      custom_fields[i].value !== undefined &&
      custom_fields[i].value.length > 0
    ) {
      personalTask = true;
    }
  }

  return (
    <div className="taskDiv listHeader mb-3">
      <Row>
        <Col className="col-10">
          <h5>{name}</h5>
          <p style={{ color: deadlineColor }}>
            {/*Showing depending of the deadline */}
            {due_date !== null
              ? 'Deadline: ' + deadlineFormat
              : 'Ingen deadline'}
            {deadlineColor !== '' && <FontAwesomeIcon

              className="ml-1"
              icon={faExclamationTriangle}
            ></FontAwesomeIcon>}
          </p>
        </Col>
        {/*Shows if the task status is 'modtager data fra kunden' */}
        {status.status === 'modtager data fra kunden' && (
          <Col className="col-2 endlessDataCol">
            <FontAwesomeIcon
              id={id}
              className="fontAwesomeIconTasks"
              icon={faInfinity}
            ></FontAwesomeIcon>
            <Tooltip
              placement="auto"
              isOpen={tooltipOpen}
              target={id}
              toggle={toggle}
            >
              Åben opgave. Her kan altid indsendes materiale.
            </Tooltip>
          </Col>
        )}
        {/*Shows if the task is personal to the user' */}
        {personalTask && (
          <Col className="col-2 endlessDataCol">
            <FontAwesomeIcon
              id={id}
              className="fontAwesomeIconTasks"
              icon={faUserLock}
            ></FontAwesomeIcon>
            <Tooltip
              placement="auto"
              isOpen={tooltipOpen}
              target={id}
              toggle={toggle}
            >
              Personlig opgave. Denne opgave kan kun løses af dig.
            </Tooltip>
          </Col>
        )}
      </Row>
    </div>
  );
};
export default Task;
