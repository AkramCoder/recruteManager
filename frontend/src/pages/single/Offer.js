import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from "../../components/navbar/Navbar"
import Sidebar from "../../components/sidebar/Sidebar"
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import "./single.scss";

const Offer = () => {

    const [offer, setOffer] = useState("");
    const [selectedid, setSelectedid] = useState("");
    const [successalert, setSuccessalert] = useState(false);

    const id = useParams();
    const navigate = useNavigate();


    const getSingleOffer = async () => {
        
        const { data } = await axios.get(`http://127.0.0.1:8000/company/joboffer/${id.offerId}`)
        console.log(data)
        setOffer(data)
    }

    const handleDelete = async () => {
        await axios.delete(`http://127.0.0.1:8000/company/joboffer/${id.offerId}/`);
        setSuccessalert(true)
        navigate("/offers");
    }

    const handleValidate = async () => {
        await axios.put(`http://127.0.0.1:8000/company/validerjoboffer/${id.offerId}/`);
        setSuccessalert(true);
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
    useEffect(() => {
        getSingleOffer();
        setSelectedid(id.offerId)
    }, [])

    return (
        <div className="single">
            <Sidebar />
            <div className="singleContainer">
                <Navbar />
                <Alert show={successalert} variant="success" onClose={() => setSuccessalert(false)} dismissible>
                    <Alert.Heading>l'offre d'emplois est valide avec succes!</Alert.Heading>
                  
                </Alert>
                <div className="top">
                    <div className="left">
                        <Link to={`/offers/update/${offer.id}`} style={{ textDecoration: "none"}}>
                            <div className="editButton">Modifier</div>
                        </Link>
                        <h1 className="title">{offer.job_title}</h1>
                        <div className="item">
                            <div className="details">
                                <h1 className="itemTitle"></h1>
                                <div className="detailItem">
                                    <span className="itemKey">Date de creation:</span>
                                    <span className="itemValue">{offer.job_creation_date}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Date d'expiration':</span>
                                    <span className="itemValue">{offer.job_expire_date}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Delai:</span>
                                    <span className="itemValue">
                                        {offer.delai}
                                    </span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Status:</span>
                                    <span className="itemValue">{offer.etat}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="right">
                        <h1 className="title">Requirements</h1>
                        <div className="item">
                           
                            <div className="details">
                                <div className="detailItem">
                                    <span className="itemtask">Qualification:</span>
                                    <span className="itemValue">{offer.job_qualification}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Niveau demande:</span>
                                    <span className="itemValue">{offer.career_level}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Salaire minimum:</span>
                                    <span className="itemValue">
                                        {offer.job_salary_offered}
                                    </span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Genre:</span>
                                    <span className="itemValue">{offer.job_gender_required}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Age:</span>
                                    <span className="itemValue">{offer.age}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Wilaya:</span>
                                    <span className="itemValue">{offer.job_wilaya}</span>
                                </div>
                            </div>
                    </div>
                    </div>
                </div>
                <div className="bottom">
                    <Container>
                        <h1 className="title">Les taches</h1>
                        <Row>
                            <Col>
                                
                                <div className="taches">
                                    <Accordion className="righttasks">
                                        <Accordion.Item eventKey="0">
                                            <Accordion.Header> <span className="itemtask">Experiences demandes</span></Accordion.Header>
                                            <Accordion.Body>
                                                <span className="itemValue">{offer.job_experience_required}</span>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                        <Accordion.Item eventKey="1">
                                            <Accordion.Header><span className="itemtask">Profile recherche</span></Accordion.Header>
                                            <Accordion.Body>
                                                <span className="itemValue">{offer.searched_profile}</span>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                        <Accordion.Item eventKey="2">
                                            <Accordion.Header><span className="itemtask">Taches principales</span></Accordion.Header>
                                            <Accordion.Body>
                                                <span className="itemValue">{offer.Main_tasks}</span>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                        <Accordion.Item eventKey="3">
                                            <Accordion.Header><span className="itemtask">Taches occasionel</span></Accordion.Header>
                                            <Accordion.Body>
                                                <span className="itemValue">{offer.occasional_tasks}</span>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                        <Accordion.Item eventKey="4">
                                            <Accordion.Header><span className="itemtask">Taches Standard</span></Accordion.Header>
                                            <Accordion.Body>
                                                <span className="itemValue">{offer.standard_tasks}</span>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                </div>
                            </Col>
                            <Col>
                                <div className="supprimer">
                                    <Accordion>
                                        <Accordion.Item eventKey="0">
                                            <Accordion.Header>Valider</Accordion.Header>
                                            <Accordion.Body>
                                                <p> Voulais vous valider cette offre " {offer.job_title} " ?</p>

                                                <Button variant="success" onClick={handleValidate}>Confirmer</Button>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                    <Accordion>
                                        <Accordion.Item eventKey="0">
                                            <Accordion.Header>Supprimer</Accordion.Header>
                                            <Accordion.Body>
                                                <p> Voulais vous supprimer l'offre " {offer.job_title} " ?</p>

                                                <Button variant="danger" onClick={handleDelete}>Confirmer</Button>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                    
                   
                </div>
            </div>
        </div>
    );
};

export default Offer;