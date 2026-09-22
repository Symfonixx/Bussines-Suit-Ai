<template>
    <app-layout>
        <PageTitle :title="title" />
        <section class="auth-page">
            <div class="container">
                <div class="auth-page__panel wow fadeInUp">
                    <div class="auth-page__header">
                        <h1 class="auth-page__title font-3">{{ title }}</h1>
                        <p v-if="subtitle" class="auth-page__subtitle text-main-2">{{ subtitle }}</p>
                    </div>

                    <div
                        v-if="successMessage"
                        class="auth-flash auth-flash--success"
                        role="alert"
                    >
                        {{ successMessage }}
                    </div>
                    <div
                        v-if="errorMessage"
                        class="auth-flash auth-flash--error"
                        role="alert"
                    >
                        {{ errorMessage }}
                    </div>

                    <div class="auth-page__body">
                        <slot />
                    </div>

                    <div v-if="$slots.footer" class="auth-page__footer">
                        <slot name="footer" />
                    </div>
                </div>
            </div>
        </section>
    </app-layout>
</template>

<script setup>
import AppLayout from '@/Layouts/App.vue'
import PageTitle from '@/Components/PageTitle.vue'

defineProps({
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    successMessage: { type: String, default: '' },
    errorMessage: { type: String, default: '' },
})
</script>
