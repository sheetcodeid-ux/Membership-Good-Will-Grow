import React, { useState } from "react";
import { TextInput, View, type TextInputProps } from "react-native";
import { AppText } from "./AppText";
import { brand, ink, danger } from "../../theme/colors";
import { fontFamilies } from "../../theme/typography";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
}

export function Input({ label, error, left, right, style, onFocus, onBlur, ...rest }: InputProps) {
  const [focused, setFocused] = useState(false);

  const borderColor = error ? danger[500] : focused ? brand[500] : ink[200];

  return (
    <View style={{ gap: 8 }}>
      {label ? (
        <AppText variant="captionMedium" color={ink[600]}>
          {label}
        </AppText>
      ) : null}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          borderWidth: 1.5,
          borderColor,
          borderRadius: 16,
          paddingHorizontal: 16,
          height: 54,
          backgroundColor: ink[50],
        }}
      >
        {left}
        <TextInput
          placeholderTextColor={ink[400]}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={[
            {
              flex: 1,
              fontFamily: fontFamilies.medium,
              fontSize: 15.5,
              color: ink[900],
              padding: 0,
            },
            style,
          ]}
          {...rest}
        />
        {right}
      </View>
      {error ? (
        <AppText variant="caption" color={danger[500]}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}
