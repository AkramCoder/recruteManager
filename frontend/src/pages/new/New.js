import Navbar from "../../components/navbar/Navbar"
import Sidebar from "../../components/sidebar/Sidebar"
import { useState, useEffect, useContext } from "react";
//import RiFolderUploadLine from "react-icons/rifolderupload";
import "./new.scss";
import { useDispatch } from 'react-redux';
import { signUp, createManager, createAddress, createPermissions, updateCustomUser } from "../../actions";
import { API_URL } from '../../constants';
import axios from 'axios';
import AuthContext from "../../context/AuthContext";
import { Link, useNavigate } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';


const New = ({ inputs ,title }) => {
    let { user, authTokens, logoutUser, manager } = useContext(AuthContext)

    const navigate = useNavigate()
    const [file, setFile] = useState("");
    const [formData, setFormData] = useState({});
    const [companiesList, setCompanies] = useState(null);
    const [permissionsList, setPermissions] = useState(null);
    const [checkedItems, setCheckedItems] = useState([]);
    const [successMessage, setSuccessMessage] = useState(null);

    let [wilayaList, setWilayaList] = useState([])
    let [communeList, setCommuneList] = useState([])

    const gender = [
        {value: 'F', text: 'Femme'},
        {value: 'H', text: 'Homme'}
      ]

    const handleInputChange = (event) => {
        const { name, value, files } = event.target;
        if (name === 'image') {
          setFormData((formData) => ({ ...formData, profile_picture: files[0] }));
        } else if(name === 'wilaya') {
          getCommuneList(value)
          setFormData((formData) => ({ ...formData, [name]: value }));
        } else {
          setFormData((formData) => ({ ...formData, [name]: value }));
        }
        console.log(formData)
      };
    // const handleInputChange = (event) => {
    //     const { name, value } = event.target;
    //     if(name === 'selectCompany' && value !== "") {
    //         setFormData({ ...formData, [name]: value });
    //     } else if(name !== 'selectCompany') {
    //         setFormData({ ...formData, [name]: value });
    //     }
    // };

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
    
        if (checked) {
          setCheckedItems([...checkedItems, value]);
        } else {
          setCheckedItems(checkedItems.filter((item) => item !== value));
        }
      };


    // const fetchCompaniesData = async () => {
    //     if (companiesList === null) {
    //         try {
    //             // Perform asynchronous operations, such as fetching data from an API
    //             const response = await axios.get(`${API_URL}company/companies/`);;
    //             setCompanies(response.data)
    //           } catch (error) {
    //             console.error('Error loading data:', error);
    //           }
    //     }
    //   };

    const getWilayaList = async () => {
        try {
          const response = await axios.get(`${API_URL}company/wilayas/`);
          // Handle the response data here
          console.log(response.data);
          setWilayaList(response.data);
        } catch (error) {
          // Handle any errors that occurred during the request
          // console.error('Error fetching data:', error);
          throw error;
        }
      }

      const getCommuneList = async (wilaya_id) => {
        try {
          const response = await axios.get(`${API_URL}company/communes-by_wilaya/${wilaya_id}/`);
          // Handle the response data here
          console.log(response.data);
          setCommuneList(response.data);
        } catch (error) {
          // Handle any errors that occurred during the request
          // console.error('Error fetching data:', error);
          throw error;
        }
      }

    const fetchPermissions = async () => {
        try {
            // Perform asynchronous operations, such as fetching data from an API
            const response = await axios.get(`${API_URL}user/permissions/`);;
            setPermissions(response.data)
          } catch (error) {
            console.error('Error loading data:', error);
          }
    }
  
    // Call the fetch data function
    
    useEffect(() => {
        console.log(user.user_id)
        console.log(manager)
        getWilayaList();
        // fetchCompaniesData();
        // fetchPermissions();
      }, []);
      
    

    const dispatch = useDispatch();

    const handleSubmit = (event) => {
        event.preventDefault();
        const userData = {
        email: formData.email,
        password: formData.password,
        re_password: formData.confirm_password,
        };
        const managerData = {
        user: 0, 
        parent: 0,
        company: 0,
        current_poste: formData.poste_actuel,
        previous_poste: formData.poste_precedent,
        facebook: formData.facebook,
        linkedin: formData.linkedin,
        };
        const addressData = {
        user: 0, 
        country: formData.country,
        wilaya: parseInt(formData.wilaya),
        commune: parseInt(formData.commune), 
        zip_code: formData.zip_code,
        address: formData.address
        };
        dispatch(signUp(userData.email, userData.password, userData.re_password))
        .then((response) => {
            console.log(response)
            const userId = response.id;
            dispatch(updateCustomUser(userId, formData.first_name, formData.last_name, formData.gender, formData.birthday))
            .then(result => {
                console.log(result)
                managerData.user = userId;
                managerData.parent = manager.id;
                managerData.company = manager.company;
                return dispatch(createManager(managerData));
            })
            .then((response) => {
                console.log(response)
                // const managerId = response.payload.id;
                addressData.user = userId;
                return dispatch(createAddress(addressData));
            })
            // .then((response) => {
            //     const data = {
            //         managerId: response.payload.managerId,
            //         permissions: checkedItems
            //     }
            //     return dispatch(createPermissions(data));
            // })
            .then(async () => {
                setSuccessMessage(true)
                let email_value = {
                    email: userData.email
                } 
                await axios({
                    method: 'POST',
                    url: `http://127.0.0.1:8000/user/api/request-reset-email/`,
                    data: email_value,
                    
                }).then(response => {
                    navigate('/managers');
                })
                
            })
            .catch((error) => {
                // handle error
                console.log(error.message);
            });
        })
        
    };

    return (
        <div className="new">
            <Sidebar/>
            <div className="newContainer">
                <Navbar />
                <div>
                    {successMessage &&
                        <Alert className="alert" variant="success" onClose={() => setShow(false)} dismissible>
                            <Alert.Heading>
                                <div>nouveau manager a ete créé avec success </div>
                                <div>click <Link to="/managers">ici</Link> pour voir la liste de tous les managers</div>
                                <div>click <Link to={`/managers/update-permissions/${manager.id}`}>ici</Link> pour changer les permissions du manager creer</div>
                            </Alert.Heading>

                        </Alert>}
                </div>
                <div className="newtop">
                    <h1 className="newtitle">{ title} </h1>
                </div>
                <div className="newbottom">
                    <div classNam="newleft">
                        <img className="imgform"
                            src={
                                file
                                    ? URL.createObjectURL(file)
                                    : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                            }
                            alt=""
                        />
                    </div>
                    <div classNam="newright">
                    <form onSubmit={handleSubmit}>
                        <div className="newformInput">
                            <label htmlFor="file">
                                Image:
                                 </label>
                            <input type="file" id="file" name="image"/>
                        </div>
                            {inputs.map((input) => (
                                <div className="newformInput" key={input.id}>
                                    <label>{input.label} </label>
                                    {input.name === 'gender' ? 
                                    <select className='inputDivSelect' name='gender' onChange={handleInputChange}>
                                    <option value="">---------</option>
                                    {gender.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.text}
                                        </option>
                                    ))}
                                    </select> :
                                    <input type={input.type}
                                        name={input.name}
                                        id={input.id}
                                        placeholder={input.placeholder}
                                        onChange={handleInputChange} />
                                    }
                                    {/* <input type={input.type}
                                        name={input.name}
                                        id={input.id}
                                        placeholder={input.placeholder}
                                        onChange={handleInputChange} /> */}
                                    
                                </div>
                            ))}

                            <div className='newformInput'>
                                <label>Wilaya: </label>
                                <select className='inputDivSelect' name='wilaya' onChange={handleInputChange}>
                                <option value="">---------</option>
                                {wilayaList.map(option => (
                                    <option key={option.id} value={option.id}>
                                        {option.code} - {option.name}
                                    </option>
                                ))}
                                </select>
                            </div>

                            <div className='newformInput'>
                                <label>Commune: </label>
                                <select className='inputDivSelect' name='commune' onChange={handleInputChange}>
                                <option value="">---------</option>
                                {communeList.map(option => (
                                    <option key={option.id} value={option.id}>
                                        {option.name}
                                    </option>
                                ))}
                                </select>
                            </div>

                            <div className='newformInput'>
                                <label>Zip code:</label>
                                <input
                                name='zip_code'
                                type="text"
                                onChange={handleInputChange}
                                />
                            
                            </div>

                            <div className='newformInput'>
                                <label>Street Address:</label>
                                <input
                                name='address'
                                type="text"
                                onChange={handleInputChange}
                                />
                            
                            </div>

                            <div className="newformInput">
                            {permissionsList !== null ? permissionsList.map((item) => (
                                <label key={item.id}>
                                <input
                                    type="checkbox"
                                    value={item.id}
                                    onChange={handleCheckboxChange}
                                />
                                {item.name}
                                </label>
                            )) : <div></div>}
                            </div>

                            <button className="newbutton" type="submit">Ajouter</button>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    )
}
export default New