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
  urlProjectSourceCode: string;
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
  iDontWantMerchandiseItemCode: string;
  notifyMessagePosition: string;
  apiBase: string;
  apiBaseRtwbbFeed: string;
  apiVersion: string;
  apiDefaultLang: string;
  urlApiDiscountCoupon: string;
  urlApiHasOrganizationAdmin: string;
  urlApiHasUserVerifiedEmail: string;
  urlApiLogin: string;
  urlApiLoginGoogle: string;
  urlApiOrganizations: string;
  urlApiLoginFacebook: string;
  urlApiMerchandise: string;
  urlAppDataPrivacyPolicy: string;
  urlApiRefresh: string;
  urlApiRegister: string;
  urlApiRegisterCoordinator: string;
  urlApiResetPassword: string;
  urlApiChallengeRegistrationUser: string;
  urlApiCities: string;
  urlApiSubsidiaries: string;
  urlApiThisCampaign: string;
  urlApiTeams: string;
  urlLoginRegisterBackgroundImage: string;
  urlRTWBBLogo: string;
  urlBaseBackend: string;
  checkIsEmailVerifiedInterval: number;
  checkIsThisCampaignCompetitionPhaseTypeInterval: string;
  googleLoginAppId: string;
  facebookLoginAppId: string;
  secretString: string;
  facebookLoginSdkVersion: string;
  facebookLoginSdkOptions: string;
  mapProjection: string;
  mapCenterLon: string;
  mapCenterLat: string;
  mapZoom: string;
  mapGeocodingApiUrl: string;
  mapSourceRtwbb: string;
  mapSourceOsm: string;
}

export interface ConfigAppVersion {
  version: string;
}
