export default class PersonaDto {
    constructor({   title, price, thumbnail }) {
        this.title = title
        this.price = price
        this.thumbnail = thumbnail
    }
}

export function asDto(producto) {
    if (Array.isArray(producto))
        return producto.map(p => new PersonaDto(p))
    else
        return new PersonaDto(producto)
}
