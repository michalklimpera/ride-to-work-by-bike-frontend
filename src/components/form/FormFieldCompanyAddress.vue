<script lang="ts">
/**
 * FormFieldCompanyAddress Component
 *
 * The `FormFieldCompanyAddress`
 *
 * @description * Use this component to render address selection field.
 *
 * Note: This component is commonly used in `RegisterChallengePage`.
 *
 * @props
 * - `modelValue` (number|null): the number representing address.
 *
 *
 * @events
 * - `update:modelValue`: Emitted as a part of v-model structure.
 *
 * @components
 * - `DialogDefault`: Component to render a dialog window.
 *
 * @example
 * <form-field-company-address />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6485%3A29568&mode=dev)
 */

// libraries
import { QForm } from 'quasar';
import { computed, defineComponent, inject, onMounted, ref, watch } from 'vue';

// adapters
import { subsidiaryAdapter } from 'src/adapters/subsidiaryAdapter';

// components
import DialogDefault from 'src/components/global/DialogDefault.vue';
import FormAddSubsidiary from 'src/components/form/FormAddSubsidiary.vue';

// composables
import { useValidation } from 'src/composables/useValidation';
import { useApiPostSubsidiary } from '../../composables/useApiPostSubsidiary';

// stores
import { useRegisterChallengeStore } from 'src/stores/registerChallenge';

// types
import type { FormCompanyAddressFields } from 'src/components/types/Form';
import type { Logger } from 'src/components/types/Logger';
import type { OrganizationSubsidiary } from 'src/components/types/Organization';

// utils
import { deepObjectWithSimplePropsCopy } from '../../utils';

const addressNewEmpty = {
  street: '',
  houseNumber: '',
  city: '',
  zip: '',
  cityChallenge: null,
  department: '',
};

export default defineComponent({
  name: 'FormFieldCompanyAddress',
  components: {
    FormAddSubsidiary,
    DialogDefault,
  },
  props: {
    modelValue: {
      type: Number as () => number | null,
      required: false,
      default: null,
    },
  },
  emits: ['update:modelValue', 'close:addSubsidiaryDialog'],
  setup(props, { emit }) {
    const formRef = ref<typeof QForm | null>(null);
    const logger = inject('vuejs3-logger') as Logger | null;

    const subsidiaryId = computed<number | null>({
      get: () => props.modelValue,
      set: (value: number | null) => emit('update:modelValue', value),
    });

    const addressNew = ref<FormCompanyAddressFields>(
      deepObjectWithSimplePropsCopy(
        addressNewEmpty,
      ) as FormCompanyAddressFields,
    );

    const store = useRegisterChallengeStore();

    const isLoadingSubsidiaries = computed(() => store.isLoadingSubsidiaries);
    const subsidiaries = computed(() => store.subsidiaries);

    const { isLoading: isLoadingCreateSubsidiary, createSubsidiary } =
      useApiPostSubsidiary(logger);
    const isLoading = computed(
      () => isLoadingSubsidiaries.value || isLoadingCreateSubsidiary.value,
    );
    /**
     * If organization ID is set, load subsidiaries.
     * This ensures, that options are loaded on page refresh.
     */
    onMounted(async () => {
      if (store.getOrganizationId) {
        logger?.info('Loading subsidiaries.');
        await store.loadSubsidiariesToStore(logger);
      } else {
        logger?.debug(
          `Organization was not selected <${store.getOrganizationId}>,` +
            ' subsidiaries was not loaded.',
        );
      }
    });

    const options = computed(() =>
      store.getSubsidiaries?.map((subsidiary) => ({
        label: subsidiaryAdapter.fromFormCompanyAddressFieldsToString(
          subsidiary.address,
        ),
        value: subsidiary.id,
      })),
    );

    const { isFilled } = useValidation();

    const { isDialogOpen, onClose } = useDialog();

    const onSubmit = async (): Promise<void> => {
      const isFormValid = await formRef.value?.validate();
      if (isFormValid && store.getOrganizationId) {
        logger?.info('Create subsidiary.');
        const data = await createSubsidiary(
          store.getOrganizationId,
          addressNew.value,
        );
        if (data?.id) {
          logger?.debug(
            `New subsidiary was created with data <${JSON.stringify(data, null, 2)}>.`,
          );
          // set subsidiary ID
          subsidiaryId.value = data.id;
          logger?.debug(`Subsidiary ID model set to <${subsidiaryId.value}>.`);
          // push new subsidiary to subsidiaries list
          const newSubsidiary: OrganizationSubsidiary = {
            id: data.id,
            address: {
              street: data.street,
              houseNumber: data.houseNumber,
              city: data.city,
              zip: data.zip,
              cityChallenge: data.cityChallenge,
              department: data.department,
            },
            teams: [],
          };
          subsidiaries.value.push(newSubsidiary);
        } else {
          logger?.error('New subsidiary ID not found.');
        }
        onClose();
      } else if (!isFormValid) {
        logger?.error('Form is not valid.');
      } else if (!store.getOrganizationId) {
        logger?.error('Organization was not choosed.');
        onClose();
      }
    };

    /**
     * Provides dialog behaviour
     * @returns {isDialogOpen, onClose}
     * - `isDialogOpen` (boolean): Whether the dialog is open.
     * - `onClose` (function): Runs when the dialog is closed.
     */
    function useDialog() {
      const isDialogOpen = ref<boolean>(false);

      const onClose = (): void => {
        if (formRef.value) {
          formRef.value.reset();
        }
        addressNew.value = deepObjectWithSimplePropsCopy(
          addressNewEmpty,
        ) as FormCompanyAddressFields;
        logger?.debug(
          `New address form reset to <${JSON.stringify(addressNew.value, null, 2)}>.`,
        );
        isDialogOpen.value = false;
        logger?.info('Close add subsidiary modal dialog.');
      };

      watch(isDialogOpen, (newValue) => {
        if (newValue === true && !store.getOrganizationId) {
          logger?.debug(
            `Add subsidiary dialog is open <${newValue}>,` +
              ` selected organization ID is <${store.getOrganizationId}>.`,
          );
          isDialogOpen.value = false;
          // Emit organization select widget validation processs event
          emit('close:addSubsidiaryDialog');
        }
      });

      return {
        isDialogOpen,
        onClose,
      };
    }

    return {
      subsidiaryId,
      addressNew,
      formRef,
      options,
      isDialogOpen,
      isFilled,
      isLoading,
      isLoadingCreateSubsidiary,
      onClose,
      onSubmit,
    };
  },
});
</script>

