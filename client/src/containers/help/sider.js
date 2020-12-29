import React, { useState } from "react";
import { Link } from "react-router-dom";
import { orgQuote, chlQuote } from "./index";
import { Input, message } from "antd";
import history from "../../history";

const { Search } = Input;

const HelpSider = ({
  category,
  setCategory,
  searchTxt = "",
  setSearch = () => {},
}) => {
  const [searchStr, setSearchStr] = useState(searchTxt);
  const isChl = category === "challenge";

  const onSearch = (value) => {
    if (!value || value.length < 3) {
      message.warn("Search text should be more than 3 in length");
      return;
    }
    history.push(`/help-search/${value}`);
    setSearch(value);
  };

  const onChangeSearch = (e) => {
    setSearchStr(e.target.value);
  };

  return (
    <div className="help-sider">
      <Search
        size="large"
        placeholder="Search"
        value={searchStr}
        onSearch={onSearch}
        onChange={onChangeSearch}
      />
      <div className="empty-space" />
      <div className="empty-space" />
      <span>CATEGORIES</span>
      <div className="empty-space" />
      <Link
        to="/help-category/organizer"
        onClick={() => setCategory("organizer")}
        className={!isChl ? "active" : ""}
      >
        {orgQuote}
      </Link>
      <div className="empty-space" />
      <Link
        to="/help-category/challenge"
        onClick={() => setCategory("challenge")}
        className={isChl ? "active" : ""}
      >
        {chlQuote}
      </Link>
      <div className="empty-space" />
    </div>
  );
};

export default HelpSider;
