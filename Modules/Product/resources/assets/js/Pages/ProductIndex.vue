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
        <PageTitle :title="trans('Products')" />

        <section class="section-page-blog flat-spacing-2">
            <div class="container">
                <div class="content-1200">
                    <div class="sect-title wow fadeInUp">
                        <h2 class="s-title font-3">
                            {{ trans('B2B Solutions Built for Scale') }}
                        </h2>
                        <p class="s-sub_title">
                            {{ trans('Discover enterprise-ready platforms and services designed to grow with your business.') }}
                        </p>
                    </div>

                    <div class="page-blog_content">
                        <div class="col-left">
                            <div v-if="products.data.length" class="blog-list products-index__grid">
                                <ProductCard
                                    v-for="product in products.data"
                                    :key="product.id"
                                    :item="product"
                                    :locale="locale"
                                />
                            </div>
                            <div v-else class="products-index__empty">
                                <h3 class="s-title font-3 h4">{{ trans('No records found') }}</h3>
                                <p class="s-sub_title">{{ trans('Check back soon — we are adding new solutions to our catalog.') }}</p>
                                <Link :href="route('product.index')" class="tf-btn animate-btn mt-3">
                                    {{ trans('All Products') }}
                                </Link>
                            </div>

                            <div v-if="products.last_page > 1" class="pagination-list products-index__pagination">
                                <Link
                                    v-if="products.prev_page_url"
                                    :href="products.prev_page_url"
                                    class="pagination-item pagination-item--prev"
                                    aria-label="Previous"
                                >
                                    <span class="icon icon-CaretDoubleRight fs-20"></span>
                                </Link>
                                <template v-for="(link, linkIndex) in products.links" :key="linkIndex">
                                    <Link
                                        v-if="link.url && linkIndex > 0 && linkIndex < products.links.length - 1"
                                        :href="link.url"
                                        class="pagination-item"
                                        :class="{ active: link.active }"
                                    >
                                        <span>{{ stripPaginationLabel(link.label) }}</span>
                                    </Link>
                                </template>
                                <Link
                                    v-if="products.next_page_url"
                                    :href="products.next_page_url"
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
                                            :placeholder="trans('Search products...')"
                                        >
                                        <button
                                            type="submit"
                                            class="btn_submit tf-btn text-body-3 style-2 animate-btn animate-dark"
                                            :aria-label="trans('Search')"
                                        >
                                            <i class="icon icon-MagnifyingGlass"></i>
                                        </button>
                                    </form>
                                </div>

                                <div class="sidebar-item">
                                    <h5 class="sb-title font-3 text-linear">{{ trans('Product Categories') }}</h5>
                                    <div class="br-line has-dot"></div>
                                    <ul class="sb-category">
                                        <li>
                                            <Link :href="categoryUrl()" :class="{ active: !filters.category }">
                                                <span>{{ trans('All Products') }} ({{ totalProductsCount }})</span>
                                                <i class="icon icon-ArrowUpRight"></i>
                                            </Link>
                                        </li>
                                        <li v-for="category in categories" :key="category.id">
                                            <Link
                                                :href="categoryUrl(category.slug)"
                                                :class="{ active: filters.category === category.slug }"
                                            >
                                                <span>{{ category.name }} ({{ category.products_count || 0 }})</span>
                                                <i class="icon icon-ArrowUpRight"></i>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>

                                <div v-if="recentProducts.length" class="sidebar-item">
                                    <h5 class="sb-title font-3 text-linear">{{ trans('Recent products') }}</h5>
                                    <div class="br-line has-dot"></div>
                                    <ul class="sb-recent">
                                        <li v-for="item in recentProducts" :key="item.id" class="sb-recent_item hover-img">
                                            <Link :href="productUrl(item)" class="recent__image img-style">
                                                <img
                                                    v-if="item.main_image_link"
                                                    :src="item.main_image_link"
                                                    :alt="item.name"
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
                                                <Link :href="productUrl(item)" class="entry_name link">
                                                    {{ item.name }}
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
import { Head, Link, router, usePage } from '@inertiajs/vue3'
import PageTitle from '@/Components/PageTitle.vue'
import AppLayout from '@/Layouts/App.vue'
import ProductCard from '@/Components/ProductCard.vue'
import CtaTwo from '@/Components/CtaTwo.vue'

const page = usePage()
const trans = (key) => page.props.translations[key] || key
const seo = computed(() => page.props.seo)
const settings = computed(() => page.props.settings || {})
const locale = computed(() => page.props.locale || 'en')
const categories = computed(() => page.props.categories || [])
const recentProducts = computed(() => page.props.recentProducts || [])
const filters = computed(() => page.props.filters || {})
const meta = computed(() => page.props.meta || {})
const totalProductsCount = computed(() => page.props.totalProductsCount || 0)
const searchQuery = ref(filters.value.search || '')

const products = computed(() => {
    const source = page.props.products || { data: [], links: [], last_page: 1 }
    const data = Array.isArray(source.data)
        ? source.data.filter((product) => product && product.id)
        : []
    return {
        ...source,
        data,
    }
})

const metaTitle = computed(() => meta.value.title || `${trans('Products')} | ${seo.value.website_name || ''}`.trim())
const metaDescription = computed(() => meta.value.description || trans('Browse our B2B product catalog.') || seo.value.website_desc || '')
const metaKeywords = computed(() => meta.value.keywords || trans('products, B2B catalog, SaaS') || seo.value.website_keywords || '')
const metaImage = computed(() => meta.value?.og?.image || meta.value?.twitter?.image || settings.value?.meta_img || '')
const metaCanonical = computed(() => meta.value.canonical || '')
const metaRobots = computed(() => meta.value.robots || 'index, follow')

const productUrl = (product) => {
    if (!product?.slug) {
        return '#'
    }
    try {
        return route('product.show', product.slug)
    } catch {
        return '#'
    }
}

const categoryUrl = (slug = null) => {
    const params = {}
    if (slug) {
        params.category = slug
    }
    if (searchQuery.value) {
        params.search = searchQuery.value
    }
    try {
        return route('product.index', params)
    } catch {
        return '/products'
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
    router.get(route('product.index'), params, {
        preserveState: true,
        preserveScroll: true,
    })
}

const stripPaginationLabel = (label) => String(label || '').replace(/<[^>]*>/g, '').trim()
</script>

<script>
export default {
    components: {
        AppLayout,
        CtaTwo,
        ProductCard,
    },
}
</script>

<style scoped>
.products-index__grid {
    display: grid;
    gap: 24px;
}

@media (min-width: 768px) {
    .products-index__grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

.products-index__pagination {
    margin-top: 32px;
    flex-wrap: wrap;
}

.products-index__empty {
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
