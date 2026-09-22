<template>
    <article class="blog-article hover-img">
        <Link :href="link" class="entry_image img-style">
            <img
                v-if="image"
                :src="image"
                :alt="title"
                width="732"
                height="412"
                loading="lazy"
                decoding="async"
            >
            <div v-else class="services-card__placeholder" aria-hidden="true">
                <span class="icon icon-star"></span>
            </div>
        </Link>
        <div class="article_content">
            <p v-if="categoryName" class="text-caption font-2 text-main-5">{{ categoryName }}</p>
            <Link :href="link" class="entry_title font-3 h5 link text-main-2">{{ title }}</Link>
            <p v-if="shortDescription" class="entry_desc">{{ shortDescription }}</p>
            <ul v-if="safeHighlights.length" class="services-card__tags">
                <li v-for="(item, index) in safeHighlights" :key="index">{{ item }}</li>
            </ul>
            <div class="br-line has-dot"></div>
            <div class="entry_meta">
                <div v-if="readingTime" class="meta meta__date">
                    <i class="icon icon-Clock"></i>
                    <span class="meta-text text-body-3">{{ readingTime }} {{ readingTimeLabel }}</span>
                </div>
                <Link :href="link" class="tf-btn text-body-3 animate-btn" :aria-label="buttonText">
                    {{ buttonText }}
                </Link>
            </div>
        </div>
    </article>
</template>

<script setup>
import { computed } from 'vue'
import { Link, usePage } from '@inertiajs/vue3'

const page = usePage()
const trans = (key) => page.props.translations?.[key] || key

const props = defineProps({
    title: { type: String, required: true },
    shortDesc: { type: String, default: '' },
    description: { type: String, default: '' },
    highlights: { type: Array, default: () => [] },
    link: { type: String, required: true },
    image: { type: String, default: '' },
    buttonLabel: { type: String, default: 'Read More' },
    isRtl: { type: Boolean, default: false },
    readingTime: { type: [Number, String], default: 0 },
    readingTimeLabel: { type: String, default: 'min read' },
    categoryName: { type: String, default: '' },
})

const parseMaybeJson = (value) => {
    if (typeof value !== 'string') {
        return value
    }
    const trimmed = value.trim()
    if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
        return value
    }
    try {
        return JSON.parse(trimmed)
    } catch (e) {
        try {
            return JSON.parse(trimmed.replace(/'/g, '"'))
        } catch (err) {
            return value
        }
    }
}

const normalizeHighlights = (items) => {
    if (!items) {
        return []
    }
    const rawItems = Array.isArray(items) ? items : [items]
    return rawItems
        .map((item) => parseMaybeJson(item))
        .flatMap((item) => {
            if (Array.isArray(item)) {
                return item
            }
            return [item]
        })
        .map((item) => {
            if (typeof item === 'string') {
                return item
            }
            if (item && typeof item === 'object') {
                if (item.value) {
                    return item.value
                }
                if (item.label) {
                    return item.label
                }
                return ''
            }
            return ''
        })
        .map((item) => String(item).replace(/^\s+|\s+$/g, ''))
        .filter(Boolean)
}

const safeHighlights = computed(() => normalizeHighlights(props.highlights).slice(0, 3))

const buttonText = computed(() => {
    if (props.buttonLabel && props.buttonLabel !== 'Read More') {
        return props.buttonLabel
    }
    return trans('View Details')
})

const shortDescription = computed(() => {
    const source = props.shortDesc || props.description
    if (!source) {
        return ''
    }
    const text = String(source).replace(/\s+/g, ' ').trim()
    if (text.length <= 140) {
        return text
    }
    return `${text.slice(0, 140)}…`
})
</script>

<style scoped>
.services-card__placeholder {
    width: 100%;
    min-height: 250px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.06);
    color: rgba(255, 255, 255, 0.45);
    font-size: 2rem;
}

.services-card__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 0 0 16px;
    padding: 0;
    list-style: none;
}

.services-card__tags li {
    padding: 6px 12px;
    border-radius: 999px;
    font-size: 12px;
    line-height: 1.2;
    color: rgba(255, 255, 255, 0.85);
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.12);
}

.entry_meta {
    width: 100%;
    justify-content: space-between;
}
</style>
