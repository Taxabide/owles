import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { loadAuthDataAsync } from '../../redux/slices/authSlice';
import { setShowLogin, toggleMenu } from '../../redux/slices/uiSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { SignInScreen, SignUpScreen } from '../Auth';
import { Sidebar } from '../Navigation';

const { width: screenWidth } = Dimensions.get('window');

interface AppLayoutProps {
    children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
    const [isSignInVisible, setIsSignInVisible] = useState(false);
    const [isSignUpVisible, setIsSignUpVisible] = useState(false);
    // const [isMenuOpen, setIsMenuOpen] = useState(false); // Removed local state
    const isMenuOpen = useSelector((state: RootState) => state.ui.isMenuOpen);
    const showLogin = useSelector((state: RootState) => state.ui.showLogin);
    const dispatch = useDispatch<AppDispatch>();

    const [slideAnim] = useState(new Animated.Value(-screenWidth));

    const toggleSignIn = () => {
        setIsSignInVisible(!isSignInVisible);
        dispatch(setShowLogin(!isSignInVisible));
    };

    const toggleSignUp = () => {
        setIsSignUpVisible(!isSignUpVisible);
    };

    // Removed local toggleMenu function
    // const toggleMenu = () => {
    //     setIsMenuOpen(!isMenuOpen);
    // };

    // Handle sidebar animation based on Redux state
    useEffect(() => {
        if (isMenuOpen) {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: -screenWidth,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [isMenuOpen]);

    // Load auth data on mount
    useEffect(() => {
        dispatch(loadAuthDataAsync());
    }, [dispatch]);

    // Sync showLogin from Redux with local state
    useEffect(() => {
        if (showLogin && !isSignInVisible) {
            setIsSignInVisible(true);
        }
    }, [showLogin]);

    const handleSignUpFromSignIn = () => {
        setIsSignInVisible(false);
        setIsSignUpVisible(true);
    };

    const handleSignInFromSignUp = () => {
        setIsSignUpVisible(false);
        setIsSignInVisible(true);
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, overflow: 'hidden' }}>
                {!(isSignInVisible || showLogin) && !isSignUpVisible && (
                    <>{children}</>
                )}

                {/* SignIn Screen */}
                {(isSignInVisible || showLogin) && (
                    <SignInScreen
                        onClose={() => {
                            setIsSignInVisible(false);
                            dispatch(setShowLogin(false));
                        }}
                        onSignUp={handleSignUpFromSignIn}
                    />
                )}

                {/* SignUp Screen */}
                {isSignUpVisible && (
                    <SignUpScreen
                        onClose={toggleSignUp}
                        onSignIn={handleSignInFromSignUp}
                    />
                )}

                {/* Sidebar Menu */}
                <Sidebar
                    isMenuOpen={isMenuOpen}
                    toggleMenu={() => dispatch(toggleMenu())} // Dispatch Redux action
                    slideAnim={slideAnim}
                />

                {/* Overlay */}
                {isMenuOpen && (
                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            zIndex: 1000,
                        }}
                        activeOpacity={1}
                        onPress={() => dispatch(toggleMenu())} // Dispatch Redux action
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

export default AppLayout;
