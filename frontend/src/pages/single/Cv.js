//import React from 'react';
//import { useState } from 'react';
//import axios from 'axios';
//import {  useParams } from 'react-router-dom';

//import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
//import Navbar from "../../components/navbar/Navbar"
//import Sidebar from "../../components/sidebar/Sidebar"
//import Chart from "../../components/chart/Chart";
//import Tablecomp from "../../components/table/Tablecomp";
//import "./single.scss";

//const Cv = () => {
//    const [cv, setCv] = useState([])
//    const [numPages, setNumPages] = useState(null)
//    const [pageNumber, setPageNumber] = useState(1)
//    const id = useParams();
//    function onDocumentSuccess({ numPages }) {
//        setNumPages(numPages)
//    }

//    const getCvpdf = async () => {

//        const { data } = await axios.get(`http://127.0.0.1:8000/user/cvs/${id.cvId}`)
//        console.log("cv", data)
//        setCv(data)
        

//    }

//    return (
//        <div className="single">
//            <Sidebar />
//            <div className="singleContainer">
//                <Navbar />
//                <div className="bottom">
//                    <Document file={cv.cv_file} onLoadSuccess={onDocumentSuccess}>
//                        <Page pageNumber={pageNumber} />
//                    </Document>
//                </div>
//            </div>
//        </div>
//    );
//};

//export default Cv;