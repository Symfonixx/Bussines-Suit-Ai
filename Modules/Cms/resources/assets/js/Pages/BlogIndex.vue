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
        <PageTitle :title="trans('Our Blogs')" />

        <section class="section-page-blog flat-spacing-2">
            <div class="container">
                <div class="content-1200">
                    <div class="sect-title wow fadeInUp">
                        <h2 class="s-title font-3">
                            {{ trans("How We've Empowered Businesses with Innovative Tech Solutions") }}
                        </h2>
                        <p class="s-sub_title">
                            {{ trans('Explore our latest blogs, insights, and technology updates.') }}
                        </p>
                    </div>

                    <div class="page-blog_content">
                        <div class="col-left">
                            <div v-if="blogs.data.length" class="blog-list">
                                <BlogCard
                                    v-for="blog in blogs.data"
                                    :key="blog.id"
                                    :blog="blog"
                                    :locale="locale"
                                />
                            </div>
                            <div v-else class="blog-index__empty">
                                <h3 class="s-title font-3 h4">{{ trans('No blogs found') }}</h3>
                                <p class="s-sub_title">{{ trans('Check back soon — we are adding new articles.') }}</p>
                                <Link :href="route('blogs.index')" class="tf-btn animate-btn mt-3">
                                    {{ trans('All Blogs') }}
                                </Link>
                            </div>

                            <div v-if="blogs.last_page > 1" class="pagination-list blog-index__pagination">
                                <Link
                                    v-if="blogs.prev_page_url"
                                    :href="blogs.prev_page_url"
                                    class="pagination-item pagination-item--prev"
                                    aria-label="Previous"
                                >
                                    <span class="icon icon-CaretDoubleRight fs-20"></span>
                                </Link>
                                <template v-for="(link, linkIndex) in blogs.links" :key="linkIndex">
                                    <Link
                                        v-if="link.url && linkIndex > 0 && linkIndex < blogs.links.length - 1"
                                        :href="link.url"
                                        class="pagination-item"
                                        :class="{ active: link.active }"
                                    >
                                        <span>{{ stripPaginationLabel(link.label) }}</span>
                                    </Link>
                                </template>
                                <Link
                                    v-if="blogs.next_page_url"
                                    :href="blogs.next_page_url"
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
                                            :placeholder="trans('Search blog...')"
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
                                    <h5 class="sb-title font-3 text-linear">{{ trans('Category') }}</h5>
                                    <div class="br-line has-dot"></div>
                                    <ul class="sb-category">
                                        <li>
                                            <Link :href="categoryUrl()" :class="{ active: !filters.category }">
                                                <span>{{ trans('All Blogs') }} ({{ totalBlogsCount }})</span>
                                                <i class="icon icon-ArrowUpRight"></i>
                                            </Link>
                                        </li>
                                        <li v-for="category in categories" :key="category.id">
                                            <Link
                                                :href="categoryUrl(category.slug)"
                                                :class="{ active: filters.category === category.slug }"
                                            >
                                                <span>{{ category.name }} ({{ category.blogs_count || 0 }})</span>
                                                <i class="icon icon-ArrowUpRight"></i>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>

                                <div v-if="recentPosts.length" class="sidebar-item">
                                    <h5 class="sb-title font-3 text-linear">{{ trans('Recent posts') }}</h5>
                                    <div class="br-line has-dot"></div>
                                    <ul class="sb-recent">
                                        <li
                                            v-for="post in recentPosts"
                                            :key="post.id"
                                            class="sb-recent_item hover-img"
                                        >
                                            <Link :href="postUrl(post)" class="recent__image img-style">
                                                <img
                                                    v-if="post.image_link"
                                                    :src="post.image_link"
                                                    :alt="post.title"
                                                    width="94"
                                                    height="94"
                                                    loading="lazy"
                                                >
                                            </Link>
                                            <div class="recent__content">
                                                <div v-if="post.created_at" class="entry_date">
                                                    <i class="icon icon-Clock"></i>
                                                    <span class="date text-body-3">{{ post.created_at }}</span>
                                                </div>
                                                <Link :href="postUrl(post)" class="entry_name link">
                                                    {{ post.title }}
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
import BlogCard from '@/Components/BlogCard.vue'
import CtaTwo from '@/Components/CtaTwo.vue'

const page = usePage()
const trans = (key) => page.props.translations[key] || key
const seo = computed(() => page.props.seo || {})
const settings = computed(() => page.props.settings || {})
const locale = computed(() => page.props.locale || 'en')
const categories = computed(() => page.props.categories || [])
const recentPosts = computed(() => page.props.recentPosts || [])
const filters = computed(() => page.props.filters || {})
const meta = computed(() => page.props.meta || {})
const searchQuery = ref(filters.value.search || '')

const blogs = computed(() => {
    const source = page.props.blogs || { data: [], links: [], last_page: 1 }
    const data = Array.isArray(source.data)
        ? source.data.filter((blog) => blog && blog.id)
        : []
    return {
        ...source,
        data,
    }
})

const totalBlogsCount = computed(() => {
    const fromCategories = categories.value.reduce((sum, category) => sum + (category.blogs_count || 0), 0)
    if (fromCategories > 0) {
        return fromCategories
    }
    return blogs.value.total || blogs.value.data.length || 0
})

const siteName = computed(() => seo.value.website_name || page.props.appName || 'Symfonix')
const metaTitle = computed(() => meta.value.title || `${trans('Blogs')} | ${siteName.value}`)
const metaDescription = computed(() => {
    return meta.value.description
        || trans('Explore our latest blogs, insights, and technology updates.')
        || seo.value.website_desc
        || ''
})
const metaKeywords = computed(() => {
    return meta.value.keywords
        || trans('blogs, news, insights, technology trends')
        || seo.value.website_keywords
        || ''
})
const metaImage = computed(() => meta.value?.og?.image || meta.value?.twitter?.image || settings.value?.meta_img || '')
const metaCanonical = computed(() => meta.value.canonical || '')
const metaRobots = computed(() => meta.value.robots || 'index, follow')

const postUrl = (post) => {
    if (!post?.slug) {
        return '#'
    }
    try {
        return route('blogs.show', post.slug)
    } catch (e) {
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
        return route('blogs.index', params)
    } catch (e) {
        return '/blogs'
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
    router.get(route('blogs.index'), params, {
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
        BlogCard,
        CtaTwo,
    },
}
</script>

<style scoped>
.blog-index__pagination {
    margin-top: 32px;
    flex-wrap: wrap;
}

.blog-index__empty {
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
