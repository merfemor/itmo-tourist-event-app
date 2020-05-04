import React from "react";
import {Redirect} from "react-router-dom";
import {RegisterPageForm} from "./RegisterPageForm";

export default class RegisterPageContent extends React.Component {
    state = {
        performRedirect: false
    }

    onRegisterFinish = () => {
        this.setState({
            performRedirect: true
        })
    }

    render() {
        if (this.state.performRedirect) {
            return <Redirect to="/contests"/>
        }
        return <RegisterPageForm onRegisterFinish={this.onRegisterFinish}/>
    }
}
