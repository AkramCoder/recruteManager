import React, { useState, useEffect, useContext } from 'react';
import AuthContext from "../../context/AuthContext"

import "./widget.scss";
import { Link } from "react-router-dom";
import { MdKeyboardArrowUp } from "react-icons/md";
import { MdPersonOutline } from "react-icons/md";

const Widget = () => {
    let { user, authTokens, logoutUser } = useContext(AuthContext)
    const [offers, setOffers] = useState([])
    const [managers, setManagers] = useState([])
    const [candidats, setCandidats] = useState([])
    const [cvs, setCvs] = useState([])
    const [todayoffers, setTodayOffers] = useState([])
    const [thwiWeekOffers, setThwiWeekOffers] = useState([])
    const [thisMonthsoffers, setThisMonthsoffers] = useState([])
    const [totalOfers, setTotalOffers] = useState("")
    const [totalManagers, setTotalManagers] = useState("")
    const [totalCandidats, setTotalCandidats] = useState("")
    const [totalCvs, setTotalCvs] = useState("")
    const [today, setToday] = useState("")
    const [week, setWeek] = useState("")
    const [month, setMonth] = useState("")

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
            setOffers(data)
            setTotalOffers(data.length)

        } else if (response.statusText === 'Unauthorized') {
            console.log(" ERROR ")
        }

    }
    const getManagers = async () => {
        console.log("user", user.user_id)
        console.log("token in fetch", String(authTokens.access))
        let response = await fetch(`http://localhost:8000/user/managers/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            }
        })
        let data = await response.json()

        if (response.status === 200) {
            setManagers(data)
            setTotalManagers(data.length)

        } else if (response.statusText === 'Unauthorized') {
            console.log(" ERROR ")
        }

    }

    const getCandidats = async () => {
        let response = await fetch(`http://127.0.0.1:8000/user/candidates/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            }
        })
        let data = await response.json()

        if (response.status === 200) {
            setCandidats(data)
            setTotalCandidats(data.length)

        } else if (response.statusText === 'Unauthorized') {
            console.log(" ERROR ")
        }

    }
    const getCvs = async () => {
        let response = await fetch(`http://127.0.0.1:8000/user/cvs/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            }
        })
        let data = await response.json()

        if (response.status === 200) {
            setCvs(data)
            setTotalCvs(data.length)

        } else if (response.statusText === 'Unauthorized') {
            console.log(" ERROR ")
        }

    }

   

    useEffect(() => {
        if(user) {
            getOffers()
            getManagers()
            getCandidats()
            getCvs()
        }
        
        //getTodayOffers()
        //getThisweekOffers()
    }, [])

    //const totalJobs = localStorage.getItem('totaljobs');
    //const managers = localStorage.getItem('managers');
    return (<>
        <div className="widget">
            <div className="left">
                <span className="widgettitle">Managers</span>
                <span className="counter">{totalManagers}</span>
                <Link to="/managers" className="link" style={{ textDecoration: "none" }}>
                    <span className="link">Voir tout les managers</span>
                </Link>

            </div>
            <div className="right">
                <div className="percentage positive">
                    <MdKeyboardArrowUp />
                    20%
                </div>
                <MdPersonOutline className="iconwidget" />
            </div>
        </div>
        <div className="widget">
            <div className="left">
                <span className="widgettitle">Offers</span>
                <span className="counter">{totalOfers}</span>
                <Link to="/offers" className="link">
                    <span className="link">Voir tout les offres</span>
                </Link>
                
            </div>
            <div className="right">
                <div className="percentage positive">
                    <MdKeyboardArrowUp />
                    {today}
                </div>
                <MdPersonOutline className="iconwidget" />
            </div>
        </div>
        <div className="widget">

            <div className="left">
                <span className="widgettitle">Candidats</span>
                <span className="counter">{totalCandidats}</span>
                <Link to="/candidats" className="link">
                    <span className="link">Voir tout les candidats</span>
                </Link>
            </div>
            <div className="right">
                <div className="percentage positive">
                    <MdKeyboardArrowUp />
                    20%
                </div>
                <MdPersonOutline className="iconwidget" />
            </div>
        </div>
        <div className="widget">

            <div className="left">
                <span className="widgettitle">CVs</span>
                <span className="counter">{totalCvs}</span>
                <Link to="/cvs" className="link">
                    <span className="link">Voir tout les Cvs</span>
                </Link>
            </div>
            <div className="right">
                <div className="percentage positive">
                    <MdKeyboardArrowUp />
                    20%
                </div>
                <MdPersonOutline className="iconwidget" />
            </div>
        </div>
        </>
    )
}
export default Widget