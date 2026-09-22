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
            :title="useCase.title"
            :crumbs="[
                { label: trans('Case Studies'), href: route('use-cases.index') },
                { label: useCase.title },
            ]"
        />

        <section class="section-page-use-detail flat-spacing-3">
            <div class="container">
                <div class="content-1200">
                    <div class="box-image-v01">
                        <div class="box_image">
                            <img
                                loading="lazy"
                                width="1200"
                                height="537"
                                :src="useCase.image_link"
                                :alt="useCase.title"
                            >
                        </div>
                        <div class="box_content">
                            <div class="box_content_wrap">
                                <p class="tag text-caption text-main-5 font-2">
                                    {{ useCase.category_tag || trans('Case Studies') }}
                                </p>
                                <h1 class="title text-linear font-3">{{ useCase.title }}</h1>
                                <div class="br-line has-dot"></div>
                                <p v-if="useCase.summary" class="desc text-line-clamp-3">
                                    {{ useCase.summary }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="page-blog_content detail">
                        <div class="col-left">
                            <div class="main-blog_detail">
                                <p v-if="useCase.summary" class="detail_text text-main-2">
                                    {{ useCase.summary }}
                                </p>

                                <div v-if="useCase.image_link" class="detail_image">
                                    <img
                                        loading="lazy"
                                        width="732"
                                        height="412"
                                        :src="useCase.image_link"
                                        :alt="useCase.title"
                                    >
                                </div>

                                <div
                                    v-if="useCase.challenge || useCase.solution || useCase.results"
                                    class="detail_feature_list"
                                >
                                    <div v-if="useCase.challenge" class="detail_feature item">
                                        <h4 class="title text-linear">{{ trans('The Challenge') }}</h4>
                                        <div class="box-text">
                                            <p>{{ useCase.challenge }}</p>
                                        </div>
                                    </div>
                                    <div v-if="useCase.solution" class="detail_feature item">
                                        <h4 class="title text-linear">{{ trans('Our Solution') }}</h4>
                                        <div class="box-text">
                                            <p>{{ useCase.solution }}</p>
                                        </div>
                                    </div>
                                    <div v-if="useCase.results" class="detail_feature item">
                                        <h4 class="title text-linear">{{ trans('The Results') }}</h4>
                                        <div class="box-text">
                                            <p>{{ useCase.results }}</p>
                                        </div>
                                    </div>
                                </div>

                                <div v-if="useCase.content" class="detail_text text-main-6" v-html="useCase.content"></div>

                                <div v-if="useCase.technologies?.length || useCase.project_url">
                                    <div class="br-line has-dot"></div>
                                    <div class="detail_tag">
                                        <ul v-if="useCase.technologies?.length" class="tag-list">
                                            <li class="text-body-3 text-white">{{ trans('Technologies Used') }}:</li>
                                            <li v-for="tech in useCase.technologies" :key="tech">
                                                <span class="text-body-3">{{ tech }}</span>
                                            </li>
                                        </ul>
                                        <a
                                            v-if="useCase.project_url"
                                            :href="useCase.project_url"
                                            target="_blank"
                                            rel="noopener"
                                            class="tf-btn animate-btn mt-3"
                                        >
                                            {{ trans('Visit Live Project') }}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <aside class="col-right d-none d-lg-block">
                            <div class="blog-sidebar sidebar-content-wrap">
                                <div class="sidebar-item">
                                    <h5 class="sb-title font-3 text-linear">{{ trans('Project Info') }}</h5>
                                    <div class="br-line has-dot"></div>
                                    <ul class="sb-category">
                                        <li v-if="useCase.client_name">
                                            <span>{{ trans('Client') }}: {{ useCase.client_name }}</span>
                                        </li>
                                        <li v-if="useCase.completed_year">
                                            <span>{{ trans('Year') }}: {{ useCase.completed_year }}</span>
                                        </li>
                                        <li v-if="useCase.category_tag">
                                            <span>{{ useCase.category_tag }}</span>
                                        </li>
                                    </ul>
                                    <Link :href="route('contact-us')" class="tf-btn animate-btn mt-3 w-100">
                                        {{ trans('Get in Touch') }}
                                    </Link>
                                </div>

                                <div v-if="relatedUseCases.length" class="sidebar-item">
                                    <h5 class="sb-title font-3 text-linear">{{ trans('More Case Studies') }}</h5>
                                    <div class="br-line has-dot"></div>
                                    <ul class="sb-recent">
                                        <li
                                            v-for="item in relatedUseCases"
                                            :key="item.id"
                                            class="sb-recent_item hover-img"
                                        >
                                            <Link
                                                :href="route('use-cases.show', item.slug)"
                                                class="recent__image img-style"
                                            >
                                                <img
                                                    :src="item.image_link"
                                                    :alt="item.title"
                                                    width="94"
                                                    height="94"
                                                    loading="lazy"
                                                >
                                            </Link>
                                            <div class="recent__content">
                                                <div v-if="item.completed_year" class="entry_date">
                                                    <i class="icon icon-Clock"></i>
                                                    <span class="date text-body-3">{{ item.completed_year }}</span>
                                                </div>
                                                <Link
                                                    :href="route('use-cases.show', item.slug)"
                                                    class="entry_name link"
                                                >
                                                    {{ item.title }}
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

        <section v-if="relatedUseCases.length" class="flat-spacing-3">
            <div class="container">
                <div class="content-1200">
                    <h2 class="box-head_section font-3 title-section text-linear text-center">
                        {{ trans('Explore More Success Stories') }}
                    </h2>
                    <div class="tf-grid-layout sm-col-2 md-col-3">
                        <UseCaseCard
                            v-for="item in relatedUseCases"
                            :key="item.id"
                            :item="item"
                            :locale="locale"
                            variant="compact"
                        />
                    </div>
                </div>
            </div>
        </section>

        <CtaTwo />
    </app-layout>
</template>

<script setup>
import { computed } from 'vue'
import { Head, Link, usePage } from '@inertiajs/vue3'
import PageTitle from '@/Components/PageTitle.vue'
import AppLayout from '@/Layouts/App.vue'
import CtaTwo from '@/Components/CtaTwo.vue'
import UseCaseCard from '@/Components/UseCaseCard.vue'

const page = usePage()
const trans = (key) => page.props.translations[key] || key
const seo = computed(() => page.props.seo)
const settings = computed(() => page.props.settings || {})
const locale = computed(() => page.props.locale || 'en')
const useCase = computed(() => page.props.useCase || {})
const relatedUseCases = computed(() => page.props.relatedUseCases || [])
const meta = computed(() => page.props.meta || {})

const metaTitle = computed(() => meta.value.title || `${useCase.value.title || trans('Case Studies')} | ${seo.value.website_name || ''}`.trim())
const metaDescription = computed(() => meta.value.description || useCase.value.summary || seo.value.website_desc || '')
const metaKeywords = computed(() => meta.value.keywords || (useCase.value.technologies || []).join(', ') || seo.value.website_keywords || '')
const metaImage = computed(() => meta.value?.og?.image || meta.value?.twitter?.image || useCase.value.image_link || settings.value?.meta_img || '')
const metaCanonical = computed(() => meta.value.canonical || '')
const metaRobots = computed(() => meta.value.robots || 'index, follow')
</script>
