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
import CvViewer from '../../components/CvViewer';
import PDFViewer from '../../components/PDFViewer';
import "../update/update.scss";
import NewCandidateCv from './NewCandidateCv';
import { candidateInputs } from '../../formSource';
import { API_URL } from '../../constants';



const NewCv = () => {
    let { user, authTokens, logoutUser } = useContext(AuthContext)
    let [manager, setManager] = useState([""])
    const [extractedData, setExtractedData] = useState(null)
    const [customExtractedData, setCustomExtractedData] = useState(null)

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

    const getDataFromPdf = (child_data) => {
        setExtractedData(child_data)
    }

    const getCustomDataFromPdf = (child_data) => {
        setCustomExtractedData(child_data)
    }

    const navigate = useNavigate();

    const [cv_file, setCv_file] = useState("")
    const [tags, setTags] = useState([""])
    const [treated, setTreated] = useState(false)
    const [candidate, setCandidate] = useState("")

    useEffect(() => {
        getManager()
    }, [])

    const cvTreated = () => {
        setTreated(!treated)
    }


    const getSelectedFile = (file) => {
        setCv_file(file)
    }


    const saveCv = async () => {
        let formField = new FormData();

        const retrievedCandidat = JSON.parse(localStorage.getItem('candidate'));
        console.log(retrievedCandidat)
        console.log(cv_file)

        formField.append('cv_file', cv_file);
        formField.append('tags', '');
        formField.append('treated', treated);
        formField.append('candidate', parseInt(retrievedCandidat.candidateId));

        fetch('http://localhost:8000/user/cvs/', {
        method: 'POST',
        body: formField,
        })
        .then((response) => response.json())
        .then((data) => {
            navigate('/cvs')
            console.log('Upload successful:', data);
        })
        .catch((error) => {
            console.error('Error uploading:', error);
        });

        // await axios({
        //     method: 'POST',
        //     url: `${API_URL}user/cvs/`,
        //     data: formField,
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': 'Bearer ' + String(authTokens.access)
        //     },
        // }).then(response => {
        //     setCv_file("")
        //     setTags([""])
        //     setTreated(false)
        //     localStorage.removeItem('candidate')
        //     console.log(response.data);
        //     alert("status", response.status)
        // })
    }
    return (
        <div className="new">
            <Sidebar />
            <div className="newContainer">
                <Navbar />
                {/* <div>
                    {successMessage &&
                        <Alert className="alert" variant="success" onClose={() => setShow(false)} dismissible>
                            <Alert.Heading><h6>{successMessage}</h6></Alert.Heading>

                        </Alert>}
                </div> */}
                <div className='newtop_list'>
                    <div className="newtop right-padding">
                        <div className='newtop back' style={{'margin': '0px', 'padding': '0px'}}>
                            <button onClick={cvTreated} 
                            className='treated_button' style={treated ? { color: 'white', backgroundColor: '#04e0ad' } : {}}>
                                {treated ? 'CV traité' : 'Marquer comme traite'}
                            </button>
                        </div>
                        <div className='newtop back' style={{'margin': '0px', 'padding': '0px', 'left': '0px', 'background': 'white', 'width': 'fit-content'}}>
                            <button onClick={saveCv} className='treated_button' style={{'background': 'white'}}>Sauvegarder CV</button>
                        </div>
                        <div className='block' style={{'width': '100%'}}>
                            <PDFViewer handleCallBack={getDataFromPdf} handleCustomCallBack={getCustomDataFromPdf} handelCvSelected={getSelectedFile}/>
                        </div>
                    </div>
                    <div className="newtop left-padding">
                        <div>
                            <h1 className="newtitle">Ajouter candidat </h1>
                            <NewCandidateCv inputs={candidateInputs} data={extractedData} customData={customExtractedData}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        


    )
}

export default NewCv;