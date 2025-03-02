<script lang="ts">
/**
 * ListCardFollow Component
 *
 * The `ListCardFollow` component renders a list of cards that represent
 * various follow options or channels.
 *
 * @description
 * This component takes an array of card items and displays each card using
 * the `CardFollow` component. Items are displayed in 3 col grid.
 *
 * @props
 * - `cards` (Array of CardFollowType, required): An array of card items to be
 *   displayed. Each item is of type `CardFollowType`.
 *
 * @components
 * - `CardFollow`: Component to render individual follow cards.
 * - `SectionHeading`: Component to render a heading.
 *
 * @example
 * <list-card-follow :cards="followList" />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A105627&mode=dev)
 */

// libraries
import { defineComponent } from 'vue';

// components
import CardFollow from './CardFollow.vue';
import SectionHeading from '../global/SectionHeading.vue';

// types
import { CardFollow as CardFollowType } from '../types';

export default defineComponent({
  name: 'ListCardFollow',
  components: {
    CardFollow,
    SectionHeading,
  },
  props: {
    cards: {
      type: Array as () => CardFollowType[],
      required: true,
    },
  },
});
</script>

<template>
  <div>
    <!-- Title -->
    <div data-cy="card-list-follow-col-title" class="q-mb-md">
      <section-heading>
        {{ $t('index.cardListFollow.title') }}
      </section-heading>
    </div>
    <div class="row q-col-gutter-lg items-center" data-cy="card-list-follow">
      <!-- List of folow cards -->
      <div
        v-for="(card, index) in cards"
        :key="card.title"
        class="col-12 col-sm-6"
        data-cy="card-list-follow-item"
      >
        <card-follow
          :card="card"
          :data-cy="`card-list-follow-item-${index + 1}`"
        />
      </div>
    </div>
  </div>
</template>
