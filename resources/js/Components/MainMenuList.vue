<template>
    <ul v-if="variant === 'mobile'" class="nav-ul-mb gap-0">
        <li v-for="item in items" :key="item.key" class="nav-mb-item">
            <template v-if="item.children?.length">
                <a
                    :href="`#mb-${item.key}`"
                    class="collapsed mb-menu-link"
                    data-bs-toggle="collapse"
                    aria-expanded="false"
                    :aria-controls="`mb-${item.key}`"
                >
                    <span>{{ item.label }}</span>
                    <span class="icon icon-arrow-caret-down"></span>
                </a>
                <div :id="`mb-${item.key}`" class="collapse">
                    <ul class="sub-nav-menu">
                        <li v-for="child in item.children" :key="child.key">
                            <a
                                v-if="child.external"
                                :href="child.href"
                                class="sub-nav-link"
                                :class="{ active: child.active }"
                                data-bs-dismiss="offcanvas"
                            >{{ child.label }}</a>
                            <Link
                                v-else
                                :href="child.href"
                                class="sub-nav-link"
                                :class="{ active: child.active }"
                                data-bs-dismiss="offcanvas"
                            >{{ child.label }}</Link>
                        </li>
                    </ul>
                </div>
            </template>
            <a
                v-else-if="item.external"
                :href="item.href"
                class="mb-menu-link"
                :class="{ 'is-active': item.active, active: item.active }"
                data-bs-dismiss="offcanvas"
            >
                <span>{{ item.label }}</span>
            </a>
            <Link
                v-else
                :href="item.href"
                class="mb-menu-link"
                :class="{ 'is-active': item.active, active: item.active }"
                data-bs-dismiss="offcanvas"
            >
                <span>{{ item.label }}</span>
            </Link>
        </li>
        <li class="nav-mb-item">
            <a href="#mb-lang" class="collapsed mb-menu-link" data-bs-toggle="collapse" aria-expanded="false">
                <span>{{ trans('Language') }}</span>
                <span class="icon icon-arrow-caret-down"></span>
            </a>
            <div id="mb-lang" class="collapse">
                <ul class="sub-nav-menu">
                    <li v-for="lang in languages" :key="lang.code">
                        <a href="#" class="sub-nav-link" :class="{ active: locale === lang.code }" @click.prevent="switchLocale(lang.code)">
                            {{ lang.label }}
                        </a>
                    </li>
                </ul>
            </div>
        </li>
    </ul>

    <ul v-else class="box-nav-menu main-nav_menu">
        <li
            v-for="item in items"
            :key="item.key"
            class="menu-item"
            :class="{ 'is-active': item.active }"
        >
            <a
                v-if="item.children?.length"
                href="javascript:void(0)"
                class="item-link tf-btn style-transparent text-body-3 animate-btn"
                :class="{ 'is-active': item.active, active: item.active }"
            >
                {{ item.label }}
                <i class="icon icon-arrow-caret-down fs-7"></i>
            </a>
            <a
                v-else-if="item.external"
                :href="item.href"
                class="item-link tf-btn style-transparent text-body-3 animate-btn"
                :class="{ 'is-active': item.active, active: item.active }"
            >
                {{ item.label }}
            </a>
            <Link
                v-else
                :href="item.href"
                class="item-link tf-btn style-transparent text-body-3 animate-btn"
                :class="{ 'is-active': item.active, active: item.active }"
            >
                {{ item.label }}
            </Link>
            <div v-if="item.children?.length" class="sub-menu">
                <ul class="sub-menu_list">
                    <li v-for="child in item.children" :key="child.key">
                        <a
                            v-if="child.external"
                            :href="child.href"
                            class="sub-menu_link"
                            :class="{ active: child.active }"
                        >{{ child.label }}</a>
                        <Link
                            v-else
                            :href="child.href"
                            class="sub-menu_link"
                            :class="{ active: child.active }"
                        >{{ child.label }}</Link>
                    </li>
                </ul>
            </div>
        </li>
        <li class="menu-item">
            <a href="javascript:void(0)" class="item-link tf-btn style-transparent text-body-3 animate-btn">
                {{ locale.toUpperCase() }}
                <i class="icon icon-arrow-caret-down fs-7"></i>
            </a>
            <div class="sub-menu">
                <ul class="sub-menu_list">
                    <li v-for="lang in languages" :key="lang.code">
                        <a
                            href="#"
                            class="sub-menu_link"
                            :class="{ active: locale === lang.code }"
                            @click.prevent="switchLocale(lang.code)"
                        >
                            {{ lang.label }}
                        </a>
                    </li>
                </ul>
            </div>
        </li>
    </ul>
