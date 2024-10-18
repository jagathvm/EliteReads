const validateData = (data, schema) => {
  const { error, value } = schema.validate(data, {
    abortEarly: true,
  });

  if (error) {
    return {
      valid: false,
      errorMessage: error.details[0].message,
    };
  }
  return { valid: true, value };
};

export { validateData };
