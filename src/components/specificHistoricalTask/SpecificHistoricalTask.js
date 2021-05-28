import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import axios from 'axios';
import globalConsts from '../../globalConsts';
import Loader from 'react-loader-spinner';

const SpecificHistoricalTask = () => {
  const { state } = useLocation();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  if (state.task.due_date !== null) {
    // Getting the date with the 'due_date' from the task
    var deadline = new Date(parseInt(state.task.due_date));
    // Getting the right date format
    var deadlineFormat = deadline.toISOString().slice(0, 10).toString();
  }

  // Local variables
  var taskDescription = '';

  // Loopes through the custom fields to get 'Kundens opgave'
  for (let i = 0; i < state.task.custom_fields.length; i++) {
    if (state.task.custom_fields[i].id === 'fb7b15c6-e8d8-4643-9bb4-d6464763b2d0') {
      taskDescription = state.task.custom_fields[i].value;
    }
  }
  useEffect(() => {
    setLoading(true);
    axios({
      method: 'GET',
      url: `${globalConsts[0]}/tasks/getTaskComments.php?taskId=${state.task.id}`,
    })
      .then((response) => {
        setComments(response.data.comments.reverse());
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [state.task.id]);

  return (
    <div className="contentWrapper contentCenter contentMarginVertical">
      {loading ? (
        <div className="contentCenter centerHorizontal mt-5">
          <Loader type="TailSpin" color="#ff9414" height={80} width={80} />
        </div>
      ) : (
        <div className="taskWrapper listHeader">
          <div className="taskContent">
            <h5>{state.task.name}</h5>
            <p className="taskDeadline">
              {/*Showing depending the deadline */}
              {state.task.due_date !== null
                ? 'Deadline: ' + deadlineFormat
                : 'Ingen deadline'}
            </p>
            <p className="taskDescription">{taskDescription}</p>
          </div>
          {/*If the array of files is not empty */}
          {comments !== '' &&
            // Maps through the array of files and shows a div for each one
            comments.map((comment, index) => (
              <div key={index} className="taskContent mt-3">
                <h5>Materiale {index + 1}</h5>
                <p className="taskDescription">{comment.comment[0].text}</p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
export default SpecificHistoricalTask;
