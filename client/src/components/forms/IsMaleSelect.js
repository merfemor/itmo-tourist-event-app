import React from "react";
import {parseBoolean} from "../../utils/type_utils";

export function IsMaleSelect(props) {
    const {id, reference, className, name} = props
    const onChange = (e) => props.onChange(parseBoolean(e.target.value))
    return <select id={id} defaultValue="" className={className} name={name} ref={reference} onChange={onChange}>
        <option value="">Выберите пол</option>
        <option value="true">Мужской</option>
        <option value="false">Женский</option>
    </select>
}