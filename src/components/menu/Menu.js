import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import './Menu.css';
import axios from 'axios';
import globalConsts from '../../globalConsts';
import { useHistory } from 'react-router-dom';

// Fontawesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faPhoneAlt } from '@fortawesome/free-solid-svg-icons';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';


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

// Component that renderes the menu
const Menu = () => {
  const history = useHistory();

  // States with React Hooks
  const [embeddedLinks, setEmbeddedLinks] = useState([]);
  const [externalLinks, setExternalLinks] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownOpenEmbedded, setDropdownOpenEmbedded] = useState(false);
  const [dropdownOpenSettings, setDropdownOpenSettings] = useState(false);
  const [fetchedLinks, setFetchedLinks] = useState(false);
  const [chosenCompany, setChosenCompany] = useState({
    id: '0',
    name: 'Alle firmaer',
  });

  // Toggles dropdown
  const toggle = () => setDropdownOpen(!dropdownOpen);
  const toggleSettings = () => setDropdownOpenSettings(!dropdownOpenSettings);
  const toggleEmbedded = () => setDropdownOpenEmbedded(!dropdownOpenEmbedded);

  // useEffect with React Hooks. Runs when the component has mounted
  useEffect(() => {
    let isMounted = true;
    if (chosenCompany !== '' && !fetchedLinks) {
      // GET request to get all the links for the chosen company
      axios({
        method: 'GET',
        url: `${globalConsts[0]}/links/getEmbeddedLinks.php?company=${chosenCompany.id}`,
      })
        .then((response) => {
          if (isMounted) {
            setEmbeddedLinks('')
            setExternalLinks('')
            setFetchedLinks(true);
            console.log(response.data)
            for (let i = 0; i < response.data.length; i++) {
              for (let j = 0; j < response.data[i].custom_fields.length; j++) {
                if (response.data[i].custom_fields[j].name === "Link type" && response.data[i].custom_fields[j].value === 0) {
                  setEmbeddedLinks((prevstate) => {
                    return [...prevstate, response.data[i]]
                  })
                } else if (response.data[i].custom_fields[j].name === "Link type" && response.data[i].custom_fields[j].value === 1) {
                  console.log(response.data[i]);
                  setExternalLinks((prevstate) => {
                    return [...prevstate, response.data[i]]
                  })
                }
              }
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    return () => {
      isMounted = false;
    };
    // Clean up. The following states will only be updated once when mounted
  }, [chosenCompany, embeddedLinks, fetchedLinks]);

  // Handles the logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('ID');
    localStorage.removeItem('username');
    localStorage.removeItem('name');
    window.location = '/';
  };
  // Handles the company choice
  const handleChosenCompany = (chosenCompany, push) => {
    setChosenCompany(chosenCompany);
    setFetchedLinks(!push);
    if (push) {
      // Pushing the choice to the tasks component
      history.push('/tasks', chosenCompany);
    }
  };

  return (
    <div className="listContainer">
      <div className="headerContainer">
        {/*Renderes the Header component with props */}
        <Header chosenCompanyHeader={handleChosenCompany} />
      </div>
      <List className="listMenu container" type="unstyled">
        <li className="listItem">
          <Link to={{ pathname: '/tasks', state: chosenCompany }}>
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
        {embeddedLinks.length > 0 &&
          // Maps through the array with embeddedLinks and show a dropdown option for each
          embeddedLinks.map((embeddedLink) =>
            <li className="listItem embeddedLinksItems" key={embeddedLink.id}>
              <Link
                to={{
                  pathname: `/embeddedLink/${embeddedLink.id}`,
                  state: embeddedLink,
                }}
              >
                <Row className="listRow">
                  <Col className="listCol">
                    <FontAwesomeIcon
                      className="fontAwesomeIconMenu"
                      icon={faLink}
                    ></FontAwesomeIcon>
                  </Col>
                  <Col className="listColText">{embeddedLink.name}</Col>
                </Row>
              </Link>
            </li>
          )}
        {embeddedLinks.length > 1 && (
          <li className="listItem embeddedLinksDropdown">
            <Row className="listRow">
              <Col className="listCol">
                <FontAwesomeIcon
                  className="fontAwesomeIconMenu"
                  icon={faLink}
                  onClick={toggleEmbedded}
                ></FontAwesomeIcon>
              </Col>
              <Col className="listColText">
                {/*Shows if the embeddedLinks array is higher then 0 */}
                <Dropdown
                  isOpen={dropdownOpenEmbedded}
                  toggle={toggleEmbedded}
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
                    {/*Shows if the embeddedLinks array is higher then 0.*/}
                    {embeddedLinks.length > 0 &&
                      // Maps through the array with embeddedLinks and show a dropdown option for each
                      embeddedLinks.map((embeddedLink, index) =>

                        <Link
                          key={embeddedLink.id}
                          to={{
                            pathname: `/embeddedLink/${embeddedLink.id}`,
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
                      )}
                  </DropdownMenu>
                </Dropdown>
              </Col>
            </Row>
          </li>
        )}
        {embeddedLinks.length === 1 &&

          <li className="listItem embeddedLinksDropdown" key={embeddedLinks[0].id}>
            <Link
              to={{
                pathname: `/embeddedLink/${embeddedLinks[0].id}`,
                state: embeddedLinks[0],
              }}
            >
              <Row className="listRow">
                <Col className="listCol">
                  <FontAwesomeIcon
                    className="fontAwesomeIconMenu"
                    icon={faLink}
                  ></FontAwesomeIcon>
                </Col>
                <Col className="listColText">{embeddedLinks[0].name}</Col>
              </Row>
            </Link>
          </li>
        }
        {externalLinks.length > 0 && (
          <li className="listItem">
            <Row className="listRow">
              <Col className="listCol">
                <FontAwesomeIcon
                  className="fontAwesomeIconMenu"
                  icon={faExternalLinkAlt}
                  onClick={toggle}
                ></FontAwesomeIcon>
              </Col>
              <Col className="listColText">
                {/*Shows if the embeddedLinks array is higher then 0 */}
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
                    {/*Shows if the embeddedLinks array is higher then 0.*/}
                    {externalLinks.length > 0 &&
                      // Maps through the array with externalLinks and show a dropdown option for each
                      externalLinks.map((externalLink, index) =>
                        // Maps through the custom fields in each link
                        externalLink.custom_fields.map((customField) =>
                          customField.name === 'Link' &&
                          <a
                            key={customField.id}
                            href={customField.value}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <DropdownItem
                              key={index}
                              className="mb-2 mt-1"
                              name={externalLink.name}
                              value={externalLink.id}
                            >
                              {externalLink.name}
                            </DropdownItem>
                          </a>

                        )
                      )}
                  </DropdownMenu>
                </Dropdown>
              </Col>
            </Row>
          </li>
        )}
        < li className="listItem">
          <Row className="listRow">
            <Col className="listCol">
              <FontAwesomeIcon
                className="fontAwesomeIconMenu"
                icon={faCog}
                onClick={toggleSettings}
              ></FontAwesomeIcon>
            </Col>
            <Col className="listColText">
              <Dropdown
                isOpen={dropdownOpenSettings}
                toggle={toggleSettings}
                className="dropdownStyles dropdownLinks"
              >
                <DropdownToggle className="dropdownToggle">
                  Indstillinger{' '}
                  <FontAwesomeIcon
                    className="fontAwesomeIconHeader"
                    icon={faCaretDown}
                  ></FontAwesomeIcon>
                </DropdownToggle>
                <DropdownMenu>
                  <Link
                    to={'/change-password'}
                  >
                    <DropdownItem
                      className="mb-2 mt-1"
                    >
                      Skift adgangskode
                    </DropdownItem>
                  </Link>

                  <DropdownItem
                    className="mb-2 mt-1"
                    onClick={handleLogout}
                  >
                    Log ud
                    </DropdownItem>
                </DropdownMenu>
              </Dropdown>

            </Col>

          </Row>
        </li>
        {/* <li className="listItem">
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
        </li> */}
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
    </div >
  );
};
export default Menu;
