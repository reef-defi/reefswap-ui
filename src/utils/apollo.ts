
import { split, HttpLink, ApolloClient, InMemoryCache} from "@apollo/client";
import {getMainDefinition} from "@apollo/client/utilities";
import { WebSocketLink } from '@apollo/client/link/ws';
import { useMemo } from "react";

const apolloClientLinks = (uri: string) => {
  const httpLink = new HttpLink({uri: uri.replace('wss', 'https')});
  const wsLink = new WebSocketLink({
    uri,
    options: {
      reconnect: true,
    }
  });

  return split(
    ({query}) => {
      const definition = getMainDefinition(query);
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    },
    wsLink,
    httpLink
  )
}

export const createApolloClient = (uri: string) => useMemo(() => new ApolloClient({
  cache: new InMemoryCache(),
  link: apolloClientLinks(uri)
}), [uri]);