<template>
  <div data-cy="form-company-address">
    <div class="row q-mt-sm q-col-gutter-sm">
      <label
        for="form-company-address"
        class="col-12 text-caption text-bold text-grey-10"
        data-cy="form-company-address-label"
      >
        {{ $t('form.company.labelAddress') }}
      </label>
      <div class="col-12 col-sm" data-cy="col-input">
        <!-- Input: Autocomplete -->
        <q-select
          dense
          outlined
          emit-value
          map-options
          id="form-company-address"
          v-model="subsidiaryId"
          :hint="$t('form.company.hintAddress')"
          :options="options"
          :loading="isLoading"
          :rules="[
            (val) =>
              isFilled(val) ||
              $t('form.messageFieldRequired', {
                fieldName: $t('form.labelAddress'),
              }),
          ]"
          data-cy="form-company-address-input"
        >
          <!-- Item: No option -->
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                {{ $t('form.messageNoResult') }}
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div
        class="col-12 col-sm-auto flex items-start justify-end q-pl-md"
        style="margin-top: 2px"
        data-cy="col-button"
      >
        <!-- Button: Add company -->
        <q-btn
          flat
          rounded
          icon="mdi-plus"
          color="primary"
          @click.prevent="isDialogOpen = true"
          data-cy="button-add-address"
        >
          <!-- Label -->
          <span class="inline-block q-pl-xs">
            {{ $t('form.company.buttonAddAddress') }}
          </span>
        </q-btn>
      </div>
    </div>
  </div>
  <!-- Dialog: Add address -->
  <dialog-default v-model="isDialogOpen" data-cy="dialog-add-address">
    <template #title>
      {{ $t('form.company.titleAddAddress') }}
    </template>
    <template #content>
      <q-form ref="formRef">
        <p data-cy="add-subsidiary-text">
          {{ $t('form.company.textSubsidiaryAddress') }}
        </p>
        <form-add-subsidiary v-model="addressNew" />
      </q-form>
      <!-- Action buttons -->
      <div class="flex justify-end q-mt-sm">
        <div class="flex gap-8">
          <q-btn
            rounded
            unelevated
            outline
            color="primary"
            data-cy="dialog-button-cancel"
            :disable="isLoadingCreateSubsidiary"
            @click="onClose"
          >
            {{ $t('navigation.discard') }}
          </q-btn>
          <q-btn
            rounded
            unelevated
            color="primary"
            data-cy="dialog-button-submit"
            :loading="isLoadingCreateSubsidiary"
            :disable="isLoadingCreateSubsidiary"
            @click="onSubmit"
          >
            {{ $t('form.company.buttonAddSubsidiary') }}
          </q-btn>
        </div>
      </div>
    </template>
  </dialog-default>
</template>
