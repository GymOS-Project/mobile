import { Image } from "expo-image";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ImageStyle,
  Pressable,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";

import { useAppThemeContext } from "../../hooks/useAppTheme";
import RenderIcon from "./Icon";

type ImageViewProps = {
  url?: string;
  fallbackUrl?: string;

  viewStyle: StyleProp<ImageStyle>;
  containerViewStyle?: StyleProp<ViewStyle>;

  resizeMode?: "cover" | "contain";

  showDelete?: boolean;
  onDelete?: () => void;
  deleteIconSize?: number;
  deleteIconName?: string;
};

const ImageView = ({
  url,
  fallbackUrl,
  viewStyle,
  containerViewStyle,
  resizeMode = "cover",

  showDelete = false,
  onDelete,
  deleteIconSize = 24,
  deleteIconName = "MdDelete",
}: ImageViewProps) => {
  const { colors } = useAppThemeContext();

  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState(url);

  return (
    <View
      style={[
        {
          alignItems: "center",
          justifyContent: "center",
        },
        containerViewStyle,
      ]}
    >
      <Image
        source={imageUri ? { uri: imageUri } : undefined}
        style={viewStyle}
        contentFit={resizeMode}
        cachePolicy="memory-disk"
        transition={200}
        onLoadStart={() => setLoading(true)}
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);

          if (fallbackUrl && imageUri !== fallbackUrl) {
            setImageUri(fallbackUrl);
          }
        }}
      />

      {loading && (
        <View
          style={{
            position: "absolute",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      )}

      {showDelete && (
        <Pressable
          onPress={onDelete}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: colors.background,
            justifyContent: "center",
            alignItems: "center",
            elevation: 2,
          }}
        >
          <RenderIcon
            name={deleteIconName}
            size={deleteIconSize}
            color={colors.error}
          />
        </Pressable>
      )}
    </View>
  );
};

export default ImageView;
