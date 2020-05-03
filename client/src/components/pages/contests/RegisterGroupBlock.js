import React, {useState} from "react";
import {If} from "../../../utils/components";
import PersonSearchDropdownInput from "../../forms/PersonSearchDropdownInput";
import {httpTextRequest} from "../../../utils/http";

function RegisterGroupForm(props) {
    const cancelClickCallback = props.cancelClickCallback;
    const contestId = props.contestId;
    const createSuccessCallback = props.createSuccessCallback;

    const [members, setMembers] = useState([]);
    const [groupName, setGroupName] = useState("")

    const dropdownCallbacks = {}

    function clearState() {
        setMembers([])
        setGroupName("")
    }

    function onCancelButtonClick() {
        clearState()
        cancelClickCallback()
    }

    function onCreateButtonClick() {
        httpTextRequest("POST", `contest/${contestId}/registration`, {
            groupName: groupName,
            participantIds: members.map(it => it.id)
        }).then(() => {
            clearState()
            createSuccessCallback()
        })
    }

    function onChange(selected) {
        if (selected != null) {
            setMembers((prevMembers) => prevMembers.concat(selected))
            dropdownCallbacks.clearQuery()
        }
    }

    function groupNotContainsMember(member) {
        return members.find(it => it.id === member.id) == null
    }

    return <div className="card">
        <div className="card-header">
            Зарегистрировать группу
        </div>
        <div className="card-body card-block">
            <div className="row">
                <div className="col-12">
                    <div className="form-group">
                        <input type="text" className="form-control" id="group-name-input"
                               placeholder="Введите название группы"
                               onChange={e => setGroupName(e.target.value)}
                               value={groupName}
                        />
                    </div>
                    <div className="form-group">
                        <table>
                            <tbody>
                            {members.map(member => {
                                return <tr key={member.id}>
                                    <th> {member.value}</th>
                                    <th>
                                        <button className="btn btn-danger btn-sm"
                                                onClick={() => setMembers(members.filter(it => it.id !== member.id))}>
                                            Удалить
                                        </button>
                                    </th>
                                </tr>
                            })}
                            </tbody>
                        </table>
                    </div>
                    <div className="form-group">
                        <div className="input-group">
                            <PersonSearchDropdownInput onChange={onChange}
                                                       registerCallbacks={dropdownCallbacks}
                                                       filter={groupNotContainsMember}
                                                       placeholderText="Начните вводить имя"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="card-footer">
            <div className="row">
                <div className="col-6">
                    <button className="btn btn-danger" onClick={onCancelButtonClick}>Отмена</button>
                </div>
                <div className="col-6">
                    <button className="btn btn-success" onClick={onCreateButtonClick}
                            disabled={members.length < 2}>Зарегистрировать
                    </button>
                </div>
            </div>
        </div>
    </div>
}

export function RegisterGroupBlock(props) {
    const contestId = props.contestId;
    const [isEditing, setEditing] = useState(false);

    function createSuccessCallback() {
        setEditing(false)
        props.createSuccessCallback()
    }

    return <div className="row">
        <If cond={!isEditing}>
            <div className="col-3">
                <button className="btn btn-primary"
                        onClick={() => setEditing(true)}>Зарегистрировать группу
                </button>
            </div>
        </If>
        <If cond={isEditing}>
            <div className="col-md-8 col-xs-12">
                <RegisterGroupForm
                    cancelClickCallback={() => setEditing(false)}
                    contestId={contestId}
                    createSuccessCallback={createSuccessCallback}
                />
            </div>
        </If>
    </div>
}