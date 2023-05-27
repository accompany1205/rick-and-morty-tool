import React from 'react';
import './App.css';
import SceneEditor from './components/SceneEditor';
import { ApolloProvider } from "@apollo/client";
import { client } from './graphql/config';

function App() {
  return (
    <div className="App">
      <ApolloProvider client={client}>
        <SceneEditor />
      </ApolloProvider>

    </div>
  );
}

export default App;
