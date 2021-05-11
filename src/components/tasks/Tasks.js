import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loader from 'react-loader-spinner';
import globalConsts from '../../globalConsts';
import Task from './Task';
import './Tasks.css';
import { useLocation } from 'react-router';

const Tasks = (props) => {
  const { state } = useLocation();
  console.log(state);
  // const [clickUpClientId, setClickUpClientId] = useState('');
  // const [clickUpCompanies, setClickUpCompanies] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noTasks, setNoTasks] = useState(false);

  // const handleTasksMenu = () => {
  //   props.selectedMenuPage('Task');
  // };

  useEffect(() => {
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
        if (response.status === 200) {
          axios({
            method: 'get',
            url: `${globalConsts[0]}/tasks/getTasks.php?clickUpClientId=${response.data.acf.user_fields_click_up_id}&clickUpCompanies=${response.data.acf.user_fields_companies}`,
            headers: headers,
          })
            .then((response) => {
              if (response.data.length <= 0) {
                setNoTasks(true);
              }
              setTasks(response.data);
              setLoading(false);
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
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        setNoTasks(true);
      });
  }, []);
  if (loading) {
    return (
      <div className="contentCenter centerHorizontal homeContainer">
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
          tasks.map((task) => (
            <Link
              key={task.id}
              to={{ pathname: `task/${task.id}`, state: task }}
              className="taskLink"
            >
              <Task key={task.id} task={task} />
            </Link>
          ))
        )}
      </div>
    );
  }
};
export default Tasks;
