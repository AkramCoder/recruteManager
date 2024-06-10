
import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import AuthContext from "../../context/AuthContext"
import { DataGrid, GridToolbar, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Link } from "react-router-dom";
import Alert from 'react-bootstrap/Alert';
import DeleteModal from "./../modal/DeleteModal";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import "./datatable.scss";






const Cvs = () => {


    let { user, authTokens, logoutUser } = useContext(AuthContext)
    const [tableData, setTableData] = useState([])
    let [totalCvs, setTotalCvs] = useState("");
    let [candidate, setCandidate] = useState([]);
    const [show, setShow] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

    const [idm, setIdm] = useState(null);
    const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState(null);
    const [fruitMessage, setFruitMessage] = useState(null);

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [candidateIDs, setCandidateIDs] = useState('')

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
            let ids = ''
            data.forEach(item => {
                if (ids.length === 0) {
                    ids = ids + item['id']
                    console.log(ids)
                } else {
                    ids = ids + "," + item['id']
                }
            });
            console.log(ids)
            setCandidateIDs(ids)
            await getCVs(ids)
        } else if (response.statusText === 'Unauthorized') {
            console.log(" ERROR ")
        }

    }

    const getCVs = async (ids) => {
        let response = await fetch(`http://127.0.0.1:8000/user/api/get-cvs-for-candidates/${ids}/`, {
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
            setTotalCvs(data.length)
            setCandidate(data.candidate)

        } else if (response.statusText === 'Unauthorized') {
            console.log(" ERROR ")
        }

    }

    const cvsWithIndex = tableData.map((cv, index) => ({ ...cv, index: index + 1 }));
    console.log(cvsWithIndex)

    const columns = [
        { field: 'index', headerName: 'Index', width: 20 },

        { field: 'status', headerName: 'Etat' },
        { field: 'created', headerName: 'Ajouter le', width: 200 },
        { field: 'tags', headerName: 'tags', width: 200 },

        {
            field: 'candidate', headerName: 'candidate', width: 200,
            renderCell: (params) => {
                console.log('------>', params)
                let candidate = params.row.candidate.user.first_name + " " + params.row.candidate.user.last_name
                return (
                    <div><span>{candidate}</span></div>
                )
            }
        },
    ]

    
    const getTreatedCvs = async () => {
        let response = await fetch(`http://127.0.0.1:8000/user/cvs-treated-company-list/`, {
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
            setTotalCvs(data.length)
            setCandidate(data.candidate)

        } else if (response.statusText === 'Unauthorized') {
            console.log(" ERROR ")
        }

    }
       
    const getNonTreatedCvs = async () => {
        let response = await fetch(`http://127.0.0.1:8000/user/cvs-not-treated-company-list/`, {
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
            setTotalCvs(data.length)
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
            url: `http://127.0.0.1:8000/user/cvs/${idm}/`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
        })
        setSuccessMessage(`Event was deleted successfully.`);
        setDisplayConfirmationModal(false);
        getCVs()

    };

    const actionColumn = [
        {
            field: "action",
            headerName: "Action",
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="cellAction">
                        <Link to={`/cvs/${params.row.id}`} style={{ textDecoration: "none" }}>
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

    const dateRangeFilter = async (e) => {
        e.preventDefault()
        let response = await fetch(`http://127.0.0.1:8000/user/cvs-date-range-filter/?start_date=${startDate}&end_date=${endDate}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            }
        })
        let data = await response.json()

        if (response.status === 200) {
            setTableData(data)

            setTotalCvs(data.length)
            console.log(data)
            console.log(data.length)

        } else if (response.statusText === 'Unauthorized') {
            console.log(" ERROR ")
        }
    } 

    useEffect(() => {
        getCandidates()
    }, [])

    return (
        <div className="datatable">
            <div>
                {successMessage &&
                    <Alert className="alert" variant="success" onClose={() => setShow(false)} dismissible>
                        <Alert.Heading><h6>{successMessage}</h6></Alert.Heading>

                    </Alert>}
            </div>
            <form >
                <Container>
                    <Row>
                        <Col>
                            <Form.Group controlId="datetimeField" >
                                <Form.Label>From</Form.Label>
                                <Form.Control
                                    type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="datetimeField" >
                                <Form.Label>To</Form.Label>
                                <Form.Control
                                    type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <button className="filterbutton" type="submit" onClick={dateRangeFilter}>Filtrer</button>
                        </Col>
                    </Row>
                </Container>
            </form>
            <div className="datatableTitle">
                CVs {totalCvs}
                <ul className="actionslist">
                    <li> <a className="lien" onClick={getTreatedCvs}>CVs traite</a></li>
                    <li><a className="lien" onClick={getNonTreatedCvs}>CVs Non traite</a></li>
                    <li><Link to="/cvs/new" className="link">Ajouter</Link></li>
                </ul>
               
            </div>
            <DataGrid
                rows={cvsWithIndex}
                columns={columns.concat(actionColumn)}
                pageSize={9}
                rowsPerPageOptions={[9]}
                checkboxSelection
                slots={{
                    toolbar: GridToolbar,
                }}
            />
            <DeleteModal showModal={displayConfirmationModal} confirmModal={submitDelete} hideModal={hideConfirmationModal} id={idm} message={deleteMessage} />
        </div>
    );
}
export default Cvs;