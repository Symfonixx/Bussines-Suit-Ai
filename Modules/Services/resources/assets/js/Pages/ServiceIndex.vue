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
        <PageTitle :title="trans('Our Services')" />

        <section class="section-page-blog flat-spacing-2">
            <div class="container">
                <div class="content-1200">
                    <div class="sect-title wow fadeInUp">
                        <h2 class="s-title font-3">
                            {{ trans("Scale Your Business Smarter with Next-Gen IT Solutions") }}
                        </h2>
                        <p class="s-sub_title">
                            {{ trans('Discover our IT services designed to scale and modernize your business.') }}
                        </p>
                    </div>

                    <div class="page-blog_content">
                        <div class="col-left">
                            <div v-if="services.data.length" class="blog-list services-index__grid">
                                <ServiceCardThree
                                    v-for="serviceItem in services.data"
                                    :key="serviceItem.id"
                                    :title="getServiceTitle(serviceItem)"
                                    :description="getServiceDescription(serviceItem)"
                                    :highlights="getServiceHighlights(serviceItem)"
                                    :link="getServiceUrl(serviceItem)"
                                    :image="serviceItem.image_link"
                                    :is-rtl="locale === 'ar'"
                                    :reading-time="serviceItem.reading_time"
                                    :reading-time-label="trans('min read')"
                                    :category-name="getCategoryName(serviceItem.category)"
                                    :button-label="trans('View Details')"
                                />
                            </div>
                            <div v-else class="services-index__empty">
                                <h3 class="s-title font-3 h4">{{ trans("No services found") }}</h3>
                                <p class="s-sub_title">{{ trans('Check back soon — we are adding new services.') }}</p>
                                <Link :href="route('services.index')" class="tf-btn animate-btn mt-3">
                                    {{ trans("All Services") }}
                                </Link>
                            </div>

                            <div v-if="services.last_page > 1" class="pagination-list services-index__pagination">
                                <Link
                                    v-if="services.prev_page_url"
                                    :href="services.prev_page_url"
                                    class="pagination-item pagination-item--prev"
                                    aria-label="Previous"
                                >
                                    <span class="icon icon-CaretDoubleRight fs-20"></span>
                                </Link>
                                <template v-for="(link, linkIndex) in services.links" :key="linkIndex">
                                    <Link
                                        v-if="link.url && linkIndex > 0 && linkIndex < services.links.length - 1"
                                        :href="link.url"
                                        class="pagination-item"
                                        :class="{ active: link.active }"
                                    >
                                        <span>{{ stripPaginationLabel(link.label) }}</span>
                                    </Link>
                                </template>
                                <Link
                                    v-if="services.next_page_url"
                                    :href="services.next_page_url"
                                    class="pagination-item"
                                    aria-label="Next"
                                >
                                    <span class="icon icon-CaretDoubleRight fs-20"></span>
                                </Link>
                            </div>
                        </div>

                        <aside class="col-right">
                            <div class="blog-sidebar sidebar-content-wrap">
                                <div class="sidebar-item">
                                    <h5 class="sb-title font-3 text-linear">{{ trans('Search') }}</h5>
                                    <div class="br-line has-dot"></div>
                                    <form class="form-search" @submit.prevent="submitSearch">
                                        <input
                                            v-model="searchQuery"
                                            class="style-large type-radius-2"
                                            type="search"
                                            :placeholder="trans('Search services...')"
                                        >
                                        <button type="submit" class="btn_submit tf-btn text-body-3 style-2 animate-btn animate-dark" :aria-label="trans('Search')">
                                            <i class="icon icon-MagnifyingGlass"></i>
                                        </button>
                                    </form>
                                </div>

                                <div class="sidebar-item">
                                    <h5 class="sb-title font-3 text-linear">{{ trans("Service Categories") }}</h5>
                                    <div class="br-line has-dot"></div>
                                    <ul class="sb-category">
                                        <li>
                                            <Link :href="categoryUrl()" :class="{ active: !filters.category }">
                                                <span>{{ trans("All Services") }} ({{ totalServicesCount }})</span>
                                                <i class="icon icon-ArrowUpRight"></i>
                                            </Link>
                                        </li>
                                        <li v-for="category in categories" :key="category.id">
                                            <Link
                                                :href="categoryUrl(category.slug)"
                                                :class="{ active: filters.category === category.slug }"
                                            >
                                                <span>{{ getCategoryName(category) }} ({{ category.services_count || 0 }})</span>
                                                <i class="icon icon-ArrowUpRight"></i>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>

                                <div v-if="recentServices.length" class="sidebar-item">
                                    <h5 class="sb-title font-3 text-linear">{{ trans('Recent services') }}</h5>
                                    <div class="br-line has-dot"></div>
                                    <ul class="sb-recent">
                                        <li v-for="item in recentServices" :key="item.id" class="sb-recent_item hover-img">
                                            <Link :href="getServiceUrl(item)" class="recent__image img-style">
                                                <img
                                                    v-if="item.image_link"
                                                    :src="item.image_link"
                                                    :alt="getServiceTitle(item)"
                                                    width="94"
                                                    height="94"
                                                    loading="lazy"
                                                >
                                            </Link>
                                            <div class="recent__content">
                                                <div v-if="item.created_at" class="entry_date">
                                                    <i class="icon icon-Clock"></i>
                                                    <span class="date text-body-3">{{ item.created_at }}</span>
                                                </div>
                                                <Link :href="getServiceUrl(item)" class="entry_name link">
                                                    {{ getServiceTitle(item) }}
                                                </Link>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </section>

        <CtaTwo />
    </app-layout>
