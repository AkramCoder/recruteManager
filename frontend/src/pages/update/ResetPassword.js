import { useState } from "react";
import axios from "axios";
import { API_URL } from "../../constants";
import './resetPassword.scss'
import {Link, useNavigate, useParams } from 'react-router-dom';

const ResetPassword = () => {
    const navigate = useNavigate()
    const url_param = useParams();

    const [password, setPassword] = useState()

    const resetPassword = async (e) => {
        e.preventDefault()
        const data = {
            password: password,
            token: url_param.token,
            uidb64: url_param.uidb64
        }
        await axios.patch(`${API_URL}user/api/password-reset-complete/`, data)
        .then(response => {
            navigate('/login')
        })
        .catch(error => {
            console.log(error)
        })
    }
    return (
        <div className="form-container">
            <h2>Réinitialisez votre mot de passe</h2>
            <form onSubmit={resetPassword} className="password-form">
                <label className="form-label">Mot de passe
                <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} />
                </label>
                <br />
                <button className="form-button">Modifier</button>
            </form>
        </div>
    )
}

export default ResetPassword