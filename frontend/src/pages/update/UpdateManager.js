import Navbar from "../../components/navbar/Navbar"
import Sidebar from "../../components/sidebar/Sidebar"
import { useState, useEffect, useContext } from "react";
//import RiFolderUploadLine from "react-icons/rifolderupload";
import "../new/new.scss";
import { useDispatch } from 'react-redux';
import { signUp, createManager, createAddress, createPermissions, updateCustomUser } from "../../actions";
import { API_URL } from '../../constants';
import axios from 'axios';
import AuthContext from "../../context/AuthContext";
import { Link, useNavigate, useParams } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';


const UpdateManager = ({ inputs ,title }) => {
    const id = useParams();
    console.log(id)
    let { user, authTokens, logoutUser, manager } = useContext(AuthContext)

    const [file, setFile] = useState("");
    const [formData, setFormData] = useState({});
    const [permissionsList, setPermissions] = useState(null);
    const [checkedItems, setCheckedItems] = useState([]);
    const [successMessage, setSuccessMessage] = useState(null);

    const [firstName, setFirstName] = useState()
    const [lastName, setLastName] = useState()
    const [email, setEmail] = useState()
    const [phone1, setPhone1] = useState()
    const [phone2, setPhone2] = useState()
    const [genderSelected, setGenderSelected] = useState()
    const [birthday, setBirthday] = useState()
    const [posteActuel, setPosteActuel] = useState()
    const [postePrecedent, setPostePrecedent] = useState()
    const [facebook, setFacebook] = useState()
    const [linkedin, setLinkedin] = useState()
    const [country, setCountry] = useState()
    const [wilaya, setWilaya] = useState()
    const [commune, setCommune] = useState()
    const [zipCode, setZipCode] = useState()
    const [address, setAddress] = useState()

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

    const getManagerData = async () => {
        const requestOptions = {
            method: 'GET', 
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + String(authTokens.access)
            }, 
        };
        await fetch(`http://localhost:8000/user/currentmanager/${id}`, requestOptions)
            .then((data) => data.json())
            .then(async (data) => {
                await axios.get(`http://localhost:8000/user/addresses/${data.user.id}`)
                .then(response => {
                    console.log(response)
                })
                setFirstName(data.user.first_name)
                setLastName(data.user.last_name)
                setEmail(data.user.email)
                try {
                    setPhone1(data.user.phone_number[0])
                    setPhone2(data.user.phone_number[1])
                } catch (error) {
                    console.log(error)
                }
                setGenderSelected(data.user.gender)
                setBirthday(data.user.birthday)
                setPosteActuel(data.current_poste)
                setPostePrecedent(data.previous_poste)
                setFacebook(data.facebook)
                setLinkedin(data.linkedin)

            }) 
    }

    const getWilayaList = async () => {
        try {
          const response = await axios.get(`${API_URL}company/wilayas/`);
          setWilayaList(response.data);
        } catch (error) {
          throw error;
        }
      }

      const getCommuneList = async (wilaya_id) => {
        try {
          const response = await axios.get(`${API_URL}company/communes-by_wilaya/${wilaya_id}/`);
          
          setCommuneList(response.data);
        } catch (error) {
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
        getManagerData()
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
            .then(() => {
                setSuccessMessage(true)
                // handle success
                console.log("Successfully created user, manager, and address");
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
                        {/* <div className="newformInput">
                            <label htmlFor="file">
                                Image:
                                 </label>
                            <input type="file" id="file" name="image"/>
                        </div> */}
                        <div class="newformInput">
                            <label>Nom </label>
                            <input type="text" name="last_name" id="1" placeholder="nom" />
                        </div>
                        <div class="newformInput">
                            <label>Prenom </label>
                            <input type="text" name="first_name" id="2" placeholder="Prenom"/>
                        </div>
                        <div class="newformInput">
                            <label>Email </label>
                            <input type="mail" name="email" id="3" placeholder="john_doe@gmail.com"/>
                        </div>
                        <div class="newformInput">
                            <label>Phone 1 </label>
                            <input type="text" name="phone_1" id="6" placeholder="+1 234 567 89"/>
                        </div>
                        <div class="newformInput">
                            <label>Phone 2 </label>
                            <input type="text" name="phone_2" id="7" placeholder="+1 234 567 89"/>
                        </div>
                        <div class="newformInput">
                        <label>Gender: </label>
                        <select className='inputDivSelect' name='gender' onChange={handleInputChange}>
                            <option value="">---------</option>
                            {gender.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.text}
                                </option>
                            ))}
                        </select>
                        </div>
                        <div class="newformInput">
                            <label>Date de naissance </label>
                            <input type="date" name="birthday" id="10" placeholder="date de naissance"/></div>
                        <div class="newformInput">
                            <label>poste_actuel </label>
                            <input type="text" name="poste_actuel" id="11" placeholder="Source"/>
                        </div>
                        <div class="newformInput">
                            <label>Poste precedent </label>
                            <input type="text" name="poste_precedent" id="12" placeholder="John Doe"/>
                        </div>
                        <div class="newformInput">
                            <label>facebook </label>
                            <input type="mail" name="facebook" id="13" placeholder="facebook"/>
                        </div>
                        <div class="newformInput">
                            <label>Linkedin </label>
                            <input type="text" name="linkedin" id="14" placeholder="Linkedin"/>
                        </div>
                        <div class="newformInput">
                            <label>Country </label>
                            <input type="text" name="country" id="15" placeholder="USA"/>
                        </div>
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
                            {/* {inputs.map((input) => (
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
                                    
                                </div>
                            ))} */}

                            {/* <div className='newformInput'>
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
                            
                            </div> */}

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
export default UpdateManager