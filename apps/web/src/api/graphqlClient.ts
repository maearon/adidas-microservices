// src/api/graphqlClient.ts
import { GraphQLClient } from 'graphql-request';

const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql';

const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    // Authorization: `Bearer ${your_token}`,
  },
});

export default graphQLClient;
