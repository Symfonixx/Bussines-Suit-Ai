<template>
    <article class="blog-article hover-img">
        <Link :href="postUrl" class="entry_image img-style">
            <img :src="blog.image_link" :alt="blog.title" width="640" height="360" loading="lazy" decoding="async" @error="handleImageError">
        </Link>
        <div class="article_content">
            <Link :href="postUrl" class="entry_title font-3 h5 link text-main-2">{{ blog.title }}</Link>
            <p v-if="showDescription && blog.description" class="entry_desc">{{ blog.description }}</p>
            <div class="br-line has-dot"></div>
            <div class="entry_meta">
                <div v-if="dateText" class="meta meta__date">
                    <i class="icon icon-Clock"></i>
                    <span class="meta-text text-body-3">{{ dateText }}</span>
                </div>
                <div v-if="showCategory && blog.category" class="meta meta__tag">
                    <i class="icon icon-Tag"></i>
                    <span class="meta-text text-body-3">{{ blog.category.name }}</span>
                </div>
            </div>
        </div>
    </article>
</template>

<script setup>
import { computed } from 'vue'
import { Link, usePage } from '@inertiajs/vue3'

const props = defineProps({
    blog: {
        type: Object,
        required: true
    },
    locale: {
        type: String,
        default: 'en'
    },
    showDescription: {
        type: Boolean,
        default: true
    },
    showReadMore: {
        type: Boolean,
        default: true
    },
    showComments: {
        type: Boolean,
        default: true
    },
    showCategory: {
        type: Boolean,
        default: true
    },
    dateOverride: {
        type: String,
        default: ''
    }
})

const page = usePage()
const trans = (key) => page.props.translations?.[key] || key

const postUrl = computed(() => {
    if (!props.blog || !props.blog.slug) {
        return '#'
    }

    try {
        return route('blogs.show', props.blog.slug)
    } catch (e) {
        return '#'
    }
})

const dateText = computed(() => {
    if (props.dateOverride) {
        return props.dateOverride
    }

    const blog = props.blog || {}
    if (blog.created_at_formatted) {
        return blog.created_at_formatted
    }

    const monthDay = [blog.created_at_month, blog.created_at_day].filter(Boolean).join(' ')
    if (monthDay) {
        return monthDay
    }

    return blog.created_at || ''
})

const commentsCount = computed(() => {
    if (props.blog && typeof props.blog.comments_count !== 'undefined') {
        return props.blog.comments_count || 0
    }

    return 0
})

const readMoreLabel = computed(() => {
    const title = String(props.blog?.title || '').trim()
    if (!title) {
        return trans('Read article')
    }
    return `${trans('Read article')}: ${title.length > 50 ? title.substring(0, 50) + '...' : title}`
})

const handleImageError = (event) => {
    // If image fails to load, use fallback
    const assetPath = page.props.asset_path || ''
    const webpFallback = `${assetPath}site/images/blog/blog-2-1.webp`
    const jpgFallback = `${assetPath}site/images/blog/blog-2-1.jpg`
    if (!event.target.src.includes('blog-2-')) {
        event.target.src = webpFallback
    } else if (event.target.src.endsWith('.webp')) {
        event.target.src = jpgFallback
    }
}
</script>
