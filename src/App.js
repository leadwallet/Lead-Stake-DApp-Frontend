import React from "react";
import { Switch, Route } from "react-router-dom";
import StakingPage from "./pages/StakingPage";

const App = () => {
  return (
    <Switch>
      <Route path="/" exact>
        <StakingPage />
      </Route>
    </Switch>
  );
};

export default App;
