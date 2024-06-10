import React, { useState, useEffect, useContext } from 'react';
import AuthContext from "../../context/AuthContext"
import { Link, useParams, useNavigate } from 'react-router-dom';
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

const NewCandidateInterview = () => {
    let { user, authTokens, companyID, logoutUser } = useContext(AuthContext)
    const [show, setShow] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    let [managers, setManagers] = useState([])
    const id = useParams();

    const [name, setName] = useState("")
    const [company, setCompany] = useState([])
    const [responsable, setResponsable] = useState([])
    const [responsables, setResponsables] = useState([])
    const [candidate, setCandidate] = useState([])

    const navigate = useNavigate();


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
            setCandidate(id.candidateId)
            console.log("companyid", companyID)
            setCompany(companyID)
        }
        else if (response.statusText === 'Unauthorized') {
            console.log(" ERROR ")
        }

    }

    const handleChangeNormalSelect = (event) => {
        const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
        setResponsables(selectedOptions);
    };


    const handleSubmit = (event) => {
        event.preventDefault();
        const data = { name, company, responsable: responsables, candidate };

        fetch('http://127.0.0.1:8000/user/interviewscreate/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((data) => {
                navigate('/interviews')
            })
            .catch((error) => {
                // Handle error
                console.log("somthing wrong")
            });
    };

    //const handleChangeNormalSelect = e => {
    //    const updatedOptions = [...e.target.options]
    //        .filter(option => option.selected)
    //        .map(x => x.value);
    //    console.log("updatedOptions", updatedOptions);
    //    setResponsable(updatedOptions);
    //};

    useEffect(() => {
        getManagers()

    }, [])


    const addInterview = async (e) => {
        e.preventDefault()
        let formField = new FormData();

        formField.append('name', name);
        formField.append('company', company);
        formField.append('responsable', responsable);
        formField.append('candidate', candidate);


        await axios({
            method: 'POST',
            url: `http://127.0.0.1:8000/user/interviewscreate/`,
            data: formField,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
        }).then(response => {
            console.log("response", response)
            setSuccessMessage("Interview Ajoute Avec success")
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
                        <h1 className="newtitle">Ajouter Interview </h1>
                    </div>

                    <form >
                        <Container>
                            <Row>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Nom</Form.Label>
                                    <Form.Control type="text" name="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Participants</Form.Label>
                                    <Form.Select value={responsables} name="responsable" onChange={handleChangeNormalSelect} multiple>
                                        {managers.map(option => (
                                            <option key={option.id} value={option.id}>
                                                {option.user.first_name} {option.user.last_name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Row>

                            <Row>
                                <Col md={{ span: 6, offset: 4 }}>
                                    <button className="newbutton" type="submit" onClick={handleSubmit}>Ajouter</button>
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

export default NewCandidateInterview