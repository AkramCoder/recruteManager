import React, { useContext } from 'react';
//import { BrowserRouter as Link } from 'react-router-dom';
import { Link, NavLink } from "react-router-dom";

import AuthContext from "../../context/AuthContext"
import Dropdown from 'react-bootstrap/Dropdown';



import { AiOutlineSearch } from "react-icons/ai";
import { IoMdNotificationsOutline } from "react-icons/io";
import { AiTwotoneSetting } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { BsChatLeft } from "react-icons/bs";
import { BiLogOutCircle } from "react-icons/bi";
import { BiListUl } from "react-icons/bi";
import "./navbar.scss"

const Navbar = () => {
    let { user, logoutUser } = useContext(AuthContext)
   
    return (
        <div className="navbar">
            <div className="wrapper">
                <div className="search">
                    <input type="text" placeholder="Rechercher... " />
                    <AiOutlineSearch/>

                </div>
                
                <div className="items">
                    <div className="item">
                        {user ? (
                        <Dropdown>

                            <Dropdown.Toggle variant="" id="dropdown-basic">
                                <img
                                    src="https://images.pexels.com/photos/941693/pexels-photo-941693.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                                    alt=""
                                    className="avatar"
                                />
                            </Dropdown.Toggle>
                           
                            <Dropdown.Menu>
                                    <Dropdown.Item href=""><Link to="/" style={{ textDecoration: "none" }}>
                                            <span><AiTwotoneSetting className="icon" />Parametres</span>
                                    </Link></Dropdown.Item>
                                    <Dropdown.Item href=""><Link to="/profile" style={{ textDecoration: "none" }}>
                                            <span><CgProfile className="icon" />Profile</span>
                                    </Link></Dropdown.Item>
                                    <Dropdown.Item href="" onClick={logoutUser}><span><BiLogOutCircle className="icon" />Deconnexion</span></Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        ) : (
                            <Link to="/login" >
                                Login</Link>
                        )}
                        
                    </div>
                    {/*<div className="item">*/}
                    {/*    {user ? (*/}
                    {/*        <div className="item" onClick={logoutUser}>*/}
                    {/*            <BiLogOutCircle className="icon" />*/}
                    {/*            <span>Logout</span>*/}
                    {/*        </div>*/}
                    {/*    ) : (*/}
                    {/*            <Link to="/login" >*/}
                    {/*                Login</Link>*/}
                    {/*    )}*/}
                       
                    {/*</div>*/}
                </div>
            </div>
        </div>

    )
}
export default Navbar