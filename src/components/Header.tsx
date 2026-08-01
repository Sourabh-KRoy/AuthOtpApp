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
      <View style={styles.headerShell}>
        <View style={styles.container}>
          <View style={styles.leftWrap}>
            <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
              <MaterialCommunityIcons name="menu" size={22} color="#0F172A" />
            </TouchableOpacity>
            <View style={styles.titleWrap}>
              <Text style={styles.title}>Authenticator</Text>
              <Text style={styles.subtitle}>Secure OTP hub</Text>
            </View>
          </View>

          <View style={styles.rightWrap}>
            <TouchableOpacity style={styles.iconButton} onPress={onSearchPress}>
              <MaterialCommunityIcons
                name="magnify"
                size={20}
                color="#334155"
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton}>
              <MaterialCommunityIcons
                name="information-outline"
                size={20}
                color="#334155"
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.crownButton}>
              <MaterialCommunityIcons name="crown" size={15} color="#F59E0B" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroBadge}>
            <MaterialCommunityIcons
              name="shield-lock-outline"
              size={20}
              color="#FFFFFF"
            />
          </View>
          <View style={styles.heroTextWrap}>
            <Text style={styles.heroTitle}>Protected access</Text>
            <Text style={styles.heroBody}>
              Fast, private, and clean verification
            </Text>
          </View>
          <TouchableOpacity style={styles.installButton}>
            <Text style={styles.installText}>Quick Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F4F8FF',
  },
  headerShell: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: '#F4F8FF',
  },
  container: {
    height: 56,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#DCE8F5',
  },
  leftWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  menuButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  titleWrap: {
    marginLeft: 8,
  },
  title: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 1,
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  crownButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
    borderWidth: 1,
    borderColor: '#FDE68A',
    backgroundColor: '#FFFBEA',
  },
  heroCard: {
    marginTop: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#DCE8F5',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTextWrap: {
    flex: 1,
    marginLeft: 10,
  },
  heroTitle: {
    color: '#0F172A',
    fontWeight: '700',
    fontSize: 15,
  },
  heroBody: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 2,
  },
  installButton: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  installText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
});
