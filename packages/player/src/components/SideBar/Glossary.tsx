import React from "react";

function Glossary(props: any) {
  const glossaryTerms: any = [...(window as any).courseData.glossaryTerms];
  glossaryTerms.sort((a: any, b: any) => a.word.localeCompare(b.word));

  let currentHeaderLetter: string | null = null;
  let newHeaderLetter: string | null = null;
  const letterHeaders: any = [];

  let headerTerms: any = [];
  glossaryTerms.map((term) => {
    newHeaderLetter = term.word.substring(0, 1).toUpperCase();

    if (newHeaderLetter !== currentHeaderLetter) {
      if (headerTerms.length) {
        letterHeaders.push(
          <div key={currentHeaderLetter}>
            <header>{currentHeaderLetter}</header>
            {headerTerms}
          </div>
        );

        headerTerms = [];
      }
      currentHeaderLetter = newHeaderLetter;
    }

    headerTerms.push(
      <div key={term.word} className="term">
        <div className="word">{term.word}</div>
        <div className="definition">
          The name informally used to refer to the existing U.S. court of appeals, which are
          organized into thirteen circuits covering different geographical areas of the country. The
          term derives from an age before mechanized transit, when judges and lawyers rode “the
          circuit” of their territory to hold court in various places.
        </div>
      </div>
    );
    return null;
  });

  if (letterHeaders.length) {
    letterHeaders.push(
      <div key={currentHeaderLetter}>
        <header>{currentHeaderLetter}</header>
        {headerTerms}
      </div>
    );
  }

  return (
    <div className="SideBarGlossaryPanel" style={{ display: props.active ? "block" : "none" }}>
      <div className="letter-terms">{letterHeaders}</div>
    </div>
  );
}

export default Glossary;
