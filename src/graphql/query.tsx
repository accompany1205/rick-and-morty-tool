import { gql } from '@apollo/client/core';

export const GET_CHARACTERS = gql`
  query GetCharacters {
    characters {
      results {
        id
        name
      }
    }
  }
`;

export const GET_LOCATIONS = gql`
  query GetLocations {
    locations {
      results {
        id
        name
      }
    }
  }
`;