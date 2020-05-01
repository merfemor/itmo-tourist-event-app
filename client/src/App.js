import React from 'react';

import {Route, Switch} from 'react-router-dom';
import ContestsPageContent from "./pages/contests/ContestsPageContent";
import ParticipantsPageContent from "./pages/participants/ParticipantsPageContent";
import Header from "./components/header/Header";

function App() {
    return (
        <div className="app">
            <Header/>
            <Switch>
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
    );
}

export default App;
