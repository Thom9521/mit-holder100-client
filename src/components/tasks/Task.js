import React, { useState } from 'react';

const Task = (props) => {
    const { id, name, description, due_date } = props.task;
    var dateColor = "";
    if (due_date !== null) {
        var deadline = new Date(parseInt(due_date));
        var deadlineFormat = deadline.toISOString().slice(0, 10).toString();
        if (deadline <= new Date()) {
            dateColor = "red";
        }
    }

    return (
        <div className="taskDiv listHeader mb-3">
            <h5>{name}</h5>
            <p style={{ color: dateColor }}>
                {due_date !== null ? "Deadline: " + deadlineFormat : "Ingen deadline"}
            </p>

        </div>
    )
}
export default Task;