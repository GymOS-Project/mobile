import React from "react";
import { StyleSheet, View } from "react-native";
import { Controller } from "react-hook-form";

import { useAppThemeContext } from "../../../hooks/useAppTheme";
import { FieldProps } from "../../../utils/form";
import { DocumentPicker, Text } from "../../UILib";

const FormDocumentPicker = ({
  label,
  error,
  control,
  name,
  doc_type,
  required,
  ...restProps
}: FieldProps) => {
  const { colors } = useAppThemeContext();
  return (
    <View>
      {Boolean(label) && (
        <Text style={[styles.label, { color: colors.darkestGrey }]}>
          {label}
          {required && (
            <Text style={{ color: colors.error, marginLeft: 3 }}>*</Text>
          )}
        </Text>
      )}
      {Boolean(error) && (
        <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
      )}

      <Controller
        control={control}
        name={name}
        render={() => (
          <DocumentPicker
            hasError={Boolean(error)}
            {...restProps}
            type={doc_type}
            required={required}
          />
        )}
      />
    </View>
  );
};

export default FormDocumentPicker;

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 3,
  },
  error: {
    fontSize: 12,
    marginTop: 3,
  },
});
