<template>
    <div class="section-page-title">
        <div class="sect-tagline">
            <div class="container">
                <div class="sect-tagline_inner">
                    <span class="hafl-plus pst-left_bot wow bounceInScale"></span>
                    <span class="hafl-plus pst-right_bot wow bounceInScale"></span>
                    <div class="s-name text-caption font-2">
                        <span class="bar-group type-left">
                            <span class="bar_center"></span>
                        </span>
                        <div class="breadcrumbs-list">
                            <Link :href="homeUrl" class="text-white link font-2">
                                {{ trans('Home') }}
                            </Link>
                            <template v-for="(crumb, index) in crumbs" :key="index">
                                <span>/</span>
                                <Link
                                    v-if="crumb.href"
                                    :href="crumb.href"
                                    class="text-white link font-2"
                                >
                                    {{ crumb.label }}
                                </Link>
                                <span
                                    v-else
                                    class="hacker-text_transform no-delay current-page"
                                >
                                    {{ crumb.label }}
                                </span>
                            </template>
                        </div>
                        <span class="bar-group type-right">
                            <span class="bar_center"></span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <span class="br-line"></span>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { Link, usePage } from '@inertiajs/vue3'

const props = defineProps({
    title: { type: String, required: true },
    crumbs: { type: Array, default: () => [] },
})

const page = usePage()
const trans = (key) => page.props.translations?.[key] || key
const homeUrl = computed(() => {
    try {
        return route('home')
    } catch (e) {
        return '/'
    }
})

const crumbs = computed(() => {
    if (props.crumbs.length) {
        return props.crumbs
    }
    return [{ label: props.title }]
})
</script>
