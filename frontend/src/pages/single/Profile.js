import React, { useState, useEffect, useContext } from 'react';

import AuthContext from "../../context/AuthContext"
import Navbar from "../../components/navbar/Navbar"
import Sidebar from "../../components/sidebar/Sidebar"
import Chart from "../../components/chart/Chart";
import Tablecomp from "../../components/table/Tablecomp";
import { API_URL } from '../../constants';
import "./single.scss";

const Profile = () => {
    let { user, authTokens, logoutUser } = useContext(AuthContext)

    let [customuser, setCustomuser] = useState([])
    let [manager, setManager] = useState([])
    let [adress, setAdress] = useState([])
    let [wilaya, setWilaya] = useState([])
    let [commune, setCommune] = useState([])

    let getManager = async () => {
        console.log("user",user.user_id)
        console.log("token in fetch", String(authTokens.access))
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
            setAdress(data.address)
            fetch(`${API_URL}company/get-wilaya-commune-names/${data.address.wilaya}/${data.address.commune}`)
                    .then((data) => data.json())
                    .then((data) => {
                        setWilaya(data.wilaya_name)
                        setCommune(data.commune_name)
                    })
           // console.log("Adress", adress)

        } else if (response.statusText === 'Unauthorized') {
            console.log(" ERROR ")
        }

    }

    useEffect(() => {
        getManager()
    }, [])

    return (
        <div className="single">
            <Sidebar />
            <div className="singleContainer">
                <Navbar />
                <div className="top">
                    <div className="left">
                        <div className="editButton">Modifier</div>
                        <h1 className="title">{customuser.first_name}  {customuser.last_name}</h1>
                        <div className="item">
                            <img
                                src={customuser.profile_picture}
                                alt=""
                                className="itemImg"
                            />
                            <div className="details">
                                <h1 className="itemTitle"></h1>
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
                                    <span className="itemValue">
                                        {wilaya}  {commune}  {adress.address}
                                    </span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Pays:</span>
                                    <span className="itemValue"> { adress.country}</span>
                                </div>
                            </div>
                            <div className="vr"></div>
                            <div className="item">
                                <div className="details">
                                    <div className="detailItem">
                                        <span className="itemKey">Post Actuel:</span>
                                        <span className="itemValue">{manager.current_poste}</span>
                                    </div>
                                    <div className="detailItem">
                                        <span className="itemKey">Post precedent:</span>
                                        <span className="itemValue">{manager.previous_poste}</span>
                                    </div>
                                    <div className="detailItem">
                                        <span className="itemKey">Facebook:</span>
                                        <span className="itemValue">
                                            {manager.facebook}
                                        </span>
                                    </div>
                                    <div className="detailItem">
                                        <span className="itemKey">LinkedIN:</span>
                                        <span className="itemValue">{manager.linkedin}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                  
                </div>
                <div className="bottom">
                    <h1 className="title">Last Transactions</h1>
                    <Tablecomp />
                </div>
            </div>
        </div>
    );
};

export default Profile;