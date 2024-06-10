import React, { useState, useEffect, useContext } from 'react';

import AuthContext from "../../context/AuthContext"
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import "./new.scss";
import { API_URL } from '../../constants';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import Navbar from "../../components/navbar/Navbar"
import Sidebar from "../../components/sidebar/Sidebar"

//import "../updateoffer.scss";

const NewCompany = () => {
  let { user, authTokens, logoutUser } = useContext(AuthContext)
  let [companyId, setCompanyID] = useState('')
  let [wilayaList, setWilayaList] = useState([])
  let [communeList, setCommuneList] = useState([])

  const navigate = useNavigate();

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

  useEffect(() => {
    getWilayaList();
  }, [])

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
    console.log(formData)
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    // const address = {
    //   wilaya: parseInt(formData.wilaya), 
    //   commune: parseInt(formData.commune), 
    //   complet_adress: formData.complet_address
    // }

    const form = new FormData();
    form.append('name', formData.name);
    form.append('company_type', formData.company_type);
    form.append('level', formData.level);
    form.append('website', formData.website);
    form.append('profile_picture', formData.image);

    // const data = {
    //   'adress': "gfsgfsgs",
    //   'name': formData.name,
    //   'company_type': formData.company_type,
    //   'level': formData.level,
    //   'website': formData.website,
    //   'auto': 'auto'
    // }
    // console.log(data)
   
    await axios({
        method: 'POST',
        url: `${API_URL}company/createcompany/`, 
        data: form,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' + String(authTokens.access)
        },
      }).then(async (response) => {
        console.log('Data saved successfully:', response.data);
        const newCompanyId = response.data.id
        setCompanyID(newCompanyId)
        console.log("new company id/////",newCompanyId)
        const data = {
          company: newCompanyId
        }
        const manager_id = localStorage.getItem("signup_manager_id");
        await axios({
          method: 'PUT',
          url: `${API_URL}user/managers/${manager_id}/`, 
          data: data,
          headers: {
            'Content-Type': 'application/json'
          },
        }).then(async response => {
          console.log('manager updated saved successfully:', response);
          const data = {
            company: newCompanyId,
            wilaya: parseInt(formData.wilaya), 
            commune: parseInt(formData.commune), 
            complet_adress: formData.complet_address
          }
            console.log("address data", data)
            await axios({
              method: 'POST',
              url: `${API_URL}company/addresses/`, 
              data: data,
              headers: {
                'Content-Type': 'application/json'
              },
            }).then(async response => {
              console.log('address saved successfully --', response)
            localStorage.removeItem("sign_up_user_id");
            localStorage.removeItem("signup_manager_id");
            navigate("/company")
          })
      }).catch(error => {
        console.log('Error saving data:', error)
      });
    });
  };
    // let addCompany = async () => {

    //     let formField = new FormData();

    //     formField.append('name', name);
    //     formField.append('company_type', company_type);
    //     formField.append('level', level);
    //     formField.append('website', website);

    //     await axios({
    //         method: 'POST',
    //         url: `http://127.0.0.1:8000/company/createcompany/`,
    //         data: formField,
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': 'Bearer ' + String(authTokens.access)
    //         },
    //     }).then(response => {
    //         console.log(response.data);
    //         navigate("/company")
    //     })
    // }
  
    return (
        <div className="newright">
            <h2>Create a Company</h2>
            <form>
                <div className="newformInput">
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
                    name='complet_address'
                    type="text"
                    onChange={handleInputChange}
                    />
                
                </div>

                <div className='inputDiv'>
                <button className="newbutton" type="submit" onClick={handleSubmit}
                >Ajouter</button>
                </div>

                </div>
            </form>
        </div>
    )


}

export default NewCompany;