import React, { Component }  from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { signUp, loginUser, updateCustomUser, createManager } from '../actions';
import { useNavigate  } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';


function CompleteSignUp() {
  // let { user, authTokens, logoutUser } = useContext(AuthContext)
  let { user, authTokens, logoutUser } = useContext(AuthContext)
  const navigate = useNavigate();
    console.log('authTokens>>>>>>>', authTokens)
  const gender = [
    {value: 'F', text: 'Femme'},
    {value: 'H', text: 'Homme'}
  ]

  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const [confirmPassword, setConfirmPassword] = useState('');
  
  const [formData, setFormData] = useState({});

  const handleInputChange = (event) => {
    const { name, value, files } = event.target;
    if (name === 'image') {
        
      setFormData((formData) => ({ ...formData, profile_picture: files[0] }));
    } else {
      setFormData((formData) => ({ ...formData, [name]: value }));
    }
    console.log(formData)
  };

  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // const form = new FormData();
    // form.append('email', formData.email);
    // form.append('company_type', formData.company_type);
    // form.append('level', formData.level);
    // form.append('website', formData.website);
    // form.append('profile_picture', formData.image);
    // const response = await axios({
    //     method: 'PUT',
    //     url: `http://127.0.0.1:8000/user/api/update-user/`, 
    //     data: formData,
    //     headers: {
    //       'Content-Type': 'multipart/form-data',
    //       'Authorization': 'Bearer ' + String(authTokens.access)
    //     },
    //   });
    //   console.log(response.data)

    const managerData = {
      user: 0, 
      parent: 0,
      current_poste: formData.poste_actuel,
      previous_poste: formData.poste_precedent,
      facebook: formData.facebook,
      linkedin: formData.linkedin,
      };

    const user_id = localStorage.getItem("sign_up_user_id");
    dispatch(updateCustomUser(user_id, formData.first_name, formData.last_name, formData.gender, formData.birthday)).then(result => {
        console.log(result)
        managerData.user = user_id;
        managerData.parent = null;
        dispatch(createManager(managerData)).then(result => {
          console.log("=========>", result)
          localStorage.setItem("signup_manager_id", result.payload.id);
          navigate('/company/new');
        })
    })
        // navigate('/company/new');
      
      
      // .catch((error) => {
      //   console.error('Error dispatching login user:', error);
      // })
    // .catch((error) => {
    //   console.error('Error dispatching signup:', error)
    // })
    // .catch((error) => {
    //   // Handle the error for signup if needed
    //   console.error('Error dispatching signup:', error);
    // });
    // .then((response) => {
    //   dispatch(loginUser(email, password))
    //     .then(() => {
    //       history.pushState('/company/new/');
    //     })
    //     .catch((error) => {
    //       // Handle the error for createCompany if needed
    //       console.error('Error dispatching login user:', error);
    //     });
    // })
    // .catch((error) => {
    //   // Handle the error for signup if needed
    //   console.error('Error dispatching signup:', error);
    // });
  };

  const formatError = (error) => {
    try {
      return error.map((e, i) => (
        <div key={i}>{e}</div>
      ))
    } catch {
      return ''
    }
    
  }

  const error_response = useSelector((state) => state.managerReducer.error);

  return (
    <div className='newright'>
      <h2>Complete your informations</h2>
    <form onSubmit={handleSubmit}>
    <div className="newformInput">
      
      <div className='inputDiv'>
        <label>First Name:</label>
          <input
            name='first_name'
            type="text"
            onChange={handleInputChange}
          />
      </div>

      <div className='inputDiv'>
        <label>Last Name:</label>
          <input
            name='last_name'
            type="text"
            onChange={handleInputChange}
          />
      </div>

      <div className='inputDiv'>
        <label>Gender: </label>
        <select className='inputDivSelect' name='gender' onChange={handleInputChange}>
        <option value="">---------</option>
        {gender.map(option => (
            <option key={option.value} value={option.value}>
                {option.text}
            </option>
        ))}
        </select>
      </div>

      <div className='inputDiv'>
        <label>Birthday:</label>
          <input
            name='birthday'
            type="date"
            onChange={handleInputChange}
          />
      </div>

      <div className='inputDiv'>
        <label>Phone number:</label>
          <input
            name='phone_number'
            type="text"
            onChange={handleInputChange}
          />
      </div>

      <div className='inputDiv'>
        <label>Poste actuel:</label>
          <input
            name='poste_actuel'
            type="text"
            onChange={handleInputChange}
          />
      </div>

      <div className='inputDiv'>
        <label>Poste precedent:</label>
          <input
            name='poste_precedent'
            type="text"
            onChange={handleInputChange}
          />
      </div>

      <div className='inputDiv'>
        <label>Facebook:</label>
          <input
            name='facebook'
            type="text"
            onChange={handleInputChange}
          />
      </div>

      <div className='inputDiv'>
        <label>Linkedin:</label>
          <input
            name='linkedin'
            type="text"
            onChange={handleInputChange}
          />
      </div>

      <div className='inputDiv'>
        <label>profile_picture: </label> 
        <input name='image' type="file" onChange={handleInputChange} />
        
      </div>
      
      <button className="newbutton" type="submit">Save</button>
      </div>
    </form>
    </div>
  );
}

export default CompleteSignUp;
