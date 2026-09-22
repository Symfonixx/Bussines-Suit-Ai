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
        :title="trans('Register')"
        :success-message="flash.success || ''"
        :error-message="flash.error || ''"
    >
        <form id="register-form" @submit.prevent="form.post(route('register'))">
            <div class="form-group">
                <div class="input-box">
                    <input
                        id="formName"
                        v-model="form.name"
                        type="text"
                        name="name"
                        class="style-large"
                        :placeholder="trans('Name')"
                        :disabled="form.processing"
                        autocomplete="name"
                        required
                    >
                </div>
                <div v-if="errors.name" class="field-error">{{ errors.name }}</div>
            </div>

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
                        autocomplete="email"
                        required
                    >
                </div>
                <div v-if="errors.email" class="field-error">{{ errors.email }}</div>
            </div>

            <div class="form-group">
                <div class="input-box">
                    <input
                        id="formPhone"
                        v-model="form.mobile"
                        type="tel"
                        name="mobile"
                        class="style-large"
                        :placeholder="trans('Phone')"
                        :disabled="form.processing"
                        autocomplete="tel"
                        required
                    >
                </div>
                <div v-if="errors.mobile" class="field-error">{{ errors.mobile }}</div>
            </div>

            <div class="form-group">
                <PasswordInput
                    id="formPassword"
                    v-model="form.password"
                    name="password"
                    :placeholder="trans('Password')"
                    :disabled="form.processing"
                    autocomplete="new-password"
                    :show-label="trans('Show password')"
                    :hide-label="trans('Hide password')"
                    required
                />
                <div v-if="errors.password" class="field-error">{{ errors.password }}</div>
            </div>

            <div class="form-group">
                <PasswordInput
                    id="formPasswordConfirm"
                    v-model="form.password_confirmation"
                    name="password_confirmation"
                    :placeholder="trans('Confirm Password')"
                    :disabled="form.processing"
                    autocomplete="new-password"
                    :show-label="trans('Show password')"
                    :hide-label="trans('Hide password')"
                    required
                />
                <div v-if="errors.password_confirmation" class="field-error">{{ errors.password_confirmation }}</div>
            </div>

            <div class="auth-page__actions">
                <button
                    class="thm-btn"
                    type="submit"
                    :disabled="form.processing"
                >
                    <span>{{ form.processing ? trans('Registering...') : trans('Register') }}</span>
                </button>
            </div>
        </form>

        <template #footer>
            <p>
                {{ trans('Already Have An Account?') }}
                <Link :href="route('login')">{{ trans('Login') }}</Link>
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

        const metaTitle = computed(() => `${trans('Register')} | ${seo.value.website_name || ''}`.trim())
        const metaDescription = computed(() => meta.value.description || trans('Create a new account to access our services.'))
        const metaKeywords = computed(() => meta.value.keywords || trans('register, sign up, create account'))
        const metaImage = computed(() => meta.value?.og?.image || meta.value?.twitter?.image || settings.value?.meta_img || '')
        const metaCanonical = computed(() => meta.value.canonical || '')
        const metaRobots = computed(() => meta.value.robots || 'noindex, nofollow')

        const form = useForm({
            name: '',
            email: '',
            mobile: '',
            password: '',
            password_confirmation: '',
        })

        return {
            form,
            trans,
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
