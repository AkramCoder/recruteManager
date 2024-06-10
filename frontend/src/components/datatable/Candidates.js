import AuthContext from "../../context/AuthContext"
import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from "react-router-dom";
import "./datatable.scss";



const columns = [
    { field: 'id', headerName: 'ID', width: 20, },
    {
        field: 'first_name', headerName: 'Nom et prenom', width:150,
        renderCell: (params) => {
            let fullname = params.row.user.first_name + " " + params.row.user.last_name
            return (
                <div>
                    <span>{fullname}</span>
                </div>
            )
        }
    },
    {
        field: 'phone_number', headerName: 'Telephone', width:110,
        renderCell: (params) => {
            let fullname = params.row.user.phone_number 
            return (
                <div>
                    <span>{fullname}</span>
                </div>
            )
        }
    },
    {
        field: 'email', headerName: 'Email', width: 170,
        renderCell: (params) => {

            return (
                <div>
                    <span>{params.row.user.email}</span>
                </div>
            )
        }
    },
    { field: 'source', headerName: 'Source' },
    { field: 'speciality', headerName: 'Specialite' },
    { field: 'date_created', headerName: 'Ajoute le' },
]

const actionColumn = [
    {
        field: "action",
        headerName: "Action",
        width: 70,
        renderCell: (params) => {
            return (
                <div className="cellAction">
                    <Link to={`/candidates/${params.row.id}`} style={{ textDecoration: "none" }}>
                        <div className="viewButton">View</div>
                    </Link>
                </div>
            )
        }
    }
]

const Candidates = () => {
    let { user, authTokens, logoutUser } = useContext(AuthContext)

    const [tableData, setTableData] = useState([])

    const getCandidates = async () => {
        let response = await fetch(`http://127.0.0.1:8000/user/candidateCompanylist/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            }
        })
        let data = await response.json()

        if (response.status === 200) {
            setTableData(data)

        } else if (response.statusText === 'Unauthorized') {
            console.log(" ERROR ")
        }

    }

    useEffect(() => {
        getCandidates()
    }, [])

    return (
        <div className="datatable">
            <div className="datatableTitle">
                Candidats 
                <Link to="/candidates/new" className="link">
                    Ajouter
                </Link>
            </div>
            <DataGrid
                rows={tableData}
                columns={columns.concat(actionColumn)}
                pageSize={9}
                rowsPerPageOptions={[9]}
                checkboxSelection
            />
        </div>
    );
}
export default Candidates;