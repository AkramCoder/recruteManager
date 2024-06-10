import Navbar from "../../components/navbar/Navbar"
import Sidebar from "../../components/sidebar/Sidebar"
import React, { useState, useEffect } from 'react';
import {Link,  useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { MdArrowBack } from "react-icons/md";

import "../new/new.scss";

const UpdateSkill = () => {

    const id = useParams();
    const [show, setShow] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate();

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [percentage, setPercentage] = useState("")
    const [candidate, setCandidate] = useState([])


    useEffect(() => {
        console.log("id skill", id)
        fetch(`http://127.0.0.1:8000/user/skills/${id.skillId}`)
            .then((data) => data.json())
            .then((data) => {
                setName(data.name);
                setPercentage(data.percentage);
                setCandidate(data.candidate);
                setDescription(data.description);
            })

    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        let formField = new FormData();
        formField.append('name', name);
        formField.append('percentage', percentage);
        formField.append('candidate', candidate);
        formField.append('description', description);

        await axios({
            method: 'PUT',
            url: `http://127.0.0.1:8000/user/skills/${id.skillId}/`,
            data: formField
        }).then(response => {
            setSuccessMessage("Skill modifiee Avec success")
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
                        <h1 className="newtitle">Modifier skill </h1>
                    </div>
                    <form onSubmit={handleSubmit}>
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
                                    <button className="newbutton" type="submit" >Modifier</button>
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
export default UpdateSkill;