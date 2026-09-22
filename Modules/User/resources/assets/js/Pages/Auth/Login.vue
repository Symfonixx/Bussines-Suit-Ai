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
        :title="trans('Login')"
        :success-message="flash.success ? formatError(flash.success) : ''"
        :error-message="flash.error ? formatError(flash.error) : ''"
    >
        <form id="login-form" @submit.prevent="form.post(route('login'))">
            <div class="form-group">
                <div class="input-box">
                    <input
                        id="formEmail"
                        v-model="form.email"
                        type="email"
                        name="email"
                        class="style-large"
                        :placeholder="trans('Email')"
                        :disabled="form.processing"
                        autocomplete="username"
                        required
                    >
                </div>
                <div v-if="errors.email" class="field-error">{{ formatError(errors.email) }}</div>
            </div>

            <div class="form-group">
                <PasswordInput
                    id="formPassword"
                    v-model="form.password"
                    name="password"
                    :placeholder="trans('Password')"
                    :disabled="form.processing"
                    autocomplete="current-password"
                    :show-label="trans('Show password')"
                    :hide-label="trans('Hide password')"
                    required
                />
                <div v-if="errors.password" class="field-error">{{ formatError(errors.password) }}</div>
            </div>

            <div class="remember-forget">
                <div class="checked-box1">
                    <input id="saveinfo" v-model="form.remember" type="checkbox" name="remember">
                    <label for="saveinfo">{{ trans('Remember Me') }}</label>
                </div>
                <div class="forget">
                    <Link :href="route('password.request')">{{ trans('Forgot Password') }}</Link>
                </div>
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

        <template #footer>
            <p>
                {{ trans("I Don't Have Account!") }}
                <Link :href="route('register')">{{ trans('Create A New Account') }}</Link>
            </p>
        </template>
    </AuthShell>
</template>

<script>
import { computed } from 'vue'
import { usePage, Link, useForm, Head } from '@inertiajs/vue3'
import AuthShell from '@/Components/AuthShell.vue'
import PasswordInput from '@/Components/PasswordInput.vue'

export default {
    components: {
        AuthShell, Link, Head, PasswordInput
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
                return error
            }

            const authErrors = {
                'auth.failed': trans('These credentials do not match our records.'),
                'auth.password': trans('The provided password is incorrect.'),
                'auth.throttle': trans('Too many login attempts. Please try again in :seconds seconds.'),
                'passwords.reset': trans('Your password has been reset.'),
                'passwords.sent': trans('We have emailed your password reset link.'),
                'passwords.throttled': trans('Please wait before retrying.'),
                'passwords.token': trans('This password reset token is invalid.'),
                'passwords.user': trans("We can't find a user with that email address."),
            }

            return authErrors[error] || trans(error) || error
        }

        const metaTitle = computed(() => `${trans('Login')} | ${seo.value.website_name || ''}`.trim())
        const metaDescription = computed(() => meta.value.description || trans('Log in to manage your account and services.'))
        const metaKeywords = computed(() => meta.value.keywords || trans('login, sign in, account access'))
        const metaImage = computed(() => meta.value?.og?.image || meta.value?.twitter?.image || settings.value?.meta_img || '')
        const metaCanonical = computed(() => meta.value.canonical || '')
        const metaRobots = computed(() => meta.value.robots || 'noindex, nofollow')

        const form = useForm({
            email: '',
            password: '',
            remember: false,
        })

        return {
            form,
            trans,
            formatError,
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
