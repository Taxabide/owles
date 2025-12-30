import { Platform, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';

export const globalStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  spaceAround: {
    justifyContent: 'space-around',
  },
  spaceEvenly: {
    justifyContent: 'space-evenly',
  },

  // Card styles
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: fonts.lg,
    fontWeight: fonts.weight.semiBold,
    color: colors.textPrimary,
  },
  cardSubtitle: {
    fontSize: fonts.sm,
    color: colors.textSecondary,
    marginTop: 4,
  },

  // Button styles
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  buttonSecondary: {
    backgroundColor: colors.secondary,
  },
  buttonSuccess: {
    backgroundColor: colors.success,
  },
  buttonWarning: {
    backgroundColor: colors.warning,
  },
  buttonError: {
    backgroundColor: colors.error,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonText: {
    fontSize: fonts.base,
    fontWeight: fonts.weight.medium,
    color: colors.white,
  },
  buttonTextOutline: {
    color: colors.primary,
  },
  buttonDisabled: {
    backgroundColor: colors.gray[300],
    opacity: 0.6,
  },
  buttonTextDisabled: {
    color: colors.gray[500],
  },

  // Input styles
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: fonts.base,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    minHeight: 48,
  },
  inputFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  inputError: {
    borderColor: colors.error,
  },
  inputLabel: {
    fontSize: fonts.sm,
    fontWeight: fonts.weight.medium,
    color: colors.textPrimary,
    marginBottom: 6,
  },
  inputErrorText: {
    fontSize: fonts.xs,
    color: colors.error,
    marginTop: 4,
  },

  // Text styles
  text: {
    fontSize: fonts.base,
    color: colors.textPrimary,
    lineHeight: fonts.base * fonts.lineHeight.normal,
  },
  textSmall: {
    fontSize: fonts.sm,
  },
  textLarge: {
    fontSize: fonts.lg,
  },
  textXLarge: {
    fontSize: fonts.xl,
  },
  textXXLarge: {
    fontSize: fonts['2xl'],
  },
  textBold: {
    fontWeight: fonts.weight.bold,
  },
  textSemiBold: {
    fontWeight: fonts.weight.semiBold,
  },
  textMedium: {
    fontWeight: fonts.weight.medium,
  },
  textSecondary: {
    color: colors.textSecondary,
  },
  textTertiary: {
    color: colors.textTertiary,
  },
  textSuccess: {
    color: colors.success,
  },
  textWarning: {
    color: colors.warning,
  },
  textError: {
    color: colors.error,
  },
  textCenter: {
    textAlign: 'center',
  },
  textRight: {
    textAlign: 'right',
  },

  // Header styles
  header: {
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === 'ios' ? 44 : 24,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: fonts.xl,
    fontWeight: fonts.weight.bold,
    color: colors.white,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: fonts.sm,
    color: colors.white,
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.9,
  },

  // List styles
  list: {
    backgroundColor: colors.surface,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  listItemLast: {
    borderBottomWidth: 0,
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: fonts.base,
    fontWeight: fonts.weight.medium,
    color: colors.textPrimary,
  },
  listItemSubtitle: {
    fontSize: fonts.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  listItemIcon: {
    marginRight: 12,
  },
  listItemAction: {
    marginLeft: 12,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    margin: 20,
    maxWidth: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: fonts.lg,
    fontWeight: fonts.weight.semiBold,
    color: colors.textPrimary,
  },
  modalCloseButton: {
    padding: 4,
  },

  // Loading styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: fonts.base,
    color: colors.textSecondary,
  },

  // Error styles
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: fonts.base,
    color: colors.error,
    textAlign: 'center',
    marginTop: 16,
  },
  errorButton: {
    marginTop: 20,
  },

  // Spacing utilities
  marginTop: {
    marginTop: 16,
  },
  marginBottom: {
    marginBottom: 16,
  },
  marginLeft: {
    marginLeft: 16,
  },
  marginRight: {
    marginRight: 16,
  },
  marginHorizontal: {
    marginHorizontal: 16,
  },
  marginVertical: {
    marginVertical: 16,
  },
  paddingTop: {
    paddingTop: 16,
  },
  paddingBottom: {
    paddingBottom: 16,
  },
  paddingLeft: {
    paddingLeft: 16,
  },
  paddingRight: {
    paddingRight: 16,
  },
  paddingHorizontal: {
    paddingHorizontal: 16,
  },
  paddingVertical: {
    paddingVertical: 16,
  },

  // Shadow styles
  shadow: {
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  shadowLarge: {
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6.27,
    elevation: 10,
  },
});
