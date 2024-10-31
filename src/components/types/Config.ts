export interface ConfigGlobal {
  colorPrimary: string;
  colorPrimaryDark: string;
  colorPrimaryOpacity: number;
  colorSecondary: string;
  colorGray: string;
  colorGrayLight: string;
  colorGrayMiddle: string;
  colorWhite: string;
  colorBlack: string;
  colorRed: string;
  colorSecondaryBackgroundOpacity: number;
  colorWhiteBackgroundOpacity: number;
  image: string;
  width: string;
  title: string;
  subtitle: string;
  borderRadiusCard: string;
  borderRadiusCardSmall: string;
  borderRadiusButtonSmall: string;
  maxWidthBanner: string;
  contactEmail: string;
  urlAutoMat: string;
  urlAppStore: string;
  urlBlog: string;
  urlFacebook: string;
  urlGooglePlay: string;
  urlInstagram: string;
  urlTwitter: string;
  urlVideoLoggingRoutes: string;
  urlVideoOnboarding: string;
  urlFreeSoftwareDefinition: string;
  urlYoutube: string;
  challengeMonth: 'may' | 'october' | 'september';
  containerFormWidth: string;
  containerContentWidth: string;
  challengeStartDate: string;
  challengeLoggingWindowDays: number;
  defaultDistanceZero: string;
  entryFeePaymentMin: string;
  entryFeePaymentMax: string;
  entryFeePaymentOptions: string;
  notifyMessagePosition: string;
  apiBase: string;
  apiVersion: string;
  apiDefaultLang: string;
  urlApiHasUserVerifiedEmail: string;
  urlApiLogin: string;
  urlApiRefresh: string;
  urlApiRegister: string;
  urlApiResetPassword: string;
  urlLoginRegisterBackgroundImage: string;
  urlRTWBBLogo: string;
  checkIsEmailVerifiedInterval: number;
}

export interface ConfigAppVersion {
  version: string;
}
