import React from "react";
import { StyleSheet, View } from "react-native";

import { FieldType } from "../../utils/form";
import Text from "../UILib/Text";
import FormTextInput from "./components/FormTextInput";
import FormDropDown from "./components/FormDropDown";
import FormDatePickerTextInput from "./components/FormDatePickerTextInput";
import FormDocumentPicker from "./components/FormDocumentPicker";

const fieldMap: Record<string, any> = {
  [FieldType.TextInput]: FormTextInput,
  [FieldType.Select]: FormDropDown,
  [FieldType.DatePickerTextInput]: FormDatePickerTextInput,
  [FieldType.DocumentPicker]: FormDocumentPicker,
};

type IProps = {
  fields: Array<Record<string, any>>;
};

const Layout = ({ fields }: IProps) => {
  return (
    <View style={styles.container}>
      {fields.map((field) => {
        const Component = fieldMap[field.type];
        if (Component) {
          return (
            <View key={field.name} style={styles.inputField}>
              <Component {...field} />
            </View>
          );
        }
        return <Text>Unknown Input Type</Text>;
      })}
    </View>
  );
};

export default Layout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputField: {
    marginBottom: 16,
  },
});
