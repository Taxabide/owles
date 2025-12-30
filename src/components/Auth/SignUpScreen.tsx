import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { clearError, clearSignUpSuccess, registerUser } from '../../redux/slices/authSlice';
import type { AppDispatch, RootState } from '../../redux/store'; // Import AppDispatch

import {
    Animated,
    Dimensions,
    Easing,
    ImageStyle,
    Modal, // Import Modal // Added Image import
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
// Removed direct API and Routes import as it's now handled by Redux thunk
// import { API_BASE_URL, API_ROUTES } from "../../constants/routes";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface SignUpScreenProps {
    onClose: () => void;
    onSignIn: () => void;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ onClose, onSignIn }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // Removed local error state, now using Redux error state
  // const [error, setError] = useState<string | null>(null);
  // New state for success popup - controlled by Redux now
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Individual field error states
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);

  const slideAnim = useRef(new Animated.Value(screenWidth)).current;
  const backgroundAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  // New animated value for popup scaling
  const popupAnim = useRef(new Animated.Value(0)).current;

  // Floating elements animation
  const floatingAnims = useRef(
    [0, 0, 0, 0].map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(backgroundAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(backgroundAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Pulse animation for logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Float animation (for existing background circles)
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Floating elements animation (from contact.tsx)
    floatingAnims.forEach((anim, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 2000 + index * 500,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 2000 + index * 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, [slideAnim, backgroundAnim, pulseAnim, floatAnim, floatingAnims]); // Add floatingAnims to dependency array

  // Handle popup animation
  useEffect(() => {
    if (showSuccessPopup) {
      Animated.spring(popupAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }).start();
    } else {
      popupAnim.setValue(0);
    }
  }, [showSuccessPopup, popupAnim]);

  // Redux hooks
  const dispatch: AppDispatch = useDispatch(); // Type the dispatch hook
  const { isLoading, error, isSignUpSuccess } = useSelector(
    (state: RootState) => state.auth
  );

  // Effect to handle sign-up success and show popup
  useEffect(() => {
    if (isSignUpSuccess) {
      setShowSuccessPopup(true);
    } else {
      setShowSuccessPopup(false);
    }
  }, [isSignUpSuccess]);

  // Effect to clear general error when screen is opened
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Handle closing popup and navigating to sign-in
  const handlePopupClose = () => {
    setShowSuccessPopup(false);
    dispatch(clearSignUpSuccess()); // Clear Redux success state
    onSignIn();
  };

  // Validation functions
  const validateName = (name: string) => {
    if (!name.trim()) {
      return "Full name is required.";
    }
    if (name.trim().length < 2) {
      return "Name must be at least 2 characters long.";
    }
    return null;
  };

  const validateEmail = (email: string) => {
    if (!email.trim()) {
      return "Email is required.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Invalid email format.";
    }
    return null;
  };

  const validatePhone = (phone: string) => {
    if (!phone.trim()) {
      return "Phone number is required.";
    }
    if (phone.length !== 10) {
      return "Phone number must be exactly 10 digits.";
    }
    return null;
  };

  const validatePassword = (password: string) => {
    if (!password) {
      return "Password is required.";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters long.";
    }
    return null;
  };

  const validateConfirmPassword = (
    confirmPassword: string,
    password: string
  ) => {
    if (!confirmPassword) {
      return "Please confirm your password.";
        }
        if (password !== confirmPassword) {
      return "Passwords do not match.";
    }
    return null;
  };

  // Real-time validation handlers
  const handleNameChange = (text: string) => {
    setName(text);
    if (nameError) {
      const error = validateName(text);
      setNameError(error);
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) {
      const error = validateEmail(text);
      setEmailError(error);
    }
  };

  const handlePhoneChange = (text: string) => {
    const filteredText = text.replace(/[^0-9]/g, "").slice(0, 10);
    setPhone(filteredText);
    if (phoneError) {
      const error = validatePhone(filteredText);
      setPhoneError(error);
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) {
      const error = validatePassword(text);
      setPasswordError(error);
    }
    // Also validate confirm password if it exists
    if (confirmPassword && confirmPasswordError) {
      const confirmError = validateConfirmPassword(confirmPassword, text);
      setConfirmPasswordError(confirmError);
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (confirmPasswordError) {
      const error = validateConfirmPassword(text, password);
      setConfirmPasswordError(error);
    }
  };

  const handleCreateAccount = async () => {
    // Clear all errors
    setNameError(null);
    setEmailError(null);
    setPasswordError(null);
    setPhoneError(null);
    setConfirmPasswordError(null);
    // setError(null); // Local error state removed

    let hasError = false;

    // Validate all fields
    const nameValidationMsg = validateName(name);
    if (nameValidationMsg) {
      setNameError(nameValidationMsg);
      hasError = true;
    }

    const emailValidationMsg = validateEmail(email);
    if (emailValidationMsg) {
      setEmailError(emailValidationMsg);
      hasError = true;
    }

    const phoneValidationMsg = validatePhone(phone);
    if (phoneValidationMsg) {
      setPhoneError(phoneValidationMsg);
      hasError = true;
    }

    const passwordValidationMsg = validatePassword(password);
    if (passwordValidationMsg) {
      setPasswordError(passwordValidationMsg);
      hasError = true;
    }

    const confirmPasswordValidationMsg = validateConfirmPassword(
      confirmPassword,
      password
    );
    if (confirmPasswordValidationMsg) {
      setConfirmPasswordError(confirmPasswordValidationMsg);
      hasError = true;
    }

    if (hasError) {
            return;
        }

    try {
      const formData = new FormData();
      formData.append("u_name", name);
      formData.append("u_email", email);
      formData.append("u_phone", phone);
      formData.append("u_password", password);

      // Log FormData contents for debugging
      console.log("Sign up request payload:", formData);
      dispatch(registerUser(formData)); // Dispatch the Redux thunk

      // Removed direct axios call
      // const response = await axios.post(
      //   `${API_BASE_URL}${API_ROUTES.auth.register}`,
      //   formData
      // );
      // console.log("Sign up successful:", response.data);
      // setShowSuccessPopup(true);
    } catch (err: any) {
      // Error handling is now in Redux extraReducers
      console.error("Sign up API full error (local catch should not be hit with Redux thunk):");
      // setError(err.message || "Something went wrong"); // Local error state removed
    }
    };

    return (
    <View style={styles.container}>
      {/* Floating Background Elements (from contact.tsx) */}
      {floatingAnims.map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            styles.floatingElement,
            {
              opacity: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.1, 0.3],
              }),
              transform: [
                {
                  translateY: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -20],
                  }),
                },
                {
                  translateX: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, index % 2 === 0 ? 10 : -10],
                  }),
                },
              ],
            },
            // Position variations
            index === 0 && { top: screenHeight * 0.1, left: screenWidth * 0.05 },
            index === 1 && { top: screenHeight * 0.2, right: screenWidth * 0.08 },
            index === 2 && { bottom: screenHeight * 0.15, left: screenWidth * 0.1 },
            index === 3 && { bottom: screenHeight * 0.05, right: screenWidth * 0.05 },
          ]}
        />
      ))}

      {/* Animated background circles */}
      <Animated.View
        style={[
          styles.backgroundCircle1,
          {
            transform: [
              {
                translateX: floatAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 30],
                }),
              },
              {
                translateY: floatAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -20],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.backgroundCircle2,
          {
            transform: [
              {
                translateX: floatAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -25],
                }),
              },
              {
                translateY: floatAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 15],
                }),
              },
            ],
          },
        ]}
      />

      <Animated.Text
        style={[
          styles.appNameBackground,
          {
            opacity: backgroundAnim.interpolate({
              inputRange: [0, 0.2, 0.8, 1],
              outputRange: [0, 0.08, 0.08, 0],
            }),
            transform: [
              {
                translateX: backgroundAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-screenWidth * 0.2, screenWidth * 0.2],
                }),
              },
              {
                translateY: backgroundAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-screenHeight * 0.1, screenHeight * 0.1],
                }),
              },
              { scale: pulseAnim },
            ],
          },
        ]}
      >
        O.W.L.E.S
      </Animated.Text>

      <Animated.View
        style={[styles.card, { transform: [{ translateX: slideAnim }] }]}
      >
        <Animated.Image
          source={require("../../../assets/images/owles-logo1.webp")}
          style={[
            styles.logoBackground as ImageStyle,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        />

        {/* Gradient overlay */}
        <View style={styles.gradientOverlay}>
          <LinearGradient
            colors={["rgba(255, 143, 0, 0.05)", "rgba(255, 193, 7, 0.05)"]} // Updated gradient colors
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientBackground}
          />
        </View>

        {/* Header with close button */}
        <View style={styles.header}>
          <View style={styles.headerIndicator} />
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
            <Ionicons name="close" size={22} color="#64748B" />
        </TouchableOpacity>
        </View>

        <View style={styles.titleContainer}>
                                <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Join Owles and start your journey ✨
          </Text>
        </View>

        {/* Error Message */}
        {!!error && (
          <View style={styles.generalErrorContainer}>
            <Ionicons name="alert-circle" size={16} color="#EF4444" />
            <Text style={styles.generalError}>{error}</Text>
          </View>
        )}

        {/* Name Input */}
        <View style={styles.inputContainer}>
          <View
            style={[styles.inputGroup, nameError && styles.inputGroupError]}
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name="person-outline"
                size={20}
                color={nameError ? "#EF4444" : "#FF8F00"} // Updated icon color
                style={styles.inputIcon}
              />
            </View>
                                    <TextInput
                                        style={styles.input}
            placeholder="Full Name"
              placeholderTextColor="#94A3B8"
                                        autoCapitalize="words"
            value={name}
              onChangeText={handleNameChange}
            />
          </View>
          {nameError && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={14} color="#EF4444" />
              <Text style={styles.errorText}>{nameError}</Text>
            </View>
          )}
                                </View>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <View
            style={[styles.inputGroup, emailError && styles.inputGroupError]}
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={emailError ? "#EF4444" : "#FF8F00"} // Updated icon color
                style={styles.inputIcon}
              />
            </View>
                                    <TextInput
                                        style={styles.input}
            placeholder="Email"
              placeholderTextColor="#94A3B8"
            autoCapitalize="none"
                                        keyboardType="email-address"
            value={email}
              onChangeText={handleEmailChange}
            />
          </View>
          {emailError && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={14} color="#EF4444" />
              <Text style={styles.errorText}>{emailError}</Text>
            </View>
          )}
        </View>

        {/* Phone Input */}
        <View style={styles.inputContainer}>
          <View
            style={[styles.inputGroup, phoneError && styles.inputGroupError]}
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name="call-outline"
                size={20}
                color={phoneError ? "#EF4444" : "#FF8F00"} // Updated icon color
                style={styles.inputIcon}
              />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={phone}
              onChangeText={handlePhoneChange}
              maxLength={10}
            />
          </View>
          {phoneError && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={14} color="#EF4444" />
              <Text style={styles.errorText}>{phoneError}</Text>
            </View>
          )}
                                </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <View
            style={[styles.inputGroup, passwordError && styles.inputGroupError]}
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={passwordError ? "#EF4444" : "#FF8F00"} // Updated icon color
                style={styles.inputIcon}
              />
            </View>
                                        <TextInput
            style={styles.input}
            placeholder="Password"
              placeholderTextColor="#94A3B8"
            secureTextEntry
                                            autoCapitalize="none"
            value={password}
              onChangeText={handlePasswordChange}
            />
          </View>
          {passwordError && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={14} color="#EF4444" />
              <Text style={styles.errorText}>{passwordError}</Text>
            </View>
          )}
                                </View>

        {/* Confirm Password Input */}
        <View style={styles.inputContainer}>
          <View
            style={[
              styles.inputGroup,
              confirmPasswordError && styles.inputGroupError,
            ]}
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color={confirmPasswordError ? "#EF4444" : "#FF8F00"} // Updated icon color
                style={styles.inputIcon}
              />
            </View>
                                        <TextInput
            style={styles.input}
            placeholder="Confirm Password"
              placeholderTextColor="#94A3B8"
            secureTextEntry
                                            autoCapitalize="none"
            value={confirmPassword}
              onChangeText={handleConfirmPasswordChange}
            />
          </View>
          {confirmPasswordError && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={14} color="#EF4444" />
              <Text style={styles.errorText}>{confirmPasswordError}</Text>
            </View>
          )}
                                </View>

        {/* Create Account Button */}
        <TouchableOpacity
          style={styles.signUpButton}
          activeOpacity={0.8}
          onPress={handleCreateAccount}
          disabled={isLoading} // Disable button while loading
        >
          <LinearGradient
            colors={["#FF8F00", "#FFA000"]} // Updated gradient colors
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonContent}
          >
            <Text style={styles.signUpButtonText}>Create Account</Text>
            <View style={styles.buttonIcon}>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </View>
          </LinearGradient>
                                </TouchableOpacity>

        {/* Sign In Link */}
        <View style={styles.signInPrompt}>
                                    <Text style={styles.signInText}>Already have an account? </Text>
          <TouchableOpacity
            onPress={onSignIn}
            style={styles.signInLinkContainer}
          >
                                        <Text style={styles.signInLink}>Sign In</Text>
            <Ionicons name="chevron-forward" size={16} color="#FF8F00" />
                                    </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Success Popup */}
      <Modal
        transparent={true}
        visible={showSuccessPopup}
        animationType="fade"
        onRequestClose={handlePopupClose}
      >
        <View style={styles.popupOverlay}>
          <Animated.View
            style={[styles.popupCard, { transform: [{ scale: popupAnim }] }]} >
            <Ionicons name="checkmark-circle" size={60} color="#28A745" />
            <Text style={styles.popupTitle}>Account Created Successfully!</Text>
            <Text style={styles.popupMessage}>
              Welcome to Owles. You can now sign in with your new account.
            </Text>
            <TouchableOpacity
              style={styles.popupCloseButton}
              onPress={handlePopupClose}
              disabled={isLoading} // Disable button while loading
            >
              <LinearGradient
                colors={["#FF8F00", "#FFA000"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.popupCloseButtonGradient}
              >
                <Text style={styles.popupCloseButtonText}>Go to Sign In</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
            </View>
    );
};

