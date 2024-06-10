import Navbar from "../../components/navbar/Navbar"
import Sidebar from "../../components/sidebar/Sidebar"
import Chart from "../../components/chart/Chart";
import Tablecomp from "../../components/table/Tablecomp";
import "./single.scss";

import { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import AuthContext from "../../context/AuthContext";
import axios from 'axios';
import { API_URL } from "../../constants";

const Single = () => {
    const id = useParams();
    let { user, authTokens, logoutUser, manager } = useContext(AuthContext)

    const [firstName, setFirstName] = useState()
    const [lastName, setLastName] = useState()
    const [email, setEmail] = useState()
    const [phone1, setPhone1] = useState()
    const [phone2, setPhone2] = useState()
    const [genderSelected, setGenderSelected] = useState()
    const [birthday, setBirthday] = useState()
    const [posteActuel, setPosteActuel] = useState()
    const [postePrecedent, setPostePrecedent] = useState()
    const [facebook, setFacebook] = useState()
    const [linkedin, setLinkedin] = useState()
    const [country, setCountry] = useState()
    const [wilaya, setWilaya] = useState()
    const [commune, setCommune] = useState()
    const [zipCode, setZipCode] = useState()
    const [address, setAddress] = useState()

    const getManagerData = async () => {
        const requestOptions = {
            method: 'GET', 
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + String(authTokens.access)
            }, 
        };
        await fetch(`${API_URL}user/currentmanager/${id.managerId}`, requestOptions)
            .then((data) => data.json())
            .then(async (data) => {
                setFirstName(data.user.first_name)
                setLastName(data.user.last_name)
                setEmail(data.user.email)
                setPhone1(data.user.phone_number)
                await fetch(`${API_URL}user/addresses/${data.user.id}`)
                .then((data) => data.json())
                .then(response => {
                    setCountry(response.country)
                    setAddress(response.address)
                    setZipCode(response.zip_code)
                    fetch(`${API_URL}company/get-wilaya-commune-names/${response.wilaya}/${response.commune}`)
                    .then((data) => data.json())
                    .then((data) => {
                        console.log(data.wilaya_name)
                        setWilaya(data.wilaya_name)
                        setCommune(data.commune_name)
                    })
                })
                .catch(error => {
                    console.log(error)
                })
                // setFirstName(data.user.first_name)
                // setLastName(data.user.last_name)
                // setEmail(data.user.email)
                // try {
                //     setPhone1(data.user.phone_number[0])
                //     setPhone2(data.user.phone_number[1])
                // } catch (error) {
                //     console.log(error)
                // }
                // setGenderSelected(data.user.gender)
                // setBirthday(data.user.birthday)
                // setPosteActuel(data.current_poste)
                // setPostePrecedent(data.previous_poste)
                // setFacebook(data.facebook)
                // setLinkedin(data.linkedin)

            }) 
    }

    useEffect(() => {
        getManagerData()
      }, []);

    return (
        <div className="single">
            <Sidebar />
            <div className="singleContainer">
                <Navbar />
                <div className="top">
                    <div className="left">
                        <div className="editButton">Edit</div>
                        <h1 className="title">Information</h1>
                        <div className="item">
                            <img
                                src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"
                                alt=""
                                className="itemImg"
                            />
                            <div className="details">
                                <h1 className="itemTitle">{lastName} {firstName}</h1>
                                <div className="detailItem">
                                    <span className="itemKey">Email:</span>
                                    <span className="itemValue">{email}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Phone:</span>
                                    <span className="itemValue">{phone1}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Address:</span>
                                    <span className="itemValue">
                                        {wilaya} {commune} {address} {zipCode} 
                                    </span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Country:</span>
                                    <span className="itemValue">{country}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className="right">
                        <Chart aspect={3 / 1} title="User Spending ( Last 6 Months)" />
                    </div> */}
                </div>
                <div className="bottom">
                    <h1 className="title">Last Transactions</h1>
                    <Tablecomp />
                </div>
            </div>
        </div>
    );
};

export default Single;