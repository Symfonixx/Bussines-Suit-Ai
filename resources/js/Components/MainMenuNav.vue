<template>
    <header id="header" class="tf-header">
        <div class="container">
            <div class="row d-flex align-items-center">
                <div class="col-5 col-lg-3">
                    <div class="header-left">
                        <Link :href="homeUrl" class="logo-site" :aria-label="brandName">
                            <img v-if="logoSrc" :src="logoSrc" :alt="brandName" width="160" height="40">
                            <span v-else class="brand-text-logo">{{ brandName }}</span>
                        </Link>
                    </div>
                </div>
                <div class="col-6 d-none d-lg-block">
                    <nav class="box-navigation">
                        <MainMenuList />
                    </nav>
                </div>
                <div class="col-7 col-lg-3">
                    <div class="header-right">
                        <div class="btn_group">
                            <Link
                                v-if="!auth"
                                :href="loginUrl"
                                class="tf-btn text-body-3 animate-btn d-none d-sm-flex"
                            >
                                {{ trans('Login') }}
                            </Link>
                            <a href="#mobileMenu" class="btn-menu_mobile d-lg-none" data-bs-toggle="offcanvas">
                                <i class="icon icon-menu"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
import { computed } from 'vue'
import { Link, usePage } from '@inertiajs/vue3'
import MainMenuList from '@/Components/MainMenuList.vue'

const page = usePage()
const trans = (key) => page.props.translations?.[key] || key
const settings = computed(() => page.props.settings || {})
const storage_path = computed(() => page.props.storage_path || '')
const auth = computed(() => page.props.auth)
const locale = computed(() => page.props.locale || 'en')
const brandName = computed(() => page.props.seo?.website_name || page.props.appName || 'Symfonix')

const homeUrl = computed(() => {
    try { return route('home') } catch (e) { return `/${locale.value}` }
})
const loginUrl = computed(() => {
    try { return route('login') } catch (e) { return `/${locale.value}/login` }
})
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
</script>
