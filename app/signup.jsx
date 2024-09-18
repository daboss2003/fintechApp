import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Link, useRouter } from 'expo-router'
import { useSignUp } from '@clerk/clerk-expo';
import { useState } from 'react';
import { defaultStyles } from '../constants/Styles'
import Colors from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

const SignUp = () => {
    const [Email, setEmail] = useState('');
    const [password, setPassword] = useState('')
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 80 : 0;
  const router = useRouter();
    const { signUp, isLoaded } = useSignUp();
    const [showPassword, setShowPassword] = useState(true)

    const onSignup = async () => {
      if (!isLoaded) {
      return;
    }
    try {
       await signUp.create({
          emailAddress: Email,
          password: password,
     });
      const data = await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      router.push({ pathname: '/verify/[phone]', params: { phone: Email } });
    } catch (error) {
      console.error('Error signing up:', JSON.stringify(error));
    }
    };
    
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={keyboardVerticalOffset}>
      <View style={defaultStyles.container}>
        <Text style={defaultStyles.header}>Let's get started!</Text>
        <Text style={defaultStyles.descriptionText}>
          Enter your Email address. We will send you a confirmation code there
        </Text>
        <View style={styles.inputContainer}>
          
          <TextInput
            style={[styles.input]}
            placeholder="Email Address"
            placeholderTextColor={Colors.gray}
            keyboardType="email-address"
            value={Email}
            onChangeText={setEmail}
                  />
            <View style={{flexDirection: 'row',...styles.input, gap: 10,  alignItems: 'center'}}>
                <View>
                    {
                    showPassword
                        ?
                        <Ionicons name="eye-off-outline" size={24} color="black" onPress={() => setShowPassword(false)} />
                        :
                        <Ionicons name="eye-outline" size={24} color="black" onPress={() => setShowPassword(true)} />
                   }
                </View>
                <TextInput
                    style={[ {flex: 1, fontSize: 18}]}
                    placeholder="password"
                    placeholderTextColor={Colors.gray}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={showPassword}
                />
           </View>
        </View>

        <Link href={'/login'} replace asChild>
          <TouchableOpacity>
            <Text style={defaultStyles.textLink}>Already have an account? Log in</Text>
          </TouchableOpacity>
        </Link>

        <View style={{ flex: 1 }} />

        <TouchableOpacity
          style={[
            defaultStyles.pillButton,
            Email !== '' && password !== '' ? styles.enabled : styles.disabled,
            { marginVertical: 10 },
          ]}
          onPress={onSignup}>
          <Text style={defaultStyles.buttonText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

export default SignUp

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 20,
    gap: 15
  },
  input: {
    backgroundColor: Colors.lightGray,
    padding: 12,
    borderRadius: 25,
    fontSize: 18,
  },
  enabled: {
    backgroundColor: Colors.primary,
  },
  disabled: {
    backgroundColor: Colors.primaryMuted,
  },

})