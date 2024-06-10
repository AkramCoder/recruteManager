import React, { useContext, useState } from 'react'
import AuthContext from '../../context/AuthContext'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate } from 'react-router-dom';

import "./login.css";

const Login = () => {
    let { loginUser, user } = useContext(AuthContext)

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        let r = false
        r = await loginUser(email, password);
        if(r) {
            navigate('/')
        }
    }
    // if(user) {
    //     navigate('/')
    //     return
    // }
    return (
        <div className="newright">
            <h2>Login To Your Account</h2>
            <form onSubmit={handleSubmit}>
                {/* <Container style={{ backgroundColor: "lightblue", marginTop: 50, maxWidth:500, padding:20}}> */}
                    {/* <Row> */}
                        {/* <Col md={{ span: 6, offset: 3 }}> */}
                        <div className="newformInput">
                            <div className='inputDiv'>
                            <label>Email address</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            </div>
                        
                        {/* </Col> */}
                    {/* </Row> */}
                    {/* <Row> */}
                        {/* <Col md={{ span: 6, offset: 3 }}> */}
                            <div className='inputDiv'>
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            
                        </div>
                        <button type="submit" className="newbutton">
                            Submit
                            </button>
                        {/* </Col> */}

                    {/* </Row> */}
                {/* </Container> */}
                </div>
            </form>
        </div>
    )
}

export default Login