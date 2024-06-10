import React, { useState, useEffect, useContext } from "react"
import axios from "axios"
import AuthContext from "../../context/AuthContext"
import { API_URL } from "../../constants"
import "./permissions.scss";
import { useNavigate } from 'react-router-dom';

const Permissions = ({id}) => {
    let { user, authTokens, logoutUser } = useContext(AuthContext)
    const [permissionsList, setPermissionsList] = useState([])
    const [managerPermissionsList, setManagerPermissionsList] = useState([])
    const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
    const [execnewPermissionList, setExecnewPermissionList] = useState(false);

    const navigate = useNavigate();

    const getPermissionsList = async () => {
        try {
            const response = await axios.get(`${API_URL}user/permissions/`);
            setPermissionsList(response.data)
            return response
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    const getManagerPermissonList = async () => {
        try {
            const response = await axios.get(`${API_URL}user/manager-permissions/?managerId=${id.managerId}`);
            setManagerPermissionsList(response.data)
            setExecnewPermissionList(true)
            return response
        } catch (error) {
            setExecnewPermissionList(false)
            console.error('Error loading data:', error);
        }
    }

    const newPermissionList = () => {
        let permissions = permissionsList
        let checked_permissions = []
        permissions.forEach(permission => {
            permission.checked = false
        })
        if (managerPermissionsList.length > 0) {
            managerPermissionsList.forEach(element => {
                let permissionIndex = permissions.findIndex(p => p.id === element.permission)
                
                permissions[permissionIndex].checked = true
                checked_permissions.push(String(permissions[permissionIndex].id))
            })
        } 
        
        setPermissionsList(permissions)
        setSelectedCheckboxes(checked_permissions)
    }

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        let p = permissionsList
        const index = permissionsList.findIndex(p => p.id === parseInt(value))
        if (checked) {
            setSelectedCheckboxes([...selectedCheckboxes, value]);
            p[index].checked = true
        } else {
            setSelectedCheckboxes(selectedCheckboxes.filter((item) => item !== value));
            p[index].checked = false
        }
        setPermissionsList(p)
    };


    const handleSubmit = async () => {
        const data = {
            managerId: parseInt(id.managerId),
            permissions: selectedCheckboxes
          }
      
          await axios({
            method: 'POST',
            url: `${API_URL}user/create-permissions/`,
            data: data,
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': 'Bearer ' + String(authTokens.access)
            }
        }).then(response => {
            navigate('/managers')
        }).catch(error => {
            console.log(error)
        })

    }

    const allfunction = async () => {
        if (execnewPermissionList) {
            newPermissionList()
        } else {
            await getPermissionsList()
            await getManagerPermissonList()
        }
    }
    useEffect( () => {
        allfunction()
    }, [execnewPermissionList])

    return (
        <div>
            <ul>
                {permissionsList.map((item) => (
                <li key={item.id}>
                    <label className="checkbox_label">
                        <input
                            className="checkbox_input"
                            type="checkbox"
                            value={item.id}
                            checked={item.checked}
                            onChange={handleCheckboxChange}
                        />
                        {item.text}
                    </label>
                </li>
                ))}
            </ul>

            <button className="newbutton" onClick={handleSubmit}>Ajouter</button>
        </div>
    )
}

export default Permissions