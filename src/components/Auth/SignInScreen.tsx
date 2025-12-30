import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { APP_ROUTES } from "../../constants/routes";
import { clearError, loadAuthDataAsync, loginAdminAsync } from "../../redux/slices/authSlice";
import { AppDispatch, RootState } from "../../redux/store";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const SignInScreen = ({
  onClose,
  onSignUp,
}: {
    onClose: () => void;
    onSignUp: () => void;
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error, isAuthenticated, user } = useSelector(
    (s: RootState) => s.auth
  );
  const router = useRouter();

  useEffect(() => {
    dispatch(clearError());
    dispatch(loadAuthDataAsync());
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
          toValue: 1,
        duration: 600,
          useNativeDriver: true,
        }),
      Animated.timing(slideAnim, {
          toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
    ]).start();
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      onClose?.();
      // Redirect based on user role
      if (user.role === 'student') {
        router.replace(APP_ROUTES.STUDENT_DASHBOARD);
      } else if (user.role === 'admin') {
        router.replace(APP_ROUTES.ADMIN_DASHBOARD);
      } else if (user.role === 'teacher') {
        router.replace(APP_ROUTES.TEACHER_DASHBOARD);
      }
    }
  }, [isAuthenticated, user, onClose, router]);

  const validateEmail = (email: string) => {
    if (!email.trim()) return "Email is required.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Invalid email format.";
    return null;
  };

  const validatePassword = (password: string) => {
    if (!password) return "Password is required.";
    if (password.length < 6) return "Password must be at least 6 characters long.";
    return null;
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) setEmailError(validateEmail(text));
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) setPasswordError(validatePassword(text));
  };

  const handleSignIn = () => {
    setEmailError(null);
    setPasswordError(null);
    dispatch(clearError());

    let hasError = false;
    const emailValidationMsg = validateEmail(email);
    if (emailValidationMsg) {
      setEmailError(emailValidationMsg);
      hasError = true;
    }

    const passwordValidationMsg = validatePassword(password);
    if (passwordValidationMsg) {
      setPasswordError(passwordValidationMsg);
      hasError = true;
    }

    if (hasError) return;

    dispatch(loginAdminAsync({ u_email: email, u_password: password }));
    };

    return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FF8F00', '#FFB300', '#FF8F00']}
        style={styles.background}
      />

      <Animated.View
        style={[
          styles.card,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Ionicons name="close-circle" size={32} color="#FF8F00" />
                                </TouchableOpacity>

        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Ionicons name="school" size={48} color="#FF8F00" />
          </View>
        </View>

        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <View
          style={[
                styles.inputWrapper,
                isEmailFocused && styles.inputFocused,
                emailError && styles.inputError,
              ]}
            >
          <Ionicons
                name="mail"
            size={20}
                color={emailError ? "#EF4444" : isEmailFocused ? "#FF8F00" : "#9CA3AF"}
            style={styles.inputIcon}
          />
                                    <TextInput
                                        style={styles.input}
                placeholder="Email"
                placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
                                        value={email}
              onChangeText={handleEmailChange}
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
            />
          </View>
          {emailError && (
              <Text style={styles.errorText}>{emailError}</Text>
          )}
                                </View>

        <View style={styles.inputContainer}>
            <View
              style={[
                styles.inputWrapper,
                isPasswordFocused && styles.inputFocused,
                passwordError && styles.inputError,
              ]}
            >
          <Ionicons
                name="lock-closed"
            size={20}
                color={passwordError ? "#EF4444" : isPasswordFocused ? "#FF8F00" : "#9CA3AF"}
            style={styles.inputIcon}
          />
                                        <TextInput
            style={styles.input}
            placeholder="Password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!isPasswordVisible}
                                            value={password}
              onChangeText={handlePasswordChange}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
              />
              <TouchableOpacity onPress={() => setIsPasswordVisible(v => !v)}>
                <Ionicons
                  name={isPasswordVisible ? "eye-off" : "eye"}
                  size={20}
                  color="#9CA3AF"
            />
              </TouchableOpacity>
          </View>
          {passwordError && (
              <Text style={styles.errorText}>{passwordError}</Text>
          )}
                                </View>

          <TouchableOpacity style={styles.forgotPassword}>
                                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                                </TouchableOpacity>

        {!!error && (
            <View style={styles.globalError}>
              <Ionicons name="alert-circle" size={16} color="#EF4444" />
              <Text style={styles.globalErrorText}>{error}</Text>
            </View>
        )}

        <TouchableOpacity
          style={styles.signInButton}
                                    onPress={handleSignIn}
          disabled={isLoading}
            activeOpacity={0.9}
        >
          <LinearGradient
              colors={['#FF8F00', '#FFA726']}
              style={styles.signInGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
              <Text style={styles.signInText}>
              {isLoading ? "Signing In..." : "Sign In"}
            </Text>
              <Ionicons name="arrow-forward" size={20} color="#FFF" />
          </LinearGradient>
                                </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-google" size={24} color="#4285F4" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-apple" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-facebook" size={24} color="#1877F2" />
            </TouchableOpacity>
          </View>

        <View style={styles.signUpPrompt}>
                                    <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity onPress={onSignUp}>
                                        <Text style={styles.signUpLink}>Sign Up</Text>
                                    </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
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
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.05,
  },
  card: {
    width: screenWidth * 0.9,
    maxWidth: 440,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 32,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 30,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 24,
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#FFF8E1",
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#FF8F00",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
  },
      android: {
        elevation: 6,
      },
    }),
    },
    title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 32,
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 2,
    borderColor: "#F3F4F6",
  },
  inputFocused: {
    backgroundColor: "#FFFBF0",
    borderColor: "#FF8F00",
  },
  inputError: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },
  inputIcon: {
    marginRight: 12,
    },
    input: {
        flex: 1,
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "500",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 13,
    marginTop: 6,
    marginLeft: 4,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
    },
    forgotPasswordText: {
    color: "#FF8F00",
    fontSize: 14,
    fontWeight: "600",
    },
  globalError: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#EF4444",
  },
  globalErrorText: {
    color: "#EF4444",
    fontSize: 13,
    marginLeft: 8,
    flex: 1,
    fontWeight: "500",
  },
    signInButton: {
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#FF8F00",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  signInGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  signInText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    color: "#9CA3AF",
    fontSize: 14,
    marginHorizontal: 16,
    fontWeight: "500",
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 28,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  signUpPrompt: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signUpText: {
    color: "#6B7280",
    fontSize: 15,
  },
  signUpLink: {
    color: "#FF8F00",
    fontSize: 15,
    fontWeight: "700",
    },
});

export default SignInScreen;