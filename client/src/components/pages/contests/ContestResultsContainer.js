import {If} from "../../../utils/components";
import {ParticipantType, UserRole} from "../../../api/enums";
import React from "react";
import {ContestSingleParticipantResultsTable} from "./ContestSingleParticipantResultsTable";
import {ContestGroupParticipantResultsTable} from "./ContestGroupParticipantResultsTable";

export function ContestResultsContainer(props) {
    const data = props.data
    const onChangeCallback = props.onChange
    const isSingleParticipant = data.participantType === ParticipantType.SINGLE.name

    function onAddResultButtonClick() {
        // TODO: implement
        onChangeCallback()
    }

    return <div>
        <If roleAtLeast={UserRole.VOLUNTEER}>
            <button className="btn btn-primary btn-sm mb-2" onClick={onAddResultButtonClick}>Внести результат</button>
        </If>
        <div className="table-responsive">
            <If cond={isSingleParticipant}>
                <ContestSingleParticipantResultsTable data={data.singleParticipants} onChange={onChangeCallback}/>
            </If>
            <If cond={!isSingleParticipant}>
                <ContestGroupParticipantResultsTable data={data.contestParticipantGroups} onChange={onChangeCallback}/>
            </If>
        </div>
    </div>
}