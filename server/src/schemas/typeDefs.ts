const typeDefs = `
  type User {
    _id: ID!
    username: String!
    email: String!
    savedBooks: [Book]!  # Ensure that savedBooks is always an array
  }

  type Book {
    bookId: String!
    title: String!
    authors: [String]
    description: String  # Made optional
    image: String  # Made optional
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
    description: String  # Made optional
    image: String  # Made optional
    link: String
  }

  type Query {
    me: User
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): Auth
    login(email: String, username: String, password: String!): Auth
    saveBook(bookData: BookInput!): User
    deleteBook(bookId: String!): User
  }
`;

export default typeDefs;
