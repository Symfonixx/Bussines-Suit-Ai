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
        :title="trans('Set New Password')"
        :subtitle="trans('Choose a strong password you have not used before.')"
        :success-message="flash.success ? formatError(flash.success) : ''"
        :error-message="bannerError ? formatError(bannerError) : ''"
    >
        <form id="reset-password-form" @submit.prevent="submit">
            <input v-model="form.token" name="token" type="hidden">

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

            <div class="form-group">
                <PasswordInput
                    id="password"
                    v-model="form.password"
                    name="password"
                    :placeholder="trans('Password')"
                    :disabled="form.processing"
                    autocomplete="new-password"
                    :show-label="trans('Show password')"
                    :hide-label="trans('Hide password')"
                    required
                />
                <div v-if="fieldErrors.password" class="field-error">{{ formatError(fieldErrors.password) }}</div>
            </div>

            <div class="form-group">
                <PasswordInput
                    id="password_confirmation"
                    v-model="form.password_confirmation"
                    name="password_confirmation"
                    :placeholder="trans('Confirm Password')"
                    :disabled="form.processing"
                    autocomplete="new-password"
                    :show-label="trans('Show password')"
                    :hide-label="trans('Hide password')"
                    required
                />
                <div v-if="fieldErrors.password_confirmation" class="field-error">{{ formatError(fieldErrors.password_confirmation) }}</div>
            </div>

            <div class="auth-page__actions">
                <button
                    class="thm-btn"
                    type="submit"
                    :disabled="form.processing"
                >
                    <span>{{ form.processing ? trans('Resetting...') : trans('Reset Password') }}</span>
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
import PasswordInput from '@/Components/PasswordInput.vue'

const readQueryParam = (name) => {
    if (typeof window === 'undefined') {
        return ''
    }

    return new URLSearchParams(window.location.search).get(name) || ''
}

const readTokenFromPath = () => {
    if (typeof window === 'undefined') {
        return ''
    }

    const match = window.location.pathname.match(/\/reset-password\/(.+)$/)

    return match ? decodeURIComponent(match[1]) : ''
}

export default {
    components: {
        AuthShell, Link, Head, PasswordInput
    },
    props: {
        errors: Object,
        email: { type: String, default: '' },
        token: { type: String, default: '' },
    },
    setup(props) {
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
            email: props.email || readQueryParam('email'),
            password: '',
            password_confirmation: '',
            token: props.token || readQueryParam('token') || readTokenFromPath(),
        })

        const fieldErrors = computed(() => ({
            ...(page.props.errors || {}),
            ...(form.errors || {}),
        }))

        const bannerError = computed(() => flash.value.error || fieldErrors.value.token || '')

        const submit = () => {
            form.post(route('password.update'))
        }

        const metaTitle = computed(() => `${trans('Reset Password')} | ${seo.value.website_name || ''}`.trim())
        const metaDescription = computed(() => meta.value.description || trans('Set a new password to secure your account.'))
        const metaKeywords = computed(() => meta.value.keywords || trans('reset password, account security, set new password'))
        const metaImage = computed(() => meta.value?.og?.image || meta.value?.twitter?.image || settings.value?.meta_img || '')
        const metaCanonical = computed(() => meta.value.canonical || '')
        const metaRobots = computed(() => meta.value.robots || 'noindex, nofollow')

        return {
            form,
            trans,
            formatError,
            fieldErrors,
            bannerError,
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
