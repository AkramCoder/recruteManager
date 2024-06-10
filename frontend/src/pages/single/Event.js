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
import "./single.scss";

const Event = () => {
    const [successalert, setSuccessalert] = useState(false);
    const [event, setEvent] = useState("");
    const [candidat, setCandidat] = useState([]);
    const [responsable, setResponsable] = useState([]);
    //const [responsableId, setResponsableId] = useState("");
    //const [candidatId, setCandidatId] = useState("");
    //const [successalert, setSuccessalert] = useState(false);

    const id = useParams();
    const navigate = useNavigate();


    const getSingleEvent = async () => {

        const { data } = await axios.get(`http://127.0.0.1:8000/user/event-detail/${id.eventId}`)
        console.log("event ",data)
        setEvent(data)
        setResponsable(data.responsable.user)
        setCandidat(data.candidate.user)
    }

    const handleDelete = async () => {
        await axios.delete(`http://127.0.0.1:8000/user/events/${id.eventId}/`);
        setSuccessalert(true)
        navigate("/offers");
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
                        <Link to={`update/`} style={{ textDecoration: "none" }}>
                            <div className="editButton">Modifier</div>
                        </Link>
                        <h1 className="title">Information</h1>
                        <div className="item">
                            <div className="details">
                                <h1 className="itemTitle"></h1>
                                <div className="detailItem">
                                    <span className="itemKey">Evenement:</span>
                                    <span className="itemValue">{event.name}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Ajoute le :</span>
                                    <span className="itemValue">{event.added_date}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Par:</span>
                                    <span className="itemValue">{responsable.first_name} {responsable.last_name}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Pour:</span>
                                    <span className="itemValue">
                                        {candidat.first_name} {candidat.last_name}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="right">
                        <h1 className="title">Description:</h1>
                        <div className="item">
                            <div className="details">
                                <h1 className="itemTitle"></h1>
                                <div className="detailItem">
                                    <span className="itemKey">Evenement:</span>
                                    <span className="itemValue">{event.description}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bottom">
                    {/*<h1 className="title">Last Transactions</h1>*/}
                    {/*<Accordion>*/}
                    {/*    <Accordion.Item eventKey="0">*/}
                    {/*        <Accordion.Header>Supprimer</Accordion.Header>*/}
                    {/*        <Accordion.Body>*/}
                    {/*            <p> Voulais vous supprimer l'evenement " {event.name} " ?</p>*/}

                    {/*            <Button variant="danger" onClick={handleDelete}>Confirmer</Button>*/}
                    {/*        </Accordion.Body>*/}
                    {/*    </Accordion.Item>*/}
                    {/*</Accordion>*/}
                </div>
            </div>
        </div>
    );
};

export default Event;