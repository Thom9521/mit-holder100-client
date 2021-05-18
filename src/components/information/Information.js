import React from 'react';
import { useLocation } from 'react-router';
import './Information.css';

const Information = () => {

  const state = useLocation();

  var linkDescription, linkLink;


  for (let i = 0; i < state.state.custom_fields.length; i++) {
    if (state.state.custom_fields[i].id === "cf9399cf-53e7-41fa-ae9b-7ce2c285151c") {
      linkDescription = state.state.custom_fields[i].value;
    }
    if (state.state.custom_fields[i].id === "afcce534-65c2-4aa6-a98a-b858418b74e8") {
      linkLink = state.state.custom_fields[i].value;
    }

  }

  return (
    <div className="contentWrapper contentCenter homeContainerContainer">
      <h4>{state.state.name}</h4>
      <p className="linkDescription">{linkDescription}</p>
      <iframe className="iFrameStyles" src={linkLink} title={state.state.name} allowFullScreen height="630px"></iframe>
    </div>);
};
export default Information;
