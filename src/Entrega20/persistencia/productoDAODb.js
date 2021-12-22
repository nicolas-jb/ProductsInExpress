import mongoose from 'mongoose'
import { asDto } from './ProductoDTO/productoDTO.js'
import log4js from "../services/logger.utils.js"
const loggerConsole = log4js.getLogger();


const productoSchema = new mongoose.Schema({
    title: { type: String },
    price: { type: Number },
    thumbnail: { type: String }
});

export default class PersonasDaoDb {

    constructor(cnxStr) {
        this.cnxStr = cnxStr
        this.productos = mongoose.model('Productos', productoSchema)
    }

    async init() {
        await mongoose.connect(this.cnxStr)
        loggerConsole.info('Productos DAO en mongodb -> listo')
    }

    async disconnect() {
        await mongoose.disconnect()
        loggerConsole.info('Productos DAO en mongodb -> cerrado')
    }

    async get() {
        const productos = await this.productos.find({})
        return asDto(productos)
        
    }

    
    async add(producto) {
        await this.productos.create(producto)
        
    }

    
}
