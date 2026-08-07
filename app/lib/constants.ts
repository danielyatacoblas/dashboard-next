// Valores compartidos entre la capa de datos y la interfaz.

/**
 * Filas por página en la tabla de pedidos. Vive aquí (y no en data.ts) para que
 * los skeletons puedan reservar exactamente el mismo número de filas sin
 * arrastrar la capa de consultas al bundle.
 */
export const ITEMS_PER_PAGE = 14;
