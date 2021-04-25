import React, { Component } from "react";
import { render } from "react-dom";
import HomePage from './HomePage';
import Flashcards from './Flashcards';
import Theme from './Theme';
import { ThemeProvider } from "@material-ui/styles";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <div>
        <ThemeProvider theme={Theme}>
          <HomePage />
        </ThemeProvider>
      </div>
    );
  }
}

const appDiv = document.getElementById("app");

render(<App />, appDiv);
