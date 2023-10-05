import * as Yup from 'yup'

export function getEmailValidationSchema() {
    return Yup.object().shape({
        to: Yup.string().email('Invalid email').required('Cannot be empty'),
    })
}
