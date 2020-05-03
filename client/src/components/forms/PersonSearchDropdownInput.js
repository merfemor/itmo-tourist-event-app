import React, {useState} from "react";
import {personFullName} from "../../utils/language_utils";
import {httpJsonRequest} from "../../utils/http";
import {If} from "../../utils/components";

function DropdownListItems(props) {
    const defaultItemValue = "Не найдено"
    if (props.items.length === 0) {
        return <a href="/" onClick={e => e.preventDefault()} className="dropdown-item disabled">
            {defaultItemValue}
        </a>
    }
    return props.items.map(it => {
        return <a key={it.id} href="/" className="dropdown-item"
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

export default function PersonSearchDropdownInput(props) {
    const onChange = props.onChange;
    const placeholderText = props.placeholderText;
    const additionalFilter = props.filter || (() => true)
    const [selectedId, setSelectedId] = useState(null);
    const [participants, setAvailableParticipants] = useState([]);
    const [participantsNotLoaded, setParticipantsNotLoaded] = useState(true);
    const [filteredParticipants, setFilteredParticipants] = useState([]);
    const [query, setQuery] = useState("");

    const showDropdown = query.length > 0 && selectedId == null;

    props.registerCallbacks.clearQuery = () => {
        setQuery("")
        setSelectedId(null)
        onChange(null)
    };

    function processFilteredParticipants(participants, filterQuery) {
        const newValue = participants.filter(it => filterParticipantByQuery(it, filterQuery))
            .filter(additionalFilter)
            .map(it => ({id: it.id, value: personFullName(it)}))
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

    function onDropdownOptionClick(e, it) {
        e.preventDefault()
        setSelectedId(it.id)
        setQuery(it.value)
        onChange(it)
    }

    function onQueryInputChange(e) {
        const newQuery = e.target.value
        setQuery(newQuery)
        setSelectedId(null)
        onChange(null)
        processFilteredParticipants(participants, newQuery)
    }

    function onChangeFocus(from) {
        // TODO: can't hide dropdown on focus change since onBlur conflicts with onCLick dropdown item
    }

    return [
        <input type="search"
               key="PersonSearchDropdownInput-input"
               id="dropdown-input"
               value={query}
               className="dropdown-toggle form-control"
               onChange={onQueryInputChange}
               placeholder={placeholderText}
               onFocus={() => onChangeFocus(true)}
               onBlur={() => onChangeFocus(false)}
        />,
        <If  key="PersonSearchDropdownInput-if" cond={showDropdown}>
            <div className="dropdown-menu show" aria-labelledby="dropdown-input">
                <DropdownListItems onItemSelect={onDropdownOptionClick} items={filteredParticipants}/>
            </div>
        </If>
    ]
}