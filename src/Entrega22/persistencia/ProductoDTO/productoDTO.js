export default class ProductoDTO {
    constructor({   titulo, precio, thumbnail }) {
        this.titulo = titulo
        this.precio = precio
        this.thumbnail = thumbnail
    }
}

export function asDto(producto) {
    if (Array.isArray(producto))
        return producto.map(p => new ProductoDTO(p))
    else
        return new ProductoDTO(producto)
}
