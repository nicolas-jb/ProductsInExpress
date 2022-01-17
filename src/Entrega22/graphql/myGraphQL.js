import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import { getData, postData, updateData, deleteData } from "../controller/controllersApi.js"


const schema = buildSchema(`
type Data {
titulo: String
precio: Int
thumbnail: String
}
input DataInput {
titulo: String!
precio: Int!
thumbnail: String!
}
type Query {
getData: [Data]
}
type Mutation {
postData(datos: DataInput): Data
updateData(datos: DataInput): Data
deleteData: Data
}
`);

export const myGraphQL = graphqlHTTP({
  schema: schema,
  rootValue: {
    getData,
    postData,
    updateData,
    deleteData,
  },
  graphiql: true,
});

