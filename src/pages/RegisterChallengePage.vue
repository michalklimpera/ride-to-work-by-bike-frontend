<script lang="ts">
/**
 * RegisterChallengePage Component
 *
 * The `RegisterChallengePage` displays registration process for each challenge
 *
 * @description * Use this component to allow users to register for an
 * individual challenge.
 *
 * @components
 * - `FormFieldSelectTable`: Component to render company select widget.
 * - `FormFieldListMerch`: Component to render list of merch options.
 * - `FormFieldOptionGroup`: Component to render radio buttons.
 * - `FormPersonalDetails`: Component to render personal details form.
 * - `FormSelectOrganization`: Component to render organization select widget.
 * - `LoginRegisterHeader`: Component to render page header.
 * - `TopBarCountdown`: Component to display countdown.
 *
 * @layout
 * - `LoginRegisterLayout`: Displayed in the `LoginRegisterLayout` template.
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6385%3A26514&mode=dev)
 */

// libraries
import { computed, defineComponent, onMounted, ref } from 'vue';
import { QForm, QStepper } from 'quasar';
import { useRouter } from 'vue-router';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';
import { routesConf } from '../router/routes_conf';

// components
import FormFieldListMerch from 'src/components/form/FormFieldListMerch.vue';
import FormFieldOptionGroup from 'src/components/form/FormFieldOptionGroup.vue';
import FormPersonalDetails from 'src/components/form/FormPersonalDetails.vue';
import FormSelectOrganization from 'src/components/form/FormSelectOrganization.vue';
import FormSelectTeam from 'src/components/form/FormSelectTeam.vue';
import LoginRegisterHeader from 'components/global/LoginRegisterHeader.vue';
import RegisterChallengePayment from 'src/components/register/RegisterChallengePayment.vue';
import RegisterChallengeSummary from 'src/components/register/RegisterChallengeSummary.vue';
import ShowOrganizationIds from 'src/components/debug/ShowOrganizationIds.vue';
import TopBarCountdown from 'src/components/global/TopBarCountdown.vue';

// composables
import { useStepperValidation } from 'src/composables/useStepperValidation';
import { useOrganizations } from 'src/composables/useOrganizations';

// enums
import { OrganizationType } from 'src/components/types/Organization';
import { PaymentState, PaymentSubject } from 'src/components/enums/Payment';

// stores
import { useChallengeStore } from 'src/stores/challenge';
import { useRegisterChallengeStore } from 'src/stores/registerChallenge';

