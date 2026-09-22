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
        <meta property="og:type" content="article">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" :content="metaTitle">
        <meta name="twitter:description" :content="metaDescription">
        <meta v-if="metaImage" name="twitter:image" :content="metaImage">
    </Head>
    <app-layout>
        <PageTitle
            :title="blog.title"
            :crumbs="[
                { label: trans('Blogs'), href: route('blogs.index') },
                { label: blog.title },
            ]"
        />

        <section class="section-page-blog flat-spacing-2">
            <div class="container">
                <div class="content-1200">
                    <div class="blog-detail_heading">
                        <h1 class="title_detail text-linear font-3">{{ blog.title }}</h1>
                        <div class="br-line has-dot"></div>
                        <div class="meta_detail">
                            <div v-if="blog.created_at_formatted || blog.created_at" class="meta meta__date">
                                <i class="icon icon-Clock"></i>
                                <span class="meta-text text-body-3">{{ blog.created_at_formatted || blog.created_at }}</span>
                            </div>
                            <div v-if="blog.reading_time" class="meta meta__date">
                                <i class="icon icon-Clock"></i>
                                <span class="meta-text text-body-3">{{ blog.reading_time }} {{ trans('min read') }}</span>
                            </div>
                            <div v-if="blog.category" class="meta meta__tag">
                                <i class="icon icon-Tag"></i>
                                <span class="meta-text text-body-3">{{ blog.category.name }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="page-blog_content detail">
                        <div class="col-left">
                            <article class="main-blog_detail">
                                <p v-if="blog.description" class="detail_text text-main-2">
                                    {{ blog.description }}
                                </p>
                                <div v-if="blog.image_link" class="detail_image">
                                    <img
                                        :src="blog.image_link"
                                        :alt="blog.title"
                                        width="732"
                                        height="412"
                                        loading="lazy"
                                        decoding="async"
                                    >
                                </div>
                                <div class="blog-show__content detail_text text-main-6" v-html="blog.content"></div>

                                <div v-if="keywords.length" class="detail_tag">
                                    <div class="br-line has-dot"></div>
                                    <ul class="tag-list">
                                        <li class="text-body-3 text-white">{{ trans('Tags') }}:</li>
                                        <li v-for="(keyword, index) in keywords" :key="index">
                                            <Link
                                                :href="route('blogs.index', { search: keyword })"
                                                class="text-body-3 link"
                                            >
                                                {{ keyword }}
                                            </Link>
                                        </li>
                                    </ul>
                                </div>

                                <div class="blog-show__share">
                                    <span class="text-body-3 text-white">{{ trans('Share On:') }}</span>
                                    <div class="blog-show__share-links">
                                        <a :href="getShareUrl('facebook')" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                            <span class="icon icon-facebook"></span>
                                        </a>
                                        <a :href="getShareUrl('twitter')" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                                            <i class="fab fa-twitter"></i>
                                        </a>
                                        <a :href="getShareUrl('linkedin')" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                                            <span class="icon icon-linkedin"></span>
                                        </a>
                                    </div>
                                </div>
                            </article>

                            <div v-if="previousPost || nextPost" class="blog-show__nav">
                                <Link
                                    v-if="previousPost"
                                    :href="route('blogs.show', previousPost.slug)"
                                    class="blog-show__nav-item"
                                >
                                    <span class="text-body-3">{{ trans('Prev Blog') }}</span>
                                    <strong class="link">{{ previousPost.title }}</strong>
                                </Link>
                                <Link
                                    v-if="nextPost"
                                    :href="route('blogs.show', nextPost.slug)"
                                    class="blog-show__nav-item blog-show__nav-item--next"
                                >
                                    <span class="text-body-3">{{ trans('Next Blog') }}</span>
                                    <strong class="link">{{ nextPost.title }}</strong>
                                </Link>
                            </div>

                            <div v-if="relatedBlogs.length" class="blog-show__related">
                                <h4 class="title text-linear font-3">{{ trans('Related Blogs') }}</h4>
                                <div class="blog-list">
                                    <BlogCard
                                        v-for="relatedBlog in relatedBlogs"
                                        :key="relatedBlog.id"
                                        :blog="relatedBlog"
                                        :locale="locale"
                                    />
                                </div>
                            </div>
                        </div>

                        <aside class="col-right">
                            <div class="blog-sidebar sidebar-content-wrap">
                                <div class="sidebar-item">
                                    <h5 class="sb-title font-3 text-linear">{{ trans('Search') }}</h5>
                                    <div class="br-line has-dot"></div>
                                    <form class="form-search" @submit.prevent="handleSearch">
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
                                        <li v-for="category in categories" :key="category.id">
                                            <Link :href="route('blogs.index', { category: category.slug })">
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
                                            <Link :href="route('blogs.show', post.slug)" class="recent__image img-style">
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
                                                <Link :href="route('blogs.show', post.slug)" class="entry_name link">
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
const locale = computed(() => page.props.locale || 'en')
const blog = computed(() => page.props.blog || {})
const relatedBlogs = computed(() => page.props.relatedBlogs || [])
const categories = computed(() => page.props.categories || [])
const recentPosts = computed(() => page.props.recentPosts || [])
const previousPost = computed(() => page.props.previousPost)
const nextPost = computed(() => page.props.nextPost)
const meta = computed(() => page.props.meta || {})
const seo = computed(() => page.props.seo || {})
const settings = computed(() => page.props.settings || {})

const metaTitle = computed(() => meta.value.title || blog.value?.title || '')
const metaDescription = computed(() => meta.value.description || blog.value?.description || seo.value.website_desc || '')
const metaKeywords = computed(() => meta.value.keywords || blog.value?.keywords || seo.value.website_keywords || '')
const metaImage = computed(() => meta.value?.og?.image || blog.value?.image_link || settings.value?.meta_img || '')
const metaCanonical = computed(() => meta.value.canonical || '')
const metaRobots = computed(() => meta.value.robots || 'index, follow')

const searchQuery = ref('')

const keywords = computed(() => {
    const raw = blog.value?.keywords
    if (!raw) {
        return []
    }
    if (typeof raw === 'string') {
        return raw.split(',').map((item) => item.trim()).filter(Boolean).slice(0, 6)
    }
    if (Array.isArray(raw)) {
        return raw.map((item) => String(item).trim()).filter(Boolean).slice(0, 6)
    }
    return []
})

const getShareUrl = (platform) => {
    const url = encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')
    const title = encodeURIComponent(blog.value.title || '')

    switch (platform) {
        case 'twitter':
            return `https://twitter.com/intent/tweet?url=${url}&text=${title}`
        case 'facebook':
            return `https://www.facebook.com/sharer/sharer.php?u=${url}`
        case 'linkedin':
            return `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`
        default:
            return '#'
    }
}

const handleSearch = () => {
    if (searchQuery.value?.trim()) {
        router.get(route('blogs.index'), { search: searchQuery.value.trim() })
    }
}
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
.blog-show__content :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: 12px;
}

.blog-show__content :deep(p) {
    margin-bottom: 1.25rem;
}

.blog-show__content :deep(h2),
.blog-show__content :deep(h3),
.blog-show__content :deep(h4) {
    margin: 1.5rem 0 1rem;
}

.blog-show__share {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: 32px;
    flex-wrap: wrap;
}

.blog-show__share-links {
    display: flex;
    align-items: center;
    gap: 12px;
}

.blog-show__share-links a {
    color: inherit;
    opacity: 0.8;
}

.blog-show__share-links a:hover {
    opacity: 1;
}

.blog-show__nav {
    display: grid;
    gap: 16px;
    margin-top: 40px;
}

@media (min-width: 768px) {
    .blog-show__nav {
        grid-template-columns: 1fr 1fr;
    }
}

.blog-show__nav-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
}

.blog-show__nav-item--next {
    text-align: end;
}

.blog-show__related {
    margin-top: 48px;
}

.blog-show__related .title {
    margin-bottom: 24px;
}

@media (min-width: 992px) {
    .col-right .blog-sidebar {
        position: sticky;
        top: 120px;
    }
}
</style>
