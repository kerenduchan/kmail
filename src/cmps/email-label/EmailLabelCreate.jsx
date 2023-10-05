import { Dialog } from '../Dialog'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { getAllFolderIds } from '../../util/util'

// Dialog for creating an email label
export function EmailLabelCreate({ label, labels, onCloseClick, onSaveClick }) {
    function onFormSubmit(values) {
        onSaveClick({ ...label, name: values.labelName.trim() })
    }

    const validationSchema = Yup.object().shape({
        labelName: Yup.string()
            .test(
                'isNotReservedName',
                'This is a reserved name. Choose another name.',
                function (value) {
                    return !getAllFolderIds().includes(value.toLowerCase())
                }
            )
            .test(
                'alreadyExists',
                'A label with this name already exists. Choose another name.',
                function (value) {
                    return !labels.some(
                        (l) => l.name.toLowerCase() == value.toLowerCase()
                    )
                }
            )
            .required('Cannot be empty'),
    })

    function Input(props) {
        return (
            <>
                <label htmlFor={props.id}>{props.label}</label>
                <input autoFocus {...props} />
            </>
        )
    }

    return (
        <Dialog
            title={label ? 'Edit Label' : 'New Label'}
            onCloseClick={onCloseClick}
        >
            <Formik
                initialValues={{
                    labelName: label ? label.name : '',
                }}
                validationSchema={validationSchema}
                onSubmit={onFormSubmit}
            >
                {({ errors, touched }) => (
                    <Form className="email-label-create-form">
                        <div className="email-label-create-form-field">
                            <Field
                                as={Input}
                                name="labelName"
                                id="labelName"
                                label="Label name:"
                            />
                            <div
                                className={`email-label-create-form-field-errors ${
                                    errors.labelName && touched.labelName
                                        ? 'visible'
                                        : ''
                                }`}
                            >
                                {errors.labelName}
                            </div>
                        </div>
                        <div className="email-label-create-form-actions">
                            <button
                                type="button"
                                className="weak-action-btn"
                                onClick={onCloseClick}
                            >
                                Cancel
                            </button>
                            <button className="strong-action-btn" type="submit">
                                {label ? 'Save' : 'Create'}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Dialog>
    )
}
