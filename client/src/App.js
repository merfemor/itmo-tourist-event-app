import React from 'react';

import {Redirect, Route, Switch} from 'react-router-dom';
import ContestPageContent from "./components/pages/contests/ContestPageContent";
import ParticipantsPageContent from "./components/pages/participants/ParticipantsPageContent";
import Header from "./components/header/Header";
import Sidebar from "./components/sidebar/Sidebar";
import LoginPageContent from "./components/pages/login/LoginPageContent";
import RegisterPageContent from "./components/pages/register/RegisterPageContent";
import AuthStateHolder from "./auth/AuthStateHolder";
import SettingsPageContent from "./components/pages/settings/SettingsPageContent";
import TasksPageContent from "./components/pages/tasks/TasksPageContent";

export default function App() {
    return (
        <AuthStateHolder>
            <div className="app">
                <Header/>
                <div className="app-body">
                    <Sidebar/>
                    <main className="main">
                        <div className="my-2 mx-1">
                            <Switch>
                                <Route path="/login" component={LoginPageContent}/>
                                <Route path="/register" component={RegisterPageContent}/>
                                <Route path="/settings" component={SettingsPageContent}/>
                                <Route path="/participants" component={ParticipantsPageContent}/>
                                <Route path="/tasks" component={TasksPageContent}/>
                                <Route path="/contests" component={ContestPageContent}/>
                                <Route path="/">
                                    <Redirect to="/contests"/>
                                </Route>
                            </Switch>
                        </div>
                    </main>
                </div>
            </div>
        </AuthStateHolder>
    );
}