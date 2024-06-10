import React, { useState, useEffect, useContext } from 'react';

import AuthContext from "../../context/AuthContext"
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { MdArrowBack } from "react-icons/md";
import Navbar from "../../components/navbar/Navbar"
import Sidebar from "../../components/sidebar/Sidebar"
import "../update/update.scss";



const NewSkill = () => {

    const id = useParams();
    let { user, authTokens } = useContext(AuthContext)
    const [show, setShow] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate();

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [percentage, setPercentage] = useState("")
    const [candidate, setCandidate] = useState([])

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
    

    useEffect(() => {
        getCandidate()
    }, [])


    const addSkill = async (e) => {
        e.preventDefault()
        let formField = new FormData();
        formField.append('name', name);
        formField.append('description', description);
        formField.append('percentage', percentage);
        formField.append('candidate', candidate);



        await axios({
            method: 'POST',
            url: `http://127.0.0.1:8000/user/skills/`,
            data: formField,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
        }).then(response => {
            setName("")
            setDescription("")
            setPercentage("")

            setSuccessMessage("Skill Ajouter Avec success")
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
                        <h1 className="newtitle">Ajouter skill </h1>
                    </div>
                    <form >
                        <Container>
                            <Row>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Skill</Form.Label>
                                    <Form.Control type="text" name="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Pourcentage</Form.Label>
                                    <Form.Control type="number" name="percentage"
                                        value={percentage}
                                        onChange={(e) => setPercentage(e.target.value)} />
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
                                 <button className="newbutton" type="submit" onClick={addSkill}>Ajouter</button>
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

export default NewSkill;