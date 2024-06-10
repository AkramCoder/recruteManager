import Navbar from "../../components/navbar/Navbar"
import Sidebar from "../../components/sidebar/Sidebar"
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { MdArrowBack } from "react-icons/md";
import "../new/new.scss";

const UpdateEducation = () => {
    const navigate = useNavigate();
    const id = useParams();
    const [show, setShow] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

    const [title, setTitle] = useState("");
    const [establishment, setEstablishment] = useState("");
    const [start_date, setStart_date] = useState("");
    const [end_date, setEnd_date] = useState("");
    const [description, setDescription] = useState("");

    const [adress, setAdress] = useState([])


    useEffect(() => {
        console.log("id education",id)
        fetch(`http://127.0.0.1:8000/user/education/${id.educationId}`)
            .then((data) => data.json())
            .then((data) => {
                setTitle(data.title);
                setEstablishment(data.establishment);
                setStart_date(data.start_date);
                setEnd_date(data.end_date);
                setDescription(data.description);
            })

    }, [])
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        let formField = new FormData();
        formField.append('title', title);
        formField.append('establishment', establishment);
        formField.append('start_date', start_date);
        formField.append('end_date', end_date);
        formField.append('description', description);

        await axios({
            method: 'PUT',
            url: `http://127.0.0.1:8000/user/education/${id.educationId}/`,
            data: formField
        }).then(response => {
            console.log(response.data);
            setSuccessMessage("Education modifiee Avec success")
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
                        <h1 className="newtitle">Modifier Education</h1>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <Container>
                            <Row>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Titre</Form.Label>
                                    <Form.Control type="text" name="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Etablisment</Form.Label>
                                    <Form.Control type="text" name="establishment"
                                        value={establishment}
                                        onChange={(e) => setEstablishment(e.target.value)} />
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
export default UpdateEducation;