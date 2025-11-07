export const formatErrorResponse = (errorResponse) => {
  return errorResponse.map((error) => ({
    errore: `El campo '${error.path[0]}' debe ser de tipo '${error.expected}'. Se recibió un valor de tipo '${error.received}'.`,
    details: {
      code: error.code,
      expected: error.expected,
      received: error.received,
      path: error.path,
    },
  }));
};
