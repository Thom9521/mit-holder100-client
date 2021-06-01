import React, { useState, useEffect } from 'react';
import './SpecificTask.css';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import axios from 'axios';
import globalConsts from '../../globalConsts';
import Loader from 'react-loader-spinner';

import {
  Button,
  Input,
  Label,
  Form,
  FormGroup,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
} from 'reactstrap';

// Component that renderes a specifik task
const SpecificTask = () => {
  // Destructuring the state from the navigation
  const { state } = useLocation();

  // States with React Hooks
  const [taskText, setTaskTest] = useState('');
  const [modalSuccess, setModalSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [errorMessage, setErrorMessage] = useState(false);

  // Local variables
  var taskDescription = '';

  // Toggles modal
  const toggleModalSuccess = () => {
    setModalSuccess(!modalSuccess);
  };

  // Loopes through the custom fields to get 'Kundens opgave'
  for (let i = 0; i < state.task.custom_fields.length; i++) {
    if (state.task.custom_fields[i].id === 'fb7b15c6-e8d8-4643-9bb4-d6464763b2d0') {
      taskDescription = state.task.custom_fields[i].value;
    }
  }

  if (state === undefined) {
    // Redirectiong to not found component
    window.location = '/NotFound';
  } else {
    var deadlineColor = '';
    if (state.task.due_date !== null) {
      // Getting the date with the 'due_date' from the task
      var deadline = new Date(parseInt(state.task.due_date));
      // Getting the right date format
      var deadlineFormat = deadline.toISOString().slice(0, 10).toString();
      if (deadline <= new Date()) {
        deadlineColor = 'red';
      }
    }
  }

  // useEffect with React Hooks. Runs when the component has mounted
  useEffect(() => {
    if (!selectedFile) {
      return;
    }
    // Creates an object URL for the previews of images/videos
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviews((prevState) => {
      return [...prevState, objectUrl];
    });
    setSelectedFile(null);
    // Clean up. The following states will only be updated once when mounted
  }, [selectedFile, selectedTags]);

  // Handles the task text input
  const handleTaskText = (e) => {
    setTaskTest(e.target.value);
    setErrorMessage(false);
  };

  // Handles the selecting of files
  const onSelectFile = (e) => {
    const fileObject = e.target.files[0];
    if (!fileObject || fileObject.length === 0) {
      setSelectedFile(undefined);
      return;
    }
    setErrorMessage(false);
    setSelectedFile(fileObject);
    // Adds the file to the array of files
    setSelectedFiles((prevState) => {
      return [...prevState, fileObject];
    });
  };

  // Handles the file when removed
  const onFileRemove = (fileName, previewName) => {
    URL.revokeObjectURL(previewName);
    setSelectedFile();

    // Removes the file from the array of files
    setSelectedFiles((prevState) => {
      return prevState.filter((file) => file.name !== fileName);
    });
    // Removes the preview from the array of previews
    setPreviews((prevState) => {
      return prevState.filter((preview) => preview !== previewName);
    });
  };

  // Attaching a comment field onto the file object
  const handleFileComment = (value, index) => {
    let files = [...selectedFiles];
    let file = files[index];
    file.comment = value;
    files[index] = file;
    setSelectedFiles(files);
  };

  // Handles the tags
  const handleTags = (e, tagIndex, fileIndex, bgColor) => {

    // Creates a new object with the tag values
    const tagObject = {
      id: e.target.value + tagIndex + fileIndex,
      value: e.target.value,
      tagIndex: tagIndex,
      fileIndex: fileIndex,
    };
    var inArray = false;

    // If the array of tags is higher then 0
    if (selectedTags.length > 0) {
      for (let i = 0; i < selectedTags.length; i++) {
        // If the tag already exists in the array of tags
        if (
          selectedTags[i].value +
          selectedTags[i].tagIndex +
          selectedTags[i].fileIndex ===
          tagObject.id
        ) {
          inArray = true;
          e.target.style.borderColor = bgColor;
          // Removes the tag from the array of tags
          setSelectedTags((prevState) => {
            return prevState.filter((tag) => tag.id !== tagObject.id);
          });
        }
      }
    }
    if (!inArray) {
      e.target.style.borderColor = 'yellow';
      // Adds the tag to the array of tags
      setSelectedTags((prevState) => {
        return [...prevState, tagObject];
      });
    }
  };

  // Handles the submit
  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedFiles.length > 0 || taskText !== '') {
      // Setting tags on file object
      for (let i = 0; i < selectedFiles.length; i++) {
        const tagsWithMatchingFileIndex = selectedTags.filter(
          (tag) => tag.fileIndex === i
        );
        let files = [...selectedFiles];
        let file = files[i];
        file.tags = tagsWithMatchingFileIndex;
        files[i] = file;
      }
      setLoading(true);
      var submitButton = document.getElementById('submitButton');
      submitButton.disabled = true;

      // Data for the POST request
      const commentData = new FormData();
      commentData.append('taskId', state.task.id);
      commentData.append('comment_text', taskText);
      commentData.append('status', state.task.status.status);
      commentData.append('name', localStorage.getItem('name'));

      if (state.task.assignees.length > 0) {
        commentData.append('assignee', state.task.assignees[0].id);
      }
      // POST request that adds the task text as a comment in Click Up
      axios({
        method: 'POST',
        url: `${globalConsts[0]}/tasks/addComment.php`,
        data: commentData,
      })
        .then((result) => {
          setTaskTest('');
          if (selectedFiles.length > 0) {

            // Headers for the POST request
            const headers = {
              'Content-Type': 'multipart/form-data',
            };

            // Data for the POST request
            const fileData = new FormData();
            fileData.append('taskId', state.task.id);
            for (let i = 0; i < selectedFiles.length; i++) {
              fileData.append(
                'file[]',
                selectedFiles[i],
                selectedFiles[i].name
              );
              fileData.append('comment[]', selectedFiles[i].comment);
              fileData.append('name[]', localStorage.getItem('name'));
              fileData.append('status[]', state.task.status.status);

              var tagsString = '';

              // Adding the right tags for each file
              for (let j = 0; j < selectedTags.length; j++) {
                if (selectedTags[j].fileIndex === i) {
                  // eslint-disable-next-line
                  tagsString += '"' + selectedTags[j].value + '"' + ' ';
                }
              }
              fileData.append('tags[]', tagsString);
            }

            if (state.task.assignees.length > 0) {
              fileData.append('assignee', state.task.assignees[0].id);
            }

            // POST requst that adds the attached files
            axios({
              method: 'POST',
              url: `${globalConsts[0]}/tasks/addAttachments.php`,
              data: fileData,
              headers: headers,
            })
              .then((result) => {
                if (result.status === 200) {
                  // Clearing the states
                  setSelectedFiles([]);
                  setPreviews([]);
                  setSelectedFile();
                  setLoading(false);

                  toggleModalSuccess();
                }
              })
              .catch((error) => {
                console.log(error);
                setLoading(false);
              });
          } else {
            toggleModalSuccess();
            setLoading(false);
          }
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    } else {
      setErrorMessage(true);
    }
  };

  return (
    <div className="contentWrapper contentCenter contentMarginVertical">
      <Form onSubmit={handleSubmit} method="POST">
        <FormGroup>
          <div className="taskWrapper listHeader">
            <div className="taskContent">
              <h5>{state.task.name}</h5>
              <p className="taskDeadline" style={{ color: deadlineColor }}>
                {/*Showing depending the deadline */}
                {state.task.due_date !== null
                  ? 'Deadline: ' + deadlineFormat
                  : 'Ingen deadline'}
              </p>
              <p className="taskDescription">{taskDescription}</p>
            </div>
            <div className="taskContent mt-3">
              <h5>Tilføj en tekst</h5>
              <Input
                type="textarea"
                value={taskText}
                placeholder="Tilføj en tekst til opgaven"
                style={{ minHeight: 100 }}
                onChange={handleTaskText}
              />
            </div>
            {/*If the array of files is not empty */}
            {selectedFiles !== '' &&
              // Maps through the array of files and shows a div for each one
              selectedFiles.map((file, index) => (
                <div key={index} className="taskContent mt-3">
                  <h5>Fil {index + 1}</h5>
                  {selectedFiles[index] && (
                    <Row>
                      {/*Shows if the file type is a video*/}
                      {selectedFiles[index].type.includes('video/') && (
                        <Col className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12 col-12 fileCol">
                          <video
                            src={previews[index]}
                            className="imagePreview"
                            alt="En valgt videofil"
                            controls
                          >
                            Din browser understøtter ikke videoer
                          </video>
                        </Col>
                      )}
                      {/*Shows if the file type is an image*/}
                      {selectedFiles[index].type.includes('image/') && (
                        <Col className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12 col-12 fileCol">
                          <img
                            src={previews[index]}
                            className="imagePreview"
                            alt="En valgt billedefil"
                          />
                        </Col>
                      )}
                      <Col className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12 col-12 fileCol">
                        <Input
                          type="textarea"
                          placeholder="Tilføj en kommentar til filen"
                          className="fileComment"
                          onChange={(e) =>
                            handleFileComment(e.target.value, index)
                          }
                        />
                      </Col>
                    </Row>
                  )}
                  <Row>
                    <Col>
                      <p className="filePreviewName">
                        {selectedFiles[index] && selectedFiles[index].name}
                      </p>
                    </Col>
                    <Col>
                      {/*Looping through the tags and shows a button for each one */}
                      {state.task.tags.map((tag, tagIndex) => (
                        <button
                          type="button"
                          key={tagIndex}
                          className="tagStyles"
                          value={tag.name}
                          onClick={(e) =>
                            handleTags(e, tagIndex, index, tag.tag_bg)
                          }
                          style={{
                            backgroundColor: tag.tag_bg,
                            borderColor: tag.tag_bg,
                          }}
                        >
                          {tag.name}
                        </button>
                      ))}
                    </Col>
                  </Row>
                  <Button
                    className="removeFileBtn"
                    onClick={() => onFileRemove(file.name, previews[index])}
                  >
                    Slet
                  </Button>
                </div>
              ))}

            <div className="taskContent mt-3">
              <h5>Tilføj en fil</h5>
              <Label className="fileLabel" for="selectedFile">
                Vælg fil
              </Label>
              <Input
                id="selectedFile"
                type="file"
                name="selectedFile"
                className="fileInput"
                onChange={onSelectFile}
                onClick={(e) => (e.target.value = null)} // Setting value to null so the same file can be picked more than once in a row
              />
            </div>

            <div className="taskButtonDiv">
              <Button id="submitButton" className="taskButton">
                {/*Shows a loading animation if loading is true */}
                {loading ? (
                  <Loader
                    type="TailSpin"
                    color="white"
                    height={23}
                    width={23}
                  />
                ) : (
                  'Indsend'
                )}
              </Button>
            </div>
            {errorMessage && (
              <p className="errorMessage">
                Der er ikke tilføjet noget materiale...
              </p>
            )}
          </div>
        </FormGroup>
      </Form>
      {/*Shows the submit was a success */}
      <Modal
        isOpen={modalSuccess}
        toggle={toggleModalSuccess}
        className="modalStyles"
      >
        <ModalHeader toggle={toggleModalSuccess}>Succes!</ModalHeader>
        <ModalBody>
          Tak for dit svar. Din besvarelse er blevet indsendt til Holder 100.
        </ModalBody>
        <ModalFooter>
          <Link to={{ pathname: '/tasks', state: state.companyState }}>
            <Button className="closeModal" onClick={toggleModalSuccess}>
              Luk
            </Button>{' '}
          </Link>
        </ModalFooter>
      </Modal>
    </div>
  );
};
export default SpecificTask;
