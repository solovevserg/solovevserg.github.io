<script setup lang="ts">
defineProps<{ size?: number }>()
</script>

<template>
    <svg
        :width="size ?? 16"
        :height="size ?? 16"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
    >
        <path
            d="M8 5.14v13.72a.5.5 0 0 0 .76.43l11.02-6.86a.5.5 0 0 0 0-.86L8.76 4.71a.5.5 0 0 0-.76.43z"
        />
    </svg>
</template>
