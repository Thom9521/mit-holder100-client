import React, { useState } from 'react';
import { useLocation } from 'react-router';
import './EmbeddedLinks.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

import { Row, Col, Tooltip } from 'reactstrap';

// Component that renderes the embedded links
const EmbeddedLinks = () => {

  // State parsed with navigation link
  const state = useLocation();

  // States with React Hooks
  const [tooltipOpen, setTooltipOpen] = useState(false);

  // Toggles tooltip
  const toggle = () => setTooltipOpen(!tooltipOpen);

  // Local variables
  var linkDescription, linkLink;


  for (let i = 0; i < state.state.custom_fields.length; i++) {
    // Checks if id is the id of the "link beskrivelse" custom field
    if (state.state.custom_fields[i].id === "cf9399cf-53e7-41fa-ae9b-7ce2c285151c") {
      linkDescription = state.state.custom_fields[i].value;
    }
    // Checks if id is the id of the "link" custom field
    if (state.state.custom_fields[i].id === "afcce534-65c2-4aa6-a98a-b858418b74e8") {
      linkLink = state.state.custom_fields[i].value;
    }
  }

  var iFrameHeight = 0;
  if (window.innerHeight < 600) {
    iFrameHeight = window.innerHeight / 1.68;
  }
  else if (window.innerHeight < 650) {
    iFrameHeight = window.innerHeight / 1.56;
  }
  else if (window.innerHeight < 700) {
    iFrameHeight = window.innerHeight / 1.53;
  }
  else if (window.innerHeight < 750) {
    iFrameHeight = window.innerHeight / 1.49;
  }
  else if (window.innerHeight < 800) {
    iFrameHeight = window.innerHeight / 1.44;
  }
  else if (window.innerHeight < 900) {
    iFrameHeight = window.innerHeight / 1.4;
  } else if (window.innerWidth < 991) {
    iFrameHeight = window.innerHeight / 1.35;
  } else {
    iFrameHeight = window.innerHeight / 1.27;
  }

  return (
    <div className="contentWrapper contentCenter linkContainer">
      <div className="embeddedContent">
        <Row className="headerPadding">
          <Col >
            <h4 >{state.state.name}</h4>
          </Col>
          <Col className="d-flex justify-content-end col-2">
            <FontAwesomeIcon
              id="iconToolTip"
              className="fontAwesomeIconEmbeddedLink"
              icon={faInfoCircle}
            ></FontAwesomeIcon>
            <Tooltip
              placement="left"
              isOpen={tooltipOpen}
              target='iconToolTip'
              toggle={toggle}
            >
              {linkDescription}
            </Tooltip>
          </Col>
        </Row>
        {/* <p className="linkDescription">{linkDescription}</p> */}

        <iframe className="iFrameStyles" src={linkLink} title={state.state.name} allowFullScreen height={iFrameHeight}></iframe>
      </div>
    </div>
  );
};
export default EmbeddedLinks;
