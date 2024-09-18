import Colors from '../constants/Colors';
import { defaultStyles } from '../constants/Styles';
import { isClerkAPIResponseError, useSignIn } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

const SignInType =  {
  Phone: 'Phone',
  Email: 'Email',
  Google: 'Google',
  Apple :'Apple',
}

const Login = () => {

    const [Email, setEmail] = useState('');
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 80 : 0;
    const { signIn, setActive, isLoaded } = useSignIn();
    const [showPassword, setShowPassword] = useState(true)
    const [password, setPassword] = useState('')

    const onSignIn = async (type) => {
         if (!isLoaded) {
          return;
       }
    if (type === SignInType.Email) {
      try {
        const signInAttempt = await signIn.create({
        identifier: Email,
        password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
      } catch (err) {
        console.log('error', JSON.stringify(err, null, 2));
        if (isClerkAPIResponseError(err)) {
          if (err.errors[0].code === 'form_identifier_not_found') {
            Alert.alert('Error', err.errors[0].message);
          }
        }
      }
    }
  };

  

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={keyboardVerticalOffset}>
      <View style={defaultStyles.container}>
        <Text style={defaultStyles.header}>Welcome back</Text>
        <Text style={defaultStyles.descriptionText}>
          Enter the Email address associated with your account
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

        <TouchableOpacity
          style={[
            defaultStyles.pillButton,
           Email !== '' && password !== '' ? styles.enabled : styles.disabled,
            { marginBottom: 10 },
          ]}
          onPress={() => onSignIn(SignInType.Email)}>
          <Text style={defaultStyles.buttonText}>Continue</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <View
            style={{ flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: Colors.gray }}
          />
          <Text style={{ color: Colors.gray, fontSize: 20 }}>or</Text>
          <View
            style={{ flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: Colors.gray }}
          />
        </View>

        <TouchableOpacity
          onPress={() => onSignIn(SignInType.Phone)}
          style={[
            defaultStyles.pillButton,
            {
              flexDirection: 'row',
              gap: 16,
              marginTop: 20,
              backgroundColor: '#fff',
            },
          ]}>
          <Ionicons name="mail" size={24} color={'#000'} />
          <Text style={[defaultStyles.buttonText, { color: '#000' }]}>Continue with SMS </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onSignIn(SignInType.Google)}
          style={[
            defaultStyles.pillButton,
            {
              flexDirection: 'row',
              gap: 16,
              marginTop: 20,
              backgroundColor: '#fff',
            },
          ]}>
          <Ionicons name="logo-google" size={24} color={'#000'} />
          <Text style={[defaultStyles.buttonText, { color: '#000' }]}>Continue with Google </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onSignIn(SignInType.Apple)}
          style={[
            defaultStyles.pillButton,
            {
              flexDirection: 'row',
              gap: 16,
              marginTop: 10,
              backgroundColor: '#fff',
            },
          ]}>
          <Ionicons name="logo-apple" size={24} color={'#000'} />
          <Text style={[defaultStyles.buttonText, { color: '#000' }]}>Continue with Apple </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

export default Login

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