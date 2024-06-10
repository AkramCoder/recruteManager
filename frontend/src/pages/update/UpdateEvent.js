import React, { useState, useEffect, useContext } from 'react';

import AuthContext from "../../context/AuthContext"
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { MdArrowBack } from "react-icons/md";
import Navbar from "../../components/navbar/Navbar"
import Sidebar from "../../components/sidebar/Sidebar"
import "../update/update.scss";



const UpdateEvent = () => {
    const id = useParams();
    let { user, authTokens } = useContext(AuthContext)
    const [show, setShow] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    let [manager, setManager] = useState([])
    let [managers, setManagers] = useState([])
    let [candidates, setCandidates] = useState([])


    let getManager = async () => {
        console.log(user.user_id)
        console.log("token in fetch", String(authTokens.access))
        let response = await fetch(`http://127.0.0.1:8000/user/managercurrent/${user.user_id}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            }
        })
        let data = await response.json()

        if (response.status === 200) {
            setManager(data)

        } else if (response.statusText === 'Unauthorized') {
            console.log(" ERROR ")
        }

    }





    let getManagers = async () => {
        let response = await fetch(`http://127.0.0.1:8000/user/managersselect/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            }
        })
        let data = await response.json()

        if (response.status === 200) {
            setManagers(data)
        }
        else if (response.statusText === 'Unauthorized') {
            console.log(" ERROR ")
        }

    }



    let getCandidates = async () => {
        let response = await fetch(`http://127.0.0.1:8000/user/candidates/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            }
        })
        let data = await response.json()

        if (response.status === 200) {
            setCandidates(data)
        }
        else if (response.statusText === 'Unauthorized') {
            console.log(" ERROR ")
        }

    }


    const navigate = useNavigate();

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [responsable, setResponsable] = useState("")
    const [candidate, setCandidate] = useState("")

    useEffect(() => {
        getManager()
        getManagers()
        getCandidates()
        fetch(`http://127.0.0.1:8000/user/events/${id.eventId}`)
            .then((data) => data.json())
            .then((data) => {
                setName(data.name);
                setResponsable(data.responsable);
                setCandidate(data.candidate);
                setDescription(data.description);
            })
    }, [])


    const updateEvent = async (e) => {
        e.preventDefault()
        let formField = new FormData();

        formField.append('name', name);
        formField.append('description', description);
        formField.append('responsable', responsable);
        formField.append('candidate', candidate);



        await axios({
            method: 'PUT',
            url: `http://127.0.0.1:8000/user/events/${id.eventId}/`,
            data: formField,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
        }).then(response => {
            setSuccessMessage("Evenement modifier Avec success")
            setShow(true)
        })
    }
    return (
        <div className="new">
            <Sidebar />
            <div className="newContainer">
                <Navbar />
                <div>
                    {successMessage &&
                        <Alert className="alert" variant="success" onClose={() => setShow(false)} dismissible>
                            <Alert.Heading><h6>{successMessage}</h6></Alert.Heading>

                        </Alert>}
                </div>
                <div className="newtop">
                    <div>
                        <h1 className="newtitle">Modifier Evenement </h1>
                    </div>
                    <form >
                        <Container>
                            <Row>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Evenement</Form.Label>
                                    <Form.Control type="text" name="name" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Manager</Form.Label>
                                    <Form.Select value={responsable} name="responsable" onChange={(e) => setResponsable(e.target.value)}>
                                        {managers.map(option => (
                                            <option key={option.id} value={option.id}>
                                                {option.user.first_name} {option.user.last_name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Candidat:</Form.Label>
                                    <Form.Select value={candidate} name="candidate" onChange={(e) => setCandidate(e.target.value)} >
                                        {candidates.map(option => (
                                            <option key={option.id} value={option.id}>
                                                {option.user.first_name} {option.user.last_name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Row>
                            
                            <Row>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control as="textarea" rows={3} name="" value={description} onChange={(e) => setDescription(e.target.value)} />
                                </Form.Group>

                            </Row>
                            <Row>
                                <Col md={{ span: 6, offset: 4 }}>
                                    <button className="newbutton" type="submit" onClick={updateEvent}>Modifier</button>
                                </Col>
                            </Row>
                        </Container>
                    </form>
                    <div>
                        <Link to={`/candidates/${id.candidateId}`} style={{ textDecoration: "none" }}>
                            <span className="back"><MdArrowBack className="icon" />Retour</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UpdateEvent;