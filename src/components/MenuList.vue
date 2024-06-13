<template>
  <div class="flex flex-col space-y-1 bg-white p-4">
    <MenuItem @click="handleClose" link="/" icon="man" title="menu.top" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import MenuItem from "@/components/MenuItem.vue";

const emitClose = "close-menu";

export default defineComponent({
  emits: [emitClose],
  components: {
    MenuItem,
  },
  setup(_, ctx) {
    const handleClose = () => {
      ctx.emit(emitClose);
    };
    return {
      handleClose,
    };
  },
});
</script>
