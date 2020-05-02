import React from 'react';

import {Redirect, Route, Switch} from 'react-router-dom';
import ContestPageContent from "./components/pages/contests/ContestPageContent";
import ParticipantsPageContent from "./components/pages/participants/ParticipantsPageContent";
import Header from "./components/header/Header";
import Sidebar from "./components/sidebar/Sidebar";
import LoginPageContent from "./components/pages/login/LoginPageContent";
import RegisterPageContent from "./components/pages/register/RegisterPageContent";
import PrivateRoute from "./auth/PrivateRoute";
import AuthStateHolder from "./auth/AuthStateHolder";

export default function App() {
    return (
        <AuthStateHolder>
            <div className="app">
                <Header/>
                <div className="app-body">
                    <Sidebar/>
                    <main className="main">
                        <Switch>
                            <Route path="/login">
                                <div className="container-fluid">
                                    <LoginPageContent/>
                                </div>
                            </Route>
                            <Route path="/register">
                                <div className="container-fluid">
                                    <RegisterPageContent/>
                                </div>
                            </Route>
                            <PrivateRoute path="/participants">
                                <ParticipantsPageContent/>
                            </PrivateRoute>
                            <Route path="/contests">
                                <ContestPageContent/>
                            </Route>
                            <Route path="/">
                                <Redirect to="/contests"/>
                            </Route>
                        </Switch>
                    </main>
                </div>
            </div>
        </AuthStateHolder>
    );
}