import Joi, { PartialSchemaMap } from 'joi'

export const validateBody = <TValidateBody = any>(schema: PartialSchemaMap<TValidateBody>, body: TValidateBody) => {
    const validation = Joi.object<TValidateBody>(schema).validate(body)
    if (validation.error) {
        throw { message: 'Invalid request body', errors: validation.error.details }
    }
}
