import React, { Component, useContext, useState } from "react";
import axios from "axios";
import AuthContext from "../../context/AuthContext"
import { Button, FormGroup, Form } from "react-bootstrap";




const ImportWilaya = () => {
    let { user, authTokens, logoutUser } = useContext(AuthContext)
    const [myfile, setMyfile] = useState([])

    const handleFile = (e) => {
       

        e.preventDefault();
        setMyfile(e.target.files[0]);
        //  const fileToUpload = event.target.files[0];
          //setMyfile([...myfile, e.target.files[0]]);
    };
    const handleSubmitData = async(e) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append("file", myfile);

        //const response = await axios.post(
        //    `${API_URL}user/managers/`,
        //    managerData
        //);

        await fetch(`http://127.0.0.1:8000/company/importwilaya/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
            body: formData,

        }).then((response) => response.json())
            .then((result) => {
                console.log('Success:', result);
            })
            .catch((error) => {
                console.log('Error:', error);
            });
        



    };
return (
            <div className="content">
                <h1 className="text-white text-uppercase text-center my-4">
                    Import wilaya
                </h1>
                <form onSubmit={(e) => handleSubmitData(e)}>
                    <FormGroup>
                        <Form.Label>Upload file</Form.Label>
                <Form.Control type="file" accept=".csv" onChange={(e) => handleFile(e)}></Form.Control>
                    </FormGroup>

                    <Button bssize="large" type="submit">
                        Submit
                    </Button>
                </form>
            </div>
        );
    }

export default ImportWilaya;


//class ImportWilaya extends Component {
         
//        handleFile = (event) => {
//            event.preventDefault();
            

//            const fileToUpload = event.target.files[0];
//            this.setState({
//                fileToUpload: fileToUpload,
//            });
//        };

//        handleSubmitData = (event) => {
//            event.preventDefault();
//            let { authTokens } = useContext(AuthContext)
//            let formData = new FormData();
//            formData.append("file", this.state.fileToUpload);

//            fetch(`http://127.0.0.1:8000/company/importwilaya/`, {
//                method: 'POST',
//                headers: {
//                    'Content-Type': 'multipart/form-data',
//                    'Authorization': 'Bearer ' + String(authTokens.access)
//                },
//                body: formData,

//            })



//        };

//        render() {
//            return (
//                <main className="content">
//                    <h1 className="text-white text-uppercase text-center my-4">
//                        Import wilaya
//                    </h1>
//                    <form onSubmit={this.handleSubmitData}>
//                        <FormGroup>
//                            <Form.Label>Upload file</Form.Label>
//                            <Form.Control type="file" onChange={this.handleFile}></Form.Control>
//                        </FormGroup>

//                        <Button block bssize="large" type="submit">
//                            Submit
//                        </Button>
//                    </form>
//                </main>
//            );
//        }
//    }
//export default ImportWilaya;