</template>

<script setup>
import { computed } from 'vue'
import { Link, usePage } from '@inertiajs/vue3'

defineProps({
    variant: { type: String, default: 'desktop' },
})

const page = usePage()
const trans = (key) => page.props.translations?.[key] || key
const locale = computed(() => page.props.locale || 'en')
const headerPages = computed(() => page.props.headerPages || [])
const auth = computed(() => page.props.auth)
const portalTranslations = computed(() => page.props.portal?.translations || {})
const unreadCount = computed(() => page.props.portal?.unread_notifications || 0)

const portalLabel = (key) => {
    const parts = key.split('.')
    let value = portalTranslations.value
    for (const part of parts) {
        value = value?.[part]
    }
    if (typeof value === 'string') {
        return value
    }
    const fallbacks = {
        'menu.my_dashboard': 'My Dashboard',
        'menu.projects': 'My Projects',
        'menu.subscriptions': 'My Subscriptions',
        'menu.tickets': 'My Tickets',
        'menu.profile': 'My Profile',
        'menu.logout': 'Logout',
    }
    return fallbacks[key] || key
}

const localizedPath = (path = '') => {
    const normalized = path.startsWith('/') ? path : `/${path}`
    const localePrefix = locale.value ? `/${locale.value}` : ''
    if (!localePrefix) {
        return normalized === '/' ? '/' : normalized
    }
    if (normalized === '/') {
        return localePrefix
    }
    return `${localePrefix}${normalized}`
}

const safeRoute = (name, fallbackPath = '/', params = undefined) => {
    try {
        return params !== undefined ? route(name, params) : route(name)
    } catch (e) {
        return localizedPath(fallbackPath)
    }
}

const normalizePath = (path) => {
    if (!path) return ''
    const withoutQuery = path.split('?')[0]
    if (withoutQuery === '/') return '/'
    return withoutQuery.replace(/\/+$/, '')
}

const getPathFromUrl = (url) => {
    if (!url) return ''
    try {
        return new URL(url, window.location.origin).pathname
    } catch (e) {
        return url
    }
}

const expandPrefixes = (prefixes = []) => {
    const localePrefix = locale.value ? `/${locale.value}` : ''
    return prefixes.flatMap((prefix) => {
        const normalized = prefix.startsWith('/') ? prefix : `/${prefix}`
        if (!localePrefix) {
            return [normalized]
        }
        return [normalized, `${localePrefix}${normalized}`]
    })
}

const isActive = (routeName, options = {}) => {
    const routeNames = Array.isArray(routeName) ? routeName : [routeName]
    const prefixes = expandPrefixes(options.prefixes || [])
    const exactPaths = expandPrefixes(options.exact || [])
    const currentPath = normalizePath(getPathFromUrl(page.url) || page.url)

    if (exactPaths.some((path) => currentPath === normalizePath(path))) {
        return true
    }

    if (prefixes.some((prefix) => {
        const normalized = normalizePath(prefix)
        return currentPath === normalized || currentPath.startsWith(`${normalized}/`)
    })) {
        return true
    }

    try {
        return routeNames.some((name) => route().current(name))
    } catch (e) {
        return false
    }
}

const isCurrentUrl = (targetUrl) => normalizePath(getPathFromUrl(targetUrl)) === normalizePath(page.url)

const isPageActive = (pageItem) => {
    if (!pageItem?.slug) return false
    try {
        return isCurrentUrl(route('page.view', pageItem.slug))
    } catch (e) {
        return false
    }
}

const switchLocale = (newLocale) => {
    const currentPath = window.location.pathname
    const currentLocale = locale.value
    let pathWithoutLocale = currentPath
    if (currentLocale && currentPath.startsWith(`/${currentLocale}`)) {
        pathWithoutLocale = currentPath.substring(`/${currentLocale}`.length) || '/'
    }
    if (!pathWithoutLocale.startsWith('/')) {
        pathWithoutLocale = `/${pathWithoutLocale}`
    }
    const newPath = `/${newLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`
    window.location.href = newPath + window.location.search + window.location.hash
}