export default defineComponent({
  name: 'RegisterChallengePage',
  components: {
    FormFieldListMerch,
    FormFieldOptionGroup,
    FormPersonalDetails,
    FormSelectOrganization,
    FormSelectTeam,
    LoginRegisterHeader,
    RegisterChallengePayment,
    RegisterChallengeSummary,
    ShowOrganizationIds,
    TopBarCountdown,
  },
  setup() {
    const challengeMonth = rideToWorkByBikeConfig.challengeMonth;
    const containerFormWidth = rideToWorkByBikeConfig.containerFormWidth;
    const doneIcon = `img:${
      new URL('../assets/svg/check.svg', import.meta.url).href
    }`;
    // Stepper 1 imgs
    const iconImgSrcStepper1 = `img:${
      new URL('../assets/svg/numeric-1-outline.svg', import.meta.url).href
    }`;
    const activeIconImgSrcStepper1 = `img:${
      new URL('../assets/svg/numeric-1-fill.svg', import.meta.url).href
    }`;
    const doneIconImgSrcStepper1 = doneIcon;
    // Stepper 2 imgs
    const iconImgSrcStepper2 = `img:${
      new URL('../assets/svg/numeric-2-outline.svg', import.meta.url).href
    }`;
    const activeIconImgSrcStepper2 = `img:${
      new URL('../assets/svg/numeric-2-fill.svg', import.meta.url).href
    }`;
    const doneIconImgSrcStepper2 = doneIcon;
    // Stepper 3 imgs
    const iconImgSrcStepper3 = `img:${
      new URL('../assets/svg/numeric-3-outline.svg', import.meta.url).href
    }`;
    const activeIconImgSrcStepper3 = `img:${
      new URL('../assets/svg/numeric-3-fill.svg', import.meta.url).href
    }`;
    const doneIconImgSrcStepper3 = doneIcon;
    // Stepper 4 imgs
    const iconImgSrcStepper4 = `img:${
      new URL('../assets/svg/numeric-4-outline.svg', import.meta.url).href
    }`;
    const activeIconImgSrcStepper4 = `img:${
      new URL('../assets/svg/numeric-4-fill.svg', import.meta.url).href
    }`;
    const doneIconImgSrcStepper4 = doneIcon;
    // Stepper 5 imgs
    const iconImgSrcStepper5 = `img:${
      new URL('../assets/svg/numeric-5-outline.svg', import.meta.url).href
    }`;
    const activeIconImgSrcStepper5 = `img:${
      new URL('../assets/svg/numeric-5-fill.svg', import.meta.url).href
    }`;
    const doneIconImgSrcStepper5 = doneIcon;
    // Stepper 6 imgs
    const iconImgSrcStepper6 = `img:${
      new URL('../assets/svg/numeric-6-outline.svg', import.meta.url).href
    }`;
    const activeIconImgSrcStepper6 = `img:${
      new URL('../assets/svg/numeric-6-fill.svg', import.meta.url).href
    }`;
    const doneIconImgSrcStepper6 = doneIcon;
    // Stepper 7 imgs
    const iconImgSrcStepper7 = `img:${
      new URL('../assets/svg/numeric-7-outline.svg', import.meta.url).href
    }`;
    const activeIconImgSrcStepper7 = `img:${
      new URL('../assets/svg/numeric-7-fill.svg', import.meta.url).href
    }`;
    const doneIconImgSrcStepper7 = doneIcon;

    const challengeStore = useChallengeStore();
    const registerChallengeStore = useRegisterChallengeStore();

    const isPayuTransactionInitiated = computed(
      () => registerChallengeStore.getIsPayuTransactionInitiated,
    );
    const paymentState = computed(() => registerChallengeStore.getPaymentState);

    onMounted(async () => {
      // make sure price level is loaded
      if (!challengeStore.getPriceLevel.length) {
        await challengeStore.loadPhaseSet();
      }

      await registerChallengeStore.loadRegisterChallengeToStore();
      /**
       * Depending on the paymentState, and isPayuTransactionInitiated flag
       * we determine if situation is:
       * - refreshing page after returning from payment
       * - returning to a started payment
       */

      // set isPayuTransactionInitiated to `true` for specific set of tests
      if (
        window.Cypress?.currentTest?.title.includes('set-is-paid-from-ui-true')
      ) {
        registerChallengeStore.setIsPayuTransactionInitiated(true);
      }

      if (
        isPayuTransactionInitiated.value &&
        paymentState.value === PaymentState.done
      ) {
        // entry-fee/donation was paid - go to payment step
        onContinue();
      } else if (
        isPayuTransactionInitiated.value &&
        paymentState.value !== PaymentState.done
      ) {
        // trigger a periodic registration data refetch + display message
        registerChallengeStore.startRegisterChallengePeriodicCheck();
        // go to payment step
        onContinue();
      } else if (
        !isPayuTransactionInitiated.value &&
        paymentState.value === PaymentState.done
      ) {
        // if payment is done, it should always be safe to continue
        onContinue();
      }
    });

    const organizationType = computed({
      get: (): OrganizationType => registerChallengeStore.getOrganizationType,
      set: (value: OrganizationType) => {
        registerChallengeStore.setOrganizationType(value);
      },
    });

    const merchId = computed(
      (): number | null => registerChallengeStore.getMerchId,
    );

    const { getOrganizationLabels } = useOrganizations();
    const organizationStepTitle = computed(() => {
      return getOrganizationLabels(
        registerChallengeStore.getOrganizationType || OrganizationType.company,
      ).labelShort;
    });

    const step = ref(1);
    const stepperRef = ref<typeof QStepper | null>(null);
    const stepCompanyRef = ref<typeof QForm | null>(null);
    const stepParticipationRef = ref<typeof QForm | null>(null);
    const stepPaymentRef = ref<typeof QForm | null>(null);
    const stepPersonalDetailsRef = ref<typeof QForm | null>(null);
    const stepTeamRef = ref<typeof QForm | null>(null);
    const stepMerchRef = ref<typeof QForm | null>(null);
    const { onBack, onContinue } = useStepperValidation({
      step,
      stepperRef,
      stepCompanyRef,
      stepParticipationRef,
      stepPaymentRef,
      stepPersonalDetailsRef,
      stepTeamRef,
      stepMerchRef,
    });

    const router = useRouter();
    const onCompleteRegistration = () => {
      router.push(routesConf['home']['path']);
    };

    // Payment-related logic
    const isPaymentAmount = computed<boolean>((): boolean => {
      return (
        !!registerChallengeStore.getPaymentAmount &&
        registerChallengeStore.getPaymentAmount > 0
      );
    });

    /**
     * Show payment form if payment state is not `done` or `unknown`.
     * Also hide it if payment state is `unknown` as this is a non-valid state
     * and needs to be fixed by admin.
     */
    const isShownPaymentForm = computed<boolean>((): boolean => {
      return registerChallengeStore.getPaymentState !== PaymentState.done;
    });

    const isShownRegistrationPaidMessage = computed<boolean>((): boolean => {
      return registerChallengeStore.getPaymentState === PaymentState.done;
    });

    const isWaitingForPayamentConfirmation = computed<boolean>((): boolean => {
      return (
        isPayuTransactionInitiated.value &&
        registerChallengeStore.getPaymentState === PaymentState.none
      );
    });

    const isShownRegistrationNoAdmissionMessage = computed<boolean>(
      (): boolean => {
        return (
          registerChallengeStore.getPaymentState === PaymentState.noAdmission
        );
      },
    );

    const isShownRegistrationWaitingMessage = computed<boolean>((): boolean => {
      return registerChallengeStore.getPaymentState === PaymentState.waiting;
    });

    /**
     * Show create order button if:
     * - payment state is not `done` and paymentAmount > 0
     */
    const isShownCreateOrderButton = computed<boolean>((): boolean => {
      return (
        registerChallengeStore.getPaymentState !== PaymentState.done &&
        !!isPaymentAmount.value
      );
    });

    const isShownPaymentNextStepButton = computed<boolean>((): boolean => {
      return !isShownCreateOrderButton.value;
    });

    /**
     * Explicit conditions for enabling a pass
     * - payment_state = `done`
     * - payment_subject = company or school
     * - payment_subject = voucher && discount = 100
     */
    const isEnabledPaymentNextStepButton = computed(() => {
      const paymentSubject = registerChallengeStore.getPaymentSubject;
      const voucher = registerChallengeStore.getVoucher;
      // conditions
      const isPaymentDone =
        registerChallengeStore.getPaymentState === PaymentState.done;
      const isPaymentCompanyOrSchool = [
        PaymentSubject.company,
        PaymentSubject.school,
      ].includes(paymentSubject);
      const isVoucherFreeEntry =
        paymentSubject === PaymentSubject.voucher &&
        voucher?.valid &&
        voucher?.discount === 100;
      // composite condition
      return (
        isPaymentDone ||
        (isPaymentCompanyOrSchool && !isPaymentAmount.value) ||
        isVoucherFreeEntry
      );
    });

    const isLoadingPayuOrder = computed(() => {
      return registerChallengeStore.isLoadingPayuOrder;
    });

    const onSubmitPayment = () => {
      registerChallengeStore.createPayuOrder();
    };

    const contactEmail = rideToWorkByBikeConfig.contactEmail;
    const borderRadius = rideToWorkByBikeConfig.borderRadiusCardSmall;

    const isRegistrationComplete = computed(
      () => paymentState.value === PaymentState.done,
    );

    return {
      borderRadius,
      contactEmail,
      challengeMonth,
      containerFormWidth,
      step,
      stepperRef,
      stepCompanyRef,
      stepPaymentRef,
      stepParticipationRef,
      stepPersonalDetailsRef,
      stepTeamRef,
      stepMerchRef,
      iconImgSrcStepper1,
      activeIconImgSrcStepper1,
      doneIconImgSrcStepper1,
      iconImgSrcStepper2,
      activeIconImgSrcStepper2,
      doneIconImgSrcStepper2,
      iconImgSrcStepper3,
      activeIconImgSrcStepper3,
      doneIconImgSrcStepper3,
      iconImgSrcStepper4,
      activeIconImgSrcStepper4,
      doneIconImgSrcStepper4,
      iconImgSrcStepper5,
      activeIconImgSrcStepper5,
      doneIconImgSrcStepper5,
      iconImgSrcStepper6,
      activeIconImgSrcStepper6,
      doneIconImgSrcStepper6,
      iconImgSrcStepper7,
      activeIconImgSrcStepper7,
      doneIconImgSrcStepper7,
      merchId,
      isPaymentAmount,
      isRegistrationComplete,
      isShownPaymentForm,
      isShownCreateOrderButton,
      isShownPaymentNextStepButton,
      isShownRegistrationNoAdmissionMessage,
      isShownRegistrationPaidMessage,
      isShownRegistrationWaitingMessage,
      isWaitingForPayamentConfirmation,
      isEnabledPaymentNextStepButton,
      isLoadingPayuOrder,
      onSubmitPayment,
      organizationType,
      organizationStepTitle,
      onBack,
      onContinue,
      onCompleteRegistration,
      registerChallengeStore,
    };
  },
});
</script>

