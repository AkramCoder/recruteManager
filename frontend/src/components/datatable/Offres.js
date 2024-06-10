import React, { useState, useEffect, useContext } from 'react';
import AuthContext from "../../context/AuthContext"
import { Link } from "react-router-dom";
import axios from 'axios';
// react icons
import Alert from 'react-bootstrap/Alert';
import { DataGrid } from '@mui/x-data-grid';
import { CgDanger } from "react-icons/cg";
import DeleteConfirmationModal from "../../components/modal/DeleteConfirmationModal";
import "./datatable.scss";
// bootstrap 
import Badge from 'react-bootstrap/Badge';
import { API_URL } from '../../constants';


const columns = [
    { field: 'id', headerName: 'ID', width:50 },
    { field: 'job_title', headerName: 'Poste', width: 130 },
    {
        field: 'etat', headerName: 'Urgent',
        renderCell: (params) => {
            let state = ""
            if (params.row.etat === "Urgent") {
                state = "urgent"

            } else {
                state = "nonurgent"
            }
            return (
                <div className={`celletat ${state}`}><span><CgDanger className="icon" /></span></div>
            )
        }
    },
  //  { field: 'responsable', headerName: 'responsable' },
  //  { field: 'company', headerName: 'company' },
  //  { field: 'job_creation_date', headerName: 'Date de creation', width: 120 },
    { field: 'job_expire_date', headerName: 'Exp', width: 50 },
    //  { field: 'delai', headerName: 'delai' },
    {
        field: 'job_status', headerName: 'job_status', width: 70,
        renderCell: (params) => {
            let valid = ""
            if (params.row.job_status === true) {
                valid = "Valide"
            } else {
                valid = "Non valide"
            }
            return (
                <div className={`cellwithstatus ${params.row.job_status}`}>{ valid }</div>
            )
        },
    },
   // { field: 'searched_profile', headerName: 'company' },
  //  { field: 'Main_tasks', headerName: 'company' },
  //  { field: 'standard_tasks', headerName: 'company' },
   // { field: 'occasional_tasks', headerName: 'company' },
  //  { field: 'job_experience_required', headerName: 'company' },
  //  { field: 'job_qualification', headerName: 'company' },
  //  { field: 'career_level', headerName: 'company' },
  //  { field: 'job_salary_offered', headerName: 'company' },
  //  { field: 'job_status', headerName: 'company' },
    { field: 'job_wilaya', headerName: 'wilaya',
        renderCell: (params) => {
            const [wilaya, setWilaya] = useState("");
            const getWilaya = async () => {
                await fetch(`${API_URL}company/get-wilaya-commune-names/${params.row.job_wilaya}/${1}`)
                    .then((data) => data.json())
                    .then((data) => {
                        const fetchedWilaya = data.wilaya_name;

                        setWilaya(fetchedWilaya);
                    })
                    .catch((error) => {
                        console.error("Error fetching wilaya:", error);
                    });
            }

        useEffect(() => {
            if (params.row.job_wilaya) {
                getWilaya()
            }
        }, [params.row.job_wilaya]);

        return (
            <div>{wilaya}</div>
        );
        }
            
    },
    { field: 'job_gender_required', headerName: 'Genre' },
   // { field: 'age', headerName: 'Age' },
]