const pageTitle = (cmsPage) => {
    const title = cmsPage?.title
    if (!title) return ''
    if (typeof title === 'string') return title
    return title[locale.value] || title.en || Object.values(title)[0] || ''
}

const languages = computed(() => [
    { code: 'ar', label: trans('Arabic') },
    { code: 'en', label: trans('English') },
    { code: 'tr', label: trans('Turkish') },
    { code: 'de', label: trans('German') },
])

const items = computed(() => {
    const list = [
        { key: 'home', label: trans('Home'), href: safeRoute('home', '/'), active: isActive('home', { exact: ['/'] }) },
        { key: 'about', label: trans('About Us'), href: safeRoute('about-us', '/about-us'), active: isActive('about-us', { prefixes: ['/about-us'] }) },
        { key: 'services', label: trans('Our Services'), href: safeRoute('services.index', '/services'), active: isActive(['services.index', 'services.show'], { prefixes: ['/services', '/service'] }) },
        { key: 'cases', label: trans('Case Studies'), href: safeRoute('use-cases.index', '/use-cases'), active: isActive(['use-cases.index', 'use-cases.show'], { prefixes: ['/use-cases', '/portfolio'] }) },
        { key: 'products', label: trans('Products'), href: safeRoute('product.index', '/products'), active: isActive(['product.index', 'product.show'], { prefixes: ['/products', '/product'] }) },
        { key: 'blogs', label: trans('Blogs'), href: safeRoute('blogs.index', '/blogs'), active: isActive(['blogs.index', 'blogs.show'], { prefixes: ['/blogs', '/blog'] }) },
    ]

    if (headerPages.value.length) {
        list.push({
            key: 'pages',
            label: trans('Pages'),
            href: safeRoute('page.view', '/p', headerPages.value[0].slug),
            active: isActive('page.view', { prefixes: ['/p'] }),
            children: headerPages.value.map((cmsPage) => ({
                key: `page-${cmsPage.id}`,
                label: pageTitle(cmsPage),
                href: safeRoute('page.view', `/p/${cmsPage.slug}`, cmsPage.slug),
                active: isPageActive(cmsPage),
            })),
        })
    }

    list.push({
        key: 'contact',
        label: trans('Contact Us'),
        href: safeRoute('contact-us', '/contact-us'),
        active: isActive('contact-us', { prefixes: ['/contact-us'] }),
    })

    if (auth.value?.type === 'admin') {
        list.push({
            key: 'dashboard',
            label: trans('Dashboard'),
            href: localizedPath('/admin/dashboard'),
            external: true,
            active: false,
        })
    } else if (auth.value?.type === 'customer') {
        const badge = unreadCount.value ? ` (${unreadCount.value})` : ''
        list.push({
            key: 'portal',
            label: auth.value.name || trans('Account'),
            href: safeRoute('portal.dashboard', '/portal'),
            active: isActive('portal.dashboard'),
            children: [
                { key: 'p-dash', label: portalLabel('menu.my_dashboard'), href: safeRoute('portal.dashboard', '/portal'), active: isActive('portal.dashboard') },
                { key: 'p-projects', label: portalLabel('menu.projects') + badge, href: safeRoute('portal.projects.index', '/portal/projects'), active: isActive(['portal.projects.index', 'portal.projects.show'], { prefixes: ['/portal/projects'] }) },
                { key: 'p-subs', label: portalLabel('menu.subscriptions'), href: safeRoute('portal.subscriptions.index', '/portal/subscriptions'), active: isActive('portal.subscriptions.index', { prefixes: ['/portal/subscriptions'] }) },
                { key: 'p-tickets', label: portalLabel('menu.tickets'), href: safeRoute('portal.tickets.index', '/portal/tickets'), active: isActive(['portal.tickets.index', 'portal.tickets.create', 'portal.tickets.show'], { prefixes: ['/portal/tickets'] }) },
                { key: 'p-profile', label: portalLabel('menu.profile'), href: safeRoute('portal.profile.index', '/portal/profile'), active: isActive('portal.profile.index', { prefixes: ['/portal/profile'] }) },
            ],
        })
    }

    return list
})
</script>
