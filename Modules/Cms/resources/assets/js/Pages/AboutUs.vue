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
        <PageTitle :title="trans('About Us')" />

        <section class="section-hero-about flat-spacing-2">
            <div class="img-item-1">
                <img loading="lazy" width="1296" height="606" :src="asset_path + 'qore/images/item/color-bg-1.png'" :alt="trans('About Us')">
            </div>
            <div class="img-item-2">
                <img loading="lazy" width="1296" height="606" :src="asset_path + 'qore/images/item/pixel-texture.png'" :alt="trans('About Us')">
            </div>
            <div class="container">
                <div class="row">
                    <div class="col-lg-10 mx-auto">
                        <div class="sect-title wow fadeInUp">
                            <h2 class="s-title font-3 text-linear">
                                {{ trans('Supercharge Your Business Growth with Our Cutting-Edge IT Solutions') }}
                            </h2>
                            <p class="s-sub_title">
                                {{ trans('Symfonix is a technology company that designs, builds, and scales digital systems where web, mobile, AI, and cloud work together instead of fighting each other. The name says it all: a symphony of technologies, orchestrated with intention.') }}
                            </p>
                        </div>
                        <div class="image px-16 px-lg-0">
                            <img loading="lazy" width="1078" height="606" :src="asset_path + 'qore/images/section/hero-about.png'" :alt="trans('About our company')">
                        </div>
                    </div>
                    <div class="col-lg-4 offset-lg-1">
                        <div class="px-16 px-lg-0">
                            <p class="text-caption caption font-2 text-main-2">
                                {{ trans('About Us') }}
                            </p>
                            <h5 class="title-2 text-linear-2 font-3">
                                10 {{ trans('Years of') }} {{ trans('Experience') }}
                            </h5>
                            <p class="text-body-3 mb-lg-0">
                                {{ trans('Built in Syria. Designed for the world.') }}
                            </p>
                        </div>
                    </div>
                    <div class="col-lg-5 offset-lg-1">
                        <h4 class="font-3 px-16 px-lg-0">
                            {{ trans('Core Values (This is non-negotiable stuff)') }}
                        </h4>
                        <p class="s-sub_title px-16 px-lg-0">
                            {{ trans('Pretty UI is great, but solid architecture, performance, and maintainability come first.') }}
                            {{ trans("We say what's possible, what's risky, and what's unnecessary. No tech theater.") }}
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <div class="section-break">
            <div class="position-relative z-5">
                <div class="container">
                    <div class="has-hafl_plus">
                        <span class="hafl-plus pst-left_bot item_bot wow bounceInScale"></span>
                        <span class="hafl-plus pst-right_bot item_bot wow bounceInScale"></span>
                    </div>
                </div>
            </div>
            <span class="br-line"></span>
            <HackerStrip />
            <div class="position-relative z-5">
                <div class="container">
                    <div class="has-hafl_plus">
                        <span class="hafl-plus pst-left_bot item_top wow bounceInScale"></span>
                        <span class="hafl-plus pst-right_bot item_top wow bounceInScale"></span>
                    </div>
                </div>
            </div>
            <span class="br-line"></span>
        </div>

        <section class="flat-spacing-3">
            <div class="container">
                <div class="sect-title wow fadeInUp">
                    <h2 class="s-title font-3">
                        {{ trans('Why Choose Symfonix for Web, AI, and Cloud') }}
                    </h2>
                    <p class="s-sub_title">
                        {{ trans('We deliver exceptional products and services that consistently exceed expectations. Backed by years of experience and a proven track record, we are your reliable partner for success.') }}
                    </p>
                </div>
                <div class="grid-box_icon tf-grid-layout sm-col-2 md-col-3 pb-0">
                    <div
                        v-for="item in benefitItems"
                        :key="item.title"
                        class="box-icon-text wow fadeInUp"
                    >
                        <div class="icon">
                            <img :src="asset_path + item.icon" :alt="trans(item.title)">
                        </div>
                        <div class="content">
                            <p class="title text-main-2">{{ trans(item.title) }}</p>
                            <p class="sub-title text-body-3">{{ trans(item.text) }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <div class="section-break">
            <div class="position-relative z-5">
                <div class="container">
                    <div class="has-hafl_plus">
                        <span class="hafl-plus pst-left_bot item_bot wow bounceInScale"></span>
                        <span class="hafl-plus pst-right_bot item_bot wow bounceInScale"></span>
                    </div>
                </div>
            </div>
            <span class="br-line"></span>
            <HackerStrip />
            <div class="position-relative z-5">
                <div class="container">
                    <div class="has-hafl_plus">
                        <span class="hafl-plus pst-left_bot item_top wow bounceInScale"></span>
                        <span class="hafl-plus pst-right_bot item_top wow bounceInScale"></span>
                    </div>
                </div>
            </div>
            <span class="br-line"></span>
        </div>

        <section v-if="teams.length" class="section-team flat-spacing-3">
            <div class="container">
                <h2 class="s-title only-title font-3 text-center">
                    {{ trans('Meet Our Team.') }}
                </h2>
                <p class="s-sub_title text-center mb-5">
                    {{ trans('Our dedicated team combines expertise, creativity, and passion to deliver exceptional results and ensure your satisfaction every step of the way.') }}
                </p>
                <div class="row">
                    <div class="col-xl-10 mx-auto">
                        <div class="tf-grid-layout sm-col-2 lg-col-3 px-16 px-xl-0">
                            <component
                                v-for="team in teams"
                                :key="team.id"
                                :is="teamLink(team) ? 'a' : 'div'"
                                :href="teamLink(team) || undefined"
                                :target="teamLink(team) ? '_blank' : undefined"
                                :rel="teamLink(team) ? 'noopener noreferrer' : undefined"
                                class="card-team hover-img4"
                            >
                                <div class="content">
                                    <div class="team_image img-style4">
                                        <img loading="lazy" width="886" height="951" :src="team.avatar_link" :alt="translateField(team.name)">
                                    </div>
                                    <div class="team_info">
                                        <h5 class="name text-linear font-3">{{ translateField(team.name) }}</h5>
                                        <p class="text-body-3">{{ translateField(team.position) }}</p>
                                    </div>
                                </div>
                            </component>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <div class="section-break">
            <div class="position-relative z-5">
                <div class="container">
                    <div class="has-hafl_plus">
                        <span class="hafl-plus pst-left_bot item_bot wow bounceInScale"></span>
                        <span class="hafl-plus pst-right_bot item_bot wow bounceInScale"></span>
                    </div>
                </div>
            </div>
            <span class="br-line"></span>
            <HackerStrip />
            <div class="position-relative z-5">
                <div class="container">
                    <div class="has-hafl_plus">
                        <span class="hafl-plus pst-left_bot item_top wow bounceInScale"></span>
                        <span class="hafl-plus pst-right_bot item_top wow bounceInScale"></span>
                    </div>
                </div>
            </div>
            <span class="br-line"></span>
        </div>

        <section class="section-how-to flat-spacing-3">
            <div class="sect-main">
                <div class="container">
                    <div class="sect-title wow fadeInUp">
                        <h2 class="s-title font-3">{{ trans("How We've Empowered Businesses with Innovative Tech Solutions") }}</h2>
                        <p class="s-sub_title">
                            {{ trans('From personalized solutions to expert execution, we prioritize quality, reliability, and customer satisfaction') }}
                        </p>
                    </div>
                    <div class="row">
                        <div class="col-md-8 col-xl-6 mx-auto">
                            <ul class="tab-how_to position-relative mx-1 wow fadeInUp">
                                <li class="nav-tab-item">
                                    <div class="btn_tab active">
                                        <p class="number-step text-caption font-2">STEP 01</p>
                                        <h5 class="name">{{ trans('Discovery & Strategy') }}</h5>
                                        <p class="desc">{{ trans('We analyze your business needs, identify challenges, and craft a strategic roadmap for the best IT solutions.') }}</p>
                                    </div>
                                </li>
                                <li class="br-line has-dot"></li>
                                <li class="nav-tab-item">
                                    <div class="btn_tab">
                                        <p class="number-step text-caption font-2">STEP 02</p>
                                        <h5 class="name">{{ trans('Development') }}</h5>
                                        <p class="desc">{{ trans('Our expert team designs, develops, and integrates cutting-edge technology tailored to your goals.') }}</p>
                                    </div>
                                </li>
                                <li class="br-line has-dot"></li>
                                <li class="nav-tab-item">
                                    <div class="btn_tab">
                                        <p class="number-step text-caption font-2">STEP 03</p>
                                        <h5 class="name">{{ trans('Optimization & Support') }}</h5>
                                        <p class="desc">{{ trans('We ensure seamless performance with continuous improvements, maintenance, and dedicated support.') }}</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <div class="section-break">
            <div class="position-relative z-5">
                <div class="container">
                    <div class="has-hafl_plus">
                        <span class="hafl-plus pst-left_bot item_bot wow bounceInScale"></span>
                        <span class="hafl-plus pst-right_bot item_bot wow bounceInScale"></span>
                    </div>
                </div>
            </div>
            <span class="br-line"></span>
            <HackerStrip />
            <div class="position-relative z-5">
                <div class="container">
                    <div class="has-hafl_plus">
                        <span class="hafl-plus pst-left_bot item_top wow bounceInScale"></span>
                        <span class="hafl-plus pst-right_bot item_top wow bounceInScale"></span>
                    </div>
                </div>
            </div>
            <span class="br-line"></span>
        </div>

        <section v-if="testimonials.length" class="section-testimonial tes-2 flat-spacing-3">
            <div class="sect-main">
                <div class="s-img_item wow bounceInScale">
                    <img class="lazyload img-2" :src="asset_path + 'qore/images/section/color-bg.webp'" :data-src="asset_path + 'qore/images/section/color-bg.webp'" :alt="trans('Testimonials')">
                </div>
                <div class="container">
                    <div class="sect-title wow fadeInUp pt-0">
                        <h2 class="s-title font-3 m-0">{{ trans('What Our Clients Say') }}</h2>
                    </div>
                    <div class="testimonial-slide-wrap pb-0">
                        <div class="overflow-hidden has-overlay_linear type-2 mx-1">
                            <div class="infiniteSlide infiniteSlide-tes">
                                <div v-for="testimonial in testimonials" :key="'tes-a-' + testimonial.id" class="wg-testimonial">
                                    <div class="tes-author">
                                        <div class="author_image">
                                            <img :src="testimonial.avatar_link" :alt="translateField(testimonial.name)">
                                        </div>
                                        <div class="author_info">
                                            <span class="link name">{{ translateField(testimonial.name) }}</span>
                                            <p class="text-body-3">{{ translateField(testimonial.position) }}</p>
                                        </div>
                                    </div>
                                    <p class="tes-text">{{ translateField(testimonial.quote) }}</p>
                                </div>
                            </div>
                            <div class="infiniteSlide infiniteSlide-tes mb-0" data-style="right">
                                <div v-for="testimonial in reversedTestimonials" :key="'tes-b-' + testimonial.id" class="wg-testimonial">
                                    <div class="tes-author">
                                        <div class="author_image">
                                            <img :src="testimonial.avatar_link" :alt="translateField(testimonial.name)">
                                        </div>
                                        <div class="author_info">
                                            <span class="link name">{{ translateField(testimonial.name) }}</span>
                                            <p class="text-body-3">{{ translateField(testimonial.position) }}</p>
                                        </div>
                                    </div>
                                    <p class="tes-text">{{ translateField(testimonial.quote) }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <div v-if="testimonials.length && clients.length" class="section-break">
            <div class="position-relative z-5">
                <div class="container">
                    <div class="has-hafl_plus">
                        <span class="hafl-plus pst-left_bot item_bot wow bounceInScale"></span>
                        <span class="hafl-plus pst-right_bot item_bot wow bounceInScale"></span>
                    </div>
                </div>
            </div>
            <span class="br-line"></span>
            <HackerStrip />
            <div class="position-relative z-5">
                <div class="container">
                    <div class="has-hafl_plus">
                        <span class="hafl-plus pst-left_bot item_top wow bounceInScale"></span>
                        <span class="hafl-plus pst-right_bot item_top wow bounceInScale"></span>
                    </div>
                </div>
            </div>
            <span class="br-line"></span>
        </div>

        <div v-if="clients.length" class="tf-brand">
            <div class="container">
                <div class="tf-brand_inner">
                    <h5 class="title text-caption font-2 letter-space-0 fw-normal wow fadeInUp">
                        {{ trans('Trusted by companies we build with') }}
                    </h5>
                    <div class="infiniteSlide infiniteSlide_brand" data-clone="3">
                        <div v-for="client in clients" :key="client.id" class="image-brand">
                            <img :src="client.logo_link" :alt="client.name" loading="lazy">
                        </div>
                    </div>
                    <span class="hafl-plus pst-left_bot item_bot wow bounceInScale"></span>
                    <span class="hafl-plus pst-right_bot item_bot wow bounceInScale"></span>
                </div>
            </div>
        </div>

        <div class="section-break">
            <div class="position-relative z-5">
                <div class="container">
                    <div class="has-hafl_plus">
                        <span class="hafl-plus pst-left_bot item_bot wow bounceInScale"></span>
                        <span class="hafl-plus pst-right_bot item_bot wow bounceInScale"></span>
                    </div>
                </div>
            </div>
            <span class="br-line"></span>
            <HackerStrip />
            <div class="position-relative z-5">
                <div class="container">
                    <div class="has-hafl_plus">
                        <span class="hafl-plus pst-left_bot item_top wow bounceInScale"></span>
                        <span class="hafl-plus pst-right_bot item_top wow bounceInScale"></span>
                    </div>
                </div>
            </div>
            <span class="br-line"></span>
        </div>

        <section class="section-image-text flat-spacing-3">
            <div class="container">
                <div class="row">
                    <div class="col-lg-10 mx-auto">
                        <div class="px-16 px-xl-0">
                            <div class="banner-image-v01">
                                <div class="img-abs img-bg">
                                    <img loading="lazy" width="1078" height="369" :src="asset_path + 'qore/images/item/item-bg-3.png'" :alt="trans('Contact Us')">
                                </div>
                                <div class="content">
                                    <h3 class="title text-linear font-3">
                                        {{ trans('To make requests for further information, contact us') }}
                                    </h3>
                                    <p class="sub-title">
                                        {{ trans('Call Us For Any inquiry') }}
                                        <template v-if="settings.phone">
                                            <br>
                                            <a dir="ltr" :href="`tel:${settings.phone}`">{{ settings.phone }}</a>
                                        </template>
                                    </p>
                                    <Link :href="route('contact-us')" class="tf-btn text-body-3 style-2 style-high-2 animate-btn animate-dark">
                                        {{ trans('Get in Touch') }}
                                    </Link>
                                </div>
                                <div class="image">
                                    <img loading="lazy" width="498" height="308" :src="asset_path + 'qore/images/section/build-in/build-1.jpg'" :alt="trans('Get in Touch')">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </app-layout>
</template>

<script setup>
import { computed } from 'vue'
import { Head, Link, usePage } from '@inertiajs/vue3'
import AppLayout from '@/Layouts/App.vue'
import PageTitle from '@/Components/PageTitle.vue'
import HackerStrip from '@/Components/HackerStrip.vue'

const page = usePage()
const trans = (key) => page.props.translations[key] || key
const seo = computed(() => page.props.seo)
const settings = computed(() => page.props.settings || {})
const asset_path = computed(() => page.props.asset_path || '')
const locale = computed(() => page.props.locale || 'en')
const teams = computed(() => page.props.teams || [])
const testimonials = computed(() => page.props.testimonials || [])
const clients = computed(() => page.props.clients || [])
const meta = computed(() => page.props.meta || {})
const reversedTestimonials = computed(() => [...testimonials.value].reverse())

const metaTitle = computed(() => {
    return meta.value.title || `${trans('About Us')} | ${seo.value.website_name || ''}`.trim()
})
const metaDescription = computed(() => {
    return meta.value.description
        || trans('Learn about our team, mission, and the technology expertise behind our solutions.')
        || seo.value.website_desc
        || ''
})
const metaKeywords = computed(() => {
    return meta.value.keywords
        || trans('about us, IT consulting, technology experts, digital transformation')
        || seo.value.website_keywords
        || ''
})
const metaImage = computed(() => {
    return meta.value?.og?.image || meta.value?.twitter?.image || settings.value?.meta_img || ''
})
const metaCanonical = computed(() => meta.value.canonical || '')
const metaRobots = computed(() => meta.value.robots || 'index, follow')

const benefitItems = [
    {
        icon: 'qore/images/section/platform.svg',
        title: 'Harmony over chaos',
        text: 'Every solution must be coherent. No messy stacks, no duct-tape architectures.',
    },
    {
        icon: 'qore/images/section/ai-core.svg',
        title: 'Engineering first',
        text: 'Pretty UI is great, but solid architecture, performance, and maintainability come first.',
    },
    {
        icon: 'qore/images/section/control.svg',
        title: 'Truth & clarity',
        text: "We say what's possible, what's risky, and what's unnecessary. No tech theater.",
    },
    {
        icon: 'qore/images/section/evolving.svg',
        title: 'Continuous learning',
        text: 'AI, cloud, and software evolve fast. We evolve faster.',
    },
    {
        icon: 'qore/images/section/speed.svg',
        title: 'Unmatched Quality',
        text: 'We deliver exceptional products and services that exceed expectations every time.',
    },
    {
        icon: 'qore/images/section/secure.svg',
        title: 'User-Centric Approach',
        text: 'Your satisfaction is our priority, and we tailor solutions to meet your unique needs. Your happiness comes first.',
    },
]

const translateField = (value) => {
    if (!value) {
        return ''
    }
    if (typeof value === 'string') {
        return value
    }
    if (typeof value === 'object' && value !== null) {
        return value[locale.value] || value.en || value[Object.keys(value)[0]] || ''
    }
    return ''
}

const teamLink = (team) => team?.linked_in || team?.github || team?.behance || team?.facebook || ''
</script>
