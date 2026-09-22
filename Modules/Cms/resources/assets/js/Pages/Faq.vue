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
        <PageTitle :title="trans('FAQs')" />
        <section class="section-faq flat-spacing-3">
            <div class="container">
                <h2 class="s-title only-title ol-tt-2 font-3 text-linear text-center px-16">
                    {{ trans('Get answers to the most common questions about our products, services, and policies.') }}
                </h2>
                <div class="row">
                    <div class="col-lg-10 col-xl-8 mx-auto">
                        <div v-if="faqs.length" class="faq-accordion-list px-16 px-xl-0">
                            <div
                                v-for="(faq, index) in faqs"
                                :key="faq.id || index"
                                class="faq-accordion_item"
                                :class="{ active: activeIndex === index }"
                                @click="toggleAccordion(index)"
                            >
                                <div class="accordion-title" :class="{ collapsed: activeIndex !== index }">
                                    <span class="text fw-medium h5 font-3">{{ translateField(faq.question) }}</span>
                                    <span class="icon ic-accordion-custom"></span>
                                </div>
                                <div v-show="activeIndex === index" class="accordion-body">
                                    <p class="text-main-2" v-html="translateField(faq.answer)"></p>
                                </div>
                            </div>
                        </div>
                        <div v-else class="text-center py-5">
                            <p>{{ trans('No FAQs found.') }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <CtaTwo />
    </app-layout>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { usePage, Head } from '@inertiajs/vue3'
import AppLayout from '@/Layouts/App.vue'
import CtaTwo from '@/Components/CtaTwo.vue'
import PageTitle from '@/Components/PageTitle.vue'

const page = usePage()
const trans = (key) => page.props.translations[key] || key
const seo = computed(() => page.props.seo)
const settings = computed(() => page.props.settings || {})
const locale = computed(() => page.props.locale)
const meta = computed(() => page.props.meta || {})

const metaTitle = computed(() => meta.value.title || `${trans('FAQs')} | ${seo.value.website_name || ''}`.trim())
const metaDescription = computed(() => meta.value.description || trans('Find answers to common questions about our services and policies.') || seo.value.website_desc || '')
const metaKeywords = computed(() => meta.value.keywords || trans('FAQ, help center, support, common questions') || seo.value.website_keywords || '')
const metaImage = computed(() => meta.value?.og?.image || meta.value?.twitter?.image || settings.value?.meta_img || '')
const metaCanonical = computed(() => meta.value.canonical || '')
const metaRobots = computed(() => meta.value.robots || 'index, follow')
const faqs = computed(() => page.props.faqs || [])
const activeIndex = ref(0)

const toggleAccordion = (index) => {
    activeIndex.value = activeIndex.value === index ? null : index
}

watch(() => faqs.value, (newFaqs) => {
    if (newFaqs && newFaqs.length > 0 && activeIndex.value === null) {
        activeIndex.value = 0
    }
}, { immediate: true })

const translateField = (field) => {
    if (!field) return ''
    if (typeof field === 'string') return field
    if (typeof field === 'object') {
        return field[locale.value] || field.en || field[Object.keys(field)[0]] || ''
    }
    return ''
}
</script>
