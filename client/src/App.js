import React from 'react';

import {Route, Switch} from 'react-router-dom';
import ContestsPageContent from "./pages/contests/ContestsPageContent";
import ParticipantsPageContent from "./pages/participants/ParticipantsPageContent";
import Header from "./components/header/Header";
import Sidebar from "./components/sidebar/Sidebar";
import LoginPageContent from "./pages/login/LoginPageContent";
import RegisterPageContent from "./pages/register/RegisterPageContent";

function App() {
    return (
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
                            <Route path="/participants">
                                <ParticipantsPageContent/>
                            </Route>
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
    );
}

export default App;
