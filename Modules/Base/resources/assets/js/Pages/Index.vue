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
        <section class="section-hero">
            <SectMeta number="1" :label="trans('HERO')" />
            <span class="br-line"></span>
            <div class="sect-tagline">
                <div class="container">
                    <div class="sect-tagline_inner">
                        <span class="hafl-plus pst-left_bot wow bounceInScale"></span>
                        <span class="hafl-plus pst-right_bot wow bounceInScale"></span>
                        <p class="s-name text-caption font-2">
                            <span class="bar-group type-left"><span class="bar_center"></span></span>
                            <span class="hacker-text_transform no-delay">{{ trans('Our Tech Solutions') }}</span>
                            <span class="bar-group type-right"><span class="bar_center"></span></span>
                        </p>
                    </div>
                </div>
            </div>
            <span class="br-line"></span>
            <div class="sect-main">
                <div class="container">
                    <div class="sect-title wow fadeInUp">
                        <h1 class="s-title font-3">
                            {{ trans('Transform complex technical ideas into intelligent systems') }}
                            <br>
                            <span class="text-change_wrap">
                                <span class="text-change_rotating">{{ trans('Web Development') }}</span>
                                <span class="text-change_rotating">{{ trans('AI automation') }}</span>
                                <span class="text-change_rotating">{{ trans('Cloud services') }}</span>
                            </span>
                        </h1>
                        <p class="s-sub_title">
                            {{ trans('Help companies build practical technology solutions in Web, AI, automation, and cloud computing — designed for growth and sustainability') }}
                        </p>
                    </div>
                </div>
                <span class="br-line"></span>
                <div class="container">
                    <div class="sect-content position-relative">
                        <div class="box-ask-wrap">
                            <div class="box-ask text-center p-4">
                                <div class="d-flex flex-wrap justify-content-center gap-3">
                                    <Link :href="route('contact-us')" class="tf-btn style-2 style-high animate-btn animate-dark">
                                        {{ trans('Book your free consultation') }}
                                    </Link>
                                    <Link :href="route('services.index')" class="tf-btn style-high animate-btn">
                                        {{ trans('Explore Our Services') }}
                                    </Link>
                                </div>
                            </div>
                            <span class="hafl-plus pst-left_bot item_bot wow bounceInScale"></span>
                            <span class="hafl-plus pst-right_bot item_bot wow bounceInScale"></span>
                            <span class="hafl-plus pst-left_top item_top wow bounceInScale"></span>
                            <span class="hafl-plus pst-right_top item_top wow bounceInScale"></span>
                        </div>
                        <span class="line_section"></span>
                    </div>
                </div>
            </div>
            <span class="br-line"></span>
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
            <span class="br-line"></span>
            <HackerStrip />
            <span class="br-line"></span>
        </section>

        <section v-if="featuredCategories.length" class="section-feature" id="features">
            <SectMeta number="2" :label="trans('FEATURES')" />
            <span class="br-line"></span>
            <div class="sect-tagline">
                <div class="container">
                    <div class="sect-tagline_inner">
                        <span class="hafl-plus pst-left_bot wow bounceInScale"></span>
                        <span class="hafl-plus pst-right_bot wow bounceInScale"></span>
                        <p class="s-name text-caption font-2">
                            <span class="bar-group type-left"><span class="bar_center"></span></span>
                            <span class="hacker-text_transform no-delay">{{ trans('What We Do') }} — {{ trans('Core Services') }}</span>
                            <span class="bar-group type-right"><span class="bar_center"></span></span>
                        </p>
                    </div>
                </div>
            </div>
            <span class="br-line"></span>
            <div class="sect-main flat-animate-tab">
                <div class="s-img_item wow bounceInScale">
                    <img class="lazyload" :src="asset_path + 'qore/images/section/smoke-blue.webp'" :data-src="asset_path + 'qore/images/section/smoke-blue.webp'" alt="">
                </div>
                <div class="container">
                    <div class="sect-title wow fadeInUp">
                        <h2 class="s-title font-3">{{ trans('What We Do') }}</h2>
                        <p class="s-sub_title">
                            {{ trans("Transform your business with our innovative IT solutions, tailored to address your unique challenges and drive growth in today's digital landscape.") }}
                        </p>
                    </div>
                    <div class="tab-content">
                        <div
                            v-for="(category, index) in featuredCategories"
                            :key="category.id"
                            class="tab-pane"
                            :class="{ 'active show': index === 0 }"
                            :id="`service-cat-${category.id}`"
                            role="tabpanel"
                        >
                            <div class="image-with-text">
                                <img
                                    v-if="category.image_link"
                                    :src="category.image_link"
                                    :alt="translateField(category.title)"
                                    width="920"
                                    height="420"
                                    loading="lazy"
                                    decoding="async"
                                >
                                <div class="sect-title box-text">
                                    <h4 class="s-title">{{ translateField(category.title) }}</h4>
                                    <p class="s-sub_title text-body-3">{{ translateField(category.description) }}</p>
                                    <Link :href="route('services.index', { category: category.slug })" class="tf-btn animate-btn mt-3">
                                        {{ trans('View All Services') }}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ul class="tab-can_do" role="tablist">
                        <li
                            v-for="(category, index) in featuredCategories"
                            :key="`tab-${category.id}`"
                            class="nav-tab-item"
                            :class="{ active: index === 0 }"
                            role="presentation"
                        >
                            <div
                                class="btn_tab"
                                :class="{ active: index === 0 }"
                                data-bs-toggle="tab"
                                :data-bs-target="`#service-cat-${category.id}`"
                                role="tab"
                            >
                                {{ translateField(category.title) }}
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <span class="br-line"></span>
            <HackerStrip />
            <span class="br-line"></span>
        </section>

        <section class="section-benefit">
            <SectMeta number="3" :label="trans('BENEFITS')" />
            <span class="br-line"></span>
            <div class="sect-tagline">
                <div class="container">
                    <div class="sect-tagline_inner">
                        <span class="hafl-plus pst-left_bot wow bounceInScale"></span>
                        <span class="hafl-plus pst-right_bot wow bounceInScale"></span>
                        <p class="s-name text-caption font-2">
                            <span class="bar-group type-left"><span class="bar_center"></span></span>
                            <span class="hacker-text_transform no-delay">{{ trans('Why Choose Us') }}</span>
                            <span class="bar-group type-right"><span class="bar_center"></span></span>
                        </p>
                    </div>
                </div>
            </div>
            <span class="br-line"></span>
            <div class="sect-main">
                <div class="container">
                    <div class="place-video">
                        <div class="visual-object">
                            <div class="object_img wow bounceInScale">
                                <div class="image">
                                    <img :src="asset_path + 'qore/images/section/visual-object.png'" :alt="trans('Why Choose Us')" width="424" height="424" loading="lazy" decoding="async">
                                </div>
                                <span class="hafl-plus start-0 top-0 rotate-top_left wow bounceInScale"></span>
                                <span class="hafl-plus end-0 top-0 rotate-top_right wow bounceInScale"></span>
                            </div>
                        </div>
                        <div class="sect-title wow fadeInUp">
                            <h2 class="s-title font-3">{{ trans('Why Choose Symfonix for Web, AI, and Cloud') }}</h2>
                            <p class="s-sub_title">
                                {{ trans('We deliver exceptional products and services that consistently exceed expectations. Backed by years of experience and a proven track record, we are your reliable partner for success.') }}
                            </p>
                        </div>
                    </div>
                    <div class="position-relative">
                        <div class="grid-box_icon tf-grid-layout sm-col-2 md-col-3">
                            <div class="box-icon-text wow fadeInUp">
                                <div class="icon"><img :src="asset_path + 'qore/images/section/secure.svg'" alt=""></div>
                                <div class="content">
                                    <p class="title text-main-2">{{ trans('Developing Secure & Scalable Systems') }}</p>
                                    <p class="sub-title text-body-3">{{ trans('Unmatched Quality') }} — {{ trans('We deliver exceptional products and services that exceed expectations every time.') }}</p>
                                </div>
                            </div>
                            <div class="box-icon-text wow fadeInUp">
                                <div class="icon"><img :src="asset_path + 'qore/images/section/ai-core.svg'" alt=""></div>
                                <div class="content">
                                    <p class="title text-main-2">{{ trans('Innovative IT Solutions Expert') }}</p>
                                    <p class="sub-title text-body-3">{{ trans('Trusted Expertise') }} — {{ trans('Backed by years of experience and a proven track record, we are your reliable partner for success.') }}</p>
                                </div>
                            </div>
                            <div class="box-icon-text wow fadeInUp">
                                <div class="icon"><img :src="asset_path + 'qore/images/section/control.svg'" alt=""></div>
                                <div class="content">
                                    <p class="title text-main-2">{{ trans('User-Centric Approach') }}</p>
                                    <p class="sub-title text-body-3">{{ trans('Your satisfaction is our priority, and we tailor solutions to meet your unique needs. Your happiness comes first.') }}</p>
                                </div>
                            </div>
                            <div class="box-icon-text wow fadeInUp">
                                <div class="icon"><img :src="asset_path + 'qore/images/section/platform.svg'" alt=""></div>
                                <div class="content">
                                    <p class="title text-main-2">{{ trans('Harmony over chaos') }}</p>
                                    <p class="sub-title text-body-3">{{ trans('Every solution must be coherent. No messy stacks, no duct-tape architectures.') }}</p>
                                </div>
                            </div>
                            <div class="box-icon-text wow fadeInUp">
                                <div class="icon"><img :src="asset_path + 'qore/images/section/speed.svg'" alt=""></div>
                                <div class="content">
                                    <p class="title text-main-2">{{ trans('Speed that scales') }}</p>
                                    <p class="sub-title text-body-3">{{ trans('From personalized solutions to expert execution, we prioritize quality, reliability, and customer satisfaction') }}</p>
                                </div>
                            </div>
                            <div class="box-icon-text wow fadeInUp">
                                <div class="icon"><img :src="asset_path + 'qore/images/section/evolving.svg'" alt=""></div>
                                <div class="content">
                                    <p class="title text-main-2">{{ trans('Always evolving') }}</p>
                                    <p class="sub-title text-body-3">{{ trans('AI, cloud, and software evolve fast. We evolve faster.') }}</p>
                                </div>
                            </div>
                        </div>
                        <span class="hafl-plus pst-left_bot item_bot wow bounceInScale"></span>
                        <span class="hafl-plus pst-right_bot item_bot wow bounceInScale"></span>
                    </div>
                </div>
            </div>
            <span class="br-line"></span>
            <HackerStrip />
            <span class="br-line"></span>
        </section>

        <section class="section-how-to" id="howToUse">
            <SectMeta number="4" :label="trans('HOW TO')" />
            <span class="br-line"></span>
            <div class="sect-tagline">
                <div class="container">
                    <div class="sect-tagline_inner">
                        <span class="hafl-plus pst-left_bot wow bounceInScale"></span>
                        <span class="hafl-plus pst-right_bot wow bounceInScale"></span>
                        <p class="s-name text-caption font-2">
                            <span class="bar-group type-left"><span class="bar_center"></span></span>
                            <span class="hacker-text_transform no-delay">{{ trans('How do we deliver reliable, future-ready IT solutions?') }}</span>
                            <span class="bar-group type-right"><span class="bar_center"></span></span>
                        </p>
                    </div>
                </div>
            </div>
            <span class="br-line"></span>
            <div class="sect-main flat-animate-tab">
                <div class="s-img_item wow bounceInScale">
                    <img class="lazyload" :src="asset_path + 'qore/images/section/gradient-ring-bg.webp'" :data-src="asset_path + 'qore/images/section/gradient-ring-bg.webp'" alt="">
                </div>
                <div class="container">
                    <div class="sect-title wow fadeInUp">
                        <h2 class="s-title font-3 m-0">{{ trans('How do we deliver reliable, future-ready IT solutions?') }}</h2>
                    </div>
                    <div class="row">
                        <div class="col-md-6 offset-xl-1 col-xl-4">
                            <div class="tab-content mb-md-0 sticky-top wow fadeInUp">
                                <div class="tab-pane active show" id="home-step1" role="tabpanel">
                                    <div class="image-how_to wow bounceInScale">
                                        <img class="lazyload" :src="asset_path + 'qore/images/section/step-1.webp'" :data-src="asset_path + 'qore/images/section/step-1.webp'" :alt="trans('Discover')">
                                        <span class="hafl-plus start-0 top-0 rotate-top_left"></span>
                                        <span class="hafl-plus end-0 top-0 rotate-top_right"></span>
                                        <span class="hafl-plus start-0 bottom-0 item_bot rotate-bot_left"></span>
                                        <span class="hafl-plus end-0 bottom-0 item_bot rotate-bot_right"></span>
                                    </div>
                                </div>
                                <div class="tab-pane" id="home-step2" role="tabpanel">
                                    <div class="image-how_to">
                                        <img class="lazyload" :src="asset_path + 'qore/images/section/step-2.webp'" :data-src="asset_path + 'qore/images/section/step-2.webp'" :alt="trans('Build')">
                                        <span class="hafl-plus start-0 top-0 rotate-top_left"></span>
                                        <span class="hafl-plus end-0 top-0 rotate-top_right"></span>
                                        <span class="hafl-plus start-0 bottom-0 item_bot rotate-bot_left"></span>
                                        <span class="hafl-plus end-0 bottom-0 item_bot rotate-bot_right"></span>
                                    </div>
                                </div>
                                <div class="tab-pane" id="home-step3" role="tabpanel">
                                    <div class="image-how_to">
                                        <img class="lazyload" :src="asset_path + 'qore/images/section/step-3.webp'" :data-src="asset_path + 'qore/images/section/step-3.webp'" :alt="trans('Launch')">
                                        <span class="hafl-plus start-0 top-0 rotate-top_left"></span>
                                        <span class="hafl-plus end-0 top-0 rotate-top_right"></span>
                                        <span class="hafl-plus start-0 bottom-0 item_bot rotate-bot_left"></span>
                                        <span class="hafl-plus end-0 bottom-0 item_bot rotate-bot_right"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 offset-xl-2 col-xl-4">
                            <ul class="tab-how_to position-relative mx-1 wow fadeInUp" role="tablist">
                                <li class="nav-tab-item" role="presentation">
                                    <div data-bs-toggle="tab" data-bs-target="#home-step1" class="btn_tab active" role="tab">
                                        <p class="number-step text-caption font-2">STEP 01</p>
                                        <h5 class="name">{{ trans('Discover') }}</h5>
                                        <p class="desc">{{ trans('Transform complex technical ideas into intelligent systems') }}</p>
                                    </div>
                                </li>
                                <li class="br-line has-dot"></li>
                                <li class="nav-tab-item" role="presentation">
                                    <div data-bs-toggle="tab" data-bs-target="#home-step2" class="btn_tab" role="tab">
                                        <p class="number-step text-caption font-2">STEP 02</p>
                                        <h5 class="name">{{ trans('Build') }}</h5>
                                        <p class="desc">{{ trans('Developing Secure & Scalable Systems') }}</p>
                                    </div>
                                </li>
                                <li class="br-line has-dot"></li>
                                <li class="nav-tab-item" role="presentation">
                                    <div data-bs-toggle="tab" data-bs-target="#home-step3" class="btn_tab" role="tab">
                                        <p class="number-step text-caption font-2">STEP 03</p>
                                        <h5 class="name">{{ trans('Launch') }}</h5>
                                        <p class="desc">{{ trans('Help companies build practical technology solutions in Web, AI, automation, and cloud computing — designed for growth and sustainability') }}</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="position-relative has-hafl_plus">
                        <span class="hafl-plus pst-left_bot item_bot wow bounceInScale"></span>
                        <span class="hafl-plus pst-right_bot item_bot wow bounceInScale"></span>
                    </div>
                </div>
            </div>
            <span class="br-line"></span>
            <HackerStrip />
            <span class="br-line"></span>
        </section>

        <section v-if="products.length" class="section-pricing" id="pricing">
            <SectMeta number="5" :label="trans('PRODUCTS')" />
            <span class="br-line"></span>
            <div class="sect-main">
                <div class="container">
                    <div class="sect-title wow fadeInUp">
                        <h2 class="s-title font-3 m-0">{{ trans('B2B Solutions Built for Scale') }}</h2>
                    </div>
                    <div class="grid-pricing">
                        <div v-for="product in products" :key="product.id" class="wg-plan wow fadeInUp">
                            <div class="content">
                                <div class="plan-header">
                                    <div v-if="product.main_image_link" class="image mb-3">
                                        <img :src="product.main_image_link" :alt="product.name" loading="lazy">
                                    </div>
                                    <p class="plan_type text-body-1">{{ product.category?.name || trans('Product') }}</p>
                                    <h3 class="price-amount" style="font-size: 1.75rem;">{{ product.name }}</h3>
                                    <p class="plan-description">{{ product.short_description }}</p>
                                    <Link :href="route('product.show', product.slug)" class="tf-btn style-3 style-high animate-btn w-100">
                                        <span class="text-body-3">{{ trans('View Details') }}</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="text-center mt-4">
                        <Link :href="route('product.index')" class="tf-btn animate-btn">{{ trans('View All Products') }}</Link>
                    </div>
                </div>
            </div>
            <span class="br-line"></span>
            <HackerStrip />
            <span class="br-line"></span>
        </section>

        <section v-if="useCases.length" class="section-feature">
            <SectMeta number="6" :label="trans('CASE STUDIES')" />
            <span class="br-line"></span>
            <div class="sect-main">
                <div class="container">
                    <div class="sect-title wow fadeInUp">
                        <h2 class="s-title font-3">{{ trans("How We've Empowered Businesses with Innovative Tech Solutions") }}</h2>
                    </div>
                    <div class="tf-grid-layout sm-col-2">
                        <UseCaseCard v-for="item in useCases" :key="item.id" :item="item" />
                    </div>
                    <div class="text-center mt-4">
                        <Link :href="route('use-cases.index')" class="tf-btn animate-btn">{{ trans('Case Studies') }}</Link>
                    </div>
                </div>
            </div>
            <span class="br-line"></span>
            <HackerStrip />
            <span class="br-line"></span>
        </section>

        <section v-if="testimonials.length" class="section-testimonial">
            <SectMeta number="7" :label="trans('TESTIMONIALS')" />
            <span class="br-line"></span>
            <div class="sect-main">
                <div class="container">
                    <div class="sect-title wow fadeInUp">
                        <h2 class="s-title font-3 m-0">{{ trans('What Our Clients Say') }}</h2>
                    </div>
                    <div class="testimonial-slide-wrap">
                        <div class="overflow-hidden has-overlay_linear type-2 mx-1">
                            <div class="infiniteSlide infiniteSlide-tes">
                                <div v-for="testimonial in testimonials" :key="testimonial.id" class="wg-testimonial">
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
            <span class="br-line"></span>
            <HackerStrip />
            <span class="br-line"></span>
        </section>

        <section v-if="posts.length" class="section-page-blog home-blogs">
            <SectMeta number="8" :label="trans('BLOG')" />
            <span class="br-line"></span>
            <div class="sect-main">
                <div class="container">
                    <div class="sect-title wow fadeInUp">
                        <h2 class="s-title font-3">{{ trans('Blogs') }}</h2>
                    </div>
                    <div class="tf-grid-layout sm-col-2 md-col-3 home-blogs__grid">
                        <BlogCard
                            v-for="post in posts.slice(0, 3)"
                            :key="post.id"
                            :blog="post"
                            :show-description="true"
                        />
                    </div>
                    <div class="text-center mt-4">
                        <Link :href="route('blogs.index')" class="tf-btn animate-btn">{{ trans('Blogs') }}</Link>
                    </div>
                </div>
            </div>
            <span class="br-line"></span>
            <HackerStrip />
            <span class="br-line"></span>
        </section>
    </app-layout>