const Offers = () => {
    let { user, authTokens, logoutUser } = useContext(AuthContext)
    const [show, setShow] = useState(false);


    const [successMessage, setSuccessMessage] = useState(null);

    const [tableData, setTableData] = useState([]);
    const [totaljobs, setTotaljobs] = useState(0);
    const [todayoffers, setTodayOffers] = useState([])
    const [thwiWeekOffers, setThwiWeekOffers] = useState([])
    const [thisMonthsoffers, setThisMonthsoffers] = useState([])
    const [today, setToday] = useState("")
    const [week, setWeek] = useState("")
    const [month, setMonth] = useState("")
    const [totalOffers, setTotalOffers] = useState("")

    // -------------- total offers --------------------
    const getOffers = async () => {
        console.log("user", user.user_id)
        console.log("token in fetch", String(authTokens.access))
        let response = await fetch(`http://127.0.0.1:8000/company/companyoffers/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            }
        })
        let data = await response.json()

        if (response.status === 200) {
            setTotalOffers(data.length)
            setTableData(data)
            setTotaljobs(tableData.length)

        } else if (response.statusText === 'Unauthorized') {
            console.log(" ERROR ")
        }
    }

    // -------------- valid offers ------------------------

    const getValidOffers = async () => {
        console.log("user", user.user_id)
        console.log("token in fetch", String(authTokens.access))
        let response = await fetch(`http://127.0.0.1:8000/company/validjobs/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            }
        })
        let data = await response.json()

        if (response.status === 200) {
            setTableData(data)
            console.log("length", data.length)

        } else if (response.statusText === 'Unauthorized') {
            console.log(" ERROR ")
        }

    }

    // -------------- Non valid offers --------------------
    const getNonValidOffers = async () => {
        console.log("user", user.user_id)
        console.log("token in fetch", String(authTokens.access))
        let response = await fetch(`http://127.0.0.1:8000/company/nonvalidjobs/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            }
        })
        let data = await response.json()

        if (response.status === 200) {
            setTableData(data)
            console.log("length",tableData.length)

        } else if (response.statusText === 'Unauthorized') {
            console.log(" ERROR ")
        }

    }
    // jobs added today
    const getTodayOffers = async () => {
        let response = await fetch(`http://127.0.0.1:8000/company/todayjobs/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            }
        })
        let data = await response.json()

        if (response.status === 200) {
            setTodayOffers(data)
            setToday(data.length)

        } else if (response.statusText === 'Unauthorized') {
            console.log(" ERROR ")
        }

    }
    // jobs added this week
    const getThisweekOffers = async () => {
        let response = await fetch(`http://127.0.0.1:8000/company/thisweekjobs/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            }
        })
        let data = await response.json()

        if (response.status === 200) {
            setThwiWeekOffers(data)
            setWeek(data.length)

        } else if (response.statusText === 'Unauthorized') {
            console.log(" ERROR ")
        }

    }
    // jobs added this month
    const getThisMonthOffers = async () => {
        let response = await fetch(`http://127.0.0.1:8000/company/thismonthjobs/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            }
        })
        let data = await response.json()

        if (response.status === 200) {
            setThisMonthsoffers(data)
            setMonth(data.length)

        } else if (response.statusText === 'Unauthorized') {
            console.log(" ERROR ")
        }

    }
    const deleteOffer = async (idm) => {
        console.log("cv id", idm)
        await axios({
            method: 'DELETE',
            url: `http://127.0.0.1:8000/company/joboffer/${idm}/`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
        })
        setSuccessDeleteMessage(`The offer was deleted successfully.`);
        setDisplayConfirmationModal(false);
        getOffers()

    };
    //______________________________________________________
    const [type, setType] = useState(null);
    const [idm, setIdm] = useState(null);
    const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState(null);
    const [successDeleteMessage, setSuccessDeleteMessage] = useState(null);

    // Handle the displaying of the modal based on type and id
    const showDeleteModal = (type, idm) => {
        setType(type);
        setIdm(idm);
        setSuccessDeleteMessage(null);

        if (type === "offer") {
            setDeleteMessage(`confirmer votre action de supprission ${idm}?`);
        } 

        setDisplayConfirmationModal(true);
    };

    // Hide the modal
    const hideConfirmationModal = () => {
        setDisplayConfirmationModal(false);
    };

    // Handle the actual deletion of the item
    const submitDelete = (type, idm) => {
        if (type === "offer") {
            //   setDeleteMessage(`confirmer votre action de supprimer ${idm}?`);
            deleteOffer(idm)
        }
        setDisplayConfirmationModal(false);
        setSuccessMessage("offre supprime avec success")
    };
    //------------------------------------------------------
    useEffect(() => {
        getOffers()
        getTodayOffers()
        getThisweekOffers()
        getThisMonthOffers()
    }, [])
  

    const actionColumn = [
        {
            field: "action",
            headerName: "Action",
            width: 170,
            renderCell: (params) => {
                return (
                    <div className="cellAction">
                        <Link to={`/offers/${params.row.id}`} style={{ textDecoration: "none" }}>
                            <div className="viewButton">View</div>
                        </Link>
                        <div className="deleteButton"
                            onClick={() => showDeleteModal("offer", params.row.id)}
                        >
                            Delete
                        </div>
                        
                    </div>
                )
            }
        }
    ]
    return (
        <div className="datatable">
            <div className="widget">
                <div className="left">
                    <span className="widgettitle">Offres ajoute Aujourd'hui</span>
                    <span className="widgettitle">Cette semaine</span>
                    <span className="widgettitle">Ce  mois</span>
                    <span className="widgettitle">Cet  annee</span>
                </div>
                <div className="right">
                    <div className="percentage positive">
                        <Badge bg="info">+ {today}</Badge>
                    </div><div className="percentage positive">
                        <Badge bg="info">+ {week}</Badge>
                    </div><div className="percentage positive">
                        <Badge bg="info">+ {month}</Badge>
                    </div><div className="percentage positive">
                        <Badge bg="info">+ {today}</Badge>
                    </div>
                </div>
            </div>
           
            <div>
                {successMessage &&
                    <Alert className="alert" variant="success" onClose={() => setShow(false)} dismissible>
                        <Alert.Heading><h6>{successMessage}</h6></Alert.Heading>
                    </Alert>}
            </div>
            <div className="datatableTitle">
               
                Les offres d'emplois {totalOffers}
                <ul className="actionslist">
                    <li><a className="lien" onClick={getOffers}>Tout les offres</a></li>
                    <li><a className="lien" onClick={getValidOffers}>Valides</a></li>
                    <li> <a className="lien" onClick={getNonValidOffers}> Non Valide</a></li>
                    <li><Link to="/offers/newjob" className="link"> Ajouter</Link></li>
                </ul>
               
            </div>
            <DataGrid 
                rows={tableData}
                columns={columns.concat(actionColumn)}
                pageSize={9}
                getRowId={(row) => row.id}
                rowsPerPageOptions={[9]}
                checkboxSelection
            />
            <DeleteConfirmationModal showModal={displayConfirmationModal} confirmModal={submitDelete} hideModal={hideConfirmationModal} type={type} id={idm} message={deleteMessage} />

        </div>

        
    );
}
export default Offers;