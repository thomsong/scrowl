import {
  LAYOUT_INPUT_TYPE,
  TemplateLayout,
  InputFieldsetProps,
  InputTextBoxProps,
  InputSelectProps,
} from "embed-host";

export function getLayout(payload: any): TemplateLayout {
  return {
    state: {},
    schema: {
      title: {
        type: LAYOUT_INPUT_TYPE.Textbox,
        label: "Title",
        placeholder: "Title...",
      } as InputTextBoxProps,

      question: {
        type: LAYOUT_INPUT_TYPE.Textbox,
        label: "Question",
        placeholder: "Question...",
        multiLine: true,
        lines: 5,
        autoGrow: 5,
      } as InputTextBoxProps,

      answers: {
        type: LAYOUT_INPUT_TYPE.Fieldset,
        label: "Answers",
        fields: {
          a: {
            type: LAYOUT_INPUT_TYPE.Textbox,
            label: "Option A",
            placeholder: "Answer A...",
            focusRange: [2000, 2000],
          } as InputTextBoxProps,
          b: {
            type: LAYOUT_INPUT_TYPE.Textbox,
            label: "Option B",
            placeholder: "Answer B...",
            focusRange: [2000, 2000],
          } as InputTextBoxProps,
          c: {
            type: LAYOUT_INPUT_TYPE.Textbox,
            label: "Option C",
            placeholder: "Answer C...",
            focusRange: [2000, 2000],
          } as InputTextBoxProps,
          d: {
            type: LAYOUT_INPUT_TYPE.Textbox,
            label: "Option D",
            placeholder: "Answer D...",
            focusRange: [2000, 2000],
          } as InputTextBoxProps,
        },
      } as InputFieldsetProps,

      correctAnswer: {
        type: LAYOUT_INPUT_TYPE.Select,
        label: "Correct Answer",
        options: [
          { name: "Select Correct Answer", value: "" },
          { name: "Answer A", value: "A" },
          { name: "Answer B", value: "B" },
          { name: "Answer C", value: "C" },
          { name: "Answer D", value: "D" },
        ],
      } as InputSelectProps,

      correctText: {
        type: LAYOUT_INPUT_TYPE.Textbox,
        label: "Correct Message",
        placeholder: "You got it right!",
      } as InputTextBoxProps,

      incorrectText: {
        type: LAYOUT_INPUT_TYPE.Textbox,
        label: "Incorrect Message",
        placeholder: "Please try again",
      } as InputTextBoxProps,
    },
  } as TemplateLayout;
}

export function validate(payload: any) {
  const slideContent = payload.slide.content;
  const result: any = {};

  let newDuration: any = parseInt(slideContent["duration"]);

  if (newDuration < 500 || isNaN(newDuration)) {
    newDuration = 500;
  }

  if (slideContent["duration"]) {
    result["duration"] = { value: String(newDuration) };
  }

  return result;
}

// TODO: Introduce the concept of migrating content
// This can be from a previous template version to a newer version
// This can also be from a non-related template to this template using hints
// or custom logic
export function migrate(payload: any) {
  return payload;
}
