import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loader from 'react-loader-spinner';
import globalConsts from '../../globalConsts';
import Task from './Task';
import HistoricalTasks from './HistoricalTasks';
import './Tasks.css';
import { useLocation } from 'react-router';

// Component that renderes the list of tasks
const Tasks = () => {
  // Destructuring the state from the navigation
  const { state } = useLocation();

  // States with React Hooks
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noTasks, setNoTasks] = useState(false);

  var theState = state;

  // useEffect with React Hooks. Runs when the component has mounted
  useEffect(() => {
    let isMounted = true;

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
          if (isMounted) {
            // GET request that gets the tasks depending of the user
            axios({
              method: 'get',
              url: `${globalConsts[0]}/tasks/getTasks.php?clickUpClientId=${response.data.acf.user_fields_click_up_id}&clickUpCompanies=${response.data.acf.user_fields_companies}`,
              headers: headers,
            })
              .then((response) => {
                if (isMounted) {
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
                }
              })
              .catch((error) => {
                console.log(error);
                setLoading(false);
                setNoTasks(true);
              });
          } else {
            setNoTasks(true);
            setLoading(false);
          }
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        setNoTasks(true);
      });
    return () => {
      isMounted = false;
    };
    // Clean up. When left empty this useEffect will only be called once
  }, []);

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

  if (loading || theState === undefined) {
    return (
      <div className="contentCenter centerHorizontal spinnerStyles">
        <Loader type="TailSpin" color="#ff9414" height={80} width={80} />
      </div>
    );
  } else {
    return (
      <div className="contentWrapper contentCenter homeContainerContainer">
        <h4>Opgaver</h4>
        {/*Shows if there are no tasks */}
        {noTasks ? (
          <p>Du har ingen tilgængelige opgaver.</p>
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
                    pathname: `task/${task.id}`,
                    state: { task: task, companyState: theState },
                  }}
                  className="taskLink"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <Task key={task.id} task={task} />
                </Link>
              )
          )
        )}
        {showingTasks === 0 && checkedTasks === tasks.length && (
          <p>Du har ingen tilgængelige opgaver</p>
        )}
        {theState !== undefined && <HistoricalTasks theState={theState} />}
      </div>
    );
  }
};
export default Tasks;
