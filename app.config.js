module.exports = ({ config }) => {
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
  const iosScheme = iosClientId?.endsWith('.apps.googleusercontent.com')
    ? `com.googleusercontent.apps.${iosClientId.replace('.apps.googleusercontent.com', '')}`
    : undefined;

  return {
    ...config,
    ios: { ...config.ios, bundleIdentifier: process.env.ONYAK_IOS_BUNDLE_IDENTIFIER || config.ios?.bundleIdentifier },
    android: { ...config.android, package: process.env.ONYAK_ANDROID_PACKAGE || config.android?.package },
    plugins: [
      ...(config.plugins ?? []),
      ...(iosScheme ? [['@react-native-google-signin/google-signin', { iosUrlScheme: iosScheme }]] : []),
    ],
  };
};
