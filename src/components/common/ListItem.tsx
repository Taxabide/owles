import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

interface ListItemProps {
    title: string;
    subtitle?: string;
    leftIcon?: keyof typeof Ionicons.glyphMap;
    rightIcon?: keyof typeof Ionicons.glyphMap;
    onPress?: () => void;
    style?: ViewStyle;
    showBorder?: boolean;
}

const ListItem: React.FC<ListItemProps> = ({
    title,
    subtitle,
    leftIcon,
    rightIcon,
    onPress,
    style,
    showBorder = true,
}) => {
    const Container = onPress ? TouchableOpacity : View;

    return (
        <Container
            style={[
                styles.container,
                showBorder && styles.border,
                style,
            ]}
            onPress={onPress}
            activeOpacity={onPress ? 0.7 : 1}
        >
            <View style={styles.leftSection}>
                {leftIcon && (
                    <View style={styles.iconContainer}>
                        <Ionicons name={leftIcon} size={20} color={colors.textPrimary} />
                    </View>
                )}
                <View style={styles.textSection}>
                    <Text style={styles.title}>{title}</Text>
                    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
                </View>
            </View>
            {rightIcon && (
                <Ionicons name={rightIcon} size={20} color={colors.textSecondary} />
            )}
        </Container>
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
    },
    border: {
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        marginRight: 12,
    },
    textSection: {
        flex: 1,
    },
    title: {
        fontSize: fonts.base,
        fontWeight: fonts.weight.medium,
        color: colors.textPrimary,
    },
    subtitle: {
        fontSize: fonts.sm,
        color: colors.textSecondary,
        marginTop: 2,
    },
});

export default ListItem;
