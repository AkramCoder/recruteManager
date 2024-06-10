import React, { Component }  from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { signUp, updateCustomUser } from '../actions';
import { useNavigate  } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

function SignUpForm() {
  let { loginUser, user } = useContext(AuthContext)
    const navigate = useNavigate()
    if(user) {
        navigate('/')
        return
    }

  const gender = [
    {value: 'F', text: 'Femme'},
    {value: 'H', text: 'Homme'}
  ]
  
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

  const handleSubmit = (event) => {
    event.preventDefault();

    // const form = new FormData();
    // form.append('email', formData.email);
    // form.append('company_type', formData.company_type);
    // form.append('level', formData.level);
    // form.append('website', formData.website);
    // form.append('profile_picture', formData.image);

    dispatch(signUp(formData.email, formData.password, formData.confirmPassword)).then(r => {
      console.log("sign up success ======>", r)
      localStorage.setItem("sign_up_user_id", r.id);
      loginUser(formData.email, formData.password)
      navigate('/complete-signup');
      // dispatch(loginUser(formData.email, formData.password)).then(er => {
      //   console.log(er)
      //   dispatch(updateCustomUser(er.auth_token, formData.first_name, formData.last_name, formData.gender, formData.birthday, formData.phone_number, formData.profile_picture)).then(result => {
      //     console.log(result)
      //     navigate('/company/new');
      //   })
        // navigate('/company/new');
    }).catch(error => {
      console.log(error)
    })
      
      
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
      <h2>Create Account</h2>
    <form onSubmit={handleSubmit}>
    <div className="newformInput">
      <div className='inputDiv'>
        <label>Email: </label>
          <input
            name='email'
            type="email"
            onChange={handleInputChange}
          />
        
        <div>
          {error_response ? 
              formatError(error_response.data.email): 
              ''}
        </div>
      </div>
      
      <div className='inputDiv'>
        <label>Password: </label>
          <input
            name='password'
            type="password"
            onChange={handleInputChange}
          />
        
        <div>{error_response ? 
        formatError(error_response.data.password): 
        ''}
        </div>
      </div>

      <div className='inputDiv'>
        <label>Confirm Password:</label>
          <input
            name='confirmPassword'
            type="password"
            onChange={handleInputChange}
          />
        
        <div>{error_response ? 
        formatError(error_response.data.re_password) : 
        ''}
        </div>
      </div>

      {/* <div className='inputDiv'>
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
        <label>profile_picture: </label> 
        <input name='image' type="file" onChange={handleInputChange} />
        
      </div> */}
      
      <button className="newbutton" type="submit">Sign Up</button>
      </div>
    </form>
    </div>
  );
}

export default SignUpForm;
