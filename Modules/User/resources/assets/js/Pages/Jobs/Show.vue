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

    <app-layout>
        <PageTitle
            :title="position.title"
            :crumbs="[
                { label: trans('Careers'), href: route('jobs.index') },
                { label: position.title },
            ]"
        />

        <section class="section-job-detail flat-spacing-3">
            <div class="container">
                <div class="row">
                    <div class="col-lg-10 mx-auto">
                        <h2 class="s-title only-title font-3 text-linear px-16 px-xl-0">
                            {{ position.title }}
                        </h2>
                    </div>
                </div>

                <div class="row">
                    <div class="col-lg-4 offset-lg-1">
                        <ul class="info-us-list px-16 px-lg-0 mb-lg-0">
                            <li>
                                <p class="title-sub text-body-3">{{ trans('Department') }}</p>
                                <span class="h5 fw-medium text-white font-3">{{ position.department }}</span>
                            </li>
                            <li class="br-line has-dot"></li>
                            <li>
                                <p class="title-sub text-body-3">{{ trans('Location') }}</p>
                                <span class="h5 fw-medium text-white font-3">{{ position.location }}</span>
                            </li>
                            <li class="br-line has-dot"></li>
                            <li>
                                <p class="title-sub text-body-3">{{ trans('Employment Type') }}</p>
                                <span class="h5 fw-medium text-white font-3">
                                    {{ formatEmploymentType(position.employment_type) }}
                                </span>
                            </li>
                            <li class="br-line has-dot"></li>
                            <li>
                                <p class="title-sub text-body-3">{{ trans('Posted') }}</p>
                                <span class="h5 fw-medium text-white font-3">{{ formatDate(position.posted_at) }}</span>
                            </li>
                        </ul>

                        <div class="job-detail__content px-16 px-lg-0">
                            <h3 class="font-3 h5 text-linear mb-3">{{ trans('About the role') }}</h3>
                            <div class="job-rich-content text-main-2" v-html="position.description"></div>

                            <template v-if="position.requirements">
                                <div class="br-line has-dot my-4"></div>
                                <h3 class="font-3 h5 text-linear mb-3">{{ trans('Requirements') }}</h3>
                                <div class="job-rich-content text-main-2" v-html="position.requirements"></div>
                            </template>
                        </div>
                    </div>

                    <div class="col-lg-7">
                        <form class="form-get_in px-16 px-xl-0" @submit.prevent="submit">
                            <h3 class="font-3 h5 text-linear mb-4">{{ trans('Apply for this role') }}</h3>

                            <div v-if="success || flashSuccess" class="alert alert-success mb-4">
                                {{ flashSuccess || trans('Your application has been submitted successfully.') }}
                            </div>

                            <div class="form-content-2">
                                <div class="tf-grid-layout sm-col-2">
                                    <fieldset>
                                        <label class="label-text text-body-3 text-white" for="full_name">
                                            {{ trans('Full Name') }} <span class="required-mark">*</span>
                                        </label>
                                        <input
                                            id="full_name"
                                            v-model="form.full_name"
                                            type="text"
                                            :placeholder="trans('Full Name')"
                                            :class="{ error: form.errors.full_name }"
                                            :disabled="form.processing"
                                            required
                                        >
                                        <div v-if="form.errors.full_name" class="text-danger mt-1 small">
                                            {{ form.errors.full_name }}
                                        </div>
                                    </fieldset>
                                    <fieldset>
                                        <label class="label-text text-body-3 text-white" for="email">
                                            {{ trans('Email') }} <span class="required-mark">*</span>
                                        </label>
                                        <input
                                            id="email"
                                            v-model="form.email"
                                            type="email"
                                            :placeholder="trans('Email')"
                                            :class="{ error: form.errors.email }"
                                            :disabled="form.processing"
                                            required
                                        >
                                        <div v-if="form.errors.email" class="text-danger mt-1 small">
                                            {{ form.errors.email }}
                                        </div>
                                    </fieldset>
                                </div>

                                <div class="tf-grid-layout sm-col-2">
                                    <fieldset>
                                        <label class="label-text text-body-3 text-white" for="phone">
                                            {{ trans('Phone') }} <span class="required-mark">*</span>
                                        </label>
                                        <input
                                            id="phone"
                                            v-model="form.phone"
                                            type="tel"
                                            :placeholder="trans('Phone')"
                                            :class="{ error: form.errors.phone }"
                                            :disabled="form.processing"
                                            required
                                        >
                                        <div v-if="form.errors.phone" class="text-danger mt-1 small">
                                            {{ form.errors.phone }}
                                        </div>
                                    </fieldset>
                                    <fieldset>
                                        <label class="label-text text-body-3 text-white" for="expected_salary">
                                            {{ trans('Expected Salary') }}
                                        </label>
                                        <input
                                            id="expected_salary"
                                            v-model="form.expected_salary"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            :placeholder="`${trans('Expected Salary')} (USD)`"
                                            :class="{ error: form.errors.expected_salary }"
                                            :disabled="form.processing"
                                        >
                                        <div v-if="form.errors.expected_salary" class="text-danger mt-1 small">
                                            {{ form.errors.expected_salary }}
                                        </div>
                                    </fieldset>
                                </div>

                                <fieldset class="d-grid">
                                    <label class="label-text text-body-3 text-white" for="motivation">
                                        {{ trans('Why do you want to work with us?') }} <span class="required-mark">*</span>
                                    </label>
                                    <textarea
                                        id="motivation"
                                        v-model="form.motivation"
                                        rows="4"
                                        :placeholder="trans('Why do you want to work with us?')"
                                        :class="{ error: form.errors.motivation }"
                                        :disabled="form.processing"
                                        required
                                    ></textarea>
                                    <div v-if="form.errors.motivation" class="text-danger mt-1 small">
                                        {{ form.errors.motivation }}
                                    </div>
                                </fieldset>

                                <fieldset class="d-grid">
                                    <label class="label-text text-body-3 text-white" for="cover_letter">
                                        {{ trans('Cover Letter') }}
                                    </label>
                                    <textarea
                                        id="cover_letter"
                                        v-model="form.cover_letter"
                                        rows="5"
                                        :placeholder="trans('Cover Letter')"
                                        :class="{ error: form.errors.cover_letter }"
                                        :disabled="form.processing"
                                    ></textarea>
                                    <div v-if="form.errors.cover_letter" class="text-danger mt-1 small">
                                        {{ form.errors.cover_letter }}
                                    </div>
                                </fieldset>

                                <fieldset class="d-grid">
                                    <label class="label-text text-body-3 text-white" for="resume">
                                        {{ trans('Resume / CV') }} <span class="required-mark">*</span>
                                    </label>
                                    <input
                                        id="resume"
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        :class="{ error: form.errors.resume }"
                                        :disabled="form.processing"
                                        required
                                        @change="form.resume = $event.target.files[0]"
                                    >
                                    <p class="text-body-3 text-main-2 mt-2 mb-0">
                                        {{ trans('Accepted file types: PDF, DOC, DOCX. Maximum size: 5 MB.') }}
                                    </p>
                                    <div v-if="form.errors.resume" class="text-danger mt-1 small">
                                        {{ form.errors.resume }}
                                    </div>
                                </fieldset>
                            </div>

                            <button
                                type="submit"
                                class="tf-btn text-body-3 style-2 animate-btn animate-dark style-high"
                                :disabled="form.processing"
                            >
                                {{ form.processing ? trans('Submitting...') : trans('Submit Application') }}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>

        <CtaTwo />
    </app-layout>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Head, useForm, usePage } from '@inertiajs/vue3'
