export const isNearExpiry = (fecha) => {
  const diasRestantes = (new Date(fecha) - new Date()) / (1000 * 60 * 60 * 24);
  return diasRestantes <= 3;
};
