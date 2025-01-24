const typeDefs = `
 type Query {
    me: User
  }
      
  type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int
    savedBooks: [Book]!
  }

  type Book {
    bookId: String!
    title: String!
    authors: [String]
    description: String  
    image: String 
    link: String
  }

  type Auth {
    token: String!
    user: User!
  }

  input BookInput {
    bookId: String!
    title: String!
    authors: [String]
    description: String  
    image: String  
    link: String
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveBook(bookData: BookInput!): User
    removeBook(bookId: String!): User
  }

`;

export default typeDefs;
