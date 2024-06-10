import React, { Component } from 'react';

class CvUploadForm extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      cvFile: null,
    };
  }

  handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      this.setState({ [name]: files[0] });
    } else {
      this.setState({ [name]: value });
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    
    const { name, cvFile } = this.state;

    // Create a FormData object to send the file and other data to the server
    const formData = new FormData();
    console.log(cvFile)
    formData.append('cv_file', cvFile);
    formData.append('tags', "");
    formData.append('treated', true);
    formData.append('candidate', 10);

    // Send a POST request to the server (replace 'api/upload' with your server endpoint)
    fetch('http://localhost:8000/user/cvs/', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Upload successful:', data);
      })
      .catch((error) => {
        console.error('Error uploading:', error);
      });
  };

  render() {
    return (
      <div>
        <h1>CV Upload Form</h1>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label htmlFor="cvFile">CV File:</label>
            <input
              type="file"
              id="cvFile"
              name="cvFile"
              onChange={this.handleInputChange}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

export default CvUploadForm;
