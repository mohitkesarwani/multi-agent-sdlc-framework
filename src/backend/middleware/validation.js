import { ZodError } from 'zod';

/**
 * Middleware factory function to validate request body using Zod schema.
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against.
 * @returns {Function} Middleware function.
 */
export const validateRequest = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next(); // proceed to the next middleware if validation passes
        } catch (err) {
            if (err instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    errors: err.errors,
                });
            }
            next(err); // pass other errors to the error handler
        }
    };
};
