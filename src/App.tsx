import "bootstrap/dist/css/bootstrap.css";

import "./App.css";
import "react-datepicker/dist/react-datepicker.css";

import jsonData from "./data/testdata.json";

import {
  BrowserRouter as Router,
  Routes as Switch,
  Route,
} from "react-router-dom";

import BestBefore from "./pages/BestBefore";

const App = () => {
  const jsonDataWithDates = jsonData.map((item) => ({
    ...item,
    bestBeforeDate: item.bestBeforeDate ? new Date(item.bestBeforeDate) : null,
  }));

  return (
    <Router>
      <div style={{ display: "flex" }}>
        <Switch>
          <Route
            path=""
            Component={() => <BestBefore jsonData={jsonDataWithDates} />}
          />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
