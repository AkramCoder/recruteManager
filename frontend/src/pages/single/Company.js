import React, { useState, useEffect, useContext } from 'react';

import AuthContext from "../../context/AuthContext"
import Navbar from "../../components/navbar/Navbar"
import Sidebar from "../../components/sidebar/Sidebar"
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { API_URL } from '../../constants';
import "./single.scss";


const Company = () => {

    let { user, authTokens, logoutUser, companyID } = useContext(AuthContext)
    let [customuser, setCustomuser] = useState([])
    let [manager, setManager] = useState([])
    let [companyId, setCompanyId] = useState("")

    let [company, setCompany] = useState([]);
    let [jobs, setJobs] = useState([]);
    let [managers, setManagers] = useState([]);
    let [address, setadress] = useState([]);
    let [wilaya, setWilaya] = useState([]);
    let [commune, setCommune] = useState([]);
    let [totalManager, setTotalmanagers] = useState([]);
    let [totalOffers, setTotalOffers] = useState([]);
    let [totalCandidates, setTotalCandidates] = useState([]);
    let [totalCv, setTotalCv] = useState([]);

    const [candidateIDs, setCandidateIDs] = useState('')
    

   
    let getManager = async () => {
        console.log("user", user.user_id)
        console.log("token in fetch", String(authTokens.access))
        let response = await fetch(`${API_URL}user/managercurrent/${user.user_id}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            }
        })
        let data = await response.json()
        console.log('managerData', data)
        if (response.status === 200) {
            setCustomuser(data)
            setManager(data.manager)
            setCompanyId(data.manager.company)

        } else if (response.statusText === 'Unauthorized') {
            console.log(" ERROR ")
        }

    }

    const getTotalManager = async () => {
        const requestOptions = {
            method: 'GET', // HTTP method (GET, POST, etc.)
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + String(authTokens.access)
            }, // Headers object
            // Other properties like body for POST requests
        };
        await fetch(`http://localhost:8000/user/managersDetails/${manager.id}`, requestOptions)
            .then((data) => data.json())
            .then((data) => {
                setTotalmanagers(data.length)

            }) 
    }

    const getOffers = async () => {
        console.log("user", user.user_id)
        console.log("token in fetch", String(authTokens.access))
        let response = await fetch(`http://127.0.0.1:8000/company/companyoffers/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            }
        })
        let data = await response.json()

        if (response.status === 200) {
            setTotalOffers(data.length)

        } else if (response.statusText === 'Unauthorized') {
            console.log(" ERROR ")
        }
    }

    const getCandidates = async () => {
        let response = await fetch(`http://127.0.0.1:8000/user/candidateCompanylist/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            }
        })
        let data = await response.json()

        if (response.status === 200) {
            setTotalCandidates(data.length)

        } else if (response.statusText === 'Unauthorized') {
            console.log(" ERROR ")
        }

    }

    const getCVs = async () => {
        console.log(candidateIDs)
        let response = await fetch(`http://127.0.0.1:8000/user/api/get-cvs-for-candidates/12,13/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            }
        })
        let data = await response.json()

        if (response.status === 200) {
            setTotalCv(data.length)

        } else if (response.statusText === 'Unauthorized') {
            console.log(" ERROR ")
        }

    }

    const getCandidatesIds = async () => {
        let response = await fetch(`http://127.0.0.1:8000/user/candidateCompanylist/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            }
        })
        let data = await response.json()

        if (response.status === 200) {
            let ids = ''
            data.forEach(item => {
                if (ids.length === 0) {
                    ids = ids + item['id']
                    console.log(ids)
                } else {
                    ids = ids + "," + item['id']
                }
            });
            console.log(ids)
            setCandidateIDs(ids)
            await getCVs()
        } else if (response.statusText === 'Unauthorized') {
            console.log(" ERROR ")
        }

    }

    useEffect(() => {
        console.log(" company id from contexts",companyID)
        getManager()
        console.log("we will get the compan")
        fetch(`${API_URL}company/company/${companyID}`)
            .then((data) => data.json())
            .then((data) => {
                console.log("company", data)
                setCompany(data);
                setJobs(data.jobs)
                console.log("jobs", data.jobs)
                setManagers(data.managers)
                setadress(data.address)
                console.log("address", data.address)
                fetch(`${API_URL}company/get-wilaya-commune-names/${data.address.wilaya}/${data.address.commune}`)
                    .then((data) => data.json())
                    .then((data) => {
                        setWilaya(data.wilaya_name)
                        setCommune(data.commune_name)
                    })
            })

            getTotalManager()
            getOffers()
            getCandidates()
            getCandidatesIds()
    }, [companyId])


    return (
        <div className="single">
            <Sidebar />
            <div className="singleContainer">
                <Navbar />
                <div className="top">
                    <div className="left">
                        <Link to={`/company/update/${companyId}`} style={{ textDecoration: "none" }}>
                            <div className="editButton">Modifier</div>
                        </Link>
                        <h1 className="title">{company.name}</h1>
                        <div className="item">
                            
                            <div className="details">
                                <div className="detailItem">
                                    <span className="itemKey">Type:</span>
                                    <span className="itemValue">{company.company_type}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Niveau:</span>
                                    <span className="itemValue">{company.level}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Site web:</span>
                                    <span className="itemValue">{company.website}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Address:</span>
                                    <span className="itemValue">{wilaya} {commune} {address.complet_adress}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="right">
                        <div className="details">
                           
                            <div className="detailItem">
                                <span className="itemKey">OFFRES D'EMPLOI:</span>
                                <span className="itemValue">   {totalOffers}</span>
                            </div>
                            <div className="detailItem">
                                <span className="itemKey">MANAGERS:</span>
                                <span className="itemValue">  {totalManager}</span>
                            </div>
                            <div className="detailItem">
                                <span className="itemKey">Candidats:</span>
                                <span className="itemValue">   {totalCandidates}</span>
                            </div>
                            <div className="detailItem">
                                <span className="itemKey">CVs:</span>
                                <span className="itemValue">   {totalCv}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bottom">
                    <h1 className="title">Modifier</h1>


                </div>
            </div>
        </div>
    )
}
export default Company;
