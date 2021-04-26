import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from 'react-loader-spinner';
import globalConsts from '../../globalConsts';

const Tasks = () => {
  useEffect(() => {
    // const options = {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization:
    //       '6736916_f6214088e72af5c764e8c970b5aa7063c7dcf32f',
    //   },
    // };
    // console.log(options);
    const headers = {
      'Content-Type': 'application/json',
      Authorization: '6736916_f6214088e72af5c764e8c970b5aa7063c7dcf32f',
    };
    console.log(headers);
    axios({
      method: 'get',
      // url: `${globalConsts[0]}/users/getToken.php`,
      url: 'https://api.clickup.com/api/v2/list/38186322/task',
      headers: headers,
    })
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="contentWrapper contentCenter homeContainerContainer">
      <h4>Opgaver</h4>
    </div>
  );
};
export default Tasks;
