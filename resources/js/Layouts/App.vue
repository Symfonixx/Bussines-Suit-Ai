<template>
    <div v-if="isPortalPage" class="portal-shell-root">
        <slot />
    </div>

    <div v-else id="wrapper">
        <span class="line_page"></span>
        <div class="overlay_body"></div>
        <div class="texture_page">
            <div class="bg-texture"></div>
            <div class="temp"></div>
            <div class="bg-texture"></div>
        </div>
        <div v-if="isHomePage" class="hero-video">
            <video muted autoplay loop playsinline>
                <source :src="asset_path + 'qore/images/video/BlackHole.mp4'" type="video/mp4">
            </video>
            <div class="orther-overlay"></div>
        </div>

        <MainMenuNav />
        <span class="br-line"></span>

        <slot />

        <section v-if="showNewsletter" class="section-cta">
            <SectMeta number="8" :total="8" :label="trans('GET STARTED')" />
            <span class="br-line"></span>
            <div class="sect-tagline">
                <div class="container">
                    <div class="sect-tagline_inner">
                        <span class="hafl-plus pst-left_bot wow bounceInScale"></span>
                        <span class="hafl-plus pst-right_bot wow bounceInScale"></span>
                        <h6 class="s-name text-caption font-2">
                            <span class="bar-group type-left"><span class="bar_center"></span></span>
                            <span class="hacker-text_transform no-delay">{{ trans('GET STARTED TODAY.') }}</span>
                            <span class="bar-group type-right"><span class="bar_center"></span></span>
                        </h6>
                    </div>
                </div>
            </div>
            <span class="br-line"></span>
            <div class="sect-main position-relative">
                <div class="s-img_item">
                    <img class="lazyload" :src="asset_path + 'qore/images/section/color-bg-2.webp'" :data-src="asset_path + 'qore/images/section/color-bg-2.webp'" alt="">
                </div>
                <div class="container">
                    <div class="sect-title wow fadeInUp">
                        <h2 class="s-title font-3">{{ trans('Subscribe to Our Newsletter') }}</h2>
                        <p class="s-sub_title">
                            {{ trans('Engineering insights, product updates, and practical tech lessons—delivered occasionally, not daily') }}
                        </p>
                    </div>
                    <form class="symfonix-cta-form" @submit.prevent="handleSubscribeSubmit">
                        <div class="form-content">
                            <input
                                type="email"
                                name="email"
                                v-model="subscribeForm.email"
                                :placeholder="trans('Enter your email address')"
                                :disabled="subscribeForm.processing"
                                required
                            >
                            <button type="submit" class="tf-btn style-2 style-high animate-btn" :disabled="subscribeForm.processing">
                                <span>{{ subscribeForm.processing ? trans('Subscribing...') : trans('Subscribe Now') }}</span>
                            </button>
                        </div>
                        <div v-if="subscribeForm.errors.email" class="text-danger mt-2 text-center small">
                            {{ subscribeForm.errors.email }}
                        </div>
                        <p class="text-body-3 text-center mt-3">
                            <Link :href="privacyUrl">{{ trans('By subscribing, you accept our privacy policy') }}</Link>
                        </p>
                        <div v-if="subscribeSuccess" class="alert alert-success mt-3 text-center">
                            {{ trans('Thank you for subscribing to our newsletter!') }}
                        </div>
                    </form>
                </div>
            </div>
            <span class="br-line"></span>
            <HackerStrip />
            <span class="br-line"></span>
        </section>

        <footer class="tf-footer">
            <div v-if="isHomePage" class="sect-header">
                <div class="container">
                    <div class="s-meta text-caption font-2">
                        <p class="s-number_order wg-counter">
                            [ <span class="text-white">0<span class="odometer" data-number="9">0</span></span> / 09 ]
                        </p>
                        <p class="s-label">[ <span class="text-white hacker-text_transform">{{ trans('FOOTER') }}</span> ]</p>
                    </div>
                </div>
            </div>
            <span v-if="isHomePage" class="br-line"></span>
            <template v-else>
                <div class="container">
                    <div class="has-hafl_plus">
                        <span class="hafl-plus pst-left_bot item_bot wow bounceInScale"></span>
                        <span class="hafl-plus pst-right_bot item_bot wow bounceInScale"></span>
                    </div>
                </div>
                <span class="br-line"></span>
            </template>
            <div class="footer-body">
                <div class="container">
                    <div class="footer-inner-wrap">
                        <div class="footer-inner_link tf-grid-layout tf-col-2 lg-col-4">
                            <Link :href="homeUrl" class="footer-logo logo-site">
                                <img v-if="logoSrc" :src="logoSrc" :alt="brandName">
                                <span v-else class="brand-text-logo">{{ brandName }}</span>
                            </Link>
                            <div class="footer-col-block wow fadeInLeft mx-auto m-sm-0">
                                <h5 class="footer-heading footer-heading-mobile font-2">{{ trans('Quick Links') }}</h5>
                                <div class="tf-collapse-content">
                                    <ul class="footer-menu-list">
                                        <li><Link :href="homeUrl" class="link text-main-2">{{ trans('Home') }}</Link></li>
                                        <li><Link :href="aboutUrl" class="link text-main-2">{{ trans('About Us') }}</Link></li>
                                        <li><Link :href="servicesUrl" class="link text-main-2">{{ trans('Our Services') }}</Link></li>
                                        <li><Link :href="productsUrl" class="link text-main-2">{{ trans('Products') }}</Link></li>
                                        <li><Link :href="casesUrl" class="link text-main-2">{{ trans('Case Studies') }}</Link></li>
                                        <li><Link :href="blogsUrl" class="link text-main-2">{{ trans('Blogs') }}</Link></li>
                                        <li><Link :href="contactUrl" class="link text-main-2">{{ trans('Contact Us') }}</Link></li>
                                        <li><Link :href="jobsUrl" class="link text-main-2">{{ trans('Careers') }}</Link></li>
                                    </ul>
                                </div>
                            </div>
                            <div class="footer-col-block wow fadeInLeft">
                                <h5 class="footer-heading footer-heading-mobile font-2">{{ trans('Pages') }}</h5>
                                <div class="tf-collapse-content">
                                    <ul class="footer-menu-list">
                                        <li><Link :href="teamUrl" class="link text-main-2">{{ trans('Our Members') }}</Link></li>
                                        <li><Link :href="faqUrl" class="link text-main-2">{{ trans('FAQs') }}</Link></li>
                                        <li><Link :href="privacyUrl" class="link text-main-2">{{ trans('Privacy Policy') }}</Link></li>
                                        <li v-for="cmsPage in footerPages" :key="cmsPage.id">
                                            <Link :href="pageUrl(cmsPage)" class="link text-main-2">{{ pageTitle(cmsPage) }}</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="footer-col-block wow fadeInLeft mx-auto m-sm-0">
                                <h5 class="footer-heading footer-heading-mobile font-2">{{ trans('Follow Us') }}</h5>
                                <div class="tf-collapse-content">
                                    <ul class="footer-menu-list">
                                        <li v-if="settings.twitter"><a :href="settings.twitter" class="link text-main-2" target="_blank" rel="noopener">Twitter (X)</a></li>
                                        <li v-if="settings.github"><a :href="settings.github" class="link text-main-2" target="_blank" rel="noopener">Github</a></li>
                                        <li v-if="settings.linkedin"><a :href="settings.linkedin" class="link text-main-2" target="_blank" rel="noopener">LinkedIn</a></li>
                                        <li v-if="settings.facebook"><a :href="settings.facebook" class="link text-main-2" target="_blank" rel="noopener">Facebook</a></li>
                                        <li v-if="settings.instagram"><a :href="settings.instagram" class="link text-main-2" target="_blank" rel="noopener">Instagram</a></li>
                                        <li v-if="settings.email"><a :href="`mailto:${settings.email}`" class="link text-main-2">{{ settings.email }}</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <span class="br-line has-dot"></span>
                        <div class="footer-inner_bottom">
                            <p class="text-caption font-2">
                                {{ trans('All rights are reserved') }} {{ new Date().getFullYear() }} © {{ brandName }}
                            </p>
                            <a href="#goTop" class="text-caption font-2 link" @click.prevent="scrollTop">
                                {{ trans('Go Back Top') }}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    </div>

    <div v-if="!isPortalPage" class="offcanvas offcanvas-start canvas-mb" id="mobileMenu" tabindex="-1">
        <div class="canvas-header">
            <div class="logo-site">
                <img v-if="logoSrc" :src="logoSrc" :alt="brandName">
                <span v-else class="brand-text-logo">{{ brandName }}</span>
            </div>
            <div class="btn_group">
                <Link :href="contactUrl" class="tf-btn style-2" data-bs-dismiss="offcanvas">
                    {{ trans('Get started') }}
                </Link>
                <span class="icon-close-popup" data-bs-dismiss="offcanvas">
                    <i class="icon-close"></i>
                </span>
            </div>
        </div>
        <span class="br-line"></span>
        <div class="canvas-body">
            <MainMenuList variant="mobile" />
        </div>
        <div class="canvas-footer">
            <Link v-if="!auth" :href="loginUrl" class="tf-btn w-100 animate-btn style-high" data-bs-dismiss="offcanvas">
                {{ trans('Login') }}
            </Link>
            <Link v-else :href="contactUrl" class="tf-btn w-100 animate-btn style-high" data-bs-dismiss="offcanvas">
                {{ trans('Contact Us') }}
            </Link>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Link, useForm, usePage } from '@inertiajs/vue3'
