import React, { useState, useEffect, useContext } from 'react';
import {Link, useNavigate, useParams } from 'react-router-dom';
import AuthContext from "../../context/AuthContext"
import axios from 'axios';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import Navbar from "../../components/navbar/Navbar"
import Sidebar from "../../components/sidebar/Sidebar"
import Alert from 'react-bootstrap/Alert';
import { MdArrowBack } from "react-icons/md";
import "./update.scss";



const UpdateOffer = () => {
    let { user, authTokens, logoutUser } = useContext(AuthContext)
    const [show, setShow] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null); 
    let [managers, setManagers] = useState([])

    const navigate = useNavigate();
    const id = useParams();

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
        }
        else if (response.statusText === 'Unauthorized') {
            console.log(" ERROR ")
        }

    }


    const [title, setTitle] = useState("")
    const [responsable, setResponsable] = useState("")
    const [dateExp, setdateExp] = useState("")
    const [delai, setDelai] = useState("")
    const [etat, setEtat] = useState("")
    const [searchedProfile, setSearchedProfile] = useState("")
    const [maintasks, setMaintasks] = useState("")
    const [standardtasks, setStandardtasks] = useState("")
    const [occasionaltasks, setOccasionaltasks] = useState("")
    const [experiencerequired, setExperiencerequired] = useState("")
    const [qualification, setQualification] = useState("")
    const [careerlevel, setCareerlevel] = useState("")
    const [salary, setSalary] = useState("")
    const [jobstatus, setJobstatus] = useState("")
    const [wilaya, setWilaya] = useState("")
    const [genderrequired, setGenderrequired] = useState("")
    const [age, setAge] = useState("")
    const [jobtype, setJobtype] = useState("")

    useEffect(() => {
        getManagers()
        loadOffers()
    }, [])

    const loadOffers = async () => {
        const response = await axios.get(`http://127.0.0.1:8000/company/joboffer/${id.offerId}`);
        console.log(response.data);
        setTitle(response.data.job_title);
        setdateExp(response.data.job_expire_date);
        setDelai(response.data.delai);
        setEtat(response.data.etat);
        setSearchedProfile(response.data.searched_profile);
        setMaintasks(response.data.Main_tasks);
        setStandardtasks(response.data.standard_tasks);
        setOccasionaltasks(response.data.occasional_tasks);
        setExperiencerequired(response.data.job_experience_required);
        setQualification(response.data.job_qualification);
        setCareerlevel(response.data.career_level);
        setSalary(response.data.job_salary_offered);
     //   setJobstatus(response.data.job_status);
        setWilaya(response.data.job_wilaya);
        setGenderrequired(response.data.job_gender_required);
        setAge(response.data.age);
        setJobtype(response.data.jobtype);
    }

    const offerUpdate = async (e) => {
        e.preventDefault();
        let formField = new FormData();


        formField.append('job_title', title);
        formField.append('job_expire_date', dateExp);
        formField.append('delai', delai);
        formField.append('etat', etat);
        formField.append('searched_profile', searchedProfile);
        formField.append('Main_tasks', maintasks);
        formField.append('standard_tasks', standardtasks);
        formField.append('occasional_tasks', occasionaltasks);
        formField.append('job_experience_required', experiencerequired);
        formField.append('job_qualification', qualification);
        formField.append('career_level', careerlevel);
        formField.append('job_salary_offered', salary);
     //   formField.append('job_status', jobstatus);
        formField.append('job_wilaya', wilaya);
        formField.append('job_gender_required', genderrequired);
        formField.append('age', age);
        formField.append('jobtype', jobtype);

        await axios({
            method: 'PUT',
            url: `http://127.0.0.1:8000/company/updatejoboffer/${id.offerId}/`,
            data: formField
        }).then(response => {
            console.log(response);
            if (response.status === 200) {
                setSuccessMessage("offre modifie avec succes")
            }

           // navigate("/offers");
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
                        <h1 className="newtitle">Modifier Offre </h1>
                    </div>
                <form >
                    <Container>
                      
                        <Row>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Titre du poste</Form.Label>
                                <Form.Control type="text" name="poste" 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Manager</Form.Label>
                                    <Form.Select value={responsable} name="responsable" onChange={(e) => setResponsable(e.target.value)}>
                                        {managers.map(option => (
                                            <option key={option.id} value={option.id}>
                                                {option.user.first_name} {option.user.last_name}
                                            </option>
                                        ))}
                                    </Form.Select>
                            </Form.Group>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Date d'experation</Form.Label>
                                    <input type="date" name="job_expire_date"
                                        value={dateExp}
                                        onChange={(e) => setdateExp(e.target.value)} />
                                </Form.Group>

                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Delai</Form.Label>
                                    <Form.Control type="text"
                                        placeholder="Delai"
                                        name="delai"
                                        value={delai}
                                        onChange={(e) => setDelai(e.target.value)} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <label>Etat:</label>
                                <select className="form-control" value={etat} onChange={(e) => setEtat(e.target.value)}>
                                    <option value={etat} >{etat}</option>
                                    <option value="Urgent" >Urgent</option>
                                    <option value="Non urgent">Urgent</option>
                                </select>
                            </Col>
                            {/*<Col>*/}
                            {/*    <label>Valide:</label>*/}
                            {/*    <select className="form-control" value={jobstatus} onChange={(e) => setJobstatus(e.target.value)}>*/}
                            {/*        <option value={jobstatus} >{jobstatus}</option>*/}
                            {/*        <option value="1" >Valide</option>*/}
                            {/*        <option value="0">Non Valide</option>*/}
                            {/*    </select>*/}
                            {/*</Col>*/}
                        </Row>
                        <Row>
                            <Col>
                                {/*<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">*/}
                                {/*    <Form.Label>Qualification</Form.Label>*/}
                                {/*    <Form.Select aria-label="Selectionner">*/}
                                {/*        <option value="Sans">Sans</option>*/}
                                {/*        <option value="Technicien">Technicien</option>*/}
                                {/*        <option value="Universitaire">Universitaire</option>*/}
                                {/*        <option value="grandeEcole">Grande ecole</option>*/}
                                {/*    </Form.Select>*/}
                                {/*</Form.Group>*/}
                                <label>Qualification:</label>
                                <select className="form-control" value={qualification} onChange={(e) => setQualification(e.target.value)}>
                                    <option value={qualification} >{qualification}</option>
                                    <option value="Sans">Sans</option>
                                    <option value="Technicien">Technicien</option>
                                    <option value="Universitaire">Universitaire</option>
                                    <option value="grandeEcole">Grande ecole</option>
                                </select>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Niveau demande</Form.Label>
                                    <Form.Select aria-label="Selectionner">
                                        <option value="Sans">Sans</option>
                                        <option value="Technicien">Technicien</option>
                                        <option value="Universitaire">Licence</option>
                                        <option value="Universitaire">Master</option>
                                        <option value="grandeEcole">Ingenieur</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Salaire</Form.Label>
                                    <Form.Control type="text" name="salary"
                                        value={salary}
                                        onChange={(e) => setSalary(e.target.value)} />
                                </Form.Group>

                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Wilaya</Form.Label>
                                    <Form.Select aria-label="Selectionner" value={wilaya} onChange={(e) => setWilaya(e.target.value)}>
                                        <option value="Adrar">Adrar</option>
                                        <option value="Bechar">Bechar</option>
                                        <option value="Oran">Oran</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col>
                                <label>Genre:</label>
                                <select className="form-control" value={genderrequired} onChange={(e) => setGenderrequired(e.target.value)}>
                                    <option value={genderrequired} >{genderrequired}</option>
                                    <option value="F">Femme</option>
                                    <option value="H">Homme</option>
                                    <option value="F/H">Les deux</option>
                                </select>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Age</Form.Label>
                                    <Form.Select aria-label="Selectionner" value={age} onChange={(e) => setAge(e.target.value)}>
                                        <option value={age}>{age}</option>
                                        <option value="2">45</option>
                                        <option value="3">50</option>
                                        <option value="4">30</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Profile recherche</Form.Label>
                                <Form.Control as="textarea" rows={3} name="searchedProfile" value={searchedProfile} onChange={(e) => setSearchedProfile(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Taches principales</Form.Label>
                                <Form.Control as="textarea" rows={3} name="maintasks" value={maintasks} onChange={(e) => setMaintasks(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Taches occasionals</Form.Label>
                                <Form.Control as="textarea" rows={3} name="occasionaltasks" value={occasionaltasks} onChange={(e) => setOccasionaltasks(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Experience demande</Form.Label>
                                <Form.Control as="textarea" rows={2} name="experiencerequired" value={experiencerequired} onChange={(e) => setExperiencerequired(e.target.value)} />
                            </Form.Group>
                        </Row>
                        <Row>
                            <Col>
                                <button className="newbutton" onClick={offerUpdate}>Modifier</button>
                            </Col>


                        </Row>
                    </Container>
                    </form>
                    <div>
                        <Link to={`/offers/`} style={{ textDecoration: "none" }}>
                            <span className="back"><MdArrowBack className="icon" />Retour</span>
                        </Link>
                    </div>
            </div>
            </div>
        </div>

    )
}

export default UpdateOffer;