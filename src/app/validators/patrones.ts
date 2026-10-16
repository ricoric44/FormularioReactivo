// Patrones compartidos por los dos formularios (reactivo y template-driven).
// Se usan expresiones regulares literales: en un string habría que escribir "\\d"
// y es fácil perder la barra (el patrón dejaría de aceptar números).

// Contraseña: mínimo 8 caracteres, al menos una letra y un número
export const PATRON_PASSWORD = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

// Teléfono español: 9 dígitos que empiezan por 6, 7, 8 o 9
export const PATRON_TELEFONO = /^[6789]\d{8}$/;
