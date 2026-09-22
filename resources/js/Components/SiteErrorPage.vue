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
        <PageTitle :title="title" />
        <section class="section-404 flat-spacing-3">
            <div class="container">
                <div class="content px-16 px-lg-0">
                    <div v-if="showImage" class="image">
                        <img loading="lazy" width="544" height="180" :src="asset_path + 'qore/images/section/404.png'" :alt="title">
                    </div>
                    <h2 v-else class="title text-linear font-3">{{ status }}</h2>
                    <h2 class="title text-linear font-3">{{ heading }}</h2>
                    <p class="desc">{{ message }}</p>
                    <div
                        v-if="showDebug && (page?.props?.error || page?.props?.trace)"
                        class="alert alert-danger text-start"
                    >
                        <strong>Debug Error:</strong>
                        <div v-if="page?.props?.error">{{ page.props.error }}</div>
                    </div>
                    <div class="d-flex justify-content-center gap-3">
                        <Link
                            v-if="secondaryHref"
                            class="tf-btn text-body-3 animate-btn"
                            :href="secondaryHref"
                        >
                            {{ secondaryLabel }}
                        </Link>
                        <Link class="tf-btn text-body-3 style-2 style-high-2 animate-btn animate-dark" :href="homeUrl">
                            {{ trans('Back To Home') }}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    </app-layout>
</template>

<script setup>
import { computed } from 'vue'
import { usePage, Link, Head } from '@inertiajs/vue3'
import AppLayout from '@/Layouts/App.vue'
import PageTitle from '@/Components/PageTitle.vue'

const props = defineProps({
    status: { type: [Number, String], required: true },
    title: { type: String, required: true },
    heading: { type: String, required: true },
    message: { type: String, required: true },
    description: { type: String, default: '' },
    keywords: { type: String, default: '' },
    showImage: { type: Boolean, default: false },
    showDebug: { type: Boolean, default: false },
    secondaryHref: { type: String, default: '' },
    secondaryLabel: { type: String, default: '' },
})

const page = usePage()
const trans = (key) => page.props.translations?.[key] || key
const asset_path = computed(() => page.props.asset_path || '/')
const locale = computed(() => page.props.locale || 'en')
const seo = computed(() => page.props.seo || {})
const meta = computed(() => page.props.meta || {})
const siteName = computed(() => seo.value.website_name || page.props.appName || 'Symfonix')
const metaTitle = computed(() => `${props.title} | ${siteName.value}`)
const metaDescription = computed(() => meta.value.description || props.description || props.message)
const metaKeywords = computed(() => meta.value.keywords || props.keywords)
const metaImage = computed(() => meta.value?.og?.image || meta.value?.twitter?.image || '')
const metaCanonical = computed(() => meta.value.canonical || '')
const metaRobots = computed(() => meta.value.robots || 'noindex, nofollow')
const homeUrl = computed(() => {
    try { return route('home') } catch (e) { return `/${locale.value}` }
})
</script>
