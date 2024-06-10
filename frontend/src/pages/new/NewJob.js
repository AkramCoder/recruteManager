import React, { useState, useEffect, useContext } from 'react';

import AuthContext from "../../context/AuthContext"
import {Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { MdArrowBack } from "react-icons/md";

import Navbar from "../../components/navbar/Navbar"
import Sidebar from "../../components/sidebar/Sidebar"
import "../update/update.scss";
import { API_URL } from '../../constants';



const NewJob = () => {

    const jobEtatOptions = [
        { value: '', text: '--Choisir une option--' },
        { value: 'Urgent', text: 'Urgent' },
        { value: 'Non urgent', text: 'Non urgent' },
    ];

    const genderOptions = [
        { value: '', text: '--Choisir une option--' },
        { value: 'F', text: 'Femme' },
        { value: 'H', text: 'Homme' },
        { value: 'H/F', text: 'H/F' },
    ];

    const validjobOptions = [
        { value: '', text: '--Choisir une option--' },
        { value: '0', text: 'Non valide' },
        { value: '1', text: 'Valide' },
        
    ];

    const typeOptions = [
        { value: '', text: '--Choisir une option--' },
        { value: 'Benevole', text: 'Benevole' },
        { value: 'CDD', text: 'CDD' },
        { value: 'CDI', text: 'CDI' },
        { value: 'Freelance', text: 'Freelance' },
        { value: 'Mi-Temps', text: 'Mi-Temps' },
        { value: 'Stage', text: 'Stage' },
        { value: 'Temps plein', text: 'Temps plein' },
    ];

    const salaireOptions = [
        { value: '', text: '--Choisir une option--' },
        { value: '0 - 25000', text: 'Benevole' },
        { value: '26000 - 35000', text: '26000 - 35000' },
        { value: '36000 - 45000', text: '36000 - 45000' },
        { value: '45000 - 50000', text: '45000 - 50000' },
        { value: '50000 - 60000', text: '50000 - 60000' },
        { value: '60000 - 80000', text: '60000 - 80000' },
        { value: '+80000', text: '+80000' },
    ];

    const ageOptions = [
        { value: '', text: '--Choisir une option--' },
        { value: '18 - 25', text: '18 - 25' },
        { value: '20 - 35', text: '20 - 35' },
        { value: '25 - 50', text: '25 - 50' },
        { value: '30 - 50', text: '30 - 50' },
        { value: '25 - 50 +', text: '25 - 50 +' },
        
    ];

    const experienceOptions = [
        { value: '', text: '--Choisir une option--' },
        { value: 'Debutant', text: 'Debutant' },
        { value: '2 ans', text: '2 ans' },
        { value: '3 ans', text: '3 ans' },
        { value: '4 ans', text: '4 ans' },
        { value: '5 ans', text: '5 ans' },
        { value: '6 ans', text: '6 ans' },
        { value: '7 ans', text: '7 ans' },
        { value: '8 ans+', text: '8 ans+' },
    ];

    
    const careeroptions = [
        { value: '', text: '--Choisir une option--' },
        { value: 'Manager', text: 'Manager' },
        { value: 'Employe', text: 'Employe' },
        { value: 'Cadre', text: 'Cadre' },
        { value: 'Cadre superieur', text: 'Cadre superieur' },
        { value: 'Autre', text: 'Autre' },
    ];

    const qualificationoptions = [
        { value: '', text: '--Choisir une option--' },
        { value: 'Sans', text: 'Sans' },
        { value: 'Technicien', text: 'Technicien' },
        { value: 'Universitaire', text: 'Universitaire' },
        { value: 'Ecole superieure', text: 'Ecole superieure' },
    ];

    const delaioptions = [
        { value: '0 - 15 jours', text: '0 - 15 jours' },
        { value: '15 jours - 1 mois', text: '15 jours - 1 mois' },
        { value: '1 mois - 3 mois ', text: '1 mois - 3 mois' },
        { value: '3 mois - 6 mois ', text: '3 mois - 6 mois' },
        { value: '+ 6 mois ', text: '+ 6 mois' },
    ];
    
    const specialismOptions = [
        { value: '', text: '--Choisir une option--' },
        { value: 'Achat, Stock', text: 'Achat, Stock' },
        { value: 'Administartion, Secretariat', text: 'Administartion, Secretariat' },
        { value: 'Agriculture, Peche', text: 'Agriculture, Peche' },
        { value: 'Architecture', text: 'Architecture' },
        { value: 'Banque & Assurance', text: 'Banque & Assurance' },
        { value: 'BTP, Genie civil, Hydraulique', text: 'BTP, Genie civil, Hydraulique' },
        { value: 'Commeercial, vente', text: 'Commeercial, vente' },
    ];

    
    let { user, authTokens, logoutUser } = useContext(AuthContext)
    let [manager, setManager] = useState([])

    const [show, setShow] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    let [managers, setManagers] = useState([])
    
    const [wilayaList, setWilayaList] = useState([])

    const getWilayaList = async () => {
        try {
          const response = await axios.get(`${API_URL}company/wilayas/`);
          console.log(response.data);
          setWilayaList(response.data);
        } catch (error) {
          throw error;
        }
      }

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

    const navigate = useNavigate();

    const [title, setTitle] = useState("")
    const [dateExp, setdateExp] = useState("")
    const [responsable, setResponsable] = useState("")
    const [specialism, setSpecialism] = useState(specialismOptions[0].value)
    const [searchedProfile, setSearchedProfile] = useState("")
    const [maintasks, setMaintasks] = useState("")
    const [standardtasks, setStandardtasks] = useState("")
    const [occasionaltasks, setOccasionaltasks] = useState("")
    const [experiencerequired, setExperiencerequired] = useState(experienceOptions[0].value)
    const [delai, setDelai] = useState(delaioptions[0].value)
    const [etat, setEtat] = useState(jobEtatOptions[0].value)
    const [qualification, setQualification] = useState(qualificationoptions[0].value)
    const [careerlevel, setCareerlevel] = useState(careeroptions[0].value)
    const [salary, setSalary] = useState(salaireOptions[0].value)
    const [jobstatus, setJobstatus] = useState(validjobOptions[1].value)
    const [wilaya, setWilaya] = useState("")
    const [genderrequired, setGenderrequired] = useState(genderOptions[0].value)
    const [age, setAge] = useState(ageOptions[0].value)
    const [jobtype, setJobtype] = useState(typeOptions[0].value)

    useEffect(() => {
        getManager()
        getManagers()
        getWilayaList()
    }, [])

    
    const addOffer = async (e) => {
        e.preventDefault()
        let formField = new FormData();
        console.log(wilaya)

        formField.append('job_title', title);

        // set responsable to 2 just for test 
        formField.append('responsable', 2);
        
        formField.append('job_expire_date', dateExp);
        formField.append('specialism', specialism);
        formField.append('searched_profile', searchedProfile);
        formField.append('Main_tasks', maintasks);
        formField.append('standard_tasks', standardtasks);
        formField.append('occasional_tasks', occasionaltasks);
        formField.append('job_experience_required', experiencerequired);
        formField.append('job_qualification', qualification);
        formField.append('delai', delai);
        formField.append('etat', etat);
        formField.append('career_level', careerlevel);
        formField.append('job_salary_offered', salary);
     //   formField.append('job_status', jobstatus);
        formField.append('job_wilaya', parseInt(wilaya));
        formField.append('job_gender_required', genderrequired);
        formField.append('age', age);
        formField.append('jobtype', jobtype);


        await axios({
            method: 'POST',
            url: `http://127.0.0.1:8000/company/joboffers/`,
            data: formField,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
        }).then(response => {
            navigate('/offers')
            setSuccessMessage("Offre ajoute avec succes")
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
                        <h1 className="newtitle">Ajouter Poste </h1>
                    </div>

                <form >
                    <Container>
                        <Row>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Titre du poste</Form.Label>
                                <Form.Control type="text" name="title" 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)} />
                            </Form.Group>
                            {/* <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Manager</Form.Label>
                                    <Form.Select value={responsable} name="responsable" onChange={(e) => setResponsable(e.target.value)}>
                                        {managers.map(option => (
                                            <option key={option.id} value={option.id}>
                                                {option.user.first_name} {option.user.last_name}
                                            </option>
                                        ))}
                                    </Form.Select>
                            </Form.Group> */}
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
                            <Col>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Specialite:</Form.Label>
                                    <Form.Select value={specialism} name="specialism" onChange={(e) => setSpecialism(e.target.value)}>
                                        {specialismOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.text}
                                        </option>
                                    ))}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Etat</Form.Label>
                                    <Form.Select value={etat} name="etat" onChange={(e) => setEtat(e.target.value)}>
                                        {jobEtatOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.text}
                                        </option>
                                    ))}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Type d'emplois:</Form.Label>
                                    <Form.Select value={jobtype} name="jobtype" onChange={(e) => setJobtype(e.target.value)}>
                                        {typeOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.text}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Genre:</Form.Label>
                                <Form.Select value={genderrequired} name="etat" onChange={(e) => setGenderrequired(e.target.value)}>
                                    {genderOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.text}
                                        </option>
                                    ))}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Qualification:</Form.Label>
                                    <Form.Select value={qualification} name="qualification" onChange={(e) => setQualification(e.target.value)}>
                                        {qualificationoptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.text}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Career</Form.Label>
                                    <Form.Select value={careerlevel} name="careerlevel" onChange={(e) => setCareerlevel(e.target.value)}>
                                        {careeroptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.text}
                                        </option>
                                    ))}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Experience:</Form.Label>
                                    <Form.Select value={experiencerequired} name="experiencerequired" onChange={(e) => setExperiencerequired(e.target.value)}>
                                        {experienceOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.text}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                                {/*<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">*/}
                                {/*    <Form.Label>Valider l'offre</Form.Label>*/}
                                {/*<Form.Select value={jobstatus} name="etat" onChange={(e) => setJobstatus(e.target.value)}>*/}
                                {/*        {validjobOptions.map(option => (*/}
                                {/*        <option key={option.value} value={option.value}>*/}
                                {/*            {option.text}*/}
                                {/*        </option>*/}
                                {/*    ))}*/}
                                {/*    </Form.Select>*/}
                                {/*</Form.Group>*/}
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Salaire:</Form.Label>
                                    <Form.Select value={salary} name="salary" onChange={(e) => setSalary(e.target.value)}>
                                        {salaireOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.text}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Wilaya:</Form.Label>
                                    <Form.Select value={wilaya} name="wilaya" onChange={(e) => setWilaya(e.target.value)}>
                                    <option value="">---------</option>
                                    {wilayaList.map(option => (
                                        <option key={option.id} value={option.id}>
                                            {option.code} - {option.name}
                                        </option>
                                    ))}
                                        {/* {wilayaOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.text}
                                            </option>
                                        ))} */}
                                    </Form.Select>
                                </Form.Group>
                               
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Age:</Form.Label>
                                    <Form.Select value={age} name="age" onChange={(e) => setAge(e.target.value)}>
                                        {ageOptions.map(option => (
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
                                <Form.Label>Taches standards</Form.Label>
                                <Form.Control as="textarea" rows={3} name="standardtasks" value={standardtasks} onChange={(e) => setStandardtasks(e.target.value)} />
                            </Form.Group>
                        </Row>
                        <Row>
                            <Col>
                                <Button variant="outline-primary" type="submit" onClick={addOffer}>Ajouter</Button>
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

export default NewJob;