<script lang="ts">
/**
 * CountdownEvent Component
 *
 * The `CountdownEvent` component provides a countdown mechanism that
 * displays the remaining time until a specified event or release date.
 *
 * @description
 * This component calculates the time difference between the current date
 * and a given release date, displaying the days, hours, minutes, and seconds
 * remaining. It also provides a mechanism for formatting the release date
 * based on the user's locale.
 *
 * @props
 * - `releaseDate` (String, required): The target date for the countdown.
 *   This date is expected to be in a specific format.
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6021%3A22974&mode=dev)
 *
 * @example
 * <countdown-event :releaseDate="targetDate" />
 */

import { colors, date } from 'quasar';
import { defineComponent } from 'vue';
// import { useI18n } from 'vue-i18n'

// composables
import { useCountdown } from '../../composables/useCountdown';

// config
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';

const { formatDate } = date;

export default defineComponent({
  name: 'CountdownEvent',
  props: {
    releaseDate: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const fontSize = '48px';
    const { countdown } = useCountdown(props.releaseDate);

    // colors
    const { getPaletteColor, changeAlpha } = colors;
    const secondary = getPaletteColor('secondary');
    const secondaryOpacity = changeAlpha(
      secondary,
      rideToWorkByBikeConfig.colorSecondaryBackgroundOpacity,
    );

    const borderRadius = rideToWorkByBikeConfig.borderRadiusCard;

    // currently not working see https://github.com/intlify/vue-i18n-next/issues/1193
    // const { locale } = useI18n({ useScope: 'global' })
    let formatString = 'D. M.';
    // if (locale.value === 'en') {
    //   formatString = 'D MMM';
    // }
    const formattedDate = formatDate(new Date(props.releaseDate), formatString);

    if (window.Cypress) {
      window.countdownEvent = { fontSize: fontSize };
    }

    return {
      borderRadius,
      secondaryOpacity,
      countdown,
      formattedDate,
      fontSize,
    };
  },
});
</script>

<template>
  <q-card
    flat
    class="row items-center justify-evenly q-py-xl"
    :style="{
      borderRadius,
      backgroundColor: secondaryOpacity,
    }"
    data-cy="card"
  >
    <div class="text-center">
      <!-- Title -->
      <div
        class="text-body1 text-weight-bold text-grey-10 q-px-lg"
        data-cy="title"
      >
        {{ $t('index.countdown.title', { date: formattedDate }) }}
      </div>
      <!-- Countdown -->
      <div class="row items-center justify-evenly q-mt-md">
        <!-- Days -->
        <div class="q-px-md">
          <div
            class="text-primary text-weight-bold"
            :style="{ 'font-size': fontSize }"
            data-cy="countdown-days"
          >
            {{ countdown.days }}
          </div>
          <div class="q-mt-xs text-grey-8" data-cy="countdown-label-days">
            {{ $t('index.countdown.days') }}
          </div>
        </div>
        <!-- Hours -->
        <div class="q-px-md">
          <div
            class="text-primary text-weight-bold"
            :style="{ 'font-size': fontSize }"
            data-cy="countdown-hours"
          >
            {{ countdown.hours }}
          </div>
          <div class="q-mt-xs text-grey-8" data-cy="countdown-label-hours">
            {{ $t('index.countdown.hours') }}
          </div>
        </div>
        <!-- Minutes -->
        <div class="q-px-md">
          <div
            class="text-primary text-weight-bold"
            :style="{ 'font-size': fontSize }"
            data-cy="countdown-minutes"
          >
            {{ countdown.minutes }}
          </div>
          <div class="q-mt-xs text-grey-8" data-cy="countdown-label-minutes">
            {{ $t('index.countdown.minutes') }}
          </div>
        </div>
        <!-- Seconds -->
        <div class="q-px-md">
          <div
            class="text-primary text-weight-bold"
            :style="{ 'font-size': fontSize }"
            data-cy="countdown-seconds"
          >
            {{ countdown.seconds }}
          </div>
          <div class="q-mt-xs text-grey-8" data-cy="countdown-label-seconds">
            {{ $t('index.countdown.seconds') }}
          </div>
        </div>
      </div>
    </div>
  </q-card>
</template>

<style scoped lang="scss"></style>
