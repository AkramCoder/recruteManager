import React, { useState, useEffect, useContext } from 'react';

import AuthContext from "../../context/AuthContext"
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';

import Navbar from "../../components/navbar/Navbar"
import Sidebar from "../../components/sidebar/Sidebar"
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import DeleteModal from "../../components/modal/DeleteModal";
import "./single.scss";

const InterviewCandidate = () => {
    let { user, authTokens, logoutUser } = useContext(AuthContext)
    const [show, setShow] = useState(false);
    const [idmodal, setIdmodal] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [successUpdateMessage, setSuccessUpdateMessage] = useState(null);
    const handleShowModal = () => setShowModal(true);

    const handleCloseModal = () => {
        setShowModal(false);
        setQuestion("")
        setResponse("")
        setObservation("")
        getInterview()
    }

    const handleShowUpdateModal = (item) => {
        setIdmodal(item.id)
        setShowUpdateModal(true);
        setQuestion(item.question)
        setResponse(item.response)
        setObservation(item.observation)

    }

    const handleCloseUpdateModal = () => {
        setShowUpdateModal(false);
        setQuestion("")
        setResponse("")
        setObservation("")
        getInterview()
    }
    const handleShow = () => setShow(true);
    const [successalert, setSuccessalert] = useState(false);
    const [thisinterview, setThisInterview] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [responsables, setResponsables] = useState([]);
    const [candidate, setCandidate] = useState([]);

    // for question adding
    const [question, setQuestion] = useState("");
    const [response, setResponse] = useState("");
    const [observation, setObservation] = useState("");
    const [interview, setInterview] = useState("");

    const id = useParams();
    const navigate = useNavigate();


    const getInterview = async () => {

        const { data } = await axios.get(`http://127.0.0.1:8000/user/interview-detail/${id.interviewId}`)
        console.log("interview --- ", data)
        setThisInterview(data)
        setQuestions(data.questions)
        setResponsables(data.responsable)
        setCandidate(data.candidate.user)
        //  setCandidat(data.candidate.user)
        console.log(responsables)
        console.log(candidate)
        setInterview(id.interviewId)
    }

    const addQuestion = async (e) => {
        e.preventDefault()
        let formField = new FormData();
        formField.append('question', question);
        formField.append('response', response);
        formField.append('observation', observation);
        formField.append('interview', interview);



        await axios({
            method: 'POST',
            url: `http://127.0.0.1:8000/user/interviews/${id.interviewId}/questions/`,
            data: formField,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
        }).then(response => {
            console.log(response.data);
            getInterview()
            setQuestion("")
            setResponse("")
            setObservation("")
            setShowModal(false)
            setSuccessMessage("Question ajoutee avec success")
        })
    }



    const handleDelete = async () => {
        await axios.delete(`http://127.0.0.1:8000/user/interview-detail/${id.interviewId}/`);
        setSuccessalert(true)
        navigate("/interviews");
    }

    const handleEdit = (q) => {

        setShow(true)
        setQuestion(q.question)
        setResponse(q.response)
        setObservation(q.observation)
        setInterview(q.interview)
        console.log(q)
    }

    const handleUpdate = async (e) => {

        e.preventDefault()
        console.log("id modal", idmodal)
        let formField = new FormData();
        formField.append('question', question);
        formField.append('response', response);
        formField.append('observation', observation);
        formField.append('interview', interview);

        await axios({
            method: 'PUT',
            url: `http://127.0.0.1:8000/user/questions/${idmodal}/`,
            data: formField,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
        })
            .then(response => {
                console.log(response.data);
                setSuccessUpdateMessage("question est modifier avec success")
            })

    }

    // modal 
    // Set up some additional local state
    const [type, setType] = useState(null);
    const [idm, setIdm] = useState("");
    const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState(null);
    const [successDeleteMessage, setSuccessDeleteMessage] = useState(null);
    // Handle the displaying of the modal based on type and id
    const showDeleteModal = (idm) => {
        setType(type);
        setIdm(idm);
        console.log(idm)
        setDeleteMessage(`voulez vous supprimer cette question ${idm}`)
        setSuccessDeleteMessage(null);
        setDisplayConfirmationModal(true);
    };

    // Hide the modal
    const hideConfirmationModal = () => {
        setDisplayConfirmationModal(false);
    };

    // Handle the actual deletion of the item
    const submitDelete = async (idm) => {
        await axios({
            method: 'DELETE',
            url: `http://127.0.0.1:8000/user/questions/${idm}/`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
        })
        setSuccessDeleteMessage(`The question was deleted successfully.`);
        getInterview()
        setDisplayConfirmationModal(false);
    };
    useEffect(() => {
        getInterview()
    }, [])
    return (
        <div className="single">
            <Sidebar />
            <div className="singleContainer">
                <Navbar />
                <div className="top">
                    <div className="left">
                        {successDeleteMessage && <Alert variant="success">{successDeleteMessage}</Alert>}
                        <Link to={`update/`} style={{ textDecoration: "none" }}>
                            <div className="editButton">Modifier</div>
                        </Link>
                        <div className="deleteButton">Supprimer</div>
                        <h1 className="title">Information</h1>
                        <div className="item">
                            <div className="details">
                                <h1 className="itemTitle"></h1>
                                <div className="detailItem">
                                    <span className="itemKey">Interview:</span>
                                    <span className="itemValue">{thisinterview.name}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Ajoute le :</span>
                                    <span className="itemValue">{thisinterview.interview_date}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Par:</span>
                                    <span className="itemValue"></span>
                                    <ul>
                                        {responsables.map(option => (
                                            <li key={option.id}>
                                                {option.user.first_name} {option.user.last_name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Pour:</span>
                                    <span className="itemValue">
                                        {candidate.first_name}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    {successMessage &&
                        <Alert className="alert" variant="success" onClose={() => setShow(false)} dismissible>
                            <Alert.Heading><h6>{successMessage}</h6></Alert.Heading>

                        </Alert>}
                    {successDeleteMessage &&
                        <Alert className="alert" variant="success" onClose={() => setShow(false)} dismissible>
                            <Alert.Heading><h6>{successDeleteMessage}</h6></Alert.Heading>

                        </Alert>}
                    {successUpdateMessage &&
                        <Alert className="alert" variant="success" onClose={() => setShow(false)} dismissible>
                            <Alert.Heading><h6>{successUpdateMessage}</h6></Alert.Heading>

                        </Alert>}
                </div>
                <div className="bottom">
                    <h1 className="title">Les questions:</h1>
                    <Link className="link" onClick={handleShowModal}> Ajouter Question</Link>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>id</th>
                                <th>Question</th>
                                <th>Reponse</th>
                                <th>Observation</th>
                                <th>Modifier</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questions.map(option => (

                                <tr key={option.id}>
                                    <td>{option.id}</td>
                                    <td>{option.question}</td>
                                    <td>{option.response}</td>
                                    <td>{option.observation}</td>
                                    <td>
                                        <div className="viewButton"
                                            onClick={() => handleShowUpdateModal(option)}
                                        >
                                            Modifier
                                        </div>

                                        <div className="deleteButton"
                                            onClick={() => showDeleteModal(option.id)}
                                        >
                                            Supprimer
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <DeleteModal showModal={displayConfirmationModal} confirmModal={submitDelete} hideModal={hideConfirmationModal} id={idm} message={deleteMessage} />
                    <Modal show={showModal} onHide={handleCloseModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Ajouter question</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form>
                                <Container>
                                    <Row>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Question</Form.Label>
                                            <Form.Control
                                                type="textarea"
                                                value={question}
                                                name="question"
                                                onChange={(e) => setQuestion(e.target.value)}
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                            <Form.Label>Reponse</Form.Label>
                                            <Form.Control as="textarea" rows={3}
                                                value={response}
                                                name="response"
                                                onChange={(e) => setResponse(e.target.value)} />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                            <Form.Label>Observation</Form.Label>
                                            <Form.Control as="textarea" rows={3}
                                                value={observation}
                                                name="observation"
                                                onChange={(e) => setObservation(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Row>
                                </Container>
                            </form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Annuler
                            </Button>
                            <Button variant="success" onClick={addQuestion}>
                                Ajouter
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <Modal show={showUpdateModal} onHide={handleCloseUpdateModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Modifier question</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form>
                                <Container>
                                    <Row>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Question</Form.Label>
                                            <Form.Control
                                                type="textarea"
                                                value={question}
                                                name="question"
                                                onChange={(e) => setQuestion(e.target.value)}
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                            <Form.Label>Reponse</Form.Label>
                                            <Form.Control as="textarea" rows={3}
                                                value={response}
                                                name="response"
                                                onChange={(e) => setResponse(e.target.value)} />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                            <Form.Label>Observation</Form.Label>
                                            <Form.Control as="textarea" rows={3}
                                                value={observation}
                                                name="observation"
                                                onChange={(e) => setObservation(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Row>
                                </Container>
                            </form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseUpdateModal}>
                                Annuler
                            </Button>
                            <Button variant="success" onClick={handleUpdate}>
                                Modifier
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default InterviewCandidate;