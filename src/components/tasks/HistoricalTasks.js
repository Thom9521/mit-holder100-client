import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loader from 'react-loader-spinner';
import globalConsts from '../../globalConsts';
import HistoricalTask from './HistoricalTask';
import { Button } from 'reactstrap';

const HistoricalTasks = (props) => {
  const { theState } = props;

  // States with React Hooks
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noTasks, setNoTasks] = useState(false);
  const [historicalTasksFetched, setHistoricalTasksFetched] = useState(false);

  const handleHistroicalTasks = () => {
    setHistoricalTasksFetched(true);
    const wordPressId = localStorage.getItem('ID');
    const token = localStorage.getItem('token');

    const tokenHeader = 'Bearer ' + token;
    // Headers for the GET request
    const headers = {
      'Content-Type': 'application/json',
      Authorization: tokenHeader,
    };
    // GET request that the logged in user
    axios({
      method: 'get',
      url: `${globalConsts[0]}/wordpress/wp-json/wp/v2/users/${wordPressId}`,
      headers: headers,
    })
      .then((response) => {
        if (response.status === 200) {
          // GET request that gets the tasks depending of the user
          axios({
            method: 'get',
            url: `${globalConsts[0]}/tasks/getHistoricalTasks.php?clickUpClientId=${response.data.acf.user_fields_click_up_id}&clickUpCompanies=${response.data.acf.user_fields_companies}`,
            headers: headers,
          })
            .then((response) => {
              if (response.data.length <= 0) {
                setNoTasks(true);
                setLoading(false);
              } else {
                // Sorting task array by date
                var byDate = response.data.slice(0);
                byDate.sort((a, b) => {
                  return a.due_date - b.due_date;
                });
                // eslint-disable-next-line
                byDate.sort((a, b) => {
                  if (a.due_date === null || b.due_date === null) {
                    return b.due_date - a.due_date;
                  }
                });
                setTasks(byDate);
                setLoading(false);
              }
            })
            .catch((error) => {
              console.log(error);
              setLoading(false);
              setNoTasks(true);
            });
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        setNoTasks(true);
      });
  };

  var showingTasks = 0;
  var checkedTasks = 0;
  // Handles the showing of tasks depending of the dropdown value
  const showTasksForChosenCompany = (state, task) => {
    var taskCompanyId = '';
    var companyId = '';
    checkedTasks++;
    // If the task has a "kunde" value and the state is set
    if (task.custom_fields[0].value[0] && state) {
      companyId = state.id;
      taskCompanyId = task.custom_fields[0].value[0].id;

      // If the companyId on the dropdown is equal to the task "kunde" field or the dropdown value is set to 0
      if (companyId === taskCompanyId || companyId === '0') {
        showingTasks++;
        return true;
      } else {
        return false;
      }
    }
    // If the task doesnt have a "kunde" and the dropdown value is set to all
    else if (task.custom_fields[0].value[0] === undefined && state.id === '0') {
      showingTasks++;
      return true;
    }
  };
  if (!historicalTasksFetched) {
    return (
      <div className="taskButtonDiv">
        <Button
          id="submitButton"
          className="submitBtn"
          onClick={handleHistroicalTasks}
        >
          Se løste opgaver
        </Button>
      </div>
    );
  } else {
    if (loading || theState === undefined) {
      return (
        <div className="contentCenter centerHorizontal mt-5">
          <Loader type="TailSpin" color="#ff9414" height={80} width={80} />
        </div>
      );
    } else {
      return (
        <div>
          <h4 className="mt-5">Løste opgaver</h4>
          {/*Shows if there are no tasks */}
          {noTasks ? (
            <p>Du har ingen løste opgaver</p>
          ) : (
            // Shows if there are tasks
            // Mapping through the tasks and returns a Link for each one.
            tasks.map(
              (task) =>
                // Checking the task with the showTasksForChosenCompany method
                showTasksForChosenCompany(theState, task) && (
                  <Link
                    key={task.id}
                    to={{
                      pathname: `historical-task/${task.id}`,
                      state: { task: task, companyState: theState },
                    }}
                    className="taskLink"
                    onClick={() => window.scrollTo(0, 0)}
                  >
                    <HistoricalTask key={task.id} task={task} />
                  </Link>
                )
            )
          )}
          {showingTasks === 0 && checkedTasks === tasks.length && (
            <p>Du har ingen løste opgaver</p>
          )}
        </div>
      );
    }
  }
};
export default HistoricalTasks;
