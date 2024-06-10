import React, { useState, useEffect , useContext} from 'react';
import AuthContext from "../../context/AuthContext"
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';

import Navbar from "../../components/navbar/Navbar"
import Alert from 'react-bootstrap/Alert';
import Sidebar from "../../components/sidebar/Sidebar"
import Chart from "../../components/chart/Chart";
import Tablecomp from "../../components/table/Tablecomp";
import DeleteConfirmationModal from "../../components/modal/DeleteConfirmationModal";
import Table from 'react-bootstrap/Table';
import Accordion from 'react-bootstrap/Accordion';
import { GrAddCircle } from "react-icons/gr";
import { API_URL } from '../../constants';

import "./single.scss";

const Candidate = () => {
    let { user, authTokens, logoutUser } = useContext(AuthContext)
    let [customuser, setCustomuser] = useState([])
    const [candidate, setCandidate] = useState([]);
    const [address, setAddress] = useState([]);
    const [events, setEvents] = useState([]);
    const [skills, setSkills] = useState([]);
    const [educations, setEducations] = useState([]);
    const [experiences, setExperiences] = useState([]);
    const [interviews, setInterviews] = useState([]);
    const [cvs, setCvs] = useState([]);
    const [successalert, setSuccessalert] = useState(false);
    const [show, setShow] = useState(false);

    let [wilaya, setWilaya] = useState([]);
    let [commune, setCommune] = useState([]);

    const id = useParams();
    const navigate = useNavigate();


    const getSingleCandidate = async () => {

        const { data } = await axios.get(`${API_URL}user/candidates/${id.candidateId}`)
        console.log("candidate",data)
        setCandidate(data)
        setCustomuser(data.user)
        setAddress(data.user.address)
        setCvs(data.cvs)
        setEducations(data.educations)
        setExperiences(data.experiences)
        setSkills(data.skills)
        setEvents(data.events)
        setInterviews(data.interviews)

        await fetch(`${API_URL}company/get-wilaya-commune-names/${data.user.address.wilaya}/${data.user.address.commune}`)
        .then((data) => data.json())
        .then((data) => {
            setWilaya(data.wilaya_name)
            setCommune(data.commune_name)
        })

    }
    useEffect(() => {
        getSingleCandidate()
    }, [])

    // delete modal  //_______________________________________________________________________________________________________________________
    // Set up some additional local state
    const [type, setType] = useState(null);
    const [idm, setIdm] = useState(null);
    const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState(null);
    const [successDeleteMessage, setSuccessDeleteMessage] = useState(null);
    const [vegetableMessage, setVegetableMessage] = useState(null);

    // Handle the displaying of the modal based on type and id
    const showDeleteModal = (type, idm, title) => {
        setType(type);
        setIdm(idm);
        setSuccessDeleteMessage(null);
        setVegetableMessage(null);

        if (type === "education") {
            setDeleteMessage(`confirmer votre action de supprission ${title}?`);
        } else if (type === "skill") {
            setDeleteMessage(`confirmer votre action de supprission ${title}?`);
        }else if (type === "experience") {
            setDeleteMessage(`confirmer votre action de supprission ${title}?`);
        }else if (type === "event") {
            setDeleteMessage(`confirmer votre action de supprission ${title}?`);
        }else if (type === "interview") {
            setDeleteMessage(`confirmer votre action de supprission ${title}?`);
        }else if (type === "cv") {
            setDeleteMessage(`confirmer votre action de supprission du cv?`);
        }

        setDisplayConfirmationModal(true);
    };

    // Hide the modal
    const hideConfirmationModal = () => {
        setDisplayConfirmationModal(false);
    };

    // Handle the actual deletion of the item
    const submitDelete = (type, idm) => {
        if (type === "education") {
         //   setDeleteMessage(`confirmer votre action de supprimer ${idm}?`);
            deleteEducation(idm)
        } else if (type === "skill") {
            setDeleteMessage(`confirmer votre action de supprimer?`);
            deleteSkill(idm)
        } else if (type === "experience") {
            setDeleteMessage(`confirmer votre action de supprimer?`);
            deleteExperience(idm)
        } else if (type === "event") {
            setDeleteMessage(`confirmer votre action de supprimer?`);
            deleteEvent(idm)
        } else if (type === "interview") {
            setDeleteMessage(`confirmer votre action de supprimer?`);
            deleteInterview(idm)
        } else if (type === "cv") {
            setDeleteMessage(`confirmer votre action de supprimer?`);
            deleteCv(idm)
        }
        setDisplayConfirmationModal(false);
    };
    //_______________________________________________________________________________________________________________________
    const deleteEducation = async (idm) => {
        await axios({
            method: 'DELETE',
            url: `http://127.0.0.1:8000/user/education/${idm}/`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
        }).then(response => {
            let updatedData = educations.filter(item => item.id !== idm);
            setEducations(updatedData)
            setSuccessDeleteMessage(`The education was deleted successfully.`);
            setDisplayConfirmationModal(false);
        }).catch(error => {
            console.log(error)
        })
        

    };

    const deleteSkill = async (idm) => {
        await axios({
            method: 'DELETE',
            url: `http://127.0.0.1:8000/user/skills/${idm}/`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
        }).then(response => {
            let updatedData = skills.filter(item => item.id !== idm);
            setSkills(updatedData)
            setSuccessDeleteMessage(`The skill was deleted successfully.`);
            setDisplayConfirmationModal(false);
        }).catch(error => {
            console.log(error)
        })

    };

    const deleteEvent = async (idm) => {
        await axios({
            method: 'DELETE',
            url: `http://127.0.0.1:8000/user/events/${idm}/`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
        }).then(response => {
            let updatedData = events.filter(item => item.id !== idm);
            setEvents(updatedData)
            setSuccessDeleteMessage(`The evenement was deleted successfully.`);
            setDisplayConfirmationModal(false);
        }).catch(error => {
            console.log(error)
        })

    };

    const deleteExperience = async (idm) => {
        await axios({
            method: 'DELETE',
            url: `http://127.0.0.1:8000/user/experiences/${idm}/`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
        }).then(response => {
            let updatedData = experiences.filter(item => item.id !== idm);
            setExperiences(updatedData)
            setSuccessDeleteMessage(`The experience was deleted successfully.`);
            setDisplayConfirmationModal(false);
        }).catch(error => {
            console.log(error)
        })

    };
    

    const deleteInterview = async (idm) => {
        console.log(idm)
        await axios({
            method: 'DELETE',
            url: `http://127.0.0.1:8000/user/interviews/${idm}/`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
        }).then(response => {
            let updatedData = interviews.filter(item => item.id !== idm);
            setInterviews(updatedData)
            setSuccessDeleteMessage(`The interview was deleted successfully.`);
            setDisplayConfirmationModal(false);
        }).catch(error => {
            console.log(error)
        })

    };

    const deleteCv = async (idm) => {
        await axios({
            method: 'DELETE',
            url: `http://127.0.0.1:8000/user/cvs/${idm}/`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
        }).then(response => {
            let updatedData = cvs.filter(item => item.id !== idm);
            setCvs(updatedData)
            setSuccessDeleteMessage(`The cv was deleted successfully.`);
            setDisplayConfirmationModal(false);
        }).catch(error => {
            console.log(error)
        })

    };


    return (
        <div className="single">
            <Sidebar />
            <div className="singleContainer">
                <Navbar />
                <div className="top">
                    <div className="left">
                        <div className="editButton">Modifier</div>
                        <div className="deleteButton">Supprimer</div>
                        <h1 className="title">Information</h1>
                        <div className="item">
                            {customuser.profile_picture ? 
                            <img
                            src={customuser.profile_picture}
                            alt=""
                            className="itemImg"
                        />: 
                        <img
                            src={require('../../user.png')}
                            alt=""
                            className="itemImg"
                        />
                        }
                            
                            <div className="details">
                                <h1 className="itemTitle">{customuser.first_name} {customuser.last_name}</h1>
                                <div className="detailItem">
                                    <span className="itemKey">Email:</span>
                                    <span className="itemValue">{customuser.email}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Phone:</span>
                                    <span className="itemValue">{customuser.phone_number}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Address:</span>
                                    <span className="itemValue"> {wilaya}{commune} {address.address}</span>
                                </div>
                               
                            </div>
                        </div>
                    </div>
                    
                </div>
                <div className="bottom">
                    <h1 className="title">Career</h1>
                    {successDeleteMessage &&
                        <Alert variant="success" onClose={() => setShow(false)} dismissible>
                            <Alert.Heading><h6>{successDeleteMessage}</h6></Alert.Heading>
                           
                        </Alert>}
                    <Accordion>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Education</Accordion.Header>
                            <Accordion.Body>
                                <div className="ajouter">
                                    <Link to={`neweducation/`} className="iconAccorion" style={{ textDecoration: "none" }}>
                                        <span>Ajouter</span>
                                    </Link>
                                </div>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Titre</th>
                                            <th>Etablissement</th>
                                            <th>Date debut</th>
                                            <th>Date fin</th>
                                            <th>description</th>
                                            <th>Voir</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {educations.map(option => (
                                            <tr key={option.id}>
                                                <td>{option.title}</td>
                                                <td>{option.establishment}</td>
                                                <td>{option.start_date}</td>
                                                <td>{option.end_date}</td>
                                                <td>{option.description}</td>
                                                <td>
                                                    <Link to={`educations/${option.id}`} style={{ textDecoration: "none" }}>
                                                        <div className="viewButton">Modifier</div>
                                                    </Link>
                                                    <div className="deleteButton"
                                                        onClick={() => showDeleteModal("education",option.id, option.title)}
                                                    >
                                                        Delete
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1" className="acch">
                            <Accordion.Header>Experiences</Accordion.Header>
                            <Accordion.Body>
                                <div className="ajouter">
                                    <Link to={`newexperience/`} className="iconAccorion" style={{ textDecoration: "none" }}>
                                        <span>Ajouter</span>
                                    </Link>
                                </div>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Titre</th>
                                            <th>Entreprise</th>
                                            <th>Date debut</th>
                                            <th>Date fin</th>
                                            <th>description</th>
                                            <th>Voir</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {experiences.map(option => (
                                            <tr key={option.id}>
                                                <td>{option.name}</td>
                                                <td>{option.campany}</td>
                                                <td>{option.start_date}</td>
                                                <td>{option.end_date}</td>
                                                <td>{option.description}</td>
                                                <td>
                                                    <Link to={`experiences/${option.id}`} style={{ textDecoration: "none" }}>
                                                        <div className="viewButton">Modifier</div>
                                                    </Link>
                                                    <div className="deleteButton"
                                                        onClick={() => showDeleteModal("experience", option.id, option.name)}
                                                    >
                                                        Delete
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="2" className="acch">
                            <Accordion.Header>Skills</Accordion.Header>
                            <Accordion.Body>
                                <div className="ajouter">
                                    <Link to={`newskill/`} className="iconAccorion" style={{ textDecoration: "none" }}>
                                        <span>Ajouter</span>
                                    </Link>
                                </div>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Titre</th>
                                            <th>Pourcentage</th>
                                            <th>description</th>
                                            <th>Voir</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {skills.map(option => (
                                            <tr key={option.id}>
                                                <td>{option.name}</td>
                                                <td>{option.percentage} %</td>
                                                <td>{option.description}</td>
                                                <td>
                                                    <Link to={`skills/${option.id}`} style={{ textDecoration: "none" }}>
                                                        <div className="viewButton">Modifier</div>
                                                    </Link>
                                                    <div className="deleteButton"
                                                        onClick={() => showDeleteModal("skill", option.id, option.name)}
                                                    >
                                                        Delete
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="3" className="acch">
                            <Accordion.Header>Evenements</Accordion.Header>
                            <Accordion.Body>
                                <div className="ajouter">
                                    <Link to={`newevent/`} className="iconAccorion" style={{ textDecoration: "none" }}>
                                        <span>Ajouter</span>
                                    </Link>
                                </div>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Titre</th>
                                            <th>Date</th>
                                            <th>Responsable</th>
                                            <th>Description</th>
                                            <th>Voir</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {events.map(option => (
                                            <tr key={option.id}>
                                                <td>{option.name}</td>
                                                <td>{option.added_date} </td>
                                                <td>{option.responsable.user.first_name} {option.responsable.user.last_name}  </td>
                                                <td>{option.description}</td>
                                                <td>
                                                    <Link to={`events/${option.id}`} style={{ textDecoration: "none" }}>
                                                        <div className="viewButton">Modifier</div>
                                                    </Link>
                                                    <div className="deleteButton"
                                                        onClick={() => showDeleteModal("event", option.id, option.name)}
                                                    >
                                                        Delete
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="4" className="acch">
                            <Accordion.Header >Interviews</Accordion.Header>
                            <Accordion.Body>
                                <div className="ajouter">
                                    <Link to={`newinterview/`} className="iconAccorion" style={{ textDecoration: "none" }}>
                                        <span>Ajouter</span>
                                    </Link>
                                </div>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Titre</th>
                                            <th>Date</th>
                                            <th>Responsables</th>
                                            <th>Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {interviews.map(option => (
                                            <tr key={option.id}>
                                                <td> {option.name}</td>
                                                <td>{option.interview_date} </td>
                                                <td> {option.responsable.map(item => (
                                                    <p key={item.id}>
                                                        {item.user.first_name} {item.user.last_name}
                                                    </p>
                                                ))}
                                                </td>
                                                <td>
                                                    <div className="cellAction">
                                                        <Link to={`interviews/${option.id}`} style={{ textDecoration: "none" }}>
                                                            <div className="viewButton">Voir</div>
                                                        </Link>
                                                        <div className="deleteButton"
                                                            onClick={() => showDeleteModal("interview", option.id, option.name)}
                                                        >
                                                            Delete
                                                        </div>
                                                        {/*<Link to={`interviews/${option.id}`} style={{ textDecoration: "none" }}>*/}
                                                        {/*    <div className="viewButton">Modifier</div>*/}
                                                        {/*</Link>*/}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="5" className="acch">
                            <Accordion.Header >CVs</Accordion.Header>
                            <Accordion.Body>
                                <div className="ajouter">
                                    <Link to="/cvs/new" className="iconAccorion" style={{ textDecoration: "none" }}>
                                        <span>Ajouter</span>
                                    </Link>
                                </div>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>CV</th>
                                            <th>Date</th>
                                            <th>status</th>
                                            <th>tags</th>
                                            <th>Voir</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cvs.map(option => (
                                            <tr key={option.id}>
                                                <td>cv </td>
                                                <td>{option.created} </td>
                                                <td>{option.status} </td>
                                                <td>{option.tags} </td>
                                                <td>
                                                    <Link to={`/cvs/${option.id}`} style={{ textDecoration: "none" }}>
                                                        <div className="viewButton">View</div>
                                                    </Link>
                                                    <div className="deleteButton"
                                                        onClick={() => showDeleteModal("cv", option.id)}
                                                    >
                                                        Delete
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                    <DeleteConfirmationModal showModal={displayConfirmationModal} confirmModal={submitDelete} hideModal={hideConfirmationModal} type={type} id={idm} message={deleteMessage} />
                </div>
            </div>
        </div>
    );
};

export default Candidate;