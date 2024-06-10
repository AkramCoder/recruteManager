import React from "react";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";

import axios from "axios";

import { API_URL } from "../constants";

class NewCompanyForm extends React.Component {
  state = {
    pk: 0,
    name: "",
    company_type: "",
    level: "",
    website: "",
    profile_picture:""
  };

  componentDidMount() {
    if (this.props.student) {
      const { pk, name, company_type, level,website, profile_picture } = this.props.student;
      this.setState({  pk, name, company_type, level,website, profile_picture });
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  createCompany = e => {
    e.preventDefault();
    axios.post(API_URL, this.state).then(() => {
      this.props.resetState();
      this.props.toggle();
    });
  };

  editCompaany = e => {
  e.preventDefault();
  axios.put(API_URL + this.state.pk, this.state).then(() => {
    this.props.resetState();
    this.props.toggle();
  });
};
defaultIfEmpty = value => {
  return value === "" ? "" : value;
};

render() {
  return (
    <Form onSubmit={this.props.company ? this.editCompaany : this.createCompany}>
      <FormGroup>
        <Label for="name">Name:</Label>
        <Input
          type="text"
          name="name"
          onChange={this.onChange}
          value={this.defaultIfEmpty(this.state.name)}
        />
      </FormGroup>
      <FormGroup>
        <Label for="company_type">Type:</Label>
        <Input
          type="text"
          name="company_type"
          onChange={this.onChange}
          value={this.defaultIfEmpty(this.state.company_type)}
        />
      </FormGroup>
      <FormGroup>
        <Label for="level">level:</Label>
        <Input
          type="text"
          name="level"
          onChange={this.onChange}
          value={this.defaultIfEmpty(this.state.level)}
        />
      </FormGroup>
      <FormGroup>
        <Label for="website">website:</Label>
        <Input
          type="text"
          name="website"
          onChange={this.onChange}
          value={this.defaultIfEmpty(this.state.website)}
        />
      </FormGroup>
      <FormGroup>
        <Label for="profile_picture">profile_picture:</Label>
        <Input
          type="file"
          name="profile_picture"
          onChange={this.onChange}
          value={this.defaultIfEmpty(this.state.profile_picture)}
        />
      </FormGroup>
      <Button>Send</Button>
    </Form>
  );
}
}

export default NewCompanyForm;
