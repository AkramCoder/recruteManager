import React, { useState, useEffect, useContext } from 'react';

import AuthContext from "../../context/AuthContext"
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';

import Navbar from "../../components/navbar/Navbar"
import Sidebar from "../../components/sidebar/Sidebar"
import Chart from "../../components/chart/Chart";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Accordion from 'react-bootstrap/Accordion';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Tablecomp from "../../components/table/Tablecomp";
import Table from 'react-bootstrap/Table';
import DeleteConfirmation from "./DeleteConfirmation";
import "./single.scss";

const Interview = () => {
    let { user, authTokens, logoutUser } = useContext(AuthContext)
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
        setQuestion("")
        setResponse("")
        setObservation("")
        setSuccessalert(false)
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
        setInterview(id.interviewId)
    }

    const addQuestion = async () => {
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
            setSuccessalert(true)
        })
    }



    const handleDelete = async () => {
        await axios.delete(`http://127.0.0.1:8000/user/interview-detail/${id.interviewId}/`);
        setSuccessalert(true)
        navigate("/candidates");
    }

   

    // modal 
    // Set up some additional local state
    const [type, setType] = useState(null);
    const [idm, setIdm] = useState(null);
    const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState(null);
    const [fruitMessage, setFruitMessage] = useState(null);
    // Handle the displaying of the modal based on type and id
    const showDeleteModal = (idm) => {
        console.log('showDeleteModal')
        setIdm(idm);
        setFruitMessage(null);
        setDeleteMessage(`Are you sure you want to delete the question ${idm} ?`);
       
        setDisplayConfirmationModal(true);
    };

    // Hide the modal
    const hideConfirmationModal = () => {
        setDisplayConfirmationModal(false);
    };

    // Handle the actual deletion of the item
    const submitDelete = async (idm) => {
        console.log(idm)
        await axios({
            method: 'DELETE',
            url: `http://127.0.0.1:8000/user/questions/${idm}/`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
        })
            setFruitMessage(`The fruit was deleted successfully.`);
            //   handleUpdate(idm)
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
                {fruitMessage && 
                    <div className="alerts">
                        <Alert variant="success" onClose={() => setShow(false)} dismissible>
                            <Alert.Heading>{fruitMessage}</Alert.Heading>
                          
                        </Alert>
                        {/*<Alert variant="success"></Alert>*/}
                    </div>}
                <div className="top">
                    
                    <div className="left">
                        <div className="editButton">Modifier</div>
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
                            </div>
                        </div>
                    </div>
                    <div className="right">
                        <h1 className="title">Description:</h1>
                        <div className="item">
                            <div className="details">
                                <h1 className="itemTitle"></h1>
                                <div className="detailItem">
                                    <span className="itemKey">Evenement:</span>
                                    <Accordion>
                                        <Accordion.Item eventKey="0">
                                            <Accordion.Header>Supprimer</Accordion.Header>
                                            <Accordion.Body>
                                                <p> Voulais vous supprimer l'evenement " {thisinterview.name} " ?</p>

                                                <Button variant="danger" onClick={handleDelete}>Confirmer</Button>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bottom">
                    <h1 className="title">Les questions:</h1>
                    <Link className="link" onClick={handleShow}> Ajouter Question</Link>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
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
                                        <Button className="" style={{ textDecoration: "none" }} onClick={() => showDeleteModal(option.id)}  >
                                            <div className="viewButton">Modifier</div>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <DeleteConfirmation showModal={displayConfirmationModal} confirmModal={submitDelete} hideModal={hideConfirmationModal}  id={idm} message={deleteMessage} />

                 </div>
            </div>
        </div>
    );
};

export default Interview;