</template>

<script setup>
import { computed } from 'vue'
import { Head, Link, usePage } from '@inertiajs/vue3'
import AppLayout from '@/Layouts/App.vue'
import SectMeta from '@/Components/SectMeta.vue'
import HackerStrip from '@/Components/HackerStrip.vue'
import BlogCard from '@/Components/BlogCard.vue'
import UseCaseCard from '@/Components/UseCaseCard.vue'

const page = usePage()
const trans = (key) => page.props.translations[key] || key
const seo = computed(() => page.props.seo)
const settings = computed(() => page.props.settings || {})
const asset_path = computed(() => page.props.asset_path || '')
const locale = computed(() => page.props.locale)
const posts = computed(() => page.props.posts || [])
const servicesCategories = computed(() => page.props.servicesCategories || [])
const testimonials = computed(() => page.props.testimonials || [])
const useCases = computed(() => page.props.useCases || [])
const products = computed(() => page.props.products || [])
const clients = computed(() => page.props.clients || [])
const meta = computed(() => page.props.meta || {})
const featuredCategories = computed(() => servicesCategories.value.slice(0, 6))

const metaTitle = computed(() => meta.value.title || `${trans('Home')} | ${seo.value.website_name || ''}`.trim())
const metaDescription = computed(() => meta.value.description || trans('Empowering businesses with modern web, mobile, AI, and cloud solutions.') || seo.value.website_desc || '')
const metaKeywords = computed(() => meta.value.keywords || trans('IT solutions, web development, mobile apps, AI automation, cloud services') || seo.value.website_keywords || '')
const metaImage = computed(() => meta.value?.og?.image || meta.value?.twitter?.image || settings.value?.meta_img || '')
const metaCanonical = computed(() => meta.value.canonical || '')
const metaRobots = computed(() => meta.value.robots || 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1')

const translateField = (value) => {
    if (!value) return ''
    if (typeof value === 'string') return value
    const loc = locale.value
    if (typeof value === 'object' && value !== null && value[loc]) {
        return value[loc]
    }
    return ''
}
</script>
