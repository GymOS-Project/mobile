import React from "react";
import { StyleSheet, View } from "react-native";
import { Controller } from "react-hook-form";

import { useAppThemeContext } from "../../../hooks/useAppTheme";
import { FieldProps } from "../../../utils/form";
import { DatePickerTextInput, Text } from "../../UILib";

type FormDatePickerTextInputProps = FieldProps & {
  keyIndex?: string;
};

const FormDatePickerTextInput = ({
  label,
  error,
  control,
  name,
  required,
  keyIndex,
  defaultValue,
  ...restProps
}: FormDatePickerTextInputProps) => {
  const { colors } = useAppThemeContext();

  return (
    <View>
      {Boolean(label) && (
        <Text style={[styles.label, { color: colors.darkestGrey }]}>
          {label}
          {Boolean(required) && (
            <Text style={{ color: colors.error, marginLeft: 3 }}>*</Text>
          )}
        </Text>
      )}

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <DatePickerTextInput
            onBlur={onBlur}
            keyIndex={keyIndex}
            onChangeText={onChange}
            value={value}
            defaultValue={defaultValue}
            hasError={Boolean(error)}
            {...restProps}
          />
        )}
      />

      {Boolean(error) && (
        <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
      )}
    </View>
  );
};

export default FormDatePickerTextInput;

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
