export const validateDocument = (value) => {
  const documentRegex =
    /(^\d{3}\.\d{3}\.\d{3}\-\d{2}$)|(^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$)/;

  return (
    documentRegex.test(value) || "Por favor, insira um documento válido."
  );
};
export const validatePhoneNumber = (value) => {
  console.log(value);
  const phoneRegex =
    /^(\+55)?\s?\(?(?:[1-9][0-9])\)?[-.\s]?\d{4,5}[-.\s]?\d{4}$/;

  return (
    phoneRegex.test(value) ||
    "Por favor, insira um número de telefone válido."
  );
};