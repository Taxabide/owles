import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '../../constants/colors';

interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    padding?: number;
    margin?: number;
    shadow?: boolean;
    borderRadius?: number;
    backgroundColor?: string;
}

const Card: React.FC<CardProps> = ({
    children,
    style,
    padding = 16,
    margin = 0,
    shadow = true,
    borderRadius = 12,
    backgroundColor = colors.white,
}) => {
    return (
        <View
            style={[
                styles.card,
                {
                    padding,
                    margin,
                    borderRadius,
                    backgroundColor,
                    ...(shadow && styles.shadow),
                },
                style,
            ]}
        >
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderColor: colors.border,
    },
    shadow: {
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
});

export default Card;
