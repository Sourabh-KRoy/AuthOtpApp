import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Header = ({
  onMenuPress,
  onSearchPress,
}: {
  onMenuPress: () => void;
  onSearchPress?: () => void;
}) => {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.leftWrap}>
          <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
            <MaterialCommunityIcons name="menu" size={22} color="#F8FAFC" />
          </TouchableOpacity>
          <Text style={styles.title} numberOfLines={1}>
            Google Authenticator
          </Text>
        </View>

        <View style={styles.rightWrap}>
          <TouchableOpacity style={styles.iconButton} onPress={onSearchPress}>
            <MaterialCommunityIcons name="magnify" size={20} color="#E2E8F0" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton}>
            <MaterialCommunityIcons
              name="cloud-upload-outline"
              size={20}
              color="#E2E8F0"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.profileButton}>
            <MaterialCommunityIcons
              name="account-circle"
              size={26}
              color="#F8FAFC"
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#0B1220',
  },
  container: {
    height: 60,
    paddingHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0B1220',
  },
  leftWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  menuButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E293B',
  },
  title: {
    color: '#E2E8F0',
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 10,
    flexShrink: 1,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E293B',
  },
  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#334155',
  },
});
