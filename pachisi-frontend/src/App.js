import AppBar from "./components/appbar/appbar";
import React, { useContext, useEffect } from "react";
import HomePage from "./components/homePage/homepage";
import { Web3Context } from "./context/web3Context";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PlayWithNumbersPage from "./components/playWithNumbers/playWithNumbers";
import SportsPage from "./components/sport/sports";

import WeatherPage from "./components/weather/weather";
import PricePredictionPage from "./components/price-prediction/pricePrediction";
import ProviderModal from "./components/ProviderModal/providerModal";

function App() {
  const isLoading = true;

  return (
    <div className="App">
      <Router>
        <ProviderModal />
        <AppBar />
        <Switch>
          <Route path="/home" component={HomePage} />
          <Route path="/numbers" component={PlayWithNumbersPage} />
          <Route path="/sports" component={SportsPage} />
          <Route path="/prices" component={PricePredictionPage} />
          <Route path="/weather" component={WeatherPage} />

          {/* 
          <Route path="/researchPaper" component={PapersPage} exact />

          <Route path="/blogs/:blogId" component={DetailedBlog} exact />
          <Route path="/user/:searchAddress" component={SearchPage} exact />
          <Route
            path="/searchblogs/:searchAddress/:numberOfBlogs"
            component={SearchBlog}
            exact
          />
          <Route
            path="/searchpapers/:searchAddress/:numberOfPapers"
            component={SearchPapers}
            exact
          /> */}
        </Switch>{" "}
      </Router>
    </div>
  );
}

export default App;
