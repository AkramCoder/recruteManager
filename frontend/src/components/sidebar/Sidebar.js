import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import AuthContext from "../../context/AuthContext"
import { AiFillDashboard } from "react-icons/ai";
import { AiTwotoneSetting } from "react-icons/ai";
import { BsFillBuildingsFill } from "react-icons/bs";
import { MdWork, MdOutlineQuestionAnswer } from "react-icons/md";
import { HiUsers } from "react-icons/hi";
import { TfiFiles } from "react-icons/tfi";
import { CgProfile } from "react-icons/cg";
import { BiLogOutCircle } from "react-icons/bi";
import { BsCalendarEventFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import "./sidebar.scss"
const Sidebar = () => {
    let { user, authTokens, logoutUser } = useContext(AuthContext)

    let [customuser, setCustomuser] = useState([])
    let [manager, setManager] = useState([])

    let getManager = async () => {
        // console.log("user", user.user_id)
        console.log("token in fetch", String(authTokens))
        
        let response = await fetch(`http://127.0.0.1:8000/user/managercurrent/${user.user_id}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            }
        })
        let data = await response.json()
        console.log(data)
        if (response.status === 200) {
            setCustomuser(data)
            setManager(data.manager)
            // console.log("Adress", adress)

        } else if (response.statusText === 'Unauthorized') {
            console.log(" ERROR ")
        }

    }

    useEffect(() => {
        if(user) {
            getManager()
        }
    }, [])


    return (
        <div className="sidebar">
            <div className="top">
                <span className="logo">
                    {customuser.first_name}  {customuser.last_name}
                </span>
            </div>
            <hr/>
            <div className="center">
                <ul>
                    <p className="title">Principale</p>
                    <Link to="/" style={{ textDecoration: "none" }}>
                    <li>
                        <span><AiFillDashboard className="icon" />Dashboard</span>
                    </li>
                    </Link>
                    <p className="title">Tables</p>
                    <Link to="/offers" style={{ textDecoration: "none" }}>
                        <li>
                            <span><MdWork className="icon" />Offres</span>
                        </li>
                    </Link>
                    
                    <Link to="/managers" style={{ textDecoration: "none" }}>
                        <li>
                            <span><HiUsers className="icon" />Employes</span>
                        </li>
                    </Link>
                    <Link to="/candidates" style={{ textDecoration: "none" }}>
                        <li>
                            <span><HiUsers className="icon" />Candidats</span>
                        </li>
                    </Link>
                    <Link to="/cvs" style={{ textDecoration: "none" }}>
                        <li>
                            <span><TfiFiles className="icon" />CVs</span>
                        </li>
                    </Link>
                    <Link to="/events" style={{ textDecoration: "none" }}>
                        <li>
                            <span><BsCalendarEventFill className="icon" />Evenements</span>
                        </li>
                    </Link>
                    <Link to="/interviews" style={{ textDecoration: "none" }}>
                        <li>
                            <span><MdOutlineQuestionAnswer className="icon" />Interviews</span>
                        </li>
                    </Link>
                    <Link to="/company" style={{ textDecoration: "none" }}>
                        <li>
                            <span><BsFillBuildingsFill className="icon" />Entreprise</span>
                        </li>
                    </Link>
                    <p className="title">Utilisateur</p>
                    <Link to="/" style={{ textDecoration: "none" }}>
                        <li>
                            <span><AiTwotoneSetting className="icon" />Parametres</span>
                        </li>
                    </Link>
                    <Link to="/profile" style={{ textDecoration: "none" }}>
                        <li>
                            <span><CgProfile className="icon" />Profile</span>
                        </li>
                    </Link>
                    <Link to="/" style={{ textDecoration: "none" }}>
                        <li>
                            <span><BiLogOutCircle className="icon" />Deconnexion</span>
                        </li>
                    </Link>
                </ul>
            </div>
            <div className="bottom">
                
            </div>

        </div>
    )
    
}
export default Sidebar