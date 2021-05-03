import React, { useState, useEffect } from 'react';
import './SpecificTask.css';
import { useLocation } from 'react-router';
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
} from 'reactstrap';

const SpecificTask = () => {
  const [taskText, setTaskTest] = useState('');
  const [modalSuccess, setModalSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const { state } = useLocation();
  // console.log(state);

  const toggleModalSuccess = () => {
    setModalSuccess(!modalSuccess);
    if (modalSuccess) {
      // window.location = '/home';
    }
  };

  var deadlineColor = '';
  if (state.due_date !== null) {
    var deadline = new Date(parseInt(state.due_date));
    var deadlineFormat = deadline.toISOString().slice(0, 10).toString();
    if (deadline <= new Date()) {
      deadlineColor = 'red';
    }
  }

  useEffect(() => {
    if (!selectedFile) {
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviews((prevState) => {
      return [...prevState, objectUrl];
    });
  }, [selectedFile]);

  const onSelectFile = (e) => {
    const fileObject = e.target.files[0];
    if (!fileObject || fileObject.length === 0) {
      setSelectedFile(undefined);
      return;
    }
    setSelectedFile(fileObject);
    setSelectedFiles((prevState) => {
      // selectedFiles: [...prevState, fileObject],
      return [...prevState, fileObject];
    });
  };

  const onFileRemove = (fileName, previewName) => {
    URL.revokeObjectURL(previewName);

    setSelectedFiles((prevState) => {
      return prevState.filter((file) => file.name !== fileName);
    });
    setPreviews((prevState) => {
      return prevState.filter((preview) => preview !== previewName);
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const headers = {
      'Content-Type': 'multipart/form-data',
    };

    const commentData = new FormData();
    commentData.append('taskId', state.id);
    commentData.append('comment_text', taskText);

    if (state.assignees.length > 0) {
      commentData.append('assignee', state.assignees[0].id);
    }
    axios({
      method: 'POST',
      url: `${globalConsts[0]}/tasks/addComment.php`,
      data: commentData,
    })
      .then((result) => {
        setTaskTest('');
        if (selectedFiles.length > 0) {
          const fileData = new FormData();
          fileData.append('taskId', state.id);
          for (let i = 0; i < selectedFiles.length; i++) {
            fileData.append('file[]', selectedFiles[i], selectedFiles[i].name);
          }
          if (state.assignees.length > 0) {
            fileData.append('assignee', state.assignees[0].id);
          }
          axios({
            method: 'POST',
            url: `${globalConsts[0]}/tasks/addAttachments.php`,
            data: fileData,
            headers: headers,
          })
            .then((result) => {
              console.log(result);
              if (result.status === 200) {
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
  };

  return (
    <div className="contentWrapper contentCenter ">
      <Form onSubmit={handleSubmit} method="POST">
        <FormGroup>
          <div className="taskWrapper listHeader">
            {/* <h4 className=" mb-3">Opgaven</h4> */}
            <div className="taskContent">
              <h5>{state.name}</h5>
              <p className="taskDeadline" style={{ color: deadlineColor }}>
                {state.due_date !== null
                  ? 'Deadline: ' + deadlineFormat
                  : 'Ingen deadline'}
              </p>
              <p className="taskDescription">{state.description}</p>
            </div>
            {/* <h4 className="mb-3 mt-4">Din løsning</h4> */}
            <div className="taskContent mt-3">
              <h5>Tilføj en tekst</h5>
              <Input
                type="textarea"
                value={taskText}
                placeholder="Tilføj en tekst til opgaven"
                required
                style={{ minHeight: 100 }}
                onChange={(event) => setTaskTest(event.target.value)}
              />
            </div>

            {selectedFiles !== '' &&
              selectedFiles.map((file, index) => (
                <div key={index} className="taskContent mt-3">
                  <h5>Fil {index + 1}</h5>
                  {selectedFiles[index] &&
                    (selectedFiles[index].type === 'image/jpeg' ||
                      selectedFiles[index].type === 'image/jpg' ||
                      selectedFiles[index].type === 'image/gif' ||
                      selectedFiles[index].type === 'image/png') && (
                      <img
                        src={previews[index]}
                        className="imagePreview"
                        alt="En valgt fil"
                      />
                    )}
                  <p>{selectedFiles[index] && selectedFiles[index].name}</p>
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
              />
            </div>
            <div className="taskButtonDiv">
              <Button className="taskButton">
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
          </div>
        </FormGroup>
      </Form>
      <Modal isOpen={modalSuccess} toggle={toggleModalSuccess}>
        <ModalHeader toggle={toggleModalSuccess}>Succes!</ModalHeader>
        <ModalBody>Din besvarelse er blevet indsendt til Holder 100.</ModalBody>
        <ModalFooter>
          <Button className="closeModal" onClick={toggleModalSuccess}>
            Luk
          </Button>{' '}
        </ModalFooter>
      </Modal>
    </div>
  );
};
export default SpecificTask;
