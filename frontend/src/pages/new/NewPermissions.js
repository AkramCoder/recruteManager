import React from "react"
import Permissions from "../../components/datatable/Permissions"
import { useParams } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./new.scss";

const NewPermissions = () => {
    const id = useParams();
    return (
        <div className="new">
            <Sidebar/>
            <div className="newContainer">
                <Navbar />
                <div>
                    <div className="newtop">
                        <h1 className="newtitle">Ajouter permissions</h1>
                    </div>
                    <div className="newbottom">
                    <div classNam="newright">
                        <Permissions id={id}></Permissions>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewPermissions