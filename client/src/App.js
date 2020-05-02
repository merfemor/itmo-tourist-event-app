import React from 'react';

import {Route, Switch} from 'react-router-dom';
import ContestsPageContent from "./pages/contests/ContestsPageContent";
import ParticipantsPageContent from "./pages/participants/ParticipantsPageContent";
import Header from "./components/header/Header";
import Sidebar from "./components/sidebar/Sidebar";
import LoginPageContent from "./pages/login/LoginPageContent";
import RegisterPageContent from "./pages/register/RegisterPageContent";
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
                        <div className="container-fluid">
                            <Switch>
                                <Route path="/login">
                                    <LoginPageContent/>
                                </Route>
                                <Route path="/register">
                                    <RegisterPageContent/>
                                </Route>
                                <PrivateRoute path="/participants">
                                    <ParticipantsPageContent/>
                                </PrivateRoute>
                                <Route path="/contests">
                                    <ContestsPageContent/>
                                </Route>
                                <Route path="/">
                                    <ContestsPageContent/>
                                </Route>
                            </Switch>
                        </div>
                    </main>
                </div>
            </div>
        </AuthStateHolder>
    );
}