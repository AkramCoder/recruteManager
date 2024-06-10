
import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import AuthContext from "../../context/AuthContext"
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Link } from "react-router-dom";
import Alert from 'react-bootstrap/Alert';
import DeleteModal from "./../modal/DeleteModal";
import "./datatable.scss";



const columns = [
    { field: 'id', headerName: 'ID' },
    { field: 'name', headerName: 'Evenement' },
    { field: 'added_date', headerName: 'Date' },
    { field: 'description', headerName: 'description' },
    {
        field: 'responsable', headerName: 'responsable', width: 200,
        renderCell: (params) => {
            let manager = params.row.responsable.user.first_name + " " + params.row.responsable.user.last_name
            return (
                <div>
                    <span>{manager }</span>
                </div>
            )
        }
        },
    {
        field: 'candidate', headerName: 'candidate',  width: 200 ,
        renderCell: (params) => {
            let candidate = params.row.candidate.user.first_name + " " + params.row.candidate.user.last_name
            return (
                <div><span>{candidate}</span></div>
            )
        }
    },
]



const Events = () => {

   
    let { user, authTokens, logoutUser } = useContext(AuthContext)
    const [tableData, setTableData] = useState([])
    let [totalEvents, setTotalEvents] = useState("");
    let [responsable, setResponsable] = useState([]);
    let [candidate, setCandidate] = useState([]);
    const [show, setShow] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null); 

    const [idm, setIdm] = useState(null);
    const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState(null);
    const [fruitMessage, setFruitMessage] = useState(null);

    const getEvents = async () => {
        let response = await fetch(`http://127.0.0.1:8000/user/events-details/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            }
        })
        let data = await response.json()

        if (response.status === 200) {
            console.log(data)
            setTableData(data)
            setTotalEvents(data.length)
            setResponsable(data.responsable)
            setCandidate(data.candidate)

        } else if (response.statusText === 'Unauthorized') {
            console.log(" ERROR ")
        }

    }

    const showDeleteModal = (idm) => {
        setIdm(idm);
        setFruitMessage(null);
        setDeleteMessage(`Are you sure you want to delete the question ${idm} ?`);

        setDisplayConfirmationModal(true);
    };

    // Hide the modal
    const hideConfirmationModal = () => {
        setDisplayConfirmationModal(false);
    };

    const submitDelete = async (idm) => {
        console.log(idm)
        await axios({
            method: 'DELETE',
            url: `http://127.0.0.1:8000/user/events/${idm}/`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
        })
        setSuccessMessage(`Event was deleted successfully.`);
        setDisplayConfirmationModal(false);
        getEvents()

    };

    const actionColumn = [
        {
            field: "action",
            headerName: "Action",
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="cellAction">
                        <Link to={`/events/${params.row.id}`} style={{ textDecoration: "none" }}>
                            <div className="viewButton">View</div>
                        </Link>
                        <div
                            className="deleteButton"
                            onClick={() => showDeleteModal(params.row.id)}
                        >
                            Delete
                        </div>
                    </div>
                )
            }
        }
    ]

    useEffect(() => {
        getEvents()
    }, [])

    return (
        <div className="datatable">
            <div>
                {successMessage &&
                    <Alert className="alert" variant="success" onClose={() => setShow(false)} dismissible>
                        <Alert.Heading><h6>{successMessage}</h6></Alert.Heading>

                    </Alert>}
            </div>
            <div className="datatableTitle">
                Evenements {totalEvents}
                <Link to="/events/new" className="link">
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
            <DeleteModal showModal={displayConfirmationModal} confirmModal={submitDelete} hideModal={hideConfirmationModal} id={idm} message={deleteMessage} />
        </div>
    );
}
export default Events;