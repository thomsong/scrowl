import { useState, useEffect } from "react";

import { useAppSelector, useAppDispatch } from "../../../../store/hooks";
import { actions as courseActions } from "../../../../store/slices/course";
import { actions as uiActions } from "../../../../store/slices/ui";

import RightOverlay from "../../RightOverlay";

import SearchBar from "./SearchBar";
import AssetListFolder from "./AssetListFolder";
import AssetListEntry from "./AssetListEntry";

function AssetBrowser(props: any) {
  const dispatch = useAppDispatch();

  const assets = useAppSelector((state) => state["course"].assets);
  const copyAssetProgress = useAppSelector((state) => state["ui"].copyAssetProgress);

  const fileTypes = {
    JPG: "Image",
    JPEG: "Image",
    WEBP: "Image",
    PNG: "Image",
    GIF: "Image",
    TIFF: "Image",

    SVG: "SVG",
    PDF: "PDF",

    LOTTIE: "Lottie",

    MP4: "Video",
    AVI: "Video",
    WEBM: "Video",
  };

  const filter: any = props.data.filter || false;
  const [expandedFolders, setExpandedFolders] = useState([]);

  useEffect(() => {
    if (!copyAssetProgress) {
      return;
    }

    const handleKeyDown = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    window.addEventListener("keydown", handleKeyDown, { capture: true });

    return () => {
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
    };
  }, [copyAssetProgress]);

  const [searchTerm, setSearchTerm] = useState();
  const searchTermLower = searchTerm ? (searchTerm as any).toLowerCase() : "";

  const assetList: any = [];
  const folderList: any = [];

  assets.forEach((asset) => {
    let parentFolderId = -1;

    const fileName = asset.fileName;
    const fileType = fileTypes[asset.fileExt.toUpperCase()] || asset.fileExt.toLowerCase();
    const fileId = asset.fileHash;
    const fileSize = asset.fileSize;

    assetList.push({
      fileId,
      fileName,
      fileType,
      fileExt: asset.fileExt,
      fileSize,
      parentFolderId,
      filterMatch: filter && fileType.toLowerCase() === filter.toLowerCase() ? 1 : filter ? 0 : 1,
    });
  });

  let sortKey = "name";
  let sortOrder = "asc";

  // Sort to alphabetical reverse, because of unshift later
  folderList.sort((a: any, b: any) => b.folderName.localeCompare(a.folderName));

  switch (sortKey) {
    case "name":
      if (sortOrder === "desc") {
        assetList.sort((a: any, b: any) => b.fileName.localeCompare(a.fileName));
        // Only situation we need to sort folder list
        folderList.sort((a: any, b: any) => a.folderName.localeCompare(b.folderName));
      } else {
        assetList.sort((a: any, b: any) => a.fileName.localeCompare(b.fileName));
      }
      break;
    case "type":
      if (sortOrder === "desc") {
        assetList.sort((a: any, b: any) => b.fileType.localeCompare(a.fileType));
      } else {
        assetList.sort((a: any, b: any) => a.fileType.localeCompare(b.fileType));
      }
      break;
    case "size":
      if (sortOrder === "desc") {
        assetList.sort((a: any, b: any) => b.fileSize - a.fileSize);
      } else {
        assetList.sort((a: any, b: any) => a.fileSize - b.fileSize);
      }
      break;
    default: // assume name+asc
      assetList.sort((a: any, b: any) => a.fileName.localeCompare(b.fileName));
  }

  assetList.sort((a: any, b: any) => b.filterMatch - a.filterMatch);

  let rootComponents: any = [];
  const assetComponents: any = {};

  assetComponents[-1] = [];

  assetList.forEach((asset) => {
    const { fileId, fileName, fileType, fileSize, parentFolderId, filterMatch, fileExt } = asset;

    const fileNameLower = fileName.toLowerCase();
    const fileTypeLower = fileType.toLowerCase();
    let searchFound = searchTermLower
      ? fileNameLower.includes(searchTermLower) || fileTypeLower.includes(searchTermLower)
      : true;

    if (searchFound) {
      if (!assetComponents[parentFolderId]) {
        assetComponents[parentFolderId] = [];
      }

      const entry = (
        <AssetListEntry
          searchHighlight={searchTerm}
          key={"asset_" + fileId}
          data={{
            id: fileId,
            name: fileName,
            size: fileSize,
            type: fileType,
            parentFolderId,
            filterMatch,
            fileExt,
          }}
          onSelect={() => {
            dispatch(
              uiActions.closeOverlay({
                fileName,
                fileId,
                fileExt,
                fileSize,
                fileType,
                asset: fileId + "." + fileExt,
              })
            );
          }}
        />
      );

      if (parentFolderId < 0) {
        rootComponents.push(entry);
      } else {
        assetComponents[parentFolderId].push(entry);
      }
    }
  });

  folderList.forEach((folder) => {
    const { folderName, folderId } = folder;

    let searchFound = searchTermLower
      ? assetComponents[folderId] && assetComponents[folderId].length > 0
      : true;

    if (searchFound) {
      rootComponents.unshift(
        <AssetListFolder
          searchHighlight={searchTerm && searchTerm}
          key={"folder_" + folderId}
          data={{
            id: folderId,
            name: folderName,
          }}
          expanded={(searchTerm && (searchTerm as any).length > 0) || expandedFolders[folderId]}
          onToggleExpand={() => {
            const newExpandedState: any = [...expandedFolders];
            newExpandedState[folderId] = !expandedFolders[folderId];
            setExpandedFolders(newExpandedState);
          }}
        >
          {assetComponents[folderId]}
        </AssetListFolder>
      );
    }
  });

  const addNewFiles = async () => {
    const secureFileList = await (window as any).ScrowlApp.dialog.openFile({
      buttonLabel: "Add Files",
    });

    if (!secureFileList || !secureFileList.length) {
      // No files selected
      return;
    }

    dispatch(courseActions.addNewAssets(secureFileList));
  };

  return (
    <RightOverlay
      {...props}
      title={"Project Files"}
      buttons={{
        cancel: "Close",
        submit: "Add New File",
      }}
      onSubmit={() => addNewFiles()}
      onAltSubmit={() => {
        // Add New Folder
      }}
      className="asset-browser "
    >
      {copyAssetProgress ? (
        <>
          <div className="copy-assets-progress-blocker"></div>

          <div className="copy-assets-progress">
            <div className="progress-container">
              <b>Adding Files...</b>
              <div className="mb-2 file-name">{copyAssetProgress.filename}</div>
              <div className="progress">
                <div
                  className="progress-bar"
                  role="progressbar"
                  aria-label="Basic example"
                  style={{ width: copyAssetProgress.totalProgress + "%" }}
                  aria-valuenow={50}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>
          </div>
        </>
      ) : null}

      <div className="asset-browser-body">
        <SearchBar
          onChange={(value) => {
            const searchTerm = value.trim();
            setSearchTerm(searchTerm);
          }}
        />
        <div className="mt-2 asset-list">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th
                  scope="col"
                  style={{
                    width: "65px",
                    maxWidth: "65px",
                  }}
                >
                  Type
                </th>
                <th
                  scope="col"
                  style={{
                    width: "80px",
                    maxWidth: "80px",
                  }}
                >
                  Size
                </th>
              </tr>
            </thead>
            <tbody>{rootComponents}</tbody>
          </table>
          {rootComponents.length === 0 && searchTerm ? (
            <div style={{ textAlign: "center" }} className="mt-3">
              No Search Results Found
            </div>
          ) : null}

          {rootComponents.length === 0 && !searchTerm ? (
            <div style={{ textAlign: "center" }} className="mt-3">
              No Project Files or Folders
            </div>
          ) : null}
        </div>
      </div>
    </RightOverlay>
  );
}

export default AssetBrowser;
