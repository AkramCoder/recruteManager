
import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Link } from "react-router-dom";
import "./datatable.scss";
import AuthContext from '../../context/AuthContext';



const columns = [
    { field: 'id', headerName: 'ID' },
    {
        field: 'first_name', headerName: 'Nom', width: 160,
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
        field: 'phone_number', headerName: 'Telephone',
        renderCell: (params) => {
           
            return (
                <div>
                    <span>{params.row.user.phone_number}</span>
                </div>
            )
        }
    },
    {
        field: 'gender', headerName: 'gender', width: 60,
        renderCell: (params) => {

            return (
                <div>
                    <span>{params.row.user.gender}</span>
                </div>
            )
        }
    },
    { field: 'current_poste', headerName: 'Poste actuel'},
    { field: 'previous_poste', headerName: 'Poste precedent'}
]

const actionColumn = [
    {
        field: "action",
        headerName: "Action",
        width: 200,
        renderCell: (params) => {
            return (
                <div className="cellAction">
                    <div className="viewButton">View</div>
                    {/* <div className="viewButton"><Link to={`/managers/update-permissions/${params.row.id}`}>Update</Link></div> */}
                    <div className="viewButton"><Link to={`/managers/update/${params.row.id}`}>Update</Link></div>
                    <div
                        className="deleteButton">
                        Delete
                    </div>
                </div>
            )
        }
    }
]

const Managerstable = () => {
    let { authTokens, manager } = useContext(AuthContext)
    const [tableData, setTableData] = useState([])
    let [companyid, setCompanyid] = useState("")
    let [totalmanagers, setTotalmanagers] = useState(0);

    const updateManagerPermissions = () => {

    }

    useEffect(() => {
        const requestOptions = {
            method: 'GET', // HTTP method (GET, POST, etc.)
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + String(authTokens.access)
            }, // Headers object
            // Other properties like body for POST requests
        };
        fetch(`http://localhost:8000/user/managersDetails/${manager.id}`, requestOptions)
            .then((data) => data.json())
            .then((data) => {
                console.log(data)
                setTableData(data)
                setTotalmanagers(data.length)
                localStorage.setItem("managers", totalmanagers)
                let comp = data[0].company
                setCompanyid(comp);
                localStorage.setItem('companyid', companyid)

            }) 
    }, [])
    console.log(tableData)

    return (
        <div className="datatable">
            <div className="datatableTitle">
                Managers {totalmanagers}
                <Link to="/managers/new" className="link">
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
export default Managerstable;