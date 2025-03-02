<script lang="ts">
/**
 * LanguageSwitcher Component
 *
 * The `LanguageSwitcher` component provides an interface for users to switch
 * between different languages available in the application.
 *
 * Note: This component is commonly used in `FooterBar` and in header sections.
 *
 * @description
 * This component renders a list of available languages and allows users to
 * switch their preferred language. It uses the `$i18n` global property to
 * manage and retrieve the current language and available translations.
 *
 * @props
 * - `variant`: Controls color and backdrop of buttons.
 *
 * @example
 * <language-switcher />
 *
 * @see
 * [Figma Design: Variant Dark](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=4858%3A105614&mode=dev)
 * [Figma Design: Variant Light](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6269%3A24797&mode=dev)
 */

// libraries
import { defineComponent } from 'vue';
import { i18n } from '../../boot/i18n';

export default defineComponent({
  name: 'LanguageSwitcher',
  props: {
    variant: {
      type: String as () => 'dark' | 'light',
      default: 'dark',
    },
  },
  setup(props) {
    const isActive = (item: string): boolean => {
      return i18n.global.locale === item;
    };

    const getButtonClasses = (item: string): string => {
      // Default black variant
      let baseCssClass = 'bg-grey-10 text-white';
      let extendedCssClass = isActive(item)
        ? `text-bold ${baseCssClass}`
        : baseCssClass;
      // Light variant
      if (props.variant === 'light') {
        baseCssClass = 'text-primary text-bold';
        extendedCssClass = isActive(item)
          ? `bg-secondary ${baseCssClass}`
          : `bg-white ${baseCssClass}`;
      }
      return extendedCssClass;
    };

    return {
      isActive,
      getButtonClasses,
    };
  },
});
</script>

<template>
  <ul
    class="language-list flex items-center text-subtitle1 gap-4"
    :class="{ 'q-pa-xs bg-white': variant === 'light' }"
  >
    <!-- Language switcher items -->
    <li
      v-for="item in Object.keys($i18n.messages)"
      :key="item"
      class="text-uppercase"
      :data-cy="'switcher-' + item"
    >
      <q-btn
        unelevated
        round
        @click.prevent="$i18n.locale = item"
        :class="getButtonClasses(item)"
        size="13px"
        :data-cy="'switcher-button-' + item"
      >
        {{ item }}
      </q-btn>
    </li>
  </ul>
</template>

<style scoped>
.language-list {
  list-style: none;
  font-size: 14px;
  border-radius: 999px;
}
</style>
