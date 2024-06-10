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
import { parse, format } from 'date-fns';
import Alert from 'react-bootstrap/Alert';


const NewCandidateCv = ({ title, inputs, data, customData }) => {
    let { user, authTokens, logoutUser, manager} = useContext(AuthContext)

    const navigate = useNavigate()
    const [file, setFile] = useState("");
    const [companiesList, setCompanies] = useState(null);
    const [permissionsList, setPermissions] = useState(null);
    const [checkedItems, setCheckedItems] = useState([]);
    const [successMessage, setSuccessMessage] = useState(null);

    const [firstName, setFirstName] = useState(null)
    const [lastName, setLastName] = useState(null)
    const [email, setEmail] = useState(null)
    const [phoneA, setPhoneA] = useState(null)
    const [phoneB, setPhoneB] = useState(null)
    const [candidateGender, setCandidateGender] = useState(null)
    const [birthday, setBirthday] = useState(null)
    const [source, setSource] = useState(null)
    const [speciality, setSpeciality] = useState(null)
    const [facebook, setFacebook] = useState(null)
    const [linkedin, setLinkedin] = useState(null)
    const [country, setCountry] = useState(null)
    const [wilaya, setWilaya] = useState(null)
    const [commune, setCommune] = useState(null)
    const [zipCode, setZipCode] = useState(null)
    const [address, setAddress] = useState(null)



    let [wilayaList, setWilayaList] = useState([])
    let [communeList, setCommuneList] = useState([])

    const gender = [
        {value: 'F', text: 'Femme'},
        {value: 'H', text: 'Homme'}
      ]

    // const handleInputChange = (event) => {
    //     const { name, value, files } = event.target;
    //     if (name === 'image') {
    //       setFormData((formData) => ({ ...formData, profile_picture: files[0] }));
    //     } else if(name === 'wilaya') {
    //       getCommuneList(value)
    //       setFormData((formData) => ({ ...formData, [name]: value }));
    //     } else {
    //       setFormData((formData) => ({ ...formData, [name]: value }));
    //     }
    //     console.log(formData)
    //   };
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


    const getWilayaList = async () => {
        try {
          const response = await axios.get(`${API_URL}company/wilayas/`);
          console.log(response.data);
          setWilayaList(response.data);
        } catch (error) {
          throw error;
        }
      }

      const getCommuneList = async (wilaya_id) => {
        try {
          const response = await axios.get(`${API_URL}company/communes-by_wilaya/${wilaya_id}/`);
          
          console.log(response.data);
          setCommuneList(response.data);
        } catch (error) {
          throw error;
        }
      }

      const setWilayaGetCommune = async (value) => {
        setWilaya(value)
        await getCommuneList(value)
      }

    //   const standardizeDate = (inputDate) => {
    //     console.log('standardizeDate')
    //     const possibleFormats = [
    //       "dd MMM yyyy", 
    //       "dd/MM/yyyy",  
    //     ];
      
    //     for (const formatStr of possibleFormats) {
    //       const parsedDate = parse(inputDate, formatStr, new Date());
    //       console.log(format(parsedDate, "yyyy-MM-dd"))
    //       if (!isNaN(parsedDate.getTime())) {
    //         console.log(format(parsedDate, "yyyy-MM-dd"))
    //         return format(parsedDate, "yyyy-MM-dd");
    //       }
    //     }
      
    //     return "Invalid Date Format";
    //   }
  
    const setDataIntoState = (data) => {
        console.log(data)
        if (data) {
            let result = {}
            data.entities.forEach(element => {
                if (result[element.label]) {
                    result[element.label].push(element.text)
                    console.log(result)
                } else {
                    result[element.label] = [element.text]
                    console.log(result)
                }
            });
            
            const entries = Object.entries(result);

            entries.forEach(([key, value]) => {
                if (key === "FirstName") {
                    setFirstName(value[0])
                }
                if (key === "LastName") {
                    setLastName(value[0])
                }
                if (key === "Address") {
                    console.log("address--", value[0])
                    setAddress(value[0])
                } else if (key === 'Email') {
                    setEmail(value[0])
                } else if (key === 'PhoneNumber') {
                    if (value.length > 1) {
                        setPhoneA(value[0])
                        setPhoneB(value[1])
                    } else {
                        setPhoneA(value[0])
                        setPhoneB("")
                    }
                } else if (key === 'Birthday') {
                    
                }
            });
            
        }
    }
    

    useEffect(() => {
        setDataIntoState(data)
        if (wilayaList.length === 0) {
            getWilayaList();
        }
        // console.log("customData------>", customData)
        // if (customData) {
        //     if(customData.first_name) {
        //         setFirstName(customData.first_name)
        //     } else if (customData.last_name) {
        //         setLastName(customData.last_name)
        //     }
        // } else {
        //     if (wilayaList.length === 0) {
        //         getWilayaList();
        //         setDataIntoState(data)
        //     } else {
        //         setDataIntoState(data)
        //     }
        // }
        
      }, [data, customData]);
      
    

    const dispatch = useDispatch();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const userData = {
        first_name: firstName, 
        last_name: lastName, 
        gender: candidateGender, 
        birthday: birthday,
        phone_number: (phoneA && phoneB) ? [phoneA, phoneB]: ([phoneA] || [phoneB]),
        email: email,
        };
        
        const addressData = {
            user: 0, 
            country: country,
            wilaya: parseInt(wilaya),
            commune: parseInt(commune), 
            zip_code: zipCode,
            address: address
        };

        await axios({
            method: 'POST',
            url: `${API_URL}user/api/create-custom-user/`, 
            data: userData,
            headers: {
              'Content-Type': 'application/json'
            },
        }).then(async response => {
            console.log(response)
            const userId = response.data.id
            addressData.user = userId;
            const data = {
                user: userId, 
                company: manager.company,
                source: source,
                speciality: speciality,
                facebook: facebook,
                linkedin: linkedin
            }
            await axios({
                method: 'POST',
                url: `${API_URL}user/candidates/`, 
                data: data,
                headers: {
                  'Content-Type': 'application/json'
                },
            }).then(response => {
                const dataToSave = { candidateId: response.data.id };
                localStorage.setItem('candidate', JSON.stringify(dataToSave));
                dispatch(createAddress(addressData))
                .then(response => {
                    console.log(response)
                    // navigate("/candidates")
                })
                .catch(error => {
                    console.log(error)
                })
                
            }).catch(error => {
                console.log(error)
            })
        }).catch(error => {
            console.log(error)
        })
        
    };

    return (
        <div className="new">
            <div className="newContainer">
                <div>
                    {successMessage &&
                        <Alert className="alert" variant="success" onClose={() => setShow(false)} dismissible>
                            <Alert.Heading>
                                <div>nouveau candidat a ete créé avec success </div>
                            </Alert.Heading>

                        </Alert>}
                </div>
                
                <div>
                    
                    <div classNam="newright">
                    <form onSubmit={handleSubmit}>
                    <div class="newformInput" style={{"width": "45%"}}>
                        <label>Nom </label>
                        <input type="text" name="last_name" id="1" placeholder="nom" onChange={e => setLastName(e.target.value)} value={lastName}/>

                    </div>
                    <div class="newformInput" style={{"width": "45%"}}>
                        <label>Prenom </label>
                        <input type="text" name="first_name" id="2" placeholder="prenom" onChange={e => setFirstName(e.target.value)} value={firstName}/>

                    </div>
                    <div class="newformInput" style={{"width": "45%"}}>
                        <label>Email </label>
                        <input type="mail" name="email" id="3" placeholder="john_doe@gmail.com" onChange={e => setEmail(e.target.value)} value={email}/>
                    </div>

                    <div class="newformInput" style={{"width": "45%"}}>
                        <label>Phone 1 </label>
                        <input type="text" name="phone_1" id="6" placeholder="+1 234 567 89" onChange={e => setPhoneA(e.target.value)} value={phoneA}/>

                        </div>

                    <div class="newformInput" style={{"width": "45%"}}>
                        <label>Phone 2 </label>
                        <input type="text" name="phone_2" id="7" placeholder="+1 234 567 89" onChange={e => setPhoneB(e.target.value)} value={phoneB}/>

                        </div>

                    <div class="newformInput" style={{"width": "45%"}}>
                        <label>Gender </label>
                        <select className='inputDivSelect' name='gender' onChange={e => setCandidateGender(e.target.value)} value={candidateGender}>
                        <option value="">---------</option>
                        {gender.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.text}
                            </option>
                        ))}
                        </select>
                    </div>

                    <div class="newformInput" style={{"width": "45%"}}>
                        <label>Date de naissance </label>
                        <input type="date" name="birthday" id="10" placeholder="date de naissance"  onChange={e => {setBirthday(e.target.value);console.log(birthday)}} value={birthday}/>

                        </div>

                    <div class="newformInput" style={{"width": "45%"}}>
                        <label>Source </label>
                        <input type="text" name="source" id="11" placeholder="Source" onChange={e => setSource(e.target.value)} value={source}/>

                        </div>

                    <div class="newformInput" style={{"width": "45%"}}>
                        <label>speciality </label>
                        <input type="text" name="speciality" id="12" placeholder="Ingenieur, ..." onChange={e => setSpeciality(e.target.value)} value={speciality}/>

                        </div>

                    <div class="newformInput" style={{"width": "45%"}}>
                        <label>facebook </label>
                        <input type="mail" name="facebook" id="13" placeholder="facebook" onChange={e => setFacebook(e.target.value)} value={facebook}/>

                        </div>

                    <div class="newformInput" style={{"width": "45%"}}>
                        <label>Linkedin </label>
                        <input type="text" name="linkedin" id="14" placeholder="Linkedin" onChange={e => setLinkedin(e.target.value)} value={linkedin}/>

                        </div>

                    <div class="newformInput" style={{"width": "45%"}}>
                        <label>Pays </label>
                        <input type="text" name="country" id="15" placeholder="DZ, Algerie" onChange={e => setCountry(e.target.value)} value={country}/>

                        </div>
                            
                    <div className='newformInput' style={{'width': '45%'}}>
                        <label>Wilaya: </label>
                        <select className='inputDivSelect' name='wilaya' onChange={e => setWilayaGetCommune(e.target.value)} value={wilaya}>
                        <option value="">---------</option>
                        {wilayaList.map(option => (
                            <option key={option.id} value={option.id}>
                                {option.code} - {option.name}
                            </option>
                        ))}
                        </select>
                    </div>

                    <div className='newformInput' style={{'width': '45%'}}>
                        <label>Commune: </label>
                        <select className='inputDivSelect' name='commune' onChange={e => setCommune(e.target.value)} value={commune} style={{'width': '-webkit-fill-available'}}>
                        <option value="">---------</option>
                        {communeList.map(option => (
                            <option key={option.id} value={option.id}>
                                {option.name}
                            </option>
                        ))}
                        </select>
                    </div>

                    <div className='newformInput' style={{'width': '45%'}}>
                        <label>Zip code:</label>
                        <input
                        name='zip_code'
                        type="text"
                        onChange={e => setZipCode(e.target.value)} value={zipCode}
                        />
                    
                    </div>

                    <div className='newformInput' style={{'width': '45%'}}>
                        <label>Street Address:</label>
                        <input
                        name='address'
                        type="text"
                        onChange={e => setAddress(e.target.value)} value={address}
                        />
                    
                    </div>

                        {/* {inputs.map((input) => (
                                <div className="newformInput" key={input.id} style={{'width': '45%'}}>
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

                            {/* <div className='newformInput' style={{'width': '45%'}}>
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

                            <div className='newformInput' style={{'width': '45%'}}>
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

                            <div className='newformInput' style={{'width': '45%'}}>
                                <label>Zip code:</label>
                                <input
                                name='zip_code'
                                type="text"
                                onChange={handleInputChange}
                                />
                            
                            </div>

                            <div className='newformInput' style={{'width': '45%'}}>
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
                            </div> */}

                            <button className="newbutton" type="submit">Ajouter</button>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    )
}
export default NewCandidateCv