import gql from "graphql-tag";
import { graphql } from 'react-apollo';


export const getPlaces = graphql(gql`
  query { 
    filteredPlaces {
      id
      name
      description
      picture
      minParticipants
      maxParticipants
    }
  }
`, {
  options: (props => {
    return props.userLocation
  })
})