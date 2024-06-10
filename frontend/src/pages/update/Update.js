import Navbar from "../../components/navbar/Navbar"
import Sidebar from "../../components/sidebar/Sidebar"
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
//import RiFolderUploadLine from "react-icons/rifolderupload";
import "../new/new.scss";
import { useDispatch } from 'react-redux';
import { signUp, createManager, createAddress } from "../../actions";

const Update = () => {

    const navigate = useNavigate();
    const { id } = useParams();

    //const [file, setFile] = useState("");
    //const [formData, setFormData] = useState({});

    const [name, setName] = useState("");
    const [company_type, setCompany_type] = useState("");
    const [level, setLevel] = useState("");
    const [website, setWebsite] = useState("");

    useEffect(() => {
        loadCompany()
    }, [])

    const loadCompany = async () => {
        const response = await axios.get(`http://127.0.0.1:8000/company/company/${id}`);
        console.log(response.data.name);
        setName(response.data.name);
        setCompany_type(response.data.company_type);
        setLevel(response.data.level);
        setWebsite(response.data.website);

    }

    const handleSubmit = async () => {
        let formField = new FormData();


        formField.append('name', name);
        formField.append('company_type', company_type);
        formField.append('level', level);
        formField.append('website', website);

        await axios({
            method: 'PUT',
            url: `http://127.0.0.1:8000/company/company/${id}/`,
            data: formField
        }).then(response => {
            console.log(response.data);
            navigate("/company/");
        })


    }

    return (
        <div className="new">
            <Sidebar />
            <div className="newContainer">
                <Navbar />
                <div className="newtop">
                    <h1 className="newtitle">Modifier les informations de l' entreprise </h1>
                </div>
                <div className="newbottom">
                   
                    <div className="">
                        <h3>Modifier les infos</h3>
                        <form onSubmit={handleSubmit}>
                                <div className="newformInput">
                                    <label>Nom de l'entreprise </label>
                                    <input type="text"
                                    name="name"
                                    value={name}
                                        placeholder="Nom"
                                    onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className="newformInput" >
                                    <label>Niveau</label>
                                    <input type="text"
                                    name="Niveau"
                                    value={level}
                                    placeholder="Niveau"
                                    onChange={(e) => setLevel(e.target.value)} />
                                </div>
                                <div className="newformInput">
                                    <label>Type </label>
                                    <input type="text"
                                    name="type"
                                    value={company_type}
                                    placeholder="Type"
                                    onChange={(e) => setCompany_type(e.target.value)} />
                                </div>
                                <div className="newformInput">
                                    <label>Site web </label>
                                    <input type="text"
                                    name="name"
                                    value={website}
                                        placeholder="Site web"
                                    onChange={(e) => setWebsite(e.target.value)} />
                                </div>

                            <button className="newbutton" type="submit">Modifier</button>
                        </form>
                    </div>
                    <div className="">
                        <h3>Modifier l'adress</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="newformInput">
                                <label>Nom de l'entreprise </label>
                                <input type="text"
                                    name="name"
                                    value={name}
                                    placeholder="Nom"
                                    onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className="newformInput" >
                                <label>Niveau</label>
                                <input type="text"
                                    name="Niveau"
                                    value={level}
                                    placeholder="Niveau"
                                    onChange={(e) => setLevel(e.target.value)} />
                            </div>
                            <div className="newformInput">
                                <label>Type </label>
                                <input type="text"
                                    name="type"
                                    value={company_type}
                                    placeholder="Type"
                                    onChange={(e) => setCompany_type(e.target.value)} />
                            </div>
                            <div className="newformInput">
                                <label>Site web </label>
                                <input type="text"
                                    name="name"
                                    value={website}
                                    placeholder="Site web"
                                    onChange={(e) => setWebsite(e.target.value)} />
                            </div>

                            <button className="newbutton" type="submit">Modifier</button>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    )
}
export default Update