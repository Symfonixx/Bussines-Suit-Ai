<template>
    <Head>
        <title>{{ metaTitle }}</title>
        <meta name="description" :content="metaDescription">
        <meta name="robots" content="noindex, nofollow">
    </Head>

    <AuthShell
        :title="trans('Two-Factor Authentication')"
        :subtitle="trans('Please confirm access to your account by entering the authentication code provided by your authenticator application.')"
    >
        <form @submit.prevent="submit">
            <div v-if="!useRecoveryCode" class="form-group">
                <div class="input-box">
                    <input
                        v-model="form.code"
                        type="text"
                        class="style-large"
                        inputmode="numeric"
                        autocomplete="one-time-code"
                        :placeholder="trans('Authentication Code')"
                        :disabled="form.processing"
                        required
                        autofocus
                    >
                </div>
                <div v-if="form.errors.code" class="field-error">{{ form.errors.code }}</div>
            </div>

            <div v-else class="form-group">
                <div class="input-box">
                    <input
                        v-model="form.recovery_code"
                        type="text"
                        class="style-large"
                        autocomplete="one-time-code"
                        :placeholder="trans('Recovery Code')"
                        :disabled="form.processing"
                        required
                        autofocus
                    >
                </div>
                <div v-if="form.errors.recovery_code" class="field-error">{{ form.errors.recovery_code }}</div>
            </div>

            <div class="text-center mb-3">
                <button
                    type="button"
                    class="btn-link"
                    :disabled="form.processing"
                    @click="toggleRecovery"
                >
                    {{ useRecoveryCode ? trans('Use an authentication code') : trans('Use a recovery code') }}
                </button>
            </div>

            <div class="auth-page__actions">
                <button
                    class="thm-btn"
                    type="submit"
                    :disabled="form.processing"
                >
                    <span>{{ form.processing ? trans('Signing In...') : trans('Login') }}</span>
                </button>
            </div>
        </form>
    </AuthShell>
</template>

<script>
import { computed, ref } from 'vue'
import { usePage, useForm, Head } from '@inertiajs/vue3'
import AuthShell from '@/Components/AuthShell.vue'

export default {
    components: {
        AuthShell,
        Head,
    },
    setup() {
        const page = usePage()
        const useRecoveryCode = ref(false)

        const seo = computed(() => page.props.seo)
        const meta = computed(() => page.props.meta || {})
        const trans = (key) => page.props.translations?.[key] || key

        const metaTitle = computed(() => `${trans('Two-Factor Authentication')} | ${seo.value.website_name || ''}`.trim())
        const metaDescription = computed(() => {
            return meta.value.description || trans('Please confirm access to your account by entering the authentication code provided by your authenticator application.')
        })

        const form = useForm({
            code: '',
            recovery_code: '',
        })

        const toggleRecovery = () => {
            useRecoveryCode.value = !useRecoveryCode.value
            form.code = ''
            form.recovery_code = ''
            form.clearErrors()
        }

        const submit = () => {
            form.post(route('two-factor.login.store'), {
                preserveScroll: true,
            })
        }

        return {
            form,
            trans,
            metaTitle,
            metaDescription,
            useRecoveryCode,
            toggleRecovery,
            submit,
        }
    },
}
</script>
