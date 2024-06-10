import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../constants';

function TextSelectionListener(props) {
    const [selectedText, setSelectedText] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [messagePosition, setMessagePosition] = useState({ top: 0, left: 0 });

    const [firstNames, setFirstNames] = useState([])
    const [lastNames, setLastNames] = useState([])
    const getStringType = async (text) => {
      await axios({
        method: 'POST',
        url: `${API_URL}user/process-text/`, 
        data: {input_text: text},
        headers: {
          'Content-Type': 'application/json'
        },
      }).then(response => {
          const data = response.data.entities
          console.log(data)
          data.forEach(element => {
            if (element.hasOwnProperty('first_names')) {
              setFirstNames(element['first_names'])
              setLastNames(element['last_names'])

              console.log(firstNames)
            }
          });

          setShowMessage(true)
      }).catch(error => {
          console.log(error)
      })
    }

  const callTheCallBack = (data) => {
    props.handleCallBack(data)
    setSelectedText('');
    setShowMessage(false);
    setMessage('');
  }

  useEffect(() => {
    function handleTextSelection() {
        const text = window.getSelection().toString();
        if (text) {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
              const range = selection.getRangeAt(0);
              const rect = range.getBoundingClientRect();

              console.log(text)
              setSelectedText(text);
              // setShowMessage(true);
              // setMessage('This is a custom message.');
              
              getStringType(text)
              setMessagePosition({
                top: rect.bottom + window.scrollY - 50,
                left: rect.left + window.scrollX - 190,
              });
            }
          } else {
            setSelectedText('');
            // setShowMessage(false);
            setMessage('');
          }
    }

    document.addEventListener("mouseup", handleTextSelection);

    return () => {
      document.removeEventListener("mouseup", handleTextSelection);
    };
  }, []);

  const messageStyle = {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    border: '1px solid #ccc',
    borderRadius: '4px',
    padding: '4px',
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)',
    top: `${messagePosition.top}px`,
    left: `${messagePosition.left}px`,
  };

  return (
    <div>
      {showMessage && <div style={messageStyle}>
          {console.log(firstNames + " -" + lastNames)}
          {firstNames.map(item => (
            <div key={item} onClick={() => callTheCallBack({first_name: item})} style={{ 'backgroundColor': 'white', 'padding': '4px', 'cursor': 'pointer', 'marginBottom': '4px'}}>Prenom: {item}</div>
            ))}
          {lastNames.map(item => (
            <div key={item} onClick={() => callTheCallBack({last_name: item})} style={{ 'backgroundColor': 'white', 'padding': '4px', 'cursor': 'pointer', 'marginBottom': '4px'}}>Nom: {item}</div>
            ))}
      </div>}
    </div>
  );
}

export default TextSelectionListener;
