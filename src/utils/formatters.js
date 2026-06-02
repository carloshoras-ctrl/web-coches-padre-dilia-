export const formatPrice = (value) => {
    return Number(value || 0).toLocaleString("es-ES");
}