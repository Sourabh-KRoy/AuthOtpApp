import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Header = ({
  onMenuPress,
  searchQuery,
  onSearchChange,
  onClearSearch,
}: {
  onMenuPress: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
}) => {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.searchBarShell}>
        <TouchableOpacity onPress={onMenuPress} style={styles.leadingIconWrap}>
          <MaterialCommunityIcons name="menu" size={20} color="#E2E8F0" />
        </TouchableOpacity>

        <TextInput
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholder="Search..."
          placeholderTextColor="#CBD5E1"
          style={styles.searchInput}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />

        {searchQuery ? (
          <TouchableOpacity onPress={onClearSearch} style={styles.trailingIconWrap}>
            <MaterialCommunityIcons name="close" size={17} color="#E2E8F0" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.trailingIconWrap}>
            <MaterialCommunityIcons
              name="cloud-upload-outline"
              size={18}
              color="#E2E8F0"
            />
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.profileButton}>
          <MaterialCommunityIcons name="account-circle" size={23} color="#F8FAFC" />
        </TouchableOpacity>
      </View>
      
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#0B1220',
    paddingHorizontal: 14,
    paddingBottom: 8,
  },
  searchBarShell: {
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7F6169',
    borderWidth: 1,
    borderColor: '#AD9197',
  },
  leadingIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInput: {
    flex: 1,
    marginLeft: 2,
    color: '#F8FAFC',
    fontSize: 16,
  },
  trailingIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
    backgroundColor: '#4A556D',
  },
});
