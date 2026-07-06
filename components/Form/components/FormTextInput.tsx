import React from "react";
import { StyleSheet, View } from "react-native";
import { Controller } from "react-hook-form";

import { useAppThemeContext } from "../../../hooks/useAppTheme";
import { FieldProps } from "../../../utils/form";
import { TextInput, Text } from "../../UILib";

const FormTextInput = ({
  label,
  error,
  control,
  name,
  required,
  containerStyle = {},
  ...restProps
}: FieldProps) => {
  const { colors } = useAppThemeContext();

  return (
    <View style={[containerStyle]}>
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
          <TextInput
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
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

export default FormTextInput;

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
