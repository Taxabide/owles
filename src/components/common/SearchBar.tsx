import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, TextInput, View, ViewStyle } from 'react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

interface SearchBarProps {
    placeholder?: string;
    value?: string;
    onChangeText?: (text: string) => void;
    style?: ViewStyle;
    onFocus?: () => void;
    onBlur?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
    placeholder = 'Search...',
    value,
    onChangeText,
    style,
    onFocus,
    onBlur,
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => {
        setIsFocused(true);
        onFocus?.();
    };

    const handleBlur = () => {
        setIsFocused(false);
        onBlur?.();
    };

    return (
        <View style={[styles.container, isFocused && styles.focused, style]}>
            <Ionicons 
                name="search" 
                size={20} 
                color={isFocused ? colors.primary : colors.textSecondary} 
                style={styles.icon}
            />
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={colors.textTertiary}
                value={value}
                onChangeText={onChangeText}
                onFocus={handleFocus}
                onBlur={handleBlur}
                returnKeyType="search"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    focused: {
        borderColor: colors.primary,
        backgroundColor: colors.white,
    },
    icon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: fonts.base,
        color: colors.textPrimary,
        paddingVertical: 4,
    },
});

export default SearchBar;
