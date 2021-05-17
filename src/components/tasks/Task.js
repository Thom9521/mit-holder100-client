import React, { useState } from 'react';

// Reactstrap component
import { Row, Col, Tooltip } from 'reactstrap';

// Fontawesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfinity } from '@fortawesome/free-solid-svg-icons';

const Task = (props) => {
  const { id, name, due_date, status } = props.task; // Destructuring
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const toggle = () => setTooltipOpen(!tooltipOpen);

  var deadlineColor = '';
  if (due_date !== null) {
    var deadline = new Date(parseInt(due_date));
    var deadlineFormat = deadline.toISOString().slice(0, 10).toString();
    if (deadline <= new Date()) {
      deadlineColor = 'red';
    }
  }

  return (
    <div className="taskDiv listHeader mb-3">
      <Row>
        <Col className="col-10">
          <h5>{name}</h5>
          <p style={{ color: deadlineColor }}>
            {due_date !== null
              ? 'Deadline: ' + deadlineFormat
              : 'Ingen deadline'}
          </p>
        </Col>
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
      </Row>
    </div>
  );
};
export default Task;
