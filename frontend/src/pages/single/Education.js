import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';

import Navbar from "../../components/navbar/Navbar"
import Sidebar from "../../components/sidebar/Sidebar"
import Chart from "../../components/chart/Chart";
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Accordion from 'react-bootstrap/Accordion';
import Tablecomp from "../../components/table/Tablecomp";
import DeleteModal from "../../components/modal/DeleteModal";
import "./single.scss";

const Education = () => {
    const [successalert, setSuccessalert] = useState(false);
    const [education, setEducation] = useState([]);
    const [candidat, setCandidat] = useState([]);

    const id = useParams();
    const navigate = useNavigate();

     const [idm, setIdm] = useState(null);
    const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const getSingleEvent = async () => {

        const { data } = await axios.get(`http://127.0.0.1:8000/user/education/${id.educationId}`)
        console.log("event ", data)
        setEducation(data)
        setCandidat(data.candidate.user)
    }

    const handleDelete = async () => {
        await axios.delete(`http://127.0.0.1:8000/user/education/${id.educationId}/`);
        setSuccessalert(true)
        navigate("/candidates");
    }

    useEffect(() => {
        getSingleEvent()
    }, [])
    return (
        <div className="single">
            <Sidebar />
            <div className="singleContainer">
                <Navbar />
                <div className="top">
                    <div className="left">
                        <Link to={`/educations/update/${education.id}`} style={{ textDecoration: "none" }}>
                            <div className="editButton">Modifier</div>
                        </Link>
                        <div className="deleteButton" onClick="delete">Supprimer</div>
                        
                        <h1 className="title">Information</h1>
                        <div className="item">
                            <div className="details">
                                <h1 className="itemTitle"></h1>
                                <div className="detailItem">
                                    <span className="itemKey">Evenement:</span>
                                    <span className="itemValue">{education.title}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Ajoute le :</span>
                                    <span className="itemValue">{education.establishment}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">De:</span>
                                    <span className="itemValue">{education.start_date}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">A:</span>
                                    <span className="itemValue">
                                        {education.end_date}
                                    </span>
                                </div>
                            </div>
                        </div>
                    
                        <h1 className="title">Description:</h1>
                        <div className="item">
                            <div className="details">
                                <h1 className="itemTitle"></h1>
                                <div className="detailItem">
                                    <span className="itemKey">Description:</span>
                                    <span className="itemValue">{education.description}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bottom">
                    <h1 className="title">Last Transactions</h1>
                    <Accordion>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Supprimer</Accordion.Header>
                            <Accordion.Body>
                                <p> Voulais vous supprimer l'evenement " {education.title} " ?</p>

                                <Button variant="danger" onClick={handleDelete}>Confirmer</Button>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </div>
            </div>
        </div>
    );
};

export default Education;