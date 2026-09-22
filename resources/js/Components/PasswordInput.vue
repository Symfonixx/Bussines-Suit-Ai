<template>
    <div class="input-box password-input-box">
        <input
            :id="id"
            :value="modelValue"
            :type="showPassword ? 'text' : 'password'"
            :name="name"
            class="style-large"
            :class="inputClass"
            :placeholder="placeholder"
            :disabled="disabled"
            :required="required"
            :autocomplete="autocomplete"
            @input="emit('update:modelValue', $event.target.value)"
        >
        <button
            type="button"
            class="password-input-box__toggle"
            :aria-label="showPassword ? hideLabel : showLabel"
            :aria-pressed="showPassword"
            :disabled="disabled"
            @click="showPassword = !showPassword"
        >
            {{ showPassword ? hideText : showText }}
        </button>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { usePage } from '@inertiajs/vue3';

defineProps({
    modelValue: { type: String, default: '' },
    id: { type: String, default: '' },
    name: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    autocomplete: { type: String, default: '' },
    inputClass: { type: [String, Object, Array], default: '' },
    showLabel: { type: String, default: 'Show password' },
    hideLabel: { type: String, default: 'Hide password' },
});

const emit = defineEmits(['update:modelValue']);
const page = usePage();
const showPassword = ref(false);

const trans = (key) => page.props.translations?.[key] || key;
const showText = computed(() => trans('Show'));
const hideText = computed(() => trans('Hide'));
</script>
