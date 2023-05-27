import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_CHARACTERS, GET_LOCATIONS } from '../graphql/query';
import { Character, Scene, Location } from '../types';


const SceneEditor: React.FC = () => {
  const { loading: characterLoading, data: characterData } = useQuery(GET_CHARACTERS);
  const { loading: locationLoading, data: locationData } = useQuery(GET_LOCATIONS);

  const [scenes, setScenes] = useState<Scene[]>([]);
  const [selectedScene, setSelectedScene] = useState('');
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('');

  const addScene = () => {
    if (selectedScene && selectedLocation && selectedCharacters.length > 0) {
      const newScene: Scene = {
        id: scenes.length.toString(),
        description: selectedScene,
        characters: selectedCharacters.map((characterName) => {
          const character = characterData.characters.results.find(
            (c: Character) => c.name === characterName
          );
          return { id: character?.id || '', name: characterName };
        }),
        location: {
          id: locationData.locations.results.find((l: Location) => l.name === selectedLocation)
            ?.id || '',
          name: selectedLocation,
        },
      };

      setScenes((prevScenes) => [...prevScenes, newScene]);
      setSelectedScene('');
      setSelectedCharacters([]);
      setSelectedLocation('');
    }
  };

  const removeScene = (sceneId: string) => {
    setScenes((prevScenes) => prevScenes.filter((scene) => scene.id !== sceneId));
  };

  const removeCharacterFromScene = (sceneId: string, characterId: string) => {
    setScenes(_scenes => _scenes.map(scene => {
      if (scene.id === sceneId) {
        return {...scene, characters: scene.characters.filter(character=> character.id !== characterId)};
      }else{
        return scene;
      }
    }))
  };

  if (characterLoading || locationLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container py-4">
      <h2 className="fs-1 fw-bold mb-4">Scene Editor</h2>

      <section className="mb-4">
        <h3 className="fs-2 fw-bold mb-2">Add Scene</h3>
        <form
          className='text-start'
          onSubmit={(e) => {
            e.preventDefault();
            addScene();
          }}
        >
          <div className="mb-2 text-start">
            <label htmlFor="sceneDescription" className="form-label">
              Description:
            </label>
            <textarea
              id="sceneDescription"
              className="form-control"
              value={selectedScene}
              onChange={(e) => setSelectedScene(e.target.value)}
            />
          </div>
          <div className="mb-2 text-start">
            <label htmlFor="sceneCharacters" className="form-label">
              Characters:
            </label>
            <select
              id="sceneCharacters"
              className="form-select"
              multiple
              value={selectedCharacters}
              onChange={(e) =>
                setSelectedCharacters(Array.from(e.target.selectedOptions, (option) => option.value))
              }
            >
              {characterData.characters.results.map((character: Character) => (
                <option key={character.id} value={character.name}>
                  {character.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-2 text-start">
            <label htmlFor="sceneLocation" className="form-label">
              Location:
            </label>
            <select
              id="sceneLocation"
              className="form-select"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">Select location</option>
              {locationData.locations.results.map((location: Location) => (
                <option key={location.id} value={location.name}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary" type="submit">
            Add Scene
          </button>
        </form>
      </section>

      <hr className="my-4" />

      <section>
        <h3 className="fs-2 fw-bold mb-2">Scenes({scenes.length})</h3>
        <ul className="list-group rounded text-start">
          {scenes.map((scene: Scene) => (
            <li key={scene.id} className="list-group-item mb-4">
              <p>Title:<span className="fs-3 fw-medium mb-2"> {scene.description}</span></p>
              <p className="mb-2">
                Location: <span className="fw-semibold">{scene.location.name}</span>
              </p>
              <p className="mb-2">Characters:</p>
              <ul className="list-group">
                {scene.characters.map((character: Character) => (
                  <li key={character.id} className="list-group-item d-flex justify-content-between">
                    {character.name}
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removeCharacterFromScene(scene.id, character.id)}
                    >
                      Remove Character
                    </button>
                  </li>
                ))}
              </ul>
              <button
                className="btn btn-danger mt-4 fw-semibold"
                onClick={() => removeScene(scene.id)}
              >
                Remove Scene
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default SceneEditor;
