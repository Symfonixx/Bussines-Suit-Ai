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
        <PageTitle :title="trans('Contact Us')" />

        <section class="section-get-in flat-spacing-3">
            <div class="container">
                <div class="row">
                    <div class="col-lg-10 mx-auto">
                        <h2 class="s-title only-title font-3 text-linear px-16 px-xl-0">
                            {{ trans('Get In Touch') }}
                        </h2>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-3 offset-lg-1">
                        <ul class="info-us-list px-16 px-lg-0 mb-lg-0">
                            <li v-if="settings.address">
                                <p class="title-sub text-body-3">{{ trans('Our Location') }}</p>
                                <span class="text-body-3 text-white">{{ settings.address }}</span>
                            </li>
                            <li v-if="settings.address" class="br-line has-dot"></li>
                            <li v-if="settings.email">
                                <p class="title-sub text-body-3">{{ trans('Email') }}</p>
                                <a :href="`mailto:${settings.email}`" class="h5 fw-medium link text-white font-3" dir="ltr">
                                    {{ settings.email }}
                                </a>
                            </li>
                            <li v-if="settings.email && settings.phone" class="br-line has-dot"></li>
                            <li v-if="settings.phone">
                                <p class="title-sub text-body-3">{{ trans('Phone') }}</p>
                                <a :href="`tel:${settings.phone}`" class="h5 fw-medium link text-white font-3" dir="ltr">
                                    {{ settings.phone }}
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div class="col-lg-7">
                        <form @submit.prevent="handleSubmit" class="form-get_in px-16 px-xl-0">
                            <div class="form-content-2">
                                <div class="tf-grid-layout sm-col-2">
                                    <fieldset>
                                        <label class="label-text text-body-3 text-white" for="contact-name">{{ trans('Full Name') }}</label>
                                        <input
                                            id="contact-name"
                                            v-model="contactForm.name"
                                            type="text"
                                            name="name"
                                            :placeholder="trans('Full Name')"
                                            :class="{ error: contactForm.errors.name }"
                                            :disabled="contactForm.processing"
                                            required
                                        >
                                        <div v-if="contactForm.errors.name" class="text-danger mt-1 small">
                                            {{ contactForm.errors.name }}
                                        </div>
                                    </fieldset>
                                    <fieldset>
                                        <label class="label-text text-body-3 text-white" for="contact-email">{{ trans('Email') }}</label>
                                        <input
                                            id="contact-email"
                                            v-model="contactForm.email"
                                            type="email"
                                            name="email"
                                            :placeholder="trans('Email')"
                                            :class="{ error: contactForm.errors.email }"
                                            :disabled="contactForm.processing"
                                            required
                                        >
                                        <div v-if="contactForm.errors.email" class="text-danger mt-1 small">
                                            {{ contactForm.errors.email }}
                                        </div>
                                    </fieldset>
                                </div>
                                <div class="tf-grid-layout sm-col-2">
                                    <fieldset>
                                        <label class="label-text text-body-3 text-white" for="contact-mobile">{{ trans('Phone Number') }}</label>
                                        <input
                                            id="contact-mobile"
                                            v-model="contactForm.mobile"
                                            type="text"
                                            name="mobile"
                                            :placeholder="trans('Phone Number')"
                                            :class="{ error: contactForm.errors.mobile }"
                                            :disabled="contactForm.processing"
                                            required
                                        >
                                        <div v-if="contactForm.errors.mobile" class="text-danger mt-1 small">
                                            {{ contactForm.errors.mobile }}
                                        </div>
                                    </fieldset>
                                    <fieldset>
                                        <label class="label-text text-body-3 text-white" for="contact-subject">{{ trans('Subject') }}</label>
                                        <input
                                            id="contact-subject"
                                            v-model="contactForm.subject"
                                            type="text"
                                            name="subject"
                                            :placeholder="trans('Subject')"
                                            :class="{ error: contactForm.errors.subject }"
                                            :disabled="contactForm.processing"
                                            required
                                        >
                                        <div v-if="contactForm.errors.subject" class="text-danger mt-1 small">
                                            {{ contactForm.errors.subject }}
                                        </div>
                                    </fieldset>
                                </div>
                                <fieldset class="d-grid">
                                    <label class="label-text text-body-3 text-white" for="contact-message">{{ trans('Message') }}</label>
                                    <textarea
                                        id="contact-message"
                                        v-model="contactForm.message"
                                        name="message"
                                        :placeholder="trans('Write your message')"
                                        :class="{ error: contactForm.errors.message }"
                                        :disabled="contactForm.processing"
                                        required
                                    ></textarea>
                                    <div v-if="contactForm.errors.message" class="text-danger mt-1 small">
                                        {{ contactForm.errors.message }}
                                    </div>
                                </fieldset>
                            </div>
                            <button
                                type="submit"
                                class="tf-btn text-body-3 style-2 animate-btn animate-dark style-high"
                                :disabled="contactForm.processing"
                            >
                                {{ contactForm.processing ? trans('Sending...') : trans('Submit') }}
                            </button>
                            <div v-if="submitSuccess" class="alert alert-success mt-3">
                                {{ trans('Thank you for contacting us! We will get back to you soon.') }}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    </app-layout>
</template>

<script setup>
import {computed, ref} from 'vue'
import {usePage, useForm, Head} from '@inertiajs/vue3'
import AppLayout from '@/Layouts/App.vue'
import PageTitle from '@/Components/PageTitle.vue'

const page = usePage()
const trans = (key) => page.props.translations[key] || key;
const seo = computed(() => page.props.seo || {})
const settings = computed(() => page.props.settings || {})
const meta = computed(() => page.props.meta || {})
const siteName = computed(() => seo.value.website_name || page.props.appName || 'Symfonix')

const metaTitle = computed(() => {
    return meta.value.title || `${trans('Contact Us')} | ${siteName.value}`
})
const metaDescription = computed(() => {
    return meta.value.description
        || trans('Contact our team for support, inquiries, or project discussions.')
        || seo.value.website_desc
        || ''
})
const metaKeywords = computed(() => {
    return meta.value.keywords
        || trans('contact, support, get in touch, customer service')
        || seo.value.website_keywords
        || ''
})
const metaImage = computed(() => {
    return meta.value?.og?.image || meta.value?.twitter?.image || settings.value?.meta_img || ''
})
const metaCanonical = computed(() => meta.value.canonical || '')
const metaRobots = computed(() => meta.value.robots || 'index, follow')
const submitSuccess = ref(false)

const contactForm = useForm({
    name: '',
    email: '',
    mobile: '',
    subject: '',
    message: '',
})

const handleSubmit = () => {
    if (contactForm.processing) {
        return false;
    }

    // Validate required fields
    if (!contactForm.name || !contactForm.name.trim()) {
        return false;
    }

    if (!contactForm.email || !contactForm.email.trim()) {
        return false;
    }

    if (!contactForm.mobile || !contactForm.mobile.trim()) {
        return false;
    }

    if (!contactForm.subject || !contactForm.subject.trim()) {
        return false;
    }

    if (!contactForm.message || !contactForm.message.trim()) {
        return false;
    }

    let contactUrl = route('contact-us.store');
    contactForm.post(contactUrl, {
        preserveScroll: true,
        preserveState: true,
        onBefore: () => {
            submitSuccess.value = false;
        },
        onSuccess: () => {
            submitSuccess.value = true;
            contactForm.reset();
            contactForm.clearErrors();
            setTimeout(() => {
                submitSuccess.value = false;
            }, 5000);
        },
        onError: () => {
            submitSuccess.value = false;
        },
    });

    return false;
}
</script>


