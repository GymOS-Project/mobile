import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { View, StyleSheet } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

export interface BottomSheetDialogRef {
  open: () => void;
  close: () => void;
}

type Props = {
  children: React.ReactNode;
  snapPoints?: (string | number)[];
};

const Dialog = forwardRef<BottomSheetDialogRef, Props>(
  ({ children, snapPoints = ["50%"] }, ref) => {
    const bottomSheetRef = useRef<BottomSheet>(null);

    const points = useMemo(() => snapPoints, [snapPoints]);

    useImperativeHandle(ref, () => ({
      open: () => bottomSheetRef.current?.expand(),
      close: () => bottomSheetRef.current?.close(),
    }));

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
        />
      ),
      [],
    );

    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={points}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={styles.content}>{children}</BottomSheetView>
      </BottomSheet>
    );
  },
);

export default Dialog;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 20,
  },
});
