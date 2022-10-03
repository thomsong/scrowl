/* eslint-disable jsx-a11y/anchor-is-valid */
import Highlighter from "react-highlight-words";

const showContextMenu = async () => {
  return await (window as any).ScrowlApp.showContextMenu([
    {
      id: "rename",
      label: "Rename",
    },
    // {
    //   id: "update",
    //   label: "Update",
    // },
    { type: "separator" },
    {
      id: "remove",
      label: "Remove File",
    },
  ]);
};

function AssetListEntry(props: any) {
  let fileSizeBytes = props.data.size;

  const fileSizeKB = Math.round(fileSizeBytes / 102.4) / 10;
  const fileSizeMB = Math.round(fileSizeKB / 102.4) / 10;
  const fileSizeGB = Math.round(fileSizeMB / 102.4) / 10;

  let fileSize = [fileSizeKB, "KB"];

  if (fileSizeMB >= 1000) {
    fileSize = [fileSizeGB, "GB"];
  } else if (fileSizeKB >= 1000) {
    fileSize = [fileSizeMB, "MB"];
  }

  const searchTerm = props.searchHighlight || "";

  // console.log("props.parentFolderId", props.data.parentFolderId);
  return (
    <tr
      className={"asset-list-entry " + (props.data.parentFolderId === -1 ? "root-entry" : "")}
      // onContextMenu={async (e) => {
      //   console.log("right asset", await showContextMenu());
      // }}
      style={props.data.filterMatch ? {} : { pointerEvents: "none", opacity: "0.5" }}
    >
      <td className="truncate">
        <div className="wrapper name">
          <a
            href="#"
            role="button"
            onClick={(e) => {
              e.preventDefault();
              props.onSelect();
            }}
          >
            <Highlighter
              className="highlighter"
              highlightClassName="highlight"
              searchWords={[searchTerm]}
              autoEscape={true}
              textToHighlight={props.data.name}
            />
          </a>
        </div>
      </td>
      <td style={{ width: "65px", maxWidth: "65px" }}>
        <div className="wrapper">
          <Highlighter
            className="highlighter"
            highlightClassName="highlight"
            searchWords={[props.searchHighlight]}
            autoEscape={true}
            textToHighlight={props.data.type}
          />
        </div>
      </td>
      <td className="file-size">
        <div className="wrapper ">
          {fileSize[0]}
          <span className="size-unit">{fileSize[1]}</span>
        </div>

        <div className="actions-container">
          <button
            className="btn  btn-outline-primary btn-sm action"
            type="button"
            // data-bs-toggle="dropdown"
            onClick={async (e) => {
              e.preventDefault();
              console.log("right", await showContextMenu());
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
    </tr>
  );
}

export default AssetListEntry;
