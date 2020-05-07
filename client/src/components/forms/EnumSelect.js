import {isNullOrEmpty} from "../../utils/type_utils";
import {requireEnumByName} from "../../api/enums";
import {If} from "../../utils/components";
import React from "react";

export function EnumSelect(props) {
    const {enumClass, defaultValue, onChange, nullable, className, name, id, nullText, reference} = props

    function onChangeField(e) {
        if (onChange == null) {
            return
        }
        const newValue = e.target.value
        if (isNullOrEmpty(newValue)) {
            onChange(null)
        } else {
            onChange(requireEnumByName(enumClass, newValue))
        }
    }

    const values = []
    for (let i in enumClass) {
        values.push(enumClass[i])
    }
    return <select id={id} defaultValue={defaultValue?.name} className={className} name={name}
                   ref={reference}
                   onChange={onChangeField}>
        <If cond={nullable === true}>
            <option value="">{nullText}</option>
        </If>
        {values.map(it => <option key={it.name} value={it.name}>{it.displayName}</option>)}
    </select>
}