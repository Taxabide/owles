import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  ColorValue,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AppLayout } from "../App";
import FooterSection from "../Screens/HomeScreen/FooterSection";

const { width, height } = Dimensions.get("window");

interface ContactCardItem {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  content1: string;
  content2: string;
  linkText: string;
  gradient: [ColorValue, ColorValue, ...ColorValue[]];
}

interface ContactCardProps {
  item: ContactCardItem;
  index: number;
  style?: object;
}

interface AnimatedInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  multiline?: boolean;
  style?: object;
  maxLength?: number;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  returnKeyType?: "next" | "done";
  onSubmitEditing?: () => void;
  blurOnSubmit?: boolean;
}

const ContactScreen = () => {
  const router = useRouter();
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const cardAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  // Input refs for navigation
  const nameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const subjectRef = useRef<TextInput>(null);
  const messageRef = useRef<TextInput>(null);

  // Field limits
  const LIMITS = {
    name: 50,
    email: 100,
    phone: 15,
    subject: 100,
    message: 500,
  } as const;
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Removed focusedField state: const [focusedField, setFocusedField] = useState<string | null>(null);

  // Individual field error states
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [subjectError, setSubjectError] = useState<string | null>(null);
  const [messageError, setMessageError] = useState<string | null>(null);

  // Floating elements animation
  const floatingAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  // Removed blurTimer ref: const blurTimer = useRef<number | null>(null);

  useEffect(() => {
    // Initial animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Staggered card animations
    cardAnimations.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 600,
        delay: index * 200,
        useNativeDriver: true,
      }).start();
    });

    // Floating elements animation
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

    // Continuous rotation for decorative elements
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const handleBackPress = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      router.back();
    });
  };

  const handleInputChange = (field: string, value: string) => {
    let processedValue = value;

    // Field-specific processing
    switch (field) {
      case "phone":
        // Allow digits, +, -, (, ), and spaces
        processedValue = value.replace(/[^0-9+\-() ]/g, "");
        if (phoneError) {
          setPhoneError(validatePhone(processedValue));
        }
        break;
      case "email":
        // Remove spaces for email
        processedValue = value.replace(/\s/g, "");
        if (emailError) {
          setEmailError(validateEmail(processedValue));
        }
        break;
      case "name":
        if (nameError) {
          setNameError(validateName(processedValue));
        }
        break;
      case "subject":
        if (subjectError) {
          setSubjectError(validateSubject(processedValue));
        }
        break;
      case "message":
        if (messageError) {
          setMessageError(validateMessage(processedValue));
        }
        break;
      default:
        break;
    }

    // Apply length limits
    const maxLength = LIMITS[field as keyof typeof LIMITS];
    if (maxLength && processedValue.length > maxLength) {
      processedValue = processedValue.slice(0, maxLength);
    }

    setFormData(prev => ({ ...prev, [field]: processedValue }));
  };

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
    const emailRegex = /^[\S]+@[\S]+\.[\S]+$/;
    if (!emailRegex.test(email)) {
      return "Invalid email format.";
    }
    return null;
  };

  const validatePhone = (phone: string) => {
    if (!phone.trim()) {
      return "Phone number is required.";
    }
    // Basic phone number validation (e.g., 10-15 digits, allowing +, -, (, ), and spaces)
    const phoneRegex = /^[0-9+\-()\s]{7,15}$/;
    if (!phoneRegex.test(phone)) {
      return "Invalid phone number format (7-15 digits, can include +, -, (), spaces).";
    }
    return null;
  };

  const validateSubject = (subject: string) => {
    if (!subject.trim()) {
      return "Subject is required.";
    }
    if (subject.trim().length < 5) {
      return "Subject must be at least 5 characters long.";
    }
    return null;
  };

  const validateMessage = (message: string) => {
    if (!message.trim()) {
      return "Message is required.";
    }
    if (message.trim().length < 10) {
      return "Message must be at least 10 characters long.";
    }
    return null;
  };

  const validateForm = (): boolean => {
    // Clear all errors before re-validating
    setNameError(null);
    setEmailError(null);
    setPhoneError(null);
    setSubjectError(null);
    setMessageError(null);

    let hasError = false;

    const nameValidationMsg = validateName(formData.name);
    if (nameValidationMsg) {
      setNameError(nameValidationMsg);
      hasError = true;
    }

    const emailValidationMsg = validateEmail(formData.email);
    if (emailValidationMsg) {
      setEmailError(emailValidationMsg);
      hasError = true;
    }

    const phoneValidationMsg = validatePhone(formData.phone);
    if (phoneValidationMsg) {
      setPhoneError(phoneValidationMsg);
      hasError = true;
    }

    const subjectValidationMsg = validateSubject(formData.subject);
    if (subjectValidationMsg) {
      setSubjectError(subjectValidationMsg);
      hasError = true;
    }

    const messageValidationMsg = validateMessage(formData.message);
    if (messageValidationMsg) {
      setMessageError(messageValidationMsg);
      hasError = true;
    }

    return !hasError;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
    // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
    
      // Success feedback
      Alert.alert("Success", "Message sent successfully!");
    
    // Reset form
    setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });
    
    // Show success animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
      
    } catch (error) {
      Alert.alert("Error", "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigation between fields
  const focusNextField = (currentField: string) => {
    const fieldOrder = ["name", "email", "phone", "subject", "message"];
    const currentIndex = fieldOrder.indexOf(currentField);
    const nextField = fieldOrder[currentIndex + 1];
    
    if (nextField) {
      // Clear any existing blur timer to prevent immediate unfocus
      // if (blurTimer.current) { // Removed blurTimer.current
      //   clearTimeout(blurTimer.current);
      //   blurTimer.current = null;
      // }
      switch (nextField) {
        case "email":
          emailRef.current?.focus();
          break;
        case "phone":
          phoneRef.current?.focus();
          break;
        case "subject":
          subjectRef.current?.focus();
          break;
        case "message":
          messageRef.current?.focus();
          break;
      }
    } else {
      // Last field, dismiss keyboard after a short delay to allow 'done' to process
      // if (blurTimer.current) { // Removed blurTimer.current
      //   clearTimeout(blurTimer.current);
      // }
      messageRef.current?.blur();
    }
  };

  const ContactCard = ({ item, index, style = {} }: ContactCardProps) => {
    const [pressed, setPressed] = useState(false);
    
    return (
      <Animated.View
        style={[
          {
            opacity: cardAnimations[index],
            transform: [
              {
                translateY: cardAnimations[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
              {
                scale: pressed ? 0.98 : 1,
              },
            ],
          },
        ]}
      >
        <Pressable
          onPressIn={() => setPressed(true)}
          onPressOut={() => setPressed(false)}
          style={[styles.contactCard, style]}
        >
          <View
            style={[styles.cardGradient, { backgroundColor: item.gradient[0] }]}
          >
            <View style={styles.cardHeader}>
              <Animated.View 
                style={[
                  styles.cardIconContainer,
                  {
                    transform: [
                      {
                      rotate: rotateAnim.interpolate({
                        inputRange: [0, 1],
                          outputRange: ["0deg", "360deg"],
                      }),
                      },
                    ],
                  },
                ]}
              >
                <BlurView intensity={50} tint="light" style={StyleSheet.absoluteFill}>
                <Ionicons name={item.icon} size={32} color="#FFFFFF" />
                </BlurView>
              </Animated.View>
            </View>
            
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <View style={styles.cardContentContainer}>
                <Text style={styles.cardContent}>{item.content1}</Text>
                <Text style={styles.cardContent}>{item.content2}</Text>
              </View>
            </View>

            <View style={styles.cardFooter}>
              <TouchableOpacity style={styles.cardLinkContainer}>
                <Text style={styles.cardLink}>{item.linkText}</Text>
                <Ionicons
                  name="arrow-forward"
                  size={16}
                  color="#FFFFFF"
                  style={{ marginLeft: 8 }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Animated.View>
    );
  };

  const AnimatedInput = React.forwardRef<TextInput, AnimatedInputProps>(
    ({ label, value, onChangeText, onSubmitEditing, ...props }, ref) => {
    const inputAnim = useRef(new Animated.Value(0)).current;
    const [isFocused, setIsFocused] = useState(false); // Internal focused state
    
    useEffect(() => {
      Animated.timing(inputAnim, {
        toValue: isFocused ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }, [isFocused]); // Depend on internal isFocused

      const handleBlur = () => {
        // Only clear focusedField if another field hasn't taken focus within a short period
        // blurTimer.current = setTimeout(() => { // Removed blurTimer.current
        //   if (focusedField === label) { // Only blur if this field is still considered focused
        //     setFocusedField(null);
        //   }
        // }, 50); // Small delay
      };

    return (
        <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>{label}</Text>
        <Animated.View
          style={[
            styles.inputContainer,
            {
              borderColor: inputAnim.interpolate({
                inputRange: [0, 1],
                  outputRange: ["#E0E0E0", "#2196F3"],
              }),
              shadowOpacity: inputAnim.interpolate({
                inputRange: [0, 1],
                  outputRange: [0, 0.2],
                }),
                shadowRadius: inputAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 8],
                }),
                elevation: inputAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 4],
              }),
            },
          ]}
          >
            <LinearGradient
              colors={isFocused ? ["#E3F2FD", "#FFFFFF"] : ["#F9F9F9", "#F9F9F9"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientBackground}
        >
          <TextInput
                ref={ref}
                editable
                style={[
                  styles.inputField,
                  props.multiline && styles.messageInputField,
                ]}
            value={value}
            onChangeText={onChangeText}
                onFocus={() => setIsFocused(true)} // Update internal state
                onBlur={() => setIsFocused(false)} // Update internal state
                onSubmitEditing={onSubmitEditing}
                placeholderTextColor="#999"
                blurOnSubmit={props.blurOnSubmit ?? false}
                autoCorrect={false}
                underlineColorAndroid="transparent"
            {...props}
          />
            </LinearGradient>
        </Animated.View>
        </View>
    );
    }
  );

  const contactCards: ContactCardItem[] = [
    {
      icon: "location-outline" as keyof typeof Ionicons.glyphMap,
      title: "Main Office",
      content1: "2972 Westheimer Rd. Santa Ana,",
      content2: "Illinois 85486",
      linkText: "Find Location",
      gradient: ["#667eea", "#764ba2"],
    },
    {
      icon: "mail-outline" as keyof typeof Ionicons.glyphMap,
      title: "Email Address",
      content1: "infoexample@gmail.com",
      content2: "example@gmail.com",
      linkText: "Get In Touch",
      gradient: ["#f093fb", "#f5576c"],
    },
    {
      icon: "call-outline" as keyof typeof Ionicons.glyphMap,
      title: "Phone Number",
      content1: "(505) 555-0125",
      content2: "(406) 555-0120",
      linkText: "Contact Us Today!",
      gradient: ["#4facfe", "#00f2fe"],
    },
  ];

  return (
    <AppLayout>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        >
          {/* Floating Background Elements */}
          {floatingAnims.map((anim, index) => (
            <Animated.View
              pointerEvents="none"
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
                index === 0 && { top: 100, left: 20 },
                index === 1 && { top: 200, right: 30 },
                index === 2 && { top: 400, left: 40 },
                index === 3 && { bottom: 200, right: 20 },
              ]}
            />
          ))}

          <ScrollView 
            contentContainerStyle={styles.scrollContentContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            nestedScrollEnabled={true}
          >
            <Animated.View
              style={[
                styles.content,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              {/* Page Title with Animation */}
              <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
          <Text style={styles.title}>Contact</Text>
          <View style={styles.breadcrumb}>
            <Ionicons name="home" size={16} color="#555" />
                  <TouchableOpacity onPress={() => router.push("/")}>
                    <Text style={styles.breadcrumbText}>Home</Text>
                  </TouchableOpacity>
                  <Text style={styles.breadcrumbSeparator}>{">"}</Text>
                  <Text
                    style={[styles.breadcrumbText, styles.breadcrumbActive]}
                  >
                    Contact
                  </Text>
          </View>
              </Animated.View>

              {/* Get In Touch Section */}
              <Animated.View 
                style={[
                  styles.getInTouchSection,
                  { 
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                  },
                ]}
              >
                <View style={styles.getInTouchHeader}>
            <Ionicons name="chatbox-outline" size={24} color="#2196F3" />
            <Text style={styles.getInTouchTitle}>Get In Touch</Text>
                </View>
                <Text style={styles.helpYouHeading}>Let us help you</Text>
                <Text style={styles.getInTouchDescription}>
                  Our platform is built on the principles of innovation,
                  quality, and inclusivity, aiming to provide a seamless
                  learning experience.
                </Text>
              </Animated.View>

              {/* Animated Contact Cards */}
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={styles.contactCardsScrollContainer}
                nestedScrollEnabled={true}
              >
                {contactCards.map((item, index) => (
                  <ContactCard key={index} item={item} index={index} />
                ))}
              </ScrollView>

              {/* Main Contact Section */}
              <View style={styles.mainContactSection}>
                {/* Contact Info Section */}
                <Animated.View 
                  style={[
                    styles.contactInfoSection,
                    {
                      opacity: fadeAnim,
                      transform: [{ translateX: slideAnim }],
                    },
                  ]}
                >
                  <View style={styles.contactUsHeader}>
                    <Ionicons
                      name="chatbox-outline"
                      size={20}
                      color="#2196F3"
                    />
                    <Text style={styles.contactUsTitle}>Contact Us</Text>
                  </View>
                  <Text style={styles.contactUsHeading}>
                    Have questions? don't hesitate to contact us
                  </Text>
                  <Text style={styles.contactUsDescription}>
                    We are passionate about transforming lives through
                    education. Founded with a vision to make learning accessible
                    to all, we believe in the power of knowledge to unlock
                    opportunities and shape the future.
            </Text>
                  
                  {/* Animated Review Section */}
                  <View style={styles.reviewSection}>
                    <View style={styles.avatarGroup}>
                      {[1, 2, 3, 4, 5].map((_, index) => (
                        <Animated.Image
                          key={index}
                          source={require("../../../assets/images/about-img1.webp")}
                          style={[
                            styles.avatar,
                            {
                              transform: [
                                {
                                scale: fadeAnim.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [0.8, 1],
                                }),
                                },
                              ],
                            },
                          ]}
                        />
                      ))}
          </View>
        </View>
                </Animated.View>

                {/* Contact Form Section */}
                <Animated.View 
                  style={[
                    styles.contactFormSection,
                    {
                      opacity: fadeAnim,
                      transform: [
                        { 
                          translateX: slideAnim.interpolate({
                            inputRange: [-50, 0],
                            outputRange: [50, 0],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <Text style={styles.formHeading}>Contact Details</Text>
                  
                  <AnimatedInput
                    ref={nameRef}
                    label="Name"
                    value={formData.name}
                    onChangeText={(value) => handleInputChange("name", value)}
                    placeholder="Enter your name..."
                    maxLength={LIMITS.name}
                    returnKeyType="next"
                    onSubmitEditing={() => focusNextField("name")}
                    blurOnSubmit={false}
                  />
                  {nameError && (
                    <View style={styles.errorContainer}>
                      <Ionicons name="alert-circle-outline" size={14} color="#EF4444" />
                      <Text style={styles.errorText}>{nameError}</Text>
                    </View>
                  )}
                  
                  <AnimatedInput
                    ref={emailRef}
                    label="Email"
                    value={formData.email}
                    onChangeText={(value) => handleInputChange("email", value)}
                    placeholder="Enter your email..."
                    keyboardType="email-address"
                    autoCapitalize="none"
                    maxLength={LIMITS.email}
                    returnKeyType="next"
                    onSubmitEditing={() => focusNextField("email")}
                    blurOnSubmit={false}
                  />
                  {emailError && (
                    <View style={styles.errorContainer}>
                      <Ionicons name="alert-circle-outline" size={14} color="#EF4444" />
                      <Text style={styles.errorText}>{emailError}</Text>
                    </View>
                  )}
                  
                  <AnimatedInput
                    ref={phoneRef}
                    label="Phone"
                    value={formData.phone}
                    onChangeText={(value) => handleInputChange("phone", value)}
                    placeholder="Enter your number..."
                    keyboardType="phone-pad"
                    maxLength={LIMITS.phone}
                    returnKeyType="next"
                    onSubmitEditing={() => focusNextField("phone")}
                    blurOnSubmit={false}
                  />
                  {phoneError && (
                    <View style={styles.errorContainer}>
                      <Ionicons name="alert-circle-outline" size={14} color="#EF4444" />
                      <Text style={styles.errorText}>{phoneError}</Text>
                    </View>
                  )}
                  
                  <AnimatedInput
                    ref={subjectRef}
                    label="Subject"
                    value={formData.subject}
                    onChangeText={(value) =>
                      handleInputChange("subject", value)
                    }
                    placeholder="Enter your subject..."
                    maxLength={LIMITS.subject}
                    returnKeyType="next"
                    onSubmitEditing={() => focusNextField("subject")}
                    blurOnSubmit={false}
                  />
                  {subjectError && (
                    <View style={styles.errorContainer}>
                      <Ionicons name="alert-circle-outline" size={14} color="#EF4444" />
                      <Text style={styles.errorText}>{subjectError}</Text>
                    </View>
                  )}
                  
                  <AnimatedInput
                    ref={messageRef}
                    label="Message"
                    value={formData.message}
                    onChangeText={(value) =>
                      handleInputChange("message", value)
                    }
                    placeholder="Enter your message..."
                    multiline
                    maxLength={LIMITS.message}
                    returnKeyType="done"
                    blurOnSubmit={true}
                  />
                  {messageError && (
                    <View style={styles.errorContainer}>
                      <Ionicons name="alert-circle-outline" size={14} color="#EF4444" />
                      <Text style={styles.errorText}>{messageError}</Text>
                    </View>
                  )}

                  {/* Animated Submit Button */}
                  <TouchableOpacity 
                    style={styles.sendMessageButton} 
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.buttonGradient,
                        { backgroundColor: isSubmitting ? "#90CAF9" : "#2196F3" },
                      ]}
                    >
                      {isSubmitting ? (
                        <Animated.View style={styles.loadingContainer}>
                          <Animated.View
                            style={[
                              styles.loadingDot,
                              {
                                transform: [
                                  {
                                  scale: fadeAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.8, 1.2],
                                  }),
                                  },
                                ],
                              },
                            ]}
                          />
                          <Text style={styles.sendMessageButtonText}>
                            Sending...
                          </Text>
                        </Animated.View>
                      ) : (
                        <>
                          <Text style={styles.sendMessageButtonText}>
                            Send Message
                          </Text>
                          <Ionicons
                            name="send"
                            size={18}
                            color="#FFFFFF"
                            style={{ marginLeft: 10 }}
                          />
                        </>
                      )}
                    </View>
                  </TouchableOpacity>
                </Animated.View>
      </View>
            </Animated.View>
            <FooterSection />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "transparent",
  },
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollContentContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 50,
  },
  content: {
    width: "100%",
    maxWidth: 1200,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  
  // Floating elements
  floatingElement: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#2196F3",
  },
  
  // Title and breadcrumb
  title: {
    fontSize: 36,
    fontWeight: "900",
    color: "#1A1A1A",
    marginBottom: 15,
    textAlign: "center",
    letterSpacing: -1,
  },
  breadcrumb: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    marginBottom: 50,
  },
  breadcrumbText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  breadcrumbSeparator: {
    fontSize: 14,
    color: "#999",
    marginHorizontal: 8,
  },
  breadcrumbActive: {
    color: "#2196F3",
    fontWeight: "700",
  },
  
  // Get In Touch Section Styles
  getInTouchSection: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 40,
    paddingHorizontal: 20,
    maxWidth: 600,
  },
  getInTouchHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  getInTouchTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2196F3",
    marginLeft: 10,
    letterSpacing: 0.5,
  },
  helpYouHeading: {
    fontSize: 38,
    fontWeight: "900",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 15,
    lineHeight: 45,
    letterSpacing: -1,
  },
  getInTouchDescription: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 26,
    maxWidth: 500,
  },

  // Contact cards
  contactCardsScrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 60,
    gap: 25,
  },
  contactCard: {
    width: 320,
    height: 240,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
  },
  cardGradient: {
    flex: 1,
    padding: 25,
    justifyContent: "space-between",
  },
  
  // Card structure
  cardHeader: {
    alignItems: "center",
    marginBottom: 15,
  },
  cardIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    justifyContent: "center",
    alignItems: "center",
    backdropFilter: "blur(10px)",
  },
  
  cardBody: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  cardContentContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  cardContent: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    marginBottom: 2,
    fontWeight: "400",
    lineHeight: 20,
  },
  
  cardFooter: {
    alignItems: "center",
  },
  cardLinkContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    minWidth: 120,
  },
  cardLink: {
    fontSize: 14,
    color: "#2196F3",
    fontWeight: "600",
  },
  
  // Main contact section
  mainContactSection: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginTop: 40,
    marginBottom: 40,
    flexWrap: "wrap",
    gap: 40,
  },
  
  // Contact info section
  contactInfoSection: {
    flex: 1,
    minWidth: 350,
    maxWidth: 500,
    padding: 20,
  },
  contactUsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  contactUsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2196F3",
    marginLeft: 10,
    letterSpacing: 0.5,
  },
  contactUsHeading: {
    fontSize: 32,
    fontWeight: "900",
    color: "#1A1A1A",
    marginBottom: 20,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  contactUsDescription: {
    fontSize: 16,
    color: "#666",
    lineHeight: 26,
    marginBottom: 30,
    fontWeight: "400",
  },
  
  // Review section
  reviewSection: {
    alignItems: "flex-start",
    marginTop: 25,
  },
  avatarGroup: {
    flexDirection: "row",
    marginBottom: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: -12,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  starRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  ratingText: {
    fontSize: 15,
    color: "#666",
    marginLeft: 10,
    fontWeight: "600",
  },
  
  // Form section
  contactFormSection: {
    flex: 1,
    minWidth: 400,
    maxWidth: 500,
    padding: 30,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  formHeading: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1A1A1A",
    marginBottom: 30,
    letterSpacing: -0.5,
  },
  inputGroup: {
    marginBottom: 25,
    width: "100%",
  },
  inputLabel: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  inputContainer: {
    borderWidth: 2,
    borderRadius: 15,
    backgroundColor: "#F9F9F9",
    shadowColor: "#2196F3",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
  },
  gradientBackground: {
    flex: 1,
    borderRadius: 13,
  },
  inputField: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  messageInputField: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  
  // Submit button
  sendMessageButton: {
    marginTop: 30,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#2196F3",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  sendMessageButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  
  // Loading states
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
    marginRight: 10,
  },

  // Error message styles
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    marginLeft: 10,
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    marginLeft: 5,
    fontWeight: "500",
  },
});

export default ContactScreen;
