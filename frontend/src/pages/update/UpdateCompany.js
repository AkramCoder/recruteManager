import Navbar from "../../components/navbar/Navbar"
import Sidebar from "../../components/sidebar/Sidebar"
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert';
import "../new/new.scss";
import { API_URL } from '../../constants';
import AuthContext from "../../context/AuthContext";

const UpdateCompany = () => {
    let { user, authTokens, logoutUser } = useContext(AuthContext)

    const [successalert, setSuccessalert] = useState(false);
    let [wilayaList, setWilayaList] = useState([])
    let [communeList, setCommuneList] = useState([])
    const navigate = useNavigate();
    const id = useParams();



    // const [name, setName] = useState("");
    // const [company_type, setCompany_type] = useState("");
    // const [level, setLevel] = useState("");
    // const [website, setWebsite] = useState("");

    const [address, setAddress] = useState([])

    const [wilaya, setWilaya] = useState("");
    const [commune, setCommune] = useState("");
    const [complet_adress, setComplet_adress] = useState("");

    const getWilayaList = async () => {
        try {
          const response = await axios.get(`${API_URL}company/wilayas/`);
          // Handle the response data here
          console.log(response.data);
          setWilayaList(response.data);
        } catch (error) {
          // Handle any errors that occurred during the request
          // console.error('Error fetching data:', error);
          throw error;
        }
      }
    
      const getCommuneList = async (wilaya_id) => {
        try {
          const response = await axios.get(`${API_URL}company/communes-by_wilaya/${wilaya_id}/`);
          // Handle the response data here
          console.log(response.data);
          setCommuneList(response.data);
        } catch (error) {
          // Handle any errors that occurred during the request
          // console.error('Error fetching data:', error);
          throw error;
        }
      }

      const company_type = [
        {value: 'Pub', text: 'Publique'}, 
        {value: 'Prv', text: 'Privé'}
      ]
    
      const company_level = [
        {value: 'NAT', text: 'Nationale'},
        {value: 'INT', text: 'Internationale'}
      ]
    
      const [formData, setFormData] = useState({
        name: '',
        company_type: '',
        level: '',
        website: '', 
        profile_picture: null,
        wilaya: '', 
        commune: '', 
        complet_adress: ''
      });
    
      const handleInputChange = (event) => {
        const { name, value, files } = event.target;
        if (name === 'image') {
          setFormData((formData) => ({ ...formData, profile_picture: files[0] }));
        } else if(name === 'wilaya') {
          getCommuneList(value)
          setFormData((formData) => ({ ...formData, [name]: value }));
        } else {
          setFormData((formData) => ({ ...formData, [name]: value }));
        }
        console.log(user, authTokens)
      };
    
    useEffect(() => {
        getWilayaList();
        console.log(id)
        fetch(`http://127.0.0.1:8000/company/company-adress-update/${id.companyId}`)
            .then((data) => data.json())
            .then((data) => {
                // console.log(data)
                // setName(data.name);
                // setCompany_type(data.company_type);
                // setLevel(data.level);
                // setWebsite(data.website);
                setAddress(data.address)
                // setWilaya(data.address.wilaya)
                // setCommune(data.address.commune)
                // setComplet_adress(data.address.complet_adress)
            })

    }, [])

   
    // const handleChangeLevel = (event) => {
    //     setLevel(event.target.value);
    // }
    // const handleChangeType = (event) => {
    //     setCompany_type(event.target.value);
    // }
    const handleSubmit = async (event) => {
        event.preventDefault();
        let formField = new FormData();


        formField.append('name', formData.name);
        formField.append('company_type', formData.company_type);
        formField.append('level', formData.level);
        formField.append('website', formData.website);
        formField.append('address_id', address.id);
        formField.append('wilaya', parseInt(formData.wilaya));
        formField.append('commune', parseInt(formData.commune));
        formField.append('complet_adress', formData.complet_adress);

        await axios({
            method: 'PUT',
            url: `http://127.0.0.1:8000/company/company-adress-update/${id.companyId}/`,
            data: formField
        }).then(response => {
            console.log(response.data);
            setSuccessalert(true)
        })


    }

    return (
        <div className="new">
            <Sidebar />
            <div className="newContainer">
                <Navbar />
                <Alert show={successalert} variant="success" onClose={() => setSuccessalert(false)} dismissible>
                    <Alert.Heading>les informations de l'entreprise est modifie avec success!</Alert.Heading>

                </Alert>
                <div className="newtop">

                    <div className="">
                        <h1 className="newtitle">Modifier les informations de l' entreprise </h1>
                      
                        <form>
                            <div className='inputDiv'>
                                <label>Company Name:</label>
                                <input
                                name='name'
                                type="text"
                                onChange={handleInputChange}
                                />
                                
                            </div>
                            <div className='inputDiv'>
                                <label>Company Type: </label>
                                <select className='inputDivSelect' name='company_type' onChange={handleInputChange}>
                                <option value="">---------</option>
                                {company_type.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.text}
                                    </option>
                                ))}
                                </select>
                                
                            </div>

                            <div className='inputDiv'>
                            <label>Company Level: </label>
                            <select className='inputDivSelect' name='level' onChange={handleInputChange}>
                            <option value="">---------</option>
                            {company_level.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.text}
                                </option>
                            ))}
                            </select>
                            </div>

                            <div className='inputDiv'>
                            <label>Company Website:</label>
                                <input
                                name='website'
                                type="text"
                                onChange={handleInputChange}
                                />
                            
                            </div>

                            <div className='inputDiv'>
                                <label>Company Logo: </label> 
                                <input name='image' type="file" onChange={handleInputChange} />
                                
                            </div>
                            {/*<div className="newformInput">*/}
                            {/*    <label>Type </label>*/}
                            {/*    <input type="text" className="form-control"*/}
                            {/*        name="type"*/}
                            {/*        value={company_type}*/}
                            {/*        placeholder="Type"*/}
                            {/*        onChange={(e) => setCompany_type(e.target.value)} />*/}
                            {/*</div>*/}
                            <div className='inputDiv'>
                                <label>Wilaya: </label>
                                <select className='inputDivSelect' name='wilaya' onChange={handleInputChange}>
                                <option value="">---------</option>
                                {wilayaList.map(option => (
                                    <option key={option.id} value={option.id}>
                                        {option.code} - {option.name}
                                    </option>
                                ))}
                                </select>
                            </div>

                            <div className='inputDiv'>
                                <label>Commune: </label>
                                <select className='inputDivSelect' name='commune' onChange={handleInputChange}>
                                <option value="">---------</option>
                                {communeList.map(option => (
                                    <option key={option.id} value={option.id}>
                                        {option.name}
                                    </option>
                                ))}
                                </select>
                            </div>
                            <div>
                                <label>Street address:</label>
                                    <input
                                    name='complet_adress'
                                    type="text"
                                    onChange={handleInputChange}
                                    />
                                
                            </div>
                            {/* <div className="newformInput">
                                <label>Adress complet </label>
                                <input type="text" className="form-control"
                                    name="adresse"
                                    value={complet_adress}
                                    placeholder="Type"
                                    onChange={(e) => setComplet_adress(e.target.value)} />
                            </div> */}

                            <button className="newbutton" type="submit" onClick={handleSubmit}>Modifier</button>
                        </form>
                    </div>
                    <div className="">
                        {/*<h3>Modifier l'adress</h3>*/}
                        {/*<form onSubmit={handleSubmit}>*/}
                        {/*    <div className="newformInput">*/}
                        {/*        <label>Wilaya </label>*/}
                        {/*        <input type="text"*/}
                        {/*            name="wilaya"*/}
                        {/*            value={wilaya}*/}
                        {/*            placeholder="Nom"*/}
                        {/*            onChange={(e) => setWilaya(e.target.value)} />*/}
                        {/*    </div>*/}
                        {/*    <div className="newformInput" >*/}
                        {/*        <label>Commune</label>*/}
                        {/*        <input type="text"*/}
                        {/*            name="commune"*/}
                        {/*            value={commune}*/}
                        {/*            placeholder="Niveau"*/}
                        {/*            onChange={(e) => setCommune(e.target.value)} />*/}
                        {/*    </div>*/}
                        {/*    <div className="newformInput">*/}
                        {/*        <label>Adress complet </label>*/}
                        {/*        <input type="text"*/}
                        {/*            name="adresse"*/}
                        {/*            value={adresse}*/}
                        {/*            placeholder="Type"*/}
                        {/*            onChange={(e) => setAdresse(e.target.value)} />*/}
                        {/*    </div>*/}
                        {/*    <button className="newbutton" type="submit">Modifier</button>*/}
                        {/*</form>*/}
                    </div>
                </div>
            </div>

        </div>
    )
}
export default UpdateCompany