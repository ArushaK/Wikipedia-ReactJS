import React, { useState, useEffect } from "react";
import axios from "axios";

import "react-dates/initialize";
import { DateRangePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";

const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [searchInLastOneDay, setSearchInLastOneDay] = useState(0);
  const [searchInLastOneHour, setSearchInLastOneHour] = useState(0);
  const [searchInfo, setSearchInfo] = useState({});

  //Date range states
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);

  let [searchData, setSearchData] = useState({
    searchText: "",
    time: null,
  });

  useEffect(() => {
    const current = new Date();
    const date =
      current.getFullYear() +
      "-" +
      current.getMonth() +
      1 +
      "-" +
      current.getDate() +
      " " +
      current.getHours() +
      ":" +
      current.getMinutes() +
      ":" +
      current.getSeconds();

    setSearchData({
      searchText: search,
      time: date,
    });
  }, [search]);

  const searchesInLastOneDay = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get("http://localhost:8800/searchForLastDay");
      setSearchInLastOneDay(res.data.length);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const searchesInLastOneHour = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get("http://localhost:8800/searchForLastHour");
      setSearchInLastOneHour(res.data.length);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const searchesInnDays = async (e) => {
    e.preventDefault();
    try {
      var dateStart = new Date(startDate);
      var dateEnd = new Date(endDate);

      var dS = dateStart.getDate();
      var mS = dateStart.getMonth() + 1;
      var yS = dateStart.getFullYear();
      var dE = dateEnd.getDate();
      var mE = dateEnd.getMonth() + 1;
      var yE = dateEnd.getFullYear();
      var sendStartDate = yS + "-" + mS + "-" + dS;
      var sendEndDate = yE + "-" + mE + "-" + dE;
      const res = await axios.get(
        `http://localhost:8800/searchesInnDays/${sendStartDate}&${sendEndDate}`
      );
      setSearchInLastOneHour(res.data.length);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const handleSearch = async (e) => {
    e.preventDefault();
    console.log("1---------");
    if (search == "") return;
    try {
      await axios
        .get(
          `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${search}`
        )
        .then((res) => {
          console.log(res.data);
          setResults(res.data.query.search);
          setSearchInfo(res.data.query.searchinfo);
          axios.post("http://localhost:8800/search", searchData);
        });
    } catch (err) {
      console.log(err);
    }

    console.log(searchData);
  };

  return (
    <div className="App">
      <header>
        <h1>Wiki Seeker</h1>
        <form className="search-box" onSubmit={handleSearch}>
          <input
            type="search"
            placeholder="What are you looking for?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
        {searchInfo.totalhits ? (
          <p>Search Results: {searchInfo.totalhits}</p>
        ) : (
          ""
        )}
      </header>
      <button type="submit" onClick={searchesInLastOneDay}>
        No. of searches performed in last 1 day
      </button>
      <h3>{searchInLastOneDay}</h3>
      <button type="submit" onClick={searchesInLastOneHour}>
        No. of searches performed in last 1 Hour
      </button>
      <h3>{searchInLastOneHour}</h3>
      <DateRangePicker
        startDate={startDate}
        startDateId="s_id"
        endDate={endDate}
        endDateId="e_id"
        onDatesChange={({ startDate, endDate }) => {
          setStartDate(startDate);
          setEndDate(endDate);
        }}
        focusedInput={focusedInput}
        onFocusChange={(e) => setFocusedInput(e)}
        displayFormat="DD/MM/YYYY"
      />
      <div className="mt-3 mb-1">
        Start Date: {startDate && startDate.format("ll")}
      </div>
      <div>End Date: {endDate && endDate.format("ll")}</div>
      <button type="submit" onClick={searchesInnDays}>
        Get Search Data
      </button>
      <div className="results">
        {results.map((result, i) => {
          const url = `https://en.wikipedia.org/?curid=${result.pageid}`;
          return (
            <div className="result" key={i}>
              <h3>{result.title}</h3>
              <p dangerouslySetInnerHTML={{ __html: result.snippet }}></p>
              <a href={url} target="_blank" rel="noreferrer">
                Read more
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
