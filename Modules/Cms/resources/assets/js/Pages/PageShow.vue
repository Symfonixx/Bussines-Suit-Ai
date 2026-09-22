<template>
    <Head>
        <title>{{ metaTitle }}</title>
    </Head>
    <app-layout>


                <!--Page Header Start-->
        <PageTitle :title="custom_page.title[locale]" />
<!--Page Header End-->


        <div class="flat-spacing-3 qore-content">
            <div class="container">
                <div class="content mb-10">
                  <div v-html="custom_page.content[locale]"></div>
                </div>
            </div>
        </div>
     </app-layout>
</template>

<script setup>
import {computed} from 'vue'
import {usePage, Head, Link} from '@inertiajs/vue3'
import PageTitle from '@/Components/PageTitle.vue'

const page = usePage()
const trans = (key) => page.props.translations[key] || key;
const seo = computed(() => page.props.seo)
const custom_page = computed(() => page.props.custom_page)
const asset_path = computed(() => page.props.asset_path || '')
const locale = computed(() => page.props.locale || 'en')
const banner = computed(() => page.props.banner)

const metaTitle = computed(() => {
    const pageTitle = custom_page.value?.title?.[locale.value] || ''
    return `${pageTitle} | ${seo.value.website_name || ''}`.trim()
})
</script>
<script>


import AppLayout from '@/Layouts/App.vue';

export default {
    components: {
        AppLayout
    }

};
</script>
