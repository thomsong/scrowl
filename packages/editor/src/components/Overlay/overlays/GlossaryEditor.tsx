import { useState } from "react";

import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import { actions as uiActions } from "./../../../store/slices/ui";
import { actions as courseActions } from "./../../../store/slices/course";

import LeftOverlay from "../LeftOverlay";

function GlossaryEditor(props: any) {
  const dispatch = useAppDispatch();

  const glossaryTerms = useAppSelector((state) => state["course"].glossaryTerms);

  const data = props.data;
  const termData = glossaryTerms.find((term) => term.id === data.id);

  const [submitted, setSubmitted] = useState(false);
  const [termWord, setTermWord] = useState(termData ? termData.word : "");
  const [termDefinition, setTermDefinition] = useState(termData ? termData.definition : "");

  return (
    <LeftOverlay
      {...props}
      title={data.id === -1 ? "Add Glossary Term" : "Edit Glossary Term"}
      buttons={{ submit: "Save" }}
      onSubmit={() => {
        setSubmitted(true);

        if (termWord.trim() === "") {
          return;
        }

        // Remove double-newlines
        let cleanDefinition = termDefinition ? termDefinition.replace(/\n{3,}/g, "\n\n") : "";

        if (cleanDefinition.trim() === "") {
          return;
        }

        if (data.id === -1) {
          dispatch(
            courseActions.addNewTerm({
              word: termWord.trim(),
              definition: cleanDefinition.trim(),
            })
          );
        } else {
          dispatch(
            courseActions.updateTerm({
              id: data.id,
              word: termWord.trim(),
              definition: cleanDefinition.trim(),
            })
          );
        }
        dispatch(uiActions.closeOverlay(true));
      }}
    >
      <div className="mb-2">
        <label htmlFor="termAdd0" className="form-label">
          Term
        </label>
        <input
          autoFocus
          type="text"
          className={"form-control " + (submitted && termWord.trim() === "" ? "error" : "")}
          placeholder="Enter Term"
          value={termWord}
          onChange={(e) => {
            setTermWord(e.target.value);
          }}
        />
      </div>
      <div className="mb-2 owl-offcanvas-form__textarea">
        <label htmlFor="termAdd2" className="form-label">
          Definition
        </label>
        <textarea
          className={"form-control " + (submitted && termDefinition.trim() === "" ? "error" : "")}
          placeholder="Define the term"
          style={{ resize: "none" }}
          value={termDefinition}
          onChange={(e) => {
            setTermDefinition(e.target.value);
          }}
        />
      </div>
    </LeftOverlay>
  );
}

export default GlossaryEditor;
