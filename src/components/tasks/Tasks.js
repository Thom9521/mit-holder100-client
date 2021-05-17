import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loader from 'react-loader-spinner';
import globalConsts from '../../globalConsts';
import Task from './Task';
import './Tasks.css';
import { useLocation } from 'react-router';

const Tasks = () => {
  const { state } = useLocation();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noTasks, setNoTasks] = useState(false);
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const wordPressId = localStorage.getItem('ID');
    const token = localStorage.getItem('token');

    const tokenHeader = 'Bearer ' + token;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: tokenHeader,
    };
    axios({
      method: 'get',
      url: `${globalConsts[0]}/wordpress/wp-json/wp/v2/users/${wordPressId}`,
      headers: headers,
    })
      .then((response) => {
        if (isMounted) {
          if (response.status === 200) {
            axios({
              method: 'get',
              url: `${globalConsts[0]}/tasks/getTasks.php?clickUpClientId=${response.data.acf.user_fields_click_up_id}&clickUpCompanies=${response.data.acf.user_fields_companies}`,
              headers: headers,
            })
              .then((response) => {
                if (isMounted) {
                  if (response.data.length <= 0) {
                    setNoTasks(true);
                  }
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

                  // console.log(byDate);
                  setTasks(byDate);
                  setLoading(false);
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
  }, []);

  // handles the showing of tasks depending of the dropdown value
  const showTasksForChosenCompany = (state, task) => {
    var taskCompanyId = '';
    var companyId = '';

    // if the task has a "kunde" value and the state is set
    if (task.custom_fields[0].value[0] && state) {
      companyId = state.id;
      taskCompanyId = task.custom_fields[0].value[0].id;

      // if the companyId on the dropdown is equal to the task "kunde" field or the dropdown value is set to 0
      if (companyId === taskCompanyId || companyId === '0') {
        return true;
      } else {
        return false;
      }
    }
    // if the task doesnt have a "kunde" and the dropdown value is set to all
    else if (task.custom_fields[0].value[0] === undefined && state.id === '0') {
      return true;
    }
  };

  if (loading) {
    return (
      <div className="contentCenter centerHorizontal spinnerStyles">
        <Loader type="TailSpin" color="#ff9414" height={80} width={80} />
      </div>
    );
  } else {
    return (
      <div className="contentWrapper contentCenter homeContainerContainer">
        <h4>Opgaver</h4>
        {noTasks ? (
          <p>Du har ingen tilgængelige opgaver.</p>
        ) : (
          tasks.map(
            (task) =>
              showTasksForChosenCompany(state, task) && (
                <Link
                  key={task.id}
                  to={{
                    pathname: `task/${task.id}`,
                    state: { task: task, companyState: state },
                  }}
                  className="taskLink"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <Task key={task.id} task={task} />
                </Link>
              )
          )
        )}
      </div>
    );
  }
};
export default Tasks;
