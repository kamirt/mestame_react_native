import gql from "graphql-tag";
import { graphql } from 'react-apollo';

export const getUserLocation = graphql(gql`
    query getUserLocation {
      userLocation @client
    }
`)