import {If} from "../../../utils/components";
import {ParticipantType} from "../../../api/enums";
import React from "react";
import {ContestSingleParticipantResultsTable} from "./ContestSingleParticipantResultsTable";
import {ContestGroupParticipantResultsTable} from "./ContestGroupParticipantResultsTable";

export function ContestResultsContainer(props) {
    const data = props.data
    const onChangeCallback = props.onChange
    const isSingleParticipant = data.participantType === ParticipantType.SINGLE.name

    return <div>
        <div className="table-responsive">
            <If cond={isSingleParticipant}>
                <ContestSingleParticipantResultsTable data={data.singleParticipants} onChange={onChangeCallback}/>
            </If>
            <If cond={!isSingleParticipant}>
                <ContestGroupParticipantResultsTable data={data.contestParticipantGroups}
                                                     contestId={data.id}
                                                     onChange={onChangeCallback}/>
            </If>
        </div>
    </div>
}