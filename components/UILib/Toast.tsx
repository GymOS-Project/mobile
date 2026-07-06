import React from "react";
import { Incubator, ToastProps } from "react-native-ui-lib";

const { Toast } = Incubator;

type RLToastProps = ToastProps;

const RNToast = ({ ...props }: RLToastProps) => {
  return <Toast {...props} />;
};

export default RNToast;
