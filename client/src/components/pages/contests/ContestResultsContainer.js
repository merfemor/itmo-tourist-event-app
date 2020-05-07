import {If} from "../../../utils/components";
import {ParticipantType, UserRole} from "../../../api/enums";
import React, {useState} from "react";
import {ContestSingleParticipantResultsTable} from "./ContestSingleParticipantResultsTable";
import {ContestGroupParticipantResultsTable} from "./ContestGroupParticipantResultsTable";
import {ContestSingleResultsFilterContainer} from "./ContestSingleResultsFilterContainer";
import {ContestGroupResultsFilterContainer} from "./ContestGroupResultsFilterContainer";
import {ContestResultDownloadButton} from "./ContestResultDownloadButton";

export function ContestResultsContainer(props) {
    const {data, onChange: onChangeCallback} = props
    const [singleFilterPredicate, setSingleFilterPredicate] = useState(() => (() => true))
    const [groupFilterPredicate, setGroupFilterPredicate] = useState(() => ((() => true)))
    const isSingleParticipant = data.participantType === ParticipantType.SINGLE.name
    const {singleParticipants, contestParticipantGroups} = data;

    const filteredSingleData = singleParticipants.filter(singleFilterPredicate)
    const filterGroupData = contestParticipantGroups.filter(groupFilterPredicate)

    return <div>
        <If cond={isSingleParticipant}>
            <ContestSingleResultsFilterContainer
                onFilterChange={(newFilter) => setSingleFilterPredicate(() => newFilter)}/>
            <ContestSingleParticipantResultsTable data={filteredSingleData} onChange={onChangeCallback}/>
            <If roleAtLeast={UserRole.ORGANIZER}>
                <ContestResultDownloadButton data={data} className="btn btn-link">
                    Скачать результаты
                </ContestResultDownloadButton>
            </If>
        </If>
        <If cond={!isSingleParticipant}>
            <ContestGroupResultsFilterContainer
                onFilterChange={(newFilter) => setGroupFilterPredicate(() => newFilter)}/>
            <ContestGroupParticipantResultsTable data={filterGroupData}
                                                 contestId={data.id}
                                                 onChange={onChangeCallback}/>
        </If>
    </div>
}