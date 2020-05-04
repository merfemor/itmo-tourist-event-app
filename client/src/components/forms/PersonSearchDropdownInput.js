import React, {useState} from "react";
import {personFullName} from "../../utils/language_utils";
import {httpJsonRequest} from "../../utils/http";
import {If} from "../../utils/components";
import {filterPersonByQuery} from "./filter";

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
            {personFullName(it)}
        </a>
    })
}

export default function PersonSearchDropdownInput(props) {
    const { value, onChange, placeholderText } = props;
    const additionalFilter = props.filter || (() => true)
    const [inputQuery, setQuery] = useState(value == null ? "" : personFullName(value));
    const [participants, setAvailableParticipants] = useState([]);
    const [participantsNotLoaded, setParticipantsNotLoaded] = useState(true);
    const [filteredParticipants, setFilteredParticipants] = useState([]);

    // FIXME: how to properly change value with query through props?
    const query = value != null ? personFullName(value) : inputQuery
    const showDropdown = query.length > 0 && value == null;

    if (props.registerCallbacks != null) {
        props.registerCallbacks.clearQuery = () => {
            setQuery("")
            onChange(null)
        };
    }

    function processFilteredParticipants(participants, filterQuery) {
        const newValue = participants.filter(it => filterPersonByQuery(it, filterQuery))
            .filter(additionalFilter)
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
        setQuery(personFullName(it))
        onChange(it)
    }

    function onQueryInputChange(e) {
        const newQuery = e.target.value
        setQuery(newQuery)
        onChange(null)
        processFilteredParticipants(participants, newQuery)
    }

    function onChangeFocus(from) {
        // TODO: can't hide dropdown on focus change since onBlur conflicts with onCLick dropdown item
    }

    return [
        <input type="search"
               key="PersonSearchDropdownInput-input"
               id={props.id}
               value={query}
               className="dropdown-toggle form-control"
               onChange={onQueryInputChange}
               placeholder={placeholderText}
               onFocus={() => onChangeFocus(true)}
               onBlur={() => onChangeFocus(false)}
        />,
        <If key="PersonSearchDropdownInput-if" cond={showDropdown}>
            <div className="dropdown-menu show" aria-labelledby="dropdown-input">
                <DropdownListItems onItemSelect={onDropdownOptionClick} items={filteredParticipants}/>
            </div>
        </If>
    ]
}