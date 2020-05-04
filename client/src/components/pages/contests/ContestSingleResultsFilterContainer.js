import React, {useState} from "react";
import {isNotEmpty} from "../../../utils/type_utils";
import {filterPersonByQuery} from "../../forms/filter";
import {IsMaleSelect} from "../../forms/IsMaleSelect";

export function ContestSingleResultsFilterContainer(props) {
    const {onFilterChange} = props
    const [isMale, setIsMale] = useState(null)
    const [nameQuery, setNameQuery] = useState("")

    function updateFilter(isMale, nameQuery) {
        const filter = (item) => {
            if (isMale != null && item.participant.isMale !== isMale) {
                return false
            }
            if (isNotEmpty(nameQuery) && !filterPersonByQuery(item.participant, nameQuery)) {
                return false
            }
            return true
        }
        onFilterChange(filter)
    }

    function onIsMaleChange(newValue) {
        updateFilter(newValue, nameQuery)
        setIsMale(newValue)
    }

    function onNameQueryChange(e) {
        const newValue = e.target.value
        updateFilter(isMale, newValue)
        setNameQuery(nameQuery)
    }

    return <div className="mb-2 row">
        <div className="col-8">
            <input type="text" onChange={onNameQueryChange} defaultValue={nameQuery} className="form-control"
                   placeholder="Искать по ФИО"/>
        </div>
        <div className="col-4">
            <IsMaleSelect name="isMale" className="form-control" onChange={onIsMaleChange}/>
        </div>
    </div>
}