import MainMenuList from '@/Components/MainMenuList.vue'
import MainMenuNav from '@/Components/MainMenuNav.vue'
import HackerStrip from '@/Components/HackerStrip.vue'
import SectMeta from '@/Components/SectMeta.vue'
import { useQoreTheme } from '@/Composables/useQoreTheme'

const page = usePage()
useQoreTheme()

const trans = (key) => page.props.translations?.[key] || key
const settings = computed(() => page.props.settings || {})
const storage_path = computed(() => page.props.storage_path || '')
const asset_path = computed(() => page.props.asset_path || '')
const locale = computed(() => page.props.locale)
const seo = computed(() => page.props.seo || {})
const brandName = computed(() => seo.value?.website_name || page.props.appName || 'Symfonix')
const footerPages = computed(() => page.props.footerPages || [])
const auth = computed(() => page.props.auth)
const isPortalPage = computed(() => /\/portal(\/|$)/.test(page.url))
const isHomePage = computed(() => {
    try {
        return route().current('home')
    } catch (e) {
        const path = page.url.split('?')[0]
        return path === '/' || path === `/${locale.value}` || path === `/${locale.value}/`
    }
})
const isAuthPage = computed(() => {
    try {
        return route().current('login')
            || route().current('register')
            || route().current('password.request')
            || route().current('password.reset')
            || route().current('two-factor.login')
            || route().current('password.confirm')
    } catch (e) {
        return /\/(login|register|forgot-password|reset-password|two-factor-challenge)(\/|$|\?)/.test(page.url)
    }
})
const showNewsletter = computed(() => !isPortalPage.value && !isAuthPage.value)

const logoSrc = computed(() => {
    const logo = settings.value?.site_logo
    if (!logo || logo === false || logo === 'false' || logo === 'default.jpg') {
        return ''
    }
    if (/^https?:\/\//i.test(logo) || String(logo).startsWith('//') || String(logo).startsWith('/')) {
        return logo
    }
    return `${storage_path.value}${logo}`
})

const safeRoute = (name, fallback = '/') => {
    try {
        return route(name)
    } catch (e) {
        return fallback
    }
}

const homeUrl = computed(() => safeRoute('home', '/'))
const aboutUrl = computed(() => safeRoute('about-us', '/about-us'))
const servicesUrl = computed(() => safeRoute('services.index', '/services'))
const productsUrl = computed(() => safeRoute('product.index', '/products'))
const casesUrl = computed(() => safeRoute('use-cases.index', '/use-cases'))
const blogsUrl = computed(() => safeRoute('blogs.index', '/blogs'))
const contactUrl = computed(() => safeRoute('contact-us', '/contact-us'))
const jobsUrl = computed(() => safeRoute('jobs.index', '/jobs'))
const teamUrl = computed(() => safeRoute('team', '/team'))
const faqUrl = computed(() => safeRoute('faq', '/faq'))
const privacyUrl = computed(() => safeRoute('privacy-policy', '/privacy-policy'))
const loginUrl = computed(() => safeRoute('login', '/login'))

const pageTitle = (cmsPage) => {
    const title = cmsPage?.title
    if (!title) return ''
    if (typeof title === 'string') return title
    return title[locale.value] || title.en || Object.values(title)[0] || ''
}

const pageUrl = (cmsPage) => {
    if (!cmsPage?.slug) return '#'
    try {
        return route('page.view', cmsPage.slug)
    } catch (e) {
        return '#'
    }
}

const subscribeSuccess = ref(false)
const subscribeForm = useForm({ email: '' })

const handleSubscribeSubmit = () => {
    if (subscribeForm.processing || !subscribeForm.email?.trim()) {
        return false
    }
    subscribeForm.post(route('subscribe'), {
        preserveScroll: true,
        preserveState: true,
        onBefore: () => { subscribeSuccess.value = false },
        onSuccess: () => {
            subscribeSuccess.value = true
            subscribeForm.reset()
            subscribeForm.clearErrors()
            setTimeout(() => { subscribeSuccess.value = false }, 5000)
        },
        onError: () => { subscribeSuccess.value = false },
    })
    return false
}

const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>
