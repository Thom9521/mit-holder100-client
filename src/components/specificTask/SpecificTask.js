import React from 'react';
import './SpecificTask.css';
import { useLocation } from 'react-router';

import { Button } from 'reactstrap';

const SpecificTask = () => {
  const { state } = useLocation();
  // console.log(state);

  var deadlineColor = '';
  if (state.due_date !== null) {
    var deadline = new Date(parseInt(state.due_date));
    var deadlineFormat = deadline.toISOString().slice(0, 10).toString();
    if (deadline <= new Date()) {
      deadlineColor = 'red';
    }
  }

  return (
    <div className="contentWrapper contentCenter ">
      <div className="taskWrapper listHeader">
        <div className="taskContent">
          <h5>{state.name}</h5>
          <p className="taskDeadline" style={{ color: deadlineColor }}>
            {state.due_date !== null
              ? 'Deadline: ' + deadlineFormat
              : 'Ingen deadline'}
          </p>
          <p className="taskDescription">{state.description}</p>
        </div>
        <div className="taskButtonDiv">
          <Button className="taskButton">Upload</Button>
          <Button className="taskButton">Næste</Button>
        </div>
      </div>
    </div>
  );
};
export default SpecificTask;
