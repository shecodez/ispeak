<template>
  <div class="relative" :class="css">
    <img v-if="src" :src="src" alt="Avatar" class="rounded-full" :class="size" />
    <span v-else class="f-center font-bold rounded-full bg-gray-400" :class="size">
      {{ username?.charAt(0) }}
    </span>

    <div v-if="allowUpload" :class="size" class="h-0">
      <label class="absolute top-0 right-0 font-bold cursor-pointer" for="single">
        {{ uploading ? t('uploading') : t('upload') }}
      </label>
      <input
        class="invisible absolute"
        type="file"
        id="single"
        accept="image/*"
        @change="uploadAvatar($event)"
        :disabled="uploading"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { supabase } from '@/lib/supabase';

export default defineComponent({
  props: {
    size: {
      type: String,
      default: 'w-12 h-12',
    },
    allowUpload: {
      type: Boolean,
      default: false,
    },
    username: String,
    path: String,
    css: String,
  },
  emits: ['upload', 'update:path'],
  setup(props, { emit }) {
    const { t } = useI18n();

    const { path } = toRefs(props);
    const state = reactive({
      src: '',
      uploading: false,
      error: null,
    });
    const files = ref();
    onMounted(() => downloadImage());

    const downloadImage = async () => {
      try {
        const { data, error } = await supabase.storage.from('avatars').download(path.value || '');
        if (error) throw error;

        state.src = URL.createObjectURL(data);
      } catch (e: any) {
        state.error = e.error_description || e.message;
        console.error('Error downloading image: ', e.message);
      }
    };

    const uploadAvatar = async (evt: any) => {
      files.value = evt.target.files;
      try {
        state.uploading = true;
        if (!files.value || files.value.length === 0) {
          throw new Error('You must select an image to upload.');
        }

        const file = files.value[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${props.username}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;
        let { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
        if (uploadError) throw uploadError;

        emit('update:path', filePath);
        emit('upload', filePath);
      } catch (e: any) {
        state.error = e.error_description || e.message;
        alert(e.message);
      } finally {
        state.uploading = false;
      }
    };

    watch(path, () => {
      path.value ? downloadImage() : '';
    });

    return {
      t,
      path,
      ...toRefs(state),
      files,
      uploadAvatar,
    };
  },
});
</script>
