import React from 'react';

const Task = (props) => {
  const { name, due_date } = props.task;
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
      <h5>{name}</h5>
      <p style={{ color: deadlineColor }}>
        {due_date !== null ? 'Deadline: ' + deadlineFormat : 'Ingen deadline'}
      </p>
    </div>
  );
};
export default Task;
