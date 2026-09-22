<template>
    <Head>
        <title>{{ metaTitle }}</title>
        <meta name="description" :content="metaDescription">
        <meta name="keywords" :content="metaKeywords">
        <meta name="robots" :content="metaRobots">
        <link v-if="metaCanonical" rel="canonical" :href="metaCanonical">
        <meta property="og:title" :content="metaTitle">
        <meta property="og:description" :content="metaDescription">
        <meta v-if="metaImage" property="og:image" :content="metaImage">
        <meta v-if="metaCanonical" property="og:url" :content="metaCanonical">
        <meta property="og:type" content="website">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" :content="metaTitle">
        <meta name="twitter:description" :content="metaDescription">
        <meta v-if="metaImage" name="twitter:image" :content="metaImage">
    </Head>

    <AuthShell
        :title="trans('Reset Your Password')"
        :subtitle="trans('Enter your email and we will send you a reset link.')"
        :success-message="flash.success ? formatError(flash.success) : ''"
        :error-message="flash.error ? formatError(flash.error) : ''"
    >
        <form id="forgot-password-form" @submit.prevent="submit">
            <div class="form-group">
                <div class="input-box">
                    <input
                        id="email"
                        v-model="form.email"
                        type="email"
                        name="email"
                        class="style-large"
                        :class="{ error: fieldErrors.email }"
                        autocomplete="email"
                        :placeholder="trans('Email')"
                        :disabled="form.processing"
                        required
                    >
                </div>
                <div v-if="fieldErrors.email" class="field-error">{{ formatError(fieldErrors.email) }}</div>
            </div>

            <div class="auth-page__actions">
                <button
                    class="thm-btn"
                    type="submit"
                    :disabled="form.processing"
                >
                    <span>{{ form.processing ? trans('Sending...') : trans('Send Email Verification') }}</span>
                </button>
            </div>
        </form>

        <template #footer>
            <p>
                <Link :href="route('login')">{{ trans('Back to Login') }}</Link>
            </p>
        </template>
    </AuthShell>
</template>

<script>
import { computed } from 'vue'
import { usePage, Link, useForm, Head } from '@inertiajs/vue3'
import AuthShell from '@/Components/AuthShell.vue'

export default {
    components: {
        AuthShell, Link, Head
    },
    props: {
        errors: Object
    },
    setup() {
        const page = usePage()

        const seo = computed(() => page.props.seo)
        const settings = computed(() => page.props.settings || {})
        const flash = computed(() => page.props.flash || {})
        const meta = computed(() => page.props.meta || {})
        const trans = (key) => page.props.translations?.[key] || key

        const formatError = (error) => {
            if (!error) {
                return ''
            }

            if (Array.isArray(error)) {
                return error.map(formatError).filter(Boolean).join(' ')
            }

            const authErrors = {
                'passwords.reset': trans('Your password has been reset.'),
                'passwords.sent': trans('We have emailed your password reset link.'),
                'passwords.throttled': trans('Please wait before retrying.'),
                'passwords.token': trans('This password reset token is invalid.'),
                'passwords.user': trans("We can't find a user with that email address."),
            }

            return authErrors[error] || trans(error) || error
        }

        const form = useForm({
            email: '',
        })

        const fieldErrors = computed(() => ({
            ...(page.props.errors || {}),
            ...(form.errors || {}),
        }))

        const submit = () => {
            form.post(route('password.email'))
        }

        const metaTitle = computed(() => `${trans('Forgot Password')} | ${seo.value.website_name || ''}`.trim())
        const metaDescription = computed(() => meta.value.description || trans('Request a password reset link to regain access to your account.'))
        const metaKeywords = computed(() => meta.value.keywords || trans('forgot password, reset password, account recovery'))
        const metaImage = computed(() => meta.value?.og?.image || meta.value?.twitter?.image || settings.value?.meta_img || '')
        const metaCanonical = computed(() => meta.value.canonical || '')
        const metaRobots = computed(() => meta.value.robots || 'noindex, nofollow')

        return {
            form,
            trans,
            formatError,
            fieldErrors,
            submit,
            flash,
            metaTitle,
            metaDescription,
            metaKeywords,
            metaImage,
            metaCanonical,
            metaRobots
        }
    }
}
</script>
