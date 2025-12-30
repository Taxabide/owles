import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

interface EmptyStateProps {
    icon?: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle?: string;
    style?: ViewStyle;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    icon = 'document-outline',
    title,
    subtitle,
    style,
}) => {
    return (
        <View style={[styles.container, style]}>
            <Ionicons name={icon} size={64} color={colors.textTertiary} />
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    title: {
        fontSize: fonts.lg,
        fontWeight: fonts.weight.semibold,
        color: colors.textPrimary,
        textAlign: 'center',
        marginTop: 16,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: fonts.base,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
    },
});

export default EmptyState;
