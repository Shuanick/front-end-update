import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoCloseCircleOutline } from "react-icons/io5";
import axios from "axios";

function Search({setIsSearchOpen}) {
  const [searchText, setSearchText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [results, setResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [allUsers, setAllUsers] = useState(null);

  const navigate = useNavigate();

  const handleClear = () => {
    setSearchText("");
    setResults([]);
    setNoResults(false);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("https://nickproduct-d61b16cc0f17.herokuapp.com/users");
        setAllUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (searchText.trim() === "") {
        setResults([]);
        setNoResults(false);
        return;
      }

      const searching = allUsers.filter((user) =>
        user.username.toLowerCase().includes(searchText.trim().toLowerCase())
      );

      if (searching.length === 0) {
        setNoResults(true);
      } else {
        console.log(searching);
        setResults(searching);
        setNoResults(false);
      }
    };

    fetchResults();
  }, [searchText]);

  return (
    <>
      <div className="search-header">
        <h3 style={{ margin: "25px", fontWeight: "bold" }}>搜尋</h3>
      </div>
      <div
        className="input-wrapper"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        <input
          type="text"
          className={`searching ${
            !isFocused && searchText ? "placeholder-color" : ""
          }`}
          placeholder="搜尋"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        {searchText && (
          <IoCloseCircleOutline
            className="clear-icon"
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
          />
        )}
      </div>
      <div
        style={{
          backgroundColor: "rgba(0,0,0,0.1)",
          height: "1px",
          width: "100%",
          marginTop: "40px",
        }}
      ></div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          width: "100%",
          marginTop: "20px",
        }}
      ></div>
      <div className="searching-body">
        {noResults ? (
          <p style={{ marginLeft: "30px" }}>無此用戶</p>
        ) : (
          results.map((user) => (
            <div
              className="searching-users"
              key={user._id}
              onClick={() => {
                navigate(`users/${user.username}`);
                setIsSearchOpen(false);
              }}
            >
              {user.username}
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Search;
