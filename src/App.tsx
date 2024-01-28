import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import Tv from "./Routes/Tv";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Header from "./Components/Header";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/tv" element={<Tv />}></Route>
        <Route path="/search" element={<Search />}></Route>
        <Route path="/*" element={<Home />}></Route>
      </Routes>
    </Router>
  )
}

export default App;