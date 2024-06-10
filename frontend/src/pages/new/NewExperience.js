import React, { useState, useEffect, useContext } from 'react';

import AuthContext from "../../context/AuthContext"
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { MdArrowBack } from "react-icons/md";

import Navbar from "../../components/navbar/Navbar"
import Sidebar from "../../components/sidebar/Sidebar"
import "../update/update.scss";



const NewExperience = () => {

    const id = useParams();
    let { user, authTokens } = useContext(AuthContext)
    const [show, setShow] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

    const [name, setName] = useState("")
    const [start_date, setStart_date] = useState("")
    const [end_date, setEnd_date] = useState("")
    const [campany, setCampany] = useState("")
    const [description, setDescription] = useState("")
    const [candidate, setCandidate] = useState([{ 'id': '' }])

    let getCandidate = async () => {
        console.log(user.user_id)
        console.log("id --->", id.candidateId)
        console.log("token in fetch", String(authTokens.access))
        let response = await fetch(`http://127.0.0.1:8000/user/candidates/${id.candidateId}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            }
        })
        let data = await response.json()

        if (response.status === 200) {
            setCandidate(id.candidateId)
        } else if (response.statusText === 'Unauthorized') {
            console.log(" ERROR ")
        }
    }

    const navigate = useNavigate();
    useEffect(() => {
        getCandidate()
    }, [])


    const addExperience = async (e) => {
        e.preventDefault()
        let formField = new FormData();

        formField.append('name', name);
        formField.append('start_date', start_date);
        formField.append('end_date', end_date);
        formField.append('company', campany);
        formField.append('description', description);
        formField.append('candidate', candidate);
        await axios({
            method: 'POST',
            url: `http://127.0.0.1:8000/user/experiences/`,
            data: formField,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },

        }).then(response => {
            if (response.status === 201) {
                setName("")
                setStart_date("")
                setEnd_date("")
                setCampany("")
                setDescription("")
                
                setSuccessMessage("Experience Ajouter Avec success")
                setShow(true)

            }
        }).catch(error => {
            console.log(error)
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
                        <h1 className="newtitle">Ajouter Experience </h1>
                    </div>
                    <form>
                        <Container>
                            <Row>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Nom</Form.Label>
                                <Form.Control type="text" name="name" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Entreprise</Form.Label>
                                <Form.Control type="text" name="campany"
                                    value={campany}
                                    onChange={(e) => setCampany(e.target.value)} />
                            </Form.Group>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Date debut</Form.Label>
                                    <Form.Control type="date" name="start_date"
                                        value={start_date}
                                        onChange={(e) => setStart_date(e.target.value)} />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Date fin</Form.Label>
                                    <Form.Control type="date" name="end_date"
                                        value={end_date}
                                        onChange={(e) => setEnd_date(e.target.value)} />
                                </Form.Group>
                            </Col>

                        </Row>
                        <Row>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Description</Form.Label>
                                <Form.Control as="textarea" rows={3} name="" value={description} onChange={(e) => setDescription(e.target.value)} />
                            </Form.Group>

                            </Row>
                            <Row>
                                <Col md={{ span: 6, offset: 4 }}>
                                    <button className="newbutton" type="submit" onClick={addExperience}>Ajouter</button>
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

export default NewExperience;