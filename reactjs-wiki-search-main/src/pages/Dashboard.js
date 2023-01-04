import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [searchInLastOneDay, setSearchInLastOneDay] = useState(0);
  const [searchInLastOneHour, setSearchInLastOneHour] = useState(0);
  const [searchInfo, setSearchInfo] = useState({});
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