</template>

<script setup>
import { computed, ref } from 'vue'
import { usePage, Link, Head, router } from '@inertiajs/vue3'
import PageTitle from '@/Components/PageTitle.vue'
import AppLayout from '@/Layouts/App.vue'
import ServiceCardThree from '@/Components/Services/ServiceCardThree.vue'
import CtaTwo from '@/Components/CtaTwo.vue'

const page = usePage()
const trans = (key) => page.props.translations[key] || key
const seo = computed(() => page.props.seo)
const settings = computed(() => page.props.settings || {})
const locale = computed(() => page.props.locale || 'en')
const categories = computed(() => page.props.categories || [])
const recentServices = computed(() => page.props.recentServices || [])
const filters = computed(() => page.props.filters || {})
const meta = computed(() => page.props.meta || {})
const totalServicesCount = computed(() => page.props.totalServicesCount || 0)
const searchQuery = ref(filters.value.search || '')

const metaTitle = computed(() => {
    return `${trans("Our Services")} | ${seo.value.website_name || ''}`.trim()
})
const metaDescription = computed(() => {
    return meta.value.description
        || trans('Discover our IT services designed to scale and modernize your business.')
        || seo.value.website_desc
        || ''
})
const metaKeywords = computed(() => {
    return meta.value.keywords
        || trans('IT services, web development, mobile apps, AI solutions, cloud services')
        || seo.value.website_keywords
        || ''
})
const metaImage = computed(() => {
    return meta.value?.og?.image || meta.value?.twitter?.image || settings.value?.meta_img || ''
})
const metaCanonical = computed(() => meta.value.canonical || '')
const metaRobots = computed(() => meta.value.robots || 'index, follow')

const services = computed(() => {
    const source = page.props.services || { data: [], links: [], last_page: 1 }
    const data = Array.isArray(source.data)
        ? source.data.filter(service => service && service.id)
        : []
    return {
        ...source,
        data,
    }
})

const translateField = (value) => {
    if (!value) return ''
    if (typeof value === 'string') return value
    if (typeof value === 'object' && value !== null) {
        return value[locale.value] || value['en'] || value[Object.keys(value)[0]] || ''
    }
    return ''
}

const getServiceUrl = (service) => {
    if (!service || !service.slug) {
        return '#'
    }
    try {
        return route('services.show', service.slug)
    } catch (e) {
        return '#'
    }
}

const getServiceTitle = (service) => translateField(service?.title)
const getServiceDescription = (service) => translateField(service?.description)
const getCategoryName = (category) => translateField(category?.title)

const categoryUrl = (slug = null) => {
    const params = {}
    if (slug) {
        params.category = slug
    }
    if (searchQuery.value) {
        params.search = searchQuery.value
    }
    try {
        return route('services.index', params)
    } catch (e) {
        return '/services'
    }
}

const submitSearch = () => {
    const params = {}
    if (searchQuery.value?.trim()) {
        params.search = searchQuery.value.trim()
    }
    if (filters.value.category) {
        params.category = filters.value.category
    }
    router.get(route('services.index'), params, {
        preserveState: true,
        preserveScroll: true,
    })
}

const stripPaginationLabel = (label) => String(label || '').replace(/<[^>]*>/g, '').trim()

const normalizeKeywords = (rawKeywords) => {
    if (!rawKeywords) {
        return []
    }

    let parsed = rawKeywords
    if (typeof rawKeywords === 'string') {
        try {
            parsed = JSON.parse(rawKeywords)
        } catch (e) {
            parsed = rawKeywords
        }
    }

    if (Array.isArray(parsed)) {
        return parsed
            .map((item) => {
                if (typeof item === 'string') {
                    return item
                }
                if (item && typeof item === 'object') {
                    if (item.value) {
                        return translateField(item.value)
                    }
                    return translateField(item)
                }
                return ''
            })
            .map((item) => item?.toString().trim())
            .filter(Boolean)
    }

    if (typeof parsed === 'object') {
        const value = translateField(parsed)
        return value ? [value] : []
    }

    return parsed
        .toString()
        .split(/[,;\n]+/)
        .map(item => item.trim())
        .filter(Boolean)
}

const getServiceHighlights = (service) => normalizeKeywords(service?.keywords)
</script>

<script>
export default {
    components: {
        AppLayout,
        CtaTwo,
    },
}
</script>

<style scoped>
.services-index__grid {
    display: grid;
    gap: 24px;
}

@media (min-width: 768px) {
    .services-index__grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

.services-index__pagination {
    margin-top: 32px;
    flex-wrap: wrap;
}

.services-index__empty {
    text-align: center;
    padding: 64px 24px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
}

@media (min-width: 992px) {
    .col-right .blog-sidebar {
        position: sticky;
        top: 120px;
    }
}
</style>
