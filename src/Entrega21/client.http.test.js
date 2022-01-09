import axios from "axios";
import as from "assert"

const assert = as.strict

async function get() {
  const response = await axios.get("http://localhost:8080/api/");
  return response.data;
}

async function post() {
  const response = await axios.post("http://localhost:8080/api/");
  return response.data;
}

async function modify() {
  const response = await axios.put("http://localhost:8080/api/");
  return response.data;
}

async function aDelete() {
  const response = await axios.delete("http://localhost:8080/api/");
  return response.data;
}


describe('Suit de Test', () => {
  it("Al consultar por primera vez la lista de productos debería llegar vacía", async () =>{
    const lista = await get()
    assert.strictEqual(lista.length, 0)
  })
  it("Al agregar un producto a la lista debería guardarse", async () =>{
    const lista = await post()
    assert.strictEqual(lista.length, 1)
  })
  it("Al borrar el producto que se agregó a la lista, debería llegar vacía", async () =>{
    const lista = await aDelete()
    assert.strictEqual(lista.length, 0)
  })
  it("Al modificar un producto, este debería cambiar", async () =>{
    let lista = await post()
    const producto1 = lista[0]
    lista = await modify()
    const producto2 = lista[0]
    assert.notStrictEqual(producto1, producto2)
  })

})
