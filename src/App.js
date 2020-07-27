import React from 'react';
import './App.css';
import DisplayPosts from './components/DisplayPosts';
import CreatePost from './components/CreatePost';
import { withAuthenticator, AmplifyGreetings } from "@aws-amplify/ui-react"
import { Auth } from 'aws-amplify'
import "@aws-amplify/ui/dist/style.css";

function App() {
  return (
    <div className="App">
      <AmplifyGreetings username={Auth.user.attributes.email}/>
      <CreatePost />
      <DisplayPosts />
    </div>
  );
}

export default withAuthenticator(App);
