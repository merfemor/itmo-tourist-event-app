import {useForm} from "react-hook-form";
import {Modal} from "reactstrap";
import React from "react";
import {If} from "../../../utils/components";

function isResultValid(formData) {
    return formData.penalty !== "" || formData.time !== "" || formData.points !== ""
}

export function EditContestResultModal(props) {
    const onSubmitCallback = props.onSubmit;
    const onCancelCallback = props.onCancel;
    const onDeleteCallback = props.onDelete;
    const data = props.data;
    const isOpen = props.isOpen;

    const {register, handleSubmit, errors, getValues} = useForm();

    function onSubmitForm(formData) {
        onSubmitCallback({
            ...data,
            ...formData
        })
    }

    function onCancelClick(e) {
        e.preventDefault() // prevent form submit
        onCancelCallback()
    }

    function onDeleteClick(e) {
        e.preventDefault() // prevent form submit
        onDeleteCallback()
    }

    return <Modal isOpen={isOpen} className="modal-primary">
        <div className="modal-header">
            <h4 className="modal-title">
                Результат
            </h4>
        </div>
        <form onSubmit={handleSubmit(onSubmitForm)}>
            <div className="modal-body">
                <div className="form-group">
                    <label htmlFor="time-input" className="form-control-label">Время</label>
                    <input type="number" id="time-input" placeholder="Введите время"
                           defaultValue={data?.time}
                           className={"form-control" + (errors.time ? " is-invalid" : "")}
                           name="time" ref={register({ validate: () => isResultValid(getValues())})}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="points-input" className="form-control-label">Баллы</label>
                    <input type="number" id="points-input" placeholder="Введите баллы"
                           defaultValue={data?.points}
                           className={"form-control" + (errors.points ? " is-invalid" : "")}
                           name="points" ref={register({ validate: () => isResultValid(getValues())})}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="penalty-input" className="form-control-label">Штраф</label>
                    <input type="number" id="penalty-input" placeholder="Введите штраф"
                           defaultValue={data?.penalty}
                           className={"form-control" + (errors.penalty ? " is-invalid" : "")}
                           name="penalty" ref={register({ validate: () => isResultValid(getValues())})}
                    />
                </div>
            </div>
            <div className="modal-footer">
                <button className="btn btn-success" type="submit"><i className="fa fa-save"/> Сохранить</button>
                <If cond={data != null}>
                    <button className="btn btn-danger ml-2" onClick={onDeleteClick}><i className="fa fa-trash"/> Удалить</button>
                </If>
                <button className="btn btn-secondary ml-2" onClick={onCancelClick}>Отмена</button>
            </div>
        </form>
    </Modal>
}