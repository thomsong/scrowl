import { useState } from "react";

function SearchBar(props: any) {
  const [searchTerm, setSearchTerm] = useState();

  return (
    <div className="mt-1">
      <input
        type="search"
        className="form-control form-control-sm"
        placeholder="Search files..."
        autoComplete="off"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(searchTerm);
          props.onChange(e.target.value);
        }}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            e.currentTarget.blur();
          }
        }}
      />
      <label htmlFor="searchField" className="visually-hidden">
        Search
      </label>
    </div>
  );
}

export default SearchBar;
