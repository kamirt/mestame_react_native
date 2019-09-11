import gql from 'graphql-tag';

export const defaults = gql`
  type UserLocation {
    latitude: Float
    longitude: Float
  }
  
  extend type Query {
    userLocation: UserLocation
  }
`;

export const resolvers = {

};

export const queries = {
  GET_USER_LOCATION: gql`
    query GetUserLocation {
      userLocation @client {
        latitude
        longitude
      }
    }
  `
};
