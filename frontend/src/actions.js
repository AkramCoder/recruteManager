import axios from 'axios';
import { API_URL } from './constants';


export const signUp = (email, password, confirmPassword, first_name, last_name, gender, birthday, phone_number, profile_picture) => {
  return async (dispatch) => {
    dispatch({ type: 'SIGNUP_USER_REQUEST' });
    try {
      console.log('birthday--->', birthday)
      const data = {
        email: email,
        password: password,
        re_password: confirmPassword,
      }

      const response = await axios.post(`${API_URL}user/api/users/`, data);
      // const response = await axios.post(`${API_URL}user/api/auth/register/`, data);
      console.log(response.data)
      // history.pushState('/login')
      dispatch({ type: 'SIGNUP_USER_SUCCESS', payload: response.data });
      return response.data
    } catch (error) {
      console.log(error)
      return dispatch({ type: 'SIGNUP_USER_FAILURE', payload: error.response });
    }
  };
  };

  export const updateCustomUser = (user_id, first_name, last_name, gender, birthday) => {
    return async (dispatch) => {
      dispatch({ type: 'updateCustom_USER_REQUEST' });
      try {
  
        const data = {
          id: user_id,
          first_name: first_name, 
          last_name: last_name,
          gender: gender,
          birthday: birthday,
        }
        const response = await axios({
          method: 'PUT',
          url: `${API_URL}user/api/update-user/`, 
          data: data,
          headers: {
            'Content-Type': 'application/json'
          },
        });
        console.log(response.data)
        // history.pushState('/login')
        dispatch({ type: 'updateCustom_USER_SUCCESS', payload: response.data });
        return response.data
      } catch (error) {
        console.log(error)
        return dispatch({ type: 'updateCustom_USER_FAILURE', payload: error.response });
      }
    };
    };

export const loginUser = (email, password) => {
  return async (dispatch) => {
    dispatch({ type: 'LOGIN_USER_REQUEST' });
    try {
      const response = await axios.post(`${API_URL}user/api/auth/token/`, { email, password })
      dispatch({ type: 'LOGIN_USER_SUCCESS', payload: response.data });
      localStorage.setItem("email", email)
      console.log(response.data)
      // history.pushState('/')
      console.log("login successfully")
      return response.data
    } catch (error) {
      console.log("CANT login")
      return dispatch({ type: 'LOGIN_USER_FAILURE', payload: error.message });
      
    }
    // await axios.post(`${API_URL}user/api/auth/token/`, { email, password })
    //     .then((response) => {
    //       dispatch({ type: 'LOGIN_USER_SUCCESS', payload: response.data });
    //       localStorage.setItem("email", email)
    //       console.log(response.data)
    //       // history.pushState('/')
    //       console.log("login successfully")
    //       return [12,2]
    //   })
    //   .catch((error) => {
    //       dispatch({ type: 'LOGIN_USER_FAILURE', payload: error.message });
    //       alert("CANT login")
    //   });
  };
};

export const createManager = (managerData) => async (dispatch) => {
  dispatch({ type: 'CREATE_MANAGER_REQUEST' });
  try {
    const response = await axios.post(
      `${API_URL}user/managers/`,
      managerData
    );
    console.log(response.data)
    return dispatch({ type: "CREATE_MANAGER_SUCCESS", payload: response.data });
  } catch (error) {
    console.log(error)
    return dispatch({ type: "CREATE_MANAGER_FAILURE", payload: error.message });
  }
};

export const createAddress = (addressData) => async (dispatch) => {
  dispatch({ type: 'CREATE_ADDRESS_REQUEST' });
  try {
    const response = await axios.post(
      `${API_URL}user/addresses/`,
      addressData
    );
    const managerId = addressData.manager
    return dispatch({ type: "CREATE_ADDRESS_SUCCESS", payload: {...response.data, managerId} });
  } catch (error) {
    console.log(error)
    return dispatch({ type: "CREATE_ADDRESS_FAILURE", payload: error.message });
  }
};
export const createPermissions = (permissionsData) => async (dispatch) => {
  dispatch({ type: 'CREATE_PERMISSION_REQUEST' });
  permissionsData.permissions.forEach(async (permission) => {
    const data = {
      manager: permissionsData.managerId,
      permission: permission
    }

    try {
      const response = await axios.post(
        `${API_URL}user/create-permissions/`,
        data
      );
      return dispatch({ type: "CREATE_PERMISSION_SUCCESS", payload: response.data });
    } catch (error) {
      console.log(error)
      return dispatch({ type: "CREATE_PERMISSION_FAILURE", payload: error.message });
    }
  })
  
};

export const getUserCompany = () => async (dispatch, getState) => {
    dispatch({ type: 'GET_COMPANY_REQUEST' });
    try {
        const state = getState();
        const token = state.auth.token;
        console.log(token);

        const headers = {
            "Content-Type": "application/json",
            "Authorization": 'Bearer ' + token,
        };

        const response = await axios.post(
            `${API_URL}company/companyuser/`,
            { headers }
        );
        console.log(response.data)
        dispatch({ type: "GET_COMPANY_SUCCESS", payload: response.data });
        return response.data
    } catch (error) {
        console.log(error)
        dispatch({ type: "GET_COMPANY_FAILURE", payload: error.message });
    }
};


export const createCompany = (companyData) => async (dispatch, getState) => {
    dispatch({ type: 'CREATE_COMPANY_REQUEST' });
    try {
        const state = getState();
        const token = state.auth.token;
        console.log(token);

        const headers = {
            "Content-Type": "application/json",
            "Authorization": 'Bearer ' + token,
        };

        const response = await axios.post(
            `${API_URL}company/companies/`,
            companyData,
            { headers }
        );
        console.log(response.data)
        dispatch({ type: "CREATE_COMPANY_SUCCESS", payload: response.data });
        return response.data
    } catch (error) {
        console.log(error)
        dispatch({ type: "CREATE_COMPANY_FAILURE", payload: error.message });
    }
};

export const createCompanyAdress = (addressData) => async (dispatch) => {
    dispatch({ type: 'CREATE_ADDRESS_REQUEST' });
    try {
        const response = await axios.post(
            `${API_URL}company/addresses/`,
            addressData
        );
        console.log(response.data)
        dispatch({ type: "CREATE_ADDRESS_SUCCESS", payload: response.data });
    } catch (error) {
        console.log(error)
        dispatch({ type: "CREATE_ADDRESS_FAILURE", payload: error.message });
    }
};

export const UpdateCompany = (companyData) => async (dispatch, getState) => {
    dispatch({ type: 'CREATE_COMPANY_REQUEST' });
    try {
        const state = getState();
        const token = state.auth.token;
        console.log(token);

        const headers = {
            "Content-Type": "application/json",
            "Authorization": 'Bearer ' + token,
        };

        const response = await axios.put(
            `${API_URL}company/companyuser/`,
            companyData,
            { headers }
        );
        console.log(response.data)
        dispatch({ type: "CREATE_COMPANY_SUCCESS", payload: response.data });
        return response.data
    } catch (error) {
        console.log(error)
        dispatch({ type: "CREATE_COMPANY_FAILURE", payload: error.message });
    }
};