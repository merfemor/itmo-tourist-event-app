import React from 'react';

import {BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom';
import ContestsPageContent from "./pages/contests/ContestsPageContent";
import ParticipantsPageContent from "./pages/participants/ParticipantsPageContent";

function App() {
    return (
        <Router>
            <header>
                <ul>
                    <li>
                        <Link to="/participants">Participants</Link>
                    </li>
                    <li>
                        <Link to="/contests">Contests</Link>
                    </li>
                </ul>
            </header>

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
        </Router>
    );
}

export default App;
