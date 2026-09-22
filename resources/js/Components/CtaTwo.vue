<template>
    <section class="section-inner-cta">
        <span class="br-line"></span>
        <div class="sect-main">
            <div class="container">
                <div class="sect-title wow fadeInUp">
                    <h2 class="s-title font-3">{{ trans('Are you ready to take your project to the next stage?') }}</h2>
                    <p class="s-sub_title">{{ trans('Professional technical support and immediate solutions for your project to ensure the uninterrupted continuity of your business.') }}</p>
                    <Link :href="route('contact-us')" class="tf-btn style-2 style-high animate-btn animate-dark">
                        {{ trans('Book your free consultation') }}
                    </Link>
                    <p v-if="settings.email" class="text-body-3 mt-3">
                        <a :href="`mailto:${settings.email}`">{{ settings.email }}</a>
                        <span v-if="settings.phone"> · <a :href="`tel:${settings.phone}`">{{ settings.phone }}</a></span>
                    </p>
                </div>
            </div>
        </div>
        <span class="br-line"></span>
    </section>
</template>

<script setup>
import { computed } from 'vue'
import { Link, usePage } from '@inertiajs/vue3'

const page = usePage()
const trans = (key) => page.props.translations[key] || key
const settings = computed(() => page.props.settings || {})
</script>