<template>
  <top-bar-countdown data-cy="top-bar-countdown" />
  <q-page padding>
    <div class="q-px-lg">
      <!-- Page header -->
      <login-register-header data-cy="login-register-header" />
      <!-- Container -->
      <div
        class="q-mx-auto q-mt-xl"
        :style="{ 'max-width': containerFormWidth }"
      >
        <show-organization-ids />
        <!-- Page title -->
        <h1
          class="text-h5 text-bold text-white q-my-none"
          data-cy="login-register-title"
        >
          {{
            $t(`register.challenge.titleRegisterToChallenge.${challengeMonth}`)
          }}
        </h1>
        <q-stepper
          animated
          header-nav
          vertical
          keep-alive
          ref="stepperRef"
          v-model="step"
          color="primary"
          class="bg-transparent q-py-none q-mt-lg"
          style="box-shadow: none"
          data-cy="stepper"
        >
          <!-- Step: Personal details -->
          <q-step
            :name="1"
            :title="$t('register.challenge.titleStepPersonalDetails')"
            :icon="iconImgSrcStepper1"
            :active-icon="activeIconImgSrcStepper1"
            :done-icon="doneIconImgSrcStepper1"
            :done="step > 1"
            :header-nav="step > 1"
            class="bg-white"
            data-cy="step-1"
          >
            <q-form ref="stepPersonalDetailsRef">
              <form-personal-details data-cy="form-personal-details" />
            </q-form>
            <q-stepper-navigation class="flex justify-end">
              <q-btn
                unelevated
                rounded
                color="primary"
                :label="$t('navigation.continue')"
                @click="onContinue"
                data-cy="step-1-continue"
              />
            </q-stepper-navigation>
          </q-step>
          <!-- Step: Payment -->
          <q-step
            :name="2"
            :title="$t('register.challenge.titleStepPayment')"
            :icon="iconImgSrcStepper2"
            :active-icon="activeIconImgSrcStepper2"
            :done-icon="doneIconImgSrcStepper2"
            :done="step > 2"
            :header-nav="step > 2"
            class="bg-white q-mt-lg"
            data-cy="step-2"
          >
            <!-- Form: Payment -->
            <q-form ref="stepPaymentRef">
              <q-banner
                v-if="isWaitingForPayamentConfirmation"
                class="bg-warning text-grey-10 q-mb-md"
                :style="{ borderRadius }"
                data-cy="step-2-waiting-for-payment-message"
              >
                {{ $t('register.challenge.textRegistrationWaitingForPayment') }}
              </q-banner>
              <q-banner
                v-if="isShownRegistrationNoAdmissionMessage"
                class="bg-negative text-white q-mb-md"
                :style="{ borderRadius }"
                data-cy="step-2-no-admission-message"
              >
                {{ $t('register.challenge.textRegistrationNoAdmission') }}
              </q-banner>
              <register-challenge-payment v-if="isShownPaymentForm" />
              <!-- Message: Registration paid (displayed after PayU payment has been made) -->
              <div
                v-if="isShownRegistrationPaidMessage"
                v-html="
                  $t('register.challenge.textRegistrationPaid', {
                    contactEmail,
                  })
                "
                data-cy="step-2-paid-message"
              />
            </q-form>
            <q-stepper-navigation class="flex justify-end">
              <q-btn
                unelevated
                rounded
                outline
                color="primary"
                :label="$t('navigation.back')"
                @click="onBack"
                data-cy="step-2-back"
              />
              <q-btn
                v-if="isShownCreateOrderButton"
                unelevated
                rounded
                color="primary"
                :disable="!isPaymentAmount"
                :label="$t('register.challenge.buttonSubmitPayment')"
                :loading="isLoadingPayuOrder"
                @click="onSubmitPayment"
                class="q-ml-sm"
                data-cy="step-2-submit-payment"
              />
              <q-btn
                v-if="isShownPaymentNextStepButton"
                unelevated
                rounded
                color="primary"
                :disable="!isEnabledPaymentNextStepButton"
                :label="$t('navigation.continue')"
                @click="onContinue"
                class="q-ml-sm"
                data-cy="step-2-continue"
              />
            </q-stepper-navigation>
          </q-step>
          <!-- Step: Organization type -->
          <q-step
            :name="3"
            :title="$t('register.challenge.titleStepParticipation')"
            :icon="iconImgSrcStepper3"
            :active-icon="activeIconImgSrcStepper3"
            :done-icon="doneIconImgSrcStepper3"
            :done="step > 3"
            :header-nav="step > 3"
            class="bg-white q-mt-lg"
            data-cy="step-3"
          >
            <q-form ref="stepParticipationRef">
              <p class="q-mb-md">
                {{ $t('form.participation.titleParticipation') }}
              </p>
              <form-field-option-group
                name="participation"
                label="form.labelParticipation"
              />
              <p class="q-mt-lg q-mb-none">
                {{ $t('form.participation.hintPariticipation') }}
              </p>
            </q-form>
            <q-stepper-navigation class="flex justify-end">
              <q-btn
                unelevated
                rounded
                outline
                @click="onBack"
                color="primary"
                :label="$t('navigation.back')"
                data-cy="step-3-back"
              />
              <q-btn
                unelevated
                rounded
                @click="onContinue"
                color="primary"
                :label="$t('navigation.continue')"
                class="q-ml-sm"
                data-cy="step-3-continue"
              />
            </q-stepper-navigation>
          </q-step>
          <!-- Step: Company -->
          <q-step
            :name="4"
            :title="organizationStepTitle"
            :icon="iconImgSrcStepper4"
            :active-icon="activeIconImgSrcStepper4"
            :done-icon="doneIconImgSrcStepper4"
            :done="step > 4"
            :header-nav="step > 4"
            class="bg-white q-mt-lg"
            data-cy="step-4"
          >
            <q-form ref="stepCompanyRef">
              <form-select-organization />
            </q-form>
            <q-stepper-navigation>
              <div class="flex justify-end">
                <q-btn
                  unelevated
                  rounded
                  outline
                  @click="onBack"
                  color="primary"
                  :label="$t('navigation.back')"
                  data-cy="step-4-back"
                />
                <q-btn
                  unelevated
                  rounded
                  color="primary"
                  :label="$t('navigation.continue')"
                  @click="onContinue"
                  class="q-ml-sm"
                  data-cy="step-4-continue"
                />
              </div>
              <div
                class="flex items-center gap-8 q-mt-md"
                data-cy="step-4-info"
              >
                <q-icon name="info" size="18px" color="primary" />
                <p class="q-mt-none q-mb-none text-caption text-grey-7">
                  {{ $t('form.company.textCoordinator') }}
                </p>
              </div>
            </q-stepper-navigation>
          </q-step>
          <!-- Step: Team -->
          <q-step
            :name="5"
            :title="$t('register.challenge.titleStepTeam')"
            :icon="iconImgSrcStepper5"
            :active-icon="activeIconImgSrcStepper5"
            :done-icon="doneIconImgSrcStepper5"
            :done="step > 5"
            :header-nav="step > 5"
            class="bg-white q-mt-lg"
            data-cy="step-5"
          >
            <q-form ref="stepTeamRef">
              <form-select-team data-cy="form-select-team" />
            </q-form>
            <q-stepper-navigation class="flex justify-end">
              <q-btn
                unelevated
                rounded
                outline
                @click="onBack"
                color="primary"
                :label="$t('navigation.back')"
                data-cy="step-5-back"
              />
              <q-btn
                unelevated
                rounded
                color="primary"
                :label="$t('navigation.continue')"
                @click="onContinue"
                class="q-ml-sm"
                data-cy="step-5-continue"
              />
            </q-stepper-navigation>
          </q-step>
          <!-- Step: Merch -->
          <q-step
            :name="6"
            :title="$t('register.challenge.titleStepMerch')"
            :icon="iconImgSrcStepper6"
            :active-icon="activeIconImgSrcStepper6"
            :done-icon="doneIconImgSrcStepper6"
            :done="step > 6"
            :header-nav="step > 6"
            class="bg-white q-mt-lg"
            data-cy="step-6"
          >
            <q-form ref="stepMerchRef">
              <form-field-list-merch />
            </q-form>
            <q-stepper-navigation class="flex justify-end">
              <q-btn
                unelevated
                rounded
                outline
                @click="onBack"
                color="primary"
                :label="$t('navigation.back')"
                data-cy="step-6-back"
              />
              <q-btn
                unelevated
                rounded
                color="primary"
                :disable="!merchId"
                :label="$t('navigation.continue')"
                @click="onContinue"
                class="q-ml-sm"
                data-cy="step-6-continue"
              />
            </q-stepper-navigation>
          </q-step>
          <!-- Step: Summary -->
          <q-step
            :name="7"
            :title="$t('register.challenge.titleStepSummary')"
            :icon="iconImgSrcStepper7"
            :active-icon="activeIconImgSrcStepper7"
            :done-icon="doneIconImgSrcStepper7"
            :done="step > 7"
            :header-nav="step > 7"
            class="bg-white q-mt-lg"
            data-cy="step-7"
          >
            <q-banner
              v-if="isShownRegistrationWaitingMessage"
              class="bg-warning text-grey-10 q-mb-md"
              :style="{ borderRadius }"
              data-cy="step-7-registration-waiting-message"
            >
              {{
                $t('register.challenge.textRegistrationWaitingForConfirmation')
              }}
            </q-banner>
            <!-- Content: Summary -->
            <register-challenge-summary />
            <!-- Buttons: Summary -->
            <q-stepper-navigation class="flex justify-end">
              <!-- Button: Back -->
              <q-btn
                unelevated
                rounded
                outline
                @click="onBack"
                color="primary"
                :label="$t('navigation.back')"
                data-cy="step-7-back"
              />
              <!-- Button: Complete registration -->
              <q-btn
                unelevated
                rounded
                color="primary"
                :disable="!isRegistrationComplete"
                :label="$t('form.buttonCompleteRegistration')"
                @click="onCompleteRegistration"
                class="q-ml-sm"
                data-cy="step-7-continue"
              />
            </q-stepper-navigation>
          </q-step>
        </q-stepper>
      </div>
    </div>
  </q-page>
