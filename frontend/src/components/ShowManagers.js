import axios from 'axios';
import React, {useState, useEffect} from 'react';
import Table from 'react-bootstrap/Table';

const ShowManagers = () => {

  const [managers, setManagers] = useState([])
  const getManagers = async ()  => {
    const response = await axios.get('http://localhost:8000/user/managers/');
    console.log(response.data)
    setManagers(response.data)
  }
  useEffect(() => {
    getManagers();
  }, [])
  return (
    <div>
       <h1>Managers</h1>
       <Table striped bordered hover>
          <thead>
             <tr>
                <th>#</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Email</th>
                <th>Poste</th>
                <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {managers.map((manager, index) => (
              <tr>
                 <td>1</td>
                 <td>Nom</td>
                 <td>Prénom</td>
                 <td>{manager.user.email}</td>
                 <td>{manager.current_poste}</td>
                 <td><a href="#">Détails</a></td>
              </tr>
               )
             )}
          </tbody>
       </Table>
     </div>
  );
};

export default ShowManagers;
