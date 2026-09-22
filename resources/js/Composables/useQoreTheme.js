import { onMounted, onUnmounted } from 'vue'
import { router } from '@inertiajs/vue3'

let wowInstance = null

const closeOffcanvas = () => {
    const open = document.querySelector('.offcanvas.show')
    if (!open || typeof window.bootstrap === 'undefined') {
        document.querySelectorAll('.offcanvas-backdrop').forEach((el) => el.remove())
        document.body.classList.remove('offcanvas-open', 'modal-open')
        document.body.style.removeProperty('overflow')
        document.body.style.removeProperty('padding-right')
        return
    }

    const instance = window.bootstrap.Offcanvas.getInstance(open)
        || window.bootstrap.Offcanvas.getOrCreateInstance(open)
    instance?.hide()
}

const resetWowVisibility = () => {
    document.querySelectorAll('.wow').forEach((el) => {
        if (el.style.visibility === 'hidden') {
            el.style.visibility = ''
        }
    })
}

const initWow = () => {
    if (typeof window.WOW === 'undefined') {
        return
    }

    resetWowVisibility()

    // Drop prior scroll listeners by replacing with a fresh instance.
    wowInstance = new window.WOW({
        live: false,
        offset: 40,
        mobile: true,
        resetAnimation: false,
    })
    wowInstance.init()
}

const refreshTheme = () => {
    closeOffcanvas()

    if (typeof window.ScrollTrigger !== 'undefined' && typeof window.ScrollTrigger.getAll === 'function') {
        window.ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }

    if (typeof window.initQoreTheme === 'function') {
        // main.js pageEffects also inits WOW; clear stuck hidden nodes first
        resetWowVisibility()
        window.initQoreTheme()
        // Re-run WOW after Inertia replaces DOM so below-fold sections animate
        window.setTimeout(initWow, 120)
        return
    }

    initWow()

    if (typeof window.ScrollTrigger !== 'undefined') {
        window.ScrollTrigger.refresh()
    }
}

export const useQoreTheme = () => {
    onMounted(() => {
        const run = () => window.setTimeout(refreshTheme, 60)
        run()
        const unregister = router.on('success', run)

        onUnmounted(() => {
            unregister()
        })
    })
}