import AppLayout from '@/Layouts/App.vue'
import PageTitle from '@/Components/PageTitle.vue'
import CtaTwo from '@/Components/CtaTwo.vue'

const props = defineProps({
    position: { type: Object, required: true },
})

const page = usePage()
const trans = (key) => page.props.translations[key] || key
const seo = computed(() => page.props.seo || {})
const settings = computed(() => page.props.settings || {})
const locale = computed(() => page.props.locale || 'en')
const meta = computed(() => page.props.meta || {})
const success = ref(false)
const flashSuccess = computed(() => page.props.flash?.success || '')

const metaTitle = computed(() => meta.value.title || `${props.position.title} | ${seo.value.website_name || page.props.appName || ''}`.trim())
const metaDescription = computed(() => meta.value.description || trans('Apply for an open role and join our team.') || seo.value.website_desc || '')
const metaKeywords = computed(() => meta.value.keywords || `${props.position.title}, ${props.position.department}, careers` || seo.value.website_keywords || '')
const metaImage = computed(() => meta.value?.og?.image || meta.value?.twitter?.image || settings.value?.meta_img || '')
const metaCanonical = computed(() => meta.value.canonical || '')
const metaRobots = computed(() => meta.value.robots || 'index, follow')

const form = useForm({
    full_name: '',
    email: '',
    phone: '',
    expected_salary: '',
    motivation: '',
    cover_letter: '',
    resume: null,
})

const formatDate = (value) => new Intl.DateTimeFormat(locale.value, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
}).format(new Date(`${value}T00:00:00`))

const formatEmploymentType = (value) => trans(
    String(value || '')
        .replaceAll('_', ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase()),
)

const submit = () => {
    form.post(route('jobs.apply', props.position.slug), {
        forceFormData: true,
        preserveScroll: true,
        onSuccess: () => {
            success.value = true
            form.reset()
            form.clearErrors()
        },
        onError: () => {
            success.value = false
        },
    })
}
</script>

<style scoped>
.required-mark {
    color: #ef4444;
    font-weight: 700;
}

.job-detail__content {
    margin-top: 40px;
}

.job-rich-content :deep(p),
.job-rich-content :deep(ul),
.job-rich-content :deep(ol) {
    margin-bottom: 1rem;
}

.job-rich-content :deep(ul),
.job-rich-content :deep(ol) {
    padding-inline-start: 1.25rem;
}

.form-get_in :deep(input[type="file"]) {
    color: rgba(255, 255, 255, 0.85);
}

@media (min-width: 992px) {
    .job-detail__content {
        margin-top: 48px;
    }
}
</style>
