import AppBar from "./components/appbar/appbar";
import HomePage from "./components/homePage/homepage";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PlayWithNumbersPage from "./components/playWithNumbers/playWithNumbers";
import SportsPage from "./components/sport/sports";
import WeatherPage from "./components/weather/weather";
import PricePredictionPage from "./components/price-prediction/pricePrediction";
import Cricket from "./components/sport/cricket/cricket";
import BasketBall from "./components/sport/BasketBall/BasketBall";
import FootBall from "./components/sport/FootBall/FootBall";

function App() {
  return (
    <div className="App">
      <Router>
        <AppBar />
        <Switch>
          <Route path="/" component={HomePage} exact />
          <Route path="/numbers" component={PlayWithNumbersPage} exact />
          <Route path="/sports" component={SportsPage} />
          <Route path="/prices" component={PricePredictionPage} exact />
          <Route path="/weather" component={WeatherPage} exact />

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
