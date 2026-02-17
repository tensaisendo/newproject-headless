import { useMemo } from 'react';
import {
  getApolloClient,
  addApolloState as faustAddApolloState,
} from '@faustwp/core';

const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__';

/**
 * Hook pour récupérer le client Apollo avec hydratation du cache (SSR/SSG).
 * Utilise le client Faust (même endpoint GraphQL WordPress).
 */
export function useApollo(pageProps: Record<string, unknown>) {
  const state =
    (pageProps?.[APOLLO_STATE_PROP_NAME] as Record<string, unknown>) ??
    (pageProps?.initialApolloState as Record<string, unknown>);
  return useMemo(() => getApolloClient(state ?? undefined), [state]);
}

/**
 * Alias pour getApolloClient (utilisé dans getStaticProps / getServerSideProps).
 */
export const initializeApollo = getApolloClient;

/**
 * Ajoute l'état Apollo aux pageProps pour l'hydratation côté client.
 * À utiliser dans getStaticProps / getServerSideProps après les requêtes Apollo.
 */
export const addApolloState = faustAddApolloState;
