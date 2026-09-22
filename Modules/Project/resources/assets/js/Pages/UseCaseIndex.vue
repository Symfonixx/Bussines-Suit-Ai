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
        <PageTitle :title="trans('Case Studies')" />

        <section class="section-page-blog flat-spacing-2">
            <div class="container">
                <div class="sect-title wow fadeInUp">
                    <h2 class="s-title font-3">
                        {{ trans("How We've Empowered Businesses with Innovative Tech Solutions") }}
                    </h2>
                    <p class="s-sub_title">
                        {{ trans('Explore our case studies and see how we help businesses with innovative technology solutions.') }}
                    </p>
                </div>

                <div v-if="useCases.data.length" class="tf-grid-layout sm-col-2 md-col-3">
                    <UseCaseCard
                        v-for="item in useCases.data"
                        :key="item.id"
                        :item="item"
                        :locale="locale"
                    />
                </div>

                <div v-else class="text-center py-5">
                    <h3 class="s-title font-3 h4">{{ trans('No records found') }}</h3>
                    <p class="s-sub_title">{{ trans('Check back soon — we are adding new case studies.') }}</p>
                </div>

                <div v-if="useCases.last_page > 1" class="pagination-list mt-5 justify-content-center">
                    <Link
                        v-if="useCases.prev_page_url"
                        :href="useCases.prev_page_url"
                        class="pagination-item pagination-item--prev"
                        aria-label="Previous"
                    >
                        <span class="icon icon-CaretDoubleRight fs-20"></span>
                    </Link>
                    <template v-for="(link, linkIndex) in useCases.links" :key="linkIndex">
                        <Link
                            v-if="link.url && linkIndex > 0 && linkIndex < useCases.links.length - 1"
                            :href="link.url"
                            class="pagination-item"
                            :class="{ active: link.active }"
                        >
                            <span>{{ stripPaginationLabel(link.label) }}</span>
                        </Link>
                    </template>
                    <Link
                        v-if="useCases.next_page_url"
                        :href="useCases.next_page_url"
                        class="pagination-item"
                        aria-label="Next"
                    >
                        <span class="icon icon-CaretDoubleRight fs-20"></span>
                    </Link>
                </div>
            </div>
        </section>

        <CtaTwo />
    </app-layout>
</template>

<script setup>
import { computed } from 'vue'
import { Head, Link, usePage } from '@inertiajs/vue3'
import PageTitle from '@/Components/PageTitle.vue'
import AppLayout from '@/Layouts/App.vue'
import CtaTwo from '@/Components/CtaTwo.vue'
import UseCaseCard from '@/Components/UseCaseCard.vue'

const page = usePage()
const trans = (key) => page.props.translations[key] || key
const seo = computed(() => page.props.seo)
const settings = computed(() => page.props.settings || {})
const locale = computed(() => page.props.locale || 'en')
const useCases = computed(() => page.props.useCases || { data: [], links: [], last_page: 1 })
const meta = computed(() => page.props.meta || {})

const metaTitle = computed(() => meta.value.title || `${trans('Case Studies')} | ${seo.value.website_name || ''}`.trim())
const metaDescription = computed(() => meta.value.description || trans('Explore our case studies and see how we help businesses with innovative technology solutions.') || seo.value.website_desc || '')
const metaKeywords = computed(() => meta.value.keywords || trans('case studies, project solutions, IT solutions, web development') || seo.value.website_keywords || '')
const metaImage = computed(() => meta.value?.og?.image || meta.value?.twitter?.image || settings.value?.meta_img || '')
const metaCanonical = computed(() => meta.value.canonical || '')
const metaRobots = computed(() => meta.value.robots || 'index, follow')

const stripPaginationLabel = (label) => String(label || '').replace(/<[^>]*>/g, '').trim()
</script>
