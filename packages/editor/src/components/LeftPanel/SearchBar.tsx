import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { actions as leftPanelActions } from "../../store/slices/ui/leftPanel";

function SearchBar(props: any) {
  const dispatch = useAppDispatch();

  let searchTerm = useAppSelector((state) => state["ui/leftPanel"].searchTerm);

  return (
    <div className="scrowl-search">
      <form>
        <input
          type="search"
          className="form-control form-control-sm"
          placeholder="Search..."
          autoComplete="off"
          value={searchTerm}
          onChange={(e) => {
            dispatch(leftPanelActions.setSearchTerm(e.target.value));
          }}
        />
        <label htmlFor="searchField" className="visually-hidden">
          Search
        </label>
      </form>
    </div>
  );
}

export default SearchBar;
