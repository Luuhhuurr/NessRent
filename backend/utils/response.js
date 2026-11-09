/**
 * Every endpoint answers with the same envelope so the frontend never has to
 * guess at the shape of a response.
 *
 *   success → { success: true, message?: string, data?: any }
 *   failure → { success: false, message: string, errors?: Record<string, string> }
 */

const sendSuccess = (res, { message, data, status = 200 } = {}) => {
  const body = { success: true };
  if (message) body.message = message;
  if (data !== undefined) body.data = data;
  return res.status(status).json(body);
};

const sendError = (res, { message, status = 500, errors } = {}) => {
  const body = { success: false, message };
  if (errors) body.errors = errors;
  return res.status(status).json(body);
};

module.exports = { sendSuccess, sendError };
