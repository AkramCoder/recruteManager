import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';


const Profile = () => {


    const localemail = localStorage.getItem('email');




    const [showProfile, setShowProfile] = useState(false);
    useEffect(() => {
        if (localemail) {
            setShowProfile(true);
            console.log(localemail)
        }
    })

    const [currentUser, setcurrentUser] = useState('')
    const getcurrentUser = async () => {
        const response = await axios.get(`http://localhost:8000/user/currentuser/`);
       
        setcurrentUser(response.data)
        //localStorage.setItem("data", response.data.email)
        localStorage.setItem("user", response.data)
       // console.log(currentUser)
    }

    const localdata = localStorage.getItem('user');
    useEffect(() => {
        getcurrentUser();
        console.log(JSON.stringify(localdata))
    }, [])

    
        return (
            <div>
                <p>Welcome to your Dashboard {localemail } </p>
                <p>Welcome to your Dashboard {currentUser.email } </p>
            </div>
        );
    
};

export default Profile;