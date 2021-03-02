import "./App.css";
import AppBar from "./components/AppBar/appbar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import HomePage from "./components/Home/homepage";
import ProfilePage from "./components/ProfilePage/profilePage";
import PriceFeedsPage from "./components/PriceFeeds/pricefeeds";

function App() {
  return (
    <div className="App">
      <Router>
        <AppBar />
        <div className="body-wrapper">
          <Switch>
            <Route path="/" component={HomePage} exact />
            <Route path="/profile" component={ProfilePage} exact />
            <Route path="/price/:asset" component={PriceFeedsPage} exact />
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
