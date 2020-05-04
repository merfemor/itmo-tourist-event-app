import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {httpBlobRequest, saveFileOnCurrentPage} from "../../../utils/http";
import {Modal} from "reactstrap";
import {EnumSelect} from "../../forms/EnumSelect";
import {ItmoStudentsResultFilter, requireEnumByName, ResultParticipantsType} from "../../../api/enums";

function getFilenameForContestResults(contest, resultsConf) {
    const participantGender = requireEnumByName(ResultParticipantsType, resultsConf.participantGender).displayName;
    const itmoStudentsResultFilter = resultsConf.itmoStudentsResultFilter || "Среди всех";
    return `${contest.name} - Результаты: ${participantGender}, ${itmoStudentsResultFilter}.csv`;
}

export function ContestResultDownloadButton(props) {
    const {data} = props;
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const {register, handleSubmit} = useForm();

    function onSubmitForm(formData) {
        const filename = getFilenameForContestResults(data, formData)
        const requestData = {
            ...formData,
            contestId: data.id
        }
        httpBlobRequest("GET", "download/results", null, requestData)
            .then(blob => {
                saveFileOnCurrentPage(blob, filename)
                setModalIsOpen(false)
            })
    }

    function onClick(e) {
        e.preventDefault()
        setModalIsOpen(true)
    }

    function onCancelClick(e) {
        e.preventDefault() // prevent form submit
        setModalIsOpen(false)
    }

    return <div>
        <a href="#" className={props.className} onClick={onClick}>
            {props.children}
        </a>
        <Modal isOpen={modalIsOpen} className="modal-primary">
            <div className="modal-header">
                <h4 className="modal-title">
                    Скачать результаты
                </h4>
            </div>
            <form onSubmit={handleSubmit(onSubmitForm)}>
                <div className="modal-body">
                    <div className="form-group">
                        <EnumSelect enumClass={ResultParticipantsType}
                                    defaultValue={ResultParticipantsType.MEN}
                                    nullable={false}
                                    className="form-control"
                                    name="participantGender"
                                    id="participants-type-select"
                                    reference={register}/>
                    </div>
                    <div className="form-group">
                        <EnumSelect enumClass={ItmoStudentsResultFilter}
                                    defaultValue=""
                                    nullable={true}
                                    nullText="Среди всех"
                                    className="form-control"
                                    name="itmoStudentsResultFilter"
                                    id="itmo-students-result-filter-select"
                                    reference={register}/>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-success" type="submit">Загрузить</button>
                    <button className="btn btn-primary" onClick={onCancelClick}>Отмена</button>
                </div>
            </form>
        </Modal>
    </div>
}