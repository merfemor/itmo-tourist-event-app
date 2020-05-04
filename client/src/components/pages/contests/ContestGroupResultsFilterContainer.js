import React, {useState} from "react";
import {isNotEmpty} from "../../../utils/type_utils";
import {filterPersonByQuery, includesLowerCase} from "../../forms/filter";
import {anyMatches} from "../../../utils/collections";

export function ContestGroupResultsFilterContainer(props) {
    const {onFilterChange} = props
    const [nameQuery, setNameQuery] = useState("")

    function updateFilter(nameQuery) {
        const filter = (item) => {
            if (isNotEmpty(nameQuery)) {
                const nameMatches = includesLowerCase(item.name, nameQuery)
                const anyMemberMatches = anyMatches(item.members, it => filterPersonByQuery(it, nameQuery))
                if (!nameMatches && !anyMemberMatches) {
                    return false;
                }
            }
            return true
        }
        onFilterChange(filter)
    }

    function onNameQueryChange(e) {
        const newValue = e.target.value
        updateFilter(newValue)
        setNameQuery(nameQuery)
    }

    return <div className="mb-1 row">
        <div className="col-12">
            <input type="text" onChange={onNameQueryChange} defaultValue={nameQuery} className="form-control"
                   placeholder="Искать по ФИО и названию группы"/>
        </div>
    </div>
}