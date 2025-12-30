import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

interface HeaderProps {
    title: string;
    subtitle?: string;
    leftIcon?: keyof typeof Ionicons.glyphMap;
    rightIcon?: keyof typeof Ionicons.glyphMap;
    onLeftPress?: () => void;
    onRightPress?: () => void;
    style?: ViewStyle;
}

const Header: React.FC<HeaderProps> = ({
    title,
    subtitle,
    leftIcon,
    rightIcon,
    onLeftPress,
    onRightPress,
    style,
}) => {
    return (
        <View style={[styles.container, style]}>
            <View style={styles.leftSection}>
                {leftIcon && (
                    <TouchableOpacity onPress={onLeftPress} style={styles.iconButton}>
                        <Ionicons name={leftIcon} size={24} color={colors.textPrimary} />
                    </TouchableOpacity>
                )}
                <View style={styles.titleSection}>
                    <Text style={styles.title}>{title}</Text>
                    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
                </View>
            </View>
            {rightIcon && (
                <TouchableOpacity onPress={onRightPress} style={styles.iconButton}>
                    <Ionicons name={rightIcon} size={24} color={colors.textPrimary} />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconButton: {
        padding: 8,
        marginRight: 8,
    },
    titleSection: {
        flex: 1,
    },
    title: {
        fontSize: fonts.lg,
        fontWeight: fonts.weight.bold,
        color: colors.textPrimary,
    },
    subtitle: {
        fontSize: fonts.sm,
        color: colors.textSecondary,
        marginTop: 2,
    },
});

export default Header;
