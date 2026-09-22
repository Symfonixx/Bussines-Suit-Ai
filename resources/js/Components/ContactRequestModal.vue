<template>
    <div
        class="modal fade product-contact-modal"
        :id="modalId"
        tabindex="-1"
        :aria-labelledby="`${modalId}Label`"
        aria-hidden="true"
        ref="modalElement"
    >
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header border-0 pb-0">
                    <h5 class="modal-title" :id="`${modalId}Label`">{{ title }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" :aria-label="trans('Close')"></button>
                </div>
                <div class="modal-body pt-2">
                    <p v-if="description" class="product-contact-modal__description mb-4">{{ description }}</p>
                    <form @submit.prevent="handleSubmit" class="form-get_in">
                        <div class="form-content-2">
                            <div class="tf-grid-layout sm-col-2">
                                <fieldset>
                                    <label class="label-text text-body-3">{{ trans('Full Name') }}</label>
                                    <input
                                        v-model="contactForm.name"
                                        type="text"
                                        name="name"
                                        :placeholder="trans('Full Name')"
                                        :class="{ error: contactForm.errors.name }"
                                        :disabled="contactForm.processing"
                                        required
                                    >
                                    <div v-if="contactForm.errors.name" class="text-danger mt-1 small">
                                        {{ contactForm.errors.name }}
                                    </div>
                                </fieldset>
                                <fieldset>
                                    <label class="label-text text-body-3">{{ trans('Email') }}</label>
                                    <input
                                        v-model="contactForm.email"
                                        type="email"
                                        name="email"
                                        :placeholder="trans('Email')"
                                        :class="{ error: contactForm.errors.email }"
                                        :disabled="contactForm.processing"
                                        required
                                    >
                                    <div v-if="contactForm.errors.email" class="text-danger mt-1 small">
                                        {{ contactForm.errors.email }}
                                    </div>
                                </fieldset>
                            </div>
                            <div class="tf-grid-layout sm-col-2">
                                <fieldset>
                                    <label class="label-text text-body-3">{{ trans('Phone Number') }}</label>
                                    <input
                                        v-model="contactForm.mobile"
                                        type="text"
                                        name="mobile"
                                        :placeholder="trans('Phone Number')"
                                        :class="{ error: contactForm.errors.mobile }"
                                        :disabled="contactForm.processing"
                                        required
                                    >
                                    <div v-if="contactForm.errors.mobile" class="text-danger mt-1 small">
                                        {{ contactForm.errors.mobile }}
                                    </div>
                                </fieldset>
                                <fieldset>
                                    <label class="label-text text-body-3">{{ trans('Subject') }}</label>
                                    <input
                                        v-model="contactForm.subject"
                                        type="text"
                                        name="subject"
                                        :placeholder="trans('Subject')"
                                        :class="{ error: contactForm.errors.subject }"
                                        :disabled="contactForm.processing"
                                        required
                                    >
                                    <div v-if="contactForm.errors.subject" class="text-danger mt-1 small">
                                        {{ contactForm.errors.subject }}
                                    </div>
                                </fieldset>
                            </div>
                            <fieldset class="d-grid">
                                <label class="label-text text-body-3">{{ trans('Message') }}</label>
                                <textarea
                                    v-model="contactForm.message"
                                    name="message"
                                    :placeholder="trans('Message')"
                                    :class="{ error: contactForm.errors.message }"
                                    :disabled="contactForm.processing"
                                    required
                                ></textarea>
                                <div v-if="contactForm.errors.message" class="text-danger mt-1 small">
                                    {{ contactForm.errors.message }}
                                </div>
                            </fieldset>
                        </div>
                        <div v-if="submitSuccess" class="alert alert-success mt-3">
                            {{ trans('Thank you for contacting us! We will get back to you soon.') }}
                        </div>
                        <button type="submit" class="tf-btn style-2 animate-btn style-high mt-3" :disabled="contactForm.processing">
                            {{ contactForm.processing ? trans('Sending...') : submitLabel }}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useForm, usePage } from '@inertiajs/vue3'

const props = defineProps({
    modalId: {
        type: String,
        default: 'productContactModal',
    },
    title: {
        type: String,
        default: 'Contact Us',
    },
    description: {
        type: String,
        default: '',
    },
    defaultSubject: {
        type: String,
        default: '',
    },
    defaultMessage: {
        type: String,
        default: '',
    },
    submitLabel: {
        type: String,
        default: 'Submit',
    },
})

const page = usePage()
const trans = (key) => page.props.translations[key] || key
const locale = computed(() => page.props.locale || 'en')

const modalElement = ref(null)
const submitSuccess = ref(false)
let modalInstance = null

const contactForm = useForm({
    name: '',
    email: '',
    mobile: '',
    subject: props.defaultSubject,
    message: props.defaultMessage,
})

watch(() => props.defaultSubject, (value) => {
    contactForm.subject = value
})

watch(() => props.defaultMessage, (value) => {
    contactForm.message = value
})

const handleSubmit = () => {
    if (contactForm.processing) {
        return
    }

    contactForm.post(route('contact-us.store'), {
        preserveScroll: true,
        preserveState: true,
        onBefore: () => {
            submitSuccess.value = false
        },
        onSuccess: () => {
            submitSuccess.value = true
            contactForm.reset('name', 'email', 'mobile')
            contactForm.subject = props.defaultSubject
            contactForm.message = props.defaultMessage
            contactForm.clearErrors()
            setTimeout(() => {
                submitSuccess.value = false
                hide()
            }, 2500)
        },
        onError: () => {
            submitSuccess.value = false
        },
    })
}

const show = () => {
    contactForm.subject = props.defaultSubject
    contactForm.message = props.defaultMessage

    if (modalInstance) {
        modalInstance.show()
    }
}

const hide = () => {
    if (modalInstance) {
        modalInstance.hide()
    }
}

onMounted(() => {
    if (modalElement.value && window.bootstrap?.Modal) {
        modalInstance = new window.bootstrap.Modal(modalElement.value)
    }
})

defineExpose({
    show,
    hide,
})
</script>

<style scoped>
.product-contact-modal .modal-content {
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 16px;
    overflow: hidden;
    background: #0d1117;
    color: #fff;
}

.product-contact-modal .modal-title {
    font-weight: 700;
    color: #fff;
}

.product-contact-modal .btn-close {
    filter: invert(1);
}

.product-contact-modal__description {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.95rem;
    line-height: 1.6;
    margin-bottom: 1.25rem;
}
</style>
