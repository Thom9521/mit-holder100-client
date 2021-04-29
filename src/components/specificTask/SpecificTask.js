import React, { useState, useEffect } from 'react';
import './SpecificTask.css';
import { useLocation } from 'react-router';
import axios from 'axios';
import globalConsts from '../../globalConsts';

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
  const [preview, setPreview] = useState();
  const [previews, setPreviews] = useState([]);

  const { state } = useLocation();
  // console.log(state);

  const toggleModalSuccess = () => {
    setModalSuccess(!modalSuccess);
    if (modalSuccess) {
      window.location = '/home';
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
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    setPreviews((prevState) => {
      return [...prevState, objectUrl];
    });

    return () => URL.revokeObjectURL(objectUrl);
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
  if (selectedFile) {
    // console.log(fileObject);
    console.log(selectedFile);
    console.log(selectedFiles);
    console.log(previews);
  }
  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('taskId', state.id);
    formData.append('comment_text', taskText);
    if (state.assignees.length > 0) {
      formData.append('assignee', state.assignees[0].id);
    }
    axios({
      method: 'POST',
      url: `${globalConsts[0]}/tasks/addComment.php`,
      data: formData,
    })
      .then((result) => {
        setTaskTest('');
        toggleModalSuccess();
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
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
                  <h5>Billede {index + 1}</h5>
                  {selectedFiles[index] && (
                    <img
                      src={previews[index]}
                      className="imagePreview"
                      alt="Et valgt billede"
                    />
                  )}
                  <p>{selectedFiles[index] && selectedFiles[index].name}</p>
                  <Label className="imageLabel" for="imageFile">
                    Vælg billede
                  </Label>
                  <Input
                    id="imageFile"
                    type="file"
                    name="imageFile"
                    className="fileInput"
                    required
                    onChange={onSelectFile}
                  />
                </div>
              ))}

            <div className="taskContent mt-3">
              <h5>Tilføj et billede</h5>
              <Label className="imageLabel" for="imageFile">
                Vælg billede
              </Label>
              <Input
                id="imageFile"
                type="file"
                multiple
                name="imageFile"
                className="fileInput"
                required
                onChange={onSelectFile}
              />
            </div>
            <div className="taskButtonDiv">
              <Button className="taskButton">Indsend</Button>
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
