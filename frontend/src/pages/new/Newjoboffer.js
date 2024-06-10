import React, { useState, useEffect, useContext } from 'react';

import AuthContext from "../../context/AuthContext"
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import Navbar from "../../components/navbar/Navbar"
import Sidebar from "../../components/sidebar/Sidebar"
import "../update/update.scss";



const Newjoboffer = () => {

    let { user, authTokens, logoutUser } = useContext(AuthContext)
    let [manager, setManager] = useState([])

    const delaioptions = [
        { value: '15', text: '15' },
        { value: '0 - 15 jours', text: '0 - 15 jours' },
        { value: '15 jours - 1 mois', text: '15 jours - 1 mois' },
        { value: '1 mois - 3 mois ', text: '1 mois - 3 mois' },
        { value: '3 mois - 6 mois ', text: '3 mois - 6 mois' },
        { value: '+ 6 mois ', text: '+ 6 mois' },
    ];

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

    const navigate = useNavigate();

    const [title, setTitle] = useState("")
    const [dateExp, setdateExp] = useState("")
    const [delai, setDelai] = useState(delaioptions[0].value)
    const [searchedProfile, setSearchedProfile] = useState("")
    const [maintasks, setMaintasks] = useState("")
    const [standardtasks, setStandardtasks] = useState("")
    const [occasionaltasks, setOccasionaltasks] = useState("")
    const [experiencerequired, setExperiencerequired] = useState("")

   

    useEffect(() => {

        getManager()
    }, [])


    const addOffer = async () => {
        let formField = new FormData();

        formField.append('job_title', title);
      
        formField.append('searched_profile', searchedProfile);
        formField.append('job_expire_date', dateExp);
        formField.append('Main_tasks', maintasks);
        formField.append('standard_tasks', standardtasks);
        formField.append('occasional_tasks', occasionaltasks);
        formField.append('job_experience_required', experiencerequired);


        await axios({
            method: 'POST',
            url: `http://127.0.0.1:8000/company/jobofferscreate/`,
            data: formField,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
        }).then(response => {
            console.log(response.data);
            navigate("/");
        })

    }
 

    return (
        <div className="single">
            <Sidebar />
            <div className="singleContainer">
                <Navbar />
                <form >
                    <Container>
                        <Row>
                            <h3>Ajouter une offre d'emploi  {user.user_id}</h3>
                        </Row>
                        <Row>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Titre du poste</Form.Label>
                                <input type="text" name="title" size="lg"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)} />
                            </Form.Group>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Date d'experation</Form.Label>
                                    <Form.Control type="date" name="dateExp"
                                        value={dateExp}
                                        onChange={(e) => setdateExp(e.target.value)} />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Delai:</Form.Label>
                                    <Form.Select value={delai} name="delai" onChange={(e) => setDelai(e.target.value)}>
                                        {delaioptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.text}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Taches principales</Form.Label>
                                <Form.Control as="textarea" rows={3} name="maintasks" value={maintasks} onChange={(e) => setMaintasks(e.target.value)} />
                            </Form.Group>
                        </Row>
                        <Row>

                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Taches principales</Form.Label>
                                <Form.Control as="textarea" rows={3} name="searchedProfile" value={searchedProfile} onChange={(e) => setSearchedProfile(e.target.value)} />
                            </Form.Group>
                        </Row>
                        <Row>

                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Taches principales</Form.Label>
                                <Form.Control as="textarea" rows={3} name="standardtasks" value={standardtasks} onChange={(e) => setStandardtasks(e.target.value)} />
                            </Form.Group>
                        </Row>
                        <Row>

                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Taches principales</Form.Label>
                                <Form.Control as="textarea" rows={3} name="occasionaltasks" value={occasionaltasks} onChange={(e) => setOccasionaltasks(e.target.value)} />
                            </Form.Group>
                        </Row>
                        <Row>

                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Taches principales</Form.Label>
                                <Form.Control as="textarea" rows={3} name="experiencerequired" value={experiencerequired} onChange={(e) => setExperiencerequired(e.target.value)} />
                            </Form.Group>
                        </Row>
                        <Row>
                            <Col>
                                <Button variant="outline-primary" type="submit" onClick={addOffer}>Ajouter</Button>
                            </Col>


                        </Row>
                    </Container>
                </form>
            </div>
        </div>
    )
}

export default Newjoboffer;