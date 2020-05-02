import React from "react";
import {useRouteMatch} from "react-router-dom";

export default function ParticipantEditForm() {
    const {params} = useRouteMatch();

    return <div>
        Edit form will be here for {params.participantId}
    </div>
}