import './App.css';
import { Outlet } from 'react-router-dom';
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client';
// import { urlencoded } from 'express';
import { setContext } from '@apollo/client/link/context';
import Navbar from './components/Navbar';

// This is the link to the GraphQL server. This is the server that the Apollo Client will communicate with to retrieve the data.
const httpLink = createHttpLink({
  uri: '/graphql',
});

// This middleware will retrieve the token from local storage and set the HTTP request headers of every request to include the token.
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div>
        <Navbar />
        <Outlet />
      </div>
    </ApolloProvider>
  );
}

export default App;
