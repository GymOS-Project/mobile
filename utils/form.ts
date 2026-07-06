import * as yup from "yup";

interface IServerValidation {
  required: boolean;
}

export const processFields = (
  fields: Array<Record<string, any>>,
  serverFields: Record<string, any>,
) => {
  if (!serverFields) {
    return fields;
  }
  return fields
    .filter((field) => serverFields[field.name])
    .map((field) => {
      const validation = serverFields[field.name];
      const { required = false } = validation;
      return {
        ...field,
        required,
      };
    });
};

export const processSchema = (
  schema: Record<string, any>,
  serverValidation: Record<string, IServerValidation>,
) => {
  if (!serverValidation) {
    return schema;
  }

  const newSchema: Record<string, any> = {};
  Object.entries(schema).forEach(([key, value]) => {
    const validation = serverValidation[key];
    if (validation) {
      const { required = false } = validation;
      if (["cell", "phone"].includes(key)) {
        if (!required) {
          newSchema[key] = yup
            .string()
            .test("test-phone", "Invalid phone number", (v) => {
              if (v) {
                return value.isValidSync(v);
              }
              return true;
            });
        } else {
          newSchema[key] = value.required();
        }
      } else {
        if (required) {
          newSchema[key] = value.required();
        } else {
          newSchema[key] = value.optional();
        }
      }
    }
  });
  return newSchema;
};

export const processInitialValues: any = (config: Record<string, any>) => {
  if (!config) {
    return config;
  }

  const defaultValues: any = {};
  Object.entries(config).forEach(([key, value]) => {
    defaultValues[key] = value?.initial ?? undefined;
  });
  return defaultValues;
};

export enum FieldType {
  TextInput = "textInput",
  Select = "select",
  AsyncSelect = "asyncSelect",
  FileSelect = "fileSelect",
  DatePickerTextInput = "DatePickerTextInput",
  DocumentPicker = "DocumentPicker",
}

export type FieldProps = {
  label?: string;
  error?: string;
  control: any;
  name: string;
  required?: boolean;
  keyIndex?: string;
  defaultValue?: string;
  containerStyle?: object;
  doc_type?: any;
  jobId?: UniqueID;
  user_id?: UniqueID;
};
