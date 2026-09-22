<template>
    <div class="sect-header">
        <div class="container">
            <div class="s-meta text-caption font-2">
                <p class="s-number_order wg-counter">
                    [
                    <span class="text-white">0<span class="odometer" :data-number="number">0</span></span>
                    / {{ String(total).padStart(2, '0') }} ]
                </p>
                <p class="s-label">[ <span class="text-white hacker-text_transform">{{ label }}</span> ]</p>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    number: { type: [Number, String], required: true },
    total: { type: [Number, String], default: 8 },
    label: { type: String, required: true },
})
</script>
