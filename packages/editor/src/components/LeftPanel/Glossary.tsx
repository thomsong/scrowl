/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { actions as courseActions } from "./../../store/slices/course";
import { actions as uiActions } from "./../../store/slices/ui";

import ContextMenu from "../../utils/ContextMenu";

export const showContextMenu = async (dispatch, term, target?) => {
  ContextMenu.show(
    [
      {
        label: "Edit Term",
        onClick: () =>
          dispatch(
            uiActions.showOverlay({
              type: "Glossary",
              data: {
                id: term.id,
              },
            })
          ),
      },
      { type: "separator" },
      {
        label: "Delete Term",
        onClick: async () => {
          const dialogResult = await dispatch(
            uiActions.showDialog({
              buttons: ["Delete Term", "Cancel"],
              defaultId: 0,
              message: "Are you sure?",
              detail: term.word,
              type: "warning",
            })
          );

          if (dialogResult.payload.response !== 1) {
            dispatch(courseActions.deleteTerm(term.id));
          }
        },
      },
    ],
    target
  );
};

function Glossary(props: any) {
  const dispatch = useAppDispatch();

  const _glossaryTerms = useAppSelector((state) => state["course"].glossaryTerms);
  const glossaryTerms: any = [..._glossaryTerms];
  glossaryTerms.sort((a: any, b: any) => a.word.localeCompare(b.word));

  let currentHeaderLetter: string | null = null;

  return (
    <div className={"tab-pane " + (props.active ? "active" : "")} role="tabpanel">
      <div className="scrowl-glossary">
        <dl className="scrowl-glossary__list" id="glossaryList">
          {glossaryTerms.map((term: any) => {
            const word: string = term.word;
            const wordLetter = word.toUpperCase().substring(0, 1);

            let showLetterHeader = false;
            if (wordLetter !== currentHeaderLetter) {
              showLetterHeader = true;
              currentHeaderLetter = wordLetter;
            }

            return (
              <React.Fragment key={word}>
                {showLetterHeader ? <header>{currentHeaderLetter}</header> : null}
                <div
                  className="scrowl-glossary__term"
                  onContextMenu={() => {
                    showContextMenu(dispatch, term);
                  }}
                >
                  <a
                    href="#"
                    className="scrowl-glossary__term__link"
                    // data-bs-toggle="offcanvas"
                    // data-bs-target="#addTerm"
                    // aria-controls="addTerm"
                    onClick={() =>
                      dispatch(
                        uiActions.showOverlay({
                          type: "Glossary",
                          data: {
                            id: term.id,
                          },
                        })
                      )
                    }
                  >
                    <dt className="scrowl-glossary__term__word">{word}</dt>
                    <dd
                      className="scrowl-glossary__term__definition"
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      {term.definition}
                    </dd>
                  </a>
                  <div className="owl-more-options dropdown">
                    <button
                      className="btn dropdown-toggle owl-more-options__button"
                      type="button"
                      onClick={(e: any) => {
                        e.target.blur();
                        showContextMenu(dispatch, term, e.target);
                        e.preventDefault();
                      }}
                    >
                      <span className="material-symbols-rounded">more_vert</span>
                    </button>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </dl>
        <div className="owl-sticky-add-item">
          <button
            onContextMenu={() =>
              dispatch(
                uiActions.showOverlay({
                  type: "Glossary",
                  data: {
                    id: -1,
                  },
                })
              )
            }
            onClick={() =>
              dispatch(
                uiActions.showOverlay({
                  type: "Glossary",
                  data: {
                    id: -1,
                  },
                })
              )
            }
            className="owl-sticky-add-item__button"
          >
            <span className="txt-placeholder">Add a new glossary term...</span>
            <span className="material-symbols-rounded">add_circle</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Glossary;