const styles = StyleSheet.create({
    container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    paddingHorizontal: 20,
  },
  backgroundCircle1: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255, 143, 0, 0.1)", // Updated color
    top: "20%",
    left: "10%",
  },
  backgroundCircle2: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255, 193, 7, 0.1)", // Updated color
    bottom: "25%",
    right: "15%",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 28,
    width: screenWidth * 0.92,
    maxWidth: 400,
    alignItems: "center",
    position: "relative",
    borderWidth: 1,
    borderColor: "rgba(255, 143, 0, 0.1)", // Updated border color
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.15,
        shadowRadius: 30,
      },
      android: {
        elevation: 15,
      },
    }),
    },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  gradientBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    zIndex: 1,
  },
  headerIndicator: {
    width: 36,
    height: 5,
    backgroundColor: "rgba(255, 143, 0, 0.3)", // Updated color
    borderRadius: 3,
    },
    closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(100, 116, 139, 0.1)",
  },
  appNameBackground: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [
      { translateX: -screenWidth / 2 },
      { translateY: -screenHeight / 2 },
    ],
    fontSize: 120,
    fontWeight: "900",
    color: "#FF8F00", // Updated color
    zIndex: -1,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 22,
  },
  generalErrorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(239, 68, 68, 0.08)",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    width: "100%",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.2)",
    gap: 8,
  },
  generalError: {
    color: "#EF4444",
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 18,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(248, 250, 252, 0.8)",
    borderRadius: 16,
    paddingHorizontal: 4,
    height: 56,
    width: "100%",
    borderWidth: 2,
    borderColor: "rgba(226, 232, 240, 0.8)",
    // backdropFilter: "blur(10px)", // Not supported in React Native StyleSheet
  },
  inputGroupError: {
    borderColor: "rgba(239, 68, 68, 0.4)",
    backgroundColor: "rgba(254, 242, 242, 0.8)",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(255, 143, 0, 0.1)", // Updated color
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  inputIcon: {
    // Icon styles handled in iconContainer
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1E293B",
    paddingVertical: 0,
    fontWeight: "500",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    marginLeft: 8,
    gap: 6,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
  },
  signUpButton: {
    width: "100%",
    borderRadius: 16,
    marginTop: 12,
    marginBottom: 24,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#FF8F00", // Updated shadow color
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 24,
    backgroundColor: "#FF8F00", // Set solid background color for button content
    // background: "linear-gradient(135deg, #8B5CF6 0%, #A855F7 50%, #EC4899 100%)", // Moved to LinearGradient component
    gap: 12,
  },
  signUpButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  buttonIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  signInPrompt: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  signInText: {
    fontSize: 15,
    color: "#64748B",
    fontWeight: "500",
  },
  signInLinkContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  signInLink: {
    fontSize: 15,
    color: "#FF8F00", // Updated color
    fontWeight: "700",
  },
  logoBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.03,
    zIndex: -1,
  },

  // Styles for Success Popup
  popupOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 20,
  },
  popupCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 30,
    width: screenWidth * 0.9,
    maxWidth: 380,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  popupTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1E293B",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  popupMessage: {
    fontSize: 15,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },
  popupCloseButton: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#FF8F00",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  popupCloseButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 12,
  },
  popupCloseButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  // Floating elements
  floatingElement: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFD700", // Using a yellow/orange theme color
    zIndex: -1,
    },
});

export default SignUpScreen;
