/* eslint-disable jsx-a11y/anchor-is-valid */
import Highlighter from "react-highlight-words";

const showContextMenu = async () => {
  return await (window as any).ScrowlApp.showContextMenu([
    {
      id: "rename",
      label: "Rename",
    },
    { type: "separator" },
    {
      id: "delete",
      label: "Delete Folder",
    },
  ]);
};

function AssetListFolder(props: any) {
  const searchTerm = props.searchHighlight || "";

  return (
    <>
      <tr
        className={"asset-list-folder" + (props.expanded ? " expanded " : "")}
        onContextMenu={async (e) => {
          await showContextMenu();
        }}
      >
        <td colSpan={3} className="truncate">
          <div className="wrapper">
            <a
              href="#"
              role="button"
              onClick={(e) => {
                e.preventDefault();
                props.onToggleExpand();
              }}
            >
              <span
                className={
                  "material-symbols-rounded scrowl-outline__detail-icon " +
                  (props.expanded ? " active " : "")
                }
              >
                folder
              </span>
              <Highlighter
                className="highlighter"
                highlightClassName="highlight"
                searchWords={[searchTerm]}
                autoEscape={true}
                textToHighlight={props.data.name}
              />
            </a>
          </div>

          <div className="actions-container">
            <button
              className="btn  btn-outline-primary btn-sm action"
              type="button"
              onClick={async (e) => {
                e.preventDefault();
                await showContextMenu();
              }}
            >
              <span className="material-symbols-sharp">arrow_drop_down</span>
            </button>
            {/* <ul className="dropdown-menu">
              <li>
                <button className="dropdown-item" onClick={() => {}}>
                  <span className="material-symbols-sharp owl-dropdown-icon">border_color</span>
                  Rename
                </button>
              </li>
              <li>
                <button className="dropdown-item" onClick={() => {}}>
                  <span className="material-symbols-sharp owl-dropdown-icon">swap_horiz</span>
                  Update
                </button>
              </li>
              <li>
                <button className="dropdown-item" onClick={() => {}}>
                  <span className="material-symbols-sharp owl-dropdown-icon">delete</span>
                  Delete
                </button>
              </li>
            </ul> */}
          </div>
        </td>

        {/* <td className="text-right actions">
          
        </td> */}
      </tr>
      {props.expanded && props.children}
      {props.expanded && (!props.children || !props.children.length) ? (
        <tr className="asset-list-folder no-folder-results">
          <td colSpan={4} className="truncate">
            <button
              className="btn  btn-link "
              onClick={(e) => {
                e.preventDefault();
                // Add File
              }}
            >
              + Add New File
            </button>
          </td>
        </tr>
      ) : null}

      {props.expanded && props.children ? (
        <tr className="empty">
          <td colSpan={4}></td>
        </tr>
      ) : null}
    </>
  );
}

export default AssetListFolder;
