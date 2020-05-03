import React, {useState} from "react";
import {httpJsonRequest, httpTextRequest} from "../../../utils/http";
import {If} from "../../../utils/components";
import {UserRole} from "../../../api/enums";
import {personFullName} from "../../../utils/language_utils";


function DropdownListItems(props) {
    const defaultItemValue = "Не найдено"
    if (props.items.length == 0) {
        return <a href="#" onClick={e => e.preventDefault()} className="dropdown-item disabled">
            {defaultItemValue}
        </a>
    }
    return props.items.map(it => {
        return <a key={it.id} href="#" className="dropdown-item"
                  onClick={e => props.onItemSelect(e, it)}>
            {it.value}
        </a>
    })
}

function filterParticipantByQuery(it, filterQuery) {
    const fullName = personFullName(it)
    if (filterQuery === "") {
        return true
    }
    return fullName.toLowerCase().includes(filterQuery.toLowerCase())
}

export function RegisterParticipantBlock(props) {
    const contestId = props.contestId;
    const onRegistrationSuccessCallback = props.onRegistrationSuccessCallback;

    const [participants, setAvailableParticipants] = useState([]);
    const [participantsNotLoaded, setParticipantsNotLoaded] = useState(true);
    const [filteredParticipants, setFilteredParticipants] = useState([]);
    const [query, setQuery] = useState("");
    const [selectedId, setSelectedId] = useState(null);

    const showDropdown = query.length > 0 && selectedId == null;

    function processFilteredParticipants(participants, filterQuery) {
        const newValue = participants.filter(it => filterParticipantByQuery(it, filterQuery))
            .map(it => ({ id: it.id, value: personFullName(it)}))
        setFilteredParticipants(newValue)
    }

    if (showDropdown && participantsNotLoaded) {
        setParticipantsNotLoaded(false)
        httpJsonRequest("GET", "person")
            .then(response => {
                setAvailableParticipants(response)
                processFilteredParticipants(response, query)
            })
    }

    function onAddButtonClick() {
        httpTextRequest("POST", `contest/${contestId}/registration`, {
            participantId: selectedId
        }).then(() => {
            setSelectedId(null)
            setQuery("")
            onRegistrationSuccessCallback()
        })
    }

    function onDropdownOptionClick(e, it) {
        e.preventDefault()
        setSelectedId(it.id)
        setQuery(it.value)
    }

    function onQueryInputChange(e) {
        const newQuery = e.target.value
        setQuery(newQuery)
        setSelectedId(null)
        processFilteredParticipants(participants, newQuery)
    }

    function onChangeFocus(from) {
        // TODO: can't hide dropdown on focus change since onBlur conflicts with onCLick dropdown item
    }

    return (
        <If roleAtLeast={UserRole.VOLUNTEER}>
            <div className="input-group">
                <input type="search"
                       id="dropdown-input"
                       value={query}
                       className="dropdown-toggle form-control"
                       onChange={onQueryInputChange}
                       placeholder="Добавить участника"
                       onFocus={() => onChangeFocus(true)}
                       onBlur={() => onChangeFocus(false)}
                />
                <If cond={showDropdown}>
                    <div className="dropdown-menu show" aria-labelledby="dropdown-input">
                        <DropdownListItems onItemSelect={onDropdownOptionClick} items={filteredParticipants}/>
                    </div>
                </If>
                <div className="input-group-btn">
                    <button className="btn btn-primary" onClick={onAddButtonClick} disabled={selectedId == null}>
                        Добавить
                    </button>
                </div>
            </div>
        </If>
    )
}