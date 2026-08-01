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
    <SafeAreaView edges={['top']} style={{ backgroundColor: '#FFFFFF' }}>
      <View>
        <View style={styles.container}>
          <View style={styles.leftWrap}>
            <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
              <MaterialCommunityIcons name="menu" size={24} color="#0E2A44" />
            </TouchableOpacity>
            <Text style={styles.title}>Authenticator</Text>
          </View>

          <View style={styles.rightWrap}>
            <TouchableOpacity style={styles.iconButton} onPress={onSearchPress}>
              <MaterialCommunityIcons
                name="magnify"
                size={22}
                color="#0E2A44"
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton}>
              <MaterialCommunityIcons
                name="information-outline"
                size={21}
                color="#0E2A44"
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.crownButton}>
              <MaterialCommunityIcons name="crown" size={16} color="#F59E0B" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.adCard}>
          <View style={styles.adLeftBadge}>
            <MaterialCommunityIcons
              name="shield-lock-outline"
              size={21}
              color="#FFFFFF"
            />
          </View>
          <View style={styles.adTextWrap}>
            <Text style={styles.adTitle}>Authenticator App</Text>
            <Text style={styles.adBody}>Simple Account Security</Text>
          </View>
          <TouchableOpacity style={styles.installButton}>
            <Text style={styles.installText}>INSTALL</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    height: 54,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  leftWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  menuButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crownButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
    borderWidth: 1,
    borderColor: '#FACC15',
    backgroundColor: '#FFFBEA',
  },
  title: {
    color: '#0E2A44',
    fontSize: 24,
    fontWeight: '500',
    marginLeft: 8,
  },
  adCard: {
    marginHorizontal: 12,
    marginTop: 6,
    marginBottom: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DEE7F3',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  adLeftBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#1D4ED8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adTextWrap: {
    flex: 1,
    marginLeft: 10,
  },
  adTitle: {
    color: '#0E2A44',
    fontWeight: '700',
    fontSize: 17,
  },
  adBody: {
    color: '#6B7280',
    fontSize: 13,
    marginTop: 2,
  },
  installButton: {
    height: 40,
    minWidth: 126,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: '#1D4ED8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  installText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
