import * as Yup from 'yup'
import { getAllFolderIds } from '../../util/util'

export function getLabelValidationSchema(labels) {
    return Yup.object().shape({
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
}
