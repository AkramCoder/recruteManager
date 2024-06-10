
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
    { field: 'name', headerName: 'Interview' },
    { field: 'interview_date', headerName: 'Date' },
    {
        field: 'candidate', headerName: 'Candidat', width: 180,
        renderCell: (params) => {
            let candidat = params.row.candidate.user.first_name + " " + params.row.candidate.user.last_name
            return (
                <div>
                    <span>{candidat}</span>
                </div>
            )
        }
    },
    
    {
        field: 'responsable', headerName: 'responsable', width:180,
        renderCell: (params) => {
            let responsable = params.row.responsable
            /*  .user.first_name + " " + params.row.candidat.user.last_name*/
            return (
                <div>
                    {responsable.map(item => (
                        <span key={item.user.first_name}> {item.user.last_name}</span>
                    ))}
                </div>
            )
        }
    }
    
]



const Interviews = () => {

   
    let { user, authTokens, logoutUser } = useContext(AuthContext)
    const [tableData, setTableData] = useState([])
    let [totalInterviews, setTotalInterviews] = useState("");
    let [responsable, setResponsable] = useState([]);
    let [candidate, setCandidate] = useState([]);

    const [idm, setIdm] = useState(null);
    const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState(null);
    const [show, setShow] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null); 

    const getInterviews = async () => {
        let response = await fetch(`http://127.0.0.1:8000/user/interviews-details/`, {
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
            setTotalInterviews(data.length)
            setResponsable(data.responsable)
            setCandidate(data.candidate)

        } else if (response.statusText === 'Unauthorized') {
            console.log(" ERROR ")
        }

    }

    const showDeleteModal = (idm) => {
        setIdm(idm);
        setSuccessMessage(null);
        setDeleteMessage(`Are you sure you want to delete the interview ${idm} ?`);

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
            url: `http://127.0.0.1:8000/user/interviews/${idm}/`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
        })
        setSuccessMessage(`Interview was deleted successfully.`);
        //   handleUpdate(idm)
        setDisplayConfirmationModal(false);
        getInterviews()

    };

    const actionColumn = [
        {
            field: "action",
            headerName: "Action",
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="cellAction">
                        <Link to={`/interviews/${params.row.id}`} style={{ textDecoration: "none" }}>
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
        getInterviews()
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
                Interviews {totalInterviews}
                <Link to="/interviews/new" className="link">
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
export default Interviews;