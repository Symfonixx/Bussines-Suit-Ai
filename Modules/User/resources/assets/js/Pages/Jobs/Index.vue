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
        <PageTitle :title="trans('Careers')" />

        <section class="section-jobs flat-spacing-3">
            <div class="container">
                <div class="row">
                    <div class="col-lg-10 mx-auto">
                        <div class="sect-title wow fadeInUp text-center">
                            <h2 class="s-title font-3 text-linear">
                                {{ trans('Join Our Team') }}
                            </h2>
                            <p class="s-sub_title">
                                {{ trans('Explore current opportunities and help us build technology in perfect harmony.') }}
                            </p>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-lg-10 col-xl-9 mx-auto">
                        <div v-if="positions.data.length" class="jobs-list px-16 px-xl-0">
                            <article
                                v-for="position in positions.data"
                                :key="position.id"
                                class="jobs-list__item"
                            >
                                <div class="jobs-list__body">
                                    <p class="text-caption font-2 text-main-5">
                                        {{ position.department }}
                                    </p>
                                    <h3 class="jobs-list__title font-3 h5 text-main-2">
                                        {{ position.title }}
                                    </h3>
                                    <ul class="jobs-list__meta text-body-3">
                                        <li>
                                            <i class="icon icon-Tag"></i>
                                            <span>{{ position.location }}</span>
                                        </li>
                                        <li>
                                            <i class="icon icon-User"></i>
                                            <span>{{ formatEmploymentType(position.employment_type) }}</span>
                                        </li>
                                        <li>
                                            <i class="icon icon-Clock"></i>
                                            <span>{{ trans('Posted') }}: {{ formatDate(position.posted_at) }}</span>
                                        </li>
                                    </ul>
                                </div>
                                <Link
                                    :href="route('jobs.show', position.slug)"
                                    class="tf-btn text-body-3 animate-btn"
                                >
                                    {{ trans('View & Apply') }}
                                </Link>
                            </article>
                        </div>

                        <div v-else class="text-center py-5 px-16">
                            <h3 class="s-title font-3 h4">{{ trans('No open positions') }}</h3>
                            <p class="s-sub_title">
                                {{ trans('There are no open positions at the moment. Please check back soon.') }}
                            </p>
                        </div>

                        <div
                            v-if="positions.last_page > 1"
                            class="pagination-list jobs-list__pagination px-16 px-xl-0"
                        >
                            <Link
                                v-if="positions.prev_page_url"
                                :href="positions.prev_page_url"
                                class="pagination-item pagination-item--prev"
                                aria-label="Previous"
                            >
                                <span class="icon icon-CaretDoubleRight fs-20"></span>
                            </Link>
                            <template v-for="(link, linkIndex) in positions.links" :key="linkIndex">
                                <Link
                                    v-if="link.url && linkIndex > 0 && linkIndex < positions.links.length - 1"
                                    :href="link.url"
                                    class="pagination-item"
                                    :class="{ active: link.active }"
                                >
                                    <span>{{ stripPaginationLabel(link.label) }}</span>
                                </Link>
                            </template>
                            <Link
                                v-if="positions.next_page_url"
                                :href="positions.next_page_url"
                                class="pagination-item"
                                aria-label="Next"
                            >
                                <span class="icon icon-CaretDoubleRight fs-20"></span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <CtaTwo />
    </app-layout>
</template>

<script setup>
import { computed } from 'vue'
import { Head, Link, usePage } from '@inertiajs/vue3'
import AppLayout from '@/Layouts/App.vue'
import PageTitle from '@/Components/PageTitle.vue'
import CtaTwo from '@/Components/CtaTwo.vue'

const props = defineProps({
    positions: { type: Object, required: true },
})

const page = usePage()
const trans = (key) => page.props.translations[key] || key
const seo = computed(() => page.props.seo || {})
const settings = computed(() => page.props.settings || {})
const locale = computed(() => page.props.locale || 'en')
const meta = computed(() => page.props.meta || {})
const positions = computed(() => props.positions || { data: [] })

const metaTitle = computed(() => meta.value.title || `${trans('Careers')} | ${seo.value.website_name || page.props.appName || ''}`.trim())
const metaDescription = computed(() => meta.value.description || trans('Explore open roles and build your career with us.') || seo.value.website_desc || '')
const metaKeywords = computed(() => meta.value.keywords || trans('careers, jobs, hiring, open positions') || seo.value.website_keywords || '')
const metaImage = computed(() => meta.value?.og?.image || meta.value?.twitter?.image || settings.value?.meta_img || '')
const metaCanonical = computed(() => meta.value.canonical || '')
const metaRobots = computed(() => meta.value.robots || 'index, follow')

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

const stripPaginationLabel = (label) => String(label || '').replace(/&laquo;|&raquo;|<[^>]+>/g, '').trim()
</script>

<style scoped>
.jobs-list {
    display: grid;
    gap: 12px;
}

.jobs-list__item {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 20px 24px;
    padding: 24px 32px;
    border: 1px solid var(--line);
    border-radius: 16px;
    position: relative;
    overflow: hidden;
}

.jobs-list__item::before {
    content: "";
    position: absolute;
    left: 0;
    top: 28px;
    height: 24px;
    width: 2px;
    background-color: var(--white);
    box-shadow:
        0 0 6px 0 rgba(255, 255, 255, 0.5),
        0 2px 12px 1px rgba(255, 255, 255, 0.3),
        0 0 40px 30px rgba(255, 255, 255, 0.1);
}

.jobs-list__body {
    flex: 1 1 280px;
    min-width: 0;
}

.jobs-list__title {
    margin: 8px 0 12px;
}

.jobs-list__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 20px;
    margin: 0;
    padding: 0;
    list-style: none;
    color: var(--text-2, rgba(255, 255, 255, 0.72));
}

.jobs-list__meta li {
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.jobs-list__meta .icon {
    font-size: 16px;
    opacity: 0.8;
}

.jobs-list__pagination {
    margin-top: 32px;
    justify-content: center;
}

@media (max-width: 1199px) {
    .jobs-list__item {
        padding: 20px 16px 20px 20px;
    }

    .jobs-list__item::before {
        top: 22px;
    }
}
</style>
