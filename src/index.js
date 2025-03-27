import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Story from "./quiz/act/story/story_system";
import Practice from "./quiz/act/practice/practice_system"
import Game from "./quiz/act/game_choose_path/game_system"
import Reward from "./quiz/act/reward/reward"
import Loading from "./quiz/act/loading.js"
import { Route, Routes, BrowserRouter } from "react-router-dom";
//import reportWebVitals from "./reportWebVitals";


const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/story" element={<Story />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/game" element={<Game />} />
        <Route path="/reward" element={<Reward />} />
        <Route path="/loading" element={<Loading />} />
      </Routes>
    </BrowserRouter>

  </>
);

//reportWebVitals();
