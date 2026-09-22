<template>
    <article class="blog-article hover-img">
        <Link :href="cardUrl" class="entry_image img-style">
            <img
                v-if="item.main_image_link"
                :src="item.main_image_link"
                :alt="item.name"
                width="732"
                height="412"
                loading="lazy"
                decoding="async"
            >
            <div v-else class="product-card__placeholder" aria-hidden="true">
                <span class="icon icon-star"></span>
            </div>
        </Link>
        <div class="article_content">
            <p v-if="item.category" class="text-caption font-2 text-main-5">{{ item.category.name }}</p>
            <Link :href="cardUrl" class="entry_title font-3 h5 link text-main-2">{{ item.name }}</Link>
            <p v-if="item.short_description && variant !== 'compact'" class="entry_desc">
                {{ truncate(item.short_description, variant === 'compact' ? 80 : 130) }}
            </p>
            <div class="br-line has-dot"></div>
            <div class="entry_meta">
                <div v-if="item.is_featured" class="meta meta__tag">
                    <i class="icon icon-Tag"></i>
                    <span class="meta-text text-body-3">{{ trans('Featured') }}</span>
                </div>
                <Link :href="cardUrl" class="tf-btn text-body-3 animate-btn">{{ trans('View Details') }}</Link>
            </div>
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
        return route('product.show', props.item.slug)
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

<style scoped>
.product-card__placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    aspect-ratio: 732 / 412;
    background: rgba(255, 255, 255, 0.04);
    color: rgba(255, 255, 255, 0.35);
    font-size: 2rem;
}
</style>
