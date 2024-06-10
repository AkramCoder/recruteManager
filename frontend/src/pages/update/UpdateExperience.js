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
import { MdArrowBack } from "react-icons/md";
import "../new/new.scss";
import "./update.scss";

const UpdateExperience = () => {

    const navigate = useNavigate();
    const id = useParams();
    const [show, setShow] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);


    const [name, setName] = useState("")
    const [start_date, setStart_date] = useState("")
    const [end_date, setEnd_date] = useState("")
    const [campany, setCampany] = useState("")
    const [description, setDescription] = useState("")
    const [candidate, setCandidate] = useState([])


    useEffect(() => {
        console.log("id education", id)
        fetch(`http://127.0.0.1:8000/user/experiences/${id.experienceId}`)
            .then((data) => data.json())
            .then((data) => {
                setName(data.name);
                setCampany(data.campany);
                setStart_date(data.start_date);
                setEnd_date(data.end_date);
                setDescription(data.description);
                setCandidate(data.candidate)
            })

    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSuccessMessage("experience updated successfully")
        let formField = new FormData();
        formField.append('name', name);
        formField.append('campany', campany);
        formField.append('start_date', start_date);
        formField.append('end_date', end_date);
        formField.append('description', description);
        formField.append('candidate', candidate);

        const response = await axios({
            method: 'PUT',
            url: `http://127.0.0.1:8000/user/experiences/${id.experienceId}/`,
            data: formField
        })
        console.log("startus", response.status)
        if (response.status === 201) {
            setSuccessMessage("Experience modifiee Avec success")
            setShow(true)
        }


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
                        <h1 className="newtitle">Modifier Experience </h1>
                    </div>
                    <form onSubmit={handleSubmit}>
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
                                    <button className="newbutton" type="submit">Modifier</button>
                                </Col>
                            </Row>

                        </Container>
                    </form>
                    <div>
                        <Link to={`/candidates/${id.candidateId}`} style={{ textDecoration: "none" }}>
                            <span className="back"><MdArrowBack className="icon" />Retour</span>
                        </Link>

                    {/*</div>*/}
                    </div>

                </div>
            </div>

        </div>
    )
}
export default UpdateExperience;