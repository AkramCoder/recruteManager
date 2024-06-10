import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const AddManager = () => {
  const [email, setEmail] = useState(null)
  const [address, setAddress] = useState(null)
  const [phone, setPhone] = useState(null)
  return (
    <div>
       <h1>Ajouter Manager</h1>
    </div>
  );
};

export default AddManager;
