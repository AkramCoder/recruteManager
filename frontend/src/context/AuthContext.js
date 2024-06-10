import { createContext, useState, useEffect } from 'react'
import jwt_decode from "jwt-decode";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const AuthContext = createContext()

export default AuthContext;

export const AuthProvider = ({ children }) => {

    let [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    let [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null)
    let [loading, setLoading] = useState(true)
    let [companyID, setCompanyID] = useState("")
    let [error, setError] = useState("")
    let [manager, setManager] = useState("")

    const navigate = useNavigate();


    let loginUser = async (email, password) => {
        const headers = {
            'Content-Type': 'application/json'
        }
        const datauser = JSON.stringify({ 'email': email, 'password': password })
        // e.preventDefault()
        console.log('Form submitted')
        let response = await axios.post('http://127.0.0.1:8000/user/api/auth/token2/',
            datauser,
            {headers}
        )
        let data = await response
        console.log("response", response.data.access)
        if (response.status === 200) {
            console.log("data", response.data)
            setAuthTokens(response.data)
            console.log("Token", authTokens)
            setUser(jwt_decode(response.data.access))
        //    console.log("user",user.user_id)
            localStorage.setItem('authTokens', JSON.stringify(response.data))
           // localStorage.setItem('userid', user.user_id)
            // navigate("/");
            return true

        } else {
            setError(response.data.detail)
            return false
        }

    }

    let getCompany = async () => {
        if(user) {
            console.log("getCompany CALLED")
            console.log("user", user)
            console.log("token in fetch", String(authTokens.access))
            let response = await fetch(`http://127.0.0.1:8000/user/managercurrent/${user.user_id}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(authTokens.access)
                }
            })
            let data = await response.json()
            console.log("get company-data------>", data)
            if (response.status === 200) {
                setManager(data.manager)
                if(data.manager !== null) {
                    setCompanyID(data.manager.company)
                }
                

            } else if (response.statusText === 'Unauthorized') {
                console.log(" ERROR ")
            }
        }
    }

    let logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        navigate("/login");
    }

    let updateToken = async () => {
        console.log("update token")
        let response = await fetch('http://127.0.0.1:8000/user/api/auth/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'refresh': authTokens?.refresh })
        })
        let data = await response.json()
        console.log('data',data)
        if (response.status === 200) {
            setAuthTokens(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
        }
        else {
            console.log("something wrong")
        }
        if (loading) {
            setLoading(false)
        }

    }


    let contextData = {
        user: user,
        manager: manager,
        loginUser: loginUser,
        authTokens: authTokens,
        logoutUser: logoutUser,
        companyID: companyID,
    }

    useEffect(() => {
        getCompany()
        if (loading) {
            updateToken()
        }

        let fourMinutes = 1000 * 60 * 3
        let interval = setInterval(() => {
            if (authTokens) {
                updateToken()
            }
        }, fourMinutes)
        return () => clearInterval(interval)
    }, [authTokens, loading])


    return (
        <div>
            <AuthContext.Provider value={contextData}>
                {loading ? null : children}
            </AuthContext.Provider>
        </div>

    )
};

