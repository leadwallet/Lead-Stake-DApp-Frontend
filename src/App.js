import React from "react";
import { Switch, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";

const App = () => {
  return (
    <Switch>
      <Route path="/" exact>
        <HomePage />
      </Route>
    </Switch>
  );
};

export default App;
