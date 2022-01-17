export default function generateRandomsNumbers(cant) {
  const myMap = new Map();
  let number;
  let value;
  for (let i = 0; i < cant; i++) {
    number = Math.floor(Math.random() * 1000);
    if (myMap.has(number)) {
      value = myMap.get(number) + 1;
    } else {
      value = 1;
    }

    myMap.set(number, value);
   // console.log(`Pasada: ${i + 1}, Valor obtenido: ${number}`);
  }

  const sortedMap = new Map([...myMap.entries()].sort((a, b) => a[0] - b[0]));

  return Array.from(sortedMap, ([number, quantity]) => ({ number, quantity }));
}


