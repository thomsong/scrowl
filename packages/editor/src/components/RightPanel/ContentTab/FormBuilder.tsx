import Fieldset from "./Fieldset";

interface PropsType {
  schema: any;
  content: any;

  revertErrors: boolean;

  onChange: Function;
  onValidate: Function;
  onFocus: Function;
  onBlur: Function;
}

const defaultProps: PropsType = {
  schema: {},
  content: {},
  revertErrors: false,

  onChange: () => {
    throw new Error("onChange must be implemented");
  },

  onValidate: () => {
    throw new Error("onValidate must be implemented");
  },

  onFocus: () => {
    throw new Error("onChange must be implemented");
  },

  onBlur: () => {
    throw new Error("onValidate must be implemented");
  },
};

function FormBuilder(_props: PropsType) {
  const props: any = { ...defaultProps, ..._props };

  const schema = props.schema;

  const fieldsets: any = [];

  schema &&
    Object.keys(schema).forEach((name) => {
      // console.log("Name", name);
      const schemaProps = schema[name];

      let fieldsetFields: any = null;
      let skinny: boolean = false;

      if (schemaProps.type === "FIELDSET") {
        fieldsetFields = schemaProps.fields;
      } else {
        // This is an input
        skinny = true;

        fieldsetFields = {};
        fieldsetFields[name] = schemaProps;
      }

      const fieldset = (
        <Fieldset
          key={name}
          name={name}
          content={props.content}
          label={schemaProps.label}
          fields={fieldsetFields}
          skinny={skinny}
          onChange={props.onChange}
          onValidate={props.onValidate}
          onFocus={props.onFocus}
          onBlur={props.onBlur}
          revertErrors={props.revertErrors}
        />
      );
      fieldsets.push(fieldset);
    });

  return <form className="scrowl-sidebar-form">{fieldsets}</form>;
}

export default FormBuilder;

// {
//   "company_info": {
//     "type": "FIELDSET",
//     "label": "Company Information",
//     "fields": {
//       "name": {
//         "type": "TEXTBOX",
//         "label": "Company Name",
//         "placeholder": "Company name"
//       },
//       "address": {
//         "type": "TEXTBOX",
//         "label": "Address",
//         "placeholder": "Full address",
//         "multiLine": true,
//         "lines": 4,
//         "autoGrow": 7
//       }
//     }
//   },
//   "title": {
//     "type": "TEXTBOX",
//     "label": "Title",
//     "placeholder": "Slide Title"
//   },
//   "bullet_points": {
//     "type": "FIELDSET",
//     "label": "Bullet Points",
//     "fields": {
//       "point_1": {
//         "type": "TEXTBOX",
//         "label": "Point 1",
//         "placeholder": "Bullet point 1"
//       },
//       "point_2": {
//         "type": "TEXTBOX",
//         "label": "Point 2",
//         "placeholder": "Bullet point 2"
//       },
//       "point_3": {
//         "type": "TEXTBOX",
//         "label": "Point 3",
//         "placeholder": "Bullet point 3"
//       }
//     }
//   }
// }
