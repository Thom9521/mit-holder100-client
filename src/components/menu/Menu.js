import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import './Menu.css';
import axios from 'axios';
import globalConsts from '../../globalConsts';

// Fontawesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList } from '@fortawesome/free-solid-svg-icons';
// import { faCalenderCheck } from '@fortawesome/free-solid-svg-icons'
// import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faPhoneAlt } from '@fortawesome/free-solid-svg-icons';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { faLink } from '@fortawesome/free-solid-svg-icons';

import { useHistory } from 'react-router-dom';

// Reactstrap components
import {
  List,
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

const Menu = () => {
  const history = useHistory();

  const [chosenCompany, setChosenCompany] = useState({
    id: '0',
    name: 'Alle firmaer',
  });
  const [embeddedLinks, setEmbeddedLinks] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [fetchedLinks, setFetchedLinks] = useState(false);

  const toggle = () => setDropdownOpen(!dropdownOpen);

  useEffect(() => {
    let isMounted = true;
    if (chosenCompany !== '' && !fetchedLinks) {
      axios({
        method: 'GET',
        url: `${globalConsts[0]}/links/getEmbeddedLinks.php?company=${chosenCompany.id}`,
      })
        .then((response) => {
          if (isMounted) {
            setFetchedLinks(true);
            setEmbeddedLinks(response.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [chosenCompany, embeddedLinks, fetchedLinks]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('ID');
    localStorage.removeItem('username');
    localStorage.removeItem('name');
    window.location = '/';
  };
  const handleChosenCompany = (chosenCompanyParam, push) => {
    setChosenCompany(chosenCompanyParam);

    if (window.location.href.includes('/tasks') && push) {
      console.log('test');
      history.push('/tasks', chosenCompanyParam);
    }
  };

  return (
    <div className="listContainer">
      <div className="headerContainer">
        {/* {userCompanies != '' && <Header userCompanies={userCompanies} />} */}
        <Header chosenCompanyHeader={handleChosenCompany} />
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
          <Row className="listRow">
            <Col className="listCol">
              <FontAwesomeIcon
                className="fontAwesomeIconMenu"
                icon={faLink}
              ></FontAwesomeIcon>
            </Col>
            <Col className="listColText">
              {embeddedLinks.length > 0 ? (
                <Dropdown
                  isOpen={dropdownOpen}
                  toggle={toggle}
                  className="dropdownStyles dropdownLinks"
                >
                  <DropdownToggle className="dropdownToggle">
                    Links{' '}
                    <FontAwesomeIcon
                      className="fontAwesomeIconHeader"
                      icon={faCaretDown}
                    ></FontAwesomeIcon>
                  </DropdownToggle>
                  <DropdownMenu>
                    {embeddedLinks.length > 0 &&
                      embeddedLinks.map((embeddedLink, index) =>
                        embeddedLink.custom_fields.map((customField) =>
                          customField.name === 'Link type' &&
                          customField.value === 0 ? (
                            <Link
                              key={customField.id}
                              to={{
                                pathname: `/information/${embeddedLink.id}`,
                                state: embeddedLink,
                              }}
                            >
                              <DropdownItem
                                key={index}
                                className="mb-2 mt-1"
                                name={embeddedLink.name}
                                value={embeddedLink.id}
                              >
                                {embeddedLink.name}
                              </DropdownItem>
                            </Link>
                          ) : (
                            customField.name === 'Link type' &&
                            customField.value === 1 &&
                            embeddedLink.custom_fields.map(
                              (customField2) =>
                                customField2.name === 'Link' && (
                                  <a
                                    key={customField.id}
                                    href={customField2.value}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <DropdownItem
                                      key={index}
                                      className="mb-2 mt-1"
                                      name={embeddedLink.name}
                                      value={embeddedLink.id}
                                    >
                                      {embeddedLink.name}
                                    </DropdownItem>
                                  </a>
                                )
                            )
                          )
                        )
                      )}
                  </DropdownMenu>
                </Dropdown>
              ) : (
                <i className="noLinks">Ingen links</i>
              )}
            </Col>
          </Row>
        </li>

        {/* {embeddedLinks.length > 0 &&
          embeddedLinks.map((embeddedLink) => (
            <li key={embeddedLink.id} className="listItem">
                          < Link to = { '/information'} >
                          <Row className="listRow">
                            <Col className="listCol">
                              <FontAwesomeIcon
                                className="fontAwesomeIconMenu"
                                icon={faInfoCircle}
                              ></FontAwesomeIcon>
                            </Col>
                            <Col className="listColText">{embeddedLink.id}</Col>
                          </Row>
              </Link>
            </li>
          ))} */}
        {/* <li className="listItem">
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
        </li> */}

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
