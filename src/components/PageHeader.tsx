import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

type PageHeaderProps = {
  title: string;
  rightIconName?: string;
  onRightPress?: () => void;
};

export default function PageHeader({
  title,
  rightIconName,
  onRightPress,
}: PageHeaderProps) {
  const navigation = useNavigation<any>();

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate('Authenticator');
  };

  return (
    <View style={styles.headerRow}>
      <TouchableOpacity onPress={handleBack} style={styles.iconButton}>
        <MaterialCommunityIcons name="arrow-left" size={22} color="#F8FAFC" />
      </TouchableOpacity>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      <TouchableOpacity
        style={styles.iconButton}
        onPress={onRightPress}
        disabled={!rightIconName || !onRightPress}
      >
        {rightIconName ? (
          <MaterialCommunityIcons
            name={rightIconName}
            size={21}
            color="#F8FAFC"
          />
        ) : (
          <View style={styles.placeholder} />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    height: 58,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    backgroundColor: '#0B1220',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E293B',
  },
  title: {
    flex: 1,
    marginHorizontal: 10,
    color: '#E2E8F0',
    fontSize: 20,
    fontWeight: '700',
  },
  placeholder: {
    width: 21,
    height: 21,
  },
});
