<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl">{{ action }}</h1>
      <router-link :to="{ name: 'ViewBoard', params: { id: route.params.id } }">❌ cancel</router-link>
    </div>

    <AlertMessage v-if="error" type="error" :message="error" />

    <form class="flex flex-col gap-2" @submit.prevent @keydown.enter.prevent>
      <div class="form-group">
        <label>Text</label>
        <textarea
          v-model="text"
          class="sticky-note"
          style="background-color: white"
          rows="4"
          placeholder="Enter card text..."
        />
      </div>

      <div class="form-group">
        <label>Details</label>
        <input type="text" v-model="details" />
      </div>

      <div class="form-group">
        <label>Label</label>
        <input type="text" v-model="label" class="mb-2" />
        <n-tag v-if="label" size="small" round :color="labelColor">
          {{ label }}
        </n-tag>
      </div>

      <div class="flex flex-wrap md:flex-nowrap md:space-x-4">
        <div class="form-group md:max-w-1/2">
          <label>Text Color</label>
          <div class="grid grid-cols-5 gap-2 py-1">
            <button v-for="c in getTextColors" :key="c" @click.prevent="setTextColor(c)">
              <div
                :style="`background-color: ${c};`"
                class="color-btn f-center"
                :class="c === Color.light ? 'border-1 border-black' : ''"
              >
                <i-icomoon-free-checkmark
                  v-show="c === text_color"
                  :class="text_color === Color.dark ? 'text-white' : 'text-black'"
                />
              </div>
            </button>
            <!-- <button>
              <div class="color-btn border f-center">
                <i-eva-color-picker-fill class="text-xl" />
              </div>
            </button> -->
          </div>
        </div>

        <div class="form-group md:max-w-1/2">
          <label>Label Color</label>
          <div class="grid grid-cols-5 gap-2 py-1">
            <button v-for="c in getColors" :key="c" @click.prevent="setColor(c)">
              <div
                :style="`background: ${c};`"
                class="color-btn f-center"
                :class="c === Color.light ? 'border-1 border-black' : ''"
              >
                <i-icomoon-free-checkmark
                  v-show="c === color"
                  :class="color === Color.dark ? 'text-white' : 'text-black'"
                />
              </div>
            </button>
            <!-- <button>
              <div class="color-btn border f-center">
                <i-eva-color-picker-fill class="text-xl" />
              </div>
            </button> -->
          </div>
        </div>
      </div>
    </form>

    <div class="actions w-full flex items-center justify-end gap-2 capitalize my-4">
      <button button="button" @click="submitForm" class="btn border" :disabled="isLoading">💾 {{ action }}</button>
      <InPlaceConfirmDelete v-if="isEdit" :onDelete="deleteCard" css="inline-block" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, reactive, toRefs, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import tinycolor from 'tinycolor2';

import { Color, Card, NTagColor, Board } from '@/data/types/mock';
import { db } from '@/use/db';
import AlertMessage from '@/components/shared/AlertMessage.vue';
import InPlaceConfirmDelete from '@/components/ui/ConfirmDeleteInline.vue';

export default defineComponent({
  name: 'CardForm',
  props: {
    data: {
      type: Object as PropType<Board>,
    },
  },
  components: { AlertMessage, InPlaceConfirmDelete },
  setup() {
    const { t } = useI18n();
    const route = useRoute();
    const router = useRouter();
    const toast = useToast();
    const {
      data: { board },
      getById,
    } = db.boards;
    const { sort } = db.lists;
    const { data: store, add, update, del } = db.cards;

    onMounted(async () => {
      // TODO: need to use state management for props.board bc its not updated when list/card values are
      // if (props?.data?.id === Number(route.params.id)) return (state.board = props.data);
      await getById(Number(route.params.id));
    });

    const getColors = [
      Color.blue,
      Color.purple,
      Color.mint,
      Color.yellow,
      Color.red,
      Color.light,
      Color.gray,
      Color.dark,
    ];

    const getTextColors = [Color.dark, Color.light];

    const setColor = (color: Color) => {
      if (color === Color.dark) {
        setTextColor(Color.light);
      } else {
        setTextColor(Color.dark);
      }
      form.color = color;
    };

    const setTextColor = (color: Color) => {
      form.text_color = color;
    };

    const labelColor = computed(() => {
      const c = {} as NTagColor;
      c.color = tinycolor(form.color).setAlpha(0.2);
      c.borderColor = form.color;
      c.textColor = tinycolor(form.color).darken(50).toString();

      return c;
    });

    const form = reactive<Card>({
      //position: 0,
      text: '',
      audio_url: '',
      details: '',
      label: '',
      color: getColors[3],
      text_color: getTextColors[0],
      //assigned_to: ''
    });

    const list = computed(() => board?.lists?.find((l) => l.id === Number(route.params.listId)));

    const edit = computed(() => list.value?.cards?.find((c) => c.id === Number(route.params.cardId)));

    const action = computed(() => (!!edit.value ? t('edit_card') : t('add_card')));

    function setFields() {
      if (!!edit.value) {
        const { text, label, details, color, text_color } = edit.value;

        form.text = text;
        form.details = details;
        form.label = label;
        form.color = color;
        form.text_color = text_color;
      }
    }
    watch(
      () => edit.value,
      (card) => {
        if (card) setFields();
      },
      { immediate: true }
    );

    function reset() {
      form.text = '';
      // form.audio_url= '';
      form.details = '';
      form.label = '';
      form.color = getColors[3];
      form.text_color = getTextColors[0];
      //form.assigned_to= '';
    }

    async function deleteCard() {
      if (!!edit.value) {
        const success = await del(edit.value);
        if (success) {
          await sort(list.value!);
          router.push({ name: 'ViewBoard', params: { id: route.params.id } });
          toast.success(t('card_deleted'));
        }
      }
    }

    function isValid() {
      return !!form.text;
    }
    async function submitForm() {
      if (isValid()) {
        if (!!edit.value) {
          await update({ ...edit.value, ...form });
        } else {
          await add(list.value!, { ...form, position: list.value?.cards?.length });
        }
      }
      router.push({ name: 'ViewBoard', params: { id: route.params.id } });
      reset();
    }

    return {
      t,
      Color,
      getColors,
      getTextColors,
      setColor,
      setTextColor,
      labelColor,
      ...toRefs(store),
      ...toRefs(form),
      action,
      route,
      isEdit: !!edit.value,
      submitForm,
      deleteCard,
    };
  },
});
</script>

<style scoped>
.color-btn {
  @apply h-10 w-10 rounded-full;
}
</style>
