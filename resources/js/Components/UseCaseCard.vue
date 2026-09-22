<template>
    <article class="blog-article hover-img">
        <Link :href="cardUrl" class="entry_image img-style">
            <img :src="item.image_link" :alt="item.title" width="732" height="412" loading="lazy" decoding="async">
        </Link>
        <div class="article_content">
            <p v-if="item.category_tag" class="text-caption font-2 text-main-5">{{ item.category_tag }}</p>
            <Link :href="cardUrl" class="entry_title font-3 h5 link text-main-2">{{ item.title }}</Link>
            <p v-if="item.summary && variant !== 'compact'" class="entry_desc">
                {{ truncate(item.summary, variant === 'compact' ? 90 : 140) }}
            </p>
            <div class="br-line has-dot"></div>
            <Link :href="cardUrl" class="tf-btn text-body-3 animate-btn">{{ trans('View Case Study') }}</Link>
        </div>
    </article>
</template>

<script setup>
import { computed } from 'vue'
import { Link, usePage } from '@inertiajs/vue3'

const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
    locale: {
        type: String,
        default: 'en',
    },
    variant: {
        type: String,
        default: 'default',
    },
})

const page = usePage()
const trans = (key) => page.props.translations?.[key] || key

const cardUrl = computed(() => {
    if (!props.item?.slug) {
        return '#'
    }

    try {
        return route('use-cases.show', props.item.slug)
    } catch {
        return '#'
    }
})

const truncate = (text, length) => {
    if (!text) {
        return ''
    }

    return text.length > length ? `${text.substring(0, length)}…` : text
}
</script>
