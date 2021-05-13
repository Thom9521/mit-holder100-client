import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import './Menu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList } from '@fortawesome/free-solid-svg-icons';
// import { faCalenderCheck } from '@fortawesome/free-solid-svg-icons'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faPhoneAlt } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router-dom';

// Reactstrap components
import { List, Row, Col } from 'reactstrap';

const Menu = () => {
  const history = useHistory();

  const [chosenCompany, setChosenCompany] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location = '/';
  };
  const handleChosenCompany = (childData) => {
    setChosenCompany(childData);
    if (window.location.href.includes('/tasks')) {
      history.push('/tasks', childData);
    }
  };

  return (
    <div className="listContainer">
      <div className="headerContainer">
        {/* {userCompanies != '' && <Header userCompanies={userCompanies} />} */}
        <Header chosenCompany={handleChosenCompany} />
      </div>

      <List className="listMenu container" type="unstyled">
        {/* <div className="mainSection"> */}
        <li className="listItem">
          <Link to={{ pathname: '/tasks', state: chosenCompany }}>
            {/* to={{ pathname: `task/${task.id}`, state: task }} */}

            <Row className="listRow">
              <Col className="listCol">
                <FontAwesomeIcon
                  className="fontAwesomeIconMenu"
                  icon={faClipboardList}
                ></FontAwesomeIcon>
              </Col>
              <Col className="listColText">Opgaver</Col>
            </Row>
          </Link>
        </li>
        <li className="listItem">
          <Link to={'/information'}>
            <Row className="listRow">
              <Col className="listCol">
                <FontAwesomeIcon
                  className="fontAwesomeIconMenu"
                  icon={faInfoCircle}
                ></FontAwesomeIcon>
              </Col>
              <Col className="listColText">Information</Col>
            </Row>
          </Link>
        </li>

        <li className="listItem">
          <Link to={'/change-password'}>
            <Row className="listRow">
              <Col className="listCol">
                <FontAwesomeIcon
                  className="fontAwesomeIconMenu"
                  icon={faKey}
                ></FontAwesomeIcon>
              </Col>
              <Col className="listColText">Skift adgangskode</Col>
            </Row>
          </Link>
        </li>
        <li className="listItem" onClick={handleLogout}>
          <Row className="listRow">
            <Col className="listCol">
              <FontAwesomeIcon
                className="fontAwesomeIconMenu"
                icon={faSignOutAlt}
              ></FontAwesomeIcon>
            </Col>
            <Col className="listColText">Log ud</Col>
          </Row>
        </li>
        {/* </div> */}
        <div className="contactSection">
          <li className="listHeader">
            <h5>Kontakt os</h5>
          </li>
          <li className="listItem">
            <a href="mailto:info@holder100.dk">
              <Row>
                <Col className="listCol">
                  <FontAwesomeIcon
                    className="fontAwesomeIconMenu"
                    icon={faEnvelope}
                  ></FontAwesomeIcon>
                </Col>
                <Col>info@holder100.dk</Col>
              </Row>
            </a>
          </li>
          <li className="listItem">
            <a href="tel:33607608">
              <Row>
                <Col className="listCol">
                  <FontAwesomeIcon
                    className="fontAwesomeIconMenu"
                    icon={faPhoneAlt}
                  ></FontAwesomeIcon>
                </Col>
                <Col>33 607 608</Col>
              </Row>
            </a>
          </li>
        </div>
      </List>
    </div>
  );
};
export default Menu;