</template>

<style scoped lang="scss">
// hide vertical line between steps
:deep(.q-stepper--vertical .q-stepper__dot:before),
:deep(.q-stepper--vertical .q-stepper__dot:after) {
  display: none;
}
// add rounded corners
:deep(.q-stepper__step) {
  border-radius: 16px;
}
// override step padding
:deep(.q-stepper__tab) {
  padding: 24px 24px;
}
:deep(.q-stepper__step-inner) {
  padding: 8px 24px 24px;
}
// override separate rule for last step padding
:deep(.q-stepper--vertical .q-stepper__step:last-child .q-stepper__step-inner) {
  padding-bottom: 24px;
}
// larger step dot (number)
:deep(.q-stepper__dot) {
  font-size: 38px;
  width: 38px;
  height: 38px;
  max-width: 38px;
  background-color: #fff;
  margin-right: 16px;
}
// larger step title
:deep(.q-stepper__title) {
  color: $grey-10;
  font-size: 16px;
  font-weight: 700;
}
:deep(.q-stepper__tab--done) {
  padding-right: 48px;
}
:deep(.q-stepper__tab--done:after) {
  content: '';
  position: absolute;
  background-image: url('../assets/svg/edit.svg');
  width: 24px;
  height: 24px;
  right: 24px;
}
</style>
