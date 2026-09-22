import { computed, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, useSSRContext, openBlock, createBlock, onMounted, onUnmounted, ref, createCommentVNode, Fragment, renderList, withModifiers, withDirectives, vModelText, resolveDynamicComponent, watch, vShow, nextTick, reactive, renderSlot, resolveComponent, vModelCheckbox, createSSRApp, h as h$1 } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrRenderComponent, ssrRenderSlot, ssrIncludeBooleanAttr, ssrRenderStyle, ssrRenderVNode, ssrLooseContain } from "vue/server-renderer";
import { usePage, Link, router, useForm, Head, createInertiaApp } from "@inertiajs/vue3";
import createServer from "@inertiajs/vue3/server";
import { renderToString } from "@vue/server-renderer";
const _sfc_main$V = {
  __name: "MainMenuList",
  __ssrInlineRender: true,
  props: {
    variant: { type: String, default: "desktop" }
  },
  setup(__props) {
    const page = usePage();
    const trans = (key) => {
      var _a;
      return ((_a = page.props.translations) == null ? void 0 : _a[key]) || key;
    };
    const locale = computed(() => page.props.locale || "en");
    const headerPages = computed(() => page.props.headerPages || []);
    const auth = computed(() => page.props.auth);
    const portalTranslations = computed(() => {
      var _a;
      return ((_a = page.props.portal) == null ? void 0 : _a.translations) || {};
    });
    const unreadCount = computed(() => {
      var _a;
      return ((_a = page.props.portal) == null ? void 0 : _a.unread_notifications) || 0;
    });
    const portalLabel = (key) => {
      const parts = key.split(".");
      let value = portalTranslations.value;
      for (const part of parts) {
        value = value == null ? void 0 : value[part];
      }
      if (typeof value === "string") {
        return value;
      }
      const fallbacks = {
        "menu.my_dashboard": "My Dashboard",
        "menu.projects": "My Projects",
        "menu.subscriptions": "My Subscriptions",
        "menu.tickets": "My Tickets",
        "menu.profile": "My Profile",
        "menu.logout": "Logout"
      };
      return fallbacks[key] || key;
    };
    const localizedPath = (path = "") => {
      const normalized = path.startsWith("/") ? path : `/${path}`;
      const localePrefix = locale.value ? `/${locale.value}` : "";
      if (!localePrefix) {
        return normalized === "/" ? "/" : normalized;
      }
      if (normalized === "/") {
        return localePrefix;
      }
      return `${localePrefix}${normalized}`;
    };
    const safeRoute = (name, fallbackPath = "/", params = void 0) => {
      try {
        return params !== void 0 ? route(name, params) : route(name);
      } catch (e2) {
        return localizedPath(fallbackPath);
      }
    };
    const normalizePath = (path) => {
      if (!path) return "";
      const withoutQuery = path.split("?")[0];
      if (withoutQuery === "/") return "/";
      return withoutQuery.replace(/\/+$/, "");
    };
    const getPathFromUrl = (url) => {
      if (!url) return "";
      try {
        return new URL(url, window.location.origin).pathname;
      } catch (e2) {
        return url;
      }
    };
    const expandPrefixes = (prefixes = []) => {
      const localePrefix = locale.value ? `/${locale.value}` : "";
      return prefixes.flatMap((prefix) => {
        const normalized = prefix.startsWith("/") ? prefix : `/${prefix}`;
        if (!localePrefix) {
          return [normalized];
        }
        return [normalized, `${localePrefix}${normalized}`];
      });
    };
    const isActive = (routeName, options = {}) => {
      const routeNames = Array.isArray(routeName) ? routeName : [routeName];
      const prefixes = expandPrefixes(options.prefixes || []);
      const exactPaths = expandPrefixes(options.exact || []);
      const currentPath = normalizePath(getPathFromUrl(page.url) || page.url);
      if (exactPaths.some((path) => currentPath === normalizePath(path))) {
        return true;
      }
      if (prefixes.some((prefix) => {
        const normalized = normalizePath(prefix);
        return currentPath === normalized || currentPath.startsWith(`${normalized}/`);
      })) {
        return true;
      }
      try {
        return routeNames.some((name) => route().current(name));
      } catch (e2) {
        return false;
      }
    };
    const isCurrentUrl = (targetUrl) => normalizePath(getPathFromUrl(targetUrl)) === normalizePath(page.url);
    const isPageActive = (pageItem) => {
      if (!(pageItem == null ? void 0 : pageItem.slug)) return false;
      try {
        return isCurrentUrl(route("page.view", pageItem.slug));
      } catch (e2) {
        return false;
      }
    };
    const pageTitle = (cmsPage) => {
      const title = cmsPage == null ? void 0 : cmsPage.title;
      if (!title) return "";
      if (typeof title === "string") return title;
      return title[locale.value] || title.en || Object.values(title)[0] || "";
    };
    const languages = computed(() => [
      { code: "ar", label: trans("Arabic") },
      { code: "en", label: trans("English") },
      { code: "tr", label: trans("Turkish") },
      { code: "de", label: trans("German") }
    ]);
    const items = computed(() => {
      var _a, _b;
      const list = [
        { key: "home", label: trans("Home"), href: safeRoute("home", "/"), active: isActive("home", { exact: ["/"] }) },
        { key: "about", label: trans("About Us"), href: safeRoute("about-us", "/about-us"), active: isActive("about-us", { prefixes: ["/about-us"] }) },
        { key: "services", label: trans("Our Services"), href: safeRoute("services.index", "/services"), active: isActive(["services.index", "services.show"], { prefixes: ["/services", "/service"] }) },
        { key: "cases", label: trans("Case Studies"), href: safeRoute("use-cases.index", "/use-cases"), active: isActive(["use-cases.index", "use-cases.show"], { prefixes: ["/use-cases", "/portfolio"] }) },
        { key: "products", label: trans("Products"), href: safeRoute("product.index", "/products"), active: isActive(["product.index", "product.show"], { prefixes: ["/products", "/product"] }) },
        { key: "blogs", label: trans("Blogs"), href: safeRoute("blogs.index", "/blogs"), active: isActive(["blogs.index", "blogs.show"], { prefixes: ["/blogs", "/blog"] }) }
      ];
      if (headerPages.value.length) {
        list.push({
          key: "pages",
          label: trans("Pages"),
          href: safeRoute("page.view", "/p", headerPages.value[0].slug),
          active: isActive("page.view", { prefixes: ["/p"] }),
          children: headerPages.value.map((cmsPage) => ({
            key: `page-${cmsPage.id}`,
            label: pageTitle(cmsPage),
            href: safeRoute("page.view", `/p/${cmsPage.slug}`, cmsPage.slug),
            active: isPageActive(cmsPage)
          }))
        });
      }
      list.push({
        key: "contact",
        label: trans("Contact Us"),
        href: safeRoute("contact-us", "/contact-us"),
        active: isActive("contact-us", { prefixes: ["/contact-us"] })
      });
      if (((_a = auth.value) == null ? void 0 : _a.type) === "admin") {
        list.push({
          key: "dashboard",
          label: trans("Dashboard"),
          href: localizedPath("/admin/dashboard"),
          external: true,
          active: false
        });
      } else if (((_b = auth.value) == null ? void 0 : _b.type) === "customer") {
        const badge = unreadCount.value ? ` (${unreadCount.value})` : "";
        list.push({
          key: "portal",
          label: auth.value.name || trans("Account"),
          href: safeRoute("portal.dashboard", "/portal"),
          active: isActive("portal.dashboard"),
          children: [
            { key: "p-dash", label: portalLabel("menu.my_dashboard"), href: safeRoute("portal.dashboard", "/portal"), active: isActive("portal.dashboard") },
            { key: "p-projects", label: portalLabel("menu.projects") + badge, href: safeRoute("portal.projects.index", "/portal/projects"), active: isActive(["portal.projects.index", "portal.projects.show"], { prefixes: ["/portal/projects"] }) },
            { key: "p-subs", label: portalLabel("menu.subscriptions"), href: safeRoute("portal.subscriptions.index", "/portal/subscriptions"), active: isActive("portal.subscriptions.index", { prefixes: ["/portal/subscriptions"] }) },
            { key: "p-tickets", label: portalLabel("menu.tickets"), href: safeRoute("portal.tickets.index", "/portal/tickets"), active: isActive(["portal.tickets.index", "portal.tickets.create", "portal.tickets.show"], { prefixes: ["/portal/tickets"] }) },
            { key: "p-profile", label: portalLabel("menu.profile"), href: safeRoute("portal.profile.index", "/portal/profile"), active: isActive("portal.profile.index", { prefixes: ["/portal/profile"] }) }
          ]
        });
      }
      return list;
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.variant === "mobile") {
        _push(`<ul${ssrRenderAttrs(mergeProps({ class: "nav-ul-mb gap-0" }, _attrs))}><!--[-->`);
        ssrRenderList(items.value, (item) => {
          var _a;
          _push(`<li class="nav-mb-item">`);
          if ((_a = item.children) == null ? void 0 : _a.length) {
            _push(`<!--[--><a${ssrRenderAttr("href", `#mb-${item.key}`)} class="collapsed mb-menu-link" data-bs-toggle="collapse" aria-expanded="false"${ssrRenderAttr("aria-controls", `mb-${item.key}`)}><span>${ssrInterpolate(item.label)}</span><span class="icon icon-arrow-caret-down"></span></a><div${ssrRenderAttr("id", `mb-${item.key}`)} class="collapse"><ul class="sub-nav-menu"><!--[-->`);
            ssrRenderList(item.children, (child) => {
              _push(`<li>`);
              if (child.external) {
                _push(`<a${ssrRenderAttr("href", child.href)} class="${ssrRenderClass([{ active: child.active }, "sub-nav-link"])}" data-bs-dismiss="offcanvas">${ssrInterpolate(child.label)}</a>`);
              } else {
                _push(ssrRenderComponent(unref(Link), {
                  href: child.href,
                  class: ["sub-nav-link", { active: child.active }],
                  "data-bs-dismiss": "offcanvas"
                }, {
                  default: withCtx((_2, _push2, _parent2, _scopeId) => {
                    if (_push2) {
                      _push2(`${ssrInterpolate(child.label)}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(child.label), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent));
              }
              _push(`</li>`);
            });
            _push(`<!--]--></ul></div><!--]-->`);
          } else if (item.external) {
            _push(`<a${ssrRenderAttr("href", item.href)} class="${ssrRenderClass([{ "is-active": item.active, active: item.active }, "mb-menu-link"])}" data-bs-dismiss="offcanvas"><span>${ssrInterpolate(item.label)}</span></a>`);
          } else {
            _push(ssrRenderComponent(unref(Link), {
              href: item.href,
              class: ["mb-menu-link", { "is-active": item.active, active: item.active }],
              "data-bs-dismiss": "offcanvas"
            }, {
              default: withCtx((_2, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<span${_scopeId}>${ssrInterpolate(item.label)}</span>`);
                } else {
                  return [
                    createVNode("span", null, toDisplayString(item.label), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
          }
          _push(`</li>`);
        });
        _push(`<!--]--><li class="nav-mb-item"><a href="#mb-lang" class="collapsed mb-menu-link" data-bs-toggle="collapse" aria-expanded="false"><span>${ssrInterpolate(trans("Language"))}</span><span class="icon icon-arrow-caret-down"></span></a><div id="mb-lang" class="collapse"><ul class="sub-nav-menu"><!--[-->`);
        ssrRenderList(languages.value, (lang) => {
          _push(`<li><a href="#" class="${ssrRenderClass([{ active: locale.value === lang.code }, "sub-nav-link"])}">${ssrInterpolate(lang.label)}</a></li>`);
        });
        _push(`<!--]--></ul></div></li></ul>`);
      } else {
        _push(`<ul${ssrRenderAttrs(mergeProps({ class: "box-nav-menu main-nav_menu" }, _attrs))}><!--[-->`);
        ssrRenderList(items.value, (item) => {
          var _a, _b;
          _push(`<li class="${ssrRenderClass([{ "is-active": item.active }, "menu-item"])}">`);
          if ((_a = item.children) == null ? void 0 : _a.length) {
            _push(`<a href="javascript:void(0)" class="${ssrRenderClass([{ "is-active": item.active, active: item.active }, "item-link tf-btn style-transparent text-body-3 animate-btn"])}">${ssrInterpolate(item.label)} <i class="icon icon-arrow-caret-down fs-7"></i></a>`);
          } else if (item.external) {
            _push(`<a${ssrRenderAttr("href", item.href)} class="${ssrRenderClass([{ "is-active": item.active, active: item.active }, "item-link tf-btn style-transparent text-body-3 animate-btn"])}">${ssrInterpolate(item.label)}</a>`);
          } else {
            _push(ssrRenderComponent(unref(Link), {
              href: item.href,
              class: ["item-link tf-btn style-transparent text-body-3 animate-btn", { "is-active": item.active, active: item.active }]
            }, {
              default: withCtx((_2, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(item.label)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(item.label), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
          }
          if ((_b = item.children) == null ? void 0 : _b.length) {
            _push(`<div class="sub-menu"><ul class="sub-menu_list"><!--[-->`);
            ssrRenderList(item.children, (child) => {
              _push(`<li>`);
              if (child.external) {
                _push(`<a${ssrRenderAttr("href", child.href)} class="${ssrRenderClass([{ active: child.active }, "sub-menu_link"])}">${ssrInterpolate(child.label)}</a>`);
              } else {
                _push(ssrRenderComponent(unref(Link), {
                  href: child.href,
                  class: ["sub-menu_link", { active: child.active }]
                }, {
                  default: withCtx((_2, _push2, _parent2, _scopeId) => {
                    if (_push2) {
                      _push2(`${ssrInterpolate(child.label)}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(child.label), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent));
              }
              _push(`</li>`);
            });
            _push(`<!--]--></ul></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</li>`);
        });
        _push(`<!--]--><li class="menu-item"><a href="javascript:void(0)" class="item-link tf-btn style-transparent text-body-3 animate-btn">${ssrInterpolate(locale.value.toUpperCase())} <i class="icon icon-arrow-caret-down fs-7"></i></a><div class="sub-menu"><ul class="sub-menu_list"><!--[-->`);
        ssrRenderList(languages.value, (lang) => {
          _push(`<li><a href="#" class="${ssrRenderClass([{ active: locale.value === lang.code }, "sub-menu_link"])}">${ssrInterpolate(lang.label)}</a></li>`);
        });
        _push(`<!--]--></ul></div></li></ul>`);
      }
    };
  }
};
const _sfc_setup$V = _sfc_main$V.setup;
_sfc_main$V.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/MainMenuList.vue");
  return _sfc_setup$V ? _sfc_setup$V(props, ctx) : void 0;
};
const _sfc_main$U = {
  __name: "MainMenuNav",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const trans = (key) => {
      var _a;
      return ((_a = page.props.translations) == null ? void 0 : _a[key]) || key;
    };
    const settings = computed(() => page.props.settings || {});
    const storage_path = computed(() => page.props.storage_path || "");
    const auth = computed(() => page.props.auth);
    const locale = computed(() => page.props.locale || "en");
    const brandName = computed(() => {
      var _a;
      return ((_a = page.props.seo) == null ? void 0 : _a.website_name) || page.props.appName || "Symfonix";
    });
    const homeUrl = computed(() => {
      try {
        return route("home");
      } catch (e2) {
        return `/${locale.value}`;
      }
    });
    const loginUrl = computed(() => {
      try {
        return route("login");
      } catch (e2) {
        return `/${locale.value}/login`;
      }
    });
    const ctaUrl = computed(() => {
      try {
        return route("contact-us");
      } catch (e2) {
        return `/${locale.value}/contact-us`;
      }
    });
    const ctaLabel = computed(() => trans("Get started"));
    const logoSrc = computed(() => {
      var _a;
      const logo = (_a = settings.value) == null ? void 0 : _a.site_logo;
      if (!logo || logo === false || logo === "false" || logo === "default.jpg") {
        return "";
      }
      if (/^https?:\/\//i.test(logo) || String(logo).startsWith("//") || String(logo).startsWith("/")) {
        return logo;
      }
      return `${storage_path.value}${logo}`;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<header${ssrRenderAttrs(mergeProps({
        id: "header",
        class: "tf-header"
      }, _attrs))}><div class="container"><div class="row d-flex align-items-center"><div class="col-5 col-lg-3"><div class="header-left">`);
      _push(ssrRenderComponent(unref(Link), {
        href: homeUrl.value,
        class: "logo-site",
        "aria-label": brandName.value
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (logoSrc.value) {
              _push2(`<img${ssrRenderAttr("src", logoSrc.value)}${ssrRenderAttr("alt", brandName.value)} width="160" height="40"${_scopeId}>`);
            } else {
              _push2(`<span class="brand-text-logo"${_scopeId}>${ssrInterpolate(brandName.value)}</span>`);
            }
          } else {
            return [
              logoSrc.value ? (openBlock(), createBlock("img", {
                key: 0,
                src: logoSrc.value,
                alt: brandName.value,
                width: "160",
                height: "40"
              }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("span", {
                key: 1,
                class: "brand-text-logo"
              }, toDisplayString(brandName.value), 1))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="col-6 d-none d-lg-block"><nav class="box-navigation">`);
      _push(ssrRenderComponent(_sfc_main$V, null, null, _parent));
      _push(`</nav></div><div class="col-7 col-lg-3"><div class="header-right"><div class="btn_group">`);
      if (!auth.value) {
        _push(ssrRenderComponent(unref(Link), {
          href: loginUrl.value,
          class: "tf-btn text-body-3 animate-btn d-none d-sm-flex"
        }, {
          default: withCtx((_2, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(trans("Login"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(trans("Login")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(unref(Link), {
        href: ctaUrl.value,
        class: "tf-btn text-body-3 style-2 animate-btn animate-dark"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(ctaLabel.value)}`);
          } else {
            return [
              createTextVNode(toDisplayString(ctaLabel.value), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<a href="#mobileMenu" class="btn-menu_mobile d-lg-none" data-bs-toggle="offcanvas"><i class="icon icon-menu"></i></a></div></div></div></div></div></header>`);
    };
  }
};
const _sfc_setup$U = _sfc_main$U.setup;
_sfc_main$U.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/MainMenuNav.vue");
  return _sfc_setup$U ? _sfc_setup$U(props, ctx) : void 0;
};
const _sfc_main$T = {
  __name: "HackerStrip",
  __ssrInlineRender: true,
  props: {
    text: {
      type: String,
      default: "qW8bL2nRM4ZpYk5gJfXvCt1uHdEo93NTaVxBYmOe7rPQnKDlcUs0AjzhFiGSwLXtRpUo6NMJvqa7bT2EfyCdx9KWZhgL1nFMR3YUJ5toepXAGvqBzNcdwskLm4iT7OPuVHxayJZErm5QbgCnX1UL2D9ptYfOEK0sWhRAgJmzliNu67BXFoQYPCHtvnwMJeaZKRxdo3TfLUGqc48sbE9NYpJAgmWTVrhXxLFo517zkidC3"
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "sect-bottom" }, _attrs))}><div class="container"><div class="box-hacker has-overlay_linear mx-1"><p class="hacker-text text-caption font-2 text-uppercase hackerText">${ssrInterpolate(__props.text)}</p></div></div></div>`);
    };
  }
};
const _sfc_setup$T = _sfc_main$T.setup;
_sfc_main$T.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/HackerStrip.vue");
  return _sfc_setup$T ? _sfc_setup$T(props, ctx) : void 0;
};
const _sfc_main$S = {
  __name: "SectMeta",
  __ssrInlineRender: true,
  props: {
    number: { type: [Number, String], required: true },
    total: { type: [Number, String], default: 8 },
    label: { type: String, required: true }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "sect-header" }, _attrs))}><div class="container"><div class="s-meta text-caption font-2"><p class="s-number_order wg-counter"> [ <span class="text-white">0<span class="odometer"${ssrRenderAttr("data-number", __props.number)}>0</span></span> / ${ssrInterpolate(String(__props.total).padStart(2, "0"))} ] </p><p class="s-label">[ <span class="text-white hacker-text_transform">${ssrInterpolate(__props.label)}</span> ]</p></div></div></div>`);
    };
  }
};
const _sfc_setup$S = _sfc_main$S.setup;
_sfc_main$S.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/SectMeta.vue");
  return _sfc_setup$S ? _sfc_setup$S(props, ctx) : void 0;
};
let wowInstance = null;
const closeOffcanvas = () => {
  const open = document.querySelector(".offcanvas.show");
  if (!open || typeof window.bootstrap === "undefined") {
    document.querySelectorAll(".offcanvas-backdrop").forEach((el) => el.remove());
    document.body.classList.remove("offcanvas-open", "modal-open");
    document.body.style.removeProperty("overflow");
    document.body.style.removeProperty("padding-right");
    return;
  }
  const instance = window.bootstrap.Offcanvas.getInstance(open) || window.bootstrap.Offcanvas.getOrCreateInstance(open);
  instance == null ? void 0 : instance.hide();
};
const resetWowVisibility = () => {
  document.querySelectorAll(".wow").forEach((el) => {
    if (el.style.visibility === "hidden") {
      el.style.visibility = "";
    }
  });
};
const initWow = () => {
  if (typeof window.WOW === "undefined") {
    return;
  }
  resetWowVisibility();
  wowInstance = new window.WOW({
    live: false,
    offset: 40,
    mobile: true,
    resetAnimation: false
  });
  wowInstance.init();
};
const refreshTheme = () => {
  closeOffcanvas();
  if (typeof window.ScrollTrigger !== "undefined" && typeof window.ScrollTrigger.getAll === "function") {
    window.ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  }
  if (typeof window.initQoreTheme === "function") {
    resetWowVisibility();
    window.initQoreTheme();
    window.setTimeout(initWow, 120);
    return;
  }
  initWow();
  if (typeof window.ScrollTrigger !== "undefined") {
    window.ScrollTrigger.refresh();
  }
};
const useQoreTheme = () => {
  onMounted(() => {
    const run = () => window.setTimeout(refreshTheme, 60);
    run();
    const unregister = router.on("success", run);
    onUnmounted(() => {
      unregister();
    });
  });
};
const _sfc_main$R = {
  __name: "App",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    useQoreTheme();
    const trans = (key) => {
      var _a;
      return ((_a = page.props.translations) == null ? void 0 : _a[key]) || key;
    };
    const settings = computed(() => page.props.settings || {});
    const storage_path = computed(() => page.props.storage_path || "");
    const asset_path = computed(() => page.props.asset_path || "");
    const locale = computed(() => page.props.locale);
    const seo = computed(() => page.props.seo || {});
    const brandName = computed(() => {
      var _a;
      return ((_a = seo.value) == null ? void 0 : _a.website_name) || page.props.appName || "Symfonix";
    });
    const footerPages = computed(() => page.props.footerPages || []);
    const auth = computed(() => page.props.auth);
    const isPortalPage = computed(() => /\/portal(\/|$)/.test(page.url));
    const isHomePage = computed(() => {
      try {
        return route().current("home");
      } catch (e2) {
        const path = page.url.split("?")[0];
        return path === "/" || path === `/${locale.value}` || path === `/${locale.value}/`;
      }
    });
    const isAuthPage = computed(() => {
      try {
        return route().current("login") || route().current("register") || route().current("password.request") || route().current("password.reset") || route().current("two-factor.login") || route().current("password.confirm");
      } catch (e2) {
        return /\/(login|register|forgot-password|reset-password|two-factor-challenge)(\/|$|\?)/.test(page.url);
      }
    });
    const showNewsletter = computed(() => !isPortalPage.value && !isAuthPage.value);
    const logoSrc = computed(() => {
      var _a;
      const logo = (_a = settings.value) == null ? void 0 : _a.site_logo;
      if (!logo || logo === false || logo === "false" || logo === "default.jpg") {
        return "";
      }
      if (/^https?:\/\//i.test(logo) || String(logo).startsWith("//") || String(logo).startsWith("/")) {
        return logo;
      }
      return `${storage_path.value}${logo}`;
    });
    const safeRoute = (name, fallback = "/") => {
      try {
        return route(name);
      } catch (e2) {
        return fallback;
      }
    };
    const homeUrl = computed(() => safeRoute("home", "/"));
    const aboutUrl = computed(() => safeRoute("about-us", "/about-us"));
    const servicesUrl = computed(() => safeRoute("services.index", "/services"));
    const productsUrl = computed(() => safeRoute("product.index", "/products"));
    const casesUrl = computed(() => safeRoute("use-cases.index", "/use-cases"));
    const blogsUrl = computed(() => safeRoute("blogs.index", "/blogs"));
    const contactUrl = computed(() => safeRoute("contact-us", "/contact-us"));
    const jobsUrl = computed(() => safeRoute("jobs.index", "/jobs"));
    const teamUrl = computed(() => safeRoute("team", "/team"));
    const faqUrl = computed(() => safeRoute("faq", "/faq"));
    const privacyUrl = computed(() => safeRoute("privacy-policy", "/privacy-policy"));
    const loginUrl = computed(() => safeRoute("login", "/login"));
    const pageTitle = (cmsPage) => {
      const title = cmsPage == null ? void 0 : cmsPage.title;
      if (!title) return "";
      if (typeof title === "string") return title;
      return title[locale.value] || title.en || Object.values(title)[0] || "";
    };
    const pageUrl = (cmsPage) => {
      if (!(cmsPage == null ? void 0 : cmsPage.slug)) return "#";
      try {
        return route("page.view", cmsPage.slug);
      } catch (e2) {
        return "#";
      }
    };
    const subscribeSuccess = ref(false);
    const subscribeForm = useForm({ email: "" });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      if (isPortalPage.value) {
        _push(`<div class="portal-shell-root">`);
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
        _push(`</div>`);
      } else {
        _push(`<div id="wrapper"><span class="line_page"></span><div class="overlay_body"></div><div class="texture_page"><div class="bg-texture"></div><div class="temp"></div><div class="bg-texture"></div></div>`);
        if (isHomePage.value) {
          _push(`<div class="hero-video"><video muted autoplay loop playsinline><source${ssrRenderAttr("src", asset_path.value + "qore/images/video/BlackHole.mp4")} type="video/mp4"></video><div class="orther-overlay"></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(ssrRenderComponent(_sfc_main$U, null, null, _parent));
        _push(`<span class="br-line"></span>`);
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
        if (showNewsletter.value) {
          _push(`<section class="section-cta">`);
          _push(ssrRenderComponent(_sfc_main$S, {
            number: "8",
            total: 8,
            label: trans("GET STARTED")
          }, null, _parent));
          _push(`<span class="br-line"></span><div class="sect-tagline"><div class="container"><div class="sect-tagline_inner"><span class="hafl-plus pst-left_bot wow bounceInScale"></span><span class="hafl-plus pst-right_bot wow bounceInScale"></span><h6 class="s-name text-caption font-2"><span class="bar-group type-left"><span class="bar_center"></span></span><span class="hacker-text_transform no-delay">${ssrInterpolate(trans("GET STARTED TODAY."))}</span><span class="bar-group type-right"><span class="bar_center"></span></span></h6></div></div></div><span class="br-line"></span><div class="sect-main position-relative"><div class="s-img_item"><img class="lazyload"${ssrRenderAttr("src", asset_path.value + "qore/images/section/color-bg-2.webp")}${ssrRenderAttr("data-src", asset_path.value + "qore/images/section/color-bg-2.webp")} alt=""></div><div class="container"><div class="sect-title wow fadeInUp"><h2 class="s-title font-3">${ssrInterpolate(trans("Subscribe to Our Newsletter"))}</h2><p class="s-sub_title">${ssrInterpolate(trans("Engineering insights, product updates, and practical tech lessons—delivered occasionally, not daily"))}</p></div><form class="symfonix-cta-form"><div class="form-content"><input type="email" name="email"${ssrRenderAttr("value", unref(subscribeForm).email)}${ssrRenderAttr("placeholder", trans("Enter your email address"))}${ssrIncludeBooleanAttr(unref(subscribeForm).processing) ? " disabled" : ""} required><button type="submit" class="tf-btn style-2 style-high animate-btn"${ssrIncludeBooleanAttr(unref(subscribeForm).processing) ? " disabled" : ""}><span>${ssrInterpolate(unref(subscribeForm).processing ? trans("Subscribing...") : trans("Subscribe Now"))}</span></button></div>`);
          if (unref(subscribeForm).errors.email) {
            _push(`<div class="text-danger mt-2 text-center small">${ssrInterpolate(unref(subscribeForm).errors.email)}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<p class="text-body-3 text-center mt-3">`);
          _push(ssrRenderComponent(unref(Link), { href: privacyUrl.value }, {
            default: withCtx((_2, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(trans("By subscribing, you accept our privacy policy"))}`);
              } else {
                return [
                  createTextVNode(toDisplayString(trans("By subscribing, you accept our privacy policy")), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</p>`);
          if (subscribeSuccess.value) {
            _push(`<div class="alert alert-success mt-3 text-center">${ssrInterpolate(trans("Thank you for subscribing to our newsletter!"))}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</form></div></div><span class="br-line"></span>`);
          _push(ssrRenderComponent(_sfc_main$T, null, null, _parent));
          _push(`<span class="br-line"></span></section>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<footer class="tf-footer">`);
        if (isHomePage.value) {
          _push(`<div class="sect-header"><div class="container"><div class="s-meta text-caption font-2"><p class="s-number_order wg-counter"> [ <span class="text-white">0<span class="odometer" data-number="9">0</span></span> / 09 ] </p><p class="s-label">[ <span class="text-white hacker-text_transform">${ssrInterpolate(trans("FOOTER"))}</span> ]</p></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (isHomePage.value) {
          _push(`<span class="br-line"></span>`);
        } else {
          _push(`<!--[--><div class="container"><div class="has-hafl_plus"><span class="hafl-plus pst-left_bot item_bot wow bounceInScale"></span><span class="hafl-plus pst-right_bot item_bot wow bounceInScale"></span></div></div><span class="br-line"></span><!--]-->`);
        }
        _push(`<div class="footer-body"><div class="container"><div class="footer-inner-wrap"><div class="footer-inner_link tf-grid-layout tf-col-2 lg-col-4">`);
        _push(ssrRenderComponent(unref(Link), {
          href: homeUrl.value,
          class: "footer-logo logo-site"
        }, {
          default: withCtx((_2, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (logoSrc.value) {
                _push2(`<img${ssrRenderAttr("src", logoSrc.value)}${ssrRenderAttr("alt", brandName.value)}${_scopeId}>`);
              } else {
                _push2(`<span class="brand-text-logo"${_scopeId}>${ssrInterpolate(brandName.value)}</span>`);
              }
            } else {
              return [
                logoSrc.value ? (openBlock(), createBlock("img", {
                  key: 0,
                  src: logoSrc.value,
                  alt: brandName.value
                }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("span", {
                  key: 1,
                  class: "brand-text-logo"
                }, toDisplayString(brandName.value), 1))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="footer-col-block wow fadeInLeft mx-auto m-sm-0"><h5 class="footer-heading footer-heading-mobile font-2">${ssrInterpolate(trans("Quick Links"))}</h5><div class="tf-collapse-content"><ul class="footer-menu-list"><li>`);
        _push(ssrRenderComponent(unref(Link), {
          href: homeUrl.value,
          class: "link text-main-2"
        }, {
          default: withCtx((_2, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(trans("Home"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(trans("Home")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</li><li>`);
        _push(ssrRenderComponent(unref(Link), {
          href: aboutUrl.value,
          class: "link text-main-2"
        }, {
          default: withCtx((_2, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(trans("About Us"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(trans("About Us")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</li><li>`);
        _push(ssrRenderComponent(unref(Link), {
          href: servicesUrl.value,
          class: "link text-main-2"
        }, {
          default: withCtx((_2, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(trans("Our Services"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(trans("Our Services")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</li><li>`);
        _push(ssrRenderComponent(unref(Link), {
          href: productsUrl.value,
          class: "link text-main-2"
        }, {
          default: withCtx((_2, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(trans("Products"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(trans("Products")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</li><li>`);
        _push(ssrRenderComponent(unref(Link), {
          href: casesUrl.value,
          class: "link text-main-2"
        }, {
          default: withCtx((_2, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(trans("Case Studies"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(trans("Case Studies")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</li><li>`);
        _push(ssrRenderComponent(unref(Link), {
          href: blogsUrl.value,
          class: "link text-main-2"
        }, {
          default: withCtx((_2, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(trans("Blogs"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(trans("Blogs")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</li><li>`);
        _push(ssrRenderComponent(unref(Link), {
          href: contactUrl.value,
          class: "link text-main-2"
        }, {
          default: withCtx((_2, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(trans("Contact Us"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(trans("Contact Us")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</li><li>`);
        _push(ssrRenderComponent(unref(Link), {
          href: jobsUrl.value,
          class: "link text-main-2"
        }, {
          default: withCtx((_2, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(trans("Careers"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(trans("Careers")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</li></ul></div></div><div class="footer-col-block wow fadeInLeft"><h5 class="footer-heading footer-heading-mobile font-2">${ssrInterpolate(trans("Pages"))}</h5><div class="tf-collapse-content"><ul class="footer-menu-list"><li>`);
        _push(ssrRenderComponent(unref(Link), {
          href: teamUrl.value,
          class: "link text-main-2"
        }, {
          default: withCtx((_2, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(trans("Our Members"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(trans("Our Members")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</li><li>`);
        _push(ssrRenderComponent(unref(Link), {
          href: faqUrl.value,
          class: "link text-main-2"
        }, {
          default: withCtx((_2, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(trans("FAQs"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(trans("FAQs")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</li><li>`);
        _push(ssrRenderComponent(unref(Link), {
          href: privacyUrl.value,
          class: "link text-main-2"
        }, {
          default: withCtx((_2, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(trans("Privacy Policy"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(trans("Privacy Policy")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</li><!--[-->`);
        ssrRenderList(footerPages.value, (cmsPage) => {
          _push(`<li>`);
          _push(ssrRenderComponent(unref(Link), {
            href: pageUrl(cmsPage),
            class: "link text-main-2"
          }, {
            default: withCtx((_2, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(pageTitle(cmsPage))}`);
              } else {
                return [
                  createTextVNode(toDisplayString(pageTitle(cmsPage)), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</li>`);
        });
        _push(`<!--]--></ul></div></div><div class="footer-col-block wow fadeInLeft mx-auto m-sm-0"><h5 class="footer-heading footer-heading-mobile font-2">${ssrInterpolate(trans("Follow Us"))}</h5><div class="tf-collapse-content"><ul class="footer-menu-list">`);
        if (settings.value.twitter) {
          _push(`<li><a${ssrRenderAttr("href", settings.value.twitter)} class="link text-main-2" target="_blank" rel="noopener">Twitter (X)</a></li>`);
        } else {
          _push(`<!---->`);
        }
        if (settings.value.github) {
          _push(`<li><a${ssrRenderAttr("href", settings.value.github)} class="link text-main-2" target="_blank" rel="noopener">Github</a></li>`);
        } else {
          _push(`<!---->`);
        }
        if (settings.value.linkedin) {
          _push(`<li><a${ssrRenderAttr("href", settings.value.linkedin)} class="link text-main-2" target="_blank" rel="noopener">LinkedIn</a></li>`);
        } else {
          _push(`<!---->`);
        }
        if (settings.value.facebook) {
          _push(`<li><a${ssrRenderAttr("href", settings.value.facebook)} class="link text-main-2" target="_blank" rel="noopener">Facebook</a></li>`);
        } else {
          _push(`<!---->`);
        }
        if (settings.value.instagram) {
          _push(`<li><a${ssrRenderAttr("href", settings.value.instagram)} class="link text-main-2" target="_blank" rel="noopener">Instagram</a></li>`);
        } else {
          _push(`<!---->`);
        }
        if (settings.value.email) {
          _push(`<li><a${ssrRenderAttr("href", `mailto:${settings.value.email}`)} class="link text-main-2">${ssrInterpolate(settings.value.email)}</a></li>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</ul></div></div></div><span class="br-line has-dot"></span><div class="footer-inner_bottom"><p class="text-caption font-2">${ssrInterpolate(trans("All rights are reserved"))} ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} © ${ssrInterpolate(brandName.value)}</p><a href="#goTop" class="text-caption font-2 link">${ssrInterpolate(trans("Go Back Top"))}</a></div></div></div></div></footer></div>`);
      }
      if (!isPortalPage.value) {
        _push(`<div class="offcanvas offcanvas-start canvas-mb" id="mobileMenu" tabindex="-1"><div class="canvas-header"><div class="logo-site">`);
        if (logoSrc.value) {
          _push(`<img${ssrRenderAttr("src", logoSrc.value)}${ssrRenderAttr("alt", brandName.value)}>`);
        } else {
          _push(`<span class="brand-text-logo">${ssrInterpolate(brandName.value)}</span>`);
        }
        _push(`</div><div class="btn_group">`);
        _push(ssrRenderComponent(unref(Link), {
          href: contactUrl.value,
          class: "tf-btn style-2",
          "data-bs-dismiss": "offcanvas"
        }, {
          default: withCtx((_2, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(trans("Get started"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(trans("Get started")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<span class="icon-close-popup" data-bs-dismiss="offcanvas"><i class="icon-close"></i></span></div></div><span class="br-line"></span><div class="canvas-body">`);
        _push(ssrRenderComponent(_sfc_main$V, { variant: "mobile" }, null, _parent));
        _push(`</div><div class="canvas-footer">`);
        if (!auth.value) {
          _push(ssrRenderComponent(unref(Link), {
            href: loginUrl.value,
            class: "tf-btn w-100 animate-btn style-high",
            "data-bs-dismiss": "offcanvas"
          }, {
            default: withCtx((_2, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(trans("Login"))}`);
              } else {
                return [
                  createTextVNode(toDisplayString(trans("Login")), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(ssrRenderComponent(unref(Link), {
            href: contactUrl.value,
            class: "tf-btn w-100 animate-btn style-high",
            "data-bs-dismiss": "offcanvas"
          }, {
            default: withCtx((_2, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(trans("Contact Us"))}`);
              } else {
                return [
                  createTextVNode(toDisplayString(trans("Contact Us")), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$R = _sfc_main$R.setup;
_sfc_main$R.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Layouts/App.vue");
  return _sfc_setup$R ? _sfc_setup$R(props, ctx) : void 0;
};
const _sfc_main$Q = {
  __name: "BlogCard",
  __ssrInlineRender: true,
  props: {
    blog: {
      type: Object,
      required: true
    },
    locale: {
      type: String,
      default: "en"
    },
    showDescription: {
      type: Boolean,
      default: true
    },
    showReadMore: {
      type: Boolean,
      default: true
    },
    showComments: {
      type: Boolean,
      default: true
    },
    showCategory: {
      type: Boolean,
      default: true
    },
    dateOverride: {
      type: String,
      default: ""
    }
  },
  setup(__props) {
    const props = __props;
    const page = usePage();
    const trans = (key) => {
      var _a;
      return ((_a = page.props.translations) == null ? void 0 : _a[key]) || key;
    };
    const postUrl = computed(() => {
      if (!props.blog || !props.blog.slug) {
        return "#";
      }
      try {
        return route("blogs.show", props.blog.slug);
      } catch (e2) {
        return "#";
      }
    });
    const dateText = computed(() => {
      if (props.dateOverride) {
        return props.dateOverride;
      }
      const blog = props.blog || {};
      if (blog.created_at_formatted) {
        return blog.created_at_formatted;
      }
      const monthDay = [blog.created_at_month, blog.created_at_day].filter(Boolean).join(" ");
      if (monthDay) {
        return monthDay;
      }
      return blog.created_at || "";
    });
    computed(() => {
      if (props.blog && typeof props.blog.comments_count !== "undefined") {
        return props.blog.comments_count || 0;
      }
      return 0;
    });
    computed(() => {
      var _a;
      const title = String(((_a = props.blog) == null ? void 0 : _a.title) || "").trim();
      if (!title) {
        return trans("Read article");
      }
      return `${trans("Read article")}: ${title.length > 50 ? title.substring(0, 50) + "..." : title}`;
    });
    const handleImageError = (event) => {
      const assetPath = page.props.asset_path || "";
      const webpFallback = `${assetPath}site/images/blog/blog-2-1.webp`;
      const jpgFallback = `${assetPath}site/images/blog/blog-2-1.jpg`;
      if (!event.target.src.includes("blog-2-")) {
        event.target.src = webpFallback;
      } else if (event.target.src.endsWith(".webp")) {
        event.target.src = jpgFallback;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<article${ssrRenderAttrs(mergeProps({ class: "blog-article hover-img" }, _attrs))}>`);
      _push(ssrRenderComponent(unref(Link), {
        href: postUrl.value,
        class: "entry_image img-style"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img${ssrRenderAttr("src", __props.blog.image_link)}${ssrRenderAttr("alt", __props.blog.title)} width="640" height="360" loading="lazy" decoding="async"${_scopeId}>`);
          } else {
            return [
              createVNode("img", {
                src: __props.blog.image_link,
                alt: __props.blog.title,
                width: "640",
                height: "360",
                loading: "lazy",
                decoding: "async",
                onError: handleImageError
              }, null, 40, ["src", "alt"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="article_content">`);
      _push(ssrRenderComponent(unref(Link), {
        href: postUrl.value,
        class: "entry_title font-3 h5 link text-main-2"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.blog.title)}`);
          } else {
            return [
              createTextVNode(toDisplayString(__props.blog.title), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      if (__props.showDescription && __props.blog.description) {
        _push(`<p class="entry_desc">${ssrInterpolate(__props.blog.description)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="br-line has-dot"></div><div class="entry_meta">`);
      if (dateText.value) {
        _push(`<div class="meta meta__date"><i class="icon icon-Clock"></i><span class="meta-text text-body-3">${ssrInterpolate(dateText.value)}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.showCategory && __props.blog.category) {
        _push(`<div class="meta meta__tag"><i class="icon icon-Tag"></i><span class="meta-text text-body-3">${ssrInterpolate(__props.blog.category.name)}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></article>`);
    };
  }
};
const _sfc_setup$Q = _sfc_main$Q.setup;
_sfc_main$Q.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/BlogCard.vue");
  return _sfc_setup$Q ? _sfc_setup$Q(props, ctx) : void 0;
};
const _sfc_main$P = {
  __name: "UseCaseCard",
  __ssrInlineRender: true,
  props: {
    item: {
      type: Object,
      required: true
    },
    locale: {
      type: String,
      default: "en"
    },
    variant: {
      type: String,
      default: "default"
    }
  },
  setup(__props) {
    const props = __props;
    const page = usePage();
    const trans = (key) => {
      var _a;
      return ((_a = page.props.translations) == null ? void 0 : _a[key]) || key;
    };
    const cardUrl = computed(() => {
      var _a;
      if (!((_a = props.item) == null ? void 0 : _a.slug)) {
        return "#";
      }
      try {
        return route("use-cases.show", props.item.slug);
      } catch {
        return "#";
      }
    });
    const truncate = (text, length) => {
      if (!text) {
        return "";
      }
      return text.length > length ? `${text.substring(0, length)}…` : text;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<article${ssrRenderAttrs(mergeProps({ class: "blog-article hover-img" }, _attrs))}>`);
      _push(ssrRenderComponent(unref(Link), {
        href: cardUrl.value,
        class: "entry_image img-style"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img${ssrRenderAttr("src", __props.item.image_link)}${ssrRenderAttr("alt", __props.item.title)} width="732" height="412" loading="lazy" decoding="async"${_scopeId}>`);
          } else {
            return [
              createVNode("img", {
                src: __props.item.image_link,
                alt: __props.item.title,
                width: "732",
                height: "412",
                loading: "lazy",
                decoding: "async"
              }, null, 8, ["src", "alt"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="article_content">`);
      if (__props.item.category_tag) {
        _push(`<p class="text-caption font-2 text-main-5">${ssrInterpolate(__props.item.category_tag)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(unref(Link), {
        href: cardUrl.value,
        class: "entry_title font-3 h5 link text-main-2"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.item.title)}`);
          } else {
            return [
              createTextVNode(toDisplayString(__props.item.title), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      if (__props.item.summary && __props.variant !== "compact") {
        _push(`<p class="entry_desc">${ssrInterpolate(truncate(__props.item.summary, __props.variant === "compact" ? 90 : 140))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="br-line has-dot"></div>`);
      _push(ssrRenderComponent(unref(Link), {
        href: cardUrl.value,
        class: "tf-btn text-body-3 animate-btn"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(trans("View Case Study"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(trans("View Case Study")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></article>`);
    };
  }
};
const _sfc_setup$P = _sfc_main$P.setup;
_sfc_main$P.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/UseCaseCard.vue");
  return _sfc_setup$P ? _sfc_setup$P(props, ctx) : void 0;
};
const _sfc_main$O = {
  __name: "Index",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const trans = (key) => page.props.translations[key] || key;
    const seo = computed(() => page.props.seo);
    const settings = computed(() => page.props.settings || {});
    const asset_path = computed(() => page.props.asset_path || "");
    const locale = computed(() => page.props.locale);
    const posts = computed(() => page.props.posts || []);
    const servicesCategories = computed(() => page.props.servicesCategories || []);
    const testimonials = computed(() => page.props.testimonials || []);
    const useCases = computed(() => page.props.useCases || []);
    const products = computed(() => page.props.products || []);
    const clients = computed(() => page.props.clients || []);
    const meta = computed(() => page.props.meta || {});
    const featuredCategories = computed(() => servicesCategories.value.slice(0, 6));
    const metaTitle = computed(() => meta.value.title || `${trans("Home")} | ${seo.value.website_name || ""}`.trim());
    const metaDescription = computed(() => meta.value.description || trans("Empowering businesses with modern web, mobile, AI, and cloud solutions.") || seo.value.website_desc || "");
    const metaKeywords = computed(() => meta.value.keywords || trans("IT solutions, web development, mobile apps, AI automation, cloud services") || seo.value.website_keywords || "");
    const metaImage = computed(() => {
      var _a, _b, _c, _d, _e;
      return ((_b = (_a = meta.value) == null ? void 0 : _a.og) == null ? void 0 : _b.image) || ((_d = (_c = meta.value) == null ? void 0 : _c.twitter) == null ? void 0 : _d.image) || ((_e = settings.value) == null ? void 0 : _e.meta_img) || "";
    });
    const metaCanonical = computed(() => meta.value.canonical || "");
    const metaRobots = computed(() => meta.value.robots || "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1");
    const translateField = (value) => {
      if (!value) return "";
      if (typeof value === "string") return value;
      const loc = locale.value;
      if (typeof value === "object" && value !== null && value[loc]) {
        return value[loc];
      }
      return "";
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), null, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<title${_scopeId}>${ssrInterpolate(metaTitle.value)}</title><meta name="description"${ssrRenderAttr("content", metaDescription.value)}${_scopeId}><meta name="keywords"${ssrRenderAttr("content", metaKeywords.value)}${_scopeId}><meta name="robots"${ssrRenderAttr("content", metaRobots.value)}${_scopeId}>`);
            if (metaCanonical.value) {
              _push2(`<link rel="canonical"${ssrRenderAttr("href", metaCanonical.value)}${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<meta property="og:title"${ssrRenderAttr("content", metaTitle.value)}${_scopeId}><meta property="og:description"${ssrRenderAttr("content", metaDescription.value)}${_scopeId}>`);
            if (metaImage.value) {
              _push2(`<meta property="og:image"${ssrRenderAttr("content", metaImage.value)}${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            if (metaCanonical.value) {
              _push2(`<meta property="og:url"${ssrRenderAttr("content", metaCanonical.value)}${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<meta property="og:type" content="website"${_scopeId}><meta name="twitter:card" content="summary_large_image"${_scopeId}><meta name="twitter:title"${ssrRenderAttr("content", metaTitle.value)}${_scopeId}><meta name="twitter:description"${ssrRenderAttr("content", metaDescription.value)}${_scopeId}>`);
            if (metaImage.value) {
              _push2(`<meta name="twitter:image"${ssrRenderAttr("content", metaImage.value)}${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("title", null, toDisplayString(metaTitle.value), 1),
              createVNode("meta", {
                name: "description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "keywords",
                content: metaKeywords.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "robots",
                content: metaRobots.value
              }, null, 8, ["content"]),
              metaCanonical.value ? (openBlock(), createBlock("link", {
                key: 0,
                rel: "canonical",
                href: metaCanonical.value
              }, null, 8, ["href"])) : createCommentVNode("", true),
              createVNode("meta", {
                property: "og:title",
                content: metaTitle.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              metaImage.value ? (openBlock(), createBlock("meta", {
                key: 1,
                property: "og:image",
                content: metaImage.value
              }, null, 8, ["content"])) : createCommentVNode("", true),
              metaCanonical.value ? (openBlock(), createBlock("meta", {
                key: 2,
                property: "og:url",
                content: metaCanonical.value
              }, null, 8, ["content"])) : createCommentVNode("", true),
              createVNode("meta", {
                property: "og:type",
                content: "website"
              }),
              createVNode("meta", {
                name: "twitter:card",
                content: "summary_large_image"
              }),
              createVNode("meta", {
                name: "twitter:title",
                content: metaTitle.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "twitter:description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              metaImage.value ? (openBlock(), createBlock("meta", {
                key: 3,
                name: "twitter:image",
                content: metaImage.value
              }, null, 8, ["content"])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$R, null, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<section class="section-hero"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$S, {
              number: "1",
              label: trans("HERO")
            }, null, _parent2, _scopeId));
            _push2(`<span class="br-line"${_scopeId}></span><div class="sect-tagline"${_scopeId}><div class="container"${_scopeId}><div class="sect-tagline_inner"${_scopeId}><span class="hafl-plus pst-left_bot wow bounceInScale"${_scopeId}></span><span class="hafl-plus pst-right_bot wow bounceInScale"${_scopeId}></span><p class="s-name text-caption font-2"${_scopeId}><span class="bar-group type-left"${_scopeId}><span class="bar_center"${_scopeId}></span></span><span class="hacker-text_transform no-delay"${_scopeId}>${ssrInterpolate(trans("Our Tech Solutions"))}</span><span class="bar-group type-right"${_scopeId}><span class="bar_center"${_scopeId}></span></span></p></div></div></div><span class="br-line"${_scopeId}></span><div class="sect-main"${_scopeId}><div class="container"${_scopeId}><div class="sect-title wow fadeInUp"${_scopeId}><h1 class="s-title font-3"${_scopeId}>${ssrInterpolate(trans("Transform complex technical ideas into intelligent systems"))} <br${_scopeId}><span class="text-change_wrap"${_scopeId}><span class="text-change_rotating"${_scopeId}>${ssrInterpolate(trans("Web Development"))}</span><span class="text-change_rotating"${_scopeId}>${ssrInterpolate(trans("AI automation"))}</span><span class="text-change_rotating"${_scopeId}>${ssrInterpolate(trans("Cloud services"))}</span></span></h1><p class="s-sub_title"${_scopeId}>${ssrInterpolate(trans("Help companies build practical technology solutions in Web, AI, automation, and cloud computing — designed for growth and sustainability"))}</p></div></div><span class="br-line"${_scopeId}></span><div class="container"${_scopeId}><div class="sect-content position-relative"${_scopeId}><div class="box-ask-wrap"${_scopeId}><div class="box-ask text-center p-4"${_scopeId}><div class="d-flex flex-wrap justify-content-center gap-3"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("contact-us"),
              class: "tf-btn style-2 style-high animate-btn animate-dark"
            }, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(trans("Book your free consultation"))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(trans("Book your free consultation")), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("services.index"),
              class: "tf-btn style-high animate-btn"
            }, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(trans("Explore Our Services"))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(trans("Explore Our Services")), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div><span class="hafl-plus pst-left_bot item_bot wow bounceInScale"${_scopeId}></span><span class="hafl-plus pst-right_bot item_bot wow bounceInScale"${_scopeId}></span><span class="hafl-plus pst-left_top item_top wow bounceInScale"${_scopeId}></span><span class="hafl-plus pst-right_top item_top wow bounceInScale"${_scopeId}></span></div><span class="line_section"${_scopeId}></span></div></div></div><span class="br-line"${_scopeId}></span>`);
            if (clients.value.length) {
              _push2(`<div class="tf-brand"${_scopeId}><div class="container"${_scopeId}><div class="tf-brand_inner"${_scopeId}><h5 class="title text-caption font-2 letter-space-0 fw-normal wow fadeInUp"${_scopeId}>${ssrInterpolate(trans("Trusted by companies we build with"))}</h5><div class="infiniteSlide infiniteSlide_brand" data-clone="3"${_scopeId}><!--[-->`);
              ssrRenderList(clients.value, (client) => {
                _push2(`<div class="image-brand"${_scopeId}><img${ssrRenderAttr("src", client.logo_link)}${ssrRenderAttr("alt", client.name)} loading="lazy"${_scopeId}></div>`);
              });
              _push2(`<!--]--></div><span class="hafl-plus pst-left_bot item_bot wow bounceInScale"${_scopeId}></span><span class="hafl-plus pst-right_bot item_bot wow bounceInScale"${_scopeId}></span></div></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<span class="br-line"${_scopeId}></span>`);
            _push2(ssrRenderComponent(_sfc_main$T, null, null, _parent2, _scopeId));
            _push2(`<span class="br-line"${_scopeId}></span></section>`);
            if (featuredCategories.value.length) {
              _push2(`<section class="section-feature" id="features"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$S, {
                number: "2",
                label: trans("FEATURES")
              }, null, _parent2, _scopeId));
              _push2(`<span class="br-line"${_scopeId}></span><div class="sect-tagline"${_scopeId}><div class="container"${_scopeId}><div class="sect-tagline_inner"${_scopeId}><span class="hafl-plus pst-left_bot wow bounceInScale"${_scopeId}></span><span class="hafl-plus pst-right_bot wow bounceInScale"${_scopeId}></span><p class="s-name text-caption font-2"${_scopeId}><span class="bar-group type-left"${_scopeId}><span class="bar_center"${_scopeId}></span></span><span class="hacker-text_transform no-delay"${_scopeId}>${ssrInterpolate(trans("What We Do"))} — ${ssrInterpolate(trans("Core Services"))}</span><span class="bar-group type-right"${_scopeId}><span class="bar_center"${_scopeId}></span></span></p></div></div></div><span class="br-line"${_scopeId}></span><div class="sect-main flat-animate-tab"${_scopeId}><div class="s-img_item wow bounceInScale"${_scopeId}><img class="lazyload"${ssrRenderAttr("src", asset_path.value + "qore/images/section/smoke-blue.webp")}${ssrRenderAttr("data-src", asset_path.value + "qore/images/section/smoke-blue.webp")} alt=""${_scopeId}></div><div class="container"${_scopeId}><div class="sect-title wow fadeInUp"${_scopeId}><h2 class="s-title font-3"${_scopeId}>${ssrInterpolate(trans("What We Do"))}</h2><p class="s-sub_title"${_scopeId}>${ssrInterpolate(trans("Transform your business with our innovative IT solutions, tailored to address your unique challenges and drive growth in today's digital landscape."))}</p></div><div class="tab-content"${_scopeId}><!--[-->`);
              ssrRenderList(featuredCategories.value, (category, index) => {
                _push2(`<div class="${ssrRenderClass([{ "active show": index === 0 }, "tab-pane"])}"${ssrRenderAttr("id", `service-cat-${category.id}`)} role="tabpanel"${_scopeId}><div class="image-with-text"${_scopeId}>`);
                if (category.image_link) {
                  _push2(`<img${ssrRenderAttr("src", category.image_link)}${ssrRenderAttr("alt", translateField(category.title))} width="920" height="420" loading="lazy" decoding="async"${_scopeId}>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<div class="sect-title box-text"${_scopeId}><h4 class="s-title"${_scopeId}>${ssrInterpolate(translateField(category.title))}</h4><p class="s-sub_title text-body-3"${_scopeId}>${ssrInterpolate(translateField(category.description))}</p>`);
                _push2(ssrRenderComponent(unref(Link), {
                  href: _ctx.route("services.index", { category: category.slug }),
                  class: "tf-btn animate-btn mt-3"
                }, {
                  default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(trans("View All Services"))}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(trans("View All Services")), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`</div></div></div>`);
              });
              _push2(`<!--]--></div><ul class="tab-can_do" role="tablist"${_scopeId}><!--[-->`);
              ssrRenderList(featuredCategories.value, (category, index) => {
                _push2(`<li class="${ssrRenderClass([{ active: index === 0 }, "nav-tab-item"])}" role="presentation"${_scopeId}><div class="${ssrRenderClass([{ active: index === 0 }, "btn_tab"])}" data-bs-toggle="tab"${ssrRenderAttr("data-bs-target", `#service-cat-${category.id}`)} role="tab"${_scopeId}>${ssrInterpolate(translateField(category.title))}</div></li>`);
              });
              _push2(`<!--]--></ul></div></div><span class="br-line"${_scopeId}></span>`);
              _push2(ssrRenderComponent(_sfc_main$T, null, null, _parent2, _scopeId));
              _push2(`<span class="br-line"${_scopeId}></span></section>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<section class="section-benefit"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$S, {
              number: "3",
              label: trans("BENEFITS")
            }, null, _parent2, _scopeId));
            _push2(`<span class="br-line"${_scopeId}></span><div class="sect-tagline"${_scopeId}><div class="container"${_scopeId}><div class="sect-tagline_inner"${_scopeId}><span class="hafl-plus pst-left_bot wow bounceInScale"${_scopeId}></span><span class="hafl-plus pst-right_bot wow bounceInScale"${_scopeId}></span><p class="s-name text-caption font-2"${_scopeId}><span class="bar-group type-left"${_scopeId}><span class="bar_center"${_scopeId}></span></span><span class="hacker-text_transform no-delay"${_scopeId}>${ssrInterpolate(trans("Why Choose Us"))}</span><span class="bar-group type-right"${_scopeId}><span class="bar_center"${_scopeId}></span></span></p></div></div></div><span class="br-line"${_scopeId}></span><div class="sect-main"${_scopeId}><div class="container"${_scopeId}><div class="place-video"${_scopeId}><div class="visual-object"${_scopeId}><div class="object_img wow bounceInScale"${_scopeId}><div class="image"${_scopeId}><img${ssrRenderAttr("src", asset_path.value + "qore/images/section/visual-object.png")}${ssrRenderAttr("alt", trans("Why Choose Us"))} width="424" height="424" loading="lazy" decoding="async"${_scopeId}></div><span class="hafl-plus start-0 top-0 rotate-top_left wow bounceInScale"${_scopeId}></span><span class="hafl-plus end-0 top-0 rotate-top_right wow bounceInScale"${_scopeId}></span></div></div><div class="sect-title wow fadeInUp"${_scopeId}><h2 class="s-title font-3"${_scopeId}>${ssrInterpolate(trans("Why Choose Symfonix for Web, AI, and Cloud"))}</h2><p class="s-sub_title"${_scopeId}>${ssrInterpolate(trans("We deliver exceptional products and services that consistently exceed expectations. Backed by years of experience and a proven track record, we are your reliable partner for success."))}</p></div></div><div class="position-relative"${_scopeId}><div class="grid-box_icon tf-grid-layout sm-col-2 md-col-3"${_scopeId}><div class="box-icon-text wow fadeInUp"${_scopeId}><div class="icon"${_scopeId}><img${ssrRenderAttr("src", asset_path.value + "qore/images/section/secure.svg")} alt=""${_scopeId}></div><div class="content"${_scopeId}><p class="title text-main-2"${_scopeId}>${ssrInterpolate(trans("Developing Secure & Scalable Systems"))}</p><p class="sub-title text-body-3"${_scopeId}>${ssrInterpolate(trans("Unmatched Quality"))} — ${ssrInterpolate(trans("We deliver exceptional products and services that exceed expectations every time."))}</p></div></div><div class="box-icon-text wow fadeInUp"${_scopeId}><div class="icon"${_scopeId}><img${ssrRenderAttr("src", asset_path.value + "qore/images/section/ai-core.svg")} alt=""${_scopeId}></div><div class="content"${_scopeId}><p class="title text-main-2"${_scopeId}>${ssrInterpolate(trans("Innovative IT Solutions Expert"))}</p><p class="sub-title text-body-3"${_scopeId}>${ssrInterpolate(trans("Trusted Expertise"))} — ${ssrInterpolate(trans("Backed by years of experience and a proven track record, we are your reliable partner for success."))}</p></div></div><div class="box-icon-text wow fadeInUp"${_scopeId}><div class="icon"${_scopeId}><img${ssrRenderAttr("src", asset_path.value + "qore/images/section/control.svg")} alt=""${_scopeId}></div><div class="content"${_scopeId}><p class="title text-main-2"${_scopeId}>${ssrInterpolate(trans("User-Centric Approach"))}</p><p class="sub-title text-body-3"${_scopeId}>${ssrInterpolate(trans("Your satisfaction is our priority, and we tailor solutions to meet your unique needs. Your happiness comes first."))}</p></div></div><div class="box-icon-text wow fadeInUp"${_scopeId}><div class="icon"${_scopeId}><img${ssrRenderAttr("src", asset_path.value + "qore/images/section/platform.svg")} alt=""${_scopeId}></div><div class="content"${_scopeId}><p class="title text-main-2"${_scopeId}>${ssrInterpolate(trans("Harmony over chaos"))}</p><p class="sub-title text-body-3"${_scopeId}>${ssrInterpolate(trans("Every solution must be coherent. No messy stacks, no duct-tape architectures."))}</p></div></div><div class="box-icon-text wow fadeInUp"${_scopeId}><div class="icon"${_scopeId}><img${ssrRenderAttr("src", asset_path.value + "qore/images/section/speed.svg")} alt=""${_scopeId}></div><div class="content"${_scopeId}><p class="title text-main-2"${_scopeId}>${ssrInterpolate(trans("Speed that scales"))}</p><p class="sub-title text-body-3"${_scopeId}>${ssrInterpolate(trans("From personalized solutions to expert execution, we prioritize quality, reliability, and customer satisfaction"))}</p></div></div><div class="box-icon-text wow fadeInUp"${_scopeId}><div class="icon"${_scopeId}><img${ssrRenderAttr("src", asset_path.value + "qore/images/section/evolving.svg")} alt=""${_scopeId}></div><div class="content"${_scopeId}><p class="title text-main-2"${_scopeId}>${ssrInterpolate(trans("Always evolving"))}</p><p class="sub-title text-body-3"${_scopeId}>${ssrInterpolate(trans("AI, cloud, and software evolve fast. We evolve faster."))}</p></div></div></div><span class="hafl-plus pst-left_bot item_bot wow bounceInScale"${_scopeId}></span><span class="hafl-plus pst-right_bot item_bot wow bounceInScale"${_scopeId}></span></div></div></div><span class="br-line"${_scopeId}></span>`);
            _push2(ssrRenderComponent(_sfc_main$T, null, null, _parent2, _scopeId));
            _push2(`<span class="br-line"${_scopeId}></span></section><section class="section-how-to" id="howToUse"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$S, {
              number: "4",
              label: trans("HOW TO")
            }, null, _parent2, _scopeId));
            _push2(`<span class="br-line"${_scopeId}></span><div class="sect-tagline"${_scopeId}><div class="container"${_scopeId}><div class="sect-tagline_inner"${_scopeId}><span class="hafl-plus pst-left_bot wow bounceInScale"${_scopeId}></span><span class="hafl-plus pst-right_bot wow bounceInScale"${_scopeId}></span><p class="s-name text-caption font-2"${_scopeId}><span class="bar-group type-left"${_scopeId}><span class="bar_center"${_scopeId}></span></span><span class="hacker-text_transform no-delay"${_scopeId}>${ssrInterpolate(trans("How do we deliver reliable, future-ready IT solutions?"))}</span><span class="bar-group type-right"${_scopeId}><span class="bar_center"${_scopeId}></span></span></p></div></div></div><span class="br-line"${_scopeId}></span><div class="sect-main flat-animate-tab"${_scopeId}><div class="s-img_item wow bounceInScale"${_scopeId}><img class="lazyload"${ssrRenderAttr("src", asset_path.value + "qore/images/section/gradient-ring-bg.webp")}${ssrRenderAttr("data-src", asset_path.value + "qore/images/section/gradient-ring-bg.webp")} alt=""${_scopeId}></div><div class="container"${_scopeId}><div class="sect-title wow fadeInUp"${_scopeId}><h2 class="s-title font-3 m-0"${_scopeId}>${ssrInterpolate(trans("How do we deliver reliable, future-ready IT solutions?"))}</h2></div><div class="row"${_scopeId}><div class="col-md-6 offset-xl-1 col-xl-4"${_scopeId}><div class="tab-content mb-md-0 sticky-top wow fadeInUp"${_scopeId}><div class="tab-pane active show" id="home-step1" role="tabpanel"${_scopeId}><div class="image-how_to wow bounceInScale"${_scopeId}><img class="lazyload"${ssrRenderAttr("src", asset_path.value + "qore/images/section/step-1.webp")}${ssrRenderAttr("data-src", asset_path.value + "qore/images/section/step-1.webp")}${ssrRenderAttr("alt", trans("Discover"))}${_scopeId}><span class="hafl-plus start-0 top-0 rotate-top_left"${_scopeId}></span><span class="hafl-plus end-0 top-0 rotate-top_right"${_scopeId}></span><span class="hafl-plus start-0 bottom-0 item_bot rotate-bot_left"${_scopeId}></span><span class="hafl-plus end-0 bottom-0 item_bot rotate-bot_right"${_scopeId}></span></div></div><div class="tab-pane" id="home-step2" role="tabpanel"${_scopeId}><div class="image-how_to"${_scopeId}><img class="lazyload"${ssrRenderAttr("src", asset_path.value + "qore/images/section/step-2.webp")}${ssrRenderAttr("data-src", asset_path.value + "qore/images/section/step-2.webp")}${ssrRenderAttr("alt", trans("Build"))}${_scopeId}><span class="hafl-plus start-0 top-0 rotate-top_left"${_scopeId}></span><span class="hafl-plus end-0 top-0 rotate-top_right"${_scopeId}></span><span class="hafl-plus start-0 bottom-0 item_bot rotate-bot_left"${_scopeId}></span><span class="hafl-plus end-0 bottom-0 item_bot rotate-bot_right"${_scopeId}></span></div></div><div class="tab-pane" id="home-step3" role="tabpanel"${_scopeId}><div class="image-how_to"${_scopeId}><img class="lazyload"${ssrRenderAttr("src", asset_path.value + "qore/images/section/step-3.webp")}${ssrRenderAttr("data-src", asset_path.value + "qore/images/section/step-3.webp")}${ssrRenderAttr("alt", trans("Launch"))}${_scopeId}><span class="hafl-plus start-0 top-0 rotate-top_left"${_scopeId}></span><span class="hafl-plus end-0 top-0 rotate-top_right"${_scopeId}></span><span class="hafl-plus start-0 bottom-0 item_bot rotate-bot_left"${_scopeId}></span><span class="hafl-plus end-0 bottom-0 item_bot rotate-bot_right"${_scopeId}></span></div></div></div></div><div class="col-md-6 offset-xl-2 col-xl-4"${_scopeId}><ul class="tab-how_to position-relative mx-1 wow fadeInUp" role="tablist"${_scopeId}><li class="nav-tab-item" role="presentation"${_scopeId}><div data-bs-toggle="tab" data-bs-target="#home-step1" class="btn_tab active" role="tab"${_scopeId}><p class="number-step text-caption font-2"${_scopeId}>STEP 01</p><h5 class="name"${_scopeId}>${ssrInterpolate(trans("Discover"))}</h5><p class="desc"${_scopeId}>${ssrInterpolate(trans("Transform complex technical ideas into intelligent systems"))}</p></div></li><li class="br-line has-dot"${_scopeId}></li><li class="nav-tab-item" role="presentation"${_scopeId}><div data-bs-toggle="tab" data-bs-target="#home-step2" class="btn_tab" role="tab"${_scopeId}><p class="number-step text-caption font-2"${_scopeId}>STEP 02</p><h5 class="name"${_scopeId}>${ssrInterpolate(trans("Build"))}</h5><p class="desc"${_scopeId}>${ssrInterpolate(trans("Developing Secure & Scalable Systems"))}</p></div></li><li class="br-line has-dot"${_scopeId}></li><li class="nav-tab-item" role="presentation"${_scopeId}><div data-bs-toggle="tab" data-bs-target="#home-step3" class="btn_tab" role="tab"${_scopeId}><p class="number-step text-caption font-2"${_scopeId}>STEP 03</p><h5 class="name"${_scopeId}>${ssrInterpolate(trans("Launch"))}</h5><p class="desc"${_scopeId}>${ssrInterpolate(trans("Help companies build practical technology solutions in Web, AI, automation, and cloud computing — designed for growth and sustainability"))}</p></div></li></ul></div></div><div class="position-relative has-hafl_plus"${_scopeId}><span class="hafl-plus pst-left_bot item_bot wow bounceInScale"${_scopeId}></span><span class="hafl-plus pst-right_bot item_bot wow bounceInScale"${_scopeId}></span></div></div></div><span class="br-line"${_scopeId}></span>`);
            _push2(ssrRenderComponent(_sfc_main$T, null, null, _parent2, _scopeId));
            _push2(`<span class="br-line"${_scopeId}></span></section>`);
            if (products.value.length) {
              _push2(`<section class="section-pricing" id="pricing"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$S, {
                number: "5",
                label: trans("PRODUCTS")
              }, null, _parent2, _scopeId));
              _push2(`<span class="br-line"${_scopeId}></span><div class="sect-main"${_scopeId}><div class="container"${_scopeId}><div class="sect-title wow fadeInUp"${_scopeId}><h2 class="s-title font-3 m-0"${_scopeId}>${ssrInterpolate(trans("B2B Solutions Built for Scale"))}</h2></div><div class="grid-pricing"${_scopeId}><!--[-->`);
              ssrRenderList(products.value, (product) => {
                var _a;
                _push2(`<div class="wg-plan wow fadeInUp"${_scopeId}><div class="content"${_scopeId}><div class="plan-header"${_scopeId}>`);
                if (product.main_image_link) {
                  _push2(`<div class="image mb-3"${_scopeId}><img${ssrRenderAttr("src", product.main_image_link)}${ssrRenderAttr("alt", product.name)} loading="lazy"${_scopeId}></div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<p class="plan_type text-body-1"${_scopeId}>${ssrInterpolate(((_a = product.category) == null ? void 0 : _a.name) || trans("Product"))}</p><h3 class="price-amount" style="${ssrRenderStyle({ "font-size": "1.75rem" })}"${_scopeId}>${ssrInterpolate(product.name)}</h3><p class="plan-description"${_scopeId}>${ssrInterpolate(product.short_description)}</p>`);
                _push2(ssrRenderComponent(unref(Link), {
                  href: _ctx.route("product.show", product.slug),
                  class: "tf-btn style-3 style-high animate-btn w-100"
                }, {
                  default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<span class="text-body-3"${_scopeId2}>${ssrInterpolate(trans("View Details"))}</span>`);
                    } else {
                      return [
                        createVNode("span", { class: "text-body-3" }, toDisplayString(trans("View Details")), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`</div></div></div>`);
              });
              _push2(`<!--]--></div><div class="text-center mt-4"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: _ctx.route("product.index"),
                class: "tf-btn animate-btn"
              }, {
                default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(trans("View All Products"))}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(trans("View All Products")), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div></div></div><span class="br-line"${_scopeId}></span>`);
              _push2(ssrRenderComponent(_sfc_main$T, null, null, _parent2, _scopeId));
              _push2(`<span class="br-line"${_scopeId}></span></section>`);
            } else {
              _push2(`<!---->`);
            }
            if (useCases.value.length) {
              _push2(`<section class="section-feature"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$S, {
                number: "6",
                label: trans("CASE STUDIES")
              }, null, _parent2, _scopeId));
              _push2(`<span class="br-line"${_scopeId}></span><div class="sect-main"${_scopeId}><div class="container"${_scopeId}><div class="sect-title wow fadeInUp"${_scopeId}><h2 class="s-title font-3"${_scopeId}>${ssrInterpolate(trans("How We've Empowered Businesses with Innovative Tech Solutions"))}</h2></div><div class="tf-grid-layout sm-col-2"${_scopeId}><!--[-->`);
              ssrRenderList(useCases.value, (item) => {
                _push2(ssrRenderComponent(_sfc_main$P, {
                  key: item.id,
                  item
                }, null, _parent2, _scopeId));
              });
              _push2(`<!--]--></div><div class="text-center mt-4"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: _ctx.route("use-cases.index"),
                class: "tf-btn animate-btn"
              }, {
                default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(trans("Case Studies"))}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(trans("Case Studies")), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div></div></div><span class="br-line"${_scopeId}></span>`);
              _push2(ssrRenderComponent(_sfc_main$T, null, null, _parent2, _scopeId));
              _push2(`<span class="br-line"${_scopeId}></span></section>`);
            } else {
              _push2(`<!---->`);
            }
            if (testimonials.value.length) {
              _push2(`<section class="section-testimonial"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$S, {
                number: "7",
                label: trans("TESTIMONIALS")
              }, null, _parent2, _scopeId));
              _push2(`<span class="br-line"${_scopeId}></span><div class="sect-main"${_scopeId}><div class="container"${_scopeId}><div class="sect-title wow fadeInUp"${_scopeId}><h2 class="s-title font-3 m-0"${_scopeId}>${ssrInterpolate(trans("What Our Clients Say"))}</h2></div><div class="testimonial-slide-wrap"${_scopeId}><div class="overflow-hidden has-overlay_linear type-2 mx-1"${_scopeId}><div class="infiniteSlide infiniteSlide-tes"${_scopeId}><!--[-->`);
              ssrRenderList(testimonials.value, (testimonial) => {
                _push2(`<div class="wg-testimonial"${_scopeId}><div class="tes-author"${_scopeId}><div class="author_image"${_scopeId}><img${ssrRenderAttr("src", testimonial.avatar_link)}${ssrRenderAttr("alt", translateField(testimonial.name))}${_scopeId}></div><div class="author_info"${_scopeId}><span class="link name"${_scopeId}>${ssrInterpolate(translateField(testimonial.name))}</span><p class="text-body-3"${_scopeId}>${ssrInterpolate(translateField(testimonial.position))}</p></div></div><p class="tes-text"${_scopeId}>${ssrInterpolate(translateField(testimonial.quote))}</p></div>`);
              });
              _push2(`<!--]--></div></div></div></div></div><span class="br-line"${_scopeId}></span>`);
              _push2(ssrRenderComponent(_sfc_main$T, null, null, _parent2, _scopeId));
              _push2(`<span class="br-line"${_scopeId}></span></section>`);
            } else {
              _push2(`<!---->`);
            }
            if (posts.value.length) {
              _push2(`<section class="section-page-blog home-blogs"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$S, {
                number: "8",
                label: trans("BLOG")
              }, null, _parent2, _scopeId));
              _push2(`<span class="br-line"${_scopeId}></span><div class="sect-main"${_scopeId}><div class="container"${_scopeId}><div class="sect-title wow fadeInUp"${_scopeId}><h2 class="s-title font-3"${_scopeId}>${ssrInterpolate(trans("Blogs"))}</h2></div><div class="tf-grid-layout sm-col-2 md-col-3 home-blogs__grid"${_scopeId}><!--[-->`);
              ssrRenderList(posts.value.slice(0, 3), (post) => {
                _push2(ssrRenderComponent(_sfc_main$Q, {
                  key: post.id,
                  blog: post,
                  "show-description": true
                }, null, _parent2, _scopeId));
              });
              _push2(`<!--]--></div><div class="text-center mt-4"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: _ctx.route("blogs.index"),
                class: "tf-btn animate-btn"
              }, {
                default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(trans("Blogs"))}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(trans("Blogs")), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div></div></div><span class="br-line"${_scopeId}></span>`);
              _push2(ssrRenderComponent(_sfc_main$T, null, null, _parent2, _scopeId));
              _push2(`<span class="br-line"${_scopeId}></span></section>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("section", { class: "section-hero" }, [
                createVNode(_sfc_main$S, {
                  number: "1",
                  label: trans("HERO")
                }, null, 8, ["label"]),
                createVNode("span", { class: "br-line" }),
                createVNode("div", { class: "sect-tagline" }, [
                  createVNode("div", { class: "container" }, [
                    createVNode("div", { class: "sect-tagline_inner" }, [
                      createVNode("span", { class: "hafl-plus pst-left_bot wow bounceInScale" }),
                      createVNode("span", { class: "hafl-plus pst-right_bot wow bounceInScale" }),
                      createVNode("p", { class: "s-name text-caption font-2" }, [
                        createVNode("span", { class: "bar-group type-left" }, [
                          createVNode("span", { class: "bar_center" })
                        ]),
                        createVNode("span", { class: "hacker-text_transform no-delay" }, toDisplayString(trans("Our Tech Solutions")), 1),
                        createVNode("span", { class: "bar-group type-right" }, [
                          createVNode("span", { class: "bar_center" })
                        ])
                      ])
                    ])
                  ])
                ]),
                createVNode("span", { class: "br-line" }),
                createVNode("div", { class: "sect-main" }, [
                  createVNode("div", { class: "container" }, [
                    createVNode("div", { class: "sect-title wow fadeInUp" }, [
                      createVNode("h1", { class: "s-title font-3" }, [
                        createTextVNode(toDisplayString(trans("Transform complex technical ideas into intelligent systems")) + " ", 1),
                        createVNode("br"),
                        createVNode("span", { class: "text-change_wrap" }, [
                          createVNode("span", { class: "text-change_rotating" }, toDisplayString(trans("Web Development")), 1),
                          createVNode("span", { class: "text-change_rotating" }, toDisplayString(trans("AI automation")), 1),
                          createVNode("span", { class: "text-change_rotating" }, toDisplayString(trans("Cloud services")), 1)
                        ])
                      ]),
                      createVNode("p", { class: "s-sub_title" }, toDisplayString(trans("Help companies build practical technology solutions in Web, AI, automation, and cloud computing — designed for growth and sustainability")), 1)
                    ])
                  ]),
                  createVNode("span", { class: "br-line" }),
                  createVNode("div", { class: "container" }, [
                    createVNode("div", { class: "sect-content position-relative" }, [
                      createVNode("div", { class: "box-ask-wrap" }, [
                        createVNode("div", { class: "box-ask text-center p-4" }, [
                          createVNode("div", { class: "d-flex flex-wrap justify-content-center gap-3" }, [
                            createVNode(unref(Link), {
                              href: _ctx.route("contact-us"),
                              class: "tf-btn style-2 style-high animate-btn animate-dark"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(trans("Book your free consultation")), 1)
                              ]),
                              _: 1
                            }, 8, ["href"]),
                            createVNode(unref(Link), {
                              href: _ctx.route("services.index"),
                              class: "tf-btn style-high animate-btn"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(trans("Explore Our Services")), 1)
                              ]),
                              _: 1
                            }, 8, ["href"])
                          ])
                        ]),
                        createVNode("span", { class: "hafl-plus pst-left_bot item_bot wow bounceInScale" }),
                        createVNode("span", { class: "hafl-plus pst-right_bot item_bot wow bounceInScale" }),
                        createVNode("span", { class: "hafl-plus pst-left_top item_top wow bounceInScale" }),
                        createVNode("span", { class: "hafl-plus pst-right_top item_top wow bounceInScale" })
                      ]),
                      createVNode("span", { class: "line_section" })
                    ])
                  ])
                ]),
                createVNode("span", { class: "br-line" }),
                clients.value.length ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "tf-brand"
                }, [
                  createVNode("div", { class: "container" }, [
                    createVNode("div", { class: "tf-brand_inner" }, [
                      createVNode("h5", { class: "title text-caption font-2 letter-space-0 fw-normal wow fadeInUp" }, toDisplayString(trans("Trusted by companies we build with")), 1),
                      createVNode("div", {
                        class: "infiniteSlide infiniteSlide_brand",
                        "data-clone": "3"
                      }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(clients.value, (client) => {
                          return openBlock(), createBlock("div", {
                            key: client.id,
                            class: "image-brand"
                          }, [
                            createVNode("img", {
                              src: client.logo_link,
                              alt: client.name,
                              loading: "lazy"
                            }, null, 8, ["src", "alt"])
                          ]);
                        }), 128))
                      ]),
                      createVNode("span", { class: "hafl-plus pst-left_bot item_bot wow bounceInScale" }),
                      createVNode("span", { class: "hafl-plus pst-right_bot item_bot wow bounceInScale" })
                    ])
                  ])
                ])) : createCommentVNode("", true),
                createVNode("span", { class: "br-line" }),
                createVNode(_sfc_main$T),
                createVNode("span", { class: "br-line" })
              ]),
              featuredCategories.value.length ? (openBlock(), createBlock("section", {
                key: 0,
                class: "section-feature",
                id: "features"
              }, [
                createVNode(_sfc_main$S, {
                  number: "2",
                  label: trans("FEATURES")
                }, null, 8, ["label"]),
                createVNode("span", { class: "br-line" }),
                createVNode("div", { class: "sect-tagline" }, [
                  createVNode("div", { class: "container" }, [
                    createVNode("div", { class: "sect-tagline_inner" }, [
                      createVNode("span", { class: "hafl-plus pst-left_bot wow bounceInScale" }),
                      createVNode("span", { class: "hafl-plus pst-right_bot wow bounceInScale" }),
                      createVNode("p", { class: "s-name text-caption font-2" }, [
                        createVNode("span", { class: "bar-group type-left" }, [
                          createVNode("span", { class: "bar_center" })
                        ]),
                        createVNode("span", { class: "hacker-text_transform no-delay" }, toDisplayString(trans("What We Do")) + " — " + toDisplayString(trans("Core Services")), 1),
                        createVNode("span", { class: "bar-group type-right" }, [
                          createVNode("span", { class: "bar_center" })
                        ])
                      ])
                    ])
                  ])
                ]),
                createVNode("span", { class: "br-line" }),
                createVNode("div", { class: "sect-main flat-animate-tab" }, [
                  createVNode("div", { class: "s-img_item wow bounceInScale" }, [
                    createVNode("img", {
                      class: "lazyload",
                      src: asset_path.value + "qore/images/section/smoke-blue.webp",
                      "data-src": asset_path.value + "qore/images/section/smoke-blue.webp",
                      alt: ""
                    }, null, 8, ["src", "data-src"])
                  ]),
                  createVNode("div", { class: "container" }, [
                    createVNode("div", { class: "sect-title wow fadeInUp" }, [
                      createVNode("h2", { class: "s-title font-3" }, toDisplayString(trans("What We Do")), 1),
                      createVNode("p", { class: "s-sub_title" }, toDisplayString(trans("Transform your business with our innovative IT solutions, tailored to address your unique challenges and drive growth in today's digital landscape.")), 1)
                    ]),
                    createVNode("div", { class: "tab-content" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(featuredCategories.value, (category, index) => {
                        return openBlock(), createBlock("div", {
                          key: category.id,
                          class: ["tab-pane", { "active show": index === 0 }],
                          id: `service-cat-${category.id}`,
                          role: "tabpanel"
                        }, [
                          createVNode("div", { class: "image-with-text" }, [
                            category.image_link ? (openBlock(), createBlock("img", {
                              key: 0,
                              src: category.image_link,
                              alt: translateField(category.title),
                              width: "920",
                              height: "420",
                              loading: "lazy",
                              decoding: "async"
                            }, null, 8, ["src", "alt"])) : createCommentVNode("", true),
                            createVNode("div", { class: "sect-title box-text" }, [
                              createVNode("h4", { class: "s-title" }, toDisplayString(translateField(category.title)), 1),
                              createVNode("p", { class: "s-sub_title text-body-3" }, toDisplayString(translateField(category.description)), 1),
                              createVNode(unref(Link), {
                                href: _ctx.route("services.index", { category: category.slug }),
                                class: "tf-btn animate-btn mt-3"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(trans("View All Services")), 1)
                                ]),
                                _: 1
                              }, 8, ["href"])
                            ])
                          ])
                        ], 10, ["id"]);
                      }), 128))
                    ]),
                    createVNode("ul", {
                      class: "tab-can_do",
                      role: "tablist"
                    }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(featuredCategories.value, (category, index) => {
                        return openBlock(), createBlock("li", {
                          key: `tab-${category.id}`,
                          class: ["nav-tab-item", { active: index === 0 }],
                          role: "presentation"
                        }, [
                          createVNode("div", {
                            class: ["btn_tab", { active: index === 0 }],
                            "data-bs-toggle": "tab",
                            "data-bs-target": `#service-cat-${category.id}`,
                            role: "tab"
                          }, toDisplayString(translateField(category.title)), 11, ["data-bs-target"])
                        ], 2);
                      }), 128))
                    ])
                  ])
                ]),
                createVNode("span", { class: "br-line" }),
                createVNode(_sfc_main$T),
                createVNode("span", { class: "br-line" })
              ])) : createCommentVNode("", true),
              createVNode("section", { class: "section-benefit" }, [
                createVNode(_sfc_main$S, {
                  number: "3",
                  label: trans("BENEFITS")
                }, null, 8, ["label"]),
                createVNode("span", { class: "br-line" }),
                createVNode("div", { class: "sect-tagline" }, [
                  createVNode("div", { class: "container" }, [
                    createVNode("div", { class: "sect-tagline_inner" }, [
                      createVNode("span", { class: "hafl-plus pst-left_bot wow bounceInScale" }),
                      createVNode("span", { class: "hafl-plus pst-right_bot wow bounceInScale" }),
                      createVNode("p", { class: "s-name text-caption font-2" }, [
                        createVNode("span", { class: "bar-group type-left" }, [
                          createVNode("span", { class: "bar_center" })
                        ]),
                        createVNode("span", { class: "hacker-text_transform no-delay" }, toDisplayString(trans("Why Choose Us")), 1),
                        createVNode("span", { class: "bar-group type-right" }, [
                          createVNode("span", { class: "bar_center" })
                        ])
                      ])
                    ])
                  ])
                ]),
                createVNode("span", { class: "br-line" }),
                createVNode("div", { class: "sect-main" }, [
                  createVNode("div", { class: "container" }, [
                    createVNode("div", { class: "place-video" }, [
                      createVNode("div", { class: "visual-object" }, [
                        createVNode("div", { class: "object_img wow bounceInScale" }, [
                          createVNode("div", { class: "image" }, [
                            createVNode("img", {
                              src: asset_path.value + "qore/images/section/visual-object.png",
                              alt: trans("Why Choose Us"),
                              width: "424",
                              height: "424",
                              loading: "lazy",
                              decoding: "async"
                            }, null, 8, ["src", "alt"])
                          ]),
                          createVNode("span", { class: "hafl-plus start-0 top-0 rotate-top_left wow bounceInScale" }),
                          createVNode("span", { class: "hafl-plus end-0 top-0 rotate-top_right wow bounceInScale" })
                        ])
                      ]),
                      createVNode("div", { class: "sect-title wow fadeInUp" }, [
                        createVNode("h2", { class: "s-title font-3" }, toDisplayString(trans("Why Choose Symfonix for Web, AI, and Cloud")), 1),
                        createVNode("p", { class: "s-sub_title" }, toDisplayString(trans("We deliver exceptional products and services that consistently exceed expectations. Backed by years of experience and a proven track record, we are your reliable partner for success.")), 1)
                      ])
                    ]),
                    createVNode("div", { class: "position-relative" }, [
                      createVNode("div", { class: "grid-box_icon tf-grid-layout sm-col-2 md-col-3" }, [
                        createVNode("div", { class: "box-icon-text wow fadeInUp" }, [
                          createVNode("div", { class: "icon" }, [
                            createVNode("img", {
                              src: asset_path.value + "qore/images/section/secure.svg",
                              alt: ""
                            }, null, 8, ["src"])
                          ]),
                          createVNode("div", { class: "content" }, [
                            createVNode("p", { class: "title text-main-2" }, toDisplayString(trans("Developing Secure & Scalable Systems")), 1),
                            createVNode("p", { class: "sub-title text-body-3" }, toDisplayString(trans("Unmatched Quality")) + " — " + toDisplayString(trans("We deliver exceptional products and services that exceed expectations every time.")), 1)
                          ])
                        ]),
                        createVNode("div", { class: "box-icon-text wow fadeInUp" }, [
                          createVNode("div", { class: "icon" }, [
                            createVNode("img", {
                              src: asset_path.value + "qore/images/section/ai-core.svg",
                              alt: ""
                            }, null, 8, ["src"])
                          ]),
                          createVNode("div", { class: "content" }, [
                            createVNode("p", { class: "title text-main-2" }, toDisplayString(trans("Innovative IT Solutions Expert")), 1),
                            createVNode("p", { class: "sub-title text-body-3" }, toDisplayString(trans("Trusted Expertise")) + " — " + toDisplayString(trans("Backed by years of experience and a proven track record, we are your reliable partner for success.")), 1)
                          ])
                        ]),
                        createVNode("div", { class: "box-icon-text wow fadeInUp" }, [
                          createVNode("div", { class: "icon" }, [
                            createVNode("img", {
                              src: asset_path.value + "qore/images/section/control.svg",
                              alt: ""
                            }, null, 8, ["src"])
                          ]),
                          createVNode("div", { class: "content" }, [
                            createVNode("p", { class: "title text-main-2" }, toDisplayString(trans("User-Centric Approach")), 1),
                            createVNode("p", { class: "sub-title text-body-3" }, toDisplayString(trans("Your satisfaction is our priority, and we tailor solutions to meet your unique needs. Your happiness comes first.")), 1)
                          ])
                        ]),
                        createVNode("div", { class: "box-icon-text wow fadeInUp" }, [
                          createVNode("div", { class: "icon" }, [
                            createVNode("img", {
                              src: asset_path.value + "qore/images/section/platform.svg",
                              alt: ""
                            }, null, 8, ["src"])
                          ]),
                          createVNode("div", { class: "content" }, [
                            createVNode("p", { class: "title text-main-2" }, toDisplayString(trans("Harmony over chaos")), 1),
                            createVNode("p", { class: "sub-title text-body-3" }, toDisplayString(trans("Every solution must be coherent. No messy stacks, no duct-tape architectures.")), 1)
                          ])
                        ]),
                        createVNode("div", { class: "box-icon-text wow fadeInUp" }, [
                          createVNode("div", { class: "icon" }, [
                            createVNode("img", {
                              src: asset_path.value + "qore/images/section/speed.svg",
                              alt: ""
                            }, null, 8, ["src"])
                          ]),
                          createVNode("div", { class: "content" }, [
                            createVNode("p", { class: "title text-main-2" }, toDisplayString(trans("Speed that scales")), 1),
                            createVNode("p", { class: "sub-title text-body-3" }, toDisplayString(trans("From personalized solutions to expert execution, we prioritize quality, reliability, and customer satisfaction")), 1)
                          ])
                        ]),
                        createVNode("div", { class: "box-icon-text wow fadeInUp" }, [
                          createVNode("div", { class: "icon" }, [
                            createVNode("img", {
                              src: asset_path.value + "qore/images/section/evolving.svg",
                              alt: ""
                            }, null, 8, ["src"])
                          ]),
                          createVNode("div", { class: "content" }, [
                            createVNode("p", { class: "title text-main-2" }, toDisplayString(trans("Always evolving")), 1),
                            createVNode("p", { class: "sub-title text-body-3" }, toDisplayString(trans("AI, cloud, and software evolve fast. We evolve faster.")), 1)
                          ])
                        ])
                      ]),
                      createVNode("span", { class: "hafl-plus pst-left_bot item_bot wow bounceInScale" }),
                      createVNode("span", { class: "hafl-plus pst-right_bot item_bot wow bounceInScale" })
                    ])
                  ])
                ]),
                createVNode("span", { class: "br-line" }),
                createVNode(_sfc_main$T),
                createVNode("span", { class: "br-line" })
              ]),
              createVNode("section", {
                class: "section-how-to",
                id: "howToUse"
              }, [
                createVNode(_sfc_main$S, {
                  number: "4",
                  label: trans("HOW TO")
                }, null, 8, ["label"]),
                createVNode("span", { class: "br-line" }),
                createVNode("div", { class: "sect-tagline" }, [
                  createVNode("div", { class: "container" }, [
                    createVNode("div", { class: "sect-tagline_inner" }, [
                      createVNode("span", { class: "hafl-plus pst-left_bot wow bounceInScale" }),
                      createVNode("span", { class: "hafl-plus pst-right_bot wow bounceInScale" }),
                      createVNode("p", { class: "s-name text-caption font-2" }, [
                        createVNode("span", { class: "bar-group type-left" }, [
                          createVNode("span", { class: "bar_center" })
                        ]),
                        createVNode("span", { class: "hacker-text_transform no-delay" }, toDisplayString(trans("How do we deliver reliable, future-ready IT solutions?")), 1),
                        createVNode("span", { class: "bar-group type-right" }, [
                          createVNode("span", { class: "bar_center" })
                        ])
                      ])
                    ])
                  ])
                ]),
                createVNode("span", { class: "br-line" }),
                createVNode("div", { class: "sect-main flat-animate-tab" }, [
                  createVNode("div", { class: "s-img_item wow bounceInScale" }, [
                    createVNode("img", {
                      class: "lazyload",
                      src: asset_path.value + "qore/images/section/gradient-ring-bg.webp",
                      "data-src": asset_path.value + "qore/images/section/gradient-ring-bg.webp",
                      alt: ""
                    }, null, 8, ["src", "data-src"])
                  ]),
                  createVNode("div", { class: "container" }, [
                    createVNode("div", { class: "sect-title wow fadeInUp" }, [
                      createVNode("h2", { class: "s-title font-3 m-0" }, toDisplayString(trans("How do we deliver reliable, future-ready IT solutions?")), 1)
                    ]),
                    createVNode("div", { class: "row" }, [
                      createVNode("div", { class: "col-md-6 offset-xl-1 col-xl-4" }, [
                        createVNode("div", { class: "tab-content mb-md-0 sticky-top wow fadeInUp" }, [
                          createVNode("div", {
                            class: "tab-pane active show",
                            id: "home-step1",
                            role: "tabpanel"
                          }, [
                            createVNode("div", { class: "image-how_to wow bounceInScale" }, [
                              createVNode("img", {
                                class: "lazyload",
                                src: asset_path.value + "qore/images/section/step-1.webp",
                                "data-src": asset_path.value + "qore/images/section/step-1.webp",
                                alt: trans("Discover")
                              }, null, 8, ["src", "data-src", "alt"]),
                              createVNode("span", { class: "hafl-plus start-0 top-0 rotate-top_left" }),
                              createVNode("span", { class: "hafl-plus end-0 top-0 rotate-top_right" }),
                              createVNode("span", { class: "hafl-plus start-0 bottom-0 item_bot rotate-bot_left" }),
                              createVNode("span", { class: "hafl-plus end-0 bottom-0 item_bot rotate-bot_right" })
                            ])
                          ]),
                          createVNode("div", {
                            class: "tab-pane",
                            id: "home-step2",
                            role: "tabpanel"
                          }, [
                            createVNode("div", { class: "image-how_to" }, [
                              createVNode("img", {
                                class: "lazyload",
                                src: asset_path.value + "qore/images/section/step-2.webp",
                                "data-src": asset_path.value + "qore/images/section/step-2.webp",
                                alt: trans("Build")
                              }, null, 8, ["src", "data-src", "alt"]),
                              createVNode("span", { class: "hafl-plus start-0 top-0 rotate-top_left" }),
                              createVNode("span", { class: "hafl-plus end-0 top-0 rotate-top_right" }),
                              createVNode("span", { class: "hafl-plus start-0 bottom-0 item_bot rotate-bot_left" }),
                              createVNode("span", { class: "hafl-plus end-0 bottom-0 item_bot rotate-bot_right" })
                            ])
                          ]),
                          createVNode("div", {
                            class: "tab-pane",
                            id: "home-step3",
                            role: "tabpanel"
                          }, [
                            createVNode("div", { class: "image-how_to" }, [
                              createVNode("img", {
                                class: "lazyload",
                                src: asset_path.value + "qore/images/section/step-3.webp",
                                "data-src": asset_path.value + "qore/images/section/step-3.webp",
                                alt: trans("Launch")
                              }, null, 8, ["src", "data-src", "alt"]),
                              createVNode("span", { class: "hafl-plus start-0 top-0 rotate-top_left" }),
                              createVNode("span", { class: "hafl-plus end-0 top-0 rotate-top_right" }),
                              createVNode("span", { class: "hafl-plus start-0 bottom-0 item_bot rotate-bot_left" }),
                              createVNode("span", { class: "hafl-plus end-0 bottom-0 item_bot rotate-bot_right" })
                            ])
                          ])
                        ])
                      ]),
                      createVNode("div", { class: "col-md-6 offset-xl-2 col-xl-4" }, [
                        createVNode("ul", {
                          class: "tab-how_to position-relative mx-1 wow fadeInUp",
                          role: "tablist"
                        }, [
                          createVNode("li", {
                            class: "nav-tab-item",
                            role: "presentation"
                          }, [
                            createVNode("div", {
                              "data-bs-toggle": "tab",
                              "data-bs-target": "#home-step1",
                              class: "btn_tab active",
                              role: "tab"
                            }, [
                              createVNode("p", { class: "number-step text-caption font-2" }, "STEP 01"),
                              createVNode("h5", { class: "name" }, toDisplayString(trans("Discover")), 1),
                              createVNode("p", { class: "desc" }, toDisplayString(trans("Transform complex technical ideas into intelligent systems")), 1)
                            ])
                          ]),
                          createVNode("li", { class: "br-line has-dot" }),
                          createVNode("li", {
                            class: "nav-tab-item",
                            role: "presentation"
                          }, [
                            createVNode("div", {
                              "data-bs-toggle": "tab",
                              "data-bs-target": "#home-step2",
                              class: "btn_tab",
                              role: "tab"
                            }, [
                              createVNode("p", { class: "number-step text-caption font-2" }, "STEP 02"),
                              createVNode("h5", { class: "name" }, toDisplayString(trans("Build")), 1),
                              createVNode("p", { class: "desc" }, toDisplayString(trans("Developing Secure & Scalable Systems")), 1)
                            ])
                          ]),
                          createVNode("li", { class: "br-line has-dot" }),
                          createVNode("li", {
                            class: "nav-tab-item",
                            role: "presentation"
                          }, [
                            createVNode("div", {
                              "data-bs-toggle": "tab",
                              "data-bs-target": "#home-step3",
                              class: "btn_tab",
                              role: "tab"
                            }, [
                              createVNode("p", { class: "number-step text-caption font-2" }, "STEP 03"),
                              createVNode("h5", { class: "name" }, toDisplayString(trans("Launch")), 1),
                              createVNode("p", { class: "desc" }, toDisplayString(trans("Help companies build practical technology solutions in Web, AI, automation, and cloud computing — designed for growth and sustainability")), 1)
                            ])
                          ])
                        ])
                      ])
                    ]),
                    createVNode("div", { class: "position-relative has-hafl_plus" }, [
                      createVNode("span", { class: "hafl-plus pst-left_bot item_bot wow bounceInScale" }),
                      createVNode("span", { class: "hafl-plus pst-right_bot item_bot wow bounceInScale" })
                    ])
                  ])
                ]),
                createVNode("span", { class: "br-line" }),
                createVNode(_sfc_main$T),
                createVNode("span", { class: "br-line" })
              ]),
              products.value.length ? (openBlock(), createBlock("section", {
                key: 1,
                class: "section-pricing",
                id: "pricing"
              }, [
                createVNode(_sfc_main$S, {
                  number: "5",
                  label: trans("PRODUCTS")
                }, null, 8, ["label"]),
                createVNode("span", { class: "br-line" }),
                createVNode("div", { class: "sect-main" }, [
                  createVNode("div", { class: "container" }, [
                    createVNode("div", { class: "sect-title wow fadeInUp" }, [
                      createVNode("h2", { class: "s-title font-3 m-0" }, toDisplayString(trans("B2B Solutions Built for Scale")), 1)
                    ]),
                    createVNode("div", { class: "grid-pricing" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(products.value, (product) => {
                        var _a;
                        return openBlock(), createBlock("div", {
                          key: product.id,
                          class: "wg-plan wow fadeInUp"
                        }, [
                          createVNode("div", { class: "content" }, [
                            createVNode("div", { class: "plan-header" }, [
                              product.main_image_link ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "image mb-3"
                              }, [
                                createVNode("img", {
                                  src: product.main_image_link,
                                  alt: product.name,
                                  loading: "lazy"
                                }, null, 8, ["src", "alt"])
                              ])) : createCommentVNode("", true),
                              createVNode("p", { class: "plan_type text-body-1" }, toDisplayString(((_a = product.category) == null ? void 0 : _a.name) || trans("Product")), 1),
                              createVNode("h3", {
                                class: "price-amount",
                                style: { "font-size": "1.75rem" }
                              }, toDisplayString(product.name), 1),
                              createVNode("p", { class: "plan-description" }, toDisplayString(product.short_description), 1),
                              createVNode(unref(Link), {
                                href: _ctx.route("product.show", product.slug),
                                class: "tf-btn style-3 style-high animate-btn w-100"
                              }, {
                                default: withCtx(() => [
                                  createVNode("span", { class: "text-body-3" }, toDisplayString(trans("View Details")), 1)
                                ]),
                                _: 1
                              }, 8, ["href"])
                            ])
                          ])
                        ]);
                      }), 128))
                    ]),
                    createVNode("div", { class: "text-center mt-4" }, [
                      createVNode(unref(Link), {
                        href: _ctx.route("product.index"),
                        class: "tf-btn animate-btn"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(trans("View All Products")), 1)
                        ]),
                        _: 1
                      }, 8, ["href"])
                    ])
                  ])
                ]),
                createVNode("span", { class: "br-line" }),
                createVNode(_sfc_main$T),
                createVNode("span", { class: "br-line" })
              ])) : createCommentVNode("", true),
              useCases.value.length ? (openBlock(), createBlock("section", {
                key: 2,
                class: "section-feature"
              }, [
                createVNode(_sfc_main$S, {
                  number: "6",
                  label: trans("CASE STUDIES")
                }, null, 8, ["label"]),
                createVNode("span", { class: "br-line" }),
                createVNode("div", { class: "sect-main" }, [
                  createVNode("div", { class: "container" }, [
                    createVNode("div", { class: "sect-title wow fadeInUp" }, [
                      createVNode("h2", { class: "s-title font-3" }, toDisplayString(trans("How We've Empowered Businesses with Innovative Tech Solutions")), 1)
                    ]),
                    createVNode("div", { class: "tf-grid-layout sm-col-2" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(useCases.value, (item) => {
                        return openBlock(), createBlock(_sfc_main$P, {
                          key: item.id,
                          item
                        }, null, 8, ["item"]);
                      }), 128))
                    ]),
                    createVNode("div", { class: "text-center mt-4" }, [
                      createVNode(unref(Link), {
                        href: _ctx.route("use-cases.index"),
                        class: "tf-btn animate-btn"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(trans("Case Studies")), 1)
                        ]),
                        _: 1
                      }, 8, ["href"])
                    ])
                  ])
                ]),
                createVNode("span", { class: "br-line" }),
                createVNode(_sfc_main$T),
                createVNode("span", { class: "br-line" })
              ])) : createCommentVNode("", true),
              testimonials.value.length ? (openBlock(), createBlock("section", {
                key: 3,
                class: "section-testimonial"
              }, [
                createVNode(_sfc_main$S, {
                  number: "7",
                  label: trans("TESTIMONIALS")
                }, null, 8, ["label"]),
                createVNode("span", { class: "br-line" }),
                createVNode("div", { class: "sect-main" }, [
                  createVNode("div", { class: "container" }, [
                    createVNode("div", { class: "sect-title wow fadeInUp" }, [
                      createVNode("h2", { class: "s-title font-3 m-0" }, toDisplayString(trans("What Our Clients Say")), 1)
                    ]),
                    createVNode("div", { class: "testimonial-slide-wrap" }, [
                      createVNode("div", { class: "overflow-hidden has-overlay_linear type-2 mx-1" }, [
                        createVNode("div", { class: "infiniteSlide infiniteSlide-tes" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(testimonials.value, (testimonial) => {
                            return openBlock(), createBlock("div", {
                              key: testimonial.id,
                              class: "wg-testimonial"
                            }, [
                              createVNode("div", { class: "tes-author" }, [
                                createVNode("div", { class: "author_image" }, [
                                  createVNode("img", {
                                    src: testimonial.avatar_link,
                                    alt: translateField(testimonial.name)
                                  }, null, 8, ["src", "alt"])
                                ]),
                                createVNode("div", { class: "author_info" }, [
                                  createVNode("span", { class: "link name" }, toDisplayString(translateField(testimonial.name)), 1),
                                  createVNode("p", { class: "text-body-3" }, toDisplayString(translateField(testimonial.position)), 1)
                                ])
                              ]),
                              createVNode("p", { class: "tes-text" }, toDisplayString(translateField(testimonial.quote)), 1)
                            ]);
                          }), 128))
                        ])
                      ])
                    ])
                  ])
                ]),
                createVNode("span", { class: "br-line" }),
                createVNode(_sfc_main$T),
                createVNode("span", { class: "br-line" })
              ])) : createCommentVNode("", true),
              posts.value.length ? (openBlock(), createBlock("section", {
                key: 4,
                class: "section-page-blog home-blogs"
              }, [
                createVNode(_sfc_main$S, {
                  number: "8",
                  label: trans("BLOG")
                }, null, 8, ["label"]),
                createVNode("span", { class: "br-line" }),
                createVNode("div", { class: "sect-main" }, [
                  createVNode("div", { class: "container" }, [
                    createVNode("div", { class: "sect-title wow fadeInUp" }, [
                      createVNode("h2", { class: "s-title font-3" }, toDisplayString(trans("Blogs")), 1)
                    ]),
                    createVNode("div", { class: "tf-grid-layout sm-col-2 md-col-3 home-blogs__grid" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(posts.value.slice(0, 3), (post) => {
                        return openBlock(), createBlock(_sfc_main$Q, {
                          key: post.id,
                          blog: post,
                          "show-description": true
                        }, null, 8, ["blog"]);
                      }), 128))
                    ]),
                    createVNode("div", { class: "text-center mt-4" }, [
                      createVNode(unref(Link), {
                        href: _ctx.route("blogs.index"),
                        class: "tf-btn animate-btn"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(trans("Blogs")), 1)
                        ]),
                        _: 1
                      }, 8, ["href"])
                    ])
                  ])
                ]),
                createVNode("span", { class: "br-line" }),
                createVNode(_sfc_main$T),
                createVNode("span", { class: "br-line" })
              ])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$O = _sfc_main$O.setup;
_sfc_main$O.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("Modules/Base/resources/assets/js/Pages/Index.vue");
  return _sfc_setup$O ? _sfc_setup$O(props, ctx) : void 0;
};
const __vite_glob_0_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$O
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$N = {
  __name: "PageTitle",
  __ssrInlineRender: true,
  props: {
    title: { type: String, required: true },
    crumbs: { type: Array, default: () => [] }
  },
  setup(__props) {
    const props = __props;
    const page = usePage();
    const trans = (key) => {
      var _a;
      return ((_a = page.props.translations) == null ? void 0 : _a[key]) || key;
    };
    const homeUrl = computed(() => {
      try {
        return route("home");
      } catch (e2) {
        return "/";
      }
    });
    const crumbs = computed(() => {
      if (props.crumbs.length) {
        return props.crumbs;
      }
      return [{ label: props.title }];
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "section-page-title" }, _attrs))}><div class="sect-tagline"><div class="container"><div class="sect-tagline_inner"><span class="hafl-plus pst-left_bot wow bounceInScale"></span><span class="hafl-plus pst-right_bot wow bounceInScale"></span><div class="s-name text-caption font-2"><span class="bar-group type-left"><span class="bar_center"></span></span><div class="breadcrumbs-list">`);
      _push(ssrRenderComponent(unref(Link), {
        href: homeUrl.value,
        class: "text-white link font-2"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(trans("Home"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(trans("Home")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--[-->`);
      ssrRenderList(crumbs.value, (crumb, index) => {
        _push(`<!--[--><span>/</span>`);
        if (crumb.href) {
          _push(ssrRenderComponent(unref(Link), {
            href: crumb.href,
            class: "text-white link font-2"
          }, {
            default: withCtx((_2, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(crumb.label)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(crumb.label), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        } else {
          _push(`<span class="hacker-text_transform no-delay current-page">${ssrInterpolate(crumb.label)}</span>`);
        }
        _push(`<!--]-->`);
      });
      _push(`<!--]--></div><span class="bar-group type-right"><span class="bar_center"></span></span></div></div></div></div><span class="br-line"></span></div>`);
    };
  }
};
const _sfc_setup$N = _sfc_main$N.setup;
_sfc_main$N.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/PageTitle.vue");
  return _sfc_setup$N ? _sfc_setup$N(props, ctx) : void 0;
};
const _sfc_main$M = {
  __name: "Index",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const trans = (key) => page.props.translations[key] || key;
    const seo = computed(() => page.props.seo || {});
    const settings = computed(() => page.props.settings || {});
    const meta = computed(() => page.props.meta || {});
    const siteName = computed(() => seo.value.website_name || page.props.appName || "Symfonix");
    const metaTitle = computed(() => {
      return meta.value.title || `${trans("Contact Us")} | ${siteName.value}`;
    });
    const metaDescription = computed(() => {
      return meta.value.description || trans("Contact our team for support, inquiries, or project discussions.") || seo.value.website_desc || "";
    });
    const metaKeywords = computed(() => {
      return meta.value.keywords || trans("contact, support, get in touch, customer service") || seo.value.website_keywords || "";
    });
    const metaImage = computed(() => {
      var _a, _b, _c, _d, _e;
      return ((_b = (_a = meta.value) == null ? void 0 : _a.og) == null ? void 0 : _b.image) || ((_d = (_c = meta.value) == null ? void 0 : _c.twitter) == null ? void 0 : _d.image) || ((_e = settings.value) == null ? void 0 : _e.meta_img) || "";
    });
    const metaCanonical = computed(() => meta.value.canonical || "");
    const metaRobots = computed(() => meta.value.robots || "index, follow");
    const submitSuccess = ref(false);
    const contactForm = useForm({
      name: "",
      email: "",
      mobile: "",
      subject: "",
      message: ""
    });
    const handleSubmit = () => {
      if (contactForm.processing) {
        return false;
      }
      if (!contactForm.name || !contactForm.name.trim()) {
        return false;
      }
      if (!contactForm.email || !contactForm.email.trim()) {
        return false;
      }
      if (!contactForm.mobile || !contactForm.mobile.trim()) {
        return false;
      }
      if (!contactForm.subject || !contactForm.subject.trim()) {
        return false;
      }
      if (!contactForm.message || !contactForm.message.trim()) {
        return false;
      }
      let contactUrl = route("contact-us.store");
      contactForm.post(contactUrl, {
        preserveScroll: true,
        preserveState: true,
        onBefore: () => {
          submitSuccess.value = false;
        },
        onSuccess: () => {
          submitSuccess.value = true;
          contactForm.reset();
          contactForm.clearErrors();
          setTimeout(() => {
            submitSuccess.value = false;
          }, 5e3);
        },
        onError: () => {
          submitSuccess.value = false;
        }
      });
      return false;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), null, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<title${_scopeId}>${ssrInterpolate(metaTitle.value)}</title><meta name="description"${ssrRenderAttr("content", metaDescription.value)}${_scopeId}><meta name="keywords"${ssrRenderAttr("content", metaKeywords.value)}${_scopeId}><meta name="robots"${ssrRenderAttr("content", metaRobots.value)}${_scopeId}>`);
            if (metaCanonical.value) {
              _push2(`<link rel="canonical"${ssrRenderAttr("href", metaCanonical.value)}${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<meta property="og:title"${ssrRenderAttr("content", metaTitle.value)}${_scopeId}><meta property="og:description"${ssrRenderAttr("content", metaDescription.value)}${_scopeId}>`);
            if (metaImage.value) {
              _push2(`<meta property="og:image"${ssrRenderAttr("content", metaImage.value)}${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            if (metaCanonical.value) {
              _push2(`<meta property="og:url"${ssrRenderAttr("content", metaCanonical.value)}${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<meta property="og:type" content="website"${_scopeId}><meta name="twitter:card" content="summary_large_image"${_scopeId}><meta name="twitter:title"${ssrRenderAttr("content", metaTitle.value)}${_scopeId}><meta name="twitter:description"${ssrRenderAttr("content", metaDescription.value)}${_scopeId}>`);
            if (metaImage.value) {
              _push2(`<meta name="twitter:image"${ssrRenderAttr("content", metaImage.value)}${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("title", null, toDisplayString(metaTitle.value), 1),
              createVNode("meta", {
                name: "description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "keywords",
                content: metaKeywords.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "robots",
                content: metaRobots.value
              }, null, 8, ["content"]),
              metaCanonical.value ? (openBlock(), createBlock("link", {
                key: 0,
                rel: "canonical",
                href: metaCanonical.value
              }, null, 8, ["href"])) : createCommentVNode("", true),
              createVNode("meta", {
                property: "og:title",
                content: metaTitle.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              metaImage.value ? (openBlock(), createBlock("meta", {
                key: 1,
                property: "og:image",
                content: metaImage.value
              }, null, 8, ["content"])) : createCommentVNode("", true),
              metaCanonical.value ? (openBlock(), createBlock("meta", {
                key: 2,
                property: "og:url",
                content: metaCanonical.value
              }, null, 8, ["content"])) : createCommentVNode("", true),
              createVNode("meta", {
                property: "og:type",
                content: "website"
              }),
              createVNode("meta", {
                name: "twitter:card",
                content: "summary_large_image"
              }),
              createVNode("meta", {
                name: "twitter:title",
                content: metaTitle.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "twitter:description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              metaImage.value ? (openBlock(), createBlock("meta", {
                key: 3,
                name: "twitter:image",
                content: metaImage.value
              }, null, 8, ["content"])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$R, null, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$N, {
              title: trans("Contact Us")
            }, null, _parent2, _scopeId));
            _push2(`<section class="section-get-in flat-spacing-3"${_scopeId}><div class="container"${_scopeId}><div class="row"${_scopeId}><div class="col-lg-10 mx-auto"${_scopeId}><h2 class="s-title only-title font-3 text-linear px-16 px-xl-0"${_scopeId}>${ssrInterpolate(trans("Get In Touch"))}</h2></div></div><div class="row"${_scopeId}><div class="col-lg-3 offset-lg-1"${_scopeId}><ul class="info-us-list px-16 px-lg-0 mb-lg-0"${_scopeId}>`);
            if (settings.value.address) {
              _push2(`<li${_scopeId}><p class="title-sub text-body-3"${_scopeId}>${ssrInterpolate(trans("Our Location"))}</p><span class="text-body-3 text-white"${_scopeId}>${ssrInterpolate(settings.value.address)}</span></li>`);
            } else {
              _push2(`<!---->`);
            }
            if (settings.value.address) {
              _push2(`<li class="br-line has-dot"${_scopeId}></li>`);
            } else {
              _push2(`<!---->`);
            }
            if (settings.value.email) {
              _push2(`<li${_scopeId}><p class="title-sub text-body-3"${_scopeId}>${ssrInterpolate(trans("Email"))}</p><a${ssrRenderAttr("href", `mailto:${settings.value.email}`)} class="h5 fw-medium link text-white font-3" dir="ltr"${_scopeId}>${ssrInterpolate(settings.value.email)}</a></li>`);
            } else {
              _push2(`<!---->`);
            }
            if (settings.value.email && settings.value.phone) {
              _push2(`<li class="br-line has-dot"${_scopeId}></li>`);
            } else {
              _push2(`<!---->`);
            }
            if (settings.value.phone) {
              _push2(`<li${_scopeId}><p class="title-sub text-body-3"${_scopeId}>${ssrInterpolate(trans("Phone"))}</p><a${ssrRenderAttr("href", `tel:${settings.value.phone}`)} class="h5 fw-medium link text-white font-3" dir="ltr"${_scopeId}>${ssrInterpolate(settings.value.phone)}</a></li>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</ul></div><div class="col-lg-7"${_scopeId}><form class="form-get_in px-16 px-xl-0"${_scopeId}><div class="form-content-2"${_scopeId}><div class="tf-grid-layout sm-col-2"${_scopeId}><fieldset${_scopeId}><label class="label-text text-body-3 text-white" for="contact-name"${_scopeId}>${ssrInterpolate(trans("Full Name"))}</label><input id="contact-name"${ssrRenderAttr("value", unref(contactForm).name)} type="text" name="name"${ssrRenderAttr("placeholder", trans("Full Name"))} class="${ssrRenderClass({ error: unref(contactForm).errors.name })}"${ssrIncludeBooleanAttr(unref(contactForm).processing) ? " disabled" : ""} required${_scopeId}>`);
            if (unref(contactForm).errors.name) {
              _push2(`<div class="text-danger mt-1 small"${_scopeId}>${ssrInterpolate(unref(contactForm).errors.name)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</fieldset><fieldset${_scopeId}><label class="label-text text-body-3 text-white" for="contact-email"${_scopeId}>${ssrInterpolate(trans("Email"))}</label><input id="contact-email"${ssrRenderAttr("value", unref(contactForm).email)} type="email" name="email"${ssrRenderAttr("placeholder", trans("Email"))} class="${ssrRenderClass({ error: unref(contactForm).errors.email })}"${ssrIncludeBooleanAttr(unref(contactForm).processing) ? " disabled" : ""} required${_scopeId}>`);
            if (unref(contactForm).errors.email) {
              _push2(`<div class="text-danger mt-1 small"${_scopeId}>${ssrInterpolate(unref(contactForm).errors.email)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</fieldset></div><div class="tf-grid-layout sm-col-2"${_scopeId}><fieldset${_scopeId}><label class="label-text text-body-3 text-white" for="contact-mobile"${_scopeId}>${ssrInterpolate(trans("Phone Number"))}</label><input id="contact-mobile"${ssrRenderAttr("value", unref(contactForm).mobile)} type="text" name="mobile"${ssrRenderAttr("placeholder", trans("Phone Number"))} class="${ssrRenderClass({ error: unref(contactForm).errors.mobile })}"${ssrIncludeBooleanAttr(unref(contactForm).processing) ? " disabled" : ""} required${_scopeId}>`);
            if (unref(contactForm).errors.mobile) {
              _push2(`<div class="text-danger mt-1 small"${_scopeId}>${ssrInterpolate(unref(contactForm).errors.mobile)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</fieldset><fieldset${_scopeId}><label class="label-text text-body-3 text-white" for="contact-subject"${_scopeId}>${ssrInterpolate(trans("Subject"))}</label><input id="contact-subject"${ssrRenderAttr("value", unref(contactForm).subject)} type="text" name="subject"${ssrRenderAttr("placeholder", trans("Subject"))} class="${ssrRenderClass({ error: unref(contactForm).errors.subject })}"${ssrIncludeBooleanAttr(unref(contactForm).processing) ? " disabled" : ""} required${_scopeId}>`);
            if (unref(contactForm).errors.subject) {
              _push2(`<div class="text-danger mt-1 small"${_scopeId}>${ssrInterpolate(unref(contactForm).errors.subject)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</fieldset></div><fieldset class="d-grid"${_scopeId}><label class="label-text text-body-3 text-white" for="contact-message"${_scopeId}>${ssrInterpolate(trans("Message"))}</label><textarea id="contact-message" name="message"${ssrRenderAttr("placeholder", trans("Write your message"))} class="${ssrRenderClass({ error: unref(contactForm).errors.message })}"${ssrIncludeBooleanAttr(unref(contactForm).processing) ? " disabled" : ""} required${_scopeId}>${ssrInterpolate(unref(contactForm).message)}</textarea>`);
            if (unref(contactForm).errors.message) {
              _push2(`<div class="text-danger mt-1 small"${_scopeId}>${ssrInterpolate(unref(contactForm).errors.message)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</fieldset></div><button type="submit" class="tf-btn text-body-3 style-2 animate-btn animate-dark style-high"${ssrIncludeBooleanAttr(unref(contactForm).processing) ? " disabled" : ""}${_scopeId}>${ssrInterpolate(unref(contactForm).processing ? trans("Sending...") : trans("Submit"))}</button>`);
            if (submitSuccess.value) {
              _push2(`<div class="alert alert-success mt-3"${_scopeId}>${ssrInterpolate(trans("Thank you for contacting us! We will get back to you soon."))}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</form></div></div></div></section>`);
          } else {
            return [
              createVNode(_sfc_main$N, {
                title: trans("Contact Us")
              }, null, 8, ["title"]),
              createVNode("section", { class: "section-get-in flat-spacing-3" }, [
                createVNode("div", { class: "container" }, [
                  createVNode("div", { class: "row" }, [
                    createVNode("div", { class: "col-lg-10 mx-auto" }, [
                      createVNode("h2", { class: "s-title only-title font-3 text-linear px-16 px-xl-0" }, toDisplayString(trans("Get In Touch")), 1)
                    ])
                  ]),
                  createVNode("div", { class: "row" }, [
                    createVNode("div", { class: "col-lg-3 offset-lg-1" }, [
                      createVNode("ul", { class: "info-us-list px-16 px-lg-0 mb-lg-0" }, [
                        settings.value.address ? (openBlock(), createBlock("li", { key: 0 }, [
                          createVNode("p", { class: "title-sub text-body-3" }, toDisplayString(trans("Our Location")), 1),
                          createVNode("span", { class: "text-body-3 text-white" }, toDisplayString(settings.value.address), 1)
                        ])) : createCommentVNode("", true),
                        settings.value.address ? (openBlock(), createBlock("li", {
                          key: 1,
                          class: "br-line has-dot"
                        })) : createCommentVNode("", true),
                        settings.value.email ? (openBlock(), createBlock("li", { key: 2 }, [
                          createVNode("p", { class: "title-sub text-body-3" }, toDisplayString(trans("Email")), 1),
                          createVNode("a", {
                            href: `mailto:${settings.value.email}`,
                            class: "h5 fw-medium link text-white font-3",
                            dir: "ltr"
                          }, toDisplayString(settings.value.email), 9, ["href"])
                        ])) : createCommentVNode("", true),
                        settings.value.email && settings.value.phone ? (openBlock(), createBlock("li", {
                          key: 3,
                          class: "br-line has-dot"
                        })) : createCommentVNode("", true),
                        settings.value.phone ? (openBlock(), createBlock("li", { key: 4 }, [
                          createVNode("p", { class: "title-sub text-body-3" }, toDisplayString(trans("Phone")), 1),
                          createVNode("a", {
                            href: `tel:${settings.value.phone}`,
                            class: "h5 fw-medium link text-white font-3",
                            dir: "ltr"
                          }, toDisplayString(settings.value.phone), 9, ["href"])
                        ])) : createCommentVNode("", true)
                      ])
                    ]),
                    createVNode("div", { class: "col-lg-7" }, [
                      createVNode("form", {
                        onSubmit: withModifiers(handleSubmit, ["prevent"]),
                        class: "form-get_in px-16 px-xl-0"
                      }, [
                        createVNode("div", { class: "form-content-2" }, [
                          createVNode("div", { class: "tf-grid-layout sm-col-2" }, [
                            createVNode("fieldset", null, [
                              createVNode("label", {
                                class: "label-text text-body-3 text-white",
                                for: "contact-name"
                              }, toDisplayString(trans("Full Name")), 1),
                              withDirectives(createVNode("input", {
                                id: "contact-name",
                                "onUpdate:modelValue": ($event) => unref(contactForm).name = $event,
                                type: "text",
                                name: "name",
                                placeholder: trans("Full Name"),
                                class: { error: unref(contactForm).errors.name },
                                disabled: unref(contactForm).processing,
                                required: ""
                              }, null, 10, ["onUpdate:modelValue", "placeholder", "disabled"]), [
                                [vModelText, unref(contactForm).name]
                              ]),
                              unref(contactForm).errors.name ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "text-danger mt-1 small"
                              }, toDisplayString(unref(contactForm).errors.name), 1)) : createCommentVNode("", true)
                            ]),
                            createVNode("fieldset", null, [
                              createVNode("label", {
                                class: "label-text text-body-3 text-white",
                                for: "contact-email"
                              }, toDisplayString(trans("Email")), 1),
                              withDirectives(createVNode("input", {
                                id: "contact-email",
                                "onUpdate:modelValue": ($event) => unref(contactForm).email = $event,
                                type: "email",
                                name: "email",
                                placeholder: trans("Email"),
                                class: { error: unref(contactForm).errors.email },
                                disabled: unref(contactForm).processing,
                                required: ""
                              }, null, 10, ["onUpdate:modelValue", "placeholder", "disabled"]), [
                                [vModelText, unref(contactForm).email]
                              ]),
                              unref(contactForm).errors.email ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "text-danger mt-1 small"
                              }, toDisplayString(unref(contactForm).errors.email), 1)) : createCommentVNode("", true)
                            ])
                          ]),
                          createVNode("div", { class: "tf-grid-layout sm-col-2" }, [
                            createVNode("fieldset", null, [
                              createVNode("label", {
                                class: "label-text text-body-3 text-white",
                                for: "contact-mobile"
                              }, toDisplayString(trans("Phone Number")), 1),
                              withDirectives(createVNode("input", {
                                id: "contact-mobile",
                                "onUpdate:modelValue": ($event) => unref(contactForm).mobile = $event,
                                type: "text",
                                name: "mobile",
                                placeholder: trans("Phone Number"),
                                class: { error: unref(contactForm).errors.mobile },
                                disabled: unref(contactForm).processing,
                                required: ""
                              }, null, 10, ["onUpdate:modelValue", "placeholder", "disabled"]), [
                                [vModelText, unref(contactForm).mobile]
                              ]),
                              unref(contactForm).errors.mobile ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "text-danger mt-1 small"
                              }, toDisplayString(unref(contactForm).errors.mobile), 1)) : createCommentVNode("", true)
                            ]),
                            createVNode("fieldset", null, [
                              createVNode("label", {
                                class: "label-text text-body-3 text-white",
                                for: "contact-subject"
                              }, toDisplayString(trans("Subject")), 1),
                              withDirectives(createVNode("input", {
                                id: "contact-subject",
                                "onUpdate:modelValue": ($event) => unref(contactForm).subject = $event,
                                type: "text",
                                name: "subject",
                                placeholder: trans("Subject"),
                                class: { error: unref(contactForm).errors.subject },
                                disabled: unref(contactForm).processing,
                                required: ""
                              }, null, 10, ["onUpdate:modelValue", "placeholder", "disabled"]), [
                                [vModelText, unref(contactForm).subject]
                              ]),
                              unref(contactForm).errors.subject ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "text-danger mt-1 small"
                              }, toDisplayString(unref(contactForm).errors.subject), 1)) : createCommentVNode("", true)
                            ])
                          ]),
                          createVNode("fieldset", { class: "d-grid" }, [
                            createVNode("label", {
                              class: "label-text text-body-3 text-white",
                              for: "contact-message"
                            }, toDisplayString(trans("Message")), 1),
                            withDirectives(createVNode("textarea", {
                              id: "contact-message",
                              "onUpdate:modelValue": ($event) => unref(contactForm).message = $event,
                              name: "message",
                              placeholder: trans("Write your message"),
                              class: { error: unref(contactForm).errors.message },
                              disabled: unref(contactForm).processing,
                              required: ""
                            }, null, 10, ["onUpdate:modelValue", "placeholder", "disabled"]), [
                              [vModelText, unref(contactForm).message]
                            ]),
                            unref(contactForm).errors.message ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "text-danger mt-1 small"
                            }, toDisplayString(unref(contactForm).errors.message), 1)) : createCommentVNode("", true)
                          ])
                        ]),
                        createVNode("button", {
                          type: "submit",
                          class: "tf-btn text-body-3 style-2 animate-btn animate-dark style-high",
                          disabled: unref(contactForm).processing
                        }, toDisplayString(unref(contactForm).processing ? trans("Sending...") : trans("Submit")), 9, ["disabled"]),
                        submitSuccess.value ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "alert alert-success mt-3"
                        }, toDisplayString(trans("Thank you for contacting us! We will get back to you soon.")), 1)) : createCommentVNode("", true)
                      ], 32)
                    ])
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$M = _sfc_main$M.setup;
_sfc_main$M.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("Modules/CRM/resources/assets/js/Pages/Index.vue");
  return _sfc_setup$M ? _sfc_setup$M(props, ctx) : void 0;
};
const __vite_glob_0_1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$M
}, Symbol.toStringTag, { value: "Module" }));
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$L = {
  __name: "QuoteShow",
  __ssrInlineRender: true,
  props: {
    quote: { type: Object, required: true },
    branding: { type: Object, required: true },
    urls: { type: Object, required: true },
    labels: { type: Object, required: true },
    viewer: { type: Object, default: () => ({}) },
    meta: { type: Object, default: () => ({}) }
  },
  setup(__props) {
    var _a, _b, _c, _d;
    const props = __props;
    const page = usePage();
    computed(() => page.props.locale || "en");
    computed(() => page.props.asset_path || "/");
    const flashSuccess = computed(() => {
      var _a2;
      return ((_a2 = page.props.flash) == null ? void 0 : _a2.success) || null;
    });
    const metaTitle = computed(() => {
      var _a2;
      return ((_a2 = props.meta) == null ? void 0 : _a2.title) || props.labels.title;
    });
    const metaDescription = computed(() => {
      var _a2;
      return ((_a2 = props.meta) == null ? void 0 : _a2.description) || props.labels.subtitle;
    });
    const statusBanner = computed(() => {
      if (props.quote.status === "expired") return props.labels.expired;
      if (props.quote.status === "accepted") return props.labels.accepted;
      if (props.quote.status === "rejected") return props.labels.rejected;
      if (props.quote.status === "void") return props.labels.void;
      return null;
    });
    const statusBannerClass = computed(() => {
      if (props.quote.status === "accepted") return "alert-success";
      if (props.quote.status === "rejected" || props.quote.status === "void" || props.quote.status === "expired") {
        return "alert-warning";
      }
      return "alert-info";
    });
    const acceptForm = useForm({
      responder_name: ((_a = props.viewer) == null ? void 0 : _a.name) || "",
      responder_email: ((_b = props.viewer) == null ? void 0 : _b.email) || "",
      response_note: ""
    });
    const rejectForm = useForm({
      responder_name: ((_c = props.viewer) == null ? void 0 : _c.name) || "",
      responder_email: ((_d = props.viewer) == null ? void 0 : _d.email) || "",
      response_note: ""
    });
    function formatMoney(value) {
      return Number(value || 0).toLocaleString(void 0, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
    function submitAccept() {
      acceptForm.post(props.urls.accept, { preserveScroll: true });
    }
    function submitReject() {
      rejectForm.post(props.urls.reject, { preserveScroll: true });
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), null, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<title data-v-44ef5b4e${_scopeId}>${ssrInterpolate(metaTitle.value)}</title><meta name="description"${ssrRenderAttr("content", metaDescription.value)} data-v-44ef5b4e${_scopeId}><meta name="robots" content="noindex,nofollow" data-v-44ef5b4e${_scopeId}><meta property="og:title"${ssrRenderAttr("content", metaTitle.value)} data-v-44ef5b4e${_scopeId}><meta property="og:description"${ssrRenderAttr("content", metaDescription.value)} data-v-44ef5b4e${_scopeId}>`);
          } else {
            return [
              createVNode("title", null, toDisplayString(metaTitle.value), 1),
              createVNode("meta", {
                name: "description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "robots",
                content: "noindex,nofollow"
              }),
              createVNode("meta", {
                property: "og:title",
                content: metaTitle.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:description",
                content: metaDescription.value
              }, null, 8, ["content"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$R, null, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          var _a2, _b2, _c2, _d2, _e, _f;
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$N, {
              title: __props.labels.title
            }, null, _parent2, _scopeId));
            _push2(`<section class="quote-show" data-v-44ef5b4e${_scopeId}><div class="container" data-v-44ef5b4e${_scopeId}><div class="row justify-content-center" data-v-44ef5b4e${_scopeId}><div class="col-xl-10" data-v-44ef5b4e${_scopeId}><div class="quote-show__card" data-v-44ef5b4e${_scopeId}><div class="quote-show__header" data-v-44ef5b4e${_scopeId}><div data-v-44ef5b4e${_scopeId}>`);
            if (__props.branding.logo_url) {
              _push2(`<img${ssrRenderAttr("src", __props.branding.logo_url)}${ssrRenderAttr("alt", __props.branding.name)} class="quote-show__logo mb-3" data-v-44ef5b4e${_scopeId}>`);
            } else {
              _push2(`<h3 class="quote-show__brand mb-2" data-v-44ef5b4e${_scopeId}>${ssrInterpolate(__props.branding.name)}</h3>`);
            }
            _push2(`<div class="quote-show__muted" data-v-44ef5b4e${_scopeId}>`);
            if (__props.branding.phone) {
              _push2(`<div data-v-44ef5b4e${_scopeId}>${ssrInterpolate(__props.branding.phone)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.branding.email) {
              _push2(`<div data-v-44ef5b4e${_scopeId}>${ssrInterpolate(__props.branding.email)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.branding.address) {
              _push2(`<div data-v-44ef5b4e${_scopeId}>${ssrInterpolate(__props.branding.address)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><div class="quote-show__meta text-md-end" data-v-44ef5b4e${_scopeId}><div class="quote-show__number" data-v-44ef5b4e${_scopeId}>${ssrInterpolate(__props.quote.quote_number)}</div><span class="quote-show__badge" data-v-44ef5b4e${_scopeId}>${ssrInterpolate(__props.labels.status)}</span><div class="quote-show__total" data-v-44ef5b4e${_scopeId}>${ssrInterpolate(formatMoney(__props.quote.total))} ${ssrInterpolate(__props.quote.currency)}</div><a${ssrRenderAttr("href", __props.urls.pdf)} class="thm-btn quote-show__pdf-btn" data-v-44ef5b4e${_scopeId}>${ssrInterpolate(__props.labels.download_pdf)}</a></div></div><div class="row mb-4" data-v-44ef5b4e${_scopeId}><div class="col-md-6" data-v-44ef5b4e${_scopeId}><div class="quote-show__label" data-v-44ef5b4e${_scopeId}>${ssrInterpolate(__props.labels.quote_to)}</div><div class="quote-show__value" data-v-44ef5b4e${_scopeId}>${ssrInterpolate((_a2 = __props.quote.company) == null ? void 0 : _a2.name)}</div>`);
            if ((_b2 = __props.quote.company) == null ? void 0 : _b2.email) {
              _push2(`<div class="quote-show__muted" data-v-44ef5b4e${_scopeId}>${ssrInterpolate(__props.quote.company.email)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            if ((_c2 = __props.quote.deal) == null ? void 0 : _c2.title) {
              _push2(`<div class="quote-show__muted" data-v-44ef5b4e${_scopeId}>${ssrInterpolate(__props.quote.deal.title)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="col-md-6 text-md-end" data-v-44ef5b4e${_scopeId}><div data-v-44ef5b4e${_scopeId}><span class="quote-show__muted" data-v-44ef5b4e${_scopeId}>${ssrInterpolate(__props.labels.issued_at)}:</span><span class="quote-show__value" data-v-44ef5b4e${_scopeId}>${ssrInterpolate(__props.quote.issued_at)}</span></div>`);
            if (__props.quote.expires_at) {
              _push2(`<div data-v-44ef5b4e${_scopeId}><span class="quote-show__muted" data-v-44ef5b4e${_scopeId}>${ssrInterpolate(__props.labels.expires_at)}:</span><span class="quote-show__value" data-v-44ef5b4e${_scopeId}>${ssrInterpolate(__props.quote.expires_at)}</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
            if (flashSuccess.value) {
              _push2(`<div class="alert alert-success" role="alert" data-v-44ef5b4e${_scopeId}>${ssrInterpolate(flashSuccess.value)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (statusBanner.value) {
              _push2(`<div class="${ssrRenderClass([statusBannerClass.value, "alert"])}" role="alert" data-v-44ef5b4e${_scopeId}>${ssrInterpolate(statusBanner.value)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="table-responsive mb-4" data-v-44ef5b4e${_scopeId}><table class="quote-show__table" data-v-44ef5b4e${_scopeId}><thead data-v-44ef5b4e${_scopeId}><tr data-v-44ef5b4e${_scopeId}><th data-v-44ef5b4e${_scopeId}>${ssrInterpolate(__props.labels.description)}</th><th class="text-end" data-v-44ef5b4e${_scopeId}>${ssrInterpolate(__props.labels.quantity)}</th><th class="text-end" data-v-44ef5b4e${_scopeId}>${ssrInterpolate(__props.labels.unit_price)}</th><th class="text-end" data-v-44ef5b4e${_scopeId}>${ssrInterpolate(__props.labels.discount)}</th><th class="text-end" data-v-44ef5b4e${_scopeId}>${ssrInterpolate(__props.labels.tax)}</th><th class="text-end" data-v-44ef5b4e${_scopeId}>${ssrInterpolate(__props.labels.amount)}</th></tr></thead><tbody data-v-44ef5b4e${_scopeId}><!--[-->`);
            ssrRenderList(__props.quote.lines, (line, index) => {
              _push2(`<tr data-v-44ef5b4e${_scopeId}><td data-v-44ef5b4e${_scopeId}>${ssrInterpolate(line.description)}</td><td class="text-end" data-v-44ef5b4e${_scopeId}>${ssrInterpolate(line.quantity)}</td><td class="text-end" data-v-44ef5b4e${_scopeId}>${ssrInterpolate(formatMoney(line.unit_price))}</td><td class="text-end" data-v-44ef5b4e${_scopeId}>${ssrInterpolate(formatMoney(line.discount_amount))}</td><td class="text-end" data-v-44ef5b4e${_scopeId}>${ssrInterpolate(formatMoney(line.tax_amount))}</td><td class="text-end" data-v-44ef5b4e${_scopeId}>${ssrInterpolate(formatMoney(line.amount))}</td></tr>`);
            });
            _push2(`<!--]--></tbody><tfoot data-v-44ef5b4e${_scopeId}><tr data-v-44ef5b4e${_scopeId}><td colspan="5" class="text-end" data-v-44ef5b4e${_scopeId}>${ssrInterpolate(__props.labels.subtotal)}</td><td class="text-end" data-v-44ef5b4e${_scopeId}>${ssrInterpolate(formatMoney(__props.quote.subtotal))} ${ssrInterpolate(__props.quote.currency)}</td></tr><tr data-v-44ef5b4e${_scopeId}><td colspan="5" class="text-end" data-v-44ef5b4e${_scopeId}>${ssrInterpolate(__props.labels.discount)}</td><td class="text-end" data-v-44ef5b4e${_scopeId}>${ssrInterpolate(formatMoney(__props.quote.discount_amount))}</td></tr><tr data-v-44ef5b4e${_scopeId}><td colspan="5" class="text-end" data-v-44ef5b4e${_scopeId}>${ssrInterpolate(__props.labels.tax)}</td><td class="text-end" data-v-44ef5b4e${_scopeId}>${ssrInterpolate(formatMoney(__props.quote.tax_amount))}</td></tr><tr class="quote-show__grand" data-v-44ef5b4e${_scopeId}><td colspan="5" class="text-end" data-v-44ef5b4e${_scopeId}>${ssrInterpolate(__props.labels.total)}</td><td class="text-end" data-v-44ef5b4e${_scopeId}>${ssrInterpolate(formatMoney(__props.quote.total))} ${ssrInterpolate(__props.quote.currency)}</td></tr></tfoot></table></div>`);
            if (__props.quote.terms) {
              _push2(`<div class="mb-4" data-v-44ef5b4e${_scopeId}><h5 class="quote-show__section-title" data-v-44ef5b4e${_scopeId}>${ssrInterpolate(__props.labels.terms)}</h5><p class="quote-show__muted" style="${ssrRenderStyle({ "white-space": "pre-wrap" })}" data-v-44ef5b4e${_scopeId}>${ssrInterpolate(__props.quote.terms)}</p></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.branding.sign_url) {
              _push2(`<div class="text-center mb-5" data-v-44ef5b4e${_scopeId}><div class="quote-show__label mb-2" data-v-44ef5b4e${_scopeId}>${ssrInterpolate(__props.labels.company_sign)}</div><img${ssrRenderAttr("src", __props.branding.sign_url)}${ssrRenderAttr("alt", __props.branding.name)} class="quote-show__sign" data-v-44ef5b4e${_scopeId}></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.quote.can_respond) {
              _push2(`<div class="row g-4" data-v-44ef5b4e${_scopeId}><div class="col-md-6" data-v-44ef5b4e${_scopeId}><div class="quote-show__panel h-100" data-v-44ef5b4e${_scopeId}><h4 class="quote-show__section-title" data-v-44ef5b4e${_scopeId}>${ssrInterpolate(__props.labels.accept_title)}</h4><form data-v-44ef5b4e${_scopeId}><div class="mb-3" data-v-44ef5b4e${_scopeId}><label class="quote-show__label form-label" data-v-44ef5b4e${_scopeId}>${ssrInterpolate(__props.labels.your_name)}</label><input${ssrRenderAttr("value", unref(acceptForm).responder_name)} type="text" class="quote-show__input" required data-v-44ef5b4e${_scopeId}>`);
              if (unref(acceptForm).errors.responder_name) {
                _push2(`<div class="text-danger small mt-1" data-v-44ef5b4e${_scopeId}>${ssrInterpolate(unref(acceptForm).errors.responder_name)}</div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div class="mb-3" data-v-44ef5b4e${_scopeId}><label class="quote-show__label form-label" data-v-44ef5b4e${_scopeId}>${ssrInterpolate(__props.labels.your_email)}</label><input${ssrRenderAttr("value", unref(acceptForm).responder_email)} type="email" class="quote-show__input" data-v-44ef5b4e${_scopeId}></div><div class="mb-3" data-v-44ef5b4e${_scopeId}><label class="quote-show__label form-label" data-v-44ef5b4e${_scopeId}>${ssrInterpolate(__props.labels.optional_note)}</label><textarea rows="3" class="quote-show__input" data-v-44ef5b4e${_scopeId}>${ssrInterpolate(unref(acceptForm).response_note)}</textarea></div><button type="submit" class="thm-btn"${ssrIncludeBooleanAttr(unref(acceptForm).processing) ? " disabled" : ""} data-v-44ef5b4e${_scopeId}>${ssrInterpolate(__props.labels.confirm_accept)}</button></form></div></div><div class="col-md-6" data-v-44ef5b4e${_scopeId}><div class="quote-show__panel h-100" data-v-44ef5b4e${_scopeId}><h4 class="quote-show__section-title" data-v-44ef5b4e${_scopeId}>${ssrInterpolate(__props.labels.reject_title)}</h4><form data-v-44ef5b4e${_scopeId}><div class="mb-3" data-v-44ef5b4e${_scopeId}><label class="quote-show__label form-label" data-v-44ef5b4e${_scopeId}>${ssrInterpolate(__props.labels.your_name)}</label><input${ssrRenderAttr("value", unref(rejectForm).responder_name)} type="text" class="quote-show__input" required data-v-44ef5b4e${_scopeId}>`);
              if (unref(rejectForm).errors.responder_name) {
                _push2(`<div class="text-danger small mt-1" data-v-44ef5b4e${_scopeId}>${ssrInterpolate(unref(rejectForm).errors.responder_name)}</div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div class="mb-3" data-v-44ef5b4e${_scopeId}><label class="quote-show__label form-label" data-v-44ef5b4e${_scopeId}>${ssrInterpolate(__props.labels.your_email)}</label><input${ssrRenderAttr("value", unref(rejectForm).responder_email)} type="email" class="quote-show__input" data-v-44ef5b4e${_scopeId}></div><div class="mb-3" data-v-44ef5b4e${_scopeId}><label class="quote-show__label form-label" data-v-44ef5b4e${_scopeId}>${ssrInterpolate(__props.labels.optional_note)}</label><textarea rows="3" class="quote-show__input" data-v-44ef5b4e${_scopeId}>${ssrInterpolate(unref(rejectForm).response_note)}</textarea></div><button type="submit" class="btn btn-outline-danger"${ssrIncludeBooleanAttr(unref(rejectForm).processing) ? " disabled" : ""} data-v-44ef5b4e${_scopeId}>${ssrInterpolate(__props.labels.confirm_reject)}</button></form></div></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div></div></div></section>`);
          } else {
            return [
              createVNode(_sfc_main$N, {
                title: __props.labels.title
              }, null, 8, ["title"]),
              createVNode("section", { class: "quote-show" }, [
                createVNode("div", { class: "container" }, [
                  createVNode("div", { class: "row justify-content-center" }, [
                    createVNode("div", { class: "col-xl-10" }, [
                      createVNode("div", { class: "quote-show__card" }, [
                        createVNode("div", { class: "quote-show__header" }, [
                          createVNode("div", null, [
                            __props.branding.logo_url ? (openBlock(), createBlock("img", {
                              key: 0,
                              src: __props.branding.logo_url,
                              alt: __props.branding.name,
                              class: "quote-show__logo mb-3"
                            }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("h3", {
                              key: 1,
                              class: "quote-show__brand mb-2"
                            }, toDisplayString(__props.branding.name), 1)),
                            createVNode("div", { class: "quote-show__muted" }, [
                              __props.branding.phone ? (openBlock(), createBlock("div", { key: 0 }, toDisplayString(__props.branding.phone), 1)) : createCommentVNode("", true),
                              __props.branding.email ? (openBlock(), createBlock("div", { key: 1 }, toDisplayString(__props.branding.email), 1)) : createCommentVNode("", true),
                              __props.branding.address ? (openBlock(), createBlock("div", { key: 2 }, toDisplayString(__props.branding.address), 1)) : createCommentVNode("", true)
                            ])
                          ]),
                          createVNode("div", { class: "quote-show__meta text-md-end" }, [
                            createVNode("div", { class: "quote-show__number" }, toDisplayString(__props.quote.quote_number), 1),
                            createVNode("span", { class: "quote-show__badge" }, toDisplayString(__props.labels.status), 1),
                            createVNode("div", { class: "quote-show__total" }, toDisplayString(formatMoney(__props.quote.total)) + " " + toDisplayString(__props.quote.currency), 1),
                            createVNode("a", {
                              href: __props.urls.pdf,
                              class: "thm-btn quote-show__pdf-btn"
                            }, toDisplayString(__props.labels.download_pdf), 9, ["href"])
                          ])
                        ]),
                        createVNode("div", { class: "row mb-4" }, [
                          createVNode("div", { class: "col-md-6" }, [
                            createVNode("div", { class: "quote-show__label" }, toDisplayString(__props.labels.quote_to), 1),
                            createVNode("div", { class: "quote-show__value" }, toDisplayString((_d2 = __props.quote.company) == null ? void 0 : _d2.name), 1),
                            ((_e = __props.quote.company) == null ? void 0 : _e.email) ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "quote-show__muted"
                            }, toDisplayString(__props.quote.company.email), 1)) : createCommentVNode("", true),
                            ((_f = __props.quote.deal) == null ? void 0 : _f.title) ? (openBlock(), createBlock("div", {
                              key: 1,
                              class: "quote-show__muted"
                            }, toDisplayString(__props.quote.deal.title), 1)) : createCommentVNode("", true)
                          ]),
                          createVNode("div", { class: "col-md-6 text-md-end" }, [
                            createVNode("div", null, [
                              createVNode("span", { class: "quote-show__muted" }, toDisplayString(__props.labels.issued_at) + ":", 1),
                              createVNode("span", { class: "quote-show__value" }, toDisplayString(__props.quote.issued_at), 1)
                            ]),
                            __props.quote.expires_at ? (openBlock(), createBlock("div", { key: 0 }, [
                              createVNode("span", { class: "quote-show__muted" }, toDisplayString(__props.labels.expires_at) + ":", 1),
                              createVNode("span", { class: "quote-show__value" }, toDisplayString(__props.quote.expires_at), 1)
                            ])) : createCommentVNode("", true)
                          ])
                        ]),
                        flashSuccess.value ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "alert alert-success",
                          role: "alert"
                        }, toDisplayString(flashSuccess.value), 1)) : createCommentVNode("", true),
                        statusBanner.value ? (openBlock(), createBlock("div", {
                          key: 1,
                          class: ["alert", statusBannerClass.value],
                          role: "alert"
                        }, toDisplayString(statusBanner.value), 3)) : createCommentVNode("", true),
                        createVNode("div", { class: "table-responsive mb-4" }, [
                          createVNode("table", { class: "quote-show__table" }, [
                            createVNode("thead", null, [
                              createVNode("tr", null, [
                                createVNode("th", null, toDisplayString(__props.labels.description), 1),
                                createVNode("th", { class: "text-end" }, toDisplayString(__props.labels.quantity), 1),
                                createVNode("th", { class: "text-end" }, toDisplayString(__props.labels.unit_price), 1),
                                createVNode("th", { class: "text-end" }, toDisplayString(__props.labels.discount), 1),
                                createVNode("th", { class: "text-end" }, toDisplayString(__props.labels.tax), 1),
                                createVNode("th", { class: "text-end" }, toDisplayString(__props.labels.amount), 1)
                              ])
                            ]),
                            createVNode("tbody", null, [
                              (openBlock(true), createBlock(Fragment, null, renderList(__props.quote.lines, (line, index) => {
                                return openBlock(), createBlock("tr", { key: index }, [
                                  createVNode("td", null, toDisplayString(line.description), 1),
                                  createVNode("td", { class: "text-end" }, toDisplayString(line.quantity), 1),
                                  createVNode("td", { class: "text-end" }, toDisplayString(formatMoney(line.unit_price)), 1),
                                  createVNode("td", { class: "text-end" }, toDisplayString(formatMoney(line.discount_amount)), 1),
                                  createVNode("td", { class: "text-end" }, toDisplayString(formatMoney(line.tax_amount)), 1),
                                  createVNode("td", { class: "text-end" }, toDisplayString(formatMoney(line.amount)), 1)
                                ]);
                              }), 128))
                            ]),
                            createVNode("tfoot", null, [
                              createVNode("tr", null, [
                                createVNode("td", {
                                  colspan: "5",
                                  class: "text-end"
                                }, toDisplayString(__props.labels.subtotal), 1),
                                createVNode("td", { class: "text-end" }, toDisplayString(formatMoney(__props.quote.subtotal)) + " " + toDisplayString(__props.quote.currency), 1)
                              ]),
                              createVNode("tr", null, [
                                createVNode("td", {
                                  colspan: "5",
                                  class: "text-end"
                                }, toDisplayString(__props.labels.discount), 1),
                                createVNode("td", { class: "text-end" }, toDisplayString(formatMoney(__props.quote.discount_amount)), 1)
                              ]),
                              createVNode("tr", null, [
                                createVNode("td", {
                                  colspan: "5",
                                  class: "text-end"
                                }, toDisplayString(__props.labels.tax), 1),
                                createVNode("td", { class: "text-end" }, toDisplayString(formatMoney(__props.quote.tax_amount)), 1)
                              ]),
                              createVNode("tr", { class: "quote-show__grand" }, [
                                createVNode("td", {
                                  colspan: "5",
                                  class: "text-end"
                                }, toDisplayString(__props.labels.total), 1),
                                createVNode("td", { class: "text-end" }, toDisplayString(formatMoney(__props.quote.total)) + " " + toDisplayString(__props.quote.currency), 1)
                              ])
                            ])
                          ])
                        ]),
                        __props.quote.terms ? (openBlock(), createBlock("div", {
                          key: 2,
                          class: "mb-4"
                        }, [
                          createVNode("h5", { class: "quote-show__section-title" }, toDisplayString(__props.labels.terms), 1),
                          createVNode("p", {
                            class: "quote-show__muted",
                            style: { "white-space": "pre-wrap" }
                          }, toDisplayString(__props.quote.terms), 1)
                        ])) : createCommentVNode("", true),
                        __props.branding.sign_url ? (openBlock(), createBlock("div", {
                          key: 3,
                          class: "text-center mb-5"
                        }, [
                          createVNode("div", { class: "quote-show__label mb-2" }, toDisplayString(__props.labels.company_sign), 1),
                          createVNode("img", {
                            src: __props.branding.sign_url,
                            alt: __props.branding.name,
                            class: "quote-show__sign"
                          }, null, 8, ["src", "alt"])
                        ])) : createCommentVNode("", true),
                        __props.quote.can_respond ? (openBlock(), createBlock("div", {
                          key: 4,
                          class: "row g-4"
                        }, [
                          createVNode("div", { class: "col-md-6" }, [
                            createVNode("div", { class: "quote-show__panel h-100" }, [
                              createVNode("h4", { class: "quote-show__section-title" }, toDisplayString(__props.labels.accept_title), 1),
                              createVNode("form", {
                                onSubmit: withModifiers(submitAccept, ["prevent"])
                              }, [
                                createVNode("div", { class: "mb-3" }, [
                                  createVNode("label", { class: "quote-show__label form-label" }, toDisplayString(__props.labels.your_name), 1),
                                  withDirectives(createVNode("input", {
                                    "onUpdate:modelValue": ($event) => unref(acceptForm).responder_name = $event,
                                    type: "text",
                                    class: "quote-show__input",
                                    required: ""
                                  }, null, 8, ["onUpdate:modelValue"]), [
                                    [vModelText, unref(acceptForm).responder_name]
                                  ]),
                                  unref(acceptForm).errors.responder_name ? (openBlock(), createBlock("div", {
                                    key: 0,
                                    class: "text-danger small mt-1"
                                  }, toDisplayString(unref(acceptForm).errors.responder_name), 1)) : createCommentVNode("", true)
                                ]),
                                createVNode("div", { class: "mb-3" }, [
                                  createVNode("label", { class: "quote-show__label form-label" }, toDisplayString(__props.labels.your_email), 1),
                                  withDirectives(createVNode("input", {
                                    "onUpdate:modelValue": ($event) => unref(acceptForm).responder_email = $event,
                                    type: "email",
                                    class: "quote-show__input"
                                  }, null, 8, ["onUpdate:modelValue"]), [
                                    [vModelText, unref(acceptForm).responder_email]
                                  ])
                                ]),
                                createVNode("div", { class: "mb-3" }, [
                                  createVNode("label", { class: "quote-show__label form-label" }, toDisplayString(__props.labels.optional_note), 1),
                                  withDirectives(createVNode("textarea", {
                                    "onUpdate:modelValue": ($event) => unref(acceptForm).response_note = $event,
                                    rows: "3",
                                    class: "quote-show__input"
                                  }, null, 8, ["onUpdate:modelValue"]), [
                                    [vModelText, unref(acceptForm).response_note]
                                  ])
                                ]),
                                createVNode("button", {
                                  type: "submit",
                                  class: "thm-btn",
                                  disabled: unref(acceptForm).processing
                                }, toDisplayString(__props.labels.confirm_accept), 9, ["disabled"])
                              ], 32)
                            ])
                          ]),
                          createVNode("div", { class: "col-md-6" }, [
                            createVNode("div", { class: "quote-show__panel h-100" }, [
                              createVNode("h4", { class: "quote-show__section-title" }, toDisplayString(__props.labels.reject_title), 1),
                              createVNode("form", {
                                onSubmit: withModifiers(submitReject, ["prevent"])
                              }, [
                                createVNode("div", { class: "mb-3" }, [
                                  createVNode("label", { class: "quote-show__label form-label" }, toDisplayString(__props.labels.your_name), 1),
                                  withDirectives(createVNode("input", {
                                    "onUpdate:modelValue": ($event) => unref(rejectForm).responder_name = $event,
                                    type: "text",
                                    class: "quote-show__input",
                                    required: ""
                                  }, null, 8, ["onUpdate:modelValue"]), [
                                    [vModelText, unref(rejectForm).responder_name]
                                  ]),
                                  unref(rejectForm).errors.responder_name ? (openBlock(), createBlock("div", {
                                    key: 0,
                                    class: "text-danger small mt-1"
                                  }, toDisplayString(unref(rejectForm).errors.responder_name), 1)) : createCommentVNode("", true)
                                ]),
                                createVNode("div", { class: "mb-3" }, [
                                  createVNode("label", { class: "quote-show__label form-label" }, toDisplayString(__props.labels.your_email), 1),
                                  withDirectives(createVNode("input", {
                                    "onUpdate:modelValue": ($event) => unref(rejectForm).responder_email = $event,
                                    type: "email",
                                    class: "quote-show__input"
                                  }, null, 8, ["onUpdate:modelValue"]), [
                                    [vModelText, unref(rejectForm).responder_email]
                                  ])
                                ]),
                                createVNode("div", { class: "mb-3" }, [
                                  createVNode("label", { class: "quote-show__label form-label" }, toDisplayString(__props.labels.optional_note), 1),
                                  withDirectives(createVNode("textarea", {
                                    "onUpdate:modelValue": ($event) => unref(rejectForm).response_note = $event,
                                    rows: "3",
                                    class: "quote-show__input"
                                  }, null, 8, ["onUpdate:modelValue"]), [
                                    [vModelText, unref(rejectForm).response_note]
                                  ])
                                ]),
                                createVNode("button", {
                                  type: "submit",
                                  class: "btn btn-outline-danger",
                                  disabled: unref(rejectForm).processing
                                }, toDisplayString(__props.labels.confirm_reject), 9, ["disabled"])
                              ], 32)
                            ])
                          ])
                        ])) : createCommentVNode("", true)
                      ])
                    ])
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$L = _sfc_main$L.setup;
_sfc_main$L.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("Modules/CRM/resources/assets/js/Pages/QuoteShow.vue");
  return _sfc_setup$L ? _sfc_setup$L(props, ctx) : void 0;
};
const QuoteShow = /* @__PURE__ */ _export_sfc(_sfc_main$L, [["__scopeId", "data-v-44ef5b4e"]]);
const __vite_glob_0_2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: QuoteShow
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$K = {
  __name: "AboutUs",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const trans = (key) => page.props.translations[key] || key;
    const seo = computed(() => page.props.seo);
    const settings = computed(() => page.props.settings || {});
    const asset_path = computed(() => page.props.asset_path || "");
    const locale = computed(() => page.props.locale || "en");
    const teams = computed(() => page.props.teams || []);
    const testimonials = computed(() => page.props.testimonials || []);
    const clients = computed(() => page.props.clients || []);
    const meta = computed(() => page.props.meta || {});
    const reversedTestimonials = computed(() => [...testimonials.value].reverse());
    const metaTitle = computed(() => {
      return meta.value.title || `${trans("About Us")} | ${seo.value.website_name || ""}`.trim();
    });
    const metaDescription = computed(() => {
      return meta.value.description || trans("Learn about our team, mission, and the technology expertise behind our solutions.") || seo.value.website_desc || "";
    });
    const metaKeywords = computed(() => {
      return meta.value.keywords || trans("about us, IT consulting, technology experts, digital transformation") || seo.value.website_keywords || "";
    });
    const metaImage = computed(() => {
      var _a, _b, _c, _d, _e;
      return ((_b = (_a = meta.value) == null ? void 0 : _a.og) == null ? void 0 : _b.image) || ((_d = (_c = meta.value) == null ? void 0 : _c.twitter) == null ? void 0 : _d.image) || ((_e = settings.value) == null ? void 0 : _e.meta_img) || "";
    });
    const metaCanonical = computed(() => meta.value.canonical || "");
    const metaRobots = computed(() => meta.value.robots || "index, follow");
    const benefitItems = [
      {
        icon: "qore/images/section/platform.svg",
        title: "Harmony over chaos",
        text: "Every solution must be coherent. No messy stacks, no duct-tape architectures."
      },
      {
        icon: "qore/images/section/ai-core.svg",
        title: "Engineering first",
        text: "Pretty UI is great, but solid architecture, performance, and maintainability come first."
      },
      {
        icon: "qore/images/section/control.svg",
        title: "Truth & clarity",
        text: "We say what's possible, what's risky, and what's unnecessary. No tech theater."
      },
      {
        icon: "qore/images/section/evolving.svg",
        title: "Continuous learning",
        text: "AI, cloud, and software evolve fast. We evolve faster."
      },
      {
        icon: "qore/images/section/speed.svg",
        title: "Unmatched Quality",
        text: "We deliver exceptional products and services that exceed expectations every time."
      },
      {
        icon: "qore/images/section/secure.svg",
        title: "User-Centric Approach",
        text: "Your satisfaction is our priority, and we tailor solutions to meet your unique needs. Your happiness comes first."
      }
    ];
    const translateField = (value) => {
      if (!value) {
        return "";
      }
      if (typeof value === "string") {
        return value;
      }
      if (typeof value === "object" && value !== null) {
        return value[locale.value] || value.en || value[Object.keys(value)[0]] || "";
      }
      return "";
    };
    const teamLink = (team) => (team == null ? void 0 : team.linked_in) || (team == null ? void 0 : team.github) || (team == null ? void 0 : team.behance) || (team == null ? void 0 : team.facebook) || "";
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), null, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<title${_scopeId}>${ssrInterpolate(metaTitle.value)}</title><meta name="description"${ssrRenderAttr("content", metaDescription.value)}${_scopeId}><meta name="keywords"${ssrRenderAttr("content", metaKeywords.value)}${_scopeId}><meta name="robots"${ssrRenderAttr("content", metaRobots.value)}${_scopeId}>`);
            if (metaCanonical.value) {
              _push2(`<link rel="canonical"${ssrRenderAttr("href", metaCanonical.value)}${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<meta property="og:title"${ssrRenderAttr("content", metaTitle.value)}${_scopeId}><meta property="og:description"${ssrRenderAttr("content", metaDescription.value)}${_scopeId}>`);
            if (metaImage.value) {
              _push2(`<meta property="og:image"${ssrRenderAttr("content", metaImage.value)}${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            if (metaCanonical.value) {
              _push2(`<meta property="og:url"${ssrRenderAttr("content", metaCanonical.value)}${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<meta property="og:type" content="website"${_scopeId}><meta name="twitter:card" content="summary_large_image"${_scopeId}><meta name="twitter:title"${ssrRenderAttr("content", metaTitle.value)}${_scopeId}><meta name="twitter:description"${ssrRenderAttr("content", metaDescription.value)}${_scopeId}>`);
            if (metaImage.value) {
              _push2(`<meta name="twitter:image"${ssrRenderAttr("content", metaImage.value)}${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("title", null, toDisplayString(metaTitle.value), 1),
              createVNode("meta", {
                name: "description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "keywords",
                content: metaKeywords.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "robots",
                content: metaRobots.value
              }, null, 8, ["content"]),
              metaCanonical.value ? (openBlock(), createBlock("link", {
                key: 0,
                rel: "canonical",
                href: metaCanonical.value
              }, null, 8, ["href"])) : createCommentVNode("", true),
              createVNode("meta", {
                property: "og:title",
                content: metaTitle.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              metaImage.value ? (openBlock(), createBlock("meta", {
                key: 1,
                property: "og:image",
                content: metaImage.value
              }, null, 8, ["content"])) : createCommentVNode("", true),
              metaCanonical.value ? (openBlock(), createBlock("meta", {
                key: 2,
                property: "og:url",
                content: metaCanonical.value
              }, null, 8, ["content"])) : createCommentVNode("", true),
              createVNode("meta", {
                property: "og:type",
                content: "website"
              }),
              createVNode("meta", {
                name: "twitter:card",
                content: "summary_large_image"
              }),
              createVNode("meta", {
                name: "twitter:title",
                content: metaTitle.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "twitter:description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              metaImage.value ? (openBlock(), createBlock("meta", {
                key: 3,
                name: "twitter:image",
                content: metaImage.value
              }, null, 8, ["content"])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$R, null, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$N, {
              title: trans("About Us")
            }, null, _parent2, _scopeId));
            _push2(`<section class="section-hero-about flat-spacing-2"${_scopeId}><div class="img-item-1"${_scopeId}><img loading="lazy" width="1296" height="606"${ssrRenderAttr("src", asset_path.value + "qore/images/item/color-bg-1.png")}${ssrRenderAttr("alt", trans("About Us"))}${_scopeId}></div><div class="img-item-2"${_scopeId}><img loading="lazy" width="1296" height="606"${ssrRenderAttr("src", asset_path.value + "qore/images/item/pixel-texture.png")}${ssrRenderAttr("alt", trans("About Us"))}${_scopeId}></div><div class="container"${_scopeId}><div class="row"${_scopeId}><div class="col-lg-10 mx-auto"${_scopeId}><div class="sect-title wow fadeInUp"${_scopeId}><h2 class="s-title font-3 text-linear"${_scopeId}>${ssrInterpolate(trans("Supercharge Your Business Growth with Our Cutting-Edge IT Solutions"))}</h2><p class="s-sub_title"${_scopeId}>${ssrInterpolate(trans("Symfonix is a technology company that designs, builds, and scales digital systems where web, mobile, AI, and cloud work together instead of fighting each other. The name says it all: a symphony of technologies, orchestrated with intention."))}</p></div><div class="image px-16 px-lg-0"${_scopeId}><img loading="lazy" width="1078" height="606"${ssrRenderAttr("src", asset_path.value + "qore/images/section/hero-about.png")}${ssrRenderAttr("alt", trans("About our company"))}${_scopeId}></div></div><div class="col-lg-4 offset-lg-1"${_scopeId}><div class="px-16 px-lg-0"${_scopeId}><p class="text-caption caption font-2 text-main-2"${_scopeId}>${ssrInterpolate(trans("About Us"))}</p><h5 class="title-2 text-linear-2 font-3"${_scopeId}> 10 ${ssrInterpolate(trans("Years of"))} ${ssrInterpolate(trans("Experience"))}</h5><p class="text-body-3 mb-lg-0"${_scopeId}>${ssrInterpolate(trans("Built in Syria. Designed for the world."))}</p></div></div><div class="col-lg-5 offset-lg-1"${_scopeId}><h4 class="font-3 px-16 px-lg-0"${_scopeId}>${ssrInterpolate(trans("Core Values (This is non-negotiable stuff)"))}</h4><p class="s-sub_title px-16 px-lg-0"${_scopeId}>${ssrInterpolate(trans("Pretty UI is great, but solid architecture, performance, and maintainability come first."))} ${ssrInterpolate(trans("We say what's possible, what's risky, and what's unnecessary. No tech theater."))}</p></div></div></div></section><div class="section-break"${_scopeId}><div class="position-relative z-5"${_scopeId}><div class="container"${_scopeId}><div class="has-hafl_plus"${_scopeId}><span class="hafl-plus pst-left_bot item_bot wow bounceInScale"${_scopeId}></span><span class="hafl-plus pst-right_bot item_bot wow bounceInScale"${_scopeId}></span></div></div></div><span class="br-line"${_scopeId}></span>`);
            _push2(ssrRenderComponent(_sfc_main$T, null, null, _parent2, _scopeId));
            _push2(`<div class="position-relative z-5"${_scopeId}><div class="container"${_scopeId}><div class="has-hafl_plus"${_scopeId}><span class="hafl-plus pst-left_bot item_top wow bounceInScale"${_scopeId}></span><span class="hafl-plus pst-right_bot item_top wow bounceInScale"${_scopeId}></span></div></div></div><span class="br-line"${_scopeId}></span></div><section class="flat-spacing-3"${_scopeId}><div class="container"${_scopeId}><div class="sect-title wow fadeInUp"${_scopeId}><h2 class="s-title font-3"${_scopeId}>${ssrInterpolate(trans("Why Choose Symfonix for Web, AI, and Cloud"))}</h2><p class="s-sub_title"${_scopeId}>${ssrInterpolate(trans("We deliver exceptional products and services that consistently exceed expectations. Backed by years of experience and a proven track record, we are your reliable partner for success."))}</p></div><div class="grid-box_icon tf-grid-layout sm-col-2 md-col-3 pb-0"${_scopeId}><!--[-->`);
            ssrRenderList(benefitItems, (item) => {
              _push2(`<div class="box-icon-text wow fadeInUp"${_scopeId}><div class="icon"${_scopeId}><img${ssrRenderAttr("src", asset_path.value + item.icon)}${ssrRenderAttr("alt", trans(item.title))}${_scopeId}></div><div class="content"${_scopeId}><p class="title text-main-2"${_scopeId}>${ssrInterpolate(trans(item.title))}</p><p class="sub-title text-body-3"${_scopeId}>${ssrInterpolate(trans(item.text))}</p></div></div>`);
            });
            _push2(`<!--]--></div></div></section><div class="section-break"${_scopeId}><div class="position-relative z-5"${_scopeId}><div class="container"${_scopeId}><div class="has-hafl_plus"${_scopeId}><span class="hafl-plus pst-left_bot item_bot wow bounceInScale"${_scopeId}></span><span class="hafl-plus pst-right_bot item_bot wow bounceInScale"${_scopeId}></span></div></div></div><span class="br-line"${_scopeId}></span>`);
            _push2(ssrRenderComponent(_sfc_main$T, null, null, _parent2, _scopeId));
            _push2(`<div class="position-relative z-5"${_scopeId}><div class="container"${_scopeId}><div class="has-hafl_plus"${_scopeId}><span class="hafl-plus pst-left_bot item_top wow bounceInScale"${_scopeId}></span><span class="hafl-plus pst-right_bot item_top wow bounceInScale"${_scopeId}></span></div></div></div><span class="br-line"${_scopeId}></span></div>`);
            if (teams.value.length) {
              _push2(`<section class="section-team flat-spacing-3"${_scopeId}><div class="container"${_scopeId}><h2 class="s-title only-title font-3 text-center"${_scopeId}>${ssrInterpolate(trans("Meet Our Team."))}</h2><p class="s-sub_title text-center mb-5"${_scopeId}>${ssrInterpolate(trans("Our dedicated team combines expertise, creativity, and passion to deliver exceptional results and ensure your satisfaction every step of the way."))}</p><div class="row"${_scopeId}><div class="col-xl-10 mx-auto"${_scopeId}><div class="tf-grid-layout sm-col-2 lg-col-3 px-16 px-xl-0"${_scopeId}><!--[-->`);
              ssrRenderList(teams.value, (team) => {
                ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(teamLink(team) ? "a" : "div"), {
                  key: team.id,
                  href: teamLink(team) || void 0,
                  target: teamLink(team) ? "_blank" : void 0,
                  rel: teamLink(team) ? "noopener noreferrer" : void 0,
                  class: "card-team hover-img4"
                }, {
                  default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<div class="content"${_scopeId2}><div class="team_image img-style4"${_scopeId2}><img loading="lazy" width="886" height="951"${ssrRenderAttr("src", team.avatar_link)}${ssrRenderAttr("alt", translateField(team.name))}${_scopeId2}></div><div class="team_info"${_scopeId2}><h5 class="name text-linear font-3"${_scopeId2}>${ssrInterpolate(translateField(team.name))}</h5><p class="text-body-3"${_scopeId2}>${ssrInterpolate(translateField(team.position))}</p></div></div>`);
                    } else {
                      return [
                        createVNode("div", { class: "content" }, [
                          createVNode("div", { class: "team_image img-style4" }, [
                            createVNode("img", {
                              loading: "lazy",
                              width: "886",
                              height: "951",
                              src: team.avatar_link,
                              alt: translateField(team.name)
                            }, null, 8, ["src", "alt"])
                          ]),
                          createVNode("div", { class: "team_info" }, [
                            createVNode("h5", { class: "name text-linear font-3" }, toDisplayString(translateField(team.name)), 1),
                            createVNode("p", { class: "text-body-3" }, toDisplayString(translateField(team.position)), 1)
                          ])
                        ])
                      ];
                    }
                  }),
                  _: 2
                }), _parent2, _scopeId);
              });
              _push2(`<!--]--></div></div></div></div></section>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="section-break"${_scopeId}><div class="position-relative z-5"${_scopeId}><div class="container"${_scopeId}><div class="has-hafl_plus"${_scopeId}><span class="hafl-plus pst-left_bot item_bot wow bounceInScale"${_scopeId}></span><span class="hafl-plus pst-right_bot item_bot wow bounceInScale"${_scopeId}></span></div></div></div><span class="br-line"${_scopeId}></span>`);
            _push2(ssrRenderComponent(_sfc_main$T, null, null, _parent2, _scopeId));
            _push2(`<div class="position-relative z-5"${_scopeId}><div class="container"${_scopeId}><div class="has-hafl_plus"${_scopeId}><span class="hafl-plus pst-left_bot item_top wow bounceInScale"${_scopeId}></span><span class="hafl-plus pst-right_bot item_top wow bounceInScale"${_scopeId}></span></div></div></div><span class="br-line"${_scopeId}></span></div><section class="section-how-to flat-spacing-3"${_scopeId}><div class="sect-main"${_scopeId}><div class="container"${_scopeId}><div class="sect-title wow fadeInUp"${_scopeId}><h2 class="s-title font-3"${_scopeId}>${ssrInterpolate(trans("How We've Empowered Businesses with Innovative Tech Solutions"))}</h2><p class="s-sub_title"${_scopeId}>${ssrInterpolate(trans("From personalized solutions to expert execution, we prioritize quality, reliability, and customer satisfaction"))}</p></div><div class="row"${_scopeId}><div class="col-md-8 col-xl-6 mx-auto"${_scopeId}><ul class="tab-how_to position-relative mx-1 wow fadeInUp"${_scopeId}><li class="nav-tab-item"${_scopeId}><div class="btn_tab active"${_scopeId}><p class="number-step text-caption font-2"${_scopeId}>STEP 01</p><h5 class="name"${_scopeId}>${ssrInterpolate(trans("Discovery & Strategy"))}</h5><p class="desc"${_scopeId}>${ssrInterpolate(trans("We analyze your business needs, identify challenges, and craft a strategic roadmap for the best IT solutions."))}</p></div></li><li class="br-line has-dot"${_scopeId}></li><li class="nav-tab-item"${_scopeId}><div class="btn_tab"${_scopeId}><p class="number-step text-caption font-2"${_scopeId}>STEP 02</p><h5 class="name"${_scopeId}>${ssrInterpolate(trans("Development"))}</h5><p class="desc"${_scopeId}>${ssrInterpolate(trans("Our expert team designs, develops, and integrates cutting-edge technology tailored to your goals."))}</p></div></li><li class="br-line has-dot"${_scopeId}></li><li class="nav-tab-item"${_scopeId}><div class="btn_tab"${_scopeId}><p class="number-step text-caption font-2"${_scopeId}>STEP 03</p><h5 class="name"${_scopeId}>${ssrInterpolate(trans("Optimization & Support"))}</h5><p class="desc"${_scopeId}>${ssrInterpolate(trans("We ensure seamless performance with continuous improvements, maintenance, and dedicated support."))}</p></div></li></ul></div></div></div></div></section><div class="section-break"${_scopeId}><div class="position-relative z-5"${_scopeId}><div class="container"${_scopeId}><div class="has-hafl_plus"${_scopeId}><span class="hafl-plus pst-left_bot item_bot wow bounceInScale"${_scopeId}></span><span class="hafl-plus pst-right_bot item_bot wow bounceInScale"${_scopeId}></span></div></div></div><span class="br-line"${_scopeId}></span>`);
            _push2(ssrRenderComponent(_sfc_main$T, null, null, _parent2, _scopeId));
            _push2(`<div class="position-relative z-5"${_scopeId}><div class="container"${_scopeId}><div class="has-hafl_plus"${_scopeId}><span class="hafl-plus pst-left_bot item_top wow bounceInScale"${_scopeId}></span><span class="hafl-plus pst-right_bot item_top wow bounceInScale"${_scopeId}></span></div></div></div><span class="br-line"${_scopeId}></span></div>`);
            if (testimonials.value.length) {
              _push2(`<section class="section-testimonial tes-2 flat-spacing-3"${_scopeId}><div class="sect-main"${_scopeId}><div class="s-img_item wow bounceInScale"${_scopeId}><img class="lazyload img-2"${ssrRenderAttr("src", asset_path.value + "qore/images/section/color-bg.webp")}${ssrRenderAttr("data-src", asset_path.value + "qore/images/section/color-bg.webp")}${ssrRenderAttr("alt", trans("Testimonials"))}${_scopeId}></div><div class="container"${_scopeId}><div class="sect-title wow fadeInUp pt-0"${_scopeId}><h2 class="s-title font-3 m-0"${_scopeId}>${ssrInterpolate(trans("What Our Clients Say"))}</h2></div><div class="testimonial-slide-wrap pb-0"${_scopeId}><div class="overflow-hidden has-overlay_linear type-2 mx-1"${_scopeId}><div class="infiniteSlide infiniteSlide-tes"${_scopeId}><!--[-->`);
              ssrRenderList(testimonials.value, (testimonial) => {
                _push2(`<div class="wg-testimonial"${_scopeId}><div class="tes-author"${_scopeId}><div class="author_image"${_scopeId}><img${ssrRenderAttr("src", testimonial.avatar_link)}${ssrRenderAttr("alt", translateField(testimonial.name))}${_scopeId}></div><div class="author_info"${_scopeId}><span class="link name"${_scopeId}>${ssrInterpolate(translateField(testimonial.name))}</span><p class="text-body-3"${_scopeId}>${ssrInterpolate(translateField(testimonial.position))}</p></div></div><p class="tes-text"${_scopeId}>${ssrInterpolate(translateField(testimonial.quote))}</p></div>`);
              });
              _push2(`<!--]--></div><div class="infiniteSlide infiniteSlide-tes mb-0" data-style="right"${_scopeId}><!--[-->`);
              ssrRenderList(reversedTestimonials.value, (testimonial) => {
                _push2(`<div class="wg-testimonial"${_scopeId}><div class="tes-author"${_scopeId}><div class="author_image"${_scopeId}><img${ssrRenderAttr("src", testimonial.avatar_link)}${ssrRenderAttr("alt", translateField(testimonial.name))}${_scopeId}></div><div class="author_info"${_scopeId}><span class="link name"${_scopeId}>${ssrInterpolate(translateField(testimonial.name))}</span><p class="text-body-3"${_scopeId}>${ssrInterpolate(translateField(testimonial.position))}</p></div></div><p class="tes-text"${_scopeId}>${ssrInterpolate(translateField(testimonial.quote))}</p></div>`);
              });
              _push2(`<!--]--></div></div></div></div></div></section>`);
            } else {
              _push2(`<!---->`);
            }
            if (testimonials.value.length && clients.value.length) {
              _push2(`<div class="section-break"${_scopeId}><div class="position-relative z-5"${_scopeId}><div class="container"${_scopeId}><div class="has-hafl_plus"${_scopeId}><span class="hafl-plus pst-left_bot item_bot wow bounceInScale"${_scopeId}></span><span class="hafl-plus pst-right_bot item_bot wow bounceInScale"${_scopeId}></span></div></div></div><span class="br-line"${_scopeId}></span>`);
              _push2(ssrRenderComponent(_sfc_main$T, null, null, _parent2, _scopeId));
              _push2(`<div class="position-relative z-5"${_scopeId}><div class="container"${_scopeId}><div class="has-hafl_plus"${_scopeId}><span class="hafl-plus pst-left_bot item_top wow bounceInScale"${_scopeId}></span><span class="hafl-plus pst-right_bot item_top wow bounceInScale"${_scopeId}></span></div></div></div><span class="br-line"${_scopeId}></span></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (clients.value.length) {
              _push2(`<div class="tf-brand"${_scopeId}><div class="container"${_scopeId}><div class="tf-brand_inner"${_scopeId}><h5 class="title text-caption font-2 letter-space-0 fw-normal wow fadeInUp"${_scopeId}>${ssrInterpolate(trans("Trusted by companies we build with"))}</h5><div class="infiniteSlide infiniteSlide_brand" data-clone="3"${_scopeId}><!--[-->`);
              ssrRenderList(clients.value, (client) => {
                _push2(`<div class="image-brand"${_scopeId}><img${ssrRenderAttr("src", client.logo_link)}${ssrRenderAttr("alt", client.name)} loading="lazy"${_scopeId}></div>`);
              });
              _push2(`<!--]--></div><span class="hafl-plus pst-left_bot item_bot wow bounceInScale"${_scopeId}></span><span class="hafl-plus pst-right_bot item_bot wow bounceInScale"${_scopeId}></span></div></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="section-break"${_scopeId}><div class="position-relative z-5"${_scopeId}><div class="container"${_scopeId}><div class="has-hafl_plus"${_scopeId}><span class="hafl-plus pst-left_bot item_bot wow bounceInScale"${_scopeId}></span><span class="hafl-plus pst-right_bot item_bot wow bounceInScale"${_scopeId}></span></div></div></div><span class="br-line"${_scopeId}></span>`);
            _push2(ssrRenderComponent(_sfc_main$T, null, null, _parent2, _scopeId));
            _push2(`<div class="position-relative z-5"${_scopeId}><div class="container"${_scopeId}><div class="has-hafl_plus"${_scopeId}><span class="hafl-plus pst-left_bot item_top wow bounceInScale"${_scopeId}></span><span class="hafl-plus pst-right_bot item_top wow bounceInScale"${_scopeId}></span></div></div></div><span class="br-line"${_scopeId}></span></div><section class="section-image-text flat-spacing-3"${_scopeId}><div class="container"${_scopeId}><div class="row"${_scopeId}><div class="col-lg-10 mx-auto"${_scopeId}><div class="px-16 px-xl-0"${_scopeId}><div class="banner-image-v01"${_scopeId}><div class="img-abs img-bg"${_scopeId}><img loading="lazy" width="1078" height="369"${ssrRenderAttr("src", asset_path.value + "qore/images/item/item-bg-3.png")}${ssrRenderAttr("alt", trans("Contact Us"))}${_scopeId}></div><div class="content"${_scopeId}><h3 class="title text-linear font-3"${_scopeId}>${ssrInterpolate(trans("To make requests for further information, contact us"))}</h3><p class="sub-title"${_scopeId}>${ssrInterpolate(trans("Call Us For Any inquiry"))} `);
            if (settings.value.phone) {
              _push2(`<!--[--><br${_scopeId}><a dir="ltr"${ssrRenderAttr("href", `tel:${settings.value.phone}`)}${_scopeId}>${ssrInterpolate(settings.value.phone)}</a><!--]-->`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</p>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("contact-us"),
              class: "tf-btn text-body-3 style-2 style-high-2 animate-btn animate-dark"
            }, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(trans("Get in Touch"))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(trans("Get in Touch")), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="image"${_scopeId}><img loading="lazy" width="498" height="308"${ssrRenderAttr("src", asset_path.value + "qore/images/section/build-in/build-1.jpg")}${ssrRenderAttr("alt", trans("Get in Touch"))}${_scopeId}></div></div></div></div></div></div></section>`);
          } else {
            return [
              createVNode(_sfc_main$N, {
                title: trans("About Us")
              }, null, 8, ["title"]),
              createVNode("section", { class: "section-hero-about flat-spacing-2" }, [
                createVNode("div", { class: "img-item-1" }, [
                  createVNode("img", {
                    loading: "lazy",
                    width: "1296",
                    height: "606",
                    src: asset_path.value + "qore/images/item/color-bg-1.png",
                    alt: trans("About Us")
                  }, null, 8, ["src", "alt"])
                ]),
                createVNode("div", { class: "img-item-2" }, [
                  createVNode("img", {
                    loading: "lazy",
                    width: "1296",
                    height: "606",
                    src: asset_path.value + "qore/images/item/pixel-texture.png",
                    alt: trans("About Us")
                  }, null, 8, ["src", "alt"])
                ]),
                createVNode("div", { class: "container" }, [
                  createVNode("div", { class: "row" }, [
                    createVNode("div", { class: "col-lg-10 mx-auto" }, [
                      createVNode("div", { class: "sect-title wow fadeInUp" }, [
                        createVNode("h2", { class: "s-title font-3 text-linear" }, toDisplayString(trans("Supercharge Your Business Growth with Our Cutting-Edge IT Solutions")), 1),
                        createVNode("p", { class: "s-sub_title" }, toDisplayString(trans("Symfonix is a technology company that designs, builds, and scales digital systems where web, mobile, AI, and cloud work together instead of fighting each other. The name says it all: a symphony of technologies, orchestrated with intention.")), 1)
                      ]),
                      createVNode("div", { class: "image px-16 px-lg-0" }, [
                        createVNode("img", {
                          loading: "lazy",
                          width: "1078",
                          height: "606",
                          src: asset_path.value + "qore/images/section/hero-about.png",
                          alt: trans("About our company")
                        }, null, 8, ["src", "alt"])
                      ])
                    ]),
                    createVNode("div", { class: "col-lg-4 offset-lg-1" }, [
                      createVNode("div", { class: "px-16 px-lg-0" }, [
                        createVNode("p", { class: "text-caption caption font-2 text-main-2" }, toDisplayString(trans("About Us")), 1),
                        createVNode("h5", { class: "title-2 text-linear-2 font-3" }, " 10 " + toDisplayString(trans("Years of")) + " " + toDisplayString(trans("Experience")), 1),
                        createVNode("p", { class: "text-body-3 mb-lg-0" }, toDisplayString(trans("Built in Syria. Designed for the world.")), 1)
                      ])
                    ]),
                    createVNode("div", { class: "col-lg-5 offset-lg-1" }, [
                      createVNode("h4", { class: "font-3 px-16 px-lg-0" }, toDisplayString(trans("Core Values (This is non-negotiable stuff)")), 1),
                      createVNode("p", { class: "s-sub_title px-16 px-lg-0" }, toDisplayString(trans("Pretty UI is great, but solid architecture, performance, and maintainability come first.")) + " " + toDisplayString(trans("We say what's possible, what's risky, and what's unnecessary. No tech theater.")), 1)
                    ])
                  ])
                ])
              ]),
              createVNode("div", { class: "section-break" }, [
                createVNode("div", { class: "position-relative z-5" }, [
                  createVNode("div", { class: "container" }, [
                    createVNode("div", { class: "has-hafl_plus" }, [
                      createVNode("span", { class: "hafl-plus pst-left_bot item_bot wow bounceInScale" }),
                      createVNode("span", { class: "hafl-plus pst-right_bot item_bot wow bounceInScale" })
                    ])
                  ])
                ]),
                createVNode("span", { class: "br-line" }),
                createVNode(_sfc_main$T),
                createVNode("div", { class: "position-relative z-5" }, [
                  createVNode("div", { class: "container" }, [
                    createVNode("div", { class: "has-hafl_plus" }, [
                      createVNode("span", { class: "hafl-plus pst-left_bot item_top wow bounceInScale" }),
                      createVNode("span", { class: "hafl-plus pst-right_bot item_top wow bounceInScale" })
                    ])
                  ])
                ]),
                createVNode("span", { class: "br-line" })
              ]),
              createVNode("section", { class: "flat-spacing-3" }, [
                createVNode("div", { class: "container" }, [
                  createVNode("div", { class: "sect-title wow fadeInUp" }, [
                    createVNode("h2", { class: "s-title font-3" }, toDisplayString(trans("Why Choose Symfonix for Web, AI, and Cloud")), 1),
                    createVNode("p", { class: "s-sub_title" }, toDisplayString(trans("We deliver exceptional products and services that consistently exceed expectations. Backed by years of experience and a proven track record, we are your reliable partner for success.")), 1)
                  ]),
                  createVNode("div", { class: "grid-box_icon tf-grid-layout sm-col-2 md-col-3 pb-0" }, [
                    (openBlock(), createBlock(Fragment, null, renderList(benefitItems, (item) => {
                      return createVNode("div", {
                        key: item.title,
                        class: "box-icon-text wow fadeInUp"
                      }, [
                        createVNode("div", { class: "icon" }, [
                          createVNode("img", {
                            src: asset_path.value + item.icon,
                            alt: trans(item.title)
                          }, null, 8, ["src", "alt"])
                        ]),
                        createVNode("div", { class: "content" }, [
                          createVNode("p", { class: "title text-main-2" }, toDisplayString(trans(item.title)), 1),
                          createVNode("p", { class: "sub-title text-body-3" }, toDisplayString(trans(item.text)), 1)
                        ])
                      ]);
                    }), 64))
                  ])
                ])
              ]),
              createVNode("div", { class: "section-break" }, [
                createVNode("div", { class: "position-relative z-5" }, [
                  createVNode("div", { class: "container" }, [
                    createVNode("div", { class: "has-hafl_plus" }, [
                      createVNode("span", { class: "hafl-plus pst-left_bot item_bot wow bounceInScale" }),
                      createVNode("span", { class: "hafl-plus pst-right_bot item_bot wow bounceInScale" })
                    ])
                  ])
                ]),
                createVNode("span", { class: "br-line" }),
                createVNode(_sfc_main$T),
                createVNode("div", { class: "position-relative z-5" }, [
                  createVNode("div", { class: "container" }, [
                    createVNode("div", { class: "has-hafl_plus" }, [
                      createVNode("span", { class: "hafl-plus pst-left_bot item_top wow bounceInScale" }),
                      createVNode("span", { class: "hafl-plus pst-right_bot item_top wow bounceInScale" })
                    ])
                  ])
                ]),
                createVNode("span", { class: "br-line" })
              ]),
              teams.value.length ? (openBlock(), createBlock("section", {
                key: 0,
                class: "section-team flat-spacing-3"
              }, [
                createVNode("div", { class: "container" }, [
                  createVNode("h2", { class: "s-title only-title font-3 text-center" }, toDisplayString(trans("Meet Our Team.")), 1),
                  createVNode("p", { class: "s-sub_title text-center mb-5" }, toDisplayString(trans("Our dedicated team combines expertise, creativity, and passion to deliver exceptional results and ensure your satisfaction every step of the way.")), 1),
                  createVNode("div", { class: "row" }, [
                    createVNode("div", { class: "col-xl-10 mx-auto" }, [
                      createVNode("div", { class: "tf-grid-layout sm-col-2 lg-col-3 px-16 px-xl-0" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(teams.value, (team) => {
                          return openBlock(), createBlock(resolveDynamicComponent(teamLink(team) ? "a" : "div"), {
                            key: team.id,
                            href: teamLink(team) || void 0,
                            target: teamLink(team) ? "_blank" : void 0,
                            rel: teamLink(team) ? "noopener noreferrer" : void 0,
                            class: "card-team hover-img4"
                          }, {
                            default: withCtx(() => [
                              createVNode("div", { class: "content" }, [
                                createVNode("div", { class: "team_image img-style4" }, [
                                  createVNode("img", {
                                    loading: "lazy",
                                    width: "886",
                                    height: "951",
                                    src: team.avatar_link,
                                    alt: translateField(team.name)
                                  }, null, 8, ["src", "alt"])
                                ]),
                                createVNode("div", { class: "team_info" }, [
                                  createVNode("h5", { class: "name text-linear font-3" }, toDisplayString(translateField(team.name)), 1),
                                  createVNode("p", { class: "text-body-3" }, toDisplayString(translateField(team.position)), 1)
                                ])
                              ])
                            ]),
                            _: 2
                          }, 1032, ["href", "target", "rel"]);
                        }), 128))
                      ])
                    ])
                  ])
                ])
              ])) : createCommentVNode("", true),
              createVNode("div", { class: "section-break" }, [
                createVNode("div", { class: "position-relative z-5" }, [
                  createVNode("div", { class: "container" }, [
                    createVNode("div", { class: "has-hafl_plus" }, [
                      createVNode("span", { class: "hafl-plus pst-left_bot item_bot wow bounceInScale" }),
                      createVNode("span", { class: "hafl-plus pst-right_bot item_bot wow bounceInScale" })
                    ])
                  ])
                ]),
                createVNode("span", { class: "br-line" }),
                createVNode(_sfc_main$T),
                createVNode("div", { class: "position-relative z-5" }, [
                  createVNode("div", { class: "container" }, [
                    createVNode("div", { class: "has-hafl_plus" }, [
                      createVNode("span", { class: "hafl-plus pst-left_bot item_top wow bounceInScale" }),
                      createVNode("span", { class: "hafl-plus pst-right_bot item_top wow bounceInScale" })
                    ])
                  ])
                ]),
                createVNode("span", { class: "br-line" })
              ]),
              createVNode("section", { class: "section-how-to flat-spacing-3" }, [
                createVNode("div", { class: "sect-main" }, [
                  createVNode("div", { class: "container" }, [
                    createVNode("div", { class: "sect-title wow fadeInUp" }, [
                      createVNode("h2", { class: "s-title font-3" }, toDisplayString(trans("How We've Empowered Businesses with Innovative Tech Solutions")), 1),
                      createVNode("p", { class: "s-sub_title" }, toDisplayString(trans("From personalized solutions to expert execution, we prioritize quality, reliability, and customer satisfaction")), 1)
                    ]),
                    createVNode("div", { class: "row" }, [
                      createVNode("div", { class: "col-md-8 col-xl-6 mx-auto" }, [
                        createVNode("ul", { class: "tab-how_to position-relative mx-1 wow fadeInUp" }, [
                          createVNode("li", { class: "nav-tab-item" }, [
                            createVNode("div", { class: "btn_tab active" }, [
                              createVNode("p", { class: "number-step text-caption font-2" }, "STEP 01"),
                              createVNode("h5", { class: "name" }, toDisplayString(trans("Discovery & Strategy")), 1),
                              createVNode("p", { class: "desc" }, toDisplayString(trans("We analyze your business needs, identify challenges, and craft a strategic roadmap for the best IT solutions.")), 1)
                            ])
                          ]),
                          createVNode("li", { class: "br-line has-dot" }),
                          createVNode("li", { class: "nav-tab-item" }, [
                            createVNode("div", { class: "btn_tab" }, [
                              createVNode("p", { class: "number-step text-caption font-2" }, "STEP 02"),
                              createVNode("h5", { class: "name" }, toDisplayString(trans("Development")), 1),
                              createVNode("p", { class: "desc" }, toDisplayString(trans("Our expert team designs, develops, and integrates cutting-edge technology tailored to your goals.")), 1)
                            ])
                          ]),
                          createVNode("li", { class: "br-line has-dot" }),
                          createVNode("li", { class: "nav-tab-item" }, [
                            createVNode("div", { class: "btn_tab" }, [
                              createVNode("p", { class: "number-step text-caption font-2" }, "STEP 03"),
                              createVNode("h5", { class: "name" }, toDisplayString(trans("Optimization & Support")), 1),
                              createVNode("p", { class: "desc" }, toDisplayString(trans("We ensure seamless performance with continuous improvements, maintenance, and dedicated support.")), 1)
                            ])
                          ])
                        ])
                      ])
                    ])
                  ])
                ])
              ]),
              createVNode("div", { class: "section-break" }, [
                createVNode("div", { class: "position-relative z-5" }, [
                  createVNode("div", { class: "container" }, [
                    createVNode("div", { class: "has-hafl_plus" }, [
                      createVNode("span", { class: "hafl-plus pst-left_bot item_bot wow bounceInScale" }),
                      createVNode("span", { class: "hafl-plus pst-right_bot item_bot wow bounceInScale" })
                    ])
                  ])
                ]),
                createVNode("span", { class: "br-line" }),
                createVNode(_sfc_main$T),
                createVNode("div", { class: "position-relative z-5" }, [
                  createVNode("div", { class: "container" }, [
                    createVNode("div", { class: "has-hafl_plus" }, [
                      createVNode("span", { class: "hafl-plus pst-left_bot item_top wow bounceInScale" }),
                      createVNode("span", { class: "hafl-plus pst-right_bot item_top wow bounceInScale" })
                    ])
                  ])
                ]),
                createVNode("span", { class: "br-line" })
              ]),
              testimonials.value.length ? (openBlock(), createBlock("section", {
                key: 1,
                class: "section-testimonial tes-2 flat-spacing-3"
              }, [
                createVNode("div", { class: "sect-main" }, [
                  createVNode("div", { class: "s-img_item wow bounceInScale" }, [
                    createVNode("img", {
                      class: "lazyload img-2",
                      src: asset_path.value + "qore/images/section/color-bg.webp",
                      "data-src": asset_path.value + "qore/images/section/color-bg.webp",
                      alt: trans("Testimonials")
                    }, null, 8, ["src", "data-src", "alt"])
                  ]),
                  createVNode("div", { class: "container" }, [
                    createVNode("div", { class: "sect-title wow fadeInUp pt-0" }, [
                      createVNode("h2", { class: "s-title font-3 m-0" }, toDisplayString(trans("What Our Clients Say")), 1)
                    ]),
                    createVNode("div", { class: "testimonial-slide-wrap pb-0" }, [
                      createVNode("div", { class: "overflow-hidden has-overlay_linear type-2 mx-1" }, [
                        createVNode("div", { class: "infiniteSlide infiniteSlide-tes" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(testimonials.value, (testimonial) => {
                            return openBlock(), createBlock("div", {
                              key: "tes-a-" + testimonial.id,
                              class: "wg-testimonial"
                            }, [
                              createVNode("div", { class: "tes-author" }, [
                                createVNode("div", { class: "author_image" }, [
                                  createVNode("img", {
                                    src: testimonial.avatar_link,
                                    alt: translateField(testimonial.name)
                                  }, null, 8, ["src", "alt"])
                                ]),
                                createVNode("div", { class: "author_info" }, [
                                  createVNode("span", { class: "link name" }, toDisplayString(translateField(testimonial.name)), 1),
                                  createVNode("p", { class: "text-body-3" }, toDisplayString(translateField(testimonial.position)), 1)
                                ])
                              ]),
                              createVNode("p", { class: "tes-text" }, toDisplayString(translateField(testimonial.quote)), 1)
                            ]);
                          }), 128))
                        ]),
                        createVNode("div", {
                          class: "infiniteSlide infiniteSlide-tes mb-0",
                          "data-style": "right"
                        }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(reversedTestimonials.value, (testimonial) => {
                            return openBlock(), createBlock("div", {
                              key: "tes-b-" + testimonial.id,
                              class: "wg-testimonial"
                            }, [
                              createVNode("div", { class: "tes-author" }, [
                                createVNode("div", { class: "author_image" }, [
                                  createVNode("img", {
                                    src: testimonial.avatar_link,
                                    alt: translateField(testimonial.name)
                                  }, null, 8, ["src", "alt"])
                                ]),
                                createVNode("div", { class: "author_info" }, [
                                  createVNode("span", { class: "link name" }, toDisplayString(translateField(testimonial.name)), 1),
                                  createVNode("p", { class: "text-body-3" }, toDisplayString(translateField(testimonial.position)), 1)
                                ])
                              ]),
                              createVNode("p", { class: "tes-text" }, toDisplayString(translateField(testimonial.quote)), 1)
                            ]);
                          }), 128))
                        ])
                      ])
                    ])
                  ])
                ])
              ])) : createCommentVNode("", true),
              testimonials.value.length && clients.value.length ? (openBlock(), createBlock("div", {
                key: 2,
                class: "section-break"
              }, [
                createVNode("div", { class: "position-relative z-5" }, [
                  createVNode("div", { class: "container" }, [
                    createVNode("div", { class: "has-hafl_plus" }, [
                      createVNode("span", { class: "hafl-plus pst-left_bot item_bot wow bounceInScale" }),
                      createVNode("span", { class: "hafl-plus pst-right_bot item_bot wow bounceInScale" })
                    ])
                  ])
                ]),
                createVNode("span", { class: "br-line" }),
                createVNode(_sfc_main$T),
                createVNode("div", { class: "position-relative z-5" }, [
                  createVNode("div", { class: "container" }, [
                    createVNode("div", { class: "has-hafl_plus" }, [
                      createVNode("span", { class: "hafl-plus pst-left_bot item_top wow bounceInScale" }),
                      createVNode("span", { class: "hafl-plus pst-right_bot item_top wow bounceInScale" })
                    ])
                  ])
                ]),
                createVNode("span", { class: "br-line" })
              ])) : createCommentVNode("", true),
              clients.value.length ? (openBlock(), createBlock("div", {
                key: 3,
                class: "tf-brand"
              }, [
                createVNode("div", { class: "container" }, [
                  createVNode("div", { class: "tf-brand_inner" }, [
                    createVNode("h5", { class: "title text-caption font-2 letter-space-0 fw-normal wow fadeInUp" }, toDisplayString(trans("Trusted by companies we build with")), 1),
                    createVNode("div", {
                      class: "infiniteSlide infiniteSlide_brand",
                      "data-clone": "3"
                    }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(clients.value, (client) => {
                        return openBlock(), createBlock("div", {
                          key: client.id,
                          class: "image-brand"
                        }, [
                          createVNode("img", {
                            src: client.logo_link,
                            alt: client.name,
                            loading: "lazy"
                          }, null, 8, ["src", "alt"])
                        ]);
                      }), 128))
                    ]),
                    createVNode("span", { class: "hafl-plus pst-left_bot item_bot wow bounceInScale" }),
                    createVNode("span", { class: "hafl-plus pst-right_bot item_bot wow bounceInScale" })
                  ])
                ])
              ])) : createCommentVNode("", true),
              createVNode("div", { class: "section-break" }, [
                createVNode("div", { class: "position-relative z-5" }, [
                  createVNode("div", { class: "container" }, [
                    createVNode("div", { class: "has-hafl_plus" }, [
                      createVNode("span", { class: "hafl-plus pst-left_bot item_bot wow bounceInScale" }),
                      createVNode("span", { class: "hafl-plus pst-right_bot item_bot wow bounceInScale" })
                    ])
                  ])
                ]),
                createVNode("span", { class: "br-line" }),
                createVNode(_sfc_main$T),
                createVNode("div", { class: "position-relative z-5" }, [
                  createVNode("div", { class: "container" }, [
                    createVNode("div", { class: "has-hafl_plus" }, [
                      createVNode("span", { class: "hafl-plus pst-left_bot item_top wow bounceInScale" }),
                      createVNode("span", { class: "hafl-plus pst-right_bot item_top wow bounceInScale" })
                    ])
                  ])
                ]),
                createVNode("span", { class: "br-line" })
              ]),
              createVNode("section", { class: "section-image-text flat-spacing-3" }, [
                createVNode("div", { class: "container" }, [
                  createVNode("div", { class: "row" }, [
                    createVNode("div", { class: "col-lg-10 mx-auto" }, [
                      createVNode("div", { class: "px-16 px-xl-0" }, [
                        createVNode("div", { class: "banner-image-v01" }, [
                          createVNode("div", { class: "img-abs img-bg" }, [
                            createVNode("img", {
                              loading: "lazy",
                              width: "1078",
                              height: "369",
                              src: asset_path.value + "qore/images/item/item-bg-3.png",
                              alt: trans("Contact Us")
                            }, null, 8, ["src", "alt"])
                          ]),
                          createVNode("div", { class: "content" }, [
                            createVNode("h3", { class: "title text-linear font-3" }, toDisplayString(trans("To make requests for further information, contact us")), 1),
                            createVNode("p", { class: "sub-title" }, [
                              createTextVNode(toDisplayString(trans("Call Us For Any inquiry")) + " ", 1),
                              settings.value.phone ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                createVNode("br"),
                                createVNode("a", {
                                  dir: "ltr",
                                  href: `tel:${settings.value.phone}`
                                }, toDisplayString(settings.value.phone), 9, ["href"])
                              ], 64)) : createCommentVNode("", true)
                            ]),
                            createVNode(unref(Link), {
                              href: _ctx.route("contact-us"),
                              class: "tf-btn text-body-3 style-2 style-high-2 animate-btn animate-dark"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(trans("Get in Touch")), 1)
                              ]),
                              _: 1
                            }, 8, ["href"])
                          ]),
                          createVNode("div", { class: "image" }, [
                            createVNode("img", {
                              loading: "lazy",
                              width: "498",
                              height: "308",
                              src: asset_path.value + "qore/images/section/build-in/build-1.jpg",
                              alt: trans("Get in Touch")
                            }, null, 8, ["src", "alt"])
                          ])
                        ])
                      ])
                    ])
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$K = _sfc_main$K.setup;
_sfc_main$K.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("Modules/Cms/resources/assets/js/Pages/AboutUs.vue");
  return _sfc_setup$K ? _sfc_setup$K(props, ctx) : void 0;
};
const __vite_glob_0_3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$K
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$J = {
  __name: "CtaTwo",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const trans = (key) => page.props.translations[key] || key;
    const settings = computed(() => page.props.settings || {});
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "section-inner-cta" }, _attrs))}><span class="br-line"></span><div class="sect-main"><div class="container"><div class="sect-title wow fadeInUp"><h2 class="s-title font-3">${ssrInterpolate(trans("Are you ready to take your project to the next stage?"))}</h2><p class="s-sub_title">${ssrInterpolate(trans("Professional technical support and immediate solutions for your project to ensure the uninterrupted continuity of your business."))}</p>`);
      _push(ssrRenderComponent(unref(Link), {
        href: _ctx.route("contact-us"),
        class: "tf-btn style-2 style-high animate-btn animate-dark"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(trans("Book your free consultation"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(trans("Book your free consultation")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      if (settings.value.email) {
        _push(`<p class="text-body-3 mt-3"><a${ssrRenderAttr("href", `mailto:${settings.value.email}`)}>${ssrInterpolate(settings.value.email)}</a>`);
        if (settings.value.phone) {
          _push(`<span> · <a${ssrRenderAttr("href", `tel:${settings.value.phone}`)}>${ssrInterpolate(settings.value.phone)}</a></span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div><span class="br-line"></span></section>`);
    };
  }
};
const _sfc_setup$J = _sfc_main$J.setup;
_sfc_main$J.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/CtaTwo.vue");
  return _sfc_setup$J ? _sfc_setup$J(props, ctx) : void 0;
};
const __default__$9 = {
  components: {
    AppLayout: _sfc_main$R,
    BlogCard: _sfc_main$Q,
    CtaTwo: _sfc_main$J
  }
};
const _sfc_main$I = /* @__PURE__ */ Object.assign(__default__$9, {
  __name: "BlogIndex",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const trans = (key) => page.props.translations[key] || key;
    const seo = computed(() => page.props.seo || {});
    const settings = computed(() => page.props.settings || {});
    const locale = computed(() => page.props.locale || "en");
    const categories = computed(() => page.props.categories || []);
    const recentPosts = computed(() => page.props.recentPosts || []);
    const filters = computed(() => page.props.filters || {});
    const meta = computed(() => page.props.meta || {});
    const searchQuery = ref(filters.value.search || "");
    const blogs = computed(() => {
      const source = page.props.blogs || { data: [], links: [], last_page: 1 };
      const data = Array.isArray(source.data) ? source.data.filter((blog) => blog && blog.id) : [];
      return {
        ...source,
        data
      };
    });
    const totalBlogsCount = computed(() => {
      const fromCategories = categories.value.reduce((sum, category) => sum + (category.blogs_count || 0), 0);
      if (fromCategories > 0) {
        return fromCategories;
      }
      return blogs.value.total || blogs.value.data.length || 0;
    });
    const siteName = computed(() => seo.value.website_name || page.props.appName || "Symfonix");
    const metaTitle = computed(() => meta.value.title || `${trans("Blogs")} | ${siteName.value}`);
    const metaDescription = computed(() => {
      return meta.value.description || trans("Explore our latest blogs, insights, and technology updates.") || seo.value.website_desc || "";
    });
    const metaKeywords = computed(() => {
      return meta.value.keywords || trans("blogs, news, insights, technology trends") || seo.value.website_keywords || "";
    });
    const metaImage = computed(() => {
      var _a, _b, _c, _d, _e;
      return ((_b = (_a = meta.value) == null ? void 0 : _a.og) == null ? void 0 : _b.image) || ((_d = (_c = meta.value) == null ? void 0 : _c.twitter) == null ? void 0 : _d.image) || ((_e = settings.value) == null ? void 0 : _e.meta_img) || "";
    });
    const metaCanonical = computed(() => meta.value.canonical || "");
    const metaRobots = computed(() => meta.value.robots || "index, follow");
    const postUrl = (post) => {
      if (!(post == null ? void 0 : post.slug)) {
        return "#";
      }
      try {
        return route("blogs.show", post.slug);
      } catch (e2) {
        return "#";
      }
    };
    const categoryUrl = (slug = null) => {
      const params = {};
      if (slug) {
        params.category = slug;
      }
      if (searchQuery.value) {
        params.search = searchQuery.value;
      }
      try {
        return route("blogs.index", params);
      } catch (e2) {
        return "/blogs";
      }
    };
    const submitSearch = () => {
      var _a;
      const params = {};
      if ((_a = searchQuery.value) == null ? void 0 : _a.trim()) {
        params.search = searchQuery.value.trim();
      }
      if (filters.value.category) {
        params.category = filters.value.category;
      }
      router.get(route("blogs.index"), params, {
        preserveState: true,
        preserveScroll: true
      });
    };
    const stripPaginationLabel = (label) => String(label || "").replace(/<[^>]*>/g, "").trim();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), null, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<title data-v-989ded8a${_scopeId}>${ssrInterpolate(metaTitle.value)}</title><meta name="description"${ssrRenderAttr("content", metaDescription.value)} data-v-989ded8a${_scopeId}><meta name="keywords"${ssrRenderAttr("content", metaKeywords.value)} data-v-989ded8a${_scopeId}><meta name="robots"${ssrRenderAttr("content", metaRobots.value)} data-v-989ded8a${_scopeId}>`);
            if (metaCanonical.value) {
              _push2(`<link rel="canonical"${ssrRenderAttr("href", metaCanonical.value)} data-v-989ded8a${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<meta property="og:title"${ssrRenderAttr("content", metaTitle.value)} data-v-989ded8a${_scopeId}><meta property="og:description"${ssrRenderAttr("content", metaDescription.value)} data-v-989ded8a${_scopeId}>`);
            if (metaImage.value) {
              _push2(`<meta property="og:image"${ssrRenderAttr("content", metaImage.value)} data-v-989ded8a${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            if (metaCanonical.value) {
              _push2(`<meta property="og:url"${ssrRenderAttr("content", metaCanonical.value)} data-v-989ded8a${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<meta property="og:type" content="website" data-v-989ded8a${_scopeId}><meta name="twitter:card" content="summary_large_image" data-v-989ded8a${_scopeId}><meta name="twitter:title"${ssrRenderAttr("content", metaTitle.value)} data-v-989ded8a${_scopeId}><meta name="twitter:description"${ssrRenderAttr("content", metaDescription.value)} data-v-989ded8a${_scopeId}>`);
            if (metaImage.value) {
              _push2(`<meta name="twitter:image"${ssrRenderAttr("content", metaImage.value)} data-v-989ded8a${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("title", null, toDisplayString(metaTitle.value), 1),
              createVNode("meta", {
                name: "description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "keywords",
                content: metaKeywords.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "robots",
                content: metaRobots.value
              }, null, 8, ["content"]),
              metaCanonical.value ? (openBlock(), createBlock("link", {
                key: 0,
                rel: "canonical",
                href: metaCanonical.value
              }, null, 8, ["href"])) : createCommentVNode("", true),
              createVNode("meta", {
                property: "og:title",
                content: metaTitle.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              metaImage.value ? (openBlock(), createBlock("meta", {
                key: 1,
                property: "og:image",
                content: metaImage.value
              }, null, 8, ["content"])) : createCommentVNode("", true),
              metaCanonical.value ? (openBlock(), createBlock("meta", {
                key: 2,
                property: "og:url",
                content: metaCanonical.value
              }, null, 8, ["content"])) : createCommentVNode("", true),
              createVNode("meta", {
                property: "og:type",
                content: "website"
              }),
              createVNode("meta", {
                name: "twitter:card",
                content: "summary_large_image"
              }),
              createVNode("meta", {
                name: "twitter:title",
                content: metaTitle.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "twitter:description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              metaImage.value ? (openBlock(), createBlock("meta", {
                key: 3,
                name: "twitter:image",
                content: metaImage.value
              }, null, 8, ["content"])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$R, null, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$N, {
              title: trans("Our Blogs")
            }, null, _parent2, _scopeId));
            _push2(`<section class="section-page-blog flat-spacing-2" data-v-989ded8a${_scopeId}><div class="container" data-v-989ded8a${_scopeId}><div class="content-1200" data-v-989ded8a${_scopeId}><div class="sect-title wow fadeInUp" data-v-989ded8a${_scopeId}><h2 class="s-title font-3" data-v-989ded8a${_scopeId}>${ssrInterpolate(trans("How We've Empowered Businesses with Innovative Tech Solutions"))}</h2><p class="s-sub_title" data-v-989ded8a${_scopeId}>${ssrInterpolate(trans("Explore our latest blogs, insights, and technology updates."))}</p></div><div class="page-blog_content" data-v-989ded8a${_scopeId}><div class="col-left" data-v-989ded8a${_scopeId}>`);
            if (blogs.value.data.length) {
              _push2(`<div class="blog-list" data-v-989ded8a${_scopeId}><!--[-->`);
              ssrRenderList(blogs.value.data, (blog) => {
                _push2(ssrRenderComponent(_sfc_main$Q, {
                  key: blog.id,
                  blog,
                  locale: locale.value
                }, null, _parent2, _scopeId));
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<div class="blog-index__empty" data-v-989ded8a${_scopeId}><h3 class="s-title font-3 h4" data-v-989ded8a${_scopeId}>${ssrInterpolate(trans("No blogs found"))}</h3><p class="s-sub_title" data-v-989ded8a${_scopeId}>${ssrInterpolate(trans("Check back soon — we are adding new articles."))}</p>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: _ctx.route("blogs.index"),
                class: "tf-btn animate-btn mt-3"
              }, {
                default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(trans("All Blogs"))}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(trans("All Blogs")), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            }
            if (blogs.value.last_page > 1) {
              _push2(`<div class="pagination-list blog-index__pagination" data-v-989ded8a${_scopeId}>`);
              if (blogs.value.prev_page_url) {
                _push2(ssrRenderComponent(unref(Link), {
                  href: blogs.value.prev_page_url,
                  class: "pagination-item pagination-item--prev",
                  "aria-label": "Previous"
                }, {
                  default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<span class="icon icon-CaretDoubleRight fs-20" data-v-989ded8a${_scopeId2}></span>`);
                    } else {
                      return [
                        createVNode("span", { class: "icon icon-CaretDoubleRight fs-20" })
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`<!--[-->`);
              ssrRenderList(blogs.value.links, (link, linkIndex) => {
                _push2(`<!--[-->`);
                if (link.url && linkIndex > 0 && linkIndex < blogs.value.links.length - 1) {
                  _push2(ssrRenderComponent(unref(Link), {
                    href: link.url,
                    class: ["pagination-item", { active: link.active }]
                  }, {
                    default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`<span data-v-989ded8a${_scopeId2}>${ssrInterpolate(stripPaginationLabel(link.label))}</span>`);
                      } else {
                        return [
                          createVNode("span", null, toDisplayString(stripPaginationLabel(link.label)), 1)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<!--]-->`);
              });
              _push2(`<!--]-->`);
              if (blogs.value.next_page_url) {
                _push2(ssrRenderComponent(unref(Link), {
                  href: blogs.value.next_page_url,
                  class: "pagination-item",
                  "aria-label": "Next"
                }, {
                  default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<span class="icon icon-CaretDoubleRight fs-20" data-v-989ded8a${_scopeId2}></span>`);
                    } else {
                      return [
                        createVNode("span", { class: "icon icon-CaretDoubleRight fs-20" })
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><aside class="col-right" data-v-989ded8a${_scopeId}><div class="blog-sidebar sidebar-content-wrap" data-v-989ded8a${_scopeId}><div class="sidebar-item" data-v-989ded8a${_scopeId}><h5 class="sb-title font-3 text-linear" data-v-989ded8a${_scopeId}>${ssrInterpolate(trans("Search"))}</h5><div class="br-line has-dot" data-v-989ded8a${_scopeId}></div><form class="form-search" data-v-989ded8a${_scopeId}><input${ssrRenderAttr("value", searchQuery.value)} class="style-large type-radius-2" type="search"${ssrRenderAttr("placeholder", trans("Search blog..."))} data-v-989ded8a${_scopeId}><button type="submit" class="btn_submit tf-btn text-body-3 style-2 animate-btn animate-dark"${ssrRenderAttr("aria-label", trans("Search"))} data-v-989ded8a${_scopeId}><i class="icon icon-MagnifyingGlass" data-v-989ded8a${_scopeId}></i></button></form></div><div class="sidebar-item" data-v-989ded8a${_scopeId}><h5 class="sb-title font-3 text-linear" data-v-989ded8a${_scopeId}>${ssrInterpolate(trans("Category"))}</h5><div class="br-line has-dot" data-v-989ded8a${_scopeId}></div><ul class="sb-category" data-v-989ded8a${_scopeId}><li data-v-989ded8a${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: categoryUrl(),
              class: { active: !filters.value.category }
            }, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span data-v-989ded8a${_scopeId2}>${ssrInterpolate(trans("All Blogs"))} (${ssrInterpolate(totalBlogsCount.value)})</span><i class="icon icon-ArrowUpRight" data-v-989ded8a${_scopeId2}></i>`);
                } else {
                  return [
                    createVNode("span", null, toDisplayString(trans("All Blogs")) + " (" + toDisplayString(totalBlogsCount.value) + ")", 1),
                    createVNode("i", { class: "icon icon-ArrowUpRight" })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</li><!--[-->`);
            ssrRenderList(categories.value, (category) => {
              _push2(`<li data-v-989ded8a${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: categoryUrl(category.slug),
                class: { active: filters.value.category === category.slug }
              }, {
                default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span data-v-989ded8a${_scopeId2}>${ssrInterpolate(category.name)} (${ssrInterpolate(category.blogs_count || 0)})</span><i class="icon icon-ArrowUpRight" data-v-989ded8a${_scopeId2}></i>`);
                  } else {
                    return [
                      createVNode("span", null, toDisplayString(category.name) + " (" + toDisplayString(category.blogs_count || 0) + ")", 1),
                      createVNode("i", { class: "icon icon-ArrowUpRight" })
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`</li>`);
            });
            _push2(`<!--]--></ul></div>`);
            if (recentPosts.value.length) {
              _push2(`<div class="sidebar-item" data-v-989ded8a${_scopeId}><h5 class="sb-title font-3 text-linear" data-v-989ded8a${_scopeId}>${ssrInterpolate(trans("Recent posts"))}</h5><div class="br-line has-dot" data-v-989ded8a${_scopeId}></div><ul class="sb-recent" data-v-989ded8a${_scopeId}><!--[-->`);
              ssrRenderList(recentPosts.value, (post) => {
                _push2(`<li class="sb-recent_item hover-img" data-v-989ded8a${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Link), {
                  href: postUrl(post),
                  class: "recent__image img-style"
                }, {
                  default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      if (post.image_link) {
                        _push3(`<img${ssrRenderAttr("src", post.image_link)}${ssrRenderAttr("alt", post.title)} width="94" height="94" loading="lazy" data-v-989ded8a${_scopeId2}>`);
                      } else {
                        _push3(`<!---->`);
                      }
                    } else {
                      return [
                        post.image_link ? (openBlock(), createBlock("img", {
                          key: 0,
                          src: post.image_link,
                          alt: post.title,
                          width: "94",
                          height: "94",
                          loading: "lazy"
                        }, null, 8, ["src", "alt"])) : createCommentVNode("", true)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`<div class="recent__content" data-v-989ded8a${_scopeId}>`);
                if (post.created_at) {
                  _push2(`<div class="entry_date" data-v-989ded8a${_scopeId}><i class="icon icon-Clock" data-v-989ded8a${_scopeId}></i><span class="date text-body-3" data-v-989ded8a${_scopeId}>${ssrInterpolate(post.created_at)}</span></div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(ssrRenderComponent(unref(Link), {
                  href: postUrl(post),
                  class: "entry_name link"
                }, {
                  default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(post.title)}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(post.title), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`</div></li>`);
              });
              _push2(`<!--]--></ul></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></aside></div></div></div></section>`);
            _push2(ssrRenderComponent(_sfc_main$J, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$N, {
                title: trans("Our Blogs")
              }, null, 8, ["title"]),
              createVNode("section", { class: "section-page-blog flat-spacing-2" }, [
                createVNode("div", { class: "container" }, [
                  createVNode("div", { class: "content-1200" }, [
                    createVNode("div", { class: "sect-title wow fadeInUp" }, [
                      createVNode("h2", { class: "s-title font-3" }, toDisplayString(trans("How We've Empowered Businesses with Innovative Tech Solutions")), 1),
                      createVNode("p", { class: "s-sub_title" }, toDisplayString(trans("Explore our latest blogs, insights, and technology updates.")), 1)
                    ]),
                    createVNode("div", { class: "page-blog_content" }, [
                      createVNode("div", { class: "col-left" }, [
                        blogs.value.data.length ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "blog-list"
                        }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(blogs.value.data, (blog) => {
                            return openBlock(), createBlock(_sfc_main$Q, {
                              key: blog.id,
                              blog,
                              locale: locale.value
                            }, null, 8, ["blog", "locale"]);
                          }), 128))
                        ])) : (openBlock(), createBlock("div", {
                          key: 1,
                          class: "blog-index__empty"
                        }, [
                          createVNode("h3", { class: "s-title font-3 h4" }, toDisplayString(trans("No blogs found")), 1),
                          createVNode("p", { class: "s-sub_title" }, toDisplayString(trans("Check back soon — we are adding new articles.")), 1),
                          createVNode(unref(Link), {
                            href: _ctx.route("blogs.index"),
                            class: "tf-btn animate-btn mt-3"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(trans("All Blogs")), 1)
                            ]),
                            _: 1
                          }, 8, ["href"])
                        ])),
                        blogs.value.last_page > 1 ? (openBlock(), createBlock("div", {
                          key: 2,
                          class: "pagination-list blog-index__pagination"
                        }, [
                          blogs.value.prev_page_url ? (openBlock(), createBlock(unref(Link), {
                            key: 0,
                            href: blogs.value.prev_page_url,
                            class: "pagination-item pagination-item--prev",
                            "aria-label": "Previous"
                          }, {
                            default: withCtx(() => [
                              createVNode("span", { class: "icon icon-CaretDoubleRight fs-20" })
                            ]),
                            _: 1
                          }, 8, ["href"])) : createCommentVNode("", true),
                          (openBlock(true), createBlock(Fragment, null, renderList(blogs.value.links, (link, linkIndex) => {
                            return openBlock(), createBlock(Fragment, { key: linkIndex }, [
                              link.url && linkIndex > 0 && linkIndex < blogs.value.links.length - 1 ? (openBlock(), createBlock(unref(Link), {
                                key: 0,
                                href: link.url,
                                class: ["pagination-item", { active: link.active }]
                              }, {
                                default: withCtx(() => [
                                  createVNode("span", null, toDisplayString(stripPaginationLabel(link.label)), 1)
                                ]),
                                _: 2
                              }, 1032, ["href", "class"])) : createCommentVNode("", true)
                            ], 64);
                          }), 128)),
                          blogs.value.next_page_url ? (openBlock(), createBlock(unref(Link), {
                            key: 1,
                            href: blogs.value.next_page_url,
                            class: "pagination-item",
                            "aria-label": "Next"
                          }, {
                            default: withCtx(() => [
                              createVNode("span", { class: "icon icon-CaretDoubleRight fs-20" })
                            ]),
                            _: 1
                          }, 8, ["href"])) : createCommentVNode("", true)
                        ])) : createCommentVNode("", true)
                      ]),
                      createVNode("aside", { class: "col-right" }, [
                        createVNode("div", { class: "blog-sidebar sidebar-content-wrap" }, [
                          createVNode("div", { class: "sidebar-item" }, [
                            createVNode("h5", { class: "sb-title font-3 text-linear" }, toDisplayString(trans("Search")), 1),
                            createVNode("div", { class: "br-line has-dot" }),
                            createVNode("form", {
                              class: "form-search",
                              onSubmit: withModifiers(submitSearch, ["prevent"])
                            }, [
                              withDirectives(createVNode("input", {
                                "onUpdate:modelValue": ($event) => searchQuery.value = $event,
                                class: "style-large type-radius-2",
                                type: "search",
                                placeholder: trans("Search blog...")
                              }, null, 8, ["onUpdate:modelValue", "placeholder"]), [
                                [vModelText, searchQuery.value]
                              ]),
                              createVNode("button", {
                                type: "submit",
                                class: "btn_submit tf-btn text-body-3 style-2 animate-btn animate-dark",
                                "aria-label": trans("Search")
                              }, [
                                createVNode("i", { class: "icon icon-MagnifyingGlass" })
                              ], 8, ["aria-label"])
                            ], 32)
                          ]),
                          createVNode("div", { class: "sidebar-item" }, [
                            createVNode("h5", { class: "sb-title font-3 text-linear" }, toDisplayString(trans("Category")), 1),
                            createVNode("div", { class: "br-line has-dot" }),
                            createVNode("ul", { class: "sb-category" }, [
                              createVNode("li", null, [
                                createVNode(unref(Link), {
                                  href: categoryUrl(),
                                  class: { active: !filters.value.category }
                                }, {
                                  default: withCtx(() => [
                                    createVNode("span", null, toDisplayString(trans("All Blogs")) + " (" + toDisplayString(totalBlogsCount.value) + ")", 1),
                                    createVNode("i", { class: "icon icon-ArrowUpRight" })
                                  ]),
                                  _: 1
                                }, 8, ["href", "class"])
                              ]),
                              (openBlock(true), createBlock(Fragment, null, renderList(categories.value, (category) => {
                                return openBlock(), createBlock("li", {
                                  key: category.id
                                }, [
                                  createVNode(unref(Link), {
                                    href: categoryUrl(category.slug),
                                    class: { active: filters.value.category === category.slug }
                                  }, {
                                    default: withCtx(() => [
                                      createVNode("span", null, toDisplayString(category.name) + " (" + toDisplayString(category.blogs_count || 0) + ")", 1),
                                      createVNode("i", { class: "icon icon-ArrowUpRight" })
                                    ]),
                                    _: 2
                                  }, 1032, ["href", "class"])
                                ]);
                              }), 128))
                            ])
                          ]),
                          recentPosts.value.length ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "sidebar-item"
                          }, [
                            createVNode("h5", { class: "sb-title font-3 text-linear" }, toDisplayString(trans("Recent posts")), 1),
                            createVNode("div", { class: "br-line has-dot" }),
                            createVNode("ul", { class: "sb-recent" }, [
                              (openBlock(true), createBlock(Fragment, null, renderList(recentPosts.value, (post) => {
                                return openBlock(), createBlock("li", {
                                  key: post.id,
                                  class: "sb-recent_item hover-img"
                                }, [
                                  createVNode(unref(Link), {
                                    href: postUrl(post),
                                    class: "recent__image img-style"
                                  }, {
                                    default: withCtx(() => [
                                      post.image_link ? (openBlock(), createBlock("img", {
                                        key: 0,
                                        src: post.image_link,
                                        alt: post.title,
                                        width: "94",
                                        height: "94",
                                        loading: "lazy"
                                      }, null, 8, ["src", "alt"])) : createCommentVNode("", true)
                                    ]),
                                    _: 2
                                  }, 1032, ["href"]),
                                  createVNode("div", { class: "recent__content" }, [
                                    post.created_at ? (openBlock(), createBlock("div", {
                                      key: 0,
                                      class: "entry_date"
                                    }, [
                                      createVNode("i", { class: "icon icon-Clock" }),
                                      createVNode("span", { class: "date text-body-3" }, toDisplayString(post.created_at), 1)
                                    ])) : createCommentVNode("", true),
                                    createVNode(unref(Link), {
                                      href: postUrl(post),
                                      class: "entry_name link"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(post.title), 1)
                                      ]),
                                      _: 2
                                    }, 1032, ["href"])
                                  ])
                                ]);
                              }), 128))
                            ])
                          ])) : createCommentVNode("", true)
                        ])
                      ])
                    ])
                  ])
                ])
              ]),
              createVNode(_sfc_main$J)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$I = _sfc_main$I.setup;
_sfc_main$I.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("Modules/Cms/resources/assets/js/Pages/BlogIndex.vue");
  return _sfc_setup$I ? _sfc_setup$I(props, ctx) : void 0;
};
const BlogIndex = /* @__PURE__ */ _export_sfc(_sfc_main$I, [["__scopeId", "data-v-989ded8a"]]);
const __vite_glob_0_4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: BlogIndex
}, Symbol.toStringTag, { value: "Module" }));
const __default__$8 = {
  components: {
    AppLayout: _sfc_main$R,
    BlogCard: _sfc_main$Q,
    CtaTwo: _sfc_main$J
  }
};
const _sfc_main$H = /* @__PURE__ */ Object.assign(__default__$8, {
  __name: "BlogShow",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const trans = (key) => page.props.translations[key] || key;
    const locale = computed(() => page.props.locale || "en");
    const blog = computed(() => page.props.blog || {});
    const relatedBlogs = computed(() => page.props.relatedBlogs || []);
    const categories = computed(() => page.props.categories || []);
    const recentPosts = computed(() => page.props.recentPosts || []);
    const previousPost = computed(() => page.props.previousPost);
    const nextPost = computed(() => page.props.nextPost);
    const meta = computed(() => page.props.meta || {});
    const seo = computed(() => page.props.seo || {});
    const settings = computed(() => page.props.settings || {});
    const metaTitle = computed(() => {
      var _a;
      return meta.value.title || ((_a = blog.value) == null ? void 0 : _a.title) || "";
    });
    const metaDescription = computed(() => {
      var _a;
      return meta.value.description || ((_a = blog.value) == null ? void 0 : _a.description) || seo.value.website_desc || "";
    });
    const metaKeywords = computed(() => {
      var _a;
      return meta.value.keywords || ((_a = blog.value) == null ? void 0 : _a.keywords) || seo.value.website_keywords || "";
    });
    const metaImage = computed(() => {
      var _a, _b, _c, _d;
      return ((_b = (_a = meta.value) == null ? void 0 : _a.og) == null ? void 0 : _b.image) || ((_c = blog.value) == null ? void 0 : _c.image_link) || ((_d = settings.value) == null ? void 0 : _d.meta_img) || "";
    });
    const metaCanonical = computed(() => meta.value.canonical || "");
    const metaRobots = computed(() => meta.value.robots || "index, follow");
    const searchQuery = ref("");
    const keywords = computed(() => {
      var _a;
      const raw = (_a = blog.value) == null ? void 0 : _a.keywords;
      if (!raw) {
        return [];
      }
      if (typeof raw === "string") {
        return raw.split(",").map((item) => item.trim()).filter(Boolean).slice(0, 6);
      }
      if (Array.isArray(raw)) {
        return raw.map((item) => String(item).trim()).filter(Boolean).slice(0, 6);
      }
      return [];
    });
    const getShareUrl = (platform) => {
      const url = encodeURIComponent(typeof window !== "undefined" ? window.location.href : "");
      const title = encodeURIComponent(blog.value.title || "");
      switch (platform) {
        case "twitter":
          return `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        case "facebook":
          return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        case "linkedin":
          return `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`;
        default:
          return "#";
      }
    };
    const handleSearch = () => {
      var _a;
      if ((_a = searchQuery.value) == null ? void 0 : _a.trim()) {
        router.get(route("blogs.index"), { search: searchQuery.value.trim() });
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), null, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<title data-v-2672a923${_scopeId}>${ssrInterpolate(metaTitle.value)}</title><meta name="description"${ssrRenderAttr("content", metaDescription.value)} data-v-2672a923${_scopeId}><meta name="keywords"${ssrRenderAttr("content", metaKeywords.value)} data-v-2672a923${_scopeId}><meta name="robots"${ssrRenderAttr("content", metaRobots.value)} data-v-2672a923${_scopeId}>`);
            if (metaCanonical.value) {
              _push2(`<link rel="canonical"${ssrRenderAttr("href", metaCanonical.value)} data-v-2672a923${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<meta property="og:title"${ssrRenderAttr("content", metaTitle.value)} data-v-2672a923${_scopeId}><meta property="og:description"${ssrRenderAttr("content", metaDescription.value)} data-v-2672a923${_scopeId}>`);
            if (metaImage.value) {
              _push2(`<meta property="og:image"${ssrRenderAttr("content", metaImage.value)} data-v-2672a923${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            if (metaCanonical.value) {
              _push2(`<meta property="og:url"${ssrRenderAttr("content", metaCanonical.value)} data-v-2672a923${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<meta property="og:type" content="article" data-v-2672a923${_scopeId}><meta name="twitter:card" content="summary_large_image" data-v-2672a923${_scopeId}><meta name="twitter:title"${ssrRenderAttr("content", metaTitle.value)} data-v-2672a923${_scopeId}><meta name="twitter:description"${ssrRenderAttr("content", metaDescription.value)} data-v-2672a923${_scopeId}>`);
            if (metaImage.value) {
              _push2(`<meta name="twitter:image"${ssrRenderAttr("content", metaImage.value)} data-v-2672a923${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("title", null, toDisplayString(metaTitle.value), 1),
              createVNode("meta", {
                name: "description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "keywords",
                content: metaKeywords.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "robots",
                content: metaRobots.value
              }, null, 8, ["content"]),
              metaCanonical.value ? (openBlock(), createBlock("link", {
                key: 0,
                rel: "canonical",
                href: metaCanonical.value
              }, null, 8, ["href"])) : createCommentVNode("", true),
              createVNode("meta", {
                property: "og:title",
                content: metaTitle.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              metaImage.value ? (openBlock(), createBlock("meta", {
                key: 1,
                property: "og:image",
                content: metaImage.value
              }, null, 8, ["content"])) : createCommentVNode("", true),
              metaCanonical.value ? (openBlock(), createBlock("meta", {
                key: 2,
                property: "og:url",
                content: metaCanonical.value
              }, null, 8, ["content"])) : createCommentVNode("", true),
              createVNode("meta", {
                property: "og:type",
                content: "article"
              }),
              createVNode("meta", {
                name: "twitter:card",
                content: "summary_large_image"
              }),
              createVNode("meta", {
                name: "twitter:title",
                content: metaTitle.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "twitter:description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              metaImage.value ? (openBlock(), createBlock("meta", {
                key: 3,
                name: "twitter:image",
                content: metaImage.value
              }, null, 8, ["content"])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$R, null, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$N, {
              title: blog.value.title,
              crumbs: [
                { label: trans("Blogs"), href: _ctx.route("blogs.index") },
                { label: blog.value.title }
              ]
            }, null, _parent2, _scopeId));
            _push2(`<section class="section-page-blog flat-spacing-2" data-v-2672a923${_scopeId}><div class="container" data-v-2672a923${_scopeId}><div class="content-1200" data-v-2672a923${_scopeId}><div class="blog-detail_heading" data-v-2672a923${_scopeId}><h1 class="title_detail text-linear font-3" data-v-2672a923${_scopeId}>${ssrInterpolate(blog.value.title)}</h1><div class="br-line has-dot" data-v-2672a923${_scopeId}></div><div class="meta_detail" data-v-2672a923${_scopeId}>`);
            if (blog.value.created_at_formatted || blog.value.created_at) {
              _push2(`<div class="meta meta__date" data-v-2672a923${_scopeId}><i class="icon icon-Clock" data-v-2672a923${_scopeId}></i><span class="meta-text text-body-3" data-v-2672a923${_scopeId}>${ssrInterpolate(blog.value.created_at_formatted || blog.value.created_at)}</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (blog.value.reading_time) {
              _push2(`<div class="meta meta__date" data-v-2672a923${_scopeId}><i class="icon icon-Clock" data-v-2672a923${_scopeId}></i><span class="meta-text text-body-3" data-v-2672a923${_scopeId}>${ssrInterpolate(blog.value.reading_time)} ${ssrInterpolate(trans("min read"))}</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (blog.value.category) {
              _push2(`<div class="meta meta__tag" data-v-2672a923${_scopeId}><i class="icon icon-Tag" data-v-2672a923${_scopeId}></i><span class="meta-text text-body-3" data-v-2672a923${_scopeId}>${ssrInterpolate(blog.value.category.name)}</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><div class="page-blog_content detail" data-v-2672a923${_scopeId}><div class="col-left" data-v-2672a923${_scopeId}><article class="main-blog_detail" data-v-2672a923${_scopeId}>`);
            if (blog.value.description) {
              _push2(`<p class="detail_text text-main-2" data-v-2672a923${_scopeId}>${ssrInterpolate(blog.value.description)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            if (blog.value.image_link) {
              _push2(`<div class="detail_image" data-v-2672a923${_scopeId}><img${ssrRenderAttr("src", blog.value.image_link)}${ssrRenderAttr("alt", blog.value.title)} width="732" height="412" loading="lazy" decoding="async" data-v-2672a923${_scopeId}></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="blog-show__content detail_text text-main-6" data-v-2672a923${_scopeId}>${blog.value.content ?? ""}</div>`);
            if (keywords.value.length) {
              _push2(`<div class="detail_tag" data-v-2672a923${_scopeId}><div class="br-line has-dot" data-v-2672a923${_scopeId}></div><ul class="tag-list" data-v-2672a923${_scopeId}><li class="text-body-3 text-white" data-v-2672a923${_scopeId}>${ssrInterpolate(trans("Tags"))}:</li><!--[-->`);
              ssrRenderList(keywords.value, (keyword, index) => {
                _push2(`<li data-v-2672a923${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Link), {
                  href: _ctx.route("blogs.index", { search: keyword }),
                  class: "text-body-3 link"
                }, {
                  default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(keyword)}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(keyword), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`</li>`);
              });
              _push2(`<!--]--></ul></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="blog-show__share" data-v-2672a923${_scopeId}><span class="text-body-3 text-white" data-v-2672a923${_scopeId}>${ssrInterpolate(trans("Share On:"))}</span><div class="blog-show__share-links" data-v-2672a923${_scopeId}><a${ssrRenderAttr("href", getShareUrl("facebook"))} target="_blank" rel="noopener noreferrer" aria-label="Facebook" data-v-2672a923${_scopeId}><span class="icon icon-facebook" data-v-2672a923${_scopeId}></span></a><a${ssrRenderAttr("href", getShareUrl("twitter"))} target="_blank" rel="noopener noreferrer" aria-label="Twitter" data-v-2672a923${_scopeId}><i class="fab fa-twitter" data-v-2672a923${_scopeId}></i></a><a${ssrRenderAttr("href", getShareUrl("linkedin"))} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" data-v-2672a923${_scopeId}><span class="icon icon-linkedin" data-v-2672a923${_scopeId}></span></a></div></div></article>`);
            if (previousPost.value || nextPost.value) {
              _push2(`<div class="blog-show__nav" data-v-2672a923${_scopeId}>`);
              if (previousPost.value) {
                _push2(ssrRenderComponent(unref(Link), {
                  href: _ctx.route("blogs.show", previousPost.value.slug),
                  class: "blog-show__nav-item"
                }, {
                  default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<span class="text-body-3" data-v-2672a923${_scopeId2}>${ssrInterpolate(trans("Prev Blog"))}</span><strong class="link" data-v-2672a923${_scopeId2}>${ssrInterpolate(previousPost.value.title)}</strong>`);
                    } else {
                      return [
                        createVNode("span", { class: "text-body-3" }, toDisplayString(trans("Prev Blog")), 1),
                        createVNode("strong", { class: "link" }, toDisplayString(previousPost.value.title), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              if (nextPost.value) {
                _push2(ssrRenderComponent(unref(Link), {
                  href: _ctx.route("blogs.show", nextPost.value.slug),
                  class: "blog-show__nav-item blog-show__nav-item--next"
                }, {
                  default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<span class="text-body-3" data-v-2672a923${_scopeId2}>${ssrInterpolate(trans("Next Blog"))}</span><strong class="link" data-v-2672a923${_scopeId2}>${ssrInterpolate(nextPost.value.title)}</strong>`);
                    } else {
                      return [
                        createVNode("span", { class: "text-body-3" }, toDisplayString(trans("Next Blog")), 1),
                        createVNode("strong", { class: "link" }, toDisplayString(nextPost.value.title), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (relatedBlogs.value.length) {
              _push2(`<div class="blog-show__related" data-v-2672a923${_scopeId}><h4 class="title text-linear font-3" data-v-2672a923${_scopeId}>${ssrInterpolate(trans("Related Blogs"))}</h4><div class="blog-list" data-v-2672a923${_scopeId}><!--[-->`);
              ssrRenderList(relatedBlogs.value, (relatedBlog) => {
                _push2(ssrRenderComponent(_sfc_main$Q, {
                  key: relatedBlog.id,
                  blog: relatedBlog,
                  locale: locale.value
                }, null, _parent2, _scopeId));
              });
              _push2(`<!--]--></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><aside class="col-right" data-v-2672a923${_scopeId}><div class="blog-sidebar sidebar-content-wrap" data-v-2672a923${_scopeId}><div class="sidebar-item" data-v-2672a923${_scopeId}><h5 class="sb-title font-3 text-linear" data-v-2672a923${_scopeId}>${ssrInterpolate(trans("Search"))}</h5><div class="br-line has-dot" data-v-2672a923${_scopeId}></div><form class="form-search" data-v-2672a923${_scopeId}><input${ssrRenderAttr("value", searchQuery.value)} class="style-large type-radius-2" type="search"${ssrRenderAttr("placeholder", trans("Search blog..."))} data-v-2672a923${_scopeId}><button type="submit" class="btn_submit tf-btn text-body-3 style-2 animate-btn animate-dark"${ssrRenderAttr("aria-label", trans("Search"))} data-v-2672a923${_scopeId}><i class="icon icon-MagnifyingGlass" data-v-2672a923${_scopeId}></i></button></form></div><div class="sidebar-item" data-v-2672a923${_scopeId}><h5 class="sb-title font-3 text-linear" data-v-2672a923${_scopeId}>${ssrInterpolate(trans("Category"))}</h5><div class="br-line has-dot" data-v-2672a923${_scopeId}></div><ul class="sb-category" data-v-2672a923${_scopeId}><!--[-->`);
            ssrRenderList(categories.value, (category) => {
              _push2(`<li data-v-2672a923${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: _ctx.route("blogs.index", { category: category.slug })
              }, {
                default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span data-v-2672a923${_scopeId2}>${ssrInterpolate(category.name)} (${ssrInterpolate(category.blogs_count || 0)})</span><i class="icon icon-ArrowUpRight" data-v-2672a923${_scopeId2}></i>`);
                  } else {
                    return [
                      createVNode("span", null, toDisplayString(category.name) + " (" + toDisplayString(category.blogs_count || 0) + ")", 1),
                      createVNode("i", { class: "icon icon-ArrowUpRight" })
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`</li>`);
            });
            _push2(`<!--]--></ul></div>`);
            if (recentPosts.value.length) {
              _push2(`<div class="sidebar-item" data-v-2672a923${_scopeId}><h5 class="sb-title font-3 text-linear" data-v-2672a923${_scopeId}>${ssrInterpolate(trans("Recent posts"))}</h5><div class="br-line has-dot" data-v-2672a923${_scopeId}></div><ul class="sb-recent" data-v-2672a923${_scopeId}><!--[-->`);
              ssrRenderList(recentPosts.value, (post) => {
                _push2(`<li class="sb-recent_item hover-img" data-v-2672a923${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Link), {
                  href: _ctx.route("blogs.show", post.slug),
                  class: "recent__image img-style"
                }, {
                  default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      if (post.image_link) {
                        _push3(`<img${ssrRenderAttr("src", post.image_link)}${ssrRenderAttr("alt", post.title)} width="94" height="94" loading="lazy" data-v-2672a923${_scopeId2}>`);
                      } else {
                        _push3(`<!---->`);
                      }
                    } else {
                      return [
                        post.image_link ? (openBlock(), createBlock("img", {
                          key: 0,
                          src: post.image_link,
                          alt: post.title,
                          width: "94",
                          height: "94",
                          loading: "lazy"
                        }, null, 8, ["src", "alt"])) : createCommentVNode("", true)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`<div class="recent__content" data-v-2672a923${_scopeId}>`);
                if (post.created_at) {
                  _push2(`<div class="entry_date" data-v-2672a923${_scopeId}><i class="icon icon-Clock" data-v-2672a923${_scopeId}></i><span class="date text-body-3" data-v-2672a923${_scopeId}>${ssrInterpolate(post.created_at)}</span></div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(ssrRenderComponent(unref(Link), {
                  href: _ctx.route("blogs.show", post.slug),
                  class: "entry_name link"
                }, {
                  default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(post.title)}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(post.title), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`</div></li>`);
              });
              _push2(`<!--]--></ul></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></aside></div></div></div></section>`);
            _push2(ssrRenderComponent(_sfc_main$J, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$N, {
                title: blog.value.title,
                crumbs: [
                  { label: trans("Blogs"), href: _ctx.route("blogs.index") },
                  { label: blog.value.title }
                ]
              }, null, 8, ["title", "crumbs"]),
              createVNode("section", { class: "section-page-blog flat-spacing-2" }, [
                createVNode("div", { class: "container" }, [
                  createVNode("div", { class: "content-1200" }, [
                    createVNode("div", { class: "blog-detail_heading" }, [
                      createVNode("h1", { class: "title_detail text-linear font-3" }, toDisplayString(blog.value.title), 1),
                      createVNode("div", { class: "br-line has-dot" }),
                      createVNode("div", { class: "meta_detail" }, [
                        blog.value.created_at_formatted || blog.value.created_at ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "meta meta__date"
                        }, [
                          createVNode("i", { class: "icon icon-Clock" }),
                          createVNode("span", { class: "meta-text text-body-3" }, toDisplayString(blog.value.created_at_formatted || blog.value.created_at), 1)
                        ])) : createCommentVNode("", true),
                        blog.value.reading_time ? (openBlock(), createBlock("div", {
                          key: 1,
                          class: "meta meta__date"
                        }, [
                          createVNode("i", { class: "icon icon-Clock" }),
                          createVNode("span", { class: "meta-text text-body-3" }, toDisplayString(blog.value.reading_time) + " " + toDisplayString(trans("min read")), 1)
                        ])) : createCommentVNode("", true),
                        blog.value.category ? (openBlock(), createBlock("div", {
                          key: 2,
                          class: "meta meta__tag"
                        }, [
                          createVNode("i", { class: "icon icon-Tag" }),
                          createVNode("span", { class: "meta-text text-body-3" }, toDisplayString(blog.value.category.name), 1)
                        ])) : createCommentVNode("", true)
                      ])
                    ]),
                    createVNode("div", { class: "page-blog_content detail" }, [
                      createVNode("div", { class: "col-left" }, [
                        createVNode("article", { class: "main-blog_detail" }, [
                          blog.value.description ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "detail_text text-main-2"
                          }, toDisplayString(blog.value.description), 1)) : createCommentVNode("", true),
                          blog.value.image_link ? (openBlock(), createBlock("div", {
                            key: 1,
                            class: "detail_image"
                          }, [
                            createVNode("img", {
                              src: blog.value.image_link,
                              alt: blog.value.title,
                              width: "732",
                              height: "412",
                              loading: "lazy",
                              decoding: "async"
                            }, null, 8, ["src", "alt"])
                          ])) : createCommentVNode("", true),
                          createVNode("div", {
                            class: "blog-show__content detail_text text-main-6",
                            innerHTML: blog.value.content
                          }, null, 8, ["innerHTML"]),
                          keywords.value.length ? (openBlock(), createBlock("div", {
                            key: 2,
                            class: "detail_tag"
                          }, [
                            createVNode("div", { class: "br-line has-dot" }),
                            createVNode("ul", { class: "tag-list" }, [
                              createVNode("li", { class: "text-body-3 text-white" }, toDisplayString(trans("Tags")) + ":", 1),
                              (openBlock(true), createBlock(Fragment, null, renderList(keywords.value, (keyword, index) => {
                                return openBlock(), createBlock("li", { key: index }, [
                                  createVNode(unref(Link), {
                                    href: _ctx.route("blogs.index", { search: keyword }),
                                    class: "text-body-3 link"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(keyword), 1)
                                    ]),
                                    _: 2
                                  }, 1032, ["href"])
                                ]);
                              }), 128))
                            ])
                          ])) : createCommentVNode("", true),
                          createVNode("div", { class: "blog-show__share" }, [
                            createVNode("span", { class: "text-body-3 text-white" }, toDisplayString(trans("Share On:")), 1),
                            createVNode("div", { class: "blog-show__share-links" }, [
                              createVNode("a", {
                                href: getShareUrl("facebook"),
                                target: "_blank",
                                rel: "noopener noreferrer",
                                "aria-label": "Facebook"
                              }, [
                                createVNode("span", { class: "icon icon-facebook" })
                              ], 8, ["href"]),
                              createVNode("a", {
                                href: getShareUrl("twitter"),
                                target: "_blank",
                                rel: "noopener noreferrer",
                                "aria-label": "Twitter"
                              }, [
                                createVNode("i", { class: "fab fa-twitter" })
                              ], 8, ["href"]),
                              createVNode("a", {
                                href: getShareUrl("linkedin"),
                                target: "_blank",
                                rel: "noopener noreferrer",
                                "aria-label": "LinkedIn"
                              }, [
                                createVNode("span", { class: "icon icon-linkedin" })
                              ], 8, ["href"])
                            ])
                          ])
                        ]),
                        previousPost.value || nextPost.value ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "blog-show__nav"
                        }, [
                          previousPost.value ? (openBlock(), createBlock(unref(Link), {
                            key: 0,
                            href: _ctx.route("blogs.show", previousPost.value.slug),
                            class: "blog-show__nav-item"
                          }, {
                            default: withCtx(() => [
                              createVNode("span", { class: "text-body-3" }, toDisplayString(trans("Prev Blog")), 1),
                              createVNode("strong", { class: "link" }, toDisplayString(previousPost.value.title), 1)
                            ]),
                            _: 1
                          }, 8, ["href"])) : createCommentVNode("", true),
                          nextPost.value ? (openBlock(), createBlock(unref(Link), {
                            key: 1,
                            href: _ctx.route("blogs.show", nextPost.value.slug),
                            class: "blog-show__nav-item blog-show__nav-item--next"
                          }, {
                            default: withCtx(() => [
                              createVNode("span", { class: "text-body-3" }, toDisplayString(trans("Next Blog")), 1),
                              createVNode("strong", { class: "link" }, toDisplayString(nextPost.value.title), 1)
                            ]),
                            _: 1
                          }, 8, ["href"])) : createCommentVNode("", true)
                        ])) : createCommentVNode("", true),
                        relatedBlogs.value.length ? (openBlock(), createBlock("div", {
                          key: 1,
                          class: "blog-show__related"
                        }, [
                          createVNode("h4", { class: "title text-linear font-3" }, toDisplayString(trans("Related Blogs")), 1),
                          createVNode("div", { class: "blog-list" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(relatedBlogs.value, (relatedBlog) => {
                              return openBlock(), createBlock(_sfc_main$Q, {
                                key: relatedBlog.id,
                                blog: relatedBlog,
                                locale: locale.value
                              }, null, 8, ["blog", "locale"]);
                            }), 128))
                          ])
                        ])) : createCommentVNode("", true)
                      ]),
                      createVNode("aside", { class: "col-right" }, [
                        createVNode("div", { class: "blog-sidebar sidebar-content-wrap" }, [
                          createVNode("div", { class: "sidebar-item" }, [
                            createVNode("h5", { class: "sb-title font-3 text-linear" }, toDisplayString(trans("Search")), 1),
                            createVNode("div", { class: "br-line has-dot" }),
                            createVNode("form", {
                              class: "form-search",
                              onSubmit: withModifiers(handleSearch, ["prevent"])
                            }, [
                              withDirectives(createVNode("input", {
                                "onUpdate:modelValue": ($event) => searchQuery.value = $event,
                                class: "style-large type-radius-2",
                                type: "search",
                                placeholder: trans("Search blog...")
                              }, null, 8, ["onUpdate:modelValue", "placeholder"]), [
                                [vModelText, searchQuery.value]
                              ]),
                              createVNode("button", {
                                type: "submit",
                                class: "btn_submit tf-btn text-body-3 style-2 animate-btn animate-dark",
                                "aria-label": trans("Search")
                              }, [
                                createVNode("i", { class: "icon icon-MagnifyingGlass" })
                              ], 8, ["aria-label"])
                            ], 32)
                          ]),
                          createVNode("div", { class: "sidebar-item" }, [
                            createVNode("h5", { class: "sb-title font-3 text-linear" }, toDisplayString(trans("Category")), 1),
                            createVNode("div", { class: "br-line has-dot" }),
                            createVNode("ul", { class: "sb-category" }, [
                              (openBlock(true), createBlock(Fragment, null, renderList(categories.value, (category) => {
                                return openBlock(), createBlock("li", {
                                  key: category.id
                                }, [
                                  createVNode(unref(Link), {
                                    href: _ctx.route("blogs.index", { category: category.slug })
                                  }, {
                                    default: withCtx(() => [
                                      createVNode("span", null, toDisplayString(category.name) + " (" + toDisplayString(category.blogs_count || 0) + ")", 1),
                                      createVNode("i", { class: "icon icon-ArrowUpRight" })
                                    ]),
                                    _: 2
                                  }, 1032, ["href"])
                                ]);
                              }), 128))
                            ])
                          ]),
                          recentPosts.value.length ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "sidebar-item"
                          }, [
                            createVNode("h5", { class: "sb-title font-3 text-linear" }, toDisplayString(trans("Recent posts")), 1),
                            createVNode("div", { class: "br-line has-dot" }),
                            createVNode("ul", { class: "sb-recent" }, [
                              (openBlock(true), createBlock(Fragment, null, renderList(recentPosts.value, (post) => {
                                return openBlock(), createBlock("li", {
                                  key: post.id,
                                  class: "sb-recent_item hover-img"
                                }, [
                                  createVNode(unref(Link), {
                                    href: _ctx.route("blogs.show", post.slug),
                                    class: "recent__image img-style"
                                  }, {
                                    default: withCtx(() => [
                                      post.image_link ? (openBlock(), createBlock("img", {
                                        key: 0,
                                        src: post.image_link,
                                        alt: post.title,
                                        width: "94",
                                        height: "94",
                                        loading: "lazy"
                                      }, null, 8, ["src", "alt"])) : createCommentVNode("", true)
                                    ]),
                                    _: 2
                                  }, 1032, ["href"]),
                                  createVNode("div", { class: "recent__content" }, [
                                    post.created_at ? (openBlock(), createBlock("div", {
                                      key: 0,
                                      class: "entry_date"
                                    }, [
                                      createVNode("i", { class: "icon icon-Clock" }),
                                      createVNode("span", { class: "date text-body-3" }, toDisplayString(post.created_at), 1)
                                    ])) : createCommentVNode("", true),
                                    createVNode(unref(Link), {
                                      href: _ctx.route("blogs.show", post.slug),
                                      class: "entry_name link"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(post.title), 1)
                                      ]),
                                      _: 2
                                    }, 1032, ["href"])
                                  ])
                                ]);
                              }), 128))
                            ])
                          ])) : createCommentVNode("", true)
                        ])
                      ])
                    ])
                  ])
                ])
              ]),
              createVNode(_sfc_main$J)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$H = _sfc_main$H.setup;
_sfc_main$H.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("Modules/Cms/resources/assets/js/Pages/BlogShow.vue");
  return _sfc_setup$H ? _sfc_setup$H(props, ctx) : void 0;
};
const BlogShow = /* @__PURE__ */ _export_sfc(_sfc_main$H, [["__scopeId", "data-v-2672a923"]]);
const __vite_glob_0_5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: BlogShow
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$G = {
  __name: "Faq",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const trans = (key) => page.props.translations[key] || key;
    const seo = computed(() => page.props.seo);
    const settings = computed(() => page.props.settings || {});
    const locale = computed(() => page.props.locale);
    const meta = computed(() => page.props.meta || {});
    const metaTitle = computed(() => meta.value.title || `${trans("FAQs")} | ${seo.value.website_name || ""}`.trim());
    const metaDescription = computed(() => meta.value.description || trans("Find answers to common questions about our services and policies.") || seo.value.website_desc || "");
    const metaKeywords = computed(() => meta.value.keywords || trans("FAQ, help center, support, common questions") || seo.value.website_keywords || "");
    const metaImage = computed(() => {
      var _a, _b, _c, _d, _e;
      return ((_b = (_a = meta.value) == null ? void 0 : _a.og) == null ? void 0 : _b.image) || ((_d = (_c = meta.value) == null ? void 0 : _c.twitter) == null ? void 0 : _d.image) || ((_e = settings.value) == null ? void 0 : _e.meta_img) || "";
    });
    const metaCanonical = computed(() => meta.value.canonical || "");
    const metaRobots = computed(() => meta.value.robots || "index, follow");
    const faqs = computed(() => page.props.faqs || []);
    const activeIndex = ref(0);
    const toggleAccordion = (index) => {
      activeIndex.value = activeIndex.value === index ? null : index;
    };
    watch(() => faqs.value, (newFaqs) => {
      if (newFaqs && newFaqs.length > 0 && activeIndex.value === null) {
        activeIndex.value = 0;
      }
    }, { immediate: true });
    const translateField = (field) => {
      if (!field) return "";
      if (typeof field === "string") return field;
      if (typeof field === "object") {
        return field[locale.value] || field.en || field[Object.keys(field)[0]] || "";
      }
      return "";
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), null, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<title${_scopeId}>${ssrInterpolate(metaTitle.value)}</title><meta name="description"${ssrRenderAttr("content", metaDescription.value)}${_scopeId}><meta name="keywords"${ssrRenderAttr("content", metaKeywords.value)}${_scopeId}><meta name="robots"${ssrRenderAttr("content", metaRobots.value)}${_scopeId}>`);
            if (metaCanonical.value) {
              _push2(`<link rel="canonical"${ssrRenderAttr("href", metaCanonical.value)}${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<meta property="og:title"${ssrRenderAttr("content", metaTitle.value)}${_scopeId}><meta property="og:description"${ssrRenderAttr("content", metaDescription.value)}${_scopeId}>`);
            if (metaImage.value) {
              _push2(`<meta property="og:image"${ssrRenderAttr("content", metaImage.value)}${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            if (metaCanonical.value) {
              _push2(`<meta property="og:url"${ssrRenderAttr("content", metaCanonical.value)}${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<meta property="og:type" content="website"${_scopeId}><meta name="twitter:card" content="summary_large_image"${_scopeId}><meta name="twitter:title"${ssrRenderAttr("content", metaTitle.value)}${_scopeId}><meta name="twitter:description"${ssrRenderAttr("content", metaDescription.value)}${_scopeId}>`);
            if (metaImage.value) {
              _push2(`<meta name="twitter:image"${ssrRenderAttr("content", metaImage.value)}${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("title", null, toDisplayString(metaTitle.value), 1),
              createVNode("meta", {
                name: "description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "keywords",
                content: metaKeywords.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "robots",
                content: metaRobots.value
              }, null, 8, ["content"]),
              metaCanonical.value ? (openBlock(), createBlock("link", {
                key: 0,
                rel: "canonical",
                href: metaCanonical.value
              }, null, 8, ["href"])) : createCommentVNode("", true),
              createVNode("meta", {
                property: "og:title",
                content: metaTitle.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              metaImage.value ? (openBlock(), createBlock("meta", {
                key: 1,
                property: "og:image",
                content: metaImage.value
              }, null, 8, ["content"])) : createCommentVNode("", true),
              metaCanonical.value ? (openBlock(), createBlock("meta", {
                key: 2,
                property: "og:url",
                content: metaCanonical.value
              }, null, 8, ["content"])) : createCommentVNode("", true),
              createVNode("meta", {
                property: "og:type",
                content: "website"
              }),
              createVNode("meta", {
                name: "twitter:card",
                content: "summary_large_image"
              }),
              createVNode("meta", {
                name: "twitter:title",
                content: metaTitle.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "twitter:description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              metaImage.value ? (openBlock(), createBlock("meta", {
                key: 3,
                name: "twitter:image",
                content: metaImage.value
              }, null, 8, ["content"])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$R, null, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$N, {
              title: trans("FAQs")
            }, null, _parent2, _scopeId));
            _push2(`<section class="section-faq flat-spacing-3"${_scopeId}><div class="container"${_scopeId}><h2 class="s-title only-title ol-tt-2 font-3 text-linear text-center px-16"${_scopeId}>${ssrInterpolate(trans("Get answers to the most common questions about our products, services, and policies."))}</h2><div class="row"${_scopeId}><div class="col-lg-10 col-xl-8 mx-auto"${_scopeId}>`);
            if (faqs.value.length) {
              _push2(`<div class="faq-accordion-list px-16 px-xl-0"${_scopeId}><!--[-->`);
              ssrRenderList(faqs.value, (faq, index) => {
                _push2(`<div class="${ssrRenderClass([{ active: activeIndex.value === index }, "faq-accordion_item"])}"${_scopeId}><div class="${ssrRenderClass([{ collapsed: activeIndex.value !== index }, "accordion-title"])}"${_scopeId}><span class="text fw-medium h5 font-3"${_scopeId}>${ssrInterpolate(translateField(faq.question))}</span><span class="icon ic-accordion-custom"${_scopeId}></span></div><div class="accordion-body" style="${ssrRenderStyle(activeIndex.value === index ? null : { display: "none" })}"${_scopeId}><p class="text-main-2"${_scopeId}>${translateField(faq.answer) ?? ""}</p></div></div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<div class="text-center py-5"${_scopeId}><p${_scopeId}>${ssrInterpolate(trans("No FAQs found."))}</p></div>`);
            }
            _push2(`</div></div></div></section>`);
            _push2(ssrRenderComponent(_sfc_main$J, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$N, {
                title: trans("FAQs")
              }, null, 8, ["title"]),
              createVNode("section", { class: "section-faq flat-spacing-3" }, [
                createVNode("div", { class: "container" }, [
                  createVNode("h2", { class: "s-title only-title ol-tt-2 font-3 text-linear text-center px-16" }, toDisplayString(trans("Get answers to the most common questions about our products, services, and policies.")), 1),
                  createVNode("div", { class: "row" }, [
                    createVNode("div", { class: "col-lg-10 col-xl-8 mx-auto" }, [
                      faqs.value.length ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "faq-accordion-list px-16 px-xl-0"
                      }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(faqs.value, (faq, index) => {
                          return openBlock(), createBlock("div", {
                            key: faq.id || index,
                            class: ["faq-accordion_item", { active: activeIndex.value === index }],
                            onClick: ($event) => toggleAccordion(index)
                          }, [
                            createVNode("div", {
                              class: ["accordion-title", { collapsed: activeIndex.value !== index }]
                            }, [
                              createVNode("span", { class: "text fw-medium h5 font-3" }, toDisplayString(translateField(faq.question)), 1),
                              createVNode("span", { class: "icon ic-accordion-custom" })
                            ], 2),
                            withDirectives(createVNode("div", { class: "accordion-body" }, [
                              createVNode("p", {
                                class: "text-main-2",
                                innerHTML: translateField(faq.answer)
                              }, null, 8, ["innerHTML"])
                            ], 512), [
                              [vShow, activeIndex.value === index]
                            ])
                          ], 10, ["onClick"]);
                        }), 128))
                      ])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "text-center py-5"
                      }, [
                        createVNode("p", null, toDisplayString(trans("No FAQs found.")), 1)
                      ]))
                    ])
                  ])
                ])
              ]),
              createVNode(_sfc_main$J)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$G = _sfc_main$G.setup;
_sfc_main$G.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("Modules/Cms/resources/assets/js/Pages/Faq.vue");
  return _sfc_setup$G ? _sfc_setup$G(props, ctx) : void 0;
};
const __vite_glob_0_6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$G
}, Symbol.toStringTag, { value: "Module" }));
const __default__$7 = {
  components: {
    AppLayout: _sfc_main$R
  }
};
const _sfc_main$F = /* @__PURE__ */ Object.assign(__default__$7, {
  __name: "PageShow",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const seo = computed(() => page.props.seo);
    const custom_page = computed(() => page.props.custom_page);
    computed(() => page.props.asset_path || "");
    const locale = computed(() => page.props.locale || "en");
    computed(() => page.props.banner);
    const metaTitle = computed(() => {
      var _a, _b;
      const pageTitle = ((_b = (_a = custom_page.value) == null ? void 0 : _a.title) == null ? void 0 : _b[locale.value]) || "";
      return `${pageTitle} | ${seo.value.website_name || ""}`.trim();
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), null, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<title${_scopeId}>${ssrInterpolate(metaTitle.value)}</title>`);
          } else {
            return [
              createVNode("title", null, toDisplayString(metaTitle.value), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$R, null, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$N, {
              title: custom_page.value.title[locale.value]
            }, null, _parent2, _scopeId));
            _push2(`<div class="flat-spacing-3 qore-content"${_scopeId}><div class="container"${_scopeId}><div class="content mb-10"${_scopeId}><div${_scopeId}>${custom_page.value.content[locale.value] ?? ""}</div></div></div></div>`);
          } else {
            return [
              createVNode(_sfc_main$N, {
                title: custom_page.value.title[locale.value]
              }, null, 8, ["title"]),
              createVNode("div", { class: "flat-spacing-3 qore-content" }, [
                createVNode("div", { class: "container" }, [
                  createVNode("div", { class: "content mb-10" }, [
                    createVNode("div", {
                      innerHTML: custom_page.value.content[locale.value]
                    }, null, 8, ["innerHTML"])
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$F = _sfc_main$F.setup;
_sfc_main$F.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("Modules/Cms/resources/assets/js/Pages/PageShow.vue");
  return _sfc_setup$F ? _sfc_setup$F(props, ctx) : void 0;
};
const __vite_glob_0_7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$F
}, Symbol.toStringTag, { value: "Module" }));
const __default__$6 = {
  components: {
    AppLayout: _sfc_main$R
  }
};
const _sfc_main$E = /* @__PURE__ */ Object.assign(__default__$6, {
  __name: "PrivacyPolicy",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const trans = (key) => page.props.translations[key] || key;
    const seo = computed(() => page.props.seo);
    computed(() => page.props.asset_path || "");
    const settings = computed(() => page.props.settings || {});
    computed(() => page.props.locale);
    const meta = computed(() => page.props.meta || {});
    const metaTitle = computed(() => {
      return meta.value.title || `${trans("Privacy Policy")} | ${seo.value.website_name || ""}`.trim();
    });
    const metaDescription = computed(() => {
      return meta.value.description || trans("Review how we collect, use, and protect your personal information.") || seo.value.website_desc || "";
    });
    const metaKeywords = computed(() => {
      return meta.value.keywords || trans("privacy policy, data protection, security, compliance") || seo.value.website_keywords || "";
    });
    const metaImage = computed(() => {
      var _a, _b, _c, _d, _e;
      return ((_b = (_a = meta.value) == null ? void 0 : _a.og) == null ? void 0 : _b.image) || ((_d = (_c = meta.value) == null ? void 0 : _c.twitter) == null ? void 0 : _d.image) || ((_e = settings.value) == null ? void 0 : _e.meta_img) || "";
    });
    const metaCanonical = computed(() => meta.value.canonical || "");
    const metaRobots = computed(() => meta.value.robots || "index, follow");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), null, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<title data-v-cb0e83ae${_scopeId}>${ssrInterpolate(metaTitle.value)}</title><meta name="description"${ssrRenderAttr("content", metaDescription.value)} data-v-cb0e83ae${_scopeId}><meta name="keywords"${ssrRenderAttr("content", metaKeywords.value)} data-v-cb0e83ae${_scopeId}><meta name="robots"${ssrRenderAttr("content", metaRobots.value)} data-v-cb0e83ae${_scopeId}>`);
            if (metaCanonical.value) {
              _push2(`<link rel="canonical"${ssrRenderAttr("href", metaCanonical.value)} data-v-cb0e83ae${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<meta property="og:title"${ssrRenderAttr("content", metaTitle.value)} data-v-cb0e83ae${_scopeId}><meta property="og:description"${ssrRenderAttr("content", metaDescription.value)} data-v-cb0e83ae${_scopeId}>`);
            if (metaImage.value) {
              _push2(`<meta property="og:image"${ssrRenderAttr("content", metaImage.value)} data-v-cb0e83ae${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            if (metaCanonical.value) {
              _push2(`<meta property="og:url"${ssrRenderAttr("content", metaCanonical.value)} data-v-cb0e83ae${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<meta property="og:type" content="website" data-v-cb0e83ae${_scopeId}><meta name="twitter:card" content="summary_large_image" data-v-cb0e83ae${_scopeId}><meta name="twitter:title"${ssrRenderAttr("content", metaTitle.value)} data-v-cb0e83ae${_scopeId}><meta name="twitter:description"${ssrRenderAttr("content", metaDescription.value)} data-v-cb0e83ae${_scopeId}>`);
            if (metaImage.value) {
              _push2(`<meta name="twitter:image"${ssrRenderAttr("content", metaImage.value)} data-v-cb0e83ae${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("title", null, toDisplayString(metaTitle.value), 1),
              createVNode("meta", {
                name: "description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "keywords",
                content: metaKeywords.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "robots",
                content: metaRobots.value
              }, null, 8, ["content"]),
              metaCanonical.value ? (openBlock(), createBlock("link", {
                key: 0,
                rel: "canonical",
                href: metaCanonical.value
              }, null, 8, ["href"])) : createCommentVNode("", true),
              createVNode("meta", {
                property: "og:title",
                content: metaTitle.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              metaImage.value ? (openBlock(), createBlock("meta", {
                key: 1,
                property: "og:image",
                content: metaImage.value
              }, null, 8, ["content"])) : createCommentVNode("", true),
              metaCanonical.value ? (openBlock(), createBlock("meta", {
                key: 2,
                property: "og:url",
                content: metaCanonical.value
              }, null, 8, ["content"])) : createCommentVNode("", true),
              createVNode("meta", {
                property: "og:type",
                content: "website"
              }),
              createVNode("meta", {
                name: "twitter:card",
                content: "summary_large_image"
              }),
              createVNode("meta", {
                name: "twitter:title",
                content: metaTitle.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "twitter:description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              metaImage.value ? (openBlock(), createBlock("meta", {
                key: 3,
                name: "twitter:image",
                content: metaImage.value
              }, null, 8, ["content"])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$R, null, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          var _a, _b, _c, _d, _e, _f;
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$N, {
              title: trans("Privacy Policy")
            }, null, _parent2, _scopeId));
            _push2(`<section class="privacy-policy my-5" data-v-cb0e83ae${_scopeId}><div class="container" data-v-cb0e83ae${_scopeId}><div class="row" data-v-cb0e83ae${_scopeId}><div class="col-xl-12" data-v-cb0e83ae${_scopeId}><div class="privacy-policy__content" data-v-cb0e83ae${_scopeId}><div class="privacy-policy__text" data-v-cb0e83ae${_scopeId}><p class="privacy-policy__last-updated" data-v-cb0e83ae${_scopeId}><strong data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("Last Updated:"))}</strong> ${ssrInterpolate((/* @__PURE__ */ new Date()).toLocaleDateString())}</p><h3 class="privacy-policy__heading" data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("1. Introduction"))}</h3><p data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("Welcome to our Privacy Policy. This document explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site."))}</p><h3 class="privacy-policy__heading" data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("2. Information We Collect"))}</h3><p data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("We may collect information about you in a variety of ways. The information we may collect on the site includes:"))}</p><ul data-v-cb0e83ae${_scopeId}><li data-v-cb0e83ae${_scopeId}><strong data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("Personal Data"))}</strong>: ${ssrInterpolate(trans("Personally identifiable information, such as your name, email address, phone number, and demographic information that you voluntarily give to us when you register with the site or when you choose to participate in various activities related to the site."))}</li><li data-v-cb0e83ae${_scopeId}><strong data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("Derivative Data"))}</strong>: ${ssrInterpolate(trans("Information our servers automatically collect when you access the site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the site."))}</li><li data-v-cb0e83ae${_scopeId}><strong data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("Financial Data"))}</strong>: ${ssrInterpolate(trans("Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services from the site."))}</li><li data-v-cb0e83ae${_scopeId}><strong data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("Mobile Device Data"))}</strong>: ${ssrInterpolate(trans("Device information, such as your mobile device ID, model, and manufacturer, and information about the location of your device, if you access the site from a mobile device."))}</li></ul><h3 class="privacy-policy__heading" data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("3. How We Use Your Information"))}</h3><p data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the site to:"))}</p><ul data-v-cb0e83ae${_scopeId}><li data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("Create and manage your account"))}</li><li data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("Process your transactions and send you related information"))}</li><li data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("Email you regarding your account or order"))}</li><li data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("Fulfill and manage purchases, orders, payments, and other transactions related to the site"))}</li><li data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("Generate a personal profile about you to make future visits more personalized"))}</li><li data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("Increase the efficiency and operation of the site"))}</li><li data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("Monitor and analyze usage and trends to improve your experience with the site"))}</li><li data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("Notify you of updates to the site"))}</li><li data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("Perform other business activities as needed"))}</li><li data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("Request feedback and contact you about your use of the site"))}</li><li data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("Resolve disputes and troubleshoot problems"))}</li><li data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("Respond to product and customer service requests"))}</li><li data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("Send you a newsletter"))}</li><li data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("Solicit support for the site"))}</li></ul><h3 class="privacy-policy__heading" data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("4. Disclosure of Your Information"))}</h3><p data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("We may share information we have collected about you in certain situations. Your information may be disclosed as follows:"))}</p><ul data-v-cb0e83ae${_scopeId}><li data-v-cb0e83ae${_scopeId}><strong data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("By Law or to Protect Rights"))}</strong>: ${ssrInterpolate(trans("If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation."))}</li><li data-v-cb0e83ae${_scopeId}><strong data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("Third-Party Service Providers"))}</strong>: ${ssrInterpolate(trans("We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance."))}</li><li data-v-cb0e83ae${_scopeId}><strong data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("Business Transfers"))}</strong>: ${ssrInterpolate(trans("We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company."))}</li><li data-v-cb0e83ae${_scopeId}><strong data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("Affiliates"))}</strong>: ${ssrInterpolate(trans("We may share your information with our affiliates, in which case we will require those affiliates to honor this Privacy Policy. Affiliates include our parent company and any subsidiaries, joint venture partners, or other companies that we control or that are under common control with us."))}</li><li data-v-cb0e83ae${_scopeId}><strong data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("Business Partners"))}</strong>: ${ssrInterpolate(trans("We may share your information with our business partners to offer you certain products, services, or promotions."))}</li></ul><h3 class="privacy-policy__heading" data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("5. Security of Your Information"))}</h3><p data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse. Any information disclosed online is vulnerable to interception and misuse by unauthorized parties. Therefore, we cannot guarantee complete security if you provide personal information."))}</p><h3 class="privacy-policy__heading" data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("6. Policy for Children"))}</h3><p data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("We do not knowingly solicit information from or market to children under the age of 13. If we learn that we have collected personal information from a child under age 13 without verification of parental consent, we will delete that information as quickly as possible. If you become aware of any data we have collected from children under age 13, please contact us."))}</p><h3 class="privacy-policy__heading" data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("7. Your Rights"))}</h3><p data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("Depending on your location, you may have the following rights regarding your personal information:"))}</p><ul data-v-cb0e83ae${_scopeId}><li data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("The right to access – You have the right to request copies of your personal data"))}</li><li data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("The right to rectification – You have the right to request that we correct any information you believe is inaccurate"))}</li><li data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("The right to erasure – You have the right to request that we erase your personal data, under certain conditions"))}</li><li data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("The right to restrict processing – You have the right to request that we restrict the processing of your personal data, under certain conditions"))}</li><li data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("The right to object to processing – You have the right to object to our processing of your personal data, under certain conditions"))}</li><li data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("The right to data portability – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions"))}</li></ul><h3 class="privacy-policy__heading" data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("8. Cookies and Tracking Technologies"))}</h3><p data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("We may use cookies, web beacons, tracking pixels, and other tracking technologies on the site to help customize the site and improve your experience. When you access the site, your personal information is not collected through the use of tracking technology. Most browsers are set to accept cookies by default. You can remove or reject cookies, but be aware that such action could affect the availability and functionality of the site."))}</p><h3 class="privacy-policy__heading" data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("9. Third-Party Websites"))}</h3><p data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("The site may contain links to third-party websites and applications of interest, including advertisements and external services, that are not affiliated with us. Once you have used these links to leave the site, any information you provide to these third parties is not covered by this Privacy Policy, and we cannot guarantee the safety and privacy of your information. Before visiting and providing any information to any third-party websites, you should inform yourself of the privacy policies and practices (if any) of the third party responsible for that website, and should take those steps necessary to, in your discretion, protect the privacy of your information."))}</p><h3 class="privacy-policy__heading" data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("10. Changes to This Privacy Policy"))}</h3><p data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans('We may update this Privacy Policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal, or regulatory reasons. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.'))}</p><h3 class="privacy-policy__heading" data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("11. Contact Us"))}</h3><p data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("If you have questions or comments about this Privacy Policy, please contact us at:"))}</p><p data-v-cb0e83ae${_scopeId}><strong data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("Email:"))}</strong> ${ssrInterpolate((_a = settings.value) == null ? void 0 : _a.email)}<br data-v-cb0e83ae${_scopeId}><strong data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("Phone:"))}</strong> ${ssrInterpolate((_b = settings.value) == null ? void 0 : _b.phone)}<br data-v-cb0e83ae${_scopeId}><strong data-v-cb0e83ae${_scopeId}>${ssrInterpolate(trans("Address:"))}</strong> ${ssrInterpolate((_c = settings.value) == null ? void 0 : _c.address)}</p></div></div></div></div></div></section>`);
          } else {
            return [
              createVNode(_sfc_main$N, {
                title: trans("Privacy Policy")
              }, null, 8, ["title"]),
              createVNode("section", { class: "privacy-policy my-5" }, [
                createVNode("div", { class: "container" }, [
                  createVNode("div", { class: "row" }, [
                    createVNode("div", { class: "col-xl-12" }, [
                      createVNode("div", { class: "privacy-policy__content" }, [
                        createVNode("div", { class: "privacy-policy__text" }, [
                          createVNode("p", { class: "privacy-policy__last-updated" }, [
                            createVNode("strong", null, toDisplayString(trans("Last Updated:")), 1),
                            createTextVNode(" " + toDisplayString((/* @__PURE__ */ new Date()).toLocaleDateString()), 1)
                          ]),
                          createVNode("h3", { class: "privacy-policy__heading" }, toDisplayString(trans("1. Introduction")), 1),
                          createVNode("p", null, toDisplayString(trans("Welcome to our Privacy Policy. This document explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.")), 1),
                          createVNode("h3", { class: "privacy-policy__heading" }, toDisplayString(trans("2. Information We Collect")), 1),
                          createVNode("p", null, toDisplayString(trans("We may collect information about you in a variety of ways. The information we may collect on the site includes:")), 1),
                          createVNode("ul", null, [
                            createVNode("li", null, [
                              createVNode("strong", null, toDisplayString(trans("Personal Data")), 1),
                              createTextVNode(": " + toDisplayString(trans("Personally identifiable information, such as your name, email address, phone number, and demographic information that you voluntarily give to us when you register with the site or when you choose to participate in various activities related to the site.")), 1)
                            ]),
                            createVNode("li", null, [
                              createVNode("strong", null, toDisplayString(trans("Derivative Data")), 1),
                              createTextVNode(": " + toDisplayString(trans("Information our servers automatically collect when you access the site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the site.")), 1)
                            ]),
                            createVNode("li", null, [
                              createVNode("strong", null, toDisplayString(trans("Financial Data")), 1),
                              createTextVNode(": " + toDisplayString(trans("Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services from the site.")), 1)
                            ]),
                            createVNode("li", null, [
                              createVNode("strong", null, toDisplayString(trans("Mobile Device Data")), 1),
                              createTextVNode(": " + toDisplayString(trans("Device information, such as your mobile device ID, model, and manufacturer, and information about the location of your device, if you access the site from a mobile device.")), 1)
                            ])
                          ]),
                          createVNode("h3", { class: "privacy-policy__heading" }, toDisplayString(trans("3. How We Use Your Information")), 1),
                          createVNode("p", null, toDisplayString(trans("Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the site to:")), 1),
                          createVNode("ul", null, [
                            createVNode("li", null, toDisplayString(trans("Create and manage your account")), 1),
                            createVNode("li", null, toDisplayString(trans("Process your transactions and send you related information")), 1),
                            createVNode("li", null, toDisplayString(trans("Email you regarding your account or order")), 1),
                            createVNode("li", null, toDisplayString(trans("Fulfill and manage purchases, orders, payments, and other transactions related to the site")), 1),
                            createVNode("li", null, toDisplayString(trans("Generate a personal profile about you to make future visits more personalized")), 1),
                            createVNode("li", null, toDisplayString(trans("Increase the efficiency and operation of the site")), 1),
                            createVNode("li", null, toDisplayString(trans("Monitor and analyze usage and trends to improve your experience with the site")), 1),
                            createVNode("li", null, toDisplayString(trans("Notify you of updates to the site")), 1),
                            createVNode("li", null, toDisplayString(trans("Perform other business activities as needed")), 1),
                            createVNode("li", null, toDisplayString(trans("Request feedback and contact you about your use of the site")), 1),
                            createVNode("li", null, toDisplayString(trans("Resolve disputes and troubleshoot problems")), 1),
                            createVNode("li", null, toDisplayString(trans("Respond to product and customer service requests")), 1),
                            createVNode("li", null, toDisplayString(trans("Send you a newsletter")), 1),
                            createVNode("li", null, toDisplayString(trans("Solicit support for the site")), 1)
                          ]),
                          createVNode("h3", { class: "privacy-policy__heading" }, toDisplayString(trans("4. Disclosure of Your Information")), 1),
                          createVNode("p", null, toDisplayString(trans("We may share information we have collected about you in certain situations. Your information may be disclosed as follows:")), 1),
                          createVNode("ul", null, [
                            createVNode("li", null, [
                              createVNode("strong", null, toDisplayString(trans("By Law or to Protect Rights")), 1),
                              createTextVNode(": " + toDisplayString(trans("If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.")), 1)
                            ]),
                            createVNode("li", null, [
                              createVNode("strong", null, toDisplayString(trans("Third-Party Service Providers")), 1),
                              createTextVNode(": " + toDisplayString(trans("We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.")), 1)
                            ]),
                            createVNode("li", null, [
                              createVNode("strong", null, toDisplayString(trans("Business Transfers")), 1),
                              createTextVNode(": " + toDisplayString(trans("We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.")), 1)
                            ]),
                            createVNode("li", null, [
                              createVNode("strong", null, toDisplayString(trans("Affiliates")), 1),
                              createTextVNode(": " + toDisplayString(trans("We may share your information with our affiliates, in which case we will require those affiliates to honor this Privacy Policy. Affiliates include our parent company and any subsidiaries, joint venture partners, or other companies that we control or that are under common control with us.")), 1)
                            ]),
                            createVNode("li", null, [
                              createVNode("strong", null, toDisplayString(trans("Business Partners")), 1),
                              createTextVNode(": " + toDisplayString(trans("We may share your information with our business partners to offer you certain products, services, or promotions.")), 1)
                            ])
                          ]),
                          createVNode("h3", { class: "privacy-policy__heading" }, toDisplayString(trans("5. Security of Your Information")), 1),
                          createVNode("p", null, toDisplayString(trans("We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse. Any information disclosed online is vulnerable to interception and misuse by unauthorized parties. Therefore, we cannot guarantee complete security if you provide personal information.")), 1),
                          createVNode("h3", { class: "privacy-policy__heading" }, toDisplayString(trans("6. Policy for Children")), 1),
                          createVNode("p", null, toDisplayString(trans("We do not knowingly solicit information from or market to children under the age of 13. If we learn that we have collected personal information from a child under age 13 without verification of parental consent, we will delete that information as quickly as possible. If you become aware of any data we have collected from children under age 13, please contact us.")), 1),
                          createVNode("h3", { class: "privacy-policy__heading" }, toDisplayString(trans("7. Your Rights")), 1),
                          createVNode("p", null, toDisplayString(trans("Depending on your location, you may have the following rights regarding your personal information:")), 1),
                          createVNode("ul", null, [
                            createVNode("li", null, toDisplayString(trans("The right to access – You have the right to request copies of your personal data")), 1),
                            createVNode("li", null, toDisplayString(trans("The right to rectification – You have the right to request that we correct any information you believe is inaccurate")), 1),
                            createVNode("li", null, toDisplayString(trans("The right to erasure – You have the right to request that we erase your personal data, under certain conditions")), 1),
                            createVNode("li", null, toDisplayString(trans("The right to restrict processing – You have the right to request that we restrict the processing of your personal data, under certain conditions")), 1),
                            createVNode("li", null, toDisplayString(trans("The right to object to processing – You have the right to object to our processing of your personal data, under certain conditions")), 1),
                            createVNode("li", null, toDisplayString(trans("The right to data portability – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions")), 1)
                          ]),
                          createVNode("h3", { class: "privacy-policy__heading" }, toDisplayString(trans("8. Cookies and Tracking Technologies")), 1),
                          createVNode("p", null, toDisplayString(trans("We may use cookies, web beacons, tracking pixels, and other tracking technologies on the site to help customize the site and improve your experience. When you access the site, your personal information is not collected through the use of tracking technology. Most browsers are set to accept cookies by default. You can remove or reject cookies, but be aware that such action could affect the availability and functionality of the site.")), 1),
                          createVNode("h3", { class: "privacy-policy__heading" }, toDisplayString(trans("9. Third-Party Websites")), 1),
                          createVNode("p", null, toDisplayString(trans("The site may contain links to third-party websites and applications of interest, including advertisements and external services, that are not affiliated with us. Once you have used these links to leave the site, any information you provide to these third parties is not covered by this Privacy Policy, and we cannot guarantee the safety and privacy of your information. Before visiting and providing any information to any third-party websites, you should inform yourself of the privacy policies and practices (if any) of the third party responsible for that website, and should take those steps necessary to, in your discretion, protect the privacy of your information.")), 1),
                          createVNode("h3", { class: "privacy-policy__heading" }, toDisplayString(trans("10. Changes to This Privacy Policy")), 1),
                          createVNode("p", null, toDisplayString(trans('We may update this Privacy Policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal, or regulatory reasons. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.')), 1),
                          createVNode("h3", { class: "privacy-policy__heading" }, toDisplayString(trans("11. Contact Us")), 1),
                          createVNode("p", null, toDisplayString(trans("If you have questions or comments about this Privacy Policy, please contact us at:")), 1),
                          createVNode("p", null, [
                            createVNode("strong", null, toDisplayString(trans("Email:")), 1),
                            createTextVNode(" " + toDisplayString((_d = settings.value) == null ? void 0 : _d.email), 1),
                            createVNode("br"),
                            createVNode("strong", null, toDisplayString(trans("Phone:")), 1),
                            createTextVNode(" " + toDisplayString((_e = settings.value) == null ? void 0 : _e.phone), 1),
                            createVNode("br"),
                            createVNode("strong", null, toDisplayString(trans("Address:")), 1),
                            createTextVNode(" " + toDisplayString((_f = settings.value) == null ? void 0 : _f.address), 1)
                          ])
                        ])
                      ])
                    ])
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$E = _sfc_main$E.setup;
_sfc_main$E.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("Modules/Cms/resources/assets/js/Pages/PrivacyPolicy.vue");
  return _sfc_setup$E ? _sfc_setup$E(props, ctx) : void 0;
};
const PrivacyPolicy = /* @__PURE__ */ _export_sfc(_sfc_main$E, [["__scopeId", "data-v-cb0e83ae"]]);
const __vite_glob_0_8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: PrivacyPolicy
}, Symbol.toStringTag, { value: "Module" }));
const __default__$5 = {
  components: {
    AppLayout: _sfc_main$R
  }
};
const _sfc_main$D = /* @__PURE__ */ Object.assign(__default__$5, {
  __name: "Team",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const trans = (key) => page.props.translations[key] || key;
    const seo = computed(() => page.props.seo);
    const settings = computed(() => page.props.settings || {});
    computed(() => page.props.asset_path || "");
    const locale = computed(() => page.props.locale);
    const teams = computed(() => page.props.teams || []);
    const meta = computed(() => page.props.meta || {});
    const metaTitle = computed(() => {
      return meta.value.title || `${trans("Our Members")} | ${seo.value.website_name || ""}`.trim();
    });
    const metaDescription = computed(() => {
      return meta.value.description || trans("Meet the professionals behind our technology and consulting services.") || seo.value.website_desc || "";
    });
    const metaKeywords = computed(() => {
      return meta.value.keywords || trans("team, experts, leadership, professionals") || seo.value.website_keywords || "";
    });
    const metaImage = computed(() => {
      var _a, _b, _c, _d, _e;
      return ((_b = (_a = meta.value) == null ? void 0 : _a.og) == null ? void 0 : _b.image) || ((_d = (_c = meta.value) == null ? void 0 : _c.twitter) == null ? void 0 : _d.image) || ((_e = settings.value) == null ? void 0 : _e.meta_img) || "";
    });
    const metaCanonical = computed(() => meta.value.canonical || "");
    const metaRobots = computed(() => meta.value.robots || "index, follow");
    const translateField = (value) => {
      if (!value) {
        return "";
      }
      if (typeof value === "string") {
        return value;
      }
      const loc = locale.value;
      if (typeof value === "object" && value !== null) {
        if (value[loc]) {
          return value[loc];
        }
      }
      return "";
    };
    onMounted(() => {
      nextTick(() => {
        if (typeof WOW !== "undefined") {
          new WOW().init();
        }
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), null, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<title${_scopeId}>${ssrInterpolate(metaTitle.value)}</title><meta name="description"${ssrRenderAttr("content", metaDescription.value)}${_scopeId}><meta name="keywords"${ssrRenderAttr("content", metaKeywords.value)}${_scopeId}><meta name="robots"${ssrRenderAttr("content", metaRobots.value)}${_scopeId}>`);
            if (metaCanonical.value) {
              _push2(`<link rel="canonical"${ssrRenderAttr("href", metaCanonical.value)}${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<meta property="og:title"${ssrRenderAttr("content", metaTitle.value)}${_scopeId}><meta property="og:description"${ssrRenderAttr("content", metaDescription.value)}${_scopeId}>`);
            if (metaImage.value) {
              _push2(`<meta property="og:image"${ssrRenderAttr("content", metaImage.value)}${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            if (metaCanonical.value) {
              _push2(`<meta property="og:url"${ssrRenderAttr("content", metaCanonical.value)}${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<meta property="og:type" content="website"${_scopeId}><meta name="twitter:card" content="summary_large_image"${_scopeId}><meta name="twitter:title"${ssrRenderAttr("content", metaTitle.value)}${_scopeId}><meta name="twitter:description"${ssrRenderAttr("content", metaDescription.value)}${_scopeId}>`);
            if (metaImage.value) {
              _push2(`<meta name="twitter:image"${ssrRenderAttr("content", metaImage.value)}${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("title", null, toDisplayString(metaTitle.value), 1),
              createVNode("meta", {
                name: "description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "keywords",
                content: metaKeywords.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "robots",
                content: metaRobots.value
              }, null, 8, ["content"]),
              metaCanonical.value ? (openBlock(), createBlock("link", {
                key: 0,
                rel: "canonical",
                href: metaCanonical.value
              }, null, 8, ["href"])) : createCommentVNode("", true),
              createVNode("meta", {
                property: "og:title",
                content: metaTitle.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              metaImage.value ? (openBlock(), createBlock("meta", {
                key: 1,
                property: "og:image",
                content: metaImage.value
              }, null, 8, ["content"])) : createCommentVNode("", true),
              metaCanonical.value ? (openBlock(), createBlock("meta", {
                key: 2,
                property: "og:url",
                content: metaCanonical.value
              }, null, 8, ["content"])) : createCommentVNode("", true),
              createVNode("meta", {
                property: "og:type",
                content: "website"
              }),
              createVNode("meta", {
                name: "twitter:card",
                content: "summary_large_image"
              }),
              createVNode("meta", {
                name: "twitter:title",
                content: metaTitle.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "twitter:description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              metaImage.value ? (openBlock(), createBlock("meta", {
                key: 3,
                name: "twitter:image",
                content: metaImage.value
              }, null, 8, ["content"])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$R, null, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$N, {
              title: trans("Our Members")
            }, null, _parent2, _scopeId));
            _push2(`<section class="team-page my-5"${_scopeId}><div class="container"${_scopeId}>`);
            if (teams.value && teams.value.length > 0) {
              _push2(`<div class="row"${_scopeId}><!--[-->`);
              ssrRenderList(teams.value, (team, index) => {
                _push2(`<div class="col-xl-3 col-lg-6 col-md-6 wow fadeInLeft"${ssrRenderAttr("data-wow-delay", `${index % 4 * 100}ms`)}${_scopeId}><div class="team-one__single"${_scopeId}><div class="team-one__img-box"${_scopeId}><div class="team-one__img"${_scopeId}><img${ssrRenderAttr("src", team.avatar_link)}${ssrRenderAttr("alt", translateField(team.name))}${_scopeId}></div><div class="team-one__social-box-inner"${_scopeId}><div class="team-one__social-box"${_scopeId}><div class="team-one__social"${_scopeId}>`);
                if (team.facebook) {
                  _push2(`<a${ssrRenderAttr("href", team.facebook)} target="_blank" aria-label="Facebook"${_scopeId}><span class="icon-facebook"${_scopeId}></span></a>`);
                } else {
                  _push2(`<!---->`);
                }
                if (team.behance) {
                  _push2(`<a${ssrRenderAttr("href", team.behance)} target="_blank" aria-label="Behance"${_scopeId}><span class="icon-dribble"${_scopeId}></span></a>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div><div class="team-one__social"${_scopeId}>`);
                if (team.linked_in) {
                  _push2(`<a${ssrRenderAttr("href", team.linked_in)} target="_blank" aria-label="LinkedIn"${_scopeId}><span class="icon-linkedin"${_scopeId}></span></a>`);
                } else {
                  _push2(`<!---->`);
                }
                if (team.github) {
                  _push2(`<a${ssrRenderAttr("href", team.github)} target="_blank" aria-label="GitHub"${_scopeId}><span class="icon-github"${_scopeId}></span></a>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div></div></div><div class="team-one__title-box"${_scopeId}><h3${_scopeId}><span${_scopeId}>${ssrInterpolate(translateField(team.name))}</span></h3><p${_scopeId}>${ssrInterpolate(translateField(team.position))}</p></div></div></div></div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<div class="text-center py-5"${_scopeId}><p${_scopeId}>${ssrInterpolate(trans("No team members found."))}</p></div>`);
            }
            _push2(`</div></section>`);
          } else {
            return [
              createVNode(_sfc_main$N, {
                title: trans("Our Members")
              }, null, 8, ["title"]),
              createVNode("section", { class: "team-page my-5" }, [
                createVNode("div", { class: "container" }, [
                  teams.value && teams.value.length > 0 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "row"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(teams.value, (team, index) => {
                      return openBlock(), createBlock("div", {
                        class: "col-xl-3 col-lg-6 col-md-6 wow fadeInLeft",
                        key: team.id,
                        "data-wow-delay": `${index % 4 * 100}ms`
                      }, [
                        createVNode("div", { class: "team-one__single" }, [
                          createVNode("div", { class: "team-one__img-box" }, [
                            createVNode("div", { class: "team-one__img" }, [
                              createVNode("img", {
                                src: team.avatar_link,
                                alt: translateField(team.name)
                              }, null, 8, ["src", "alt"])
                            ]),
                            createVNode("div", { class: "team-one__social-box-inner" }, [
                              createVNode("div", { class: "team-one__social-box" }, [
                                createVNode("div", { class: "team-one__social" }, [
                                  team.facebook ? (openBlock(), createBlock("a", {
                                    key: 0,
                                    href: team.facebook,
                                    target: "_blank",
                                    "aria-label": "Facebook"
                                  }, [
                                    createVNode("span", { class: "icon-facebook" })
                                  ], 8, ["href"])) : createCommentVNode("", true),
                                  team.behance ? (openBlock(), createBlock("a", {
                                    key: 1,
                                    href: team.behance,
                                    target: "_blank",
                                    "aria-label": "Behance"
                                  }, [
                                    createVNode("span", { class: "icon-dribble" })
                                  ], 8, ["href"])) : createCommentVNode("", true)
                                ]),
                                createVNode("div", { class: "team-one__social" }, [
                                  team.linked_in ? (openBlock(), createBlock("a", {
                                    key: 0,
                                    href: team.linked_in,
                                    target: "_blank",
                                    "aria-label": "LinkedIn"
                                  }, [
                                    createVNode("span", { class: "icon-linkedin" })
                                  ], 8, ["href"])) : createCommentVNode("", true),
                                  team.github ? (openBlock(), createBlock("a", {
                                    key: 1,
                                    href: team.github,
                                    target: "_blank",
                                    "aria-label": "GitHub"
                                  }, [
                                    createVNode("span", { class: "icon-github" })
                                  ], 8, ["href"])) : createCommentVNode("", true)
                                ])
                              ])
                            ]),
                            createVNode("div", { class: "team-one__title-box" }, [
                              createVNode("h3", null, [
                                createVNode("span", null, toDisplayString(translateField(team.name)), 1)
                              ]),
                              createVNode("p", null, toDisplayString(translateField(team.position)), 1)
                            ])
                          ])
                        ])
                      ], 8, ["data-wow-delay"]);
                    }), 128))
                  ])) : (openBlock(), createBlock("div", {
                    key: 1,
                    class: "text-center py-5"
                  }, [
                    createVNode("p", null, toDisplayString(trans("No team members found.")), 1)
                  ]))
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$D = _sfc_main$D.setup;
_sfc_main$D.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("Modules/Cms/resources/assets/js/Pages/Team.vue");
  return _sfc_setup$D ? _sfc_setup$D(props, ctx) : void 0;
};
const __vite_glob_0_9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$D
}, Symbol.toStringTag, { value: "Module" }));
const __default__$4 = {
  components: {
    AppLayout: _sfc_main$R
  }
};
const _sfc_main$C = /* @__PURE__ */ Object.assign(__default__$4, {
  __name: "Testimonials",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const trans = (key) => page.props.translations[key] || key;
    const seo = computed(() => page.props.seo);
    const settings = computed(() => page.props.settings || {});
    computed(() => page.props.asset_path || "");
    const locale = computed(() => page.props.locale);
    const testimonials = computed(() => page.props.testimonials || []);
    const meta = computed(() => page.props.meta || {});
    const metaTitle = computed(() => {
      return `${trans("Testimonials")} | ${seo.value.website_name || ""}`.trim();
    });
    const metaDescription = computed(() => {
      return meta.value.description || trans("Read what our clients say about working with our team.") || seo.value.website_desc || "";
    });
    const metaKeywords = computed(() => {
      return meta.value.keywords || trans("testimonials, reviews, client feedback, success stories") || seo.value.website_keywords || "";
    });
    const metaImage = computed(() => {
      var _a, _b, _c, _d, _e;
      return ((_b = (_a = meta.value) == null ? void 0 : _a.og) == null ? void 0 : _b.image) || ((_d = (_c = meta.value) == null ? void 0 : _c.twitter) == null ? void 0 : _d.image) || ((_e = settings.value) == null ? void 0 : _e.meta_img) || "";
    });
    const metaCanonical = computed(() => meta.value.canonical || "");
    const metaRobots = computed(() => meta.value.robots || "index, follow");
    const translateField = (value) => {
      if (!value) {
        return "";
      }
      if (typeof value === "string") {
        return value;
      }
      const loc = locale.value;
      if (typeof value === "object" && value !== null) {
        if (value[loc]) {
          return value[loc];
        }
      }
      return "";
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), null, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<title${_scopeId}>${ssrInterpolate(metaTitle.value)}</title><meta name="description"${ssrRenderAttr("content", metaDescription.value)}${_scopeId}><meta name="keywords"${ssrRenderAttr("content", metaKeywords.value)}${_scopeId}><meta name="robots"${ssrRenderAttr("content", metaRobots.value)}${_scopeId}>`);
            if (metaCanonical.value) {
              _push2(`<link rel="canonical"${ssrRenderAttr("href", metaCanonical.value)}${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<meta property="og:title"${ssrRenderAttr("content", metaTitle.value)}${_scopeId}><meta property="og:description"${ssrRenderAttr("content", metaDescription.value)}${_scopeId}>`);
            if (metaImage.value) {
              _push2(`<meta property="og:image"${ssrRenderAttr("content", metaImage.value)}${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            if (metaCanonical.value) {
              _push2(`<meta property="og:url"${ssrRenderAttr("content", metaCanonical.value)}${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<meta property="og:type" content="website"${_scopeId}><meta name="twitter:card" content="summary_large_image"${_scopeId}><meta name="twitter:title"${ssrRenderAttr("content", metaTitle.value)}${_scopeId}><meta name="twitter:description"${ssrRenderAttr("content", metaDescription.value)}${_scopeId}>`);
            if (metaImage.value) {
              _push2(`<meta name="twitter:image"${ssrRenderAttr("content", metaImage.value)}${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("title", null, toDisplayString(metaTitle.value), 1),
              createVNode("meta", {
                name: "description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "keywords",
                content: metaKeywords.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "robots",
                content: metaRobots.value
              }, null, 8, ["content"]),
              metaCanonical.value ? (openBlock(), createBlock("link", {
                key: 0,
                rel: "canonical",
                href: metaCanonical.value
              }, null, 8, ["href"])) : createCommentVNode("", true),
              createVNode("meta", {
                property: "og:title",
                content: metaTitle.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              metaImage.value ? (openBlock(), createBlock("meta", {
                key: 1,
                property: "og:image",
                content: metaImage.value
              }, null, 8, ["content"])) : createCommentVNode("", true),
              metaCanonical.value ? (openBlock(), createBlock("meta", {
                key: 2,
                property: "og:url",
                content: metaCanonical.value
              }, null, 8, ["content"])) : createCommentVNode("", true),
              createVNode("meta", {
                property: "og:type",
                content: "website"
              }),
              createVNode("meta", {
                name: "twitter:card",
                content: "summary_large_image"
              }),
              createVNode("meta", {
                name: "twitter:title",
                content: metaTitle.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "twitter:description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              metaImage.value ? (openBlock(), createBlock("meta", {
                key: 3,
                name: "twitter:image",
                content: metaImage.value
              }, null, 8, ["content"])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$R, null, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$N, {
              title: trans("Testimonials")
            }, null, _parent2, _scopeId));
            _push2(`<section class="testimonials-page"${_scopeId}><div class="container"${_scopeId}>`);
            if (testimonials.value && testimonials.value.length > 0) {
              _push2(`<div class="row"${_scopeId}><!--[-->`);
              ssrRenderList(testimonials.value, (testimonial) => {
                _push2(`<div class="col-xl-4 col-lg-6 col-md-6"${_scopeId}><div class="testimonial-two__single"${_scopeId}><div class="testimonial-two__single-inner"${_scopeId}><div class="testimonial-two__star"${_scopeId}><span class="icon-pointed-star"${_scopeId}></span><span class="icon-pointed-star"${_scopeId}></span><span class="icon-pointed-star"${_scopeId}></span><span class="icon-pointed-star"${_scopeId}></span><span class="icon-pointed-star"${_scopeId}></span></div><p class="testimonial-two__text"${_scopeId}>${ssrInterpolate(translateField(testimonial.quote))}</p></div><div class="testimonial-two__client-info"${_scopeId}><div class="testimonial-two__client-img"${_scopeId}><img${ssrRenderAttr("src", testimonial.avatar_link)}${ssrRenderAttr("alt", translateField(testimonial.name))}${_scopeId}></div><div class="testimonial-two__client-content"${_scopeId}><h4 class="testimonial-two__client-name"${_scopeId}><span${_scopeId}>${ssrInterpolate(translateField(testimonial.name))}</span></h4><p class="testimonial-two__sub-title"${_scopeId}>${ssrInterpolate(translateField(testimonial.position))}</p></div></div><div class="testimonial-two__quote"${_scopeId}><span class="icon-right-quote"${_scopeId}></span></div></div></div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<div class="text-center py-5"${_scopeId}><p${_scopeId}>${ssrInterpolate(trans("No testimonials found."))}</p></div>`);
            }
            _push2(`</div></section>`);
          } else {
            return [
              createVNode(_sfc_main$N, {
                title: trans("Testimonials")
              }, null, 8, ["title"]),
              createVNode("section", { class: "testimonials-page" }, [
                createVNode("div", { class: "container" }, [
                  testimonials.value && testimonials.value.length > 0 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "row"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(testimonials.value, (testimonial) => {
                      return openBlock(), createBlock("div", {
                        class: "col-xl-4 col-lg-6 col-md-6",
                        key: testimonial.id
                      }, [
                        createVNode("div", { class: "testimonial-two__single" }, [
                          createVNode("div", { class: "testimonial-two__single-inner" }, [
                            createVNode("div", { class: "testimonial-two__star" }, [
                              createVNode("span", { class: "icon-pointed-star" }),
                              createVNode("span", { class: "icon-pointed-star" }),
                              createVNode("span", { class: "icon-pointed-star" }),
                              createVNode("span", { class: "icon-pointed-star" }),
                              createVNode("span", { class: "icon-pointed-star" })
                            ]),
                            createVNode("p", { class: "testimonial-two__text" }, toDisplayString(translateField(testimonial.quote)), 1)
                          ]),
                          createVNode("div", { class: "testimonial-two__client-info" }, [
                            createVNode("div", { class: "testimonial-two__client-img" }, [
                              createVNode("img", {
                                src: testimonial.avatar_link,
                                alt: translateField(testimonial.name)
                              }, null, 8, ["src", "alt"])
                            ]),
                            createVNode("div", { class: "testimonial-two__client-content" }, [
                              createVNode("h4", { class: "testimonial-two__client-name" }, [
                                createVNode("span", null, toDisplayString(translateField(testimonial.name)), 1)
                              ]),
                              createVNode("p", { class: "testimonial-two__sub-title" }, toDisplayString(translateField(testimonial.position)), 1)
                            ])
                          ]),
                          createVNode("div", { class: "testimonial-two__quote" }, [
                            createVNode("span", { class: "icon-right-quote" })
                          ])
                        ])
                      ]);
                    }), 128))
                  ])) : (openBlock(), createBlock("div", {
                    key: 1,
                    class: "text-center py-5"
                  }, [
                    createVNode("p", null, toDisplayString(trans("No testimonials found.")), 1)
                  ]))
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$C = _sfc_main$C.setup;
_sfc_main$C.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("Modules/Cms/resources/assets/js/Pages/Testimonials.vue");
  return _sfc_setup$C ? _sfc_setup$C(props, ctx) : void 0;
};
const __vite_glob_0_10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$C
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$B = {
  __name: "ProductCard",
  __ssrInlineRender: true,
  props: {
    item: {
      type: Object,
      required: true
    },
    locale: {
      type: String,
      default: "en"
    },
    variant: {
      type: String,
      default: "default"
    }
  },
  setup(__props) {
    const props = __props;
    const page = usePage();
    const trans = (key) => {
      var _a;
      return ((_a = page.props.translations) == null ? void 0 : _a[key]) || key;
    };
    const cardUrl = computed(() => {
      var _a;
      if (!((_a = props.item) == null ? void 0 : _a.slug)) {
        return "#";
      }
      try {
        return route("product.show", props.item.slug);
      } catch {
        return "#";
      }
    });
    const truncate = (text, length) => {
      if (!text) {
        return "";
      }
      return text.length > length ? `${text.substring(0, length)}…` : text;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<article${ssrRenderAttrs(mergeProps({ class: "blog-article hover-img" }, _attrs))} data-v-cdc1a0fb>`);
      _push(ssrRenderComponent(unref(Link), {
        href: cardUrl.value,
        class: "entry_image img-style"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (__props.item.main_image_link) {
              _push2(`<img${ssrRenderAttr("src", __props.item.main_image_link)}${ssrRenderAttr("alt", __props.item.name)} width="732" height="412" loading="lazy" decoding="async" data-v-cdc1a0fb${_scopeId}>`);
            } else {
              _push2(`<div class="product-card__placeholder" aria-hidden="true" data-v-cdc1a0fb${_scopeId}><span class="icon icon-star" data-v-cdc1a0fb${_scopeId}></span></div>`);
            }
          } else {
            return [
              __props.item.main_image_link ? (openBlock(), createBlock("img", {
                key: 0,
                src: __props.item.main_image_link,
                alt: __props.item.name,
                width: "732",
                height: "412",
                loading: "lazy",
                decoding: "async"
              }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                key: 1,
                class: "product-card__placeholder",
                "aria-hidden": "true"
              }, [
                createVNode("span", { class: "icon icon-star" })
              ]))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="article_content" data-v-cdc1a0fb>`);
      if (__props.item.category) {
        _push(`<p class="text-caption font-2 text-main-5" data-v-cdc1a0fb>${ssrInterpolate(__props.item.category.name)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(unref(Link), {
        href: cardUrl.value,
        class: "entry_title font-3 h5 link text-main-2"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.item.name)}`);
          } else {
            return [
              createTextVNode(toDisplayString(__props.item.name), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      if (__props.item.short_description && __props.variant !== "compact") {
        _push(`<p class="entry_desc" data-v-cdc1a0fb>${ssrInterpolate(truncate(__props.item.short_description, __props.variant === "compact" ? 80 : 130))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="br-line has-dot" data-v-cdc1a0fb></div><div class="entry_meta" data-v-cdc1a0fb>`);
      if (__props.item.is_featured) {
        _push(`<div class="meta meta__tag" data-v-cdc1a0fb><i class="icon icon-Tag" data-v-cdc1a0fb></i><span class="meta-text text-body-3" data-v-cdc1a0fb>${ssrInterpolate(trans("Featured"))}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(unref(Link), {
        href: cardUrl.value,
        class: "tf-btn text-body-3 animate-btn"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(trans("View Details"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(trans("View Details")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></article>`);
    };
  }
};
const _sfc_setup$B = _sfc_main$B.setup;
_sfc_main$B.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/ProductCard.vue");
  return _sfc_setup$B ? _sfc_setup$B(props, ctx) : void 0;
};
const ProductCard = /* @__PURE__ */ _export_sfc(_sfc_main$B, [["__scopeId", "data-v-cdc1a0fb"]]);
const __default__$3 = {
  components: {
    AppLayout: _sfc_main$R,
    CtaTwo: _sfc_main$J,
    ProductCard
  }
};
const _sfc_main$A = /* @__PURE__ */ Object.assign(__default__$3, {
  __name: "ProductIndex",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const trans = (key) => page.props.translations[key] || key;
    const seo = computed(() => page.props.seo);
    const settings = computed(() => page.props.settings || {});
    const locale = computed(() => page.props.locale || "en");
    const categories = computed(() => page.props.categories || []);
    const recentProducts = computed(() => page.props.recentProducts || []);
    const filters = computed(() => page.props.filters || {});
    const meta = computed(() => page.props.meta || {});
    const totalProductsCount = computed(() => page.props.totalProductsCount || 0);
    const searchQuery = ref(filters.value.search || "");
    const products = computed(() => {
      const source = page.props.products || { data: [], links: [], last_page: 1 };
      const data = Array.isArray(source.data) ? source.data.filter((product) => product && product.id) : [];
      return {
        ...source,
        data
      };
    });
    const metaTitle = computed(() => meta.value.title || `${trans("Products")} | ${seo.value.website_name || ""}`.trim());
    const metaDescription = computed(() => meta.value.description || trans("Browse our B2B product catalog.") || seo.value.website_desc || "");
    const metaKeywords = computed(() => meta.value.keywords || trans("products, B2B catalog, SaaS") || seo.value.website_keywords || "");
    const metaImage = computed(() => {
      var _a, _b, _c, _d, _e;
      return ((_b = (_a = meta.value) == null ? void 0 : _a.og) == null ? void 0 : _b.image) || ((_d = (_c = meta.value) == null ? void 0 : _c.twitter) == null ? void 0 : _d.image) || ((_e = settings.value) == null ? void 0 : _e.meta_img) || "";
    });
    const metaCanonical = computed(() => meta.value.canonical || "");
    const metaRobots = computed(() => meta.value.robots || "index, follow");
    const productUrl = (product) => {
      if (!(product == null ? void 0 : product.slug)) {
        return "#";
      }
      try {
        return route("product.show", product.slug);
      } catch {
        return "#";
      }
    };
    const categoryUrl = (slug = null) => {
      const params = {};
      if (slug) {
        params.category = slug;
      }
      if (searchQuery.value) {
        params.search = searchQuery.value;
      }
      try {
        return route("product.index", params);
      } catch {
        return "/products";
      }
    };
    const submitSearch = () => {
      var _a;
      const params = {};
      if ((_a = searchQuery.value) == null ? void 0 : _a.trim()) {
        params.search = searchQuery.value.trim();
      }
      if (filters.value.category) {
        params.category = filters.value.category;
      }
      router.get(route("product.index"), params, {
        preserveState: true,
        preserveScroll: true
      });
    };
    const stripPaginationLabel = (label) => String(label || "").replace(/<[^>]*>/g, "").trim();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), null, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<title data-v-c947084a${_scopeId}>${ssrInterpolate(metaTitle.value)}</title><meta name="description"${ssrRenderAttr("content", metaDescription.value)} data-v-c947084a${_scopeId}><meta name="keywords"${ssrRenderAttr("content", metaKeywords.value)} data-v-c947084a${_scopeId}><meta name="robots"${ssrRenderAttr("content", metaRobots.value)} data-v-c947084a${_scopeId}>`);
            if (metaCanonical.value) {
              _push2(`<link rel="canonical"${ssrRenderAttr("href", metaCanonical.value)} data-v-c947084a${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<meta property="og:title"${ssrRenderAttr("content", metaTitle.value)} data-v-c947084a${_scopeId}><meta property="og:description"${ssrRenderAttr("content", metaDescription.value)} data-v-c947084a${_scopeId}>`);
            if (metaImage.value) {
              _push2(`<meta property="og:image"${ssrRenderAttr("content", metaImage.value)} data-v-c947084a${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            if (metaCanonical.value) {
              _push2(`<meta property="og:url"${ssrRenderAttr("content", metaCanonical.value)} data-v-c947084a${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<meta property="og:type" content="website" data-v-c947084a${_scopeId}><meta name="twitter:card" content="summary_large_image" data-v-c947084a${_scopeId}><meta name="twitter:title"${ssrRenderAttr("content", metaTitle.value)} data-v-c947084a${_scopeId}><meta name="twitter:description"${ssrRenderAttr("content", metaDescription.value)} data-v-c947084a${_scopeId}>`);
            if (metaImage.value) {
              _push2(`<meta name="twitter:image"${ssrRenderAttr("content", metaImage.value)} data-v-c947084a${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("title", null, toDisplayString(metaTitle.value), 1),
              createVNode("meta", {
                name: "description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "keywords",
                content: metaKeywords.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "robots",
                content: metaRobots.value
              }, null, 8, ["content"]),
              metaCanonical.value ? (openBlock(), createBlock("link", {
                key: 0,
                rel: "canonical",
                href: metaCanonical.value
              }, null, 8, ["href"])) : createCommentVNode("", true),
              createVNode("meta", {
                property: "og:title",
                content: metaTitle.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              metaImage.value ? (openBlock(), createBlock("meta", {
                key: 1,
                property: "og:image",
                content: metaImage.value
              }, null, 8, ["content"])) : createCommentVNode("", true),
              metaCanonical.value ? (openBlock(), createBlock("meta", {
                key: 2,
                property: "og:url",
                content: metaCanonical.value
              }, null, 8, ["content"])) : createCommentVNode("", true),
              createVNode("meta", {
                property: "og:type",
                content: "website"
              }),
              createVNode("meta", {
                name: "twitter:card",
                content: "summary_large_image"
              }),
              createVNode("meta", {
                name: "twitter:title",
                content: metaTitle.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "twitter:description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              metaImage.value ? (openBlock(), createBlock("meta", {
                key: 3,
                name: "twitter:image",
                content: metaImage.value
              }, null, 8, ["content"])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$R, null, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$N, {
              title: trans("Products")
            }, null, _parent2, _scopeId));
            _push2(`<section class="section-page-blog flat-spacing-2" data-v-c947084a${_scopeId}><div class="container" data-v-c947084a${_scopeId}><div class="content-1200" data-v-c947084a${_scopeId}><div class="sect-title wow fadeInUp" data-v-c947084a${_scopeId}><h2 class="s-title font-3" data-v-c947084a${_scopeId}>${ssrInterpolate(trans("B2B Solutions Built for Scale"))}</h2><p class="s-sub_title" data-v-c947084a${_scopeId}>${ssrInterpolate(trans("Discover enterprise-ready platforms and services designed to grow with your business."))}</p></div><div class="page-blog_content" data-v-c947084a${_scopeId}><div class="col-left" data-v-c947084a${_scopeId}>`);
            if (products.value.data.length) {
              _push2(`<div class="blog-list products-index__grid" data-v-c947084a${_scopeId}><!--[-->`);
              ssrRenderList(products.value.data, (product) => {
                _push2(ssrRenderComponent(ProductCard, {
                  key: product.id,
                  item: product,
                  locale: locale.value
                }, null, _parent2, _scopeId));
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<div class="products-index__empty" data-v-c947084a${_scopeId}><h3 class="s-title font-3 h4" data-v-c947084a${_scopeId}>${ssrInterpolate(trans("No records found"))}</h3><p class="s-sub_title" data-v-c947084a${_scopeId}>${ssrInterpolate(trans("Check back soon — we are adding new solutions to our catalog."))}</p>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: _ctx.route("product.index"),
                class: "tf-btn animate-btn mt-3"
              }, {
                default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(trans("All Products"))}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(trans("All Products")), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            }
            if (products.value.last_page > 1) {
              _push2(`<div class="pagination-list products-index__pagination" data-v-c947084a${_scopeId}>`);
              if (products.value.prev_page_url) {
                _push2(ssrRenderComponent(unref(Link), {
                  href: products.value.prev_page_url,
                  class: "pagination-item pagination-item--prev",
                  "aria-label": "Previous"
                }, {
                  default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<span class="icon icon-CaretDoubleRight fs-20" data-v-c947084a${_scopeId2}></span>`);
                    } else {
                      return [
                        createVNode("span", { class: "icon icon-CaretDoubleRight fs-20" })
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`<!--[-->`);
              ssrRenderList(products.value.links, (link, linkIndex) => {
                _push2(`<!--[-->`);
                if (link.url && linkIndex > 0 && linkIndex < products.value.links.length - 1) {
                  _push2(ssrRenderComponent(unref(Link), {
                    href: link.url,
                    class: ["pagination-item", { active: link.active }]
                  }, {
                    default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`<span data-v-c947084a${_scopeId2}>${ssrInterpolate(stripPaginationLabel(link.label))}</span>`);
                      } else {
                        return [
                          createVNode("span", null, toDisplayString(stripPaginationLabel(link.label)), 1)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<!--]-->`);
              });
              _push2(`<!--]-->`);
              if (products.value.next_page_url) {
                _push2(ssrRenderComponent(unref(Link), {
                  href: products.value.next_page_url,
                  class: "pagination-item",
                  "aria-label": "Next"
                }, {
                  default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<span class="icon icon-CaretDoubleRight fs-20" data-v-c947084a${_scopeId2}></span>`);
                    } else {
                      return [
                        createVNode("span", { class: "icon icon-CaretDoubleRight fs-20" })
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><aside class="col-right" data-v-c947084a${_scopeId}><div class="blog-sidebar sidebar-content-wrap" data-v-c947084a${_scopeId}><div class="sidebar-item" data-v-c947084a${_scopeId}><h5 class="sb-title font-3 text-linear" data-v-c947084a${_scopeId}>${ssrInterpolate(trans("Search"))}</h5><div class="br-line has-dot" data-v-c947084a${_scopeId}></div><form class="form-search" data-v-c947084a${_scopeId}><input${ssrRenderAttr("value", searchQuery.value)} class="style-large type-radius-2" type="search"${ssrRenderAttr("placeholder", trans("Search products..."))} data-v-c947084a${_scopeId}><button type="submit" class="btn_submit tf-btn text-body-3 style-2 animate-btn animate-dark"${ssrRenderAttr("aria-label", trans("Search"))} data-v-c947084a${_scopeId}><i class="icon icon-MagnifyingGlass" data-v-c947084a${_scopeId}></i></button></form></div><div class="sidebar-item" data-v-c947084a${_scopeId}><h5 class="sb-title font-3 text-linear" data-v-c947084a${_scopeId}>${ssrInterpolate(trans("Product Categories"))}</h5><div class="br-line has-dot" data-v-c947084a${_scopeId}></div><ul class="sb-category" data-v-c947084a${_scopeId}><li data-v-c947084a${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: categoryUrl(),
              class: { active: !filters.value.category }
            }, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span data-v-c947084a${_scopeId2}>${ssrInterpolate(trans("All Products"))} (${ssrInterpolate(totalProductsCount.value)})</span><i class="icon icon-ArrowUpRight" data-v-c947084a${_scopeId2}></i>`);
                } else {
                  return [
                    createVNode("span", null, toDisplayString(trans("All Products")) + " (" + toDisplayString(totalProductsCount.value) + ")", 1),
                    createVNode("i", { class: "icon icon-ArrowUpRight" })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</li><!--[-->`);
            ssrRenderList(categories.value, (category) => {
              _push2(`<li data-v-c947084a${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: categoryUrl(category.slug),
                class: { active: filters.value.category === category.slug }
              }, {
                default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span data-v-c947084a${_scopeId2}>${ssrInterpolate(category.name)} (${ssrInterpolate(category.products_count || 0)})</span><i class="icon icon-ArrowUpRight" data-v-c947084a${_scopeId2}></i>`);
                  } else {
                    return [
                      createVNode("span", null, toDisplayString(category.name) + " (" + toDisplayString(category.products_count || 0) + ")", 1),
                      createVNode("i", { class: "icon icon-ArrowUpRight" })
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`</li>`);
            });
            _push2(`<!--]--></ul></div>`);
            if (recentProducts.value.length) {
              _push2(`<div class="sidebar-item" data-v-c947084a${_scopeId}><h5 class="sb-title font-3 text-linear" data-v-c947084a${_scopeId}>${ssrInterpolate(trans("Recent products"))}</h5><div class="br-line has-dot" data-v-c947084a${_scopeId}></div><ul class="sb-recent" data-v-c947084a${_scopeId}><!--[-->`);
              ssrRenderList(recentProducts.value, (item) => {
                _push2(`<li class="sb-recent_item hover-img" data-v-c947084a${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Link), {
                  href: productUrl(item),
                  class: "recent__image img-style"
                }, {
                  default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      if (item.main_image_link) {
                        _push3(`<img${ssrRenderAttr("src", item.main_image_link)}${ssrRenderAttr("alt", item.name)} width="94" height="94" loading="lazy" data-v-c947084a${_scopeId2}>`);
                      } else {
                        _push3(`<!---->`);
                      }
                    } else {
                      return [
                        item.main_image_link ? (openBlock(), createBlock("img", {
                          key: 0,
                          src: item.main_image_link,
                          alt: item.name,
                          width: "94",
                          height: "94",
                          loading: "lazy"
                        }, null, 8, ["src", "alt"])) : createCommentVNode("", true)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`<div class="recent__content" data-v-c947084a${_scopeId}>`);
                if (item.created_at) {
                  _push2(`<div class="entry_date" data-v-c947084a${_scopeId}><i class="icon icon-Clock" data-v-c947084a${_scopeId}></i><span class="date text-body-3" data-v-c947084a${_scopeId}>${ssrInterpolate(item.created_at)}</span></div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(ssrRenderComponent(unref(Link), {
                  href: productUrl(item),
                  class: "entry_name link"
                }, {
                  default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(item.name)}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(item.name), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`</div></li>`);
              });
              _push2(`<!--]--></ul></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></aside></div></div></div></section>`);
            _push2(ssrRenderComponent(_sfc_main$J, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$N, {
                title: trans("Products")
              }, null, 8, ["title"]),
              createVNode("section", { class: "section-page-blog flat-spacing-2" }, [
                createVNode("div", { class: "container" }, [
                  createVNode("div", { class: "content-1200" }, [
                    createVNode("div", { class: "sect-title wow fadeInUp" }, [
                      createVNode("h2", { class: "s-title font-3" }, toDisplayString(trans("B2B Solutions Built for Scale")), 1),
                      createVNode("p", { class: "s-sub_title" }, toDisplayString(trans("Discover enterprise-ready platforms and services designed to grow with your business.")), 1)
                    ]),
                    createVNode("div", { class: "page-blog_content" }, [
                      createVNode("div", { class: "col-left" }, [
                        products.value.data.length ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "blog-list products-index__grid"
                        }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(products.value.data, (product) => {
                            return openBlock(), createBlock(ProductCard, {
                              key: product.id,
                              item: product,
                              locale: locale.value
                            }, null, 8, ["item", "locale"]);
                          }), 128))
                        ])) : (openBlock(), createBlock("div", {
                          key: 1,
                          class: "products-index__empty"
                        }, [
                          createVNode("h3", { class: "s-title font-3 h4" }, toDisplayString(trans("No records found")), 1),
                          createVNode("p", { class: "s-sub_title" }, toDisplayString(trans("Check back soon — we are adding new solutions to our catalog.")), 1),
                          createVNode(unref(Link), {
                            href: _ctx.route("product.index"),
                            class: "tf-btn animate-btn mt-3"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(trans("All Products")), 1)
                            ]),
                            _: 1
                          }, 8, ["href"])
                        ])),
                        products.value.last_page > 1 ? (openBlock(), createBlock("div", {
                          key: 2,
                          class: "pagination-list products-index__pagination"
                        }, [
                          products.value.prev_page_url ? (openBlock(), createBlock(unref(Link), {
                            key: 0,
                            href: products.value.prev_page_url,
                            class: "pagination-item pagination-item--prev",
                            "aria-label": "Previous"
                          }, {
                            default: withCtx(() => [
                              createVNode("span", { class: "icon icon-CaretDoubleRight fs-20" })
                            ]),
                            _: 1
                          }, 8, ["href"])) : createCommentVNode("", true),
                          (openBlock(true), createBlock(Fragment, null, renderList(products.value.links, (link, linkIndex) => {
                            return openBlock(), createBlock(Fragment, { key: linkIndex }, [
                              link.url && linkIndex > 0 && linkIndex < products.value.links.length - 1 ? (openBlock(), createBlock(unref(Link), {
                                key: 0,
                                href: link.url,
                                class: ["pagination-item", { active: link.active }]
                              }, {
                                default: withCtx(() => [
                                  createVNode("span", null, toDisplayString(stripPaginationLabel(link.label)), 1)
                                ]),
                                _: 2
                              }, 1032, ["href", "class"])) : createCommentVNode("", true)
                            ], 64);
                          }), 128)),
                          products.value.next_page_url ? (openBlock(), createBlock(unref(Link), {
                            key: 1,
                            href: products.value.next_page_url,
                            class: "pagination-item",
                            "aria-label": "Next"
                          }, {
                            default: withCtx(() => [
                              createVNode("span", { class: "icon icon-CaretDoubleRight fs-20" })
                            ]),
                            _: 1
                          }, 8, ["href"])) : createCommentVNode("", true)
                        ])) : createCommentVNode("", true)
                      ]),
                      createVNode("aside", { class: "col-right" }, [
                        createVNode("div", { class: "blog-sidebar sidebar-content-wrap" }, [
                          createVNode("div", { class: "sidebar-item" }, [
                            createVNode("h5", { class: "sb-title font-3 text-linear" }, toDisplayString(trans("Search")), 1),
                            createVNode("div", { class: "br-line has-dot" }),
                            createVNode("form", {
                              class: "form-search",
                              onSubmit: withModifiers(submitSearch, ["prevent"])
                            }, [
                              withDirectives(createVNode("input", {
                                "onUpdate:modelValue": ($event) => searchQuery.value = $event,
                                class: "style-large type-radius-2",
                                type: "search",
                                placeholder: trans("Search products...")
                              }, null, 8, ["onUpdate:modelValue", "placeholder"]), [
                                [vModelText, searchQuery.value]
                              ]),
                              createVNode("button", {
                                type: "submit",
                                class: "btn_submit tf-btn text-body-3 style-2 animate-btn animate-dark",
                                "aria-label": trans("Search")
                              }, [
                                createVNode("i", { class: "icon icon-MagnifyingGlass" })
                              ], 8, ["aria-label"])
                            ], 32)
                          ]),
                          createVNode("div", { class: "sidebar-item" }, [
                            createVNode("h5", { class: "sb-title font-3 text-linear" }, toDisplayString(trans("Product Categories")), 1),
                            createVNode("div", { class: "br-line has-dot" }),
                            createVNode("ul", { class: "sb-category" }, [
                              createVNode("li", null, [
                                createVNode(unref(Link), {
                                  href: categoryUrl(),
                                  class: { active: !filters.value.category }
                                }, {
                                  default: withCtx(() => [
                                    createVNode("span", null, toDisplayString(trans("All Products")) + " (" + toDisplayString(totalProductsCount.value) + ")", 1),
                                    createVNode("i", { class: "icon icon-ArrowUpRight" })
                                  ]),
                                  _: 1
                                }, 8, ["href", "class"])
                              ]),
                              (openBlock(true), createBlock(Fragment, null, renderList(categories.value, (category) => {
                                return openBlock(), createBlock("li", {
                                  key: category.id
                                }, [
                                  createVNode(unref(Link), {
                                    href: categoryUrl(category.slug),
                                    class: { active: filters.value.category === category.slug }
                                  }, {
                                    default: withCtx(() => [
                                      createVNode("span", null, toDisplayString(category.name) + " (" + toDisplayString(category.products_count || 0) + ")", 1),
                                      createVNode("i", { class: "icon icon-ArrowUpRight" })
                                    ]),
                                    _: 2
                                  }, 1032, ["href", "class"])
                                ]);
                              }), 128))
                            ])
                          ]),
                          recentProducts.value.length ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "sidebar-item"
                          }, [
                            createVNode("h5", { class: "sb-title font-3 text-linear" }, toDisplayString(trans("Recent products")), 1),
                            createVNode("div", { class: "br-line has-dot" }),
                            createVNode("ul", { class: "sb-recent" }, [
                              (openBlock(true), createBlock(Fragment, null, renderList(recentProducts.value, (item) => {
                                return openBlock(), createBlock("li", {
                                  key: item.id,
                                  class: "sb-recent_item hover-img"
                                }, [
                                  createVNode(unref(Link), {
                                    href: productUrl(item),
                                    class: "recent__image img-style"
                                  }, {
                                    default: withCtx(() => [
                                      item.main_image_link ? (openBlock(), createBlock("img", {
                                        key: 0,
                                        src: item.main_image_link,
                                        alt: item.name,
                                        width: "94",
                                        height: "94",
                                        loading: "lazy"
                                      }, null, 8, ["src", "alt"])) : createCommentVNode("", true)
                                    ]),
                                    _: 2
                                  }, 1032, ["href"]),
                                  createVNode("div", { class: "recent__content" }, [
                                    item.created_at ? (openBlock(), createBlock("div", {
                                      key: 0,
                                      class: "entry_date"
                                    }, [
                                      createVNode("i", { class: "icon icon-Clock" }),
                                      createVNode("span", { class: "date text-body-3" }, toDisplayString(item.created_at), 1)
                                    ])) : createCommentVNode("", true),
                                    createVNode(unref(Link), {
                                      href: productUrl(item),
                                      class: "entry_name link"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(item.name), 1)
                                      ]),
                                      _: 2
                                    }, 1032, ["href"])
                                  ])
                                ]);
                              }), 128))
                            ])
                          ])) : createCommentVNode("", true)
                        ])
                      ])
                    ])
                  ])
                ])
              ]),
              createVNode(_sfc_main$J)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$A = _sfc_main$A.setup;
_sfc_main$A.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("Modules/Product/resources/assets/js/Pages/ProductIndex.vue");
  return _sfc_setup$A ? _sfc_setup$A(props, ctx) : void 0;
};
const ProductIndex = /* @__PURE__ */ _export_sfc(_sfc_main$A, [["__scopeId", "data-v-c947084a"]]);
const __vite_glob_0_11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ProductIndex
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$z = {
  __name: "ContactRequestModal",
  __ssrInlineRender: true,
  props: {
    modalId: {
      type: String,
      default: "productContactModal"
    },
    title: {
      type: String,
      default: "Contact Us"
    },
    description: {
      type: String,
      default: ""
    },
    defaultSubject: {
      type: String,
      default: ""
    },
    defaultMessage: {
      type: String,
      default: ""
    },
    submitLabel: {
      type: String,
      default: "Submit"
    }
  },
  setup(__props, { expose: __expose }) {
    const props = __props;
    const page = usePage();
    const trans = (key) => page.props.translations[key] || key;
    computed(() => page.props.locale || "en");
    const modalElement = ref(null);
    const submitSuccess = ref(false);
    let modalInstance = null;
    const contactForm = useForm({
      name: "",
      email: "",
      mobile: "",
      subject: props.defaultSubject,
      message: props.defaultMessage
    });
    watch(() => props.defaultSubject, (value) => {
      contactForm.subject = value;
    });
    watch(() => props.defaultMessage, (value) => {
      contactForm.message = value;
    });
    const show = () => {
      contactForm.subject = props.defaultSubject;
      contactForm.message = props.defaultMessage;
      if (modalInstance) {
        modalInstance.show();
      }
    };
    const hide = () => {
      if (modalInstance) {
        modalInstance.hide();
      }
    };
    onMounted(() => {
      var _a;
      if (modalElement.value && ((_a = window.bootstrap) == null ? void 0 : _a.Modal)) {
        modalInstance = new window.bootstrap.Modal(modalElement.value);
      }
    });
    __expose({
      show,
      hide
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "modal fade product-contact-modal",
        id: __props.modalId,
        tabindex: "-1",
        "aria-labelledby": `${__props.modalId}Label`,
        "aria-hidden": "true",
        ref_key: "modalElement",
        ref: modalElement
      }, _attrs))} data-v-b686c0e8><div class="modal-dialog modal-dialog-centered modal-lg" data-v-b686c0e8><div class="modal-content" data-v-b686c0e8><div class="modal-header border-0 pb-0" data-v-b686c0e8><h5 class="modal-title"${ssrRenderAttr("id", `${__props.modalId}Label`)} data-v-b686c0e8>${ssrInterpolate(__props.title)}</h5><button type="button" class="btn-close" data-bs-dismiss="modal"${ssrRenderAttr("aria-label", trans("Close"))} data-v-b686c0e8></button></div><div class="modal-body pt-2" data-v-b686c0e8>`);
      if (__props.description) {
        _push(`<p class="product-contact-modal__description mb-4" data-v-b686c0e8>${ssrInterpolate(__props.description)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<form class="form-get_in" data-v-b686c0e8><div class="form-content-2" data-v-b686c0e8><div class="tf-grid-layout sm-col-2" data-v-b686c0e8><fieldset data-v-b686c0e8><label class="label-text text-body-3" data-v-b686c0e8>${ssrInterpolate(trans("Full Name"))}</label><input${ssrRenderAttr("value", unref(contactForm).name)} type="text" name="name"${ssrRenderAttr("placeholder", trans("Full Name"))} class="${ssrRenderClass({ error: unref(contactForm).errors.name })}"${ssrIncludeBooleanAttr(unref(contactForm).processing) ? " disabled" : ""} required data-v-b686c0e8>`);
      if (unref(contactForm).errors.name) {
        _push(`<div class="text-danger mt-1 small" data-v-b686c0e8>${ssrInterpolate(unref(contactForm).errors.name)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</fieldset><fieldset data-v-b686c0e8><label class="label-text text-body-3" data-v-b686c0e8>${ssrInterpolate(trans("Email"))}</label><input${ssrRenderAttr("value", unref(contactForm).email)} type="email" name="email"${ssrRenderAttr("placeholder", trans("Email"))} class="${ssrRenderClass({ error: unref(contactForm).errors.email })}"${ssrIncludeBooleanAttr(unref(contactForm).processing) ? " disabled" : ""} required data-v-b686c0e8>`);
      if (unref(contactForm).errors.email) {
        _push(`<div class="text-danger mt-1 small" data-v-b686c0e8>${ssrInterpolate(unref(contactForm).errors.email)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</fieldset></div><div class="tf-grid-layout sm-col-2" data-v-b686c0e8><fieldset data-v-b686c0e8><label class="label-text text-body-3" data-v-b686c0e8>${ssrInterpolate(trans("Phone Number"))}</label><input${ssrRenderAttr("value", unref(contactForm).mobile)} type="text" name="mobile"${ssrRenderAttr("placeholder", trans("Phone Number"))} class="${ssrRenderClass({ error: unref(contactForm).errors.mobile })}"${ssrIncludeBooleanAttr(unref(contactForm).processing) ? " disabled" : ""} required data-v-b686c0e8>`);
      if (unref(contactForm).errors.mobile) {
        _push(`<div class="text-danger mt-1 small" data-v-b686c0e8>${ssrInterpolate(unref(contactForm).errors.mobile)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</fieldset><fieldset data-v-b686c0e8><label class="label-text text-body-3" data-v-b686c0e8>${ssrInterpolate(trans("Subject"))}</label><input${ssrRenderAttr("value", unref(contactForm).subject)} type="text" name="subject"${ssrRenderAttr("placeholder", trans("Subject"))} class="${ssrRenderClass({ error: unref(contactForm).errors.subject })}"${ssrIncludeBooleanAttr(unref(contactForm).processing) ? " disabled" : ""} required data-v-b686c0e8>`);
      if (unref(contactForm).errors.subject) {
        _push(`<div class="text-danger mt-1 small" data-v-b686c0e8>${ssrInterpolate(unref(contactForm).errors.subject)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</fieldset></div><fieldset class="d-grid" data-v-b686c0e8><label class="label-text text-body-3" data-v-b686c0e8>${ssrInterpolate(trans("Message"))}</label><textarea name="message"${ssrRenderAttr("placeholder", trans("Message"))} class="${ssrRenderClass({ error: unref(contactForm).errors.message })}"${ssrIncludeBooleanAttr(unref(contactForm).processing) ? " disabled" : ""} required data-v-b686c0e8>${ssrInterpolate(unref(contactForm).message)}</textarea>`);
      if (unref(contactForm).errors.message) {
        _push(`<div class="text-danger mt-1 small" data-v-b686c0e8>${ssrInterpolate(unref(contactForm).errors.message)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</fieldset></div>`);
      if (submitSuccess.value) {
        _push(`<div class="alert alert-success mt-3" data-v-b686c0e8>${ssrInterpolate(trans("Thank you for contacting us! We will get back to you soon."))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button type="submit" class="tf-btn style-2 animate-btn style-high mt-3"${ssrIncludeBooleanAttr(unref(contactForm).processing) ? " disabled" : ""} data-v-b686c0e8>${ssrInterpolate(unref(contactForm).processing ? trans("Sending...") : __props.submitLabel)}</button></form></div></div></div></div>`);
    };
  }
};
const _sfc_setup$z = _sfc_main$z.setup;
_sfc_main$z.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/ContactRequestModal.vue");
  return _sfc_setup$z ? _sfc_setup$z(props, ctx) : void 0;
};
const ContactRequestModal = /* @__PURE__ */ _export_sfc(_sfc_main$z, [["__scopeId", "data-v-b686c0e8"]]);
const __default__$2 = {
  components: {
    AppLayout: _sfc_main$R,
    CtaTwo: _sfc_main$J,
    ContactRequestModal,
    ProductCard
  }
};
const _sfc_main$y = /* @__PURE__ */ Object.assign(__default__$2, {
  __name: "ProductShow",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const trans = (key) => page.props.translations[key] || key;
    computed(() => page.props.asset_path || "");
    const locale = computed(() => page.props.locale || "en");
    const product = computed(() => page.props.product || {});
    const relatedProducts = computed(() => page.props.relatedProducts || []);
    const meta = computed(() => page.props.meta || {});
    const contactModal = ref(null);
    const metaTitle = computed(() => meta.value.title || product.value.seo_title || product.value.name || "");
    const metaDescription = computed(() => meta.value.description || product.value.seo_description || product.value.short_description || "");
    const metaKeywords = computed(() => meta.value.keywords || "");
    const metaImage = computed(() => {
      var _a, _b;
      return ((_b = (_a = meta.value) == null ? void 0 : _a.og) == null ? void 0 : _b.image) || product.value.main_image_link || "";
    });
    const metaRobots = computed(() => meta.value.robots || "index, follow");
    const formattedPrice = computed(() => {
      const raw = product.value.price;
      if (raw === null || raw === void 0 || raw === "") {
        return "";
      }
      const amount = Number(raw).toLocaleString(void 0, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      return `${amount} ${product.value.currency || "USD"}`;
    });
    const billingLabel = computed(() => {
      const type = product.value.billing_type;
      if (!type || type === "one_time") {
        return "";
      }
      const labels = {
        monthly: trans("/mo"),
        quarterly: trans("/quarter"),
        yearly: trans("/yr")
      };
      return labels[type] || "";
    });
    const demoSubject = computed(() => `${trans("Live Demo Request")}: ${product.value.name || ""}`.trim());
    const demoMessage = computed(() => {
      const intro = trans("I would like to request a live demo for this product.");
      const name = product.value.name ? `${trans("Product")}: ${product.value.name}` : "";
      return [intro, name].filter(Boolean).join("\n\n");
    });
    const demoModalDescription = computed(() => trans("Fill out the form below and our team will schedule your live demo."));
    const openDemoModal = () => {
      var _a;
      (_a = contactModal.value) == null ? void 0 : _a.show();
    };
    const getShareUrl = (platform) => {
      if (typeof window === "undefined") {
        return "#";
      }
      const url = encodeURIComponent(window.location.href);
      const title = encodeURIComponent(product.value.name || "");
      switch (platform) {
        case "twitter":
          return `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        case "facebook":
          return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        case "linkedin":
          return `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`;
        default:
          return "#";
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), null, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<title data-v-ee2bb155${_scopeId}>${ssrInterpolate(metaTitle.value)}</title><meta name="description"${ssrRenderAttr("content", metaDescription.value)} data-v-ee2bb155${_scopeId}><meta name="keywords"${ssrRenderAttr("content", metaKeywords.value)} data-v-ee2bb155${_scopeId}><meta name="robots"${ssrRenderAttr("content", metaRobots.value)} data-v-ee2bb155${_scopeId}><meta property="og:title"${ssrRenderAttr("content", metaTitle.value)} data-v-ee2bb155${_scopeId}><meta property="og:description"${ssrRenderAttr("content", metaDescription.value)} data-v-ee2bb155${_scopeId}>`);
            if (metaImage.value) {
              _push2(`<meta property="og:image"${ssrRenderAttr("content", metaImage.value)} data-v-ee2bb155${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<meta property="og:type" content="product" data-v-ee2bb155${_scopeId}><meta name="twitter:card" content="summary_large_image" data-v-ee2bb155${_scopeId}><meta name="twitter:title"${ssrRenderAttr("content", metaTitle.value)} data-v-ee2bb155${_scopeId}><meta name="twitter:description"${ssrRenderAttr("content", metaDescription.value)} data-v-ee2bb155${_scopeId}>`);
            if (metaImage.value) {
              _push2(`<meta name="twitter:image"${ssrRenderAttr("content", metaImage.value)} data-v-ee2bb155${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("title", null, toDisplayString(metaTitle.value), 1),
              createVNode("meta", {
                name: "description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "keywords",
                content: metaKeywords.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "robots",
                content: metaRobots.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:title",
                content: metaTitle.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              metaImage.value ? (openBlock(), createBlock("meta", {
                key: 0,
                property: "og:image",
                content: metaImage.value
              }, null, 8, ["content"])) : createCommentVNode("", true),
              createVNode("meta", {
                property: "og:type",
                content: "product"
              }),
              createVNode("meta", {
                name: "twitter:card",
                content: "summary_large_image"
              }),
              createVNode("meta", {
                name: "twitter:title",
                content: metaTitle.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "twitter:description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              metaImage.value ? (openBlock(), createBlock("meta", {
                key: 1,
                name: "twitter:image",
                content: metaImage.value
              }, null, 8, ["content"])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$R, null, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$N, {
              title: product.value.name
            }, null, _parent2, _scopeId));
            _push2(`<section class="blog-details products-page" data-v-ee2bb155${_scopeId}><div class="products-page__bg" aria-hidden="true" data-v-ee2bb155${_scopeId}><div class="products-page__orb products-page__orb--one" data-v-ee2bb155${_scopeId}></div><div class="products-page__orb products-page__orb--two" data-v-ee2bb155${_scopeId}></div><div class="products-page__orb products-page__orb--three" data-v-ee2bb155${_scopeId}></div></div><div class="container position-relative" data-v-ee2bb155${_scopeId}><div class="row" data-v-ee2bb155${_scopeId}><div class="col-xl-12" data-v-ee2bb155${_scopeId}><article class="product-detail" data-v-ee2bb155${_scopeId}><div class="product-detail__glow" aria-hidden="true" data-v-ee2bb155${_scopeId}></div><header class="product-detail__header" data-v-ee2bb155${_scopeId}><div class="product-detail__identity" data-v-ee2bb155${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("product.index"),
              class: "product-detail__thumb"
            }, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<img${ssrRenderAttr("src", product.value.main_image_link)}${ssrRenderAttr("alt", product.value.name)} loading="lazy" decoding="async" data-v-ee2bb155${_scopeId2}>`);
                } else {
                  return [
                    createVNode("img", {
                      src: product.value.main_image_link,
                      alt: product.value.name,
                      loading: "lazy",
                      decoding: "async"
                    }, null, 8, ["src", "alt"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="product-detail__intro" data-v-ee2bb155${_scopeId}>`);
            if (product.value.category) {
              _push2(`<p class="product-detail__category" data-v-ee2bb155${_scopeId}>${ssrInterpolate(product.value.category.name)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<h1 class="product-detail__title" data-v-ee2bb155${_scopeId}>${ssrInterpolate(product.value.name)}</h1>`);
            if (formattedPrice.value) {
              _push2(`<p class="product-detail__price" data-v-ee2bb155${_scopeId}><span class="product-detail__price-amount" data-v-ee2bb155${_scopeId}>${ssrInterpolate(formattedPrice.value)}</span>`);
              if (billingLabel.value) {
                _push2(`<span class="product-detail__price-billing" data-v-ee2bb155${_scopeId}>${ssrInterpolate(billingLabel.value)}</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</p>`);
            } else {
              _push2(`<!---->`);
            }
            if (product.value.short_description) {
              _push2(`<p class="product-detail__subtitle" data-v-ee2bb155${_scopeId}>${ssrInterpolate(product.value.short_description)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><div class="product-detail__actions" data-v-ee2bb155${_scopeId}><div class="product-detail__share" data-v-ee2bb155${_scopeId}><span class="product-detail__share-label" data-v-ee2bb155${_scopeId}>${ssrInterpolate(trans("Share now"))}</span><div class="product-detail__share-links" data-v-ee2bb155${_scopeId}><a${ssrRenderAttr("href", getShareUrl("facebook"))} target="_blank" rel="noopener" class="product-detail__share-btn" aria-label="Facebook" data-v-ee2bb155${_scopeId}><span class="icon-facebook" data-v-ee2bb155${_scopeId}></span></a><a${ssrRenderAttr("href", getShareUrl("twitter"))} target="_blank" rel="noopener" class="product-detail__share-btn" aria-label="Twitter" data-v-ee2bb155${_scopeId}><span class="fab fa-twitter" data-v-ee2bb155${_scopeId}></span></a><a${ssrRenderAttr("href", getShareUrl("linkedin"))} target="_blank" rel="noopener" class="product-detail__share-btn" aria-label="LinkedIn" data-v-ee2bb155${_scopeId}><span class="icon-linkedin" data-v-ee2bb155${_scopeId}></span></a></div></div><button type="button" class="product-detail__pill product-detail__pill--cta" data-v-ee2bb155${_scopeId}>${ssrInterpolate(trans("Request Live Demo"))} <span class="${ssrRenderClass(`icon-${locale.value === "ar" ? "left" : "right"}-arrow`)}" data-v-ee2bb155${_scopeId}></span></button></div></header>`);
            if (product.value.category || product.value.is_featured) {
              _push2(`<div class="product-detail__meta" data-v-ee2bb155${_scopeId}>`);
              if (product.value.category) {
                _push2(`<div class="product-detail__pill" data-v-ee2bb155${_scopeId}><i class="fas fa-tag" data-v-ee2bb155${_scopeId}></i><span data-v-ee2bb155${_scopeId}>${ssrInterpolate(product.value.category.name)}</span></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (product.value.is_featured) {
                _push2(`<div class="product-detail__pill product-detail__pill--featured" data-v-ee2bb155${_scopeId}><i class="fas fa-star" data-v-ee2bb155${_scopeId}></i><span data-v-ee2bb155${_scopeId}>${ssrInterpolate(trans("Featured"))}</span></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="product-detail__hero" data-v-ee2bb155${_scopeId}><img${ssrRenderAttr("src", product.value.main_image_link)}${ssrRenderAttr("alt", product.value.name)} loading="lazy" decoding="async" data-v-ee2bb155${_scopeId}></div>`);
            if (product.value.short_description) {
              _push2(`<div class="product-detail__section" data-v-ee2bb155${_scopeId}><div class="product-detail__section-head" data-v-ee2bb155${_scopeId}><span class="product-detail__section-icon" data-v-ee2bb155${_scopeId}><i class="fas fa-lightbulb" data-v-ee2bb155${_scopeId}></i></span><span class="product-detail__section-label" data-v-ee2bb155${_scopeId}>${ssrInterpolate(trans("Overview"))}</span></div><p class="product-detail__text" data-v-ee2bb155${_scopeId}>${ssrInterpolate(product.value.short_description)}</p></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (product.value.description) {
              _push2(`<div class="product-detail__section" data-v-ee2bb155${_scopeId}><div class="product-detail__section-head" data-v-ee2bb155${_scopeId}><span class="product-detail__section-icon" data-v-ee2bb155${_scopeId}><i class="fas fa-align-left" data-v-ee2bb155${_scopeId}></i></span><span class="product-detail__section-label" data-v-ee2bb155${_scopeId}>${ssrInterpolate(trans("Product Details"))}</span></div><div class="product-detail__content" data-v-ee2bb155${_scopeId}>${product.value.description ?? ""}</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<footer class="product-detail__footer" data-v-ee2bb155${_scopeId}><button type="button" class="product-detail__pill product-detail__pill--cta" data-v-ee2bb155${_scopeId}>${ssrInterpolate(trans("Request Live Demo"))} <span class="${ssrRenderClass(`icon-${locale.value === "ar" ? "left" : "right"}-arrow`)}" data-v-ee2bb155${_scopeId}></span></button>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("contact-us"),
              class: "product-detail__pill"
            }, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(trans("Get in Touch"))} <span class="icon-right-up" data-v-ee2bb155${_scopeId2}></span>`);
                } else {
                  return [
                    createTextVNode(toDisplayString(trans("Get in Touch")) + " ", 1),
                    createVNode("span", { class: "icon-right-up" })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</footer></article>`);
            if (relatedProducts.value.length) {
              _push2(`<div class="products-related" data-v-ee2bb155${_scopeId}><div class="products-related__head" data-v-ee2bb155${_scopeId}><div class="section-title__tagline-box justify-content-center" data-v-ee2bb155${_scopeId}><div class="section-title__tagline-shape-1" data-v-ee2bb155${_scopeId}></div><span class="section-title__tagline" data-v-ee2bb155${_scopeId}>${ssrInterpolate(trans("More Products"))}</span><div class="section-title__tagline-shape-2" data-v-ee2bb155${_scopeId}></div></div><h3 class="products-related__title" data-v-ee2bb155${_scopeId}>${ssrInterpolate(trans("Explore More Solutions"))}</h3></div><div class="row" data-v-ee2bb155${_scopeId}><!--[-->`);
              ssrRenderList(relatedProducts.value, (item) => {
                _push2(`<div class="col-xl-4 col-lg-6 col-md-6" data-v-ee2bb155${_scopeId}>`);
                _push2(ssrRenderComponent(ProductCard, {
                  item,
                  locale: locale.value,
                  variant: "compact"
                }, null, _parent2, _scopeId));
                _push2(`</div>`);
              });
              _push2(`<!--]--></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div></div></section>`);
            _push2(ssrRenderComponent(ContactRequestModal, {
              ref_key: "contactModal",
              ref: contactModal,
              "modal-id": "productDemoModal",
              title: trans("Request Live Demo"),
              description: demoModalDescription.value,
              "default-subject": demoSubject.value,
              "default-message": demoMessage.value,
              "submit-label": trans("Send Request")
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$J, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$N, {
                title: product.value.name
              }, null, 8, ["title"]),
              createVNode("section", { class: "blog-details products-page" }, [
                createVNode("div", {
                  class: "products-page__bg",
                  "aria-hidden": "true"
                }, [
                  createVNode("div", { class: "products-page__orb products-page__orb--one" }),
                  createVNode("div", { class: "products-page__orb products-page__orb--two" }),
                  createVNode("div", { class: "products-page__orb products-page__orb--three" })
                ]),
                createVNode("div", { class: "container position-relative" }, [
                  createVNode("div", { class: "row" }, [
                    createVNode("div", { class: "col-xl-12" }, [
                      createVNode("article", { class: "product-detail" }, [
                        createVNode("div", {
                          class: "product-detail__glow",
                          "aria-hidden": "true"
                        }),
                        createVNode("header", { class: "product-detail__header" }, [
                          createVNode("div", { class: "product-detail__identity" }, [
                            createVNode(unref(Link), {
                              href: _ctx.route("product.index"),
                              class: "product-detail__thumb"
                            }, {
                              default: withCtx(() => [
                                createVNode("img", {
                                  src: product.value.main_image_link,
                                  alt: product.value.name,
                                  loading: "lazy",
                                  decoding: "async"
                                }, null, 8, ["src", "alt"])
                              ]),
                              _: 1
                            }, 8, ["href"]),
                            createVNode("div", { class: "product-detail__intro" }, [
                              product.value.category ? (openBlock(), createBlock("p", {
                                key: 0,
                                class: "product-detail__category"
                              }, toDisplayString(product.value.category.name), 1)) : createCommentVNode("", true),
                              createVNode("h1", { class: "product-detail__title" }, toDisplayString(product.value.name), 1),
                              formattedPrice.value ? (openBlock(), createBlock("p", {
                                key: 1,
                                class: "product-detail__price"
                              }, [
                                createVNode("span", { class: "product-detail__price-amount" }, toDisplayString(formattedPrice.value), 1),
                                billingLabel.value ? (openBlock(), createBlock("span", {
                                  key: 0,
                                  class: "product-detail__price-billing"
                                }, toDisplayString(billingLabel.value), 1)) : createCommentVNode("", true)
                              ])) : createCommentVNode("", true),
                              product.value.short_description ? (openBlock(), createBlock("p", {
                                key: 2,
                                class: "product-detail__subtitle"
                              }, toDisplayString(product.value.short_description), 1)) : createCommentVNode("", true)
                            ])
                          ]),
                          createVNode("div", { class: "product-detail__actions" }, [
                            createVNode("div", { class: "product-detail__share" }, [
                              createVNode("span", { class: "product-detail__share-label" }, toDisplayString(trans("Share now")), 1),
                              createVNode("div", { class: "product-detail__share-links" }, [
                                createVNode("a", {
                                  href: getShareUrl("facebook"),
                                  target: "_blank",
                                  rel: "noopener",
                                  class: "product-detail__share-btn",
                                  "aria-label": "Facebook"
                                }, [
                                  createVNode("span", { class: "icon-facebook" })
                                ], 8, ["href"]),
                                createVNode("a", {
                                  href: getShareUrl("twitter"),
                                  target: "_blank",
                                  rel: "noopener",
                                  class: "product-detail__share-btn",
                                  "aria-label": "Twitter"
                                }, [
                                  createVNode("span", { class: "fab fa-twitter" })
                                ], 8, ["href"]),
                                createVNode("a", {
                                  href: getShareUrl("linkedin"),
                                  target: "_blank",
                                  rel: "noopener",
                                  class: "product-detail__share-btn",
                                  "aria-label": "LinkedIn"
                                }, [
                                  createVNode("span", { class: "icon-linkedin" })
                                ], 8, ["href"])
                              ])
                            ]),
                            createVNode("button", {
                              type: "button",
                              class: "product-detail__pill product-detail__pill--cta",
                              onClick: openDemoModal
                            }, [
                              createTextVNode(toDisplayString(trans("Request Live Demo")) + " ", 1),
                              createVNode("span", {
                                class: `icon-${locale.value === "ar" ? "left" : "right"}-arrow`
                              }, null, 2)
                            ])
                          ])
                        ]),
                        product.value.category || product.value.is_featured ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "product-detail__meta"
                        }, [
                          product.value.category ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "product-detail__pill"
                          }, [
                            createVNode("i", { class: "fas fa-tag" }),
                            createVNode("span", null, toDisplayString(product.value.category.name), 1)
                          ])) : createCommentVNode("", true),
                          product.value.is_featured ? (openBlock(), createBlock("div", {
                            key: 1,
                            class: "product-detail__pill product-detail__pill--featured"
                          }, [
                            createVNode("i", { class: "fas fa-star" }),
                            createVNode("span", null, toDisplayString(trans("Featured")), 1)
                          ])) : createCommentVNode("", true)
                        ])) : createCommentVNode("", true),
                        createVNode("div", { class: "product-detail__hero" }, [
                          createVNode("img", {
                            src: product.value.main_image_link,
                            alt: product.value.name,
                            loading: "lazy",
                            decoding: "async"
                          }, null, 8, ["src", "alt"])
                        ]),
                        product.value.short_description ? (openBlock(), createBlock("div", {
                          key: 1,
                          class: "product-detail__section"
                        }, [
                          createVNode("div", { class: "product-detail__section-head" }, [
                            createVNode("span", { class: "product-detail__section-icon" }, [
                              createVNode("i", { class: "fas fa-lightbulb" })
                            ]),
                            createVNode("span", { class: "product-detail__section-label" }, toDisplayString(trans("Overview")), 1)
                          ]),
                          createVNode("p", { class: "product-detail__text" }, toDisplayString(product.value.short_description), 1)
                        ])) : createCommentVNode("", true),
                        product.value.description ? (openBlock(), createBlock("div", {
                          key: 2,
                          class: "product-detail__section"
                        }, [
                          createVNode("div", { class: "product-detail__section-head" }, [
                            createVNode("span", { class: "product-detail__section-icon" }, [
                              createVNode("i", { class: "fas fa-align-left" })
                            ]),
                            createVNode("span", { class: "product-detail__section-label" }, toDisplayString(trans("Product Details")), 1)
                          ]),
                          createVNode("div", {
                            class: "product-detail__content",
                            innerHTML: product.value.description
                          }, null, 8, ["innerHTML"])
                        ])) : createCommentVNode("", true),
                        createVNode("footer", { class: "product-detail__footer" }, [
                          createVNode("button", {
                            type: "button",
                            class: "product-detail__pill product-detail__pill--cta",
                            onClick: openDemoModal
                          }, [
                            createTextVNode(toDisplayString(trans("Request Live Demo")) + " ", 1),
                            createVNode("span", {
                              class: `icon-${locale.value === "ar" ? "left" : "right"}-arrow`
                            }, null, 2)
                          ]),
                          createVNode(unref(Link), {
                            href: _ctx.route("contact-us"),
                            class: "product-detail__pill"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(trans("Get in Touch")) + " ", 1),
                              createVNode("span", { class: "icon-right-up" })
                            ]),
                            _: 1
                          }, 8, ["href"])
                        ])
                      ]),
                      relatedProducts.value.length ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "products-related"
                      }, [
                        createVNode("div", { class: "products-related__head" }, [
                          createVNode("div", { class: "section-title__tagline-box justify-content-center" }, [
                            createVNode("div", { class: "section-title__tagline-shape-1" }),
                            createVNode("span", { class: "section-title__tagline" }, toDisplayString(trans("More Products")), 1),
                            createVNode("div", { class: "section-title__tagline-shape-2" })
                          ]),
                          createVNode("h3", { class: "products-related__title" }, toDisplayString(trans("Explore More Solutions")), 1)
                        ]),
                        createVNode("div", { class: "row" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(relatedProducts.value, (item) => {
                            return openBlock(), createBlock("div", {
                              key: item.id,
                              class: "col-xl-4 col-lg-6 col-md-6"
                            }, [
                              createVNode(ProductCard, {
                                item,
                                locale: locale.value,
                                variant: "compact"
                              }, null, 8, ["item", "locale"])
                            ]);
                          }), 128))
                        ])
                      ])) : createCommentVNode("", true)
                    ])
                  ])
                ])
              ]),
              createVNode(ContactRequestModal, {
                ref_key: "contactModal",
                ref: contactModal,
                "modal-id": "productDemoModal",
                title: trans("Request Live Demo"),
                description: demoModalDescription.value,
                "default-subject": demoSubject.value,
                "default-message": demoMessage.value,
                "submit-label": trans("Send Request")
              }, null, 8, ["title", "description", "default-subject", "default-message", "submit-label"]),
              createVNode(_sfc_main$J)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$y = _sfc_main$y.setup;
_sfc_main$y.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("Modules/Product/resources/assets/js/Pages/ProductShow.vue");
  return _sfc_setup$y ? _sfc_setup$y(props, ctx) : void 0;
};
const ProductShow = /* @__PURE__ */ _export_sfc(_sfc_main$y, [["__scopeId", "data-v-ee2bb155"]]);
const __vite_glob_0_12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ProductShow
}, Symbol.toStringTag, { value: "Module" }));
function usePortalTranslations() {
  const page = usePage();
  const t3 = (key, replacements = {}) => {
    var _a;
    const parts = key.split(".");
    let value = (_a = page.props.portal) == null ? void 0 : _a.translations;
    for (const part of parts) {
      value = value == null ? void 0 : value[part];
    }
    if (typeof value !== "string") {
      return key;
    }
    return Object.entries(replacements).reduce(
      (text, [placeholder, replacement]) => text.replace(`:${placeholder}`, String(replacement)),
      value
    );
  };
  const paymentStatusLabel = (status) => t3(`payment_status.${status}`);
  const invoiceStatusLabel = (status) => t3(`invoice_status.${status}`);
  const ticketStatusLabel = (status) => t3(`ticket_status.${status}`);
  const ticketPriorityLabel = (priority) => t3(`ticket_priority.${priority}`);
  return { t: t3, paymentStatusLabel, invoiceStatusLabel, ticketStatusLabel, ticketPriorityLabel };
}
const _sfc_main$x = {
  __name: "PortalNav",
  __ssrInlineRender: true,
  props: {
    active: { type: String, default: "dashboard" },
    open: { type: Boolean, default: false }
  },
  emits: ["close"],
  setup(__props) {
    const page = usePage();
    const { t: t3 } = usePortalTranslations();
    const auth = computed(() => page.props.auth);
    const settings = computed(() => page.props.settings || {});
    const storage_path = computed(() => page.props.storage_path || "");
    const seo = computed(() => page.props.seo || {});
    const brandName = computed(() => seo.value.website_name || page.props.appName || "Symfonix");
    const unreadCount = computed(() => {
      var _a;
      return ((_a = page.props.portal) == null ? void 0 : _a.unread_notifications) || 0;
    });
    const openTicketsCount = computed(() => {
      var _a;
      return ((_a = page.props.portal) == null ? void 0 : _a.open_tickets) || 0;
    });
    const logoSrc = computed(() => {
      var _a;
      const logo = (_a = settings.value) == null ? void 0 : _a.site_logo;
      if (!logo || logo === false || logo === "false" || logo === "default.jpg") {
        return "";
      }
      if (/^https?:\/\//i.test(logo) || String(logo).startsWith("//") || String(logo).startsWith("/")) {
        return logo;
      }
      return `${storage_path.value}${logo}`;
    });
    const items = computed(() => [
      {
        key: "dashboard",
        href: route("portal.dashboard"),
        icon: "fas fa-th-large",
        label: t3("menu.my_dashboard")
      },
      {
        key: "projects",
        href: route("portal.projects.index"),
        icon: "fas fa-folder-open",
        label: t3("menu.projects"),
        badge: unreadCount.value || null
      },
      {
        key: "subscriptions",
        href: route("portal.subscriptions.index"),
        icon: "fas fa-sync-alt",
        label: t3("menu.subscriptions")
      },
      {
        key: "tickets",
        href: route("portal.tickets.index"),
        icon: "fas fa-life-ring",
        label: t3("menu.tickets"),
        badge: openTicketsCount.value || null
      },
      {
        key: "profile",
        href: route("portal.profile.index"),
        icon: "fas fa-user-cog",
        label: t3("menu.profile")
      }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d;
      _push(`<aside${ssrRenderAttrs(mergeProps({
        class: ["portal-sidebar", { "portal-sidebar--open": __props.open }],
        "aria-label": "Portal navigation"
      }, _attrs))}><div class="portal-sidebar__brand">`);
      _push(ssrRenderComponent(unref(Link), {
        href: _ctx.route("home"),
        class: "portal-sidebar__logo",
        title: brandName.value
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (logoSrc.value) {
              _push2(`<img${ssrRenderAttr("src", logoSrc.value)}${ssrRenderAttr("alt", brandName.value)}${_scopeId}>`);
            } else {
              _push2(`<span class="portal-sidebar__logo-text"${_scopeId}>${ssrInterpolate(brandName.value)}</span>`);
            }
          } else {
            return [
              logoSrc.value ? (openBlock(), createBlock("img", {
                key: 0,
                src: logoSrc.value,
                alt: brandName.value
              }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("span", {
                key: 1,
                class: "portal-sidebar__logo-text"
              }, toDisplayString(brandName.value), 1))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button type="button" class="portal-sidebar__close d-lg-none"${ssrRenderAttr("aria-label", unref(t3)("menu.close_menu"))}><i class="fas fa-times"></i></button></div><p class="portal-sidebar__label">${ssrInterpolate(unref(t3)("menu.navigation"))}</p><nav class="portal-sidebar__nav"><!--[-->`);
      ssrRenderList(items.value, (item) => {
        _push(ssrRenderComponent(unref(Link), {
          key: item.key,
          href: item.href,
          class: ["portal-sidebar__link", { "portal-sidebar__link--active": __props.active === item.key }],
          onClick: ($event) => _ctx.$emit("close")
        }, {
          default: withCtx((_2, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="portal-sidebar__link-icon"${_scopeId}><i class="${ssrRenderClass(item.icon)}"${_scopeId}></i></span><span class="portal-sidebar__link-text"${_scopeId}>${ssrInterpolate(item.label)}</span>`);
              if (item.badge) {
                _push2(`<span class="portal-sidebar__badge"${_scopeId}>${ssrInterpolate(item.badge)}</span>`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                createVNode("span", { class: "portal-sidebar__link-icon" }, [
                  createVNode("i", {
                    class: item.icon
                  }, null, 2)
                ]),
                createVNode("span", { class: "portal-sidebar__link-text" }, toDisplayString(item.label), 1),
                item.badge ? (openBlock(), createBlock("span", {
                  key: 0,
                  class: "portal-sidebar__badge"
                }, toDisplayString(item.badge), 1)) : createCommentVNode("", true)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></nav><div class="portal-sidebar__footer"><div class="portal-sidebar__user"><span class="portal-sidebar__avatar">`);
      if ((_a = auth.value) == null ? void 0 : _a.avatar) {
        _push(`<img${ssrRenderAttr("src", auth.value.avatar)}${ssrRenderAttr("alt", ((_b = auth.value) == null ? void 0 : _b.name) || "")}>`);
      } else {
        _push(`<i class="fas fa-user"></i>`);
      }
      _push(`</span><div class="portal-sidebar__user-meta"><strong>${ssrInterpolate((_c = auth.value) == null ? void 0 : _c.name)}</strong><span>${ssrInterpolate((_d = auth.value) == null ? void 0 : _d.email)}</span></div></div>`);
      _push(ssrRenderComponent(unref(Link), {
        href: _ctx.route("logout"),
        method: "post",
        as: "button",
        type: "button",
        class: "portal-sidebar__logout"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<i class="fas fa-sign-out-alt"${_scopeId}></i> ${ssrInterpolate(unref(t3)("menu.logout"))}`);
          } else {
            return [
              createVNode("i", { class: "fas fa-sign-out-alt" }),
              createTextVNode(" " + toDisplayString(unref(t3)("menu.logout")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Link), {
        href: _ctx.route("home"),
        class: "portal-sidebar__site-link",
        onClick: ($event) => _ctx.$emit("close")
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<i class="fas fa-external-link-alt"${_scopeId}></i> ${ssrInterpolate(unref(t3)("menu.back_to_site"))}`);
          } else {
            return [
              createVNode("i", { class: "fas fa-external-link-alt" }),
              createTextVNode(" " + toDisplayString(unref(t3)("menu.back_to_site")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></aside>`);
    };
  }
};
const _sfc_setup$x = _sfc_main$x.setup;
_sfc_main$x.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Portal/PortalNav.vue");
  return _sfc_setup$x ? _sfc_setup$x(props, ctx) : void 0;
};
const _sfc_main$w = {
  __name: "PortalShell",
  __ssrInlineRender: true,
  props: {
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    active: { type: String, default: "dashboard" },
    breadcrumbs: { type: Array, default: () => [] },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" }
  },
  setup(__props) {
    const props = __props;
    const page = usePage();
    const { t: t3 } = usePortalTranslations();
    const navOpen = ref(false);
    computed(() => page.props.asset_path || "");
    const seo = computed(() => page.props.seo || {});
    const auth = computed(() => page.props.auth);
    const portalHomeLabel = computed(() => t3("menu.dashboard"));
    const flatBreadcrumbs = computed(() => {
      const items = [
        {
          key: "portal",
          type: "link",
          label: portalHomeLabel.value,
          href: route("portal.dashboard")
        }
      ];
      props.breadcrumbs.forEach((crumb, index) => {
        items.push({ key: `sep-${index}`, type: "separator" });
        if (crumb.href) {
          items.push({
            key: `link-${index}`,
            type: "link",
            label: crumb.label,
            href: crumb.href
          });
        } else {
          items.push({
            key: `text-${index}`,
            type: "text",
            label: crumb.label
          });
        }
      });
      return items;
    });
    const pageTitle = computed(() => {
      const title = props.metaTitle || props.title;
      return `${title} | ${seo.value.website_name || ""}`.trim();
    });
    const pageDescription = computed(() => props.metaDescription || props.subtitle || "");
    watch(navOpen, (open) => {
      document.body.classList.toggle("portal-nav-locked", open);
    });
    watch(() => page.url, () => {
      navOpen.value = false;
    });
    onMounted(() => {
      document.body.classList.add("portal-panel-active");
    });
    onUnmounted(() => {
      document.body.classList.remove("portal-nav-locked");
      document.body.classList.remove("portal-panel-active");
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), null, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<title${_scopeId}>${ssrInterpolate(pageTitle.value)}</title><meta name="description"${ssrRenderAttr("content", pageDescription.value)}${_scopeId}><meta name="robots" content="noindex, nofollow"${_scopeId}>`);
          } else {
            return [
              createVNode("title", null, toDisplayString(pageTitle.value), 1),
              createVNode("meta", {
                name: "description",
                content: pageDescription.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "robots",
                content: "noindex, nofollow"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="${ssrRenderClass([{ "portal-app--nav-open": navOpen.value }, "portal-app"])}"><div class="${ssrRenderClass([{ "portal-app__overlay--visible": navOpen.value }, "portal-app__overlay"])}"></div>`);
      _push(ssrRenderComponent(_sfc_main$x, {
        active: __props.active,
        open: navOpen.value,
        onClose: ($event) => navOpen.value = false
      }, null, _parent));
      _push(`<div class="portal-app__main"><header class="portal-topbar"><div class="portal-topbar__start"><button type="button" class="portal-topbar__menu d-lg-none"${ssrRenderAttr("aria-label", unref(t3)("menu.open_menu"))}${ssrRenderAttr("aria-expanded", navOpen.value)}><i class="fas fa-bars"></i></button><div class="portal-topbar__titles"><nav class="portal-topbar__crumbs" aria-label="Breadcrumb"><ol><!--[-->`);
      ssrRenderList(flatBreadcrumbs.value, (item) => {
        _push(`<li>`);
        if (item.type === "separator") {
          _push(`<span class="portal-topbar__sep" aria-hidden="true">/</span>`);
        } else if (item.type === "link") {
          _push(ssrRenderComponent(unref(Link), {
            href: item.href
          }, {
            default: withCtx((_2, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(item.label)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(item.label), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        } else {
          _push(`<span aria-current="page">${ssrInterpolate(item.label)}</span>`);
        }
        _push(`</li>`);
      });
      _push(`<!--]--></ol></nav><h1 class="portal-topbar__title">${ssrInterpolate(__props.title)}</h1>`);
      if (__props.subtitle) {
        _push(`<p class="portal-topbar__subtitle">${ssrInterpolate(__props.subtitle)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="portal-topbar__end">`);
      _push(ssrRenderComponent(unref(Link), {
        href: _ctx.route("portal.profile.index"),
        class: "portal-topbar__user",
        title: (_a = auth.value) == null ? void 0 : _a.name
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          var _a2, _b, _c, _d, _e, _f;
          if (_push2) {
            _push2(`<span class="portal-topbar__avatar"${_scopeId}>`);
            if ((_a2 = auth.value) == null ? void 0 : _a2.avatar) {
              _push2(`<img${ssrRenderAttr("src", auth.value.avatar)}${ssrRenderAttr("alt", ((_b = auth.value) == null ? void 0 : _b.name) || "")}${_scopeId}>`);
            } else {
              _push2(`<i class="fas fa-user"${_scopeId}></i>`);
            }
            _push2(`</span><span class="portal-topbar__user-name d-none d-md-inline"${_scopeId}>${ssrInterpolate((_c = auth.value) == null ? void 0 : _c.name)}</span>`);
          } else {
            return [
              createVNode("span", { class: "portal-topbar__avatar" }, [
                ((_d = auth.value) == null ? void 0 : _d.avatar) ? (openBlock(), createBlock("img", {
                  key: 0,
                  src: auth.value.avatar,
                  alt: ((_e = auth.value) == null ? void 0 : _e.name) || ""
                }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("i", {
                  key: 1,
                  class: "fas fa-user"
                }))
              ]),
              createVNode("span", { class: "portal-topbar__user-name d-none d-md-inline" }, toDisplayString((_f = auth.value) == null ? void 0 : _f.name), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></header><div class="portal-app__content">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></div></div><!--]-->`);
    };
  }
};
const _sfc_setup$w = _sfc_main$w.setup;
_sfc_main$w.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Portal/PortalShell.vue");
  return _sfc_setup$w ? _sfc_setup$w(props, ctx) : void 0;
};
const _sfc_main$v = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    projects: { type: Object, required: true },
    meta: { type: Object, default: () => ({}) }
  },
  setup(__props) {
    const props = __props;
    const page = usePage();
    const { t: t3, paymentStatusLabel } = usePortalTranslations();
    const locale = computed(() => page.props.locale);
    const metaTitle = computed(() => {
      var _a;
      return ((_a = props.meta) == null ? void 0 : _a.title) || t3("pages.projects_title");
    });
    const metaDescription = computed(() => {
      var _a;
      return ((_a = props.meta) == null ? void 0 : _a.description) || t3("pages.projects_description");
    });
    const formatMoney = (amount, currency) => `${Number(amount).toFixed(2)} ${currency || ""}`.trim();
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$w, mergeProps({
        title: unref(t3)("projects.title"),
        subtitle: unref(t3)("projects.subtitle"),
        active: "projects",
        breadcrumbs: [
          { label: unref(t3)("menu.my_dashboard"), href: _ctx.route("portal.dashboard") },
          { label: unref(t3)("projects.title") }
        ],
        "meta-title": metaTitle.value,
        "meta-description": metaDescription.value
      }, _attrs), {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          var _a, _b;
          if (_push2) {
            if (__props.projects.data.length === 0) {
              _push2(`<div class="portal-panel"${_scopeId}><div class="portal-empty"${_scopeId}><i class="fas fa-folder-open"${_scopeId}></i> ${ssrInterpolate(unref(t3)("projects.no_projects"))}</div></div>`);
            } else {
              _push2(`<div class="row g-4"${_scopeId}><!--[-->`);
              ssrRenderList(__props.projects.data, (project) => {
                var _a2, _b2, _c, _d;
                _push2(`<div class="col-md-6 col-xl-4"${_scopeId}><article class="portal-project-card"${_scopeId}><div class="portal-project-card__top"${_scopeId}><h3 class="portal-project-card__title"${_scopeId}>${ssrInterpolate(project.title)}</h3><span class="portal-badge" style="${ssrRenderStyle({ backgroundColor: (((_a2 = project.status) == null ? void 0 : _a2.color_code) || "#6c757d") + "33", color: ((_b2 = project.status) == null ? void 0 : _b2.color_code) || "#C5C8CD" })}"${_scopeId}>${ssrInterpolate((_c = project.status) == null ? void 0 : _c.name)}</span></div>`);
                if ((_d = project.company) == null ? void 0 : _d.name) {
                  _push2(`<div class="portal-project-card__company"${_scopeId}><i class="fas fa-building me-1"${_scopeId}></i>${ssrInterpolate(project.company.name)}</div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<div class="portal-project-card__meta"${_scopeId}><span${_scopeId}>${ssrInterpolate(unref(t3)("fields.payment_status"))}</span><strong${_scopeId}>${ssrInterpolate(unref(paymentStatusLabel)(project.payment_status))}</strong></div><div class="portal-project-card__meta"${_scopeId}><span${_scopeId}>${ssrInterpolate(unref(t3)("fields.remaining"))}</span><strong${_scopeId}>${ssrInterpolate(formatMoney(project.collection.remaining, project.collection.currency))}</strong></div><div class="mb-3"${_scopeId}><div class="portal-progress"${_scopeId}><div class="portal-progress__bar" style="${ssrRenderStyle({ width: `${project.collection.collection_rate}%` })}"${_scopeId}></div></div></div><div class="portal-project-card__footer"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Link), {
                  href: _ctx.route("portal.projects.show", project.id),
                  class: "thm-btn w-100 text-center"
                }, {
                  default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(unref(t3)("projects.view_details"))} <span class="${ssrRenderClass(`icon-${locale.value === "ar" ? "left" : "right"}-arrow`)}"${_scopeId2}></span>`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(unref(t3)("projects.view_details")) + " ", 1),
                        createVNode("span", {
                          class: `icon-${locale.value === "ar" ? "left" : "right"}-arrow`
                        }, null, 2)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`</div></article></div>`);
              });
              _push2(`<!--]--></div>`);
            }
            if (((_a = __props.projects.links) == null ? void 0 : _a.length) > 3) {
              _push2(`<nav class="portal-pagination" aria-label="Pagination"${_scopeId}><!--[-->`);
              ssrRenderList(__props.projects.links, (link) => {
                _push2(ssrRenderComponent(unref(Link), {
                  key: link.label,
                  href: link.url || "#",
                  class: ["portal-pagination__link", { "portal-pagination__link--active": link.active }]
                }, null, _parent2, _scopeId));
              });
              _push2(`<!--]--></nav>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              __props.projects.data.length === 0 ? (openBlock(), createBlock("div", {
                key: 0,
                class: "portal-panel"
              }, [
                createVNode("div", { class: "portal-empty" }, [
                  createVNode("i", { class: "fas fa-folder-open" }),
                  createTextVNode(" " + toDisplayString(unref(t3)("projects.no_projects")), 1)
                ])
              ])) : (openBlock(), createBlock("div", {
                key: 1,
                class: "row g-4"
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(__props.projects.data, (project) => {
                  var _a2, _b2, _c, _d;
                  return openBlock(), createBlock("div", {
                    key: project.id,
                    class: "col-md-6 col-xl-4"
                  }, [
                    createVNode("article", { class: "portal-project-card" }, [
                      createVNode("div", { class: "portal-project-card__top" }, [
                        createVNode("h3", { class: "portal-project-card__title" }, toDisplayString(project.title), 1),
                        createVNode("span", {
                          class: "portal-badge",
                          style: { backgroundColor: (((_a2 = project.status) == null ? void 0 : _a2.color_code) || "#6c757d") + "33", color: ((_b2 = project.status) == null ? void 0 : _b2.color_code) || "#C5C8CD" }
                        }, toDisplayString((_c = project.status) == null ? void 0 : _c.name), 5)
                      ]),
                      ((_d = project.company) == null ? void 0 : _d.name) ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "portal-project-card__company"
                      }, [
                        createVNode("i", { class: "fas fa-building me-1" }),
                        createTextVNode(toDisplayString(project.company.name), 1)
                      ])) : createCommentVNode("", true),
                      createVNode("div", { class: "portal-project-card__meta" }, [
                        createVNode("span", null, toDisplayString(unref(t3)("fields.payment_status")), 1),
                        createVNode("strong", null, toDisplayString(unref(paymentStatusLabel)(project.payment_status)), 1)
                      ]),
                      createVNode("div", { class: "portal-project-card__meta" }, [
                        createVNode("span", null, toDisplayString(unref(t3)("fields.remaining")), 1),
                        createVNode("strong", null, toDisplayString(formatMoney(project.collection.remaining, project.collection.currency)), 1)
                      ]),
                      createVNode("div", { class: "mb-3" }, [
                        createVNode("div", { class: "portal-progress" }, [
                          createVNode("div", {
                            class: "portal-progress__bar",
                            style: { width: `${project.collection.collection_rate}%` }
                          }, null, 4)
                        ])
                      ]),
                      createVNode("div", { class: "portal-project-card__footer" }, [
                        createVNode(unref(Link), {
                          href: _ctx.route("portal.projects.show", project.id),
                          class: "thm-btn w-100 text-center"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(unref(t3)("projects.view_details")) + " ", 1),
                            createVNode("span", {
                              class: `icon-${locale.value === "ar" ? "left" : "right"}-arrow`
                            }, null, 2)
                          ]),
                          _: 1
                        }, 8, ["href"])
                      ])
                    ])
                  ]);
                }), 128))
              ])),
              ((_b = __props.projects.links) == null ? void 0 : _b.length) > 3 ? (openBlock(), createBlock("nav", {
                key: 2,
                class: "portal-pagination",
                "aria-label": "Pagination"
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(__props.projects.links, (link) => {
                  return openBlock(), createBlock(unref(Link), {
                    key: link.label,
                    href: link.url || "#",
                    class: ["portal-pagination__link", { "portal-pagination__link--active": link.active }],
                    innerHTML: link.label
                  }, null, 8, ["href", "class", "innerHTML"]);
                }), 128))
              ])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$v = _sfc_main$v.setup;
_sfc_main$v.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("Modules/Project/resources/assets/js/Pages/Portal/Projects/Index.vue");
  return _sfc_setup$v ? _sfc_setup$v(props, ctx) : void 0;
};
const __vite_glob_0_13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$v
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$u = {
  __name: "Show",
  __ssrInlineRender: true,
  props: {
    project: { type: Object, required: true },
    invoices: { type: Array, default: () => [] },
    meta: { type: Object, default: () => ({}) }
  },
  setup(__props) {
    const props = __props;
    const page = usePage();
    const { t: t3, paymentStatusLabel, invoiceStatusLabel } = usePortalTranslations();
    const reviewForm = useForm({
      quote: ""
    });
    const reviewQuote = computed(() => {
      var _a;
      const quote = (_a = props.project.review) == null ? void 0 : _a.quote;
      if (!quote) return "";
      if (typeof quote === "string") return quote;
      const loc = page.props.locale || "en";
      return quote[loc] || Object.values(quote)[0] || "";
    });
    const submitReview = () => {
      reviewForm.post(route("portal.projects.review", props.project.id), {
        preserveScroll: true,
        onSuccess: () => reviewForm.reset("quote")
      });
    };
    const metaTitle = computed(() => {
      var _a;
      return ((_a = props.meta) == null ? void 0 : _a.title) || props.project.title;
    });
    const metaDescription = computed(() => {
      var _a;
      return ((_a = props.meta) == null ? void 0 : _a.description) || t3("pages.project_show_description");
    });
    const collection = computed(() => props.project.collection ?? {
      budget: 0,
      invoiced: 0,
      remaining: 0,
      currency: "USD",
      collection_rate: 0
    });
    const invoiceList = computed(() => {
      if (Array.isArray(props.invoices)) {
        return props.invoices;
      }
      return Object.values(props.invoices ?? {});
    });
    const attachments = computed(() => {
      const items = props.project.attachments;
      return Array.isArray(items) ? items : [];
    });
    const statusBadgeStyle = computed(() => {
      var _a;
      const color = ((_a = props.project.status) == null ? void 0 : _a.color_code) || "#6c757d";
      return {
        backgroundColor: `${color}33`,
        color
      };
    });
    const formatMoney = (amount, currency) => `${Number(amount ?? 0).toFixed(2)} ${currency || ""}`.trim();
    const invoiceBadgeClass = (status) => {
      if (status === "paid") return "portal-badge--paid";
      if (status === "overdue") return "portal-badge--overdue";
      return "portal-badge--invoice";
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(ssrRenderComponent(_sfc_main$w, mergeProps({
        title: __props.project.title,
        subtitle: (_a = __props.project.company) == null ? void 0 : _a.name,
        active: "projects",
        breadcrumbs: [
          { label: unref(t3)("menu.my_dashboard"), href: _ctx.route("portal.dashboard") },
          { label: unref(t3)("projects.title"), href: _ctx.route("portal.projects.index") },
          { label: __props.project.title }
        ],
        "meta-title": metaTitle.value,
        "meta-description": metaDescription.value
      }, _attrs), {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          var _a2, _b, _c, _d;
          if (_push2) {
            _push2(`<div class="portal-grid portal-grid--show"${_scopeId}><div${_scopeId}><div class="portal-panel"${_scopeId}><div class="portal-panel__header"${_scopeId}><h2 class="portal-panel__title"${_scopeId}>${ssrInterpolate(unref(t3)("projects.details"))}</h2></div><div class="portal-panel__body"${_scopeId}><div class="portal-details"${_scopeId}><div class="portal-details__row"${_scopeId}><div class="portal-details__label"${_scopeId}>${ssrInterpolate(unref(t3)("fields.status"))}</div><div class="portal-details__value"${_scopeId}><span class="portal-badge" style="${ssrRenderStyle(statusBadgeStyle.value)}"${_scopeId}>${ssrInterpolate(((_a2 = __props.project.status) == null ? void 0 : _a2.name) || "—")}</span></div></div><div class="portal-details__row"${_scopeId}><div class="portal-details__label"${_scopeId}>${ssrInterpolate(unref(t3)("fields.payment_status"))}</div><div class="portal-details__value"${_scopeId}>${ssrInterpolate(unref(paymentStatusLabel)(__props.project.payment_status))}</div></div>`);
            if ((_b = __props.project.company) == null ? void 0 : _b.name) {
              _push2(`<div class="portal-details__row"${_scopeId}><div class="portal-details__label"${_scopeId}>${ssrInterpolate(unref(t3)("fields.company"))}</div><div class="portal-details__value"${_scopeId}>${ssrInterpolate(__props.project.company.name)}</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.project.start_date) {
              _push2(`<div class="portal-details__row"${_scopeId}><div class="portal-details__label"${_scopeId}>${ssrInterpolate(unref(t3)("fields.start_date"))}</div><div class="portal-details__value"${_scopeId}>${ssrInterpolate(__props.project.start_date)}</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.project.due_date) {
              _push2(`<div class="portal-details__row"${_scopeId}><div class="portal-details__label"${_scopeId}>${ssrInterpolate(unref(t3)("fields.due_date"))}</div><div class="portal-details__value"${_scopeId}>${ssrInterpolate(__props.project.due_date)}</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.project.description) {
              _push2(`<div class="portal-details__row"${_scopeId}><div class="portal-details__label"${_scopeId}>${ssrInterpolate(unref(t3)("fields.description"))}</div><div class="portal-details__value"${_scopeId}>${ssrInterpolate(__props.project.description)}</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div></div>`);
            if (attachments.value.length) {
              _push2(`<div class="portal-panel" style="${ssrRenderStyle({ "margin-top": "24px" })}"${_scopeId}><div class="portal-panel__header"${_scopeId}><h2 class="portal-panel__title"${_scopeId}>${ssrInterpolate(unref(t3)("projects.attachments"))}</h2></div><div class="portal-panel__body"${_scopeId}><ul class="list-unstyled mb-0"${_scopeId}><!--[-->`);
              ssrRenderList(attachments.value, (attachment, index) => {
                _push2(`<li class="mb-2"${_scopeId}><a${ssrRenderAttr("href", attachment.url)} target="_blank" class="portal-panel__action"${_scopeId}><i class="fas fa-paperclip"${_scopeId}></i>${ssrInterpolate(attachment.name)}</a></li>`);
              });
              _push2(`<!--]--></ul></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.project.is_completed) {
              _push2(`<div class="portal-panel" style="${ssrRenderStyle({ "margin-top": "24px" })}"${_scopeId}><div class="portal-panel__header"${_scopeId}><h2 class="portal-panel__title"${_scopeId}>${ssrInterpolate(unref(t3)("projects.review_title"))}</h2></div><div class="portal-panel__body"${_scopeId}>`);
              if (__props.project.review) {
                _push2(`<div class="portal-details"${_scopeId}><p class="mb-2"${_scopeId}>${ssrInterpolate(unref(t3)("projects.review_submitted_hint"))}</p><div class="portal-review-quote"${_scopeId}>“${ssrInterpolate(reviewQuote.value)}”</div>`);
                if (__props.project.review.status) {
                  _push2(`<span class="${ssrRenderClass([__props.project.review.status === "Published" ? "portal-badge--paid" : "portal-badge--invoice", "portal-badge mt-3"])}"${_scopeId}>${ssrInterpolate(__props.project.review.status === "Published" ? unref(t3)("projects.review_status_published") : unref(t3)("projects.review_status_pending"))}</span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
              } else if (__props.project.can_review) {
                _push2(`<form${_scopeId}><p class="mb-3"${_scopeId}>${ssrInterpolate(unref(t3)("projects.review_prompt"))}</p><textarea class="portal-input" rows="4"${ssrRenderAttr("placeholder", unref(t3)("projects.review_placeholder"))} required minlength="10" maxlength="2000"${_scopeId}>${ssrInterpolate(unref(reviewForm).quote)}</textarea>`);
                if (unref(reviewForm).errors.quote) {
                  _push2(`<p class="portal-form-error mt-2 mb-0"${_scopeId}>${ssrInterpolate(unref(reviewForm).errors.quote)}</p>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<button type="submit" class="thm-btn mt-3"${ssrIncludeBooleanAttr(unref(reviewForm).processing) ? " disabled" : ""} style="${ssrRenderStyle({ "padding": "10px 20px", "font-size": "14px" })}"${_scopeId}>${ssrInterpolate(unref(t3)("projects.submit_review"))}</button></form>`);
              } else {
                _push2(`<div class="portal-empty"${_scopeId}>${ssrInterpolate(unref(t3)("projects.review_unavailable"))}</div>`);
              }
              _push2(`</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="portal-grid__stack"${_scopeId}><div class="portal-panel"${_scopeId}><div class="portal-panel__header"${_scopeId}><h2 class="portal-panel__title"${_scopeId}>${ssrInterpolate(unref(t3)("projects.billing"))}</h2></div><div class="portal-panel__body"${_scopeId}><div class="portal-billing-grid"${_scopeId}><div class="portal-billing-item"${_scopeId}><div class="portal-billing-item__label"${_scopeId}>${ssrInterpolate(unref(t3)("fields.budget"))}</div><div class="portal-billing-item__value"${_scopeId}>${ssrInterpolate(formatMoney(collection.value.budget, collection.value.currency))}</div></div><div class="portal-billing-item"${_scopeId}><div class="portal-billing-item__label"${_scopeId}>${ssrInterpolate(unref(t3)("fields.invoiced"))}</div><div class="portal-billing-item__value"${_scopeId}>${ssrInterpolate(formatMoney(collection.value.invoiced, collection.value.currency))}</div></div><div class="portal-billing-item"${_scopeId}><div class="portal-billing-item__label"${_scopeId}>${ssrInterpolate(unref(t3)("fields.remaining"))}</div><div class="portal-billing-item__value portal-billing-item__value--accent"${_scopeId}>${ssrInterpolate(formatMoney(collection.value.remaining, collection.value.currency))}</div></div></div><div${_scopeId}><div class="d-flex justify-content-between mb-2"${_scopeId}><span class="portal-details__label"${_scopeId}>${ssrInterpolate(unref(t3)("fields.collection_rate"))}</span><span class="portal-details__value"${_scopeId}>${ssrInterpolate(collection.value.collection_rate)}%</span></div><div class="portal-progress" style="${ssrRenderStyle({ "height": "10px" })}"${_scopeId}><div class="portal-progress__bar" style="${ssrRenderStyle({ width: `${collection.value.collection_rate}%` })}"${_scopeId}></div></div></div></div></div><div class="portal-panel"${_scopeId}><div class="portal-panel__header"${_scopeId}><h2 class="portal-panel__title"${_scopeId}>${ssrInterpolate(unref(t3)("projects.invoices"))}</h2></div><div class="portal-panel__body"${_scopeId}>`);
            if (invoiceList.value.length === 0) {
              _push2(`<div class="portal-empty"${_scopeId}><span class="portal-empty__icon"${_scopeId}><i class="fas fa-file-alt"${_scopeId}></i></span> ${ssrInterpolate(unref(t3)("projects.no_invoices"))}</div>`);
            } else {
              _push2(`<div class="portal-invoice-list"${_scopeId}><!--[-->`);
              ssrRenderList(invoiceList.value, (invoice) => {
                _push2(`<article class="portal-invoice-card"${_scopeId}><div class="portal-invoice-card__top"${_scopeId}><div${_scopeId}><div class="portal-invoice-card__number"${_scopeId}>${ssrInterpolate(invoice.invoice_number)}</div><span class="${ssrRenderClass([invoiceBadgeClass(invoice.status), "portal-badge mt-2"])}"${_scopeId}>${ssrInterpolate(unref(invoiceStatusLabel)(invoice.status))}</span></div><div class="portal-invoice-card__total"${_scopeId}>${ssrInterpolate(formatMoney(invoice.total, invoice.currency))}</div></div><div class="portal-invoice-card__meta"${_scopeId}><div class="portal-invoice-card__meta-item"${_scopeId}><span${_scopeId}>${ssrInterpolate(unref(t3)("fields.issued_at"))}</span><strong${_scopeId}>${ssrInterpolate(invoice.issued_at || "—")}</strong></div><div class="portal-invoice-card__meta-item"${_scopeId}><span${_scopeId}>${ssrInterpolate(unref(t3)("fields.due_at"))}</span><strong${_scopeId}>${ssrInterpolate(invoice.due_at || "—")}</strong></div><div class="portal-invoice-card__meta-item"${_scopeId}><span${_scopeId}>${ssrInterpolate(unref(t3)("fields.paid_at"))}</span><strong${_scopeId}>${ssrInterpolate(invoice.paid_at || "—")}</strong></div></div><a${ssrRenderAttr("href", invoice.pdf_url)} class="portal-panel__action" target="_blank" rel="noopener"${_scopeId}><i class="fas fa-download"${_scopeId}></i> ${ssrInterpolate(unref(t3)("projects.download_pdf"))}</a></article>`);
              });
              _push2(`<!--]--></div>`);
            }
            _push2(`</div></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "portal-grid portal-grid--show" }, [
                createVNode("div", null, [
                  createVNode("div", { class: "portal-panel" }, [
                    createVNode("div", { class: "portal-panel__header" }, [
                      createVNode("h2", { class: "portal-panel__title" }, toDisplayString(unref(t3)("projects.details")), 1)
                    ]),
                    createVNode("div", { class: "portal-panel__body" }, [
                      createVNode("div", { class: "portal-details" }, [
                        createVNode("div", { class: "portal-details__row" }, [
                          createVNode("div", { class: "portal-details__label" }, toDisplayString(unref(t3)("fields.status")), 1),
                          createVNode("div", { class: "portal-details__value" }, [
                            createVNode("span", {
                              class: "portal-badge",
                              style: statusBadgeStyle.value
                            }, toDisplayString(((_c = __props.project.status) == null ? void 0 : _c.name) || "—"), 5)
                          ])
                        ]),
                        createVNode("div", { class: "portal-details__row" }, [
                          createVNode("div", { class: "portal-details__label" }, toDisplayString(unref(t3)("fields.payment_status")), 1),
                          createVNode("div", { class: "portal-details__value" }, toDisplayString(unref(paymentStatusLabel)(__props.project.payment_status)), 1)
                        ]),
                        ((_d = __props.project.company) == null ? void 0 : _d.name) ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "portal-details__row"
                        }, [
                          createVNode("div", { class: "portal-details__label" }, toDisplayString(unref(t3)("fields.company")), 1),
                          createVNode("div", { class: "portal-details__value" }, toDisplayString(__props.project.company.name), 1)
                        ])) : createCommentVNode("", true),
                        __props.project.start_date ? (openBlock(), createBlock("div", {
                          key: 1,
                          class: "portal-details__row"
                        }, [
                          createVNode("div", { class: "portal-details__label" }, toDisplayString(unref(t3)("fields.start_date")), 1),
                          createVNode("div", { class: "portal-details__value" }, toDisplayString(__props.project.start_date), 1)
                        ])) : createCommentVNode("", true),
                        __props.project.due_date ? (openBlock(), createBlock("div", {
                          key: 2,
                          class: "portal-details__row"
                        }, [
                          createVNode("div", { class: "portal-details__label" }, toDisplayString(unref(t3)("fields.due_date")), 1),
                          createVNode("div", { class: "portal-details__value" }, toDisplayString(__props.project.due_date), 1)
                        ])) : createCommentVNode("", true),
                        __props.project.description ? (openBlock(), createBlock("div", {
                          key: 3,
                          class: "portal-details__row"
                        }, [
                          createVNode("div", { class: "portal-details__label" }, toDisplayString(unref(t3)("fields.description")), 1),
                          createVNode("div", { class: "portal-details__value" }, toDisplayString(__props.project.description), 1)
                        ])) : createCommentVNode("", true)
                      ])
                    ])
                  ]),
                  attachments.value.length ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "portal-panel",
                    style: { "margin-top": "24px" }
                  }, [
                    createVNode("div", { class: "portal-panel__header" }, [
                      createVNode("h2", { class: "portal-panel__title" }, toDisplayString(unref(t3)("projects.attachments")), 1)
                    ]),
                    createVNode("div", { class: "portal-panel__body" }, [
                      createVNode("ul", { class: "list-unstyled mb-0" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(attachments.value, (attachment, index) => {
                          return openBlock(), createBlock("li", {
                            key: index,
                            class: "mb-2"
                          }, [
                            createVNode("a", {
                              href: attachment.url,
                              target: "_blank",
                              class: "portal-panel__action"
                            }, [
                              createVNode("i", { class: "fas fa-paperclip" }),
                              createTextVNode(toDisplayString(attachment.name), 1)
                            ], 8, ["href"])
                          ]);
                        }), 128))
                      ])
                    ])
                  ])) : createCommentVNode("", true),
                  __props.project.is_completed ? (openBlock(), createBlock("div", {
                    key: 1,
                    class: "portal-panel",
                    style: { "margin-top": "24px" }
                  }, [
                    createVNode("div", { class: "portal-panel__header" }, [
                      createVNode("h2", { class: "portal-panel__title" }, toDisplayString(unref(t3)("projects.review_title")), 1)
                    ]),
                    createVNode("div", { class: "portal-panel__body" }, [
                      __props.project.review ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "portal-details"
                      }, [
                        createVNode("p", { class: "mb-2" }, toDisplayString(unref(t3)("projects.review_submitted_hint")), 1),
                        createVNode("div", { class: "portal-review-quote" }, "“" + toDisplayString(reviewQuote.value) + "”", 1),
                        __props.project.review.status ? (openBlock(), createBlock("span", {
                          key: 0,
                          class: ["portal-badge mt-3", __props.project.review.status === "Published" ? "portal-badge--paid" : "portal-badge--invoice"]
                        }, toDisplayString(__props.project.review.status === "Published" ? unref(t3)("projects.review_status_published") : unref(t3)("projects.review_status_pending")), 3)) : createCommentVNode("", true)
                      ])) : __props.project.can_review ? (openBlock(), createBlock("form", {
                        key: 1,
                        onSubmit: withModifiers(submitReview, ["prevent"])
                      }, [
                        createVNode("p", { class: "mb-3" }, toDisplayString(unref(t3)("projects.review_prompt")), 1),
                        withDirectives(createVNode("textarea", {
                          "onUpdate:modelValue": ($event) => unref(reviewForm).quote = $event,
                          class: "portal-input",
                          rows: "4",
                          placeholder: unref(t3)("projects.review_placeholder"),
                          required: "",
                          minlength: "10",
                          maxlength: "2000"
                        }, null, 8, ["onUpdate:modelValue", "placeholder"]), [
                          [vModelText, unref(reviewForm).quote]
                        ]),
                        unref(reviewForm).errors.quote ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "portal-form-error mt-2 mb-0"
                        }, toDisplayString(unref(reviewForm).errors.quote), 1)) : createCommentVNode("", true),
                        createVNode("button", {
                          type: "submit",
                          class: "thm-btn mt-3",
                          disabled: unref(reviewForm).processing,
                          style: { "padding": "10px 20px", "font-size": "14px" }
                        }, toDisplayString(unref(t3)("projects.submit_review")), 9, ["disabled"])
                      ], 32)) : (openBlock(), createBlock("div", {
                        key: 2,
                        class: "portal-empty"
                      }, toDisplayString(unref(t3)("projects.review_unavailable")), 1))
                    ])
                  ])) : createCommentVNode("", true)
                ]),
                createVNode("div", { class: "portal-grid__stack" }, [
                  createVNode("div", { class: "portal-panel" }, [
                    createVNode("div", { class: "portal-panel__header" }, [
                      createVNode("h2", { class: "portal-panel__title" }, toDisplayString(unref(t3)("projects.billing")), 1)
                    ]),
                    createVNode("div", { class: "portal-panel__body" }, [
                      createVNode("div", { class: "portal-billing-grid" }, [
                        createVNode("div", { class: "portal-billing-item" }, [
                          createVNode("div", { class: "portal-billing-item__label" }, toDisplayString(unref(t3)("fields.budget")), 1),
                          createVNode("div", { class: "portal-billing-item__value" }, toDisplayString(formatMoney(collection.value.budget, collection.value.currency)), 1)
                        ]),
                        createVNode("div", { class: "portal-billing-item" }, [
                          createVNode("div", { class: "portal-billing-item__label" }, toDisplayString(unref(t3)("fields.invoiced")), 1),
                          createVNode("div", { class: "portal-billing-item__value" }, toDisplayString(formatMoney(collection.value.invoiced, collection.value.currency)), 1)
                        ]),
                        createVNode("div", { class: "portal-billing-item" }, [
                          createVNode("div", { class: "portal-billing-item__label" }, toDisplayString(unref(t3)("fields.remaining")), 1),
                          createVNode("div", { class: "portal-billing-item__value portal-billing-item__value--accent" }, toDisplayString(formatMoney(collection.value.remaining, collection.value.currency)), 1)
                        ])
                      ]),
                      createVNode("div", null, [
                        createVNode("div", { class: "d-flex justify-content-between mb-2" }, [
                          createVNode("span", { class: "portal-details__label" }, toDisplayString(unref(t3)("fields.collection_rate")), 1),
                          createVNode("span", { class: "portal-details__value" }, toDisplayString(collection.value.collection_rate) + "%", 1)
                        ]),
                        createVNode("div", {
                          class: "portal-progress",
                          style: { "height": "10px" }
                        }, [
                          createVNode("div", {
                            class: "portal-progress__bar",
                            style: { width: `${collection.value.collection_rate}%` }
                          }, null, 4)
                        ])
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "portal-panel" }, [
                    createVNode("div", { class: "portal-panel__header" }, [
                      createVNode("h2", { class: "portal-panel__title" }, toDisplayString(unref(t3)("projects.invoices")), 1)
                    ]),
                    createVNode("div", { class: "portal-panel__body" }, [
                      invoiceList.value.length === 0 ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "portal-empty"
                      }, [
                        createVNode("span", { class: "portal-empty__icon" }, [
                          createVNode("i", { class: "fas fa-file-alt" })
                        ]),
                        createTextVNode(" " + toDisplayString(unref(t3)("projects.no_invoices")), 1)
                      ])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "portal-invoice-list"
                      }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(invoiceList.value, (invoice) => {
                          return openBlock(), createBlock("article", {
                            key: invoice.id,
                            class: "portal-invoice-card"
                          }, [
                            createVNode("div", { class: "portal-invoice-card__top" }, [
                              createVNode("div", null, [
                                createVNode("div", { class: "portal-invoice-card__number" }, toDisplayString(invoice.invoice_number), 1),
                                createVNode("span", {
                                  class: ["portal-badge mt-2", invoiceBadgeClass(invoice.status)]
                                }, toDisplayString(unref(invoiceStatusLabel)(invoice.status)), 3)
                              ]),
                              createVNode("div", { class: "portal-invoice-card__total" }, toDisplayString(formatMoney(invoice.total, invoice.currency)), 1)
                            ]),
                            createVNode("div", { class: "portal-invoice-card__meta" }, [
                              createVNode("div", { class: "portal-invoice-card__meta-item" }, [
                                createVNode("span", null, toDisplayString(unref(t3)("fields.issued_at")), 1),
                                createVNode("strong", null, toDisplayString(invoice.issued_at || "—"), 1)
                              ]),
                              createVNode("div", { class: "portal-invoice-card__meta-item" }, [
                                createVNode("span", null, toDisplayString(unref(t3)("fields.due_at")), 1),
                                createVNode("strong", null, toDisplayString(invoice.due_at || "—"), 1)
                              ]),
                              createVNode("div", { class: "portal-invoice-card__meta-item" }, [
                                createVNode("span", null, toDisplayString(unref(t3)("fields.paid_at")), 1),
                                createVNode("strong", null, toDisplayString(invoice.paid_at || "—"), 1)
                              ])
                            ]),
                            createVNode("a", {
                              href: invoice.pdf_url,
                              class: "portal-panel__action",
                              target: "_blank",
                              rel: "noopener"
                            }, [
                              createVNode("i", { class: "fas fa-download" }),
                              createTextVNode(" " + toDisplayString(unref(t3)("projects.download_pdf")), 1)
                            ], 8, ["href"])
                          ]);
                        }), 128))
                      ]))
                    ])
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$u = _sfc_main$u.setup;
_sfc_main$u.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("Modules/Project/resources/assets/js/Pages/Portal/Projects/Show.vue");
  return _sfc_setup$u ? _sfc_setup$u(props, ctx) : void 0;
};
const __vite_glob_0_14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$u
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$t = {
  __name: "UseCaseIndex",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const trans = (key) => page.props.translations[key] || key;
    const seo = computed(() => page.props.seo);
    const settings = computed(() => page.props.settings || {});
    const locale = computed(() => page.props.locale || "en");
    const useCases = computed(() => page.props.useCases || { data: [], links: [], last_page: 1 });
    const meta = computed(() => page.props.meta || {});
    const metaTitle = computed(() => meta.value.title || `${trans("Case Studies")} | ${seo.value.website_name || ""}`.trim());
    const metaDescription = computed(() => meta.value.description || trans("Explore our case studies and see how we help businesses with innovative technology solutions.") || seo.value.website_desc || "");
    const metaKeywords = computed(() => meta.value.keywords || trans("case studies, project solutions, IT solutions, web development") || seo.value.website_keywords || "");
    const metaImage = computed(() => {
      var _a, _b, _c, _d, _e;
      return ((_b = (_a = meta.value) == null ? void 0 : _a.og) == null ? void 0 : _b.image) || ((_d = (_c = meta.value) == null ? void 0 : _c.twitter) == null ? void 0 : _d.image) || ((_e = settings.value) == null ? void 0 : _e.meta_img) || "";
    });
    const metaCanonical = computed(() => meta.value.canonical || "");
    const metaRobots = computed(() => meta.value.robots || "index, follow");
    const stripPaginationLabel = (label) => String(label || "").replace(/<[^>]*>/g, "").trim();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), null, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<title${_scopeId}>${ssrInterpolate(metaTitle.value)}</title><meta name="description"${ssrRenderAttr("content", metaDescription.value)}${_scopeId}><meta name="keywords"${ssrRenderAttr("content", metaKeywords.value)}${_scopeId}><meta name="robots"${ssrRenderAttr("content", metaRobots.value)}${_scopeId}>`);
            if (metaCanonical.value) {
              _push2(`<link rel="canonical"${ssrRenderAttr("href", metaCanonical.value)}${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<meta property="og:title"${ssrRenderAttr("content", metaTitle.value)}${_scopeId}><meta property="og:description"${ssrRenderAttr("content", metaDescription.value)}${_scopeId}>`);
            if (metaImage.value) {
              _push2(`<meta property="og:image"${ssrRenderAttr("content", metaImage.value)}${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            if (metaCanonical.value) {
              _push2(`<meta property="og:url"${ssrRenderAttr("content", metaCanonical.value)}${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<meta property="og:type" content="website"${_scopeId}><meta name="twitter:card" content="summary_large_image"${_scopeId}><meta name="twitter:title"${ssrRenderAttr("content", metaTitle.value)}${_scopeId}><meta name="twitter:description"${ssrRenderAttr("content", metaDescription.value)}${_scopeId}>`);
            if (metaImage.value) {
              _push2(`<meta name="twitter:image"${ssrRenderAttr("content", metaImage.value)}${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("title", null, toDisplayString(metaTitle.value), 1),
              createVNode("meta", {
                name: "description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "keywords",
                content: metaKeywords.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "robots",
                content: metaRobots.value
              }, null, 8, ["content"]),
              metaCanonical.value ? (openBlock(), createBlock("link", {
                key: 0,
                rel: "canonical",
                href: metaCanonical.value
              }, null, 8, ["href"])) : createCommentVNode("", true),
              createVNode("meta", {
                property: "og:title",
                content: metaTitle.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              metaImage.value ? (openBlock(), createBlock("meta", {
                key: 1,
                property: "og:image",
                content: metaImage.value
              }, null, 8, ["content"])) : createCommentVNode("", true),
              metaCanonical.value ? (openBlock(), createBlock("meta", {
                key: 2,
                property: "og:url",
                content: metaCanonical.value
              }, null, 8, ["content"])) : createCommentVNode("", true),
              createVNode("meta", {
                property: "og:type",
                content: "website"
              }),
              createVNode("meta", {
                name: "twitter:card",
                content: "summary_large_image"
              }),
              createVNode("meta", {
                name: "twitter:title",
                content: metaTitle.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "twitter:description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              metaImage.value ? (openBlock(), createBlock("meta", {
                key: 3,
                name: "twitter:image",
                content: metaImage.value
              }, null, 8, ["content"])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$R, null, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$N, {
              title: trans("Case Studies")
            }, null, _parent2, _scopeId));
            _push2(`<section class="section-page-blog flat-spacing-2"${_scopeId}><div class="container"${_scopeId}><div class="sect-title wow fadeInUp"${_scopeId}><h2 class="s-title font-3"${_scopeId}>${ssrInterpolate(trans("How We've Empowered Businesses with Innovative Tech Solutions"))}</h2><p class="s-sub_title"${_scopeId}>${ssrInterpolate(trans("Explore our case studies and see how we help businesses with innovative technology solutions."))}</p></div>`);
            if (useCases.value.data.length) {
              _push2(`<div class="tf-grid-layout sm-col-2 md-col-3"${_scopeId}><!--[-->`);
              ssrRenderList(useCases.value.data, (item) => {
                _push2(ssrRenderComponent(_sfc_main$P, {
                  key: item.id,
                  item,
                  locale: locale.value
                }, null, _parent2, _scopeId));
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<div class="text-center py-5"${_scopeId}><h3 class="s-title font-3 h4"${_scopeId}>${ssrInterpolate(trans("No records found"))}</h3><p class="s-sub_title"${_scopeId}>${ssrInterpolate(trans("Check back soon — we are adding new case studies."))}</p></div>`);
            }
            if (useCases.value.last_page > 1) {
              _push2(`<div class="pagination-list mt-5 justify-content-center"${_scopeId}>`);
              if (useCases.value.prev_page_url) {
                _push2(ssrRenderComponent(unref(Link), {
                  href: useCases.value.prev_page_url,
                  class: "pagination-item pagination-item--prev",
                  "aria-label": "Previous"
                }, {
                  default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<span class="icon icon-CaretDoubleRight fs-20"${_scopeId2}></span>`);
                    } else {
                      return [
                        createVNode("span", { class: "icon icon-CaretDoubleRight fs-20" })
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`<!--[-->`);
              ssrRenderList(useCases.value.links, (link, linkIndex) => {
                _push2(`<!--[-->`);
                if (link.url && linkIndex > 0 && linkIndex < useCases.value.links.length - 1) {
                  _push2(ssrRenderComponent(unref(Link), {
                    href: link.url,
                    class: ["pagination-item", { active: link.active }]
                  }, {
                    default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`<span${_scopeId2}>${ssrInterpolate(stripPaginationLabel(link.label))}</span>`);
                      } else {
                        return [
                          createVNode("span", null, toDisplayString(stripPaginationLabel(link.label)), 1)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<!--]-->`);
              });
              _push2(`<!--]-->`);
              if (useCases.value.next_page_url) {
                _push2(ssrRenderComponent(unref(Link), {
                  href: useCases.value.next_page_url,
                  class: "pagination-item",
                  "aria-label": "Next"
                }, {
                  default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<span class="icon icon-CaretDoubleRight fs-20"${_scopeId2}></span>`);
                    } else {
                      return [
                        createVNode("span", { class: "icon icon-CaretDoubleRight fs-20" })
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></section>`);
            _push2(ssrRenderComponent(_sfc_main$J, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$N, {
                title: trans("Case Studies")
              }, null, 8, ["title"]),
              createVNode("section", { class: "section-page-blog flat-spacing-2" }, [
                createVNode("div", { class: "container" }, [
                  createVNode("div", { class: "sect-title wow fadeInUp" }, [
                    createVNode("h2", { class: "s-title font-3" }, toDisplayString(trans("How We've Empowered Businesses with Innovative Tech Solutions")), 1),
                    createVNode("p", { class: "s-sub_title" }, toDisplayString(trans("Explore our case studies and see how we help businesses with innovative technology solutions.")), 1)
                  ]),
                  useCases.value.data.length ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "tf-grid-layout sm-col-2 md-col-3"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(useCases.value.data, (item) => {
                      return openBlock(), createBlock(_sfc_main$P, {
                        key: item.id,
                        item,
                        locale: locale.value
                      }, null, 8, ["item", "locale"]);
                    }), 128))
                  ])) : (openBlock(), createBlock("div", {
                    key: 1,
                    class: "text-center py-5"
                  }, [
                    createVNode("h3", { class: "s-title font-3 h4" }, toDisplayString(trans("No records found")), 1),
                    createVNode("p", { class: "s-sub_title" }, toDisplayString(trans("Check back soon — we are adding new case studies.")), 1)
                  ])),
                  useCases.value.last_page > 1 ? (openBlock(), createBlock("div", {
                    key: 2,
                    class: "pagination-list mt-5 justify-content-center"
                  }, [
                    useCases.value.prev_page_url ? (openBlock(), createBlock(unref(Link), {
                      key: 0,
                      href: useCases.value.prev_page_url,
                      class: "pagination-item pagination-item--prev",
                      "aria-label": "Previous"
                    }, {
                      default: withCtx(() => [
                        createVNode("span", { class: "icon icon-CaretDoubleRight fs-20" })
                      ]),
                      _: 1
                    }, 8, ["href"])) : createCommentVNode("", true),
                    (openBlock(true), createBlock(Fragment, null, renderList(useCases.value.links, (link, linkIndex) => {
                      return openBlock(), createBlock(Fragment, { key: linkIndex }, [
                        link.url && linkIndex > 0 && linkIndex < useCases.value.links.length - 1 ? (openBlock(), createBlock(unref(Link), {
                          key: 0,
                          href: link.url,
                          class: ["pagination-item", { active: link.active }]
                        }, {
                          default: withCtx(() => [
                            createVNode("span", null, toDisplayString(stripPaginationLabel(link.label)), 1)
                          ]),
                          _: 2
                        }, 1032, ["href", "class"])) : createCommentVNode("", true)
                      ], 64);
                    }), 128)),
                    useCases.value.next_page_url ? (openBlock(), createBlock(unref(Link), {
                      key: 1,
                      href: useCases.value.next_page_url,
                      class: "pagination-item",
                      "aria-label": "Next"
                    }, {
                      default: withCtx(() => [
                        createVNode("span", { class: "icon icon-CaretDoubleRight fs-20" })
                      ]),
                      _: 1
                    }, 8, ["href"])) : createCommentVNode("", true)
                  ])) : createCommentVNode("", true)
                ])
              ]),
              createVNode(_sfc_main$J)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$t = _sfc_main$t.setup;
_sfc_main$t.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("Modules/Project/resources/assets/js/Pages/UseCaseIndex.vue");
  return _sfc_setup$t ? _sfc_setup$t(props, ctx) : void 0;
};
const __vite_glob_0_15 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$t
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$s = {
  __name: "UseCaseShow",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const trans = (key) => page.props.translations[key] || key;
    const seo = computed(() => page.props.seo);
    const settings = computed(() => page.props.settings || {});
    const locale = computed(() => page.props.locale || "en");
    const useCase = computed(() => page.props.useCase || {});
    const relatedUseCases = computed(() => page.props.relatedUseCases || []);
    const meta = computed(() => page.props.meta || {});
    const metaTitle = computed(() => meta.value.title || `${useCase.value.title || trans("Case Studies")} | ${seo.value.website_name || ""}`.trim());
    const metaDescription = computed(() => meta.value.description || useCase.value.summary || seo.value.website_desc || "");
    const metaKeywords = computed(() => meta.value.keywords || (useCase.value.technologies || []).join(", ") || seo.value.website_keywords || "");
    const metaImage = computed(() => {
      var _a, _b, _c, _d, _e;
      return ((_b = (_a = meta.value) == null ? void 0 : _a.og) == null ? void 0 : _b.image) || ((_d = (_c = meta.value) == null ? void 0 : _c.twitter) == null ? void 0 : _d.image) || useCase.value.image_link || ((_e = settings.value) == null ? void 0 : _e.meta_img) || "";
    });
    const metaCanonical = computed(() => meta.value.canonical || "");
    const metaRobots = computed(() => meta.value.robots || "index, follow");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), null, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<title${_scopeId}>${ssrInterpolate(metaTitle.value)}</title><meta name="description"${ssrRenderAttr("content", metaDescription.value)}${_scopeId}><meta name="keywords"${ssrRenderAttr("content", metaKeywords.value)}${_scopeId}><meta name="robots"${ssrRenderAttr("content", metaRobots.value)}${_scopeId}>`);
            if (metaCanonical.value) {
              _push2(`<link rel="canonical"${ssrRenderAttr("href", metaCanonical.value)}${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<meta property="og:title"${ssrRenderAttr("content", metaTitle.value)}${_scopeId}><meta property="og:description"${ssrRenderAttr("content", metaDescription.value)}${_scopeId}>`);
            if (metaImage.value) {
              _push2(`<meta property="og:image"${ssrRenderAttr("content", metaImage.value)}${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            if (metaCanonical.value) {
              _push2(`<meta property="og:url"${ssrRenderAttr("content", metaCanonical.value)}${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<meta property="og:type" content="article"${_scopeId}><meta name="twitter:card" content="summary_large_image"${_scopeId}><meta name="twitter:title"${ssrRenderAttr("content", metaTitle.value)}${_scopeId}><meta name="twitter:description"${ssrRenderAttr("content", metaDescription.value)}${_scopeId}>`);
            if (metaImage.value) {
              _push2(`<meta name="twitter:image"${ssrRenderAttr("content", metaImage.value)}${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("title", null, toDisplayString(metaTitle.value), 1),
              createVNode("meta", {
                name: "description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "keywords",
                content: metaKeywords.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "robots",
                content: metaRobots.value
              }, null, 8, ["content"]),
              metaCanonical.value ? (openBlock(), createBlock("link", {
                key: 0,
                rel: "canonical",
                href: metaCanonical.value
              }, null, 8, ["href"])) : createCommentVNode("", true),
              createVNode("meta", {
                property: "og:title",
                content: metaTitle.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              metaImage.value ? (openBlock(), createBlock("meta", {
                key: 1,
                property: "og:image",
                content: metaImage.value
              }, null, 8, ["content"])) : createCommentVNode("", true),
              metaCanonical.value ? (openBlock(), createBlock("meta", {
                key: 2,
                property: "og:url",
                content: metaCanonical.value
              }, null, 8, ["content"])) : createCommentVNode("", true),
              createVNode("meta", {
                property: "og:type",
                content: "article"
              }),
              createVNode("meta", {
                name: "twitter:card",
                content: "summary_large_image"
              }),
              createVNode("meta", {
                name: "twitter:title",
                content: metaTitle.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "twitter:description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              metaImage.value ? (openBlock(), createBlock("meta", {
                key: 3,
                name: "twitter:image",
                content: metaImage.value
              }, null, 8, ["content"])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$R, null, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          var _a, _b, _c, _d;
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$N, {
              title: useCase.value.title,
              crumbs: [
                { label: trans("Case Studies"), href: _ctx.route("use-cases.index") },
                { label: useCase.value.title }
              ]
            }, null, _parent2, _scopeId));
            _push2(`<section class="section-page-use-detail flat-spacing-3"${_scopeId}><div class="container"${_scopeId}><div class="content-1200"${_scopeId}><div class="box-image-v01"${_scopeId}><div class="box_image"${_scopeId}><img loading="lazy" width="1200" height="537"${ssrRenderAttr("src", useCase.value.image_link)}${ssrRenderAttr("alt", useCase.value.title)}${_scopeId}></div><div class="box_content"${_scopeId}><div class="box_content_wrap"${_scopeId}><p class="tag text-caption text-main-5 font-2"${_scopeId}>${ssrInterpolate(useCase.value.category_tag || trans("Case Studies"))}</p><h1 class="title text-linear font-3"${_scopeId}>${ssrInterpolate(useCase.value.title)}</h1><div class="br-line has-dot"${_scopeId}></div>`);
            if (useCase.value.summary) {
              _push2(`<p class="desc text-line-clamp-3"${_scopeId}>${ssrInterpolate(useCase.value.summary)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div></div><div class="page-blog_content detail"${_scopeId}><div class="col-left"${_scopeId}><div class="main-blog_detail"${_scopeId}>`);
            if (useCase.value.summary) {
              _push2(`<p class="detail_text text-main-2"${_scopeId}>${ssrInterpolate(useCase.value.summary)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            if (useCase.value.image_link) {
              _push2(`<div class="detail_image"${_scopeId}><img loading="lazy" width="732" height="412"${ssrRenderAttr("src", useCase.value.image_link)}${ssrRenderAttr("alt", useCase.value.title)}${_scopeId}></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (useCase.value.challenge || useCase.value.solution || useCase.value.results) {
              _push2(`<div class="detail_feature_list"${_scopeId}>`);
              if (useCase.value.challenge) {
                _push2(`<div class="detail_feature item"${_scopeId}><h4 class="title text-linear"${_scopeId}>${ssrInterpolate(trans("The Challenge"))}</h4><div class="box-text"${_scopeId}><p${_scopeId}>${ssrInterpolate(useCase.value.challenge)}</p></div></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (useCase.value.solution) {
                _push2(`<div class="detail_feature item"${_scopeId}><h4 class="title text-linear"${_scopeId}>${ssrInterpolate(trans("Our Solution"))}</h4><div class="box-text"${_scopeId}><p${_scopeId}>${ssrInterpolate(useCase.value.solution)}</p></div></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (useCase.value.results) {
                _push2(`<div class="detail_feature item"${_scopeId}><h4 class="title text-linear"${_scopeId}>${ssrInterpolate(trans("The Results"))}</h4><div class="box-text"${_scopeId}><p${_scopeId}>${ssrInterpolate(useCase.value.results)}</p></div></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (useCase.value.content) {
              _push2(`<div class="detail_text text-main-6"${_scopeId}>${useCase.value.content ?? ""}</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (((_a = useCase.value.technologies) == null ? void 0 : _a.length) || useCase.value.project_url) {
              _push2(`<div${_scopeId}><div class="br-line has-dot"${_scopeId}></div><div class="detail_tag"${_scopeId}>`);
              if ((_b = useCase.value.technologies) == null ? void 0 : _b.length) {
                _push2(`<ul class="tag-list"${_scopeId}><li class="text-body-3 text-white"${_scopeId}>${ssrInterpolate(trans("Technologies Used"))}:</li><!--[-->`);
                ssrRenderList(useCase.value.technologies, (tech) => {
                  _push2(`<li${_scopeId}><span class="text-body-3"${_scopeId}>${ssrInterpolate(tech)}</span></li>`);
                });
                _push2(`<!--]--></ul>`);
              } else {
                _push2(`<!---->`);
              }
              if (useCase.value.project_url) {
                _push2(`<a${ssrRenderAttr("href", useCase.value.project_url)} target="_blank" rel="noopener" class="tf-btn animate-btn mt-3"${_scopeId}>${ssrInterpolate(trans("Visit Live Project"))}</a>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><aside class="col-right d-none d-lg-block"${_scopeId}><div class="blog-sidebar sidebar-content-wrap"${_scopeId}><div class="sidebar-item"${_scopeId}><h5 class="sb-title font-3 text-linear"${_scopeId}>${ssrInterpolate(trans("Project Info"))}</h5><div class="br-line has-dot"${_scopeId}></div><ul class="sb-category"${_scopeId}>`);
            if (useCase.value.client_name) {
              _push2(`<li${_scopeId}><span${_scopeId}>${ssrInterpolate(trans("Client"))}: ${ssrInterpolate(useCase.value.client_name)}</span></li>`);
            } else {
              _push2(`<!---->`);
            }
            if (useCase.value.completed_year) {
              _push2(`<li${_scopeId}><span${_scopeId}>${ssrInterpolate(trans("Year"))}: ${ssrInterpolate(useCase.value.completed_year)}</span></li>`);
            } else {
              _push2(`<!---->`);
            }
            if (useCase.value.category_tag) {
              _push2(`<li${_scopeId}><span${_scopeId}>${ssrInterpolate(useCase.value.category_tag)}</span></li>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</ul>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("contact-us"),
              class: "tf-btn animate-btn mt-3 w-100"
            }, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(trans("Get in Touch"))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(trans("Get in Touch")), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
            if (relatedUseCases.value.length) {
              _push2(`<div class="sidebar-item"${_scopeId}><h5 class="sb-title font-3 text-linear"${_scopeId}>${ssrInterpolate(trans("More Case Studies"))}</h5><div class="br-line has-dot"${_scopeId}></div><ul class="sb-recent"${_scopeId}><!--[-->`);
              ssrRenderList(relatedUseCases.value, (item) => {
                _push2(`<li class="sb-recent_item hover-img"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Link), {
                  href: _ctx.route("use-cases.show", item.slug),
                  class: "recent__image img-style"
                }, {
                  default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<img${ssrRenderAttr("src", item.image_link)}${ssrRenderAttr("alt", item.title)} width="94" height="94" loading="lazy"${_scopeId2}>`);
                    } else {
                      return [
                        createVNode("img", {
                          src: item.image_link,
                          alt: item.title,
                          width: "94",
                          height: "94",
                          loading: "lazy"
                        }, null, 8, ["src", "alt"])
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`<div class="recent__content"${_scopeId}>`);
                if (item.completed_year) {
                  _push2(`<div class="entry_date"${_scopeId}><i class="icon icon-Clock"${_scopeId}></i><span class="date text-body-3"${_scopeId}>${ssrInterpolate(item.completed_year)}</span></div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(ssrRenderComponent(unref(Link), {
                  href: _ctx.route("use-cases.show", item.slug),
                  class: "entry_name link"
                }, {
                  default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(item.title)}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(item.title), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`</div></li>`);
              });
              _push2(`<!--]--></ul></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></aside></div></div></div></section>`);
            if (relatedUseCases.value.length) {
              _push2(`<section class="flat-spacing-3"${_scopeId}><div class="container"${_scopeId}><div class="content-1200"${_scopeId}><h2 class="box-head_section font-3 title-section text-linear text-center"${_scopeId}>${ssrInterpolate(trans("Explore More Success Stories"))}</h2><div class="tf-grid-layout sm-col-2 md-col-3"${_scopeId}><!--[-->`);
              ssrRenderList(relatedUseCases.value, (item) => {
                _push2(ssrRenderComponent(_sfc_main$P, {
                  key: item.id,
                  item,
                  locale: locale.value,
                  variant: "compact"
                }, null, _parent2, _scopeId));
              });
              _push2(`<!--]--></div></div></div></section>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(_sfc_main$J, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$N, {
                title: useCase.value.title,
                crumbs: [
                  { label: trans("Case Studies"), href: _ctx.route("use-cases.index") },
                  { label: useCase.value.title }
                ]
              }, null, 8, ["title", "crumbs"]),
              createVNode("section", { class: "section-page-use-detail flat-spacing-3" }, [
                createVNode("div", { class: "container" }, [
                  createVNode("div", { class: "content-1200" }, [
                    createVNode("div", { class: "box-image-v01" }, [
                      createVNode("div", { class: "box_image" }, [
                        createVNode("img", {
                          loading: "lazy",
                          width: "1200",
                          height: "537",
                          src: useCase.value.image_link,
                          alt: useCase.value.title
                        }, null, 8, ["src", "alt"])
                      ]),
                      createVNode("div", { class: "box_content" }, [
                        createVNode("div", { class: "box_content_wrap" }, [
                          createVNode("p", { class: "tag text-caption text-main-5 font-2" }, toDisplayString(useCase.value.category_tag || trans("Case Studies")), 1),
                          createVNode("h1", { class: "title text-linear font-3" }, toDisplayString(useCase.value.title), 1),
                          createVNode("div", { class: "br-line has-dot" }),
                          useCase.value.summary ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "desc text-line-clamp-3"
                          }, toDisplayString(useCase.value.summary), 1)) : createCommentVNode("", true)
                        ])
                      ])
                    ]),
                    createVNode("div", { class: "page-blog_content detail" }, [
                      createVNode("div", { class: "col-left" }, [
                        createVNode("div", { class: "main-blog_detail" }, [
                          useCase.value.summary ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "detail_text text-main-2"
                          }, toDisplayString(useCase.value.summary), 1)) : createCommentVNode("", true),
                          useCase.value.image_link ? (openBlock(), createBlock("div", {
                            key: 1,
                            class: "detail_image"
                          }, [
                            createVNode("img", {
                              loading: "lazy",
                              width: "732",
                              height: "412",
                              src: useCase.value.image_link,
                              alt: useCase.value.title
                            }, null, 8, ["src", "alt"])
                          ])) : createCommentVNode("", true),
                          useCase.value.challenge || useCase.value.solution || useCase.value.results ? (openBlock(), createBlock("div", {
                            key: 2,
                            class: "detail_feature_list"
                          }, [
                            useCase.value.challenge ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "detail_feature item"
                            }, [
                              createVNode("h4", { class: "title text-linear" }, toDisplayString(trans("The Challenge")), 1),
                              createVNode("div", { class: "box-text" }, [
                                createVNode("p", null, toDisplayString(useCase.value.challenge), 1)
                              ])
                            ])) : createCommentVNode("", true),
                            useCase.value.solution ? (openBlock(), createBlock("div", {
                              key: 1,
                              class: "detail_feature item"
                            }, [
                              createVNode("h4", { class: "title text-linear" }, toDisplayString(trans("Our Solution")), 1),
                              createVNode("div", { class: "box-text" }, [
                                createVNode("p", null, toDisplayString(useCase.value.solution), 1)
                              ])
                            ])) : createCommentVNode("", true),
                            useCase.value.results ? (openBlock(), createBlock("div", {
                              key: 2,
                              class: "detail_feature item"
                            }, [
                              createVNode("h4", { class: "title text-linear" }, toDisplayString(trans("The Results")), 1),
                              createVNode("div", { class: "box-text" }, [
                                createVNode("p", null, toDisplayString(useCase.value.results), 1)
                              ])
                            ])) : createCommentVNode("", true)
                          ])) : createCommentVNode("", true),
                          useCase.value.content ? (openBlock(), createBlock("div", {
                            key: 3,
                            class: "detail_text text-main-6",
                            innerHTML: useCase.value.content
                          }, null, 8, ["innerHTML"])) : createCommentVNode("", true),
                          ((_c = useCase.value.technologies) == null ? void 0 : _c.length) || useCase.value.project_url ? (openBlock(), createBlock("div", { key: 4 }, [
                            createVNode("div", { class: "br-line has-dot" }),
                            createVNode("div", { class: "detail_tag" }, [
                              ((_d = useCase.value.technologies) == null ? void 0 : _d.length) ? (openBlock(), createBlock("ul", {
                                key: 0,
                                class: "tag-list"
                              }, [
                                createVNode("li", { class: "text-body-3 text-white" }, toDisplayString(trans("Technologies Used")) + ":", 1),
                                (openBlock(true), createBlock(Fragment, null, renderList(useCase.value.technologies, (tech) => {
                                  return openBlock(), createBlock("li", { key: tech }, [
                                    createVNode("span", { class: "text-body-3" }, toDisplayString(tech), 1)
                                  ]);
                                }), 128))
                              ])) : createCommentVNode("", true),
                              useCase.value.project_url ? (openBlock(), createBlock("a", {
                                key: 1,
                                href: useCase.value.project_url,
                                target: "_blank",
                                rel: "noopener",
                                class: "tf-btn animate-btn mt-3"
                              }, toDisplayString(trans("Visit Live Project")), 9, ["href"])) : createCommentVNode("", true)
                            ])
                          ])) : createCommentVNode("", true)
                        ])
                      ]),
                      createVNode("aside", { class: "col-right d-none d-lg-block" }, [
                        createVNode("div", { class: "blog-sidebar sidebar-content-wrap" }, [
                          createVNode("div", { class: "sidebar-item" }, [
                            createVNode("h5", { class: "sb-title font-3 text-linear" }, toDisplayString(trans("Project Info")), 1),
                            createVNode("div", { class: "br-line has-dot" }),
                            createVNode("ul", { class: "sb-category" }, [
                              useCase.value.client_name ? (openBlock(), createBlock("li", { key: 0 }, [
                                createVNode("span", null, toDisplayString(trans("Client")) + ": " + toDisplayString(useCase.value.client_name), 1)
                              ])) : createCommentVNode("", true),
                              useCase.value.completed_year ? (openBlock(), createBlock("li", { key: 1 }, [
                                createVNode("span", null, toDisplayString(trans("Year")) + ": " + toDisplayString(useCase.value.completed_year), 1)
                              ])) : createCommentVNode("", true),
                              useCase.value.category_tag ? (openBlock(), createBlock("li", { key: 2 }, [
                                createVNode("span", null, toDisplayString(useCase.value.category_tag), 1)
                              ])) : createCommentVNode("", true)
                            ]),
                            createVNode(unref(Link), {
                              href: _ctx.route("contact-us"),
                              class: "tf-btn animate-btn mt-3 w-100"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(trans("Get in Touch")), 1)
                              ]),
                              _: 1
                            }, 8, ["href"])
                          ]),
                          relatedUseCases.value.length ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "sidebar-item"
                          }, [
                            createVNode("h5", { class: "sb-title font-3 text-linear" }, toDisplayString(trans("More Case Studies")), 1),
                            createVNode("div", { class: "br-line has-dot" }),
                            createVNode("ul", { class: "sb-recent" }, [
                              (openBlock(true), createBlock(Fragment, null, renderList(relatedUseCases.value, (item) => {
                                return openBlock(), createBlock("li", {
                                  key: item.id,
                                  class: "sb-recent_item hover-img"
                                }, [
                                  createVNode(unref(Link), {
                                    href: _ctx.route("use-cases.show", item.slug),
                                    class: "recent__image img-style"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode("img", {
                                        src: item.image_link,
                                        alt: item.title,
                                        width: "94",
                                        height: "94",
                                        loading: "lazy"
                                      }, null, 8, ["src", "alt"])
                                    ]),
                                    _: 2
                                  }, 1032, ["href"]),
                                  createVNode("div", { class: "recent__content" }, [
                                    item.completed_year ? (openBlock(), createBlock("div", {
                                      key: 0,
                                      class: "entry_date"
                                    }, [
                                      createVNode("i", { class: "icon icon-Clock" }),
                                      createVNode("span", { class: "date text-body-3" }, toDisplayString(item.completed_year), 1)
                                    ])) : createCommentVNode("", true),
                                    createVNode(unref(Link), {
                                      href: _ctx.route("use-cases.show", item.slug),
                                      class: "entry_name link"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(item.title), 1)
                                      ]),
                                      _: 2
                                    }, 1032, ["href"])
                                  ])
                                ]);
                              }), 128))
                            ])
                          ])) : createCommentVNode("", true)
                        ])
                      ])
                    ])
                  ])
                ])
              ]),
              relatedUseCases.value.length ? (openBlock(), createBlock("section", {
                key: 0,
                class: "flat-spacing-3"
              }, [
                createVNode("div", { class: "container" }, [
                  createVNode("div", { class: "content-1200" }, [
                    createVNode("h2", { class: "box-head_section font-3 title-section text-linear text-center" }, toDisplayString(trans("Explore More Success Stories")), 1),
                    createVNode("div", { class: "tf-grid-layout sm-col-2 md-col-3" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(relatedUseCases.value, (item) => {
                        return openBlock(), createBlock(_sfc_main$P, {
                          key: item.id,
                          item,
                          locale: locale.value,
                          variant: "compact"
                        }, null, 8, ["item", "locale"]);
                      }), 128))
                    ])
                  ])
                ])
              ])) : createCommentVNode("", true),
              createVNode(_sfc_main$J)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$s = _sfc_main$s.setup;
_sfc_main$s.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("Modules/Project/resources/assets/js/Pages/UseCaseShow.vue");
  return _sfc_setup$s ? _sfc_setup$s(props, ctx) : void 0;
};
const __vite_glob_0_16 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$s
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$r = {
  __name: "ServiceCardThree",
  __ssrInlineRender: true,
  props: {
    title: { type: String, required: true },
    shortDesc: { type: String, default: "" },
    description: { type: String, default: "" },
    highlights: { type: Array, default: () => [] },
    link: { type: String, required: true },
    image: { type: String, default: "" },
    buttonLabel: { type: String, default: "Read More" },
    isRtl: { type: Boolean, default: false },
    readingTime: { type: [Number, String], default: 0 },
    readingTimeLabel: { type: String, default: "min read" },
    categoryName: { type: String, default: "" }
  },
  setup(__props) {
    const page = usePage();
    const trans = (key) => {
      var _a;
      return ((_a = page.props.translations) == null ? void 0 : _a[key]) || key;
    };
    const props = __props;
    const parseMaybeJson = (value) => {
      if (typeof value !== "string") {
        return value;
      }
      const trimmed = value.trim();
      if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) {
        return value;
      }
      try {
        return JSON.parse(trimmed);
      } catch (e2) {
        try {
          return JSON.parse(trimmed.replace(/'/g, '"'));
        } catch (err) {
          return value;
        }
      }
    };
    const normalizeHighlights = (items) => {
      if (!items) {
        return [];
      }
      const rawItems = Array.isArray(items) ? items : [items];
      return rawItems.map((item) => parseMaybeJson(item)).flatMap((item) => {
        if (Array.isArray(item)) {
          return item;
        }
        return [item];
      }).map((item) => {
        if (typeof item === "string") {
          return item;
        }
        if (item && typeof item === "object") {
          if (item.value) {
            return item.value;
          }
          if (item.label) {
            return item.label;
          }
          return "";
        }
        return "";
      }).map((item) => String(item).replace(/^\s+|\s+$/g, "")).filter(Boolean);
    };
    const safeHighlights = computed(() => normalizeHighlights(props.highlights).slice(0, 3));
    const buttonText = computed(() => {
      if (props.buttonLabel && props.buttonLabel !== "Read More") {
        return props.buttonLabel;
      }
      return trans("View Details");
    });
    const shortDescription = computed(() => {
      const source = props.shortDesc || props.description;
      if (!source) {
        return "";
      }
      const text = String(source).replace(/\s+/g, " ").trim();
      if (text.length <= 140) {
        return text;
      }
      return `${text.slice(0, 140)}…`;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<article${ssrRenderAttrs(mergeProps({ class: "blog-article hover-img" }, _attrs))} data-v-ba64ef21>`);
      _push(ssrRenderComponent(unref(Link), {
        href: __props.link,
        class: "entry_image img-style"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (__props.image) {
              _push2(`<img${ssrRenderAttr("src", __props.image)}${ssrRenderAttr("alt", __props.title)} width="732" height="412" loading="lazy" decoding="async" data-v-ba64ef21${_scopeId}>`);
            } else {
              _push2(`<div class="services-card__placeholder" aria-hidden="true" data-v-ba64ef21${_scopeId}><span class="icon icon-star" data-v-ba64ef21${_scopeId}></span></div>`);
            }
          } else {
            return [
              __props.image ? (openBlock(), createBlock("img", {
                key: 0,
                src: __props.image,
                alt: __props.title,
                width: "732",
                height: "412",
                loading: "lazy",
                decoding: "async"
              }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                key: 1,
                class: "services-card__placeholder",
                "aria-hidden": "true"
              }, [
                createVNode("span", { class: "icon icon-star" })
              ]))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="article_content" data-v-ba64ef21>`);
      if (__props.categoryName) {
        _push(`<p class="text-caption font-2 text-main-5" data-v-ba64ef21>${ssrInterpolate(__props.categoryName)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(unref(Link), {
        href: __props.link,
        class: "entry_title font-3 h5 link text-main-2"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.title)}`);
          } else {
            return [
              createTextVNode(toDisplayString(__props.title), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      if (shortDescription.value) {
        _push(`<p class="entry_desc" data-v-ba64ef21>${ssrInterpolate(shortDescription.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (safeHighlights.value.length) {
        _push(`<ul class="services-card__tags" data-v-ba64ef21><!--[-->`);
        ssrRenderList(safeHighlights.value, (item, index) => {
          _push(`<li data-v-ba64ef21>${ssrInterpolate(item)}</li>`);
        });
        _push(`<!--]--></ul>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="br-line has-dot" data-v-ba64ef21></div><div class="entry_meta" data-v-ba64ef21>`);
      if (__props.readingTime) {
        _push(`<div class="meta meta__date" data-v-ba64ef21><i class="icon icon-Clock" data-v-ba64ef21></i><span class="meta-text text-body-3" data-v-ba64ef21>${ssrInterpolate(__props.readingTime)} ${ssrInterpolate(__props.readingTimeLabel)}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(unref(Link), {
        href: __props.link,
        class: "tf-btn text-body-3 animate-btn",
        "aria-label": buttonText.value
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(buttonText.value)}`);
          } else {
            return [
              createTextVNode(toDisplayString(buttonText.value), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></article>`);
    };
  }
};
const _sfc_setup$r = _sfc_main$r.setup;
_sfc_main$r.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Services/ServiceCardThree.vue");
  return _sfc_setup$r ? _sfc_setup$r(props, ctx) : void 0;
};
const ServiceCardThree = /* @__PURE__ */ _export_sfc(_sfc_main$r, [["__scopeId", "data-v-ba64ef21"]]);
const __default__$1 = {
  components: {
    AppLayout: _sfc_main$R,
    CtaTwo: _sfc_main$J
  }
};
const _sfc_main$q = /* @__PURE__ */ Object.assign(__default__$1, {
  __name: "ServiceIndex",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const trans = (key) => page.props.translations[key] || key;
    const seo = computed(() => page.props.seo);
    const settings = computed(() => page.props.settings || {});
    const locale = computed(() => page.props.locale || "en");
    const categories = computed(() => page.props.categories || []);
    const recentServices = computed(() => page.props.recentServices || []);
    const filters = computed(() => page.props.filters || {});
    const meta = computed(() => page.props.meta || {});
    const totalServicesCount = computed(() => page.props.totalServicesCount || 0);
    const searchQuery = ref(filters.value.search || "");
    const metaTitle = computed(() => {
      return `${trans("Our Services")} | ${seo.value.website_name || ""}`.trim();
    });
    const metaDescription = computed(() => {
      return meta.value.description || trans("Discover our IT services designed to scale and modernize your business.") || seo.value.website_desc || "";
    });
    const metaKeywords = computed(() => {
      return meta.value.keywords || trans("IT services, web development, mobile apps, AI solutions, cloud services") || seo.value.website_keywords || "";
    });
    const metaImage = computed(() => {
      var _a, _b, _c, _d, _e;
      return ((_b = (_a = meta.value) == null ? void 0 : _a.og) == null ? void 0 : _b.image) || ((_d = (_c = meta.value) == null ? void 0 : _c.twitter) == null ? void 0 : _d.image) || ((_e = settings.value) == null ? void 0 : _e.meta_img) || "";
    });
    const metaCanonical = computed(() => meta.value.canonical || "");
    const metaRobots = computed(() => meta.value.robots || "index, follow");
    const services = computed(() => {
      const source = page.props.services || { data: [], links: [], last_page: 1 };
      const data = Array.isArray(source.data) ? source.data.filter((service) => service && service.id) : [];
      return {
        ...source,
        data
      };
    });
    const translateField = (value) => {
      if (!value) return "";
      if (typeof value === "string") return value;
      if (typeof value === "object" && value !== null) {
        return value[locale.value] || value["en"] || value[Object.keys(value)[0]] || "";
      }
      return "";
    };
    const getServiceUrl = (service) => {
      if (!service || !service.slug) {
        return "#";
      }
      try {
        return route("services.show", service.slug);
      } catch (e2) {
        return "#";
      }
    };
    const getServiceTitle = (service) => translateField(service == null ? void 0 : service.title);
    const getServiceDescription = (service) => translateField(service == null ? void 0 : service.description);
    const getCategoryName = (category) => translateField(category == null ? void 0 : category.title);
    const categoryUrl = (slug = null) => {
      const params = {};
      if (slug) {
        params.category = slug;
      }
      if (searchQuery.value) {
        params.search = searchQuery.value;
      }
      try {
        return route("services.index", params);
      } catch (e2) {
        return "/services";
      }
    };
    const submitSearch = () => {
      var _a;
      const params = {};
      if ((_a = searchQuery.value) == null ? void 0 : _a.trim()) {
        params.search = searchQuery.value.trim();
      }
      if (filters.value.category) {
        params.category = filters.value.category;
      }
      router.get(route("services.index"), params, {
        preserveState: true,
        preserveScroll: true
      });
    };
    const stripPaginationLabel = (label) => String(label || "").replace(/<[^>]*>/g, "").trim();
    const normalizeKeywords = (rawKeywords) => {
      if (!rawKeywords) {
        return [];
      }
      let parsed = rawKeywords;
      if (typeof rawKeywords === "string") {
        try {
          parsed = JSON.parse(rawKeywords);
        } catch (e2) {
          parsed = rawKeywords;
        }
      }
      if (Array.isArray(parsed)) {
        return parsed.map((item) => {
          if (typeof item === "string") {
            return item;
          }
          if (item && typeof item === "object") {
            if (item.value) {
              return translateField(item.value);
            }
            return translateField(item);
          }
          return "";
        }).map((item) => item == null ? void 0 : item.toString().trim()).filter(Boolean);
      }
      if (typeof parsed === "object") {
        const value = translateField(parsed);
        return value ? [value] : [];
      }
      return parsed.toString().split(/[,;\n]+/).map((item) => item.trim()).filter(Boolean);
    };
    const getServiceHighlights = (service) => normalizeKeywords(service == null ? void 0 : service.keywords);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), null, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<title data-v-3cc96cf4${_scopeId}>${ssrInterpolate(metaTitle.value)}</title><meta name="description"${ssrRenderAttr("content", metaDescription.value)} data-v-3cc96cf4${_scopeId}><meta name="keywords"${ssrRenderAttr("content", metaKeywords.value)} data-v-3cc96cf4${_scopeId}><meta name="robots"${ssrRenderAttr("content", metaRobots.value)} data-v-3cc96cf4${_scopeId}>`);
            if (metaCanonical.value) {
              _push2(`<link rel="canonical"${ssrRenderAttr("href", metaCanonical.value)} data-v-3cc96cf4${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<meta property="og:title"${ssrRenderAttr("content", metaTitle.value)} data-v-3cc96cf4${_scopeId}><meta property="og:description"${ssrRenderAttr("content", metaDescription.value)} data-v-3cc96cf4${_scopeId}>`);
            if (metaImage.value) {
              _push2(`<meta property="og:image"${ssrRenderAttr("content", metaImage.value)} data-v-3cc96cf4${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            if (metaCanonical.value) {
              _push2(`<meta property="og:url"${ssrRenderAttr("content", metaCanonical.value)} data-v-3cc96cf4${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<meta property="og:type" content="website" data-v-3cc96cf4${_scopeId}><meta name="twitter:card" content="summary_large_image" data-v-3cc96cf4${_scopeId}><meta name="twitter:title"${ssrRenderAttr("content", metaTitle.value)} data-v-3cc96cf4${_scopeId}><meta name="twitter:description"${ssrRenderAttr("content", metaDescription.value)} data-v-3cc96cf4${_scopeId}>`);
            if (metaImage.value) {
              _push2(`<meta name="twitter:image"${ssrRenderAttr("content", metaImage.value)} data-v-3cc96cf4${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("title", null, toDisplayString(metaTitle.value), 1),
              createVNode("meta", {
                name: "description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "keywords",
                content: metaKeywords.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "robots",
                content: metaRobots.value
              }, null, 8, ["content"]),
              metaCanonical.value ? (openBlock(), createBlock("link", {
                key: 0,
                rel: "canonical",
                href: metaCanonical.value
              }, null, 8, ["href"])) : createCommentVNode("", true),
              createVNode("meta", {
                property: "og:title",
                content: metaTitle.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              metaImage.value ? (openBlock(), createBlock("meta", {
                key: 1,
                property: "og:image",
                content: metaImage.value
              }, null, 8, ["content"])) : createCommentVNode("", true),
              metaCanonical.value ? (openBlock(), createBlock("meta", {
                key: 2,
                property: "og:url",
                content: metaCanonical.value
              }, null, 8, ["content"])) : createCommentVNode("", true),
              createVNode("meta", {
                property: "og:type",
                content: "website"
              }),
              createVNode("meta", {
                name: "twitter:card",
                content: "summary_large_image"
              }),
              createVNode("meta", {
                name: "twitter:title",
                content: metaTitle.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "twitter:description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              metaImage.value ? (openBlock(), createBlock("meta", {
                key: 3,
                name: "twitter:image",
                content: metaImage.value
              }, null, 8, ["content"])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$R, null, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$N, {
              title: trans("Our Services")
            }, null, _parent2, _scopeId));
            _push2(`<section class="section-page-blog flat-spacing-2" data-v-3cc96cf4${_scopeId}><div class="container" data-v-3cc96cf4${_scopeId}><div class="content-1200" data-v-3cc96cf4${_scopeId}><div class="sect-title wow fadeInUp" data-v-3cc96cf4${_scopeId}><h2 class="s-title font-3" data-v-3cc96cf4${_scopeId}>${ssrInterpolate(trans("Scale Your Business Smarter with Next-Gen IT Solutions"))}</h2><p class="s-sub_title" data-v-3cc96cf4${_scopeId}>${ssrInterpolate(trans("Discover our IT services designed to scale and modernize your business."))}</p></div><div class="page-blog_content" data-v-3cc96cf4${_scopeId}><div class="col-left" data-v-3cc96cf4${_scopeId}>`);
            if (services.value.data.length) {
              _push2(`<div class="blog-list services-index__grid" data-v-3cc96cf4${_scopeId}><!--[-->`);
              ssrRenderList(services.value.data, (serviceItem) => {
                _push2(ssrRenderComponent(ServiceCardThree, {
                  key: serviceItem.id,
                  title: getServiceTitle(serviceItem),
                  description: getServiceDescription(serviceItem),
                  highlights: getServiceHighlights(serviceItem),
                  link: getServiceUrl(serviceItem),
                  image: serviceItem.image_link,
                  "is-rtl": locale.value === "ar",
                  "reading-time": serviceItem.reading_time,
                  "reading-time-label": trans("min read"),
                  "category-name": getCategoryName(serviceItem.category),
                  "button-label": trans("View Details")
                }, null, _parent2, _scopeId));
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<div class="services-index__empty" data-v-3cc96cf4${_scopeId}><h3 class="s-title font-3 h4" data-v-3cc96cf4${_scopeId}>${ssrInterpolate(trans("No services found"))}</h3><p class="s-sub_title" data-v-3cc96cf4${_scopeId}>${ssrInterpolate(trans("Check back soon — we are adding new services."))}</p>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: _ctx.route("services.index"),
                class: "tf-btn animate-btn mt-3"
              }, {
                default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(trans("All Services"))}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(trans("All Services")), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            }
            if (services.value.last_page > 1) {
              _push2(`<div class="pagination-list services-index__pagination" data-v-3cc96cf4${_scopeId}>`);
              if (services.value.prev_page_url) {
                _push2(ssrRenderComponent(unref(Link), {
                  href: services.value.prev_page_url,
                  class: "pagination-item pagination-item--prev",
                  "aria-label": "Previous"
                }, {
                  default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<span class="icon icon-CaretDoubleRight fs-20" data-v-3cc96cf4${_scopeId2}></span>`);
                    } else {
                      return [
                        createVNode("span", { class: "icon icon-CaretDoubleRight fs-20" })
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`<!--[-->`);
              ssrRenderList(services.value.links, (link, linkIndex) => {
                _push2(`<!--[-->`);
                if (link.url && linkIndex > 0 && linkIndex < services.value.links.length - 1) {
                  _push2(ssrRenderComponent(unref(Link), {
                    href: link.url,
                    class: ["pagination-item", { active: link.active }]
                  }, {
                    default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`<span data-v-3cc96cf4${_scopeId2}>${ssrInterpolate(stripPaginationLabel(link.label))}</span>`);
                      } else {
                        return [
                          createVNode("span", null, toDisplayString(stripPaginationLabel(link.label)), 1)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<!--]-->`);
              });
              _push2(`<!--]-->`);
              if (services.value.next_page_url) {
                _push2(ssrRenderComponent(unref(Link), {
                  href: services.value.next_page_url,
                  class: "pagination-item",
                  "aria-label": "Next"
                }, {
                  default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<span class="icon icon-CaretDoubleRight fs-20" data-v-3cc96cf4${_scopeId2}></span>`);
                    } else {
                      return [
                        createVNode("span", { class: "icon icon-CaretDoubleRight fs-20" })
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><aside class="col-right" data-v-3cc96cf4${_scopeId}><div class="blog-sidebar sidebar-content-wrap" data-v-3cc96cf4${_scopeId}><div class="sidebar-item" data-v-3cc96cf4${_scopeId}><h5 class="sb-title font-3 text-linear" data-v-3cc96cf4${_scopeId}>${ssrInterpolate(trans("Search"))}</h5><div class="br-line has-dot" data-v-3cc96cf4${_scopeId}></div><form class="form-search" data-v-3cc96cf4${_scopeId}><input${ssrRenderAttr("value", searchQuery.value)} class="style-large type-radius-2" type="search"${ssrRenderAttr("placeholder", trans("Search services..."))} data-v-3cc96cf4${_scopeId}><button type="submit" class="btn_submit tf-btn text-body-3 style-2 animate-btn animate-dark"${ssrRenderAttr("aria-label", trans("Search"))} data-v-3cc96cf4${_scopeId}><i class="icon icon-MagnifyingGlass" data-v-3cc96cf4${_scopeId}></i></button></form></div><div class="sidebar-item" data-v-3cc96cf4${_scopeId}><h5 class="sb-title font-3 text-linear" data-v-3cc96cf4${_scopeId}>${ssrInterpolate(trans("Service Categories"))}</h5><div class="br-line has-dot" data-v-3cc96cf4${_scopeId}></div><ul class="sb-category" data-v-3cc96cf4${_scopeId}><li data-v-3cc96cf4${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: categoryUrl(),
              class: { active: !filters.value.category }
            }, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span data-v-3cc96cf4${_scopeId2}>${ssrInterpolate(trans("All Services"))} (${ssrInterpolate(totalServicesCount.value)})</span><i class="icon icon-ArrowUpRight" data-v-3cc96cf4${_scopeId2}></i>`);
                } else {
                  return [
                    createVNode("span", null, toDisplayString(trans("All Services")) + " (" + toDisplayString(totalServicesCount.value) + ")", 1),
                    createVNode("i", { class: "icon icon-ArrowUpRight" })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</li><!--[-->`);
            ssrRenderList(categories.value, (category) => {
              _push2(`<li data-v-3cc96cf4${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: categoryUrl(category.slug),
                class: { active: filters.value.category === category.slug }
              }, {
                default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span data-v-3cc96cf4${_scopeId2}>${ssrInterpolate(getCategoryName(category))} (${ssrInterpolate(category.services_count || 0)})</span><i class="icon icon-ArrowUpRight" data-v-3cc96cf4${_scopeId2}></i>`);
                  } else {
                    return [
                      createVNode("span", null, toDisplayString(getCategoryName(category)) + " (" + toDisplayString(category.services_count || 0) + ")", 1),
                      createVNode("i", { class: "icon icon-ArrowUpRight" })
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`</li>`);
            });
            _push2(`<!--]--></ul></div>`);
            if (recentServices.value.length) {
              _push2(`<div class="sidebar-item" data-v-3cc96cf4${_scopeId}><h5 class="sb-title font-3 text-linear" data-v-3cc96cf4${_scopeId}>${ssrInterpolate(trans("Recent services"))}</h5><div class="br-line has-dot" data-v-3cc96cf4${_scopeId}></div><ul class="sb-recent" data-v-3cc96cf4${_scopeId}><!--[-->`);
              ssrRenderList(recentServices.value, (item) => {
                _push2(`<li class="sb-recent_item hover-img" data-v-3cc96cf4${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Link), {
                  href: getServiceUrl(item),
                  class: "recent__image img-style"
                }, {
                  default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      if (item.image_link) {
                        _push3(`<img${ssrRenderAttr("src", item.image_link)}${ssrRenderAttr("alt", getServiceTitle(item))} width="94" height="94" loading="lazy" data-v-3cc96cf4${_scopeId2}>`);
                      } else {
                        _push3(`<!---->`);
                      }
                    } else {
                      return [
                        item.image_link ? (openBlock(), createBlock("img", {
                          key: 0,
                          src: item.image_link,
                          alt: getServiceTitle(item),
                          width: "94",
                          height: "94",
                          loading: "lazy"
                        }, null, 8, ["src", "alt"])) : createCommentVNode("", true)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`<div class="recent__content" data-v-3cc96cf4${_scopeId}>`);
                if (item.created_at) {
                  _push2(`<div class="entry_date" data-v-3cc96cf4${_scopeId}><i class="icon icon-Clock" data-v-3cc96cf4${_scopeId}></i><span class="date text-body-3" data-v-3cc96cf4${_scopeId}>${ssrInterpolate(item.created_at)}</span></div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(ssrRenderComponent(unref(Link), {
                  href: getServiceUrl(item),
                  class: "entry_name link"
                }, {
                  default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(getServiceTitle(item))}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(getServiceTitle(item)), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`</div></li>`);
              });
              _push2(`<!--]--></ul></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></aside></div></div></div></section>`);
            _push2(ssrRenderComponent(_sfc_main$J, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$N, {
                title: trans("Our Services")
              }, null, 8, ["title"]),
              createVNode("section", { class: "section-page-blog flat-spacing-2" }, [
                createVNode("div", { class: "container" }, [
                  createVNode("div", { class: "content-1200" }, [
                    createVNode("div", { class: "sect-title wow fadeInUp" }, [
                      createVNode("h2", { class: "s-title font-3" }, toDisplayString(trans("Scale Your Business Smarter with Next-Gen IT Solutions")), 1),
                      createVNode("p", { class: "s-sub_title" }, toDisplayString(trans("Discover our IT services designed to scale and modernize your business.")), 1)
                    ]),
                    createVNode("div", { class: "page-blog_content" }, [
                      createVNode("div", { class: "col-left" }, [
                        services.value.data.length ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "blog-list services-index__grid"
                        }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(services.value.data, (serviceItem) => {
                            return openBlock(), createBlock(ServiceCardThree, {
                              key: serviceItem.id,
                              title: getServiceTitle(serviceItem),
                              description: getServiceDescription(serviceItem),
                              highlights: getServiceHighlights(serviceItem),
                              link: getServiceUrl(serviceItem),
                              image: serviceItem.image_link,
                              "is-rtl": locale.value === "ar",
                              "reading-time": serviceItem.reading_time,
                              "reading-time-label": trans("min read"),
                              "category-name": getCategoryName(serviceItem.category),
                              "button-label": trans("View Details")
                            }, null, 8, ["title", "description", "highlights", "link", "image", "is-rtl", "reading-time", "reading-time-label", "category-name", "button-label"]);
                          }), 128))
                        ])) : (openBlock(), createBlock("div", {
                          key: 1,
                          class: "services-index__empty"
                        }, [
                          createVNode("h3", { class: "s-title font-3 h4" }, toDisplayString(trans("No services found")), 1),
                          createVNode("p", { class: "s-sub_title" }, toDisplayString(trans("Check back soon — we are adding new services.")), 1),
                          createVNode(unref(Link), {
                            href: _ctx.route("services.index"),
                            class: "tf-btn animate-btn mt-3"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(trans("All Services")), 1)
                            ]),
                            _: 1
                          }, 8, ["href"])
                        ])),
                        services.value.last_page > 1 ? (openBlock(), createBlock("div", {
                          key: 2,
                          class: "pagination-list services-index__pagination"
                        }, [
                          services.value.prev_page_url ? (openBlock(), createBlock(unref(Link), {
                            key: 0,
                            href: services.value.prev_page_url,
                            class: "pagination-item pagination-item--prev",
                            "aria-label": "Previous"
                          }, {
                            default: withCtx(() => [
                              createVNode("span", { class: "icon icon-CaretDoubleRight fs-20" })
                            ]),
                            _: 1
                          }, 8, ["href"])) : createCommentVNode("", true),
                          (openBlock(true), createBlock(Fragment, null, renderList(services.value.links, (link, linkIndex) => {
                            return openBlock(), createBlock(Fragment, { key: linkIndex }, [
                              link.url && linkIndex > 0 && linkIndex < services.value.links.length - 1 ? (openBlock(), createBlock(unref(Link), {
                                key: 0,
                                href: link.url,
                                class: ["pagination-item", { active: link.active }]
                              }, {
                                default: withCtx(() => [
                                  createVNode("span", null, toDisplayString(stripPaginationLabel(link.label)), 1)
                                ]),
                                _: 2
                              }, 1032, ["href", "class"])) : createCommentVNode("", true)
                            ], 64);
                          }), 128)),
                          services.value.next_page_url ? (openBlock(), createBlock(unref(Link), {
                            key: 1,
                            href: services.value.next_page_url,
                            class: "pagination-item",
                            "aria-label": "Next"
                          }, {
                            default: withCtx(() => [
                              createVNode("span", { class: "icon icon-CaretDoubleRight fs-20" })
                            ]),
                            _: 1
                          }, 8, ["href"])) : createCommentVNode("", true)
                        ])) : createCommentVNode("", true)
                      ]),
                      createVNode("aside", { class: "col-right" }, [
                        createVNode("div", { class: "blog-sidebar sidebar-content-wrap" }, [
                          createVNode("div", { class: "sidebar-item" }, [
                            createVNode("h5", { class: "sb-title font-3 text-linear" }, toDisplayString(trans("Search")), 1),
                            createVNode("div", { class: "br-line has-dot" }),
                            createVNode("form", {
                              class: "form-search",
                              onSubmit: withModifiers(submitSearch, ["prevent"])
                            }, [
                              withDirectives(createVNode("input", {
                                "onUpdate:modelValue": ($event) => searchQuery.value = $event,
                                class: "style-large type-radius-2",
                                type: "search",
                                placeholder: trans("Search services...")
                              }, null, 8, ["onUpdate:modelValue", "placeholder"]), [
                                [vModelText, searchQuery.value]
                              ]),
                              createVNode("button", {
                                type: "submit",
                                class: "btn_submit tf-btn text-body-3 style-2 animate-btn animate-dark",
                                "aria-label": trans("Search")
                              }, [
                                createVNode("i", { class: "icon icon-MagnifyingGlass" })
                              ], 8, ["aria-label"])
                            ], 32)
                          ]),
                          createVNode("div", { class: "sidebar-item" }, [
                            createVNode("h5", { class: "sb-title font-3 text-linear" }, toDisplayString(trans("Service Categories")), 1),
                            createVNode("div", { class: "br-line has-dot" }),
                            createVNode("ul", { class: "sb-category" }, [
                              createVNode("li", null, [
                                createVNode(unref(Link), {
                                  href: categoryUrl(),
                                  class: { active: !filters.value.category }
                                }, {
                                  default: withCtx(() => [
                                    createVNode("span", null, toDisplayString(trans("All Services")) + " (" + toDisplayString(totalServicesCount.value) + ")", 1),
                                    createVNode("i", { class: "icon icon-ArrowUpRight" })
                                  ]),
                                  _: 1
                                }, 8, ["href", "class"])
                              ]),
                              (openBlock(true), createBlock(Fragment, null, renderList(categories.value, (category) => {
                                return openBlock(), createBlock("li", {
                                  key: category.id
                                }, [
                                  createVNode(unref(Link), {
                                    href: categoryUrl(category.slug),
                                    class: { active: filters.value.category === category.slug }
                                  }, {
                                    default: withCtx(() => [
                                      createVNode("span", null, toDisplayString(getCategoryName(category)) + " (" + toDisplayString(category.services_count || 0) + ")", 1),
                                      createVNode("i", { class: "icon icon-ArrowUpRight" })
                                    ]),
                                    _: 2
                                  }, 1032, ["href", "class"])
                                ]);
                              }), 128))
                            ])
                          ]),
                          recentServices.value.length ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "sidebar-item"
                          }, [
                            createVNode("h5", { class: "sb-title font-3 text-linear" }, toDisplayString(trans("Recent services")), 1),
                            createVNode("div", { class: "br-line has-dot" }),
                            createVNode("ul", { class: "sb-recent" }, [
                              (openBlock(true), createBlock(Fragment, null, renderList(recentServices.value, (item) => {
                                return openBlock(), createBlock("li", {
                                  key: item.id,
                                  class: "sb-recent_item hover-img"
                                }, [
                                  createVNode(unref(Link), {
                                    href: getServiceUrl(item),
                                    class: "recent__image img-style"
                                  }, {
                                    default: withCtx(() => [
                                      item.image_link ? (openBlock(), createBlock("img", {
                                        key: 0,
                                        src: item.image_link,
                                        alt: getServiceTitle(item),
                                        width: "94",
                                        height: "94",
                                        loading: "lazy"
                                      }, null, 8, ["src", "alt"])) : createCommentVNode("", true)
                                    ]),
                                    _: 2
                                  }, 1032, ["href"]),
                                  createVNode("div", { class: "recent__content" }, [
                                    item.created_at ? (openBlock(), createBlock("div", {
                                      key: 0,
                                      class: "entry_date"
                                    }, [
                                      createVNode("i", { class: "icon icon-Clock" }),
                                      createVNode("span", { class: "date text-body-3" }, toDisplayString(item.created_at), 1)
                                    ])) : createCommentVNode("", true),
                                    createVNode(unref(Link), {
                                      href: getServiceUrl(item),
                                      class: "entry_name link"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(getServiceTitle(item)), 1)
                                      ]),
                                      _: 2
                                    }, 1032, ["href"])
                                  ])
                                ]);
                              }), 128))
                            ])
                          ])) : createCommentVNode("", true)
                        ])
                      ])
                    ])
                  ])
                ])
              ]),
              createVNode(_sfc_main$J)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$q = _sfc_main$q.setup;
_sfc_main$q.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("Modules/Services/resources/assets/js/Pages/ServiceIndex.vue");
  return _sfc_setup$q ? _sfc_setup$q(props, ctx) : void 0;
};
const ServiceIndex = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["__scopeId", "data-v-3cc96cf4"]]);
const __vite_glob_0_17 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ServiceIndex
}, Symbol.toStringTag, { value: "Module" }));
const __default__ = {
  components: {
    AppLayout: _sfc_main$R,
    CtaTwo: _sfc_main$J
  }
};
const _sfc_main$p = /* @__PURE__ */ Object.assign(__default__, {
  __name: "ServiceShow",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const trans = (key) => page.props.translations[key] || key;
    const seo = computed(() => page.props.seo);
    const settings = computed(() => page.props.settings || {});
    const asset_path = computed(() => page.props.asset_path || "");
    const locale = computed(() => page.props.locale || "en");
    const service = computed(() => page.props.service);
    const relatedServices = computed(() => page.props.relatedServices || []);
    const categories = computed(() => page.props.categories || []);
    const testimonials = computed(() => page.props.testimonials || []);
    const totalServicesCount = computed(() => page.props.totalServicesCount || 0);
    const meta = computed(() => page.props.meta || {});
    const metaTitle = computed(() => {
      return meta.value.title || `${getServiceTitle(service.value)} | ${seo.value.website_name || ""}`.trim();
    });
    const metaDescription = computed(() => {
      return meta.value.description || getServiceDescription(service.value) || seo.value.website_desc || "";
    });
    const metaKeywords = computed(() => {
      var _a;
      return meta.value.keywords || ((_a = service.value) == null ? void 0 : _a.keywords) || seo.value.website_keywords || "";
    });
    const metaImage = computed(() => {
      var _a, _b, _c, _d, _e, _f;
      return ((_b = (_a = meta.value) == null ? void 0 : _a.og) == null ? void 0 : _b.image) || ((_d = (_c = meta.value) == null ? void 0 : _c.twitter) == null ? void 0 : _d.image) || ((_e = service.value) == null ? void 0 : _e.image_link) || ((_f = settings.value) == null ? void 0 : _f.meta_img) || "";
    });
    const metaCanonical = computed(() => meta.value.canonical || "");
    const metaRobots = computed(() => meta.value.robots || "index, follow");
    const translateField = (value) => {
      if (!value) return "";
      if (typeof value === "string") return value;
      if (typeof value === "object" && value !== null) {
        return value[locale.value] || value["en"] || value[Object.keys(value)[0]] || "";
      }
      return "";
    };
    const getServiceUrl = (serviceItem) => {
      if (!serviceItem || !serviceItem.slug) {
        return "#";
      }
      try {
        return route("services.show", serviceItem.slug);
      } catch (e2) {
        return "#";
      }
    };
    const getServiceTitle = (serviceItem) => {
      return translateField(serviceItem == null ? void 0 : serviceItem.title);
    };
    const getServiceDescription = (serviceItem) => {
      return translateField(serviceItem == null ? void 0 : serviceItem.description);
    };
    const getCategoryName = (category) => {
      return translateField(category == null ? void 0 : category.title);
    };
    const normalizeKeywords = (rawKeywords) => {
      if (!rawKeywords) {
        return [];
      }
      let parsed = rawKeywords;
      if (typeof rawKeywords === "string") {
        const trimmed = rawKeywords.trim();
        if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
          try {
            parsed = JSON.parse(trimmed);
          } catch (e2) {
            try {
              parsed = JSON.parse(trimmed.replace(/'/g, '"'));
            } catch (err) {
              parsed = rawKeywords;
            }
          }
        }
      }
      if (Array.isArray(parsed)) {
        return parsed.map((item) => {
          if (typeof item === "string") {
            return item;
          }
          if (item && typeof item === "object") {
            if (item.value) {
              return translateField(item.value);
            }
            return translateField(item);
          }
          return "";
        }).map((item) => String(item).trim()).filter(Boolean);
      }
      if (typeof parsed === "object") {
        const value = translateField(parsed);
        return value ? [value] : [];
      }
      return parsed.toString().split(/[,;\n]+/).map((item) => item.trim()).filter(Boolean);
    };
    const getServiceHighlights = (serviceItem) => {
      return normalizeKeywords(translateField(serviceItem == null ? void 0 : serviceItem.keywords));
    };
    onMounted(() => {
      nextTick(() => {
        if (typeof $ !== "undefined" && $(".testimonial-one__carousel").length && testimonials.value.length) {
          $(".testimonial-one__carousel").owlCarousel({
            loop: testimonials.value.length > 1,
            margin: 30,
            nav: false,
            dots: true,
            smartSpeed: 500,
            autoplay: true,
            autoplayTimeout: 7e3,
            rtl: locale.value === "ar",
            responsive: {
              0: { items: 1 },
              768: { items: 1 },
              992: { items: 1 },
              1200: { items: 1 }
            }
          });
        }
        if (typeof WOW !== "undefined") {
          new WOW().init();
        }
        if (typeof gsap !== "undefined" && typeof SplitText !== "undefined") {
          const titleAnimations = document.querySelectorAll(".sec-title-animation .title-animation");
          if (titleAnimations.length) {
            titleAnimations.forEach((quote) => {
              let split = new SplitText(quote, { type: "lines" });
              gsap.from(split.lines, {
                duration: 1,
                y: 100,
                opacity: 0,
                stagger: 0.1,
                scrollTrigger: {
                  trigger: quote,
                  start: "top 90%",
                  toggleActions: "play none none none"
                }
              });
            });
          }
        }
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), null, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<title${_scopeId}>${ssrInterpolate(metaTitle.value)}</title><meta name="description"${ssrRenderAttr("content", metaDescription.value)}${_scopeId}><meta name="keywords"${ssrRenderAttr("content", metaKeywords.value)}${_scopeId}><meta name="robots"${ssrRenderAttr("content", metaRobots.value)}${_scopeId}>`);
            if (metaCanonical.value) {
              _push2(`<link rel="canonical"${ssrRenderAttr("href", metaCanonical.value)}${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<meta property="og:title"${ssrRenderAttr("content", metaTitle.value)}${_scopeId}><meta property="og:description"${ssrRenderAttr("content", metaDescription.value)}${_scopeId}>`);
            if (metaImage.value) {
              _push2(`<meta property="og:image"${ssrRenderAttr("content", metaImage.value)}${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            if (metaCanonical.value) {
              _push2(`<meta property="og:url"${ssrRenderAttr("content", metaCanonical.value)}${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<meta property="og:type" content="article"${_scopeId}><meta name="twitter:card" content="summary_large_image"${_scopeId}><meta name="twitter:title"${ssrRenderAttr("content", metaTitle.value)}${_scopeId}><meta name="twitter:description"${ssrRenderAttr("content", metaDescription.value)}${_scopeId}>`);
            if (metaImage.value) {
              _push2(`<meta name="twitter:image"${ssrRenderAttr("content", metaImage.value)}${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("title", null, toDisplayString(metaTitle.value), 1),
              createVNode("meta", {
                name: "description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "keywords",
                content: metaKeywords.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "robots",
                content: metaRobots.value
              }, null, 8, ["content"]),
              metaCanonical.value ? (openBlock(), createBlock("link", {
                key: 0,
                rel: "canonical",
                href: metaCanonical.value
              }, null, 8, ["href"])) : createCommentVNode("", true),
              createVNode("meta", {
                property: "og:title",
                content: metaTitle.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              metaImage.value ? (openBlock(), createBlock("meta", {
                key: 1,
                property: "og:image",
                content: metaImage.value
              }, null, 8, ["content"])) : createCommentVNode("", true),
              metaCanonical.value ? (openBlock(), createBlock("meta", {
                key: 2,
                property: "og:url",
                content: metaCanonical.value
              }, null, 8, ["content"])) : createCommentVNode("", true),
              createVNode("meta", {
                property: "og:type",
                content: "article"
              }),
              createVNode("meta", {
                name: "twitter:card",
                content: "summary_large_image"
              }),
              createVNode("meta", {
                name: "twitter:title",
                content: metaTitle.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "twitter:description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              metaImage.value ? (openBlock(), createBlock("meta", {
                key: 3,
                name: "twitter:image",
                content: metaImage.value
              }, null, 8, ["content"])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$R, null, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          var _a, _b, _c, _d;
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$N, {
              title: getServiceTitle(service.value)
            }, null, _parent2, _scopeId));
            _push2(`<section class="services-details"${_scopeId}><div class="container"${_scopeId}><div class="row"${_scopeId}><div class="col-xl-4 col-lg-5"${_scopeId}><div class="services-details__left"${_scopeId}><div class="services-details__services-list-box"${_scopeId}><h3 class="services-details__services-list-title"${_scopeId}>${ssrInterpolate(trans("Service Categories"))}</h3><ul class="services-details__services-list list-unstyled"${_scopeId}><li${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("services.index"),
              class: { "active": !((_b = (_a = service.value) == null ? void 0 : _a.category) == null ? void 0 : _b.slug) }
            }, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` (${ssrInterpolate(totalServicesCount.value)}) ${ssrInterpolate(trans("All Services"))} <span class="${ssrRenderClass(`icon-${locale.value === "ar" ? "left" : "right"}-arrow-2`)}"${_scopeId2}></span>`);
                } else {
                  return [
                    createTextVNode(" (" + toDisplayString(totalServicesCount.value) + ") " + toDisplayString(trans("All Services")) + " ", 1),
                    createVNode("span", {
                      class: `icon-${locale.value === "ar" ? "left" : "right"}-arrow-2`
                    }, null, 2)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</li><!--[-->`);
            ssrRenderList(categories.value, (category) => {
              var _a2, _b2;
              _push2(`<li${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: _ctx.route("services.index", { category: category.slug }),
                class: { "active": ((_b2 = (_a2 = service.value) == null ? void 0 : _a2.category) == null ? void 0 : _b2.slug) === category.slug }
              }, {
                default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` (${ssrInterpolate(category.services_count || 0)}) ${ssrInterpolate(getCategoryName(category))} <span class="${ssrRenderClass(`icon-${locale.value === "ar" ? "left" : "right"}-arrow-2`)}"${_scopeId2}></span>`);
                  } else {
                    return [
                      createTextVNode(" (" + toDisplayString(category.services_count || 0) + ") " + toDisplayString(getCategoryName(category)) + " ", 1),
                      createVNode("span", {
                        class: `icon-${locale.value === "ar" ? "left" : "right"}-arrow-2`
                      }, null, 2)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`</li>`);
            });
            _push2(`<!--]--></ul></div><div class="services-details__need-help"${_scopeId}><div class="services-details__need-help-img"${_scopeId}><img${ssrRenderAttr("src", asset_path.value + "images/need_help.jpg")}${ssrRenderAttr("alt", trans("Need help"))}${_scopeId}><div class="services-details__need-help-content"${_scopeId}><div class="services-details__need-help-bdr"${_scopeId}></div><h3 class="services-details__need-help-title"${_scopeId}>${ssrInterpolate(trans("Need Help?"))}</h3><p class="services-details__need-help-number"${_scopeId}><a dir="ltr"${ssrRenderAttr("href", `tel:${settings.value.website_phone || settings.value.phone}`)}${_scopeId}>${ssrInterpolate(settings.value.website_phone || settings.value.phone || "+12 (00) 345 789034")}</a></p></div></div></div></div></div><div class="col-xl-8 col-lg-7"${_scopeId}><div class="services-details__right"${_scopeId}><h1 class="services-details__title-1"${_scopeId}>${ssrInterpolate(getServiceTitle(service.value))}</h1><div class="services-details__bdr"${_scopeId}></div>`);
            if (service.value.reading_time) {
              _push2(`<ul class="blog-details__meta list-unstyled"${_scopeId}><li${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Link), null, {
                default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="far fa-clock"${_scopeId2}></span>${ssrInterpolate(service.value.reading_time)} ${ssrInterpolate(trans("min read"))}`);
                  } else {
                    return [
                      createVNode("span", { class: "far fa-clock" }),
                      createTextVNode(toDisplayString(service.value.reading_time) + " " + toDisplayString(trans("min read")), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</li></ul>`);
            } else {
              _push2(`<!---->`);
            }
            if (service.value.image_link) {
              _push2(`<div class="services-details__img-1 my-3"${_scopeId}><img${ssrRenderAttr("src", service.value.image_link)}${ssrRenderAttr("alt", getServiceTitle(service.value))} loading="lazy" decoding="async"${_scopeId}></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="services-details__text-1" style="${ssrRenderStyle({ "line-height": "27px !important" })}"${_scopeId}><div${_scopeId}>${service.value.content ?? ""}</div></div></div></div></div></div></section>`);
            if (relatedServices.value.length) {
              _push2(`<section class="services-carousel-page services-related mb-5"${_scopeId}><div class="container"${_scopeId}><div class="section-title text-center sec-title-animation animation-style1"${_scopeId}><div class="section-title__tagline-box"${_scopeId}><div class="section-title__tagline-shape-1"${_scopeId}></div><span class="section-title__tagline"${_scopeId}>${ssrInterpolate(trans("Related Services"))}</span><div class="section-title__tagline-shape-2"${_scopeId}></div></div><h2 class="section-title__title title-animation"${_scopeId}>${ssrInterpolate(trans("Explore More"))} <span${_scopeId}>${ssrInterpolate(trans("Services"))}</span></h2></div><div class="row"${_scopeId}><!--[-->`);
              ssrRenderList(relatedServices.value, (relatedService) => {
                _push2(`<div class="col-xl-4 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay="100ms"${_scopeId}>`);
                _push2(ssrRenderComponent(ServiceCardThree, {
                  title: getServiceTitle(relatedService),
                  description: getServiceDescription(relatedService),
                  highlights: getServiceHighlights(relatedService),
                  link: getServiceUrl(relatedService),
                  image: relatedService.image_link,
                  "is-rtl": locale.value === "ar",
                  "reading-time": relatedService.reading_time,
                  "reading-time-label": trans("min read"),
                  "category-name": getCategoryName(relatedService.category),
                  "button-label": trans("View Details")
                }, null, _parent2, _scopeId));
                _push2(`</div>`);
              });
              _push2(`<!--]--></div></div></section>`);
            } else {
              _push2(`<!---->`);
            }
            if (testimonials.value && testimonials.value.length) {
              _push2(`<section class="testimonial-one"${_scopeId}><div class="testimonial-one__shape-2 float-bob-y"${_scopeId}><img${ssrRenderAttr("src", asset_path.value + "images/shapes/testimonial-one-shape-2.png")}${ssrRenderAttr("alt", trans("Decorative shape"))} width="120" height="120" loading="lazy" decoding="async" aria-hidden="true"${_scopeId}></div><div class="container"${_scopeId}><div class="row"${_scopeId}><div class="col-xl-3"${_scopeId}></div><div class="col-xl-9"${_scopeId}><div class="testimonial-one__content-box"${_scopeId}><div class="section-title text-left sec-title-animation animation-style2"${_scopeId}><div class="section-title__tagline-box"${_scopeId}><div class="section-title__tagline-shape-1"${_scopeId}></div><span class="section-title__tagline"${_scopeId}>${ssrInterpolate(trans("Testimonials"))}</span><div class="section-title__tagline-shape-2"${_scopeId}></div></div><h2 class="section-title__title title-animation"${_scopeId}>${ssrInterpolate(trans("What Our Clients Say"))}</h2></div><div class="testimonial-one__carousel owl-theme owl-carousel"${_scopeId}><!--[-->`);
              ssrRenderList(testimonials.value, (testimonial) => {
                _push2(`<div class="item"${_scopeId}><div class="testimonial-one__single"${_scopeId}><div class="testimonial-one__img-box"${_scopeId}><div class="testimonial-one__img"${_scopeId}><img${ssrRenderAttr("src", testimonial.avatar_link)}${ssrRenderAttr("alt", translateField(testimonial.name))}${_scopeId}></div></div><div class="testimonial-one__content"${_scopeId}><p class="testimonial-one__text"${_scopeId}> “${ssrInterpolate(translateField(testimonial.quote))}” </p><div class="testimonial-one__bottom"${_scopeId}><div class="testimonial-one__quote-and-client-info"${_scopeId}><div class="testimonial-one__quote"${_scopeId}><span class="icon-left"${_scopeId}></span></div><div class="testimonial-one__client-info"${_scopeId}><p class="testimonial-one__client-sub-title"${_scopeId}>${ssrInterpolate(translateField(testimonial.position))}</p><h3 class="testimonial-one__client-name"${_scopeId}>${ssrInterpolate(translateField(testimonial.name))}</h3></div></div></div></div></div></div>`);
              });
              _push2(`<!--]--></div></div></div></div></div></section>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(_sfc_main$J, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$N, {
                title: getServiceTitle(service.value)
              }, null, 8, ["title"]),
              createVNode("section", { class: "services-details" }, [
                createVNode("div", { class: "container" }, [
                  createVNode("div", { class: "row" }, [
                    createVNode("div", { class: "col-xl-4 col-lg-5" }, [
                      createVNode("div", { class: "services-details__left" }, [
                        createVNode("div", { class: "services-details__services-list-box" }, [
                          createVNode("h3", { class: "services-details__services-list-title" }, toDisplayString(trans("Service Categories")), 1),
                          createVNode("ul", { class: "services-details__services-list list-unstyled" }, [
                            createVNode("li", null, [
                              createVNode(unref(Link), {
                                href: _ctx.route("services.index"),
                                class: { "active": !((_d = (_c = service.value) == null ? void 0 : _c.category) == null ? void 0 : _d.slug) }
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(" (" + toDisplayString(totalServicesCount.value) + ") " + toDisplayString(trans("All Services")) + " ", 1),
                                  createVNode("span", {
                                    class: `icon-${locale.value === "ar" ? "left" : "right"}-arrow-2`
                                  }, null, 2)
                                ]),
                                _: 1
                              }, 8, ["href", "class"])
                            ]),
                            (openBlock(true), createBlock(Fragment, null, renderList(categories.value, (category) => {
                              var _a2, _b2;
                              return openBlock(), createBlock("li", {
                                key: category.id
                              }, [
                                createVNode(unref(Link), {
                                  href: _ctx.route("services.index", { category: category.slug }),
                                  class: { "active": ((_b2 = (_a2 = service.value) == null ? void 0 : _a2.category) == null ? void 0 : _b2.slug) === category.slug }
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" (" + toDisplayString(category.services_count || 0) + ") " + toDisplayString(getCategoryName(category)) + " ", 1),
                                    createVNode("span", {
                                      class: `icon-${locale.value === "ar" ? "left" : "right"}-arrow-2`
                                    }, null, 2)
                                  ]),
                                  _: 2
                                }, 1032, ["href", "class"])
                              ]);
                            }), 128))
                          ])
                        ]),
                        createVNode("div", { class: "services-details__need-help" }, [
                          createVNode("div", { class: "services-details__need-help-img" }, [
                            createVNode("img", {
                              src: asset_path.value + "images/need_help.jpg",
                              alt: trans("Need help")
                            }, null, 8, ["src", "alt"]),
                            createVNode("div", { class: "services-details__need-help-content" }, [
                              createVNode("div", { class: "services-details__need-help-bdr" }),
                              createVNode("h3", { class: "services-details__need-help-title" }, toDisplayString(trans("Need Help?")), 1),
                              createVNode("p", { class: "services-details__need-help-number" }, [
                                createVNode("a", {
                                  dir: "ltr",
                                  href: `tel:${settings.value.website_phone || settings.value.phone}`
                                }, toDisplayString(settings.value.website_phone || settings.value.phone || "+12 (00) 345 789034"), 9, ["href"])
                              ])
                            ])
                          ])
                        ])
                      ])
                    ]),
                    createVNode("div", { class: "col-xl-8 col-lg-7" }, [
                      createVNode("div", { class: "services-details__right" }, [
                        createVNode("h1", { class: "services-details__title-1" }, toDisplayString(getServiceTitle(service.value)), 1),
                        createVNode("div", { class: "services-details__bdr" }),
                        service.value.reading_time ? (openBlock(), createBlock("ul", {
                          key: 0,
                          class: "blog-details__meta list-unstyled"
                        }, [
                          createVNode("li", null, [
                            createVNode(unref(Link), null, {
                              default: withCtx(() => [
                                createVNode("span", { class: "far fa-clock" }),
                                createTextVNode(toDisplayString(service.value.reading_time) + " " + toDisplayString(trans("min read")), 1)
                              ]),
                              _: 1
                            })
                          ])
                        ])) : createCommentVNode("", true),
                        service.value.image_link ? (openBlock(), createBlock("div", {
                          key: 1,
                          class: "services-details__img-1 my-3"
                        }, [
                          createVNode("img", {
                            src: service.value.image_link,
                            alt: getServiceTitle(service.value),
                            loading: "lazy",
                            decoding: "async"
                          }, null, 8, ["src", "alt"])
                        ])) : createCommentVNode("", true),
                        createVNode("div", {
                          class: "services-details__text-1",
                          style: { "line-height": "27px !important" }
                        }, [
                          createVNode("div", {
                            innerHTML: service.value.content
                          }, null, 8, ["innerHTML"])
                        ])
                      ])
                    ])
                  ])
                ])
              ]),
              relatedServices.value.length ? (openBlock(), createBlock("section", {
                key: 0,
                class: "services-carousel-page services-related mb-5"
              }, [
                createVNode("div", { class: "container" }, [
                  createVNode("div", { class: "section-title text-center sec-title-animation animation-style1" }, [
                    createVNode("div", { class: "section-title__tagline-box" }, [
                      createVNode("div", { class: "section-title__tagline-shape-1" }),
                      createVNode("span", { class: "section-title__tagline" }, toDisplayString(trans("Related Services")), 1),
                      createVNode("div", { class: "section-title__tagline-shape-2" })
                    ]),
                    createVNode("h2", { class: "section-title__title title-animation" }, [
                      createTextVNode(toDisplayString(trans("Explore More")) + " ", 1),
                      createVNode("span", null, toDisplayString(trans("Services")), 1)
                    ])
                  ]),
                  createVNode("div", { class: "row" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(relatedServices.value, (relatedService) => {
                      return openBlock(), createBlock("div", {
                        key: relatedService.id,
                        class: "col-xl-4 col-lg-6 col-md-6 wow fadeInUp",
                        "data-wow-delay": "100ms"
                      }, [
                        createVNode(ServiceCardThree, {
                          title: getServiceTitle(relatedService),
                          description: getServiceDescription(relatedService),
                          highlights: getServiceHighlights(relatedService),
                          link: getServiceUrl(relatedService),
                          image: relatedService.image_link,
                          "is-rtl": locale.value === "ar",
                          "reading-time": relatedService.reading_time,
                          "reading-time-label": trans("min read"),
                          "category-name": getCategoryName(relatedService.category),
                          "button-label": trans("View Details")
                        }, null, 8, ["title", "description", "highlights", "link", "image", "is-rtl", "reading-time", "reading-time-label", "category-name", "button-label"])
                      ]);
                    }), 128))
                  ])
                ])
              ])) : createCommentVNode("", true),
              testimonials.value && testimonials.value.length ? (openBlock(), createBlock("section", {
                key: 1,
                class: "testimonial-one"
              }, [
                createVNode("div", { class: "testimonial-one__shape-2 float-bob-y" }, [
                  createVNode("img", {
                    src: asset_path.value + "images/shapes/testimonial-one-shape-2.png",
                    alt: trans("Decorative shape"),
                    width: "120",
                    height: "120",
                    loading: "lazy",
                    decoding: "async",
                    "aria-hidden": "true"
                  }, null, 8, ["src", "alt"])
                ]),
                createVNode("div", { class: "container" }, [
                  createVNode("div", { class: "row" }, [
                    createVNode("div", { class: "col-xl-3" }),
                    createVNode("div", { class: "col-xl-9" }, [
                      createVNode("div", { class: "testimonial-one__content-box" }, [
                        createVNode("div", { class: "section-title text-left sec-title-animation animation-style2" }, [
                          createVNode("div", { class: "section-title__tagline-box" }, [
                            createVNode("div", { class: "section-title__tagline-shape-1" }),
                            createVNode("span", { class: "section-title__tagline" }, toDisplayString(trans("Testimonials")), 1),
                            createVNode("div", { class: "section-title__tagline-shape-2" })
                          ]),
                          createVNode("h2", { class: "section-title__title title-animation" }, toDisplayString(trans("What Our Clients Say")), 1)
                        ]),
                        createVNode("div", { class: "testimonial-one__carousel owl-theme owl-carousel" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(testimonials.value, (testimonial) => {
                            return openBlock(), createBlock("div", {
                              class: "item",
                              key: testimonial.id
                            }, [
                              createVNode("div", { class: "testimonial-one__single" }, [
                                createVNode("div", { class: "testimonial-one__img-box" }, [
                                  createVNode("div", { class: "testimonial-one__img" }, [
                                    createVNode("img", {
                                      src: testimonial.avatar_link,
                                      alt: translateField(testimonial.name)
                                    }, null, 8, ["src", "alt"])
                                  ])
                                ]),
                                createVNode("div", { class: "testimonial-one__content" }, [
                                  createVNode("p", { class: "testimonial-one__text" }, " “" + toDisplayString(translateField(testimonial.quote)) + "” ", 1),
                                  createVNode("div", { class: "testimonial-one__bottom" }, [
                                    createVNode("div", { class: "testimonial-one__quote-and-client-info" }, [
                                      createVNode("div", { class: "testimonial-one__quote" }, [
                                        createVNode("span", { class: "icon-left" })
                                      ]),
                                      createVNode("div", { class: "testimonial-one__client-info" }, [
                                        createVNode("p", { class: "testimonial-one__client-sub-title" }, toDisplayString(translateField(testimonial.position)), 1),
                                        createVNode("h3", { class: "testimonial-one__client-name" }, toDisplayString(translateField(testimonial.name)), 1)
                                      ])
                                    ])
                                  ])
                                ])
                              ])
                            ]);
                          }), 128))
                        ])
                      ])
                    ])
                  ])
                ])
              ])) : createCommentVNode("", true),
              createVNode(_sfc_main$J)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$p = _sfc_main$p.setup;
_sfc_main$p.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("Modules/Services/resources/assets/js/Pages/ServiceShow.vue");
  return _sfc_setup$p ? _sfc_setup$p(props, ctx) : void 0;
};
const __vite_glob_0_18 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$p
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$o = {
  __name: "PortalSelect",
  __ssrInlineRender: true,
  props: {
    modelValue: { type: [String, Number], default: "" },
    options: { type: Array, default: () => [] },
    placeholder: { type: String, default: "" },
    id: { type: String, default: "" },
    hasError: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const root = ref(null);
    const isOpen = ref(false);
    const hasValue = computed(() => props.modelValue !== "" && props.modelValue != null);
    const selectedLabel = computed(() => {
      const match = props.options.find((option) => String(option.value) === String(props.modelValue));
      return (match == null ? void 0 : match.label) ?? props.placeholder;
    });
    const isSelected = (value) => String(value) === String(props.modelValue);
    const close = () => {
      isOpen.value = false;
    };
    const handleClickOutside = (event) => {
      var _a;
      if (!((_a = root.value) == null ? void 0 : _a.contains(event.target))) {
        close();
      }
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        close();
      }
    };
    onMounted(() => {
      document.addEventListener("click", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    });
    onUnmounted(() => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        ref_key: "root",
        ref: root,
        class: ["portal-select", {
          "portal-select--open": isOpen.value,
          "portal-select--error": __props.hasError,
          "portal-select--disabled": __props.disabled
        }]
      }, _attrs))} data-v-2ede9016><button${ssrRenderAttr("id", __props.id)} type="button" class="${ssrRenderClass([{ "portal-select__trigger--error": __props.hasError }, "portal-select__trigger"])}"${ssrIncludeBooleanAttr(__props.disabled) ? " disabled" : ""}${ssrRenderAttr("aria-expanded", isOpen.value)} aria-haspopup="listbox" data-v-2ede9016><span class="${ssrRenderClass([{ "portal-select__value--placeholder": !hasValue.value }, "portal-select__value"])}" data-v-2ede9016>${ssrInterpolate(selectedLabel.value)}</span><i class="${ssrRenderClass([{ "portal-select__icon--open": isOpen.value }, "fas fa-chevron-down portal-select__icon"])}" data-v-2ede9016></i></button>`);
      if (isOpen.value) {
        _push(`<ul class="portal-select__menu" role="listbox"${ssrRenderAttr("aria-labelledby", __props.id)} data-v-2ede9016><!--[-->`);
        ssrRenderList(__props.options, (option) => {
          _push(`<li role="option" class="${ssrRenderClass([{ "portal-select__option--selected": isSelected(option.value) }, "portal-select__option"])}"${ssrRenderAttr("aria-selected", isSelected(option.value))} data-v-2ede9016>${ssrInterpolate(option.label)}</li>`);
        });
        _push(`<!--]--></ul>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$o = _sfc_main$o.setup;
_sfc_main$o.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Portal/PortalSelect.vue");
  return _sfc_setup$o ? _sfc_setup$o(props, ctx) : void 0;
};
const PortalSelect = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["__scopeId", "data-v-2ede9016"]]);
const _sfc_main$n = {
  __name: "Create",
  __ssrInlineRender: true,
  props: {
    categories: { type: Array, default: () => [] },
    priorities: { type: Array, default: () => [] },
    meta: { type: Object, default: () => ({}) }
  },
  setup(__props) {
    const props = __props;
    usePage();
    const { t: t3, ticketPriorityLabel } = usePortalTranslations();
    const metaTitle = computed(() => {
      var _a;
      return ((_a = props.meta) == null ? void 0 : _a.title) || t3("tickets.create_title");
    });
    const metaDescription = computed(() => {
      var _a;
      return ((_a = props.meta) == null ? void 0 : _a.description) || t3("pages.tickets_description");
    });
    const categoryOptions = computed(() => props.categories.map((category) => ({
      value: category.id,
      label: category.name
    })));
    const priorityOptions = computed(() => props.priorities.map((priority) => ({
      value: priority,
      label: ticketPriorityLabel(priority)
    })));
    const form = useForm({
      subject: "",
      description: "",
      ticket_category_id: "",
      priority: "medium",
      attachment: null
    });
    const onFileChange = (event) => {
      form.attachment = event.target.files[0] || null;
    };
    const submit = () => {
      form.post(route("portal.tickets.store"), {
        forceFormData: true,
        preserveScroll: true
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$w, mergeProps({
        title: unref(t3)("tickets.create_title"),
        subtitle: unref(t3)("tickets.create_subtitle"),
        active: "tickets",
        breadcrumbs: [
          { label: unref(t3)("menu.my_dashboard"), href: _ctx.route("portal.dashboard") },
          { label: unref(t3)("tickets.title"), href: _ctx.route("portal.tickets.index") },
          { label: unref(t3)("tickets.create_title") }
        ],
        "meta-title": metaTitle.value,
        "meta-description": metaDescription.value
      }, _attrs), {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="portal-panel portal-panel--allow-overflow"${_scopeId}><div class="portal-panel__body"${_scopeId}><form class="portal-ticket-form"${_scopeId}><div class="portal-form-group"${_scopeId}><label for="subject"${_scopeId}>${ssrInterpolate(unref(t3)("fields.subject"))} *</label><input id="subject"${ssrRenderAttr("value", unref(form).subject)} type="text" class="${ssrRenderClass([{ "portal-input--error": unref(form).errors.subject }, "portal-input"])}" required${_scopeId}>`);
            if (unref(form).errors.subject) {
              _push2(`<p class="portal-form-error"${_scopeId}>${ssrInterpolate(unref(form).errors.subject)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="portal-form-row"${_scopeId}><div class="portal-form-group"${_scopeId}><label for="ticket_category_id"${_scopeId}>${ssrInterpolate(unref(t3)("fields.category"))} *</label>`);
            _push2(ssrRenderComponent(PortalSelect, {
              id: "ticket_category_id",
              modelValue: unref(form).ticket_category_id,
              "onUpdate:modelValue": ($event) => unref(form).ticket_category_id = $event,
              options: categoryOptions.value,
              placeholder: unref(t3)("tickets.select_category"),
              "has-error": !!unref(form).errors.ticket_category_id
            }, null, _parent2, _scopeId));
            if (unref(form).errors.ticket_category_id) {
              _push2(`<p class="portal-form-error"${_scopeId}>${ssrInterpolate(unref(form).errors.ticket_category_id)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="portal-form-group"${_scopeId}><label for="priority"${_scopeId}>${ssrInterpolate(unref(t3)("fields.priority"))} *</label>`);
            _push2(ssrRenderComponent(PortalSelect, {
              id: "priority",
              modelValue: unref(form).priority,
              "onUpdate:modelValue": ($event) => unref(form).priority = $event,
              options: priorityOptions.value,
              placeholder: unref(t3)("tickets.select_priority"),
              "has-error": !!unref(form).errors.priority
            }, null, _parent2, _scopeId));
            if (unref(form).errors.priority) {
              _push2(`<p class="portal-form-error"${_scopeId}>${ssrInterpolate(unref(form).errors.priority)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><div class="portal-form-group"${_scopeId}><label for="description"${_scopeId}>${ssrInterpolate(unref(t3)("fields.description"))} *</label><textarea id="description" rows="6" class="${ssrRenderClass([{ "portal-input--error": unref(form).errors.description }, "portal-input"])}" required${_scopeId}>${ssrInterpolate(unref(form).description)}</textarea>`);
            if (unref(form).errors.description) {
              _push2(`<p class="portal-form-error"${_scopeId}>${ssrInterpolate(unref(form).errors.description)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="portal-form-group"${_scopeId}><label for="attachment"${_scopeId}>${ssrInterpolate(unref(t3)("projects.attachments"))}</label><input id="attachment" type="file" class="${ssrRenderClass([{ "portal-input--error": unref(form).errors.attachment }, "portal-input"])}"${_scopeId}><p class="portal-form-hint"${_scopeId}>${ssrInterpolate(unref(t3)("tickets.attachment_hint"))}</p>`);
            if (unref(form).errors.attachment) {
              _push2(`<p class="portal-form-error"${_scopeId}>${ssrInterpolate(unref(form).errors.attachment)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="portal-ticket-form__actions"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("portal.tickets.index"),
              class: "portal-panel__action"
            }, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(t3)("tickets.back_to_tickets"))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(t3)("tickets.back_to_tickets")), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<button type="submit" class="thm-btn"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""}${_scopeId}>${ssrInterpolate(unref(t3)("tickets.submit_ticket"))}</button></div></form></div></div>`);
          } else {
            return [
              createVNode("div", { class: "portal-panel portal-panel--allow-overflow" }, [
                createVNode("div", { class: "portal-panel__body" }, [
                  createVNode("form", {
                    class: "portal-ticket-form",
                    onSubmit: withModifiers(submit, ["prevent"])
                  }, [
                    createVNode("div", { class: "portal-form-group" }, [
                      createVNode("label", { for: "subject" }, toDisplayString(unref(t3)("fields.subject")) + " *", 1),
                      withDirectives(createVNode("input", {
                        id: "subject",
                        "onUpdate:modelValue": ($event) => unref(form).subject = $event,
                        type: "text",
                        class: ["portal-input", { "portal-input--error": unref(form).errors.subject }],
                        required: ""
                      }, null, 10, ["onUpdate:modelValue"]), [
                        [vModelText, unref(form).subject]
                      ]),
                      unref(form).errors.subject ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "portal-form-error"
                      }, toDisplayString(unref(form).errors.subject), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "portal-form-row" }, [
                      createVNode("div", { class: "portal-form-group" }, [
                        createVNode("label", { for: "ticket_category_id" }, toDisplayString(unref(t3)("fields.category")) + " *", 1),
                        createVNode(PortalSelect, {
                          id: "ticket_category_id",
                          modelValue: unref(form).ticket_category_id,
                          "onUpdate:modelValue": ($event) => unref(form).ticket_category_id = $event,
                          options: categoryOptions.value,
                          placeholder: unref(t3)("tickets.select_category"),
                          "has-error": !!unref(form).errors.ticket_category_id
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "placeholder", "has-error"]),
                        unref(form).errors.ticket_category_id ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "portal-form-error"
                        }, toDisplayString(unref(form).errors.ticket_category_id), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "portal-form-group" }, [
                        createVNode("label", { for: "priority" }, toDisplayString(unref(t3)("fields.priority")) + " *", 1),
                        createVNode(PortalSelect, {
                          id: "priority",
                          modelValue: unref(form).priority,
                          "onUpdate:modelValue": ($event) => unref(form).priority = $event,
                          options: priorityOptions.value,
                          placeholder: unref(t3)("tickets.select_priority"),
                          "has-error": !!unref(form).errors.priority
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "placeholder", "has-error"]),
                        unref(form).errors.priority ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "portal-form-error"
                        }, toDisplayString(unref(form).errors.priority), 1)) : createCommentVNode("", true)
                      ])
                    ]),
                    createVNode("div", { class: "portal-form-group" }, [
                      createVNode("label", { for: "description" }, toDisplayString(unref(t3)("fields.description")) + " *", 1),
                      withDirectives(createVNode("textarea", {
                        id: "description",
                        "onUpdate:modelValue": ($event) => unref(form).description = $event,
                        rows: "6",
                        class: ["portal-input", { "portal-input--error": unref(form).errors.description }],
                        required: ""
                      }, null, 10, ["onUpdate:modelValue"]), [
                        [vModelText, unref(form).description]
                      ]),
                      unref(form).errors.description ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "portal-form-error"
                      }, toDisplayString(unref(form).errors.description), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "portal-form-group" }, [
                      createVNode("label", { for: "attachment" }, toDisplayString(unref(t3)("projects.attachments")), 1),
                      createVNode("input", {
                        id: "attachment",
                        type: "file",
                        class: ["portal-input", { "portal-input--error": unref(form).errors.attachment }],
                        onChange: onFileChange
                      }, null, 34),
                      createVNode("p", { class: "portal-form-hint" }, toDisplayString(unref(t3)("tickets.attachment_hint")), 1),
                      unref(form).errors.attachment ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "portal-form-error"
                      }, toDisplayString(unref(form).errors.attachment), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "portal-ticket-form__actions" }, [
                      createVNode(unref(Link), {
                        href: _ctx.route("portal.tickets.index"),
                        class: "portal-panel__action"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(unref(t3)("tickets.back_to_tickets")), 1)
                        ]),
                        _: 1
                      }, 8, ["href"]),
                      createVNode("button", {
                        type: "submit",
                        class: "thm-btn",
                        disabled: unref(form).processing
                      }, toDisplayString(unref(t3)("tickets.submit_ticket")), 9, ["disabled"])
                    ])
                  ], 32)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$n = _sfc_main$n.setup;
_sfc_main$n.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("Modules/Support/resources/assets/js/Pages/Portal/Tickets/Create.vue");
  return _sfc_setup$n ? _sfc_setup$n(props, ctx) : void 0;
};
const __vite_glob_0_19 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$n
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$m = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    tickets: { type: Object, required: true },
    filters: { type: Object, default: () => ({}) },
    statuses: { type: Array, default: () => [] },
    priorities: { type: Array, default: () => [] },
    meta: { type: Object, default: () => ({}) }
  },
  setup(__props) {
    const props = __props;
    const page = usePage();
    const { t: t3, ticketStatusLabel, ticketPriorityLabel } = usePortalTranslations();
    const locale = computed(() => page.props.locale);
    const metaTitle = computed(() => {
      var _a;
      return ((_a = props.meta) == null ? void 0 : _a.title) || t3("pages.tickets_title");
    });
    const metaDescription = computed(() => {
      var _a;
      return ((_a = props.meta) == null ? void 0 : _a.description) || t3("pages.tickets_description");
    });
    const filterForm = reactive({
      status: props.filters.status || "",
      priority: props.filters.priority || "",
      sort: props.filters.sort || "newest"
    });
    const statusOptions = computed(() => props.statuses.map((status) => ({
      value: status,
      label: ticketStatusLabel(status)
    })));
    const priorityOptions = computed(() => props.priorities.map((priority) => ({
      value: priority,
      label: ticketPriorityLabel(priority)
    })));
    const sortOptions = computed(() => [
      { value: "newest", label: t3("tickets.sort_newest") },
      { value: "oldest", label: t3("tickets.sort_oldest") }
    ]);
    const applyFilters = () => {
      router.get(route("portal.tickets.index"), {
        status: filterForm.status || void 0,
        priority: filterForm.priority || void 0,
        sort: filterForm.sort || void 0
      }, {
        preserveState: true,
        replace: true
      });
    };
    const clearFilters = () => {
      filterForm.status = "";
      filterForm.priority = "";
      filterForm.sort = "newest";
      router.get(route("portal.tickets.index"));
    };
    const statusBadgeClass = (status) => {
      if (status === "closed" || status === "resolved") return "portal-badge--success";
      if (status === "in_progress") return "portal-badge--info";
      return "portal-badge--neutral";
    };
    const formatDate = (value) => {
      if (!value) return "—";
      return new Date(value).toLocaleString(locale.value);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$w, mergeProps({
        title: unref(t3)("tickets.title"),
        subtitle: unref(t3)("tickets.subtitle"),
        active: "tickets",
        breadcrumbs: [
          { label: unref(t3)("menu.my_dashboard"), href: _ctx.route("portal.dashboard") },
          { label: unref(t3)("tickets.title") }
        ],
        "meta-title": metaTitle.value,
        "meta-description": metaDescription.value
      }, _attrs), {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          var _a, _b;
          if (_push2) {
            _push2(`<div class="portal-panel portal-panel--allow-overflow mb-4"${_scopeId}><div class="portal-panel__body"${_scopeId}><div class="portal-ticket-toolbar"${_scopeId}><form class="portal-ticket-filters"${_scopeId}><div class="portal-ticket-filters__group"${_scopeId}><label${_scopeId}>${ssrInterpolate(unref(t3)("tickets.filter_status"))}</label>`);
            _push2(ssrRenderComponent(PortalSelect, {
              modelValue: filterForm.status,
              "onUpdate:modelValue": ($event) => filterForm.status = $event,
              options: statusOptions.value,
              placeholder: unref(t3)("tickets.all_statuses")
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="portal-ticket-filters__group"${_scopeId}><label${_scopeId}>${ssrInterpolate(unref(t3)("tickets.filter_priority"))}</label>`);
            _push2(ssrRenderComponent(PortalSelect, {
              modelValue: filterForm.priority,
              "onUpdate:modelValue": ($event) => filterForm.priority = $event,
              options: priorityOptions.value,
              placeholder: unref(t3)("tickets.all_priorities")
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="portal-ticket-filters__group"${_scopeId}><label${_scopeId}>${ssrInterpolate(unref(t3)("tickets.sort_newest"))}</label>`);
            _push2(ssrRenderComponent(PortalSelect, {
              modelValue: filterForm.sort,
              "onUpdate:modelValue": ($event) => filterForm.sort = $event,
              options: sortOptions.value
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="portal-ticket-filters__actions"${_scopeId}><button type="submit" class="thm-btn"${_scopeId}>${ssrInterpolate(unref(t3)("tickets.apply_filters"))}</button><button type="button" class="portal-panel__action"${_scopeId}>${ssrInterpolate(unref(t3)("tickets.clear_filters"))}</button></div></form>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("portal.tickets.create"),
              class: "thm-btn"
            }, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<i class="fas fa-plus me-1"${_scopeId2}></i>${ssrInterpolate(unref(t3)("tickets.new_ticket"))}`);
                } else {
                  return [
                    createVNode("i", { class: "fas fa-plus me-1" }),
                    createTextVNode(toDisplayString(unref(t3)("tickets.new_ticket")), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div></div>`);
            if (__props.tickets.data.length === 0) {
              _push2(`<div class="portal-panel"${_scopeId}><div class="portal-empty"${_scopeId}><i class="fas fa-life-ring portal-empty__icon"${_scopeId}></i> ${ssrInterpolate(unref(t3)("tickets.no_tickets"))}</div></div>`);
            } else {
              _push2(`<div class="portal-ticket-list"${_scopeId}><!--[-->`);
              ssrRenderList(__props.tickets.data, (ticket) => {
                _push2(`<article class="portal-ticket-card"${_scopeId}><div class="portal-ticket-card__top"${_scopeId}><div${_scopeId}><div class="portal-ticket-card__number"${_scopeId}>${ssrInterpolate(ticket.ticket_number)}</div><h3 class="portal-ticket-card__title"${_scopeId}>${ssrInterpolate(ticket.subject)}</h3></div><span class="${ssrRenderClass([statusBadgeClass(ticket.status), "portal-badge"])}"${_scopeId}>${ssrInterpolate(unref(ticketStatusLabel)(ticket.status))}</span></div><div class="portal-ticket-card__meta"${_scopeId}><div${_scopeId}><span${_scopeId}>${ssrInterpolate(unref(t3)("fields.category"))}</span><strong${_scopeId}>${ssrInterpolate(ticket.category || "—")}</strong></div><div${_scopeId}><span${_scopeId}>${ssrInterpolate(unref(t3)("fields.priority"))}</span><strong${_scopeId}>${ssrInterpolate(unref(ticketPriorityLabel)(ticket.priority))}</strong></div><div${_scopeId}><span${_scopeId}>${ssrInterpolate(unref(t3)("fields.status"))}</span><strong${_scopeId}>${ssrInterpolate(formatDate(ticket.created_at))}</strong></div></div><div class="portal-ticket-card__footer"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Link), {
                  href: _ctx.route("portal.tickets.show", ticket.id),
                  class: "thm-btn w-100 text-center"
                }, {
                  default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(unref(t3)("tickets.view_ticket"))} <span class="${ssrRenderClass(`icon-${locale.value === "ar" ? "left" : "right"}-arrow`)}"${_scopeId2}></span>`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(unref(t3)("tickets.view_ticket")) + " ", 1),
                        createVNode("span", {
                          class: `icon-${locale.value === "ar" ? "left" : "right"}-arrow`
                        }, null, 2)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`</div></article>`);
              });
              _push2(`<!--]--></div>`);
            }
            if (((_a = __props.tickets.links) == null ? void 0 : _a.length) > 3) {
              _push2(`<nav class="portal-pagination" aria-label="Pagination"${_scopeId}><!--[-->`);
              ssrRenderList(__props.tickets.links, (link) => {
                _push2(ssrRenderComponent(unref(Link), {
                  key: link.label,
                  href: link.url || "#",
                  class: ["portal-pagination__link", { "portal-pagination__link--active": link.active }]
                }, null, _parent2, _scopeId));
              });
              _push2(`<!--]--></nav>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("div", { class: "portal-panel portal-panel--allow-overflow mb-4" }, [
                createVNode("div", { class: "portal-panel__body" }, [
                  createVNode("div", { class: "portal-ticket-toolbar" }, [
                    createVNode("form", {
                      class: "portal-ticket-filters",
                      onSubmit: withModifiers(applyFilters, ["prevent"])
                    }, [
                      createVNode("div", { class: "portal-ticket-filters__group" }, [
                        createVNode("label", null, toDisplayString(unref(t3)("tickets.filter_status")), 1),
                        createVNode(PortalSelect, {
                          modelValue: filterForm.status,
                          "onUpdate:modelValue": ($event) => filterForm.status = $event,
                          options: statusOptions.value,
                          placeholder: unref(t3)("tickets.all_statuses")
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "placeholder"])
                      ]),
                      createVNode("div", { class: "portal-ticket-filters__group" }, [
                        createVNode("label", null, toDisplayString(unref(t3)("tickets.filter_priority")), 1),
                        createVNode(PortalSelect, {
                          modelValue: filterForm.priority,
                          "onUpdate:modelValue": ($event) => filterForm.priority = $event,
                          options: priorityOptions.value,
                          placeholder: unref(t3)("tickets.all_priorities")
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "placeholder"])
                      ]),
                      createVNode("div", { class: "portal-ticket-filters__group" }, [
                        createVNode("label", null, toDisplayString(unref(t3)("tickets.sort_newest")), 1),
                        createVNode(PortalSelect, {
                          modelValue: filterForm.sort,
                          "onUpdate:modelValue": ($event) => filterForm.sort = $event,
                          options: sortOptions.value
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "options"])
                      ]),
                      createVNode("div", { class: "portal-ticket-filters__actions" }, [
                        createVNode("button", {
                          type: "submit",
                          class: "thm-btn"
                        }, toDisplayString(unref(t3)("tickets.apply_filters")), 1),
                        createVNode("button", {
                          type: "button",
                          class: "portal-panel__action",
                          onClick: clearFilters
                        }, toDisplayString(unref(t3)("tickets.clear_filters")), 1)
                      ])
                    ], 32),
                    createVNode(unref(Link), {
                      href: _ctx.route("portal.tickets.create"),
                      class: "thm-btn"
                    }, {
                      default: withCtx(() => [
                        createVNode("i", { class: "fas fa-plus me-1" }),
                        createTextVNode(toDisplayString(unref(t3)("tickets.new_ticket")), 1)
                      ]),
                      _: 1
                    }, 8, ["href"])
                  ])
                ])
              ]),
              __props.tickets.data.length === 0 ? (openBlock(), createBlock("div", {
                key: 0,
                class: "portal-panel"
              }, [
                createVNode("div", { class: "portal-empty" }, [
                  createVNode("i", { class: "fas fa-life-ring portal-empty__icon" }),
                  createTextVNode(" " + toDisplayString(unref(t3)("tickets.no_tickets")), 1)
                ])
              ])) : (openBlock(), createBlock("div", {
                key: 1,
                class: "portal-ticket-list"
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(__props.tickets.data, (ticket) => {
                  return openBlock(), createBlock("article", {
                    key: ticket.id,
                    class: "portal-ticket-card"
                  }, [
                    createVNode("div", { class: "portal-ticket-card__top" }, [
                      createVNode("div", null, [
                        createVNode("div", { class: "portal-ticket-card__number" }, toDisplayString(ticket.ticket_number), 1),
                        createVNode("h3", { class: "portal-ticket-card__title" }, toDisplayString(ticket.subject), 1)
                      ]),
                      createVNode("span", {
                        class: ["portal-badge", statusBadgeClass(ticket.status)]
                      }, toDisplayString(unref(ticketStatusLabel)(ticket.status)), 3)
                    ]),
                    createVNode("div", { class: "portal-ticket-card__meta" }, [
                      createVNode("div", null, [
                        createVNode("span", null, toDisplayString(unref(t3)("fields.category")), 1),
                        createVNode("strong", null, toDisplayString(ticket.category || "—"), 1)
                      ]),
                      createVNode("div", null, [
                        createVNode("span", null, toDisplayString(unref(t3)("fields.priority")), 1),
                        createVNode("strong", null, toDisplayString(unref(ticketPriorityLabel)(ticket.priority)), 1)
                      ]),
                      createVNode("div", null, [
                        createVNode("span", null, toDisplayString(unref(t3)("fields.status")), 1),
                        createVNode("strong", null, toDisplayString(formatDate(ticket.created_at)), 1)
                      ])
                    ]),
                    createVNode("div", { class: "portal-ticket-card__footer" }, [
                      createVNode(unref(Link), {
                        href: _ctx.route("portal.tickets.show", ticket.id),
                        class: "thm-btn w-100 text-center"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(unref(t3)("tickets.view_ticket")) + " ", 1),
                          createVNode("span", {
                            class: `icon-${locale.value === "ar" ? "left" : "right"}-arrow`
                          }, null, 2)
                        ]),
                        _: 1
                      }, 8, ["href"])
                    ])
                  ]);
                }), 128))
              ])),
              ((_b = __props.tickets.links) == null ? void 0 : _b.length) > 3 ? (openBlock(), createBlock("nav", {
                key: 2,
                class: "portal-pagination",
                "aria-label": "Pagination"
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(__props.tickets.links, (link) => {
                  return openBlock(), createBlock(unref(Link), {
                    key: link.label,
                    href: link.url || "#",
                    class: ["portal-pagination__link", { "portal-pagination__link--active": link.active }],
                    innerHTML: link.label
                  }, null, 8, ["href", "class", "innerHTML"]);
                }), 128))
              ])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$m = _sfc_main$m.setup;
_sfc_main$m.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("Modules/Support/resources/assets/js/Pages/Portal/Tickets/Index.vue");
  return _sfc_setup$m ? _sfc_setup$m(props, ctx) : void 0;
};
const __vite_glob_0_20 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$m
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$l = {
  __name: "Show",
  __ssrInlineRender: true,
  props: {
    ticket: { type: Object, required: true },
    meta: { type: Object, default: () => ({}) }
  },
  setup(__props) {
    const props = __props;
    const page = usePage();
    const { t: t3, ticketStatusLabel, ticketPriorityLabel } = usePortalTranslations();
    const locale = computed(() => page.props.locale);
    const metaTitle = computed(() => {
      var _a;
      return ((_a = props.meta) == null ? void 0 : _a.title) || props.ticket.subject;
    });
    const metaDescription = computed(() => {
      var _a;
      return ((_a = props.meta) == null ? void 0 : _a.description) || t3("pages.ticket_show_description");
    });
    const replyForm = useForm({
      body: "",
      attachment: null
    });
    const onReplyFileChange = (event) => {
      replyForm.attachment = event.target.files[0] || null;
    };
    const submitReply = () => {
      replyForm.post(route("portal.tickets.reply", props.ticket.id), {
        forceFormData: true,
        preserveScroll: true,
        onSuccess: () => replyForm.reset()
      });
    };
    const closeTicket = () => {
      if (!window.confirm(t3("tickets.close_confirm"))) {
        return;
      }
      router.post(route("portal.tickets.close", props.ticket.id), {}, {
        preserveScroll: true
      });
    };
    const statusBadgeClass = (status) => {
      if (status === "closed" || status === "resolved") return "portal-badge--success";
      if (status === "in_progress") return "portal-badge--info";
      return "portal-badge--neutral";
    };
    const formatDate = (value) => {
      if (!value) return "—";
      return new Date(value).toLocaleString(locale.value);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$w, mergeProps({
        title: __props.ticket.subject,
        subtitle: __props.ticket.ticket_number,
        active: "tickets",
        breadcrumbs: [
          { label: unref(t3)("menu.my_dashboard"), href: _ctx.route("portal.dashboard") },
          { label: unref(t3)("tickets.title"), href: _ctx.route("portal.tickets.index") },
          { label: __props.ticket.ticket_number }
        ],
        "meta-title": metaTitle.value,
        "meta-description": metaDescription.value
      }, _attrs), {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("portal.tickets.index"),
              class: "portal-back"
            }, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<i class="${ssrRenderClass(`fas fa-arrow-${locale.value === "ar" ? "right" : "left"}`)}"${_scopeId2}></i> ${ssrInterpolate(unref(t3)("tickets.back_to_tickets"))}`);
                } else {
                  return [
                    createVNode("i", {
                      class: `fas fa-arrow-${locale.value === "ar" ? "right" : "left"}`
                    }, null, 2),
                    createTextVNode(" " + toDisplayString(unref(t3)("tickets.back_to_tickets")), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="portal-grid portal-grid--show"${_scopeId}><div${_scopeId}><div class="portal-panel"${_scopeId}><div class="portal-panel__header"${_scopeId}><h2 class="portal-panel__title"${_scopeId}>${ssrInterpolate(unref(t3)("projects.details"))}</h2></div><div class="portal-panel__body"${_scopeId}><div class="portal-details"${_scopeId}><div class="portal-details__row"${_scopeId}><div class="portal-details__label"${_scopeId}>${ssrInterpolate(unref(t3)("fields.ticket_number"))}</div><div class="portal-details__value"${_scopeId}>${ssrInterpolate(__props.ticket.ticket_number)}</div></div><div class="portal-details__row"${_scopeId}><div class="portal-details__label"${_scopeId}>${ssrInterpolate(unref(t3)("fields.status"))}</div><div class="portal-details__value"${_scopeId}><span class="${ssrRenderClass([statusBadgeClass(__props.ticket.status), "portal-badge"])}"${_scopeId}>${ssrInterpolate(unref(ticketStatusLabel)(__props.ticket.status))}</span></div></div><div class="portal-details__row"${_scopeId}><div class="portal-details__label"${_scopeId}>${ssrInterpolate(unref(t3)("fields.priority"))}</div><div class="portal-details__value"${_scopeId}>${ssrInterpolate(unref(ticketPriorityLabel)(__props.ticket.priority))}</div></div><div class="portal-details__row"${_scopeId}><div class="portal-details__label"${_scopeId}>${ssrInterpolate(unref(t3)("fields.category"))}</div><div class="portal-details__value"${_scopeId}>${ssrInterpolate(__props.ticket.category || "—")}</div></div><div class="portal-details__row"${_scopeId}><div class="portal-details__label"${_scopeId}>${ssrInterpolate(unref(t3)("fields.created_at"))}</div><div class="portal-details__value"${_scopeId}>${ssrInterpolate(formatDate(__props.ticket.created_at))}</div></div></div></div></div>`);
            if (__props.ticket.can_reply) {
              _push2(`<div class="portal-panel" style="${ssrRenderStyle({ "margin-top": "24px" })}"${_scopeId}><div class="portal-panel__body"${_scopeId}><button type="button" class="portal-panel__action text-danger"${_scopeId}><i class="fas fa-times-circle me-1"${_scopeId}></i>${ssrInterpolate(unref(t3)("tickets.close_ticket"))}</button></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="portal-grid__stack"${_scopeId}><div class="portal-panel"${_scopeId}><div class="portal-panel__header"${_scopeId}><h2 class="portal-panel__title"${_scopeId}>${ssrInterpolate(unref(t3)("tickets.conversation"))}</h2></div><div class="portal-panel__body"${_scopeId}><div class="portal-ticket-thread"${_scopeId}><div class="portal-ticket-message portal-ticket-message--customer"${_scopeId}><div class="portal-ticket-message__header"${_scopeId}><strong${_scopeId}>${ssrInterpolate(unref(t3)("tickets.original_message"))}</strong><span${_scopeId}>${ssrInterpolate(formatDate(__props.ticket.created_at))}</span></div><div class="portal-ticket-message__body"${_scopeId}>${ssrInterpolate(__props.ticket.description)}</div>`);
            if (__props.ticket.attachment) {
              _push2(`<a${ssrRenderAttr("href", __props.ticket.attachment.url)} target="_blank" class="portal-ticket-message__attachment"${_scopeId}><i class="fas fa-paperclip"${_scopeId}></i>${ssrInterpolate(__props.ticket.attachment.name)}</a>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><!--[-->`);
            ssrRenderList(__props.ticket.messages, (message) => {
              _push2(`<div class="${ssrRenderClass([message.is_staff ? "portal-ticket-message--staff" : "portal-ticket-message--customer", "portal-ticket-message"])}"${_scopeId}><div class="portal-ticket-message__header"${_scopeId}><strong${_scopeId}>${ssrInterpolate(message.author)}</strong><span${_scopeId}>${ssrInterpolate(formatDate(message.created_at))}</span></div><div class="portal-ticket-message__body"${_scopeId}>${ssrInterpolate(message.body)}</div>`);
              if (message.attachment) {
                _push2(`<a${ssrRenderAttr("href", message.attachment.url)} target="_blank" class="portal-ticket-message__attachment"${_scopeId}><i class="fas fa-paperclip"${_scopeId}></i>${ssrInterpolate(message.attachment.name)}</a>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            });
            _push2(`<!--]--></div>`);
            if (__props.ticket.can_reply) {
              _push2(`<div class="portal-ticket-reply"${_scopeId}><form${_scopeId}><div class="portal-form-group"${_scopeId}><label for="reply"${_scopeId}>${ssrInterpolate(unref(t3)("tickets.send_reply"))}</label><textarea id="reply" rows="4"${ssrRenderAttr("placeholder", unref(t3)("tickets.reply_placeholder"))} class="${ssrRenderClass([{ "portal-input--error": unref(replyForm).errors.body }, "portal-input"])}" required${_scopeId}>${ssrInterpolate(unref(replyForm).body)}</textarea>`);
              if (unref(replyForm).errors.body) {
                _push2(`<p class="portal-form-error"${_scopeId}>${ssrInterpolate(unref(replyForm).errors.body)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div class="portal-form-group"${_scopeId}><input type="file" class="${ssrRenderClass([{ "portal-input--error": unref(replyForm).errors.attachment }, "portal-input"])}"${_scopeId}>`);
              if (unref(replyForm).errors.attachment) {
                _push2(`<p class="portal-form-error"${_scopeId}>${ssrInterpolate(unref(replyForm).errors.attachment)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><button type="submit" class="thm-btn"${ssrIncludeBooleanAttr(unref(replyForm).processing) ? " disabled" : ""}${_scopeId}>${ssrInterpolate(unref(t3)("tickets.send_reply"))}</button></form></div>`);
            } else {
              _push2(`<div class="portal-empty portal-empty--compact"${_scopeId}>${ssrInterpolate(unref(t3)("tickets.ticket_closed"))}</div>`);
            }
            _push2(`</div></div></div></div>`);
          } else {
            return [
              createVNode(unref(Link), {
                href: _ctx.route("portal.tickets.index"),
                class: "portal-back"
              }, {
                default: withCtx(() => [
                  createVNode("i", {
                    class: `fas fa-arrow-${locale.value === "ar" ? "right" : "left"}`
                  }, null, 2),
                  createTextVNode(" " + toDisplayString(unref(t3)("tickets.back_to_tickets")), 1)
                ]),
                _: 1
              }, 8, ["href"]),
              createVNode("div", { class: "portal-grid portal-grid--show" }, [
                createVNode("div", null, [
                  createVNode("div", { class: "portal-panel" }, [
                    createVNode("div", { class: "portal-panel__header" }, [
                      createVNode("h2", { class: "portal-panel__title" }, toDisplayString(unref(t3)("projects.details")), 1)
                    ]),
                    createVNode("div", { class: "portal-panel__body" }, [
                      createVNode("div", { class: "portal-details" }, [
                        createVNode("div", { class: "portal-details__row" }, [
                          createVNode("div", { class: "portal-details__label" }, toDisplayString(unref(t3)("fields.ticket_number")), 1),
                          createVNode("div", { class: "portal-details__value" }, toDisplayString(__props.ticket.ticket_number), 1)
                        ]),
                        createVNode("div", { class: "portal-details__row" }, [
                          createVNode("div", { class: "portal-details__label" }, toDisplayString(unref(t3)("fields.status")), 1),
                          createVNode("div", { class: "portal-details__value" }, [
                            createVNode("span", {
                              class: ["portal-badge", statusBadgeClass(__props.ticket.status)]
                            }, toDisplayString(unref(ticketStatusLabel)(__props.ticket.status)), 3)
                          ])
                        ]),
                        createVNode("div", { class: "portal-details__row" }, [
                          createVNode("div", { class: "portal-details__label" }, toDisplayString(unref(t3)("fields.priority")), 1),
                          createVNode("div", { class: "portal-details__value" }, toDisplayString(unref(ticketPriorityLabel)(__props.ticket.priority)), 1)
                        ]),
                        createVNode("div", { class: "portal-details__row" }, [
                          createVNode("div", { class: "portal-details__label" }, toDisplayString(unref(t3)("fields.category")), 1),
                          createVNode("div", { class: "portal-details__value" }, toDisplayString(__props.ticket.category || "—"), 1)
                        ]),
                        createVNode("div", { class: "portal-details__row" }, [
                          createVNode("div", { class: "portal-details__label" }, toDisplayString(unref(t3)("fields.created_at")), 1),
                          createVNode("div", { class: "portal-details__value" }, toDisplayString(formatDate(__props.ticket.created_at)), 1)
                        ])
                      ])
                    ])
                  ]),
                  __props.ticket.can_reply ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "portal-panel",
                    style: { "margin-top": "24px" }
                  }, [
                    createVNode("div", { class: "portal-panel__body" }, [
                      createVNode("button", {
                        type: "button",
                        class: "portal-panel__action text-danger",
                        onClick: closeTicket
                      }, [
                        createVNode("i", { class: "fas fa-times-circle me-1" }),
                        createTextVNode(toDisplayString(unref(t3)("tickets.close_ticket")), 1)
                      ])
                    ])
                  ])) : createCommentVNode("", true)
                ]),
                createVNode("div", { class: "portal-grid__stack" }, [
                  createVNode("div", { class: "portal-panel" }, [
                    createVNode("div", { class: "portal-panel__header" }, [
                      createVNode("h2", { class: "portal-panel__title" }, toDisplayString(unref(t3)("tickets.conversation")), 1)
                    ]),
                    createVNode("div", { class: "portal-panel__body" }, [
                      createVNode("div", { class: "portal-ticket-thread" }, [
                        createVNode("div", { class: "portal-ticket-message portal-ticket-message--customer" }, [
                          createVNode("div", { class: "portal-ticket-message__header" }, [
                            createVNode("strong", null, toDisplayString(unref(t3)("tickets.original_message")), 1),
                            createVNode("span", null, toDisplayString(formatDate(__props.ticket.created_at)), 1)
                          ]),
                          createVNode("div", { class: "portal-ticket-message__body" }, toDisplayString(__props.ticket.description), 1),
                          __props.ticket.attachment ? (openBlock(), createBlock("a", {
                            key: 0,
                            href: __props.ticket.attachment.url,
                            target: "_blank",
                            class: "portal-ticket-message__attachment"
                          }, [
                            createVNode("i", { class: "fas fa-paperclip" }),
                            createTextVNode(toDisplayString(__props.ticket.attachment.name), 1)
                          ], 8, ["href"])) : createCommentVNode("", true)
                        ]),
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.ticket.messages, (message) => {
                          return openBlock(), createBlock("div", {
                            key: message.id,
                            class: ["portal-ticket-message", message.is_staff ? "portal-ticket-message--staff" : "portal-ticket-message--customer"]
                          }, [
                            createVNode("div", { class: "portal-ticket-message__header" }, [
                              createVNode("strong", null, toDisplayString(message.author), 1),
                              createVNode("span", null, toDisplayString(formatDate(message.created_at)), 1)
                            ]),
                            createVNode("div", { class: "portal-ticket-message__body" }, toDisplayString(message.body), 1),
                            message.attachment ? (openBlock(), createBlock("a", {
                              key: 0,
                              href: message.attachment.url,
                              target: "_blank",
                              class: "portal-ticket-message__attachment"
                            }, [
                              createVNode("i", { class: "fas fa-paperclip" }),
                              createTextVNode(toDisplayString(message.attachment.name), 1)
                            ], 8, ["href"])) : createCommentVNode("", true)
                          ], 2);
                        }), 128))
                      ]),
                      __props.ticket.can_reply ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "portal-ticket-reply"
                      }, [
                        createVNode("form", {
                          onSubmit: withModifiers(submitReply, ["prevent"])
                        }, [
                          createVNode("div", { class: "portal-form-group" }, [
                            createVNode("label", { for: "reply" }, toDisplayString(unref(t3)("tickets.send_reply")), 1),
                            withDirectives(createVNode("textarea", {
                              id: "reply",
                              "onUpdate:modelValue": ($event) => unref(replyForm).body = $event,
                              rows: "4",
                              class: ["portal-input", { "portal-input--error": unref(replyForm).errors.body }],
                              placeholder: unref(t3)("tickets.reply_placeholder"),
                              required: ""
                            }, null, 10, ["onUpdate:modelValue", "placeholder"]), [
                              [vModelText, unref(replyForm).body]
                            ]),
                            unref(replyForm).errors.body ? (openBlock(), createBlock("p", {
                              key: 0,
                              class: "portal-form-error"
                            }, toDisplayString(unref(replyForm).errors.body), 1)) : createCommentVNode("", true)
                          ]),
                          createVNode("div", { class: "portal-form-group" }, [
                            createVNode("input", {
                              type: "file",
                              class: ["portal-input", { "portal-input--error": unref(replyForm).errors.attachment }],
                              onChange: onReplyFileChange
                            }, null, 34),
                            unref(replyForm).errors.attachment ? (openBlock(), createBlock("p", {
                              key: 0,
                              class: "portal-form-error"
                            }, toDisplayString(unref(replyForm).errors.attachment), 1)) : createCommentVNode("", true)
                          ]),
                          createVNode("button", {
                            type: "submit",
                            class: "thm-btn",
                            disabled: unref(replyForm).processing
                          }, toDisplayString(unref(t3)("tickets.send_reply")), 9, ["disabled"])
                        ], 32)
                      ])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "portal-empty portal-empty--compact"
                      }, toDisplayString(unref(t3)("tickets.ticket_closed")), 1))
                    ])
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$l = _sfc_main$l.setup;
_sfc_main$l.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("Modules/Support/resources/assets/js/Pages/Portal/Tickets/Show.vue");
  return _sfc_setup$l ? _sfc_setup$l(props, ctx) : void 0;
};
const __vite_glob_0_21 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$l
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$k = {
  __name: "AuthShell",
  __ssrInlineRender: true,
  props: {
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    successMessage: { type: String, default: "" },
    errorMessage: { type: String, default: "" }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$R, _attrs, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$N, { title: __props.title }, null, _parent2, _scopeId));
            _push2(`<section class="auth-page"${_scopeId}><div class="container"${_scopeId}><div class="auth-page__panel wow fadeInUp"${_scopeId}><div class="auth-page__header"${_scopeId}><h1 class="auth-page__title font-3"${_scopeId}>${ssrInterpolate(__props.title)}</h1>`);
            if (__props.subtitle) {
              _push2(`<p class="auth-page__subtitle text-main-2"${_scopeId}>${ssrInterpolate(__props.subtitle)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if (__props.successMessage) {
              _push2(`<div class="auth-flash auth-flash--success" role="alert"${_scopeId}>${ssrInterpolate(__props.successMessage)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.errorMessage) {
              _push2(`<div class="auth-flash auth-flash--error" role="alert"${_scopeId}>${ssrInterpolate(__props.errorMessage)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="auth-page__body"${_scopeId}>`);
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
            _push2(`</div>`);
            if (_ctx.$slots.footer) {
              _push2(`<div class="auth-page__footer"${_scopeId}>`);
              ssrRenderSlot(_ctx.$slots, "footer", {}, null, _push2, _parent2, _scopeId);
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div></section>`);
          } else {
            return [
              createVNode(_sfc_main$N, { title: __props.title }, null, 8, ["title"]),
              createVNode("section", { class: "auth-page" }, [
                createVNode("div", { class: "container" }, [
                  createVNode("div", { class: "auth-page__panel wow fadeInUp" }, [
                    createVNode("div", { class: "auth-page__header" }, [
                      createVNode("h1", { class: "auth-page__title font-3" }, toDisplayString(__props.title), 1),
                      __props.subtitle ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "auth-page__subtitle text-main-2"
                      }, toDisplayString(__props.subtitle), 1)) : createCommentVNode("", true)
                    ]),
                    __props.successMessage ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "auth-flash auth-flash--success",
                      role: "alert"
                    }, toDisplayString(__props.successMessage), 1)) : createCommentVNode("", true),
                    __props.errorMessage ? (openBlock(), createBlock("div", {
                      key: 1,
                      class: "auth-flash auth-flash--error",
                      role: "alert"
                    }, toDisplayString(__props.errorMessage), 1)) : createCommentVNode("", true),
                    createVNode("div", { class: "auth-page__body" }, [
                      renderSlot(_ctx.$slots, "default")
                    ]),
                    _ctx.$slots.footer ? (openBlock(), createBlock("div", {
                      key: 2,
                      class: "auth-page__footer"
                    }, [
                      renderSlot(_ctx.$slots, "footer")
                    ])) : createCommentVNode("", true)
                  ])
                ])
              ])
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup$k = _sfc_main$k.setup;
_sfc_main$k.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/AuthShell.vue");
  return _sfc_setup$k ? _sfc_setup$k(props, ctx) : void 0;
};
const _sfc_main$j = {
  components: {
    AuthShell: _sfc_main$k,
    Link,
    Head
  },
  props: {
    errors: Object
  },
  setup() {
    const page = usePage();
    const seo = computed(() => page.props.seo);
    const settings = computed(() => page.props.settings || {});
    const flash = computed(() => page.props.flash || {});
    const meta = computed(() => page.props.meta || {});
    const trans = (key) => {
      var _a;
      return ((_a = page.props.translations) == null ? void 0 : _a[key]) || key;
    };
    const formatError = (error) => {
      if (!error) {
        return "";
      }
      if (Array.isArray(error)) {
        return error.map(formatError).filter(Boolean).join(" ");
      }
      const authErrors = {
        "passwords.reset": trans("Your password has been reset."),
        "passwords.sent": trans("We have emailed your password reset link."),
        "passwords.throttled": trans("Please wait before retrying."),
        "passwords.token": trans("This password reset token is invalid."),
        "passwords.user": trans("We can't find a user with that email address.")
      };
      return authErrors[error] || trans(error) || error;
    };
    const form = useForm({
      email: ""
    });
    const fieldErrors = computed(() => ({
      ...page.props.errors || {},
      ...form.errors || {}
    }));
    const submit = () => {
      form.post(route("password.email"));
    };
    const metaTitle = computed(() => `${trans("Forgot Password")} | ${seo.value.website_name || ""}`.trim());
    const metaDescription = computed(() => meta.value.description || trans("Request a password reset link to regain access to your account."));
    const metaKeywords = computed(() => meta.value.keywords || trans("forgot password, reset password, account recovery"));
    const metaImage = computed(() => {
      var _a, _b, _c, _d, _e;
      return ((_b = (_a = meta.value) == null ? void 0 : _a.og) == null ? void 0 : _b.image) || ((_d = (_c = meta.value) == null ? void 0 : _c.twitter) == null ? void 0 : _d.image) || ((_e = settings.value) == null ? void 0 : _e.meta_img) || "";
    });
    const metaCanonical = computed(() => meta.value.canonical || "");
    const metaRobots = computed(() => meta.value.robots || "noindex, nofollow");
    return {
      form,
      trans,
      formatError,
      fieldErrors,
      submit,
      flash,
      metaTitle,
      metaDescription,
      metaKeywords,
      metaImage,
      metaCanonical,
      metaRobots
    };
  }
};
function _sfc_ssrRender$4(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Head = resolveComponent("Head");
  const _component_AuthShell = resolveComponent("AuthShell");
  const _component_Link = resolveComponent("Link");
  _push(`<!--[-->`);
  _push(ssrRenderComponent(_component_Head, null, {
    default: withCtx((_2, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<title${_scopeId}>${ssrInterpolate($setup.metaTitle)}</title><meta name="description"${ssrRenderAttr("content", $setup.metaDescription)}${_scopeId}><meta name="keywords"${ssrRenderAttr("content", $setup.metaKeywords)}${_scopeId}><meta name="robots"${ssrRenderAttr("content", $setup.metaRobots)}${_scopeId}>`);
        if ($setup.metaCanonical) {
          _push2(`<link rel="canonical"${ssrRenderAttr("href", $setup.metaCanonical)}${_scopeId}>`);
        } else {
          _push2(`<!---->`);
        }
        _push2(`<meta property="og:title"${ssrRenderAttr("content", $setup.metaTitle)}${_scopeId}><meta property="og:description"${ssrRenderAttr("content", $setup.metaDescription)}${_scopeId}>`);
        if ($setup.metaImage) {
          _push2(`<meta property="og:image"${ssrRenderAttr("content", $setup.metaImage)}${_scopeId}>`);
        } else {
          _push2(`<!---->`);
        }
        if ($setup.metaCanonical) {
          _push2(`<meta property="og:url"${ssrRenderAttr("content", $setup.metaCanonical)}${_scopeId}>`);
        } else {
          _push2(`<!---->`);
        }
        _push2(`<meta property="og:type" content="website"${_scopeId}><meta name="twitter:card" content="summary_large_image"${_scopeId}><meta name="twitter:title"${ssrRenderAttr("content", $setup.metaTitle)}${_scopeId}><meta name="twitter:description"${ssrRenderAttr("content", $setup.metaDescription)}${_scopeId}>`);
        if ($setup.metaImage) {
          _push2(`<meta name="twitter:image"${ssrRenderAttr("content", $setup.metaImage)}${_scopeId}>`);
        } else {
          _push2(`<!---->`);
        }
      } else {
        return [
          createVNode("title", null, toDisplayString($setup.metaTitle), 1),
          createVNode("meta", {
            name: "description",
            content: $setup.metaDescription
          }, null, 8, ["content"]),
          createVNode("meta", {
            name: "keywords",
            content: $setup.metaKeywords
          }, null, 8, ["content"]),
          createVNode("meta", {
            name: "robots",
            content: $setup.metaRobots
          }, null, 8, ["content"]),
          $setup.metaCanonical ? (openBlock(), createBlock("link", {
            key: 0,
            rel: "canonical",
            href: $setup.metaCanonical
          }, null, 8, ["href"])) : createCommentVNode("", true),
          createVNode("meta", {
            property: "og:title",
            content: $setup.metaTitle
          }, null, 8, ["content"]),
          createVNode("meta", {
            property: "og:description",
            content: $setup.metaDescription
          }, null, 8, ["content"]),
          $setup.metaImage ? (openBlock(), createBlock("meta", {
            key: 1,
            property: "og:image",
            content: $setup.metaImage
          }, null, 8, ["content"])) : createCommentVNode("", true),
          $setup.metaCanonical ? (openBlock(), createBlock("meta", {
            key: 2,
            property: "og:url",
            content: $setup.metaCanonical
          }, null, 8, ["content"])) : createCommentVNode("", true),
          createVNode("meta", {
            property: "og:type",
            content: "website"
          }),
          createVNode("meta", {
            name: "twitter:card",
            content: "summary_large_image"
          }),
          createVNode("meta", {
            name: "twitter:title",
            content: $setup.metaTitle
          }, null, 8, ["content"]),
          createVNode("meta", {
            name: "twitter:description",
            content: $setup.metaDescription
          }, null, 8, ["content"]),
          $setup.metaImage ? (openBlock(), createBlock("meta", {
            key: 3,
            name: "twitter:image",
            content: $setup.metaImage
          }, null, 8, ["content"])) : createCommentVNode("", true)
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_AuthShell, {
    title: $setup.trans("Reset Your Password"),
    subtitle: $setup.trans("Enter your email and we will send you a reset link."),
    "success-message": $setup.flash.success ? $setup.formatError($setup.flash.success) : "",
    "error-message": $setup.flash.error ? $setup.formatError($setup.flash.error) : ""
  }, {
    footer: withCtx((_2, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<p${_scopeId}>`);
        _push2(ssrRenderComponent(_component_Link, {
          href: _ctx.route("login")
        }, {
          default: withCtx((_3, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`${ssrInterpolate($setup.trans("Back to Login"))}`);
            } else {
              return [
                createTextVNode(toDisplayString($setup.trans("Back to Login")), 1)
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(`</p>`);
      } else {
        return [
          createVNode("p", null, [
            createVNode(_component_Link, {
              href: _ctx.route("login")
            }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString($setup.trans("Back to Login")), 1)
              ]),
              _: 1
            }, 8, ["href"])
          ])
        ];
      }
    }),
    default: withCtx((_2, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<form id="forgot-password-form"${_scopeId}><div class="form-group"${_scopeId}><div class="input-box"${_scopeId}><input id="email"${ssrRenderAttr("value", $setup.form.email)} type="email" name="email" class="${ssrRenderClass([{ error: $setup.fieldErrors.email }, "style-large"])}" autocomplete="email"${ssrRenderAttr("placeholder", $setup.trans("Email"))}${ssrIncludeBooleanAttr($setup.form.processing) ? " disabled" : ""} required${_scopeId}></div>`);
        if ($setup.fieldErrors.email) {
          _push2(`<div class="field-error"${_scopeId}>${ssrInterpolate($setup.formatError($setup.fieldErrors.email))}</div>`);
        } else {
          _push2(`<!---->`);
        }
        _push2(`</div><div class="auth-page__actions"${_scopeId}><button class="thm-btn" type="submit"${ssrIncludeBooleanAttr($setup.form.processing) ? " disabled" : ""}${_scopeId}><span${_scopeId}>${ssrInterpolate($setup.form.processing ? $setup.trans("Sending...") : $setup.trans("Send Email Verification"))}</span></button></div></form>`);
      } else {
        return [
          createVNode("form", {
            id: "forgot-password-form",
            onSubmit: withModifiers($setup.submit, ["prevent"])
          }, [
            createVNode("div", { class: "form-group" }, [
              createVNode("div", { class: "input-box" }, [
                withDirectives(createVNode("input", {
                  id: "email",
                  "onUpdate:modelValue": ($event) => $setup.form.email = $event,
                  type: "email",
                  name: "email",
                  class: ["style-large", { error: $setup.fieldErrors.email }],
                  autocomplete: "email",
                  placeholder: $setup.trans("Email"),
                  disabled: $setup.form.processing,
                  required: ""
                }, null, 10, ["onUpdate:modelValue", "placeholder", "disabled"]), [
                  [vModelText, $setup.form.email]
                ])
              ]),
              $setup.fieldErrors.email ? (openBlock(), createBlock("div", {
                key: 0,
                class: "field-error"
              }, toDisplayString($setup.formatError($setup.fieldErrors.email)), 1)) : createCommentVNode("", true)
            ]),
            createVNode("div", { class: "auth-page__actions" }, [
              createVNode("button", {
                class: "thm-btn",
                type: "submit",
                disabled: $setup.form.processing
              }, [
                createVNode("span", null, toDisplayString($setup.form.processing ? $setup.trans("Sending...") : $setup.trans("Send Email Verification")), 1)
              ], 8, ["disabled"])
            ])
          ], 40, ["onSubmit"])
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<!--]-->`);
}
const _sfc_setup$j = _sfc_main$j.setup;
_sfc_main$j.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("Modules/User/resources/assets/js/Pages/Auth/ForgotPassword.vue");
  return _sfc_setup$j ? _sfc_setup$j(props, ctx) : void 0;
};
const ForgotPassword = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["ssrRender", _sfc_ssrRender$4]]);
const __vite_glob_0_22 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ForgotPassword
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$i = {
  __name: "PasswordInput",
  __ssrInlineRender: true,
  props: {
    modelValue: { type: String, default: "" },
    id: { type: String, default: "" },
    name: { type: String, default: "" },
    placeholder: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    autocomplete: { type: String, default: "" },
    inputClass: { type: [String, Object, Array], default: "" },
    showLabel: { type: String, default: "Show password" },
    hideLabel: { type: String, default: "Hide password" }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const page = usePage();
    const showPassword = ref(false);
    const trans = (key) => {
      var _a;
      return ((_a = page.props.translations) == null ? void 0 : _a[key]) || key;
    };
    const showText = computed(() => trans("Show"));
    const hideText = computed(() => trans("Hide"));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "input-box password-input-box" }, _attrs))}><input${ssrRenderAttr("id", __props.id)}${ssrRenderAttr("value", __props.modelValue)}${ssrRenderAttr("type", showPassword.value ? "text" : "password")}${ssrRenderAttr("name", __props.name)} class="${ssrRenderClass([__props.inputClass, "style-large"])}"${ssrRenderAttr("placeholder", __props.placeholder)}${ssrIncludeBooleanAttr(__props.disabled) ? " disabled" : ""}${ssrIncludeBooleanAttr(__props.required) ? " required" : ""}${ssrRenderAttr("autocomplete", __props.autocomplete)}><button type="button" class="password-input-box__toggle"${ssrRenderAttr("aria-label", showPassword.value ? __props.hideLabel : __props.showLabel)}${ssrRenderAttr("aria-pressed", showPassword.value)}${ssrIncludeBooleanAttr(__props.disabled) ? " disabled" : ""}>${ssrInterpolate(showPassword.value ? hideText.value : showText.value)}</button></div>`);
    };
  }
};
const _sfc_setup$i = _sfc_main$i.setup;
_sfc_main$i.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/PasswordInput.vue");
  return _sfc_setup$i ? _sfc_setup$i(props, ctx) : void 0;
};
const _sfc_main$h = {
  components: {
    AuthShell: _sfc_main$k,
    Link,
    Head,
    PasswordInput: _sfc_main$i
  },
  props: {
    errors: Object
  },
  setup() {
    const page = usePage();
    const seo = computed(() => page.props.seo);
    const settings = computed(() => page.props.settings || {});
    const flash = computed(() => page.props.flash || {});
    const meta = computed(() => page.props.meta || {});
    const trans = (key) => {
      var _a;
      return ((_a = page.props.translations) == null ? void 0 : _a[key]) || key;
    };
    const formatError = (error) => {
      if (!error) {
        return error;
      }
      const authErrors = {
        "auth.failed": trans("These credentials do not match our records."),
        "auth.password": trans("The provided password is incorrect."),
        "auth.throttle": trans("Too many login attempts. Please try again in :seconds seconds."),
        "passwords.reset": trans("Your password has been reset."),
        "passwords.sent": trans("We have emailed your password reset link."),
        "passwords.throttled": trans("Please wait before retrying."),
        "passwords.token": trans("This password reset token is invalid."),
        "passwords.user": trans("We can't find a user with that email address.")
      };
      return authErrors[error] || trans(error) || error;
    };
    const metaTitle = computed(() => `${trans("Login")} | ${seo.value.website_name || ""}`.trim());
    const metaDescription = computed(() => meta.value.description || trans("Log in to manage your account and services."));
    const metaKeywords = computed(() => meta.value.keywords || trans("login, sign in, account access"));
    const metaImage = computed(() => {
      var _a, _b, _c, _d, _e;
      return ((_b = (_a = meta.value) == null ? void 0 : _a.og) == null ? void 0 : _b.image) || ((_d = (_c = meta.value) == null ? void 0 : _c.twitter) == null ? void 0 : _d.image) || ((_e = settings.value) == null ? void 0 : _e.meta_img) || "";
    });
    const metaCanonical = computed(() => meta.value.canonical || "");
    const metaRobots = computed(() => meta.value.robots || "noindex, nofollow");
    const form = useForm({
      email: "",
      password: "",
      remember: false
    });
    return {
      form,
      trans,
      formatError,
      flash,
      metaTitle,
      metaDescription,
      metaKeywords,
      metaImage,
      metaCanonical,
      metaRobots
    };
  }
};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Head = resolveComponent("Head");
  const _component_AuthShell = resolveComponent("AuthShell");
  const _component_PasswordInput = resolveComponent("PasswordInput");
  const _component_Link = resolveComponent("Link");
  _push(`<!--[-->`);
  _push(ssrRenderComponent(_component_Head, null, {
    default: withCtx((_2, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<title${_scopeId}>${ssrInterpolate($setup.metaTitle)}</title><meta name="description"${ssrRenderAttr("content", $setup.metaDescription)}${_scopeId}><meta name="keywords"${ssrRenderAttr("content", $setup.metaKeywords)}${_scopeId}><meta name="robots"${ssrRenderAttr("content", $setup.metaRobots)}${_scopeId}>`);
        if ($setup.metaCanonical) {
          _push2(`<link rel="canonical"${ssrRenderAttr("href", $setup.metaCanonical)}${_scopeId}>`);
        } else {
          _push2(`<!---->`);
        }
        _push2(`<meta property="og:title"${ssrRenderAttr("content", $setup.metaTitle)}${_scopeId}><meta property="og:description"${ssrRenderAttr("content", $setup.metaDescription)}${_scopeId}>`);
        if ($setup.metaImage) {
          _push2(`<meta property="og:image"${ssrRenderAttr("content", $setup.metaImage)}${_scopeId}>`);
        } else {
          _push2(`<!---->`);
        }
        if ($setup.metaCanonical) {
          _push2(`<meta property="og:url"${ssrRenderAttr("content", $setup.metaCanonical)}${_scopeId}>`);
        } else {
          _push2(`<!---->`);
        }
        _push2(`<meta property="og:type" content="website"${_scopeId}><meta name="twitter:card" content="summary_large_image"${_scopeId}><meta name="twitter:title"${ssrRenderAttr("content", $setup.metaTitle)}${_scopeId}><meta name="twitter:description"${ssrRenderAttr("content", $setup.metaDescription)}${_scopeId}>`);
        if ($setup.metaImage) {
          _push2(`<meta name="twitter:image"${ssrRenderAttr("content", $setup.metaImage)}${_scopeId}>`);
        } else {
          _push2(`<!---->`);
        }
      } else {
        return [
          createVNode("title", null, toDisplayString($setup.metaTitle), 1),
          createVNode("meta", {
            name: "description",
            content: $setup.metaDescription
          }, null, 8, ["content"]),
          createVNode("meta", {
            name: "keywords",
            content: $setup.metaKeywords
          }, null, 8, ["content"]),
          createVNode("meta", {
            name: "robots",
            content: $setup.metaRobots
          }, null, 8, ["content"]),
          $setup.metaCanonical ? (openBlock(), createBlock("link", {
            key: 0,
            rel: "canonical",
            href: $setup.metaCanonical
          }, null, 8, ["href"])) : createCommentVNode("", true),
          createVNode("meta", {
            property: "og:title",
            content: $setup.metaTitle
          }, null, 8, ["content"]),
          createVNode("meta", {
            property: "og:description",
            content: $setup.metaDescription
          }, null, 8, ["content"]),
          $setup.metaImage ? (openBlock(), createBlock("meta", {
            key: 1,
            property: "og:image",
            content: $setup.metaImage
          }, null, 8, ["content"])) : createCommentVNode("", true),
          $setup.metaCanonical ? (openBlock(), createBlock("meta", {
            key: 2,
            property: "og:url",
            content: $setup.metaCanonical
          }, null, 8, ["content"])) : createCommentVNode("", true),
          createVNode("meta", {
            property: "og:type",
            content: "website"
          }),
          createVNode("meta", {
            name: "twitter:card",
            content: "summary_large_image"
          }),
          createVNode("meta", {
            name: "twitter:title",
            content: $setup.metaTitle
          }, null, 8, ["content"]),
          createVNode("meta", {
            name: "twitter:description",
            content: $setup.metaDescription
          }, null, 8, ["content"]),
          $setup.metaImage ? (openBlock(), createBlock("meta", {
            key: 3,
            name: "twitter:image",
            content: $setup.metaImage
          }, null, 8, ["content"])) : createCommentVNode("", true)
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_AuthShell, {
    title: $setup.trans("Login"),
    "success-message": $setup.flash.success ? $setup.formatError($setup.flash.success) : "",
    "error-message": $setup.flash.error ? $setup.formatError($setup.flash.error) : ""
  }, {
    footer: withCtx((_2, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<p${_scopeId}>${ssrInterpolate($setup.trans("I Don't Have Account!"))} `);
        _push2(ssrRenderComponent(_component_Link, {
          href: _ctx.route("register")
        }, {
          default: withCtx((_3, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`${ssrInterpolate($setup.trans("Create A New Account"))}`);
            } else {
              return [
                createTextVNode(toDisplayString($setup.trans("Create A New Account")), 1)
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(`</p>`);
      } else {
        return [
          createVNode("p", null, [
            createTextVNode(toDisplayString($setup.trans("I Don't Have Account!")) + " ", 1),
            createVNode(_component_Link, {
              href: _ctx.route("register")
            }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString($setup.trans("Create A New Account")), 1)
              ]),
              _: 1
            }, 8, ["href"])
          ])
        ];
      }
    }),
    default: withCtx((_2, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<form id="login-form"${_scopeId}><div class="form-group"${_scopeId}><div class="input-box"${_scopeId}><input id="formEmail"${ssrRenderAttr("value", $setup.form.email)} type="email" name="email" class="style-large"${ssrRenderAttr("placeholder", $setup.trans("Email"))}${ssrIncludeBooleanAttr($setup.form.processing) ? " disabled" : ""} autocomplete="username" required${_scopeId}></div>`);
        if ($props.errors.email) {
          _push2(`<div class="field-error"${_scopeId}>${ssrInterpolate($setup.formatError($props.errors.email))}</div>`);
        } else {
          _push2(`<!---->`);
        }
        _push2(`</div><div class="form-group"${_scopeId}>`);
        _push2(ssrRenderComponent(_component_PasswordInput, {
          id: "formPassword",
          modelValue: $setup.form.password,
          "onUpdate:modelValue": ($event) => $setup.form.password = $event,
          name: "password",
          placeholder: $setup.trans("Password"),
          disabled: $setup.form.processing,
          autocomplete: "current-password",
          "show-label": $setup.trans("Show password"),
          "hide-label": $setup.trans("Hide password"),
          required: ""
        }, null, _parent2, _scopeId));
        if ($props.errors.password) {
          _push2(`<div class="field-error"${_scopeId}>${ssrInterpolate($setup.formatError($props.errors.password))}</div>`);
        } else {
          _push2(`<!---->`);
        }
        _push2(`</div><div class="remember-forget"${_scopeId}><div class="checked-box1"${_scopeId}><input id="saveinfo"${ssrIncludeBooleanAttr(Array.isArray($setup.form.remember) ? ssrLooseContain($setup.form.remember, null) : $setup.form.remember) ? " checked" : ""} type="checkbox" name="remember"${_scopeId}><label for="saveinfo"${_scopeId}>${ssrInterpolate($setup.trans("Remember Me"))}</label></div><div class="forget"${_scopeId}>`);
        _push2(ssrRenderComponent(_component_Link, {
          href: _ctx.route("password.request")
        }, {
          default: withCtx((_3, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`${ssrInterpolate($setup.trans("Forgot Password"))}`);
            } else {
              return [
                createTextVNode(toDisplayString($setup.trans("Forgot Password")), 1)
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(`</div></div><div class="auth-page__actions"${_scopeId}><button class="thm-btn" type="submit"${ssrIncludeBooleanAttr($setup.form.processing) ? " disabled" : ""}${_scopeId}><span${_scopeId}>${ssrInterpolate($setup.form.processing ? $setup.trans("Signing In...") : $setup.trans("Login"))}</span></button></div></form>`);
      } else {
        return [
          createVNode("form", {
            id: "login-form",
            onSubmit: withModifiers(($event) => $setup.form.post(_ctx.route("login")), ["prevent"])
          }, [
            createVNode("div", { class: "form-group" }, [
              createVNode("div", { class: "input-box" }, [
                withDirectives(createVNode("input", {
                  id: "formEmail",
                  "onUpdate:modelValue": ($event) => $setup.form.email = $event,
                  type: "email",
                  name: "email",
                  class: "style-large",
                  placeholder: $setup.trans("Email"),
                  disabled: $setup.form.processing,
                  autocomplete: "username",
                  required: ""
                }, null, 8, ["onUpdate:modelValue", "placeholder", "disabled"]), [
                  [vModelText, $setup.form.email]
                ])
              ]),
              $props.errors.email ? (openBlock(), createBlock("div", {
                key: 0,
                class: "field-error"
              }, toDisplayString($setup.formatError($props.errors.email)), 1)) : createCommentVNode("", true)
            ]),
            createVNode("div", { class: "form-group" }, [
              createVNode(_component_PasswordInput, {
                id: "formPassword",
                modelValue: $setup.form.password,
                "onUpdate:modelValue": ($event) => $setup.form.password = $event,
                name: "password",
                placeholder: $setup.trans("Password"),
                disabled: $setup.form.processing,
                autocomplete: "current-password",
                "show-label": $setup.trans("Show password"),
                "hide-label": $setup.trans("Hide password"),
                required: ""
              }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder", "disabled", "show-label", "hide-label"]),
              $props.errors.password ? (openBlock(), createBlock("div", {
                key: 0,
                class: "field-error"
              }, toDisplayString($setup.formatError($props.errors.password)), 1)) : createCommentVNode("", true)
            ]),
            createVNode("div", { class: "remember-forget" }, [
              createVNode("div", { class: "checked-box1" }, [
                withDirectives(createVNode("input", {
                  id: "saveinfo",
                  "onUpdate:modelValue": ($event) => $setup.form.remember = $event,
                  type: "checkbox",
                  name: "remember"
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelCheckbox, $setup.form.remember]
                ]),
                createVNode("label", { for: "saveinfo" }, toDisplayString($setup.trans("Remember Me")), 1)
              ]),
              createVNode("div", { class: "forget" }, [
                createVNode(_component_Link, {
                  href: _ctx.route("password.request")
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString($setup.trans("Forgot Password")), 1)
                  ]),
                  _: 1
                }, 8, ["href"])
              ])
            ]),
            createVNode("div", { class: "auth-page__actions" }, [
              createVNode("button", {
                class: "thm-btn",
                type: "submit",
                disabled: $setup.form.processing
              }, [
                createVNode("span", null, toDisplayString($setup.form.processing ? $setup.trans("Signing In...") : $setup.trans("Login")), 1)
              ], 8, ["disabled"])
            ])
          ], 40, ["onSubmit"])
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<!--]-->`);
}
const _sfc_setup$h = _sfc_main$h.setup;
_sfc_main$h.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("Modules/User/resources/assets/js/Pages/Auth/Login.vue");
  return _sfc_setup$h ? _sfc_setup$h(props, ctx) : void 0;
};
const Login = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["ssrRender", _sfc_ssrRender$3]]);
const __vite_glob_0_23 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Login
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$g = {
  components: {
    AuthShell: _sfc_main$k,
    Link,
    Head,
    PasswordInput: _sfc_main$i
  },
  props: {
    errors: Object
  },
  setup() {
    const page = usePage();
    const seo = computed(() => page.props.seo);
    const settings = computed(() => page.props.settings || {});
    const flash = computed(() => page.props.flash || {});
    const meta = computed(() => page.props.meta || {});
    const trans = (key) => {
      var _a;
      return ((_a = page.props.translations) == null ? void 0 : _a[key]) || key;
    };
    const metaTitle = computed(() => `${trans("Register")} | ${seo.value.website_name || ""}`.trim());
    const metaDescription = computed(() => meta.value.description || trans("Create a new account to access our services."));
    const metaKeywords = computed(() => meta.value.keywords || trans("register, sign up, create account"));
    const metaImage = computed(() => {
      var _a, _b, _c, _d, _e;
      return ((_b = (_a = meta.value) == null ? void 0 : _a.og) == null ? void 0 : _b.image) || ((_d = (_c = meta.value) == null ? void 0 : _c.twitter) == null ? void 0 : _d.image) || ((_e = settings.value) == null ? void 0 : _e.meta_img) || "";
    });
    const metaCanonical = computed(() => meta.value.canonical || "");
    const metaRobots = computed(() => meta.value.robots || "noindex, nofollow");
    const form = useForm({
      name: "",
      email: "",
      mobile: "",
      password: "",
      password_confirmation: ""
    });
    return {
      form,
      trans,
      flash,
      metaTitle,
      metaDescription,
      metaKeywords,
      metaImage,
      metaCanonical,
      metaRobots
    };
  }
};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Head = resolveComponent("Head");
  const _component_AuthShell = resolveComponent("AuthShell");
  const _component_PasswordInput = resolveComponent("PasswordInput");
  const _component_Link = resolveComponent("Link");
  _push(`<!--[-->`);
  _push(ssrRenderComponent(_component_Head, null, {
    default: withCtx((_2, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<title${_scopeId}>${ssrInterpolate($setup.metaTitle)}</title><meta name="description"${ssrRenderAttr("content", $setup.metaDescription)}${_scopeId}><meta name="keywords"${ssrRenderAttr("content", $setup.metaKeywords)}${_scopeId}><meta name="robots"${ssrRenderAttr("content", $setup.metaRobots)}${_scopeId}>`);
        if ($setup.metaCanonical) {
          _push2(`<link rel="canonical"${ssrRenderAttr("href", $setup.metaCanonical)}${_scopeId}>`);
        } else {
          _push2(`<!---->`);
        }
        _push2(`<meta property="og:title"${ssrRenderAttr("content", $setup.metaTitle)}${_scopeId}><meta property="og:description"${ssrRenderAttr("content", $setup.metaDescription)}${_scopeId}>`);
        if ($setup.metaImage) {
          _push2(`<meta property="og:image"${ssrRenderAttr("content", $setup.metaImage)}${_scopeId}>`);
        } else {
          _push2(`<!---->`);
        }
        if ($setup.metaCanonical) {
          _push2(`<meta property="og:url"${ssrRenderAttr("content", $setup.metaCanonical)}${_scopeId}>`);
        } else {
          _push2(`<!---->`);
        }
        _push2(`<meta property="og:type" content="website"${_scopeId}><meta name="twitter:card" content="summary_large_image"${_scopeId}><meta name="twitter:title"${ssrRenderAttr("content", $setup.metaTitle)}${_scopeId}><meta name="twitter:description"${ssrRenderAttr("content", $setup.metaDescription)}${_scopeId}>`);
        if ($setup.metaImage) {
          _push2(`<meta name="twitter:image"${ssrRenderAttr("content", $setup.metaImage)}${_scopeId}>`);
        } else {
          _push2(`<!---->`);
        }
      } else {
        return [
          createVNode("title", null, toDisplayString($setup.metaTitle), 1),
          createVNode("meta", {
            name: "description",
            content: $setup.metaDescription
          }, null, 8, ["content"]),
          createVNode("meta", {
            name: "keywords",
            content: $setup.metaKeywords
          }, null, 8, ["content"]),
          createVNode("meta", {
            name: "robots",
            content: $setup.metaRobots
          }, null, 8, ["content"]),
          $setup.metaCanonical ? (openBlock(), createBlock("link", {
            key: 0,
            rel: "canonical",
            href: $setup.metaCanonical
          }, null, 8, ["href"])) : createCommentVNode("", true),
          createVNode("meta", {
            property: "og:title",
            content: $setup.metaTitle
          }, null, 8, ["content"]),
          createVNode("meta", {
            property: "og:description",
            content: $setup.metaDescription
          }, null, 8, ["content"]),
          $setup.metaImage ? (openBlock(), createBlock("meta", {
            key: 1,
            property: "og:image",
            content: $setup.metaImage
          }, null, 8, ["content"])) : createCommentVNode("", true),
          $setup.metaCanonical ? (openBlock(), createBlock("meta", {
            key: 2,
            property: "og:url",
            content: $setup.metaCanonical
          }, null, 8, ["content"])) : createCommentVNode("", true),
          createVNode("meta", {
            property: "og:type",
            content: "website"
          }),
          createVNode("meta", {
            name: "twitter:card",
            content: "summary_large_image"
          }),
          createVNode("meta", {
            name: "twitter:title",
            content: $setup.metaTitle
          }, null, 8, ["content"]),
          createVNode("meta", {
            name: "twitter:description",
            content: $setup.metaDescription
          }, null, 8, ["content"]),
          $setup.metaImage ? (openBlock(), createBlock("meta", {
            key: 3,
            name: "twitter:image",
            content: $setup.metaImage
          }, null, 8, ["content"])) : createCommentVNode("", true)
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_AuthShell, {
    title: $setup.trans("Register"),
    "success-message": $setup.flash.success || "",
    "error-message": $setup.flash.error || ""
  }, {
    footer: withCtx((_2, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<p${_scopeId}>${ssrInterpolate($setup.trans("Already Have An Account?"))} `);
        _push2(ssrRenderComponent(_component_Link, {
          href: _ctx.route("login")
        }, {
          default: withCtx((_3, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`${ssrInterpolate($setup.trans("Login"))}`);
            } else {
              return [
                createTextVNode(toDisplayString($setup.trans("Login")), 1)
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(`</p>`);
      } else {
        return [
          createVNode("p", null, [
            createTextVNode(toDisplayString($setup.trans("Already Have An Account?")) + " ", 1),
            createVNode(_component_Link, {
              href: _ctx.route("login")
            }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString($setup.trans("Login")), 1)
              ]),
              _: 1
            }, 8, ["href"])
          ])
        ];
      }
    }),
    default: withCtx((_2, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<form id="register-form"${_scopeId}><div class="form-group"${_scopeId}><div class="input-box"${_scopeId}><input id="formName"${ssrRenderAttr("value", $setup.form.name)} type="text" name="name" class="style-large"${ssrRenderAttr("placeholder", $setup.trans("Name"))}${ssrIncludeBooleanAttr($setup.form.processing) ? " disabled" : ""} autocomplete="name" required${_scopeId}></div>`);
        if ($props.errors.name) {
          _push2(`<div class="field-error"${_scopeId}>${ssrInterpolate($props.errors.name)}</div>`);
        } else {
          _push2(`<!---->`);
        }
        _push2(`</div><div class="form-group"${_scopeId}><div class="input-box"${_scopeId}><input id="formEmail"${ssrRenderAttr("value", $setup.form.email)} type="email" name="email" class="style-large"${ssrRenderAttr("placeholder", $setup.trans("Email"))}${ssrIncludeBooleanAttr($setup.form.processing) ? " disabled" : ""} autocomplete="email" required${_scopeId}></div>`);
        if ($props.errors.email) {
          _push2(`<div class="field-error"${_scopeId}>${ssrInterpolate($props.errors.email)}</div>`);
        } else {
          _push2(`<!---->`);
        }
        _push2(`</div><div class="form-group"${_scopeId}><div class="input-box"${_scopeId}><input id="formPhone"${ssrRenderAttr("value", $setup.form.mobile)} type="tel" name="mobile" class="style-large"${ssrRenderAttr("placeholder", $setup.trans("Phone"))}${ssrIncludeBooleanAttr($setup.form.processing) ? " disabled" : ""} autocomplete="tel" required${_scopeId}></div>`);
        if ($props.errors.mobile) {
          _push2(`<div class="field-error"${_scopeId}>${ssrInterpolate($props.errors.mobile)}</div>`);
        } else {
          _push2(`<!---->`);
        }
        _push2(`</div><div class="form-group"${_scopeId}>`);
        _push2(ssrRenderComponent(_component_PasswordInput, {
          id: "formPassword",
          modelValue: $setup.form.password,
          "onUpdate:modelValue": ($event) => $setup.form.password = $event,
          name: "password",
          placeholder: $setup.trans("Password"),
          disabled: $setup.form.processing,
          autocomplete: "new-password",
          "show-label": $setup.trans("Show password"),
          "hide-label": $setup.trans("Hide password"),
          required: ""
        }, null, _parent2, _scopeId));
        if ($props.errors.password) {
          _push2(`<div class="field-error"${_scopeId}>${ssrInterpolate($props.errors.password)}</div>`);
        } else {
          _push2(`<!---->`);
        }
        _push2(`</div><div class="form-group"${_scopeId}>`);
        _push2(ssrRenderComponent(_component_PasswordInput, {
          id: "formPasswordConfirm",
          modelValue: $setup.form.password_confirmation,
          "onUpdate:modelValue": ($event) => $setup.form.password_confirmation = $event,
          name: "password_confirmation",
          placeholder: $setup.trans("Confirm Password"),
          disabled: $setup.form.processing,
          autocomplete: "new-password",
          "show-label": $setup.trans("Show password"),
          "hide-label": $setup.trans("Hide password"),
          required: ""
        }, null, _parent2, _scopeId));
        if ($props.errors.password_confirmation) {
          _push2(`<div class="field-error"${_scopeId}>${ssrInterpolate($props.errors.password_confirmation)}</div>`);
        } else {
          _push2(`<!---->`);
        }
        _push2(`</div><div class="auth-page__actions"${_scopeId}><button class="thm-btn" type="submit"${ssrIncludeBooleanAttr($setup.form.processing) ? " disabled" : ""}${_scopeId}><span${_scopeId}>${ssrInterpolate($setup.form.processing ? $setup.trans("Registering...") : $setup.trans("Register"))}</span></button></div></form>`);
      } else {
        return [
          createVNode("form", {
            id: "register-form",
            onSubmit: withModifiers(($event) => $setup.form.post(_ctx.route("register")), ["prevent"])
          }, [
            createVNode("div", { class: "form-group" }, [
              createVNode("div", { class: "input-box" }, [
                withDirectives(createVNode("input", {
                  id: "formName",
                  "onUpdate:modelValue": ($event) => $setup.form.name = $event,
                  type: "text",
                  name: "name",
                  class: "style-large",
                  placeholder: $setup.trans("Name"),
                  disabled: $setup.form.processing,
                  autocomplete: "name",
                  required: ""
                }, null, 8, ["onUpdate:modelValue", "placeholder", "disabled"]), [
                  [vModelText, $setup.form.name]
                ])
              ]),
              $props.errors.name ? (openBlock(), createBlock("div", {
                key: 0,
                class: "field-error"
              }, toDisplayString($props.errors.name), 1)) : createCommentVNode("", true)
            ]),
            createVNode("div", { class: "form-group" }, [
              createVNode("div", { class: "input-box" }, [
                withDirectives(createVNode("input", {
                  id: "formEmail",
                  "onUpdate:modelValue": ($event) => $setup.form.email = $event,
                  type: "email",
                  name: "email",
                  class: "style-large",
                  placeholder: $setup.trans("Email"),
                  disabled: $setup.form.processing,
                  autocomplete: "email",
                  required: ""
                }, null, 8, ["onUpdate:modelValue", "placeholder", "disabled"]), [
                  [vModelText, $setup.form.email]
                ])
              ]),
              $props.errors.email ? (openBlock(), createBlock("div", {
                key: 0,
                class: "field-error"
              }, toDisplayString($props.errors.email), 1)) : createCommentVNode("", true)
            ]),
            createVNode("div", { class: "form-group" }, [
              createVNode("div", { class: "input-box" }, [
                withDirectives(createVNode("input", {
                  id: "formPhone",
                  "onUpdate:modelValue": ($event) => $setup.form.mobile = $event,
                  type: "tel",
                  name: "mobile",
                  class: "style-large",
                  placeholder: $setup.trans("Phone"),
                  disabled: $setup.form.processing,
                  autocomplete: "tel",
                  required: ""
                }, null, 8, ["onUpdate:modelValue", "placeholder", "disabled"]), [
                  [vModelText, $setup.form.mobile]
                ])
              ]),
              $props.errors.mobile ? (openBlock(), createBlock("div", {
                key: 0,
                class: "field-error"
              }, toDisplayString($props.errors.mobile), 1)) : createCommentVNode("", true)
            ]),
            createVNode("div", { class: "form-group" }, [
              createVNode(_component_PasswordInput, {
                id: "formPassword",
                modelValue: $setup.form.password,
                "onUpdate:modelValue": ($event) => $setup.form.password = $event,
                name: "password",
                placeholder: $setup.trans("Password"),
                disabled: $setup.form.processing,
                autocomplete: "new-password",
                "show-label": $setup.trans("Show password"),
                "hide-label": $setup.trans("Hide password"),
                required: ""
              }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder", "disabled", "show-label", "hide-label"]),
              $props.errors.password ? (openBlock(), createBlock("div", {
                key: 0,
                class: "field-error"
              }, toDisplayString($props.errors.password), 1)) : createCommentVNode("", true)
            ]),
            createVNode("div", { class: "form-group" }, [
              createVNode(_component_PasswordInput, {
                id: "formPasswordConfirm",
                modelValue: $setup.form.password_confirmation,
                "onUpdate:modelValue": ($event) => $setup.form.password_confirmation = $event,
                name: "password_confirmation",
                placeholder: $setup.trans("Confirm Password"),
                disabled: $setup.form.processing,
                autocomplete: "new-password",
                "show-label": $setup.trans("Show password"),
                "hide-label": $setup.trans("Hide password"),
                required: ""
              }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder", "disabled", "show-label", "hide-label"]),
              $props.errors.password_confirmation ? (openBlock(), createBlock("div", {
                key: 0,
                class: "field-error"
              }, toDisplayString($props.errors.password_confirmation), 1)) : createCommentVNode("", true)
            ]),
            createVNode("div", { class: "auth-page__actions" }, [
              createVNode("button", {
                class: "thm-btn",
                type: "submit",
                disabled: $setup.form.processing
              }, [
                createVNode("span", null, toDisplayString($setup.form.processing ? $setup.trans("Registering...") : $setup.trans("Register")), 1)
              ], 8, ["disabled"])
            ])
          ], 40, ["onSubmit"])
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<!--]-->`);
}
const _sfc_setup$g = _sfc_main$g.setup;
_sfc_main$g.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("Modules/User/resources/assets/js/Pages/Auth/Register.vue");
  return _sfc_setup$g ? _sfc_setup$g(props, ctx) : void 0;
};
const Register = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["ssrRender", _sfc_ssrRender$2]]);
const __vite_glob_0_24 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Register
}, Symbol.toStringTag, { value: "Module" }));
const readQueryParam = (name) => {
  if (typeof window === "undefined") {
    return "";
  }
  return new URLSearchParams(window.location.search).get(name) || "";
};
const readTokenFromPath = () => {
  if (typeof window === "undefined") {
    return "";
  }
  const match = window.location.pathname.match(/\/reset-password\/(.+)$/);
  return match ? decodeURIComponent(match[1]) : "";
};
const _sfc_main$f = {
  components: {
    AuthShell: _sfc_main$k,
    Link,
    Head,
    PasswordInput: _sfc_main$i
  },
  props: {
    errors: Object,
    email: { type: String, default: "" },
    token: { type: String, default: "" }
  },
  setup(props) {
    const page = usePage();
    const seo = computed(() => page.props.seo);
    const settings = computed(() => page.props.settings || {});
    const flash = computed(() => page.props.flash || {});
    const meta = computed(() => page.props.meta || {});
    const trans = (key) => {
      var _a;
      return ((_a = page.props.translations) == null ? void 0 : _a[key]) || key;
    };
    const formatError = (error) => {
      if (!error) {
        return "";
      }
      if (Array.isArray(error)) {
        return error.map(formatError).filter(Boolean).join(" ");
      }
      const authErrors = {
        "passwords.reset": trans("Your password has been reset."),
        "passwords.sent": trans("We have emailed your password reset link."),
        "passwords.throttled": trans("Please wait before retrying."),
        "passwords.token": trans("This password reset token is invalid."),
        "passwords.user": trans("We can't find a user with that email address.")
      };
      return authErrors[error] || trans(error) || error;
    };
    const form = useForm({
      email: props.email || readQueryParam("email"),
      password: "",
      password_confirmation: "",
      token: props.token || readQueryParam("token") || readTokenFromPath()
    });
    const fieldErrors = computed(() => ({
      ...page.props.errors || {},
      ...form.errors || {}
    }));
    const bannerError = computed(() => flash.value.error || fieldErrors.value.token || "");
    const submit = () => {
      form.post(route("password.update"));
    };
    const metaTitle = computed(() => `${trans("Reset Password")} | ${seo.value.website_name || ""}`.trim());
    const metaDescription = computed(() => meta.value.description || trans("Set a new password to secure your account."));
    const metaKeywords = computed(() => meta.value.keywords || trans("reset password, account security, set new password"));
    const metaImage = computed(() => {
      var _a, _b, _c, _d, _e;
      return ((_b = (_a = meta.value) == null ? void 0 : _a.og) == null ? void 0 : _b.image) || ((_d = (_c = meta.value) == null ? void 0 : _c.twitter) == null ? void 0 : _d.image) || ((_e = settings.value) == null ? void 0 : _e.meta_img) || "";
    });
    const metaCanonical = computed(() => meta.value.canonical || "");
    const metaRobots = computed(() => meta.value.robots || "noindex, nofollow");
    return {
      form,
      trans,
      formatError,
      fieldErrors,
      bannerError,
      submit,
      flash,
      metaTitle,
      metaDescription,
      metaKeywords,
      metaImage,
      metaCanonical,
      metaRobots
    };
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Head = resolveComponent("Head");
  const _component_AuthShell = resolveComponent("AuthShell");
  const _component_PasswordInput = resolveComponent("PasswordInput");
  const _component_Link = resolveComponent("Link");
  _push(`<!--[-->`);
  _push(ssrRenderComponent(_component_Head, null, {
    default: withCtx((_2, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<title${_scopeId}>${ssrInterpolate($setup.metaTitle)}</title><meta name="description"${ssrRenderAttr("content", $setup.metaDescription)}${_scopeId}><meta name="keywords"${ssrRenderAttr("content", $setup.metaKeywords)}${_scopeId}><meta name="robots"${ssrRenderAttr("content", $setup.metaRobots)}${_scopeId}>`);
        if ($setup.metaCanonical) {
          _push2(`<link rel="canonical"${ssrRenderAttr("href", $setup.metaCanonical)}${_scopeId}>`);
        } else {
          _push2(`<!---->`);
        }
        _push2(`<meta property="og:title"${ssrRenderAttr("content", $setup.metaTitle)}${_scopeId}><meta property="og:description"${ssrRenderAttr("content", $setup.metaDescription)}${_scopeId}>`);
        if ($setup.metaImage) {
          _push2(`<meta property="og:image"${ssrRenderAttr("content", $setup.metaImage)}${_scopeId}>`);
        } else {
          _push2(`<!---->`);
        }
        if ($setup.metaCanonical) {
          _push2(`<meta property="og:url"${ssrRenderAttr("content", $setup.metaCanonical)}${_scopeId}>`);
        } else {
          _push2(`<!---->`);
        }
        _push2(`<meta property="og:type" content="website"${_scopeId}><meta name="twitter:card" content="summary_large_image"${_scopeId}><meta name="twitter:title"${ssrRenderAttr("content", $setup.metaTitle)}${_scopeId}><meta name="twitter:description"${ssrRenderAttr("content", $setup.metaDescription)}${_scopeId}>`);
        if ($setup.metaImage) {
          _push2(`<meta name="twitter:image"${ssrRenderAttr("content", $setup.metaImage)}${_scopeId}>`);
        } else {
          _push2(`<!---->`);
        }
      } else {
        return [
          createVNode("title", null, toDisplayString($setup.metaTitle), 1),
          createVNode("meta", {
            name: "description",
            content: $setup.metaDescription
          }, null, 8, ["content"]),
          createVNode("meta", {
            name: "keywords",
            content: $setup.metaKeywords
          }, null, 8, ["content"]),
          createVNode("meta", {
            name: "robots",
            content: $setup.metaRobots
          }, null, 8, ["content"]),
          $setup.metaCanonical ? (openBlock(), createBlock("link", {
            key: 0,
            rel: "canonical",
            href: $setup.metaCanonical
          }, null, 8, ["href"])) : createCommentVNode("", true),
          createVNode("meta", {
            property: "og:title",
            content: $setup.metaTitle
          }, null, 8, ["content"]),
          createVNode("meta", {
            property: "og:description",
            content: $setup.metaDescription
          }, null, 8, ["content"]),
          $setup.metaImage ? (openBlock(), createBlock("meta", {
            key: 1,
            property: "og:image",
            content: $setup.metaImage
          }, null, 8, ["content"])) : createCommentVNode("", true),
          $setup.metaCanonical ? (openBlock(), createBlock("meta", {
            key: 2,
            property: "og:url",
            content: $setup.metaCanonical
          }, null, 8, ["content"])) : createCommentVNode("", true),
          createVNode("meta", {
            property: "og:type",
            content: "website"
          }),
          createVNode("meta", {
            name: "twitter:card",
            content: "summary_large_image"
          }),
          createVNode("meta", {
            name: "twitter:title",
            content: $setup.metaTitle
          }, null, 8, ["content"]),
          createVNode("meta", {
            name: "twitter:description",
            content: $setup.metaDescription
          }, null, 8, ["content"]),
          $setup.metaImage ? (openBlock(), createBlock("meta", {
            key: 3,
            name: "twitter:image",
            content: $setup.metaImage
          }, null, 8, ["content"])) : createCommentVNode("", true)
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_AuthShell, {
    title: $setup.trans("Set New Password"),
    subtitle: $setup.trans("Choose a strong password you have not used before."),
    "success-message": $setup.flash.success ? $setup.formatError($setup.flash.success) : "",
    "error-message": $setup.bannerError ? $setup.formatError($setup.bannerError) : ""
  }, {
    footer: withCtx((_2, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<p${_scopeId}>`);
        _push2(ssrRenderComponent(_component_Link, {
          href: _ctx.route("login")
        }, {
          default: withCtx((_3, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`${ssrInterpolate($setup.trans("Back to Login"))}`);
            } else {
              return [
                createTextVNode(toDisplayString($setup.trans("Back to Login")), 1)
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(`</p>`);
      } else {
        return [
          createVNode("p", null, [
            createVNode(_component_Link, {
              href: _ctx.route("login")
            }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString($setup.trans("Back to Login")), 1)
              ]),
              _: 1
            }, 8, ["href"])
          ])
        ];
      }
    }),
    default: withCtx((_2, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<form id="reset-password-form"${_scopeId}><input${ssrRenderAttr("value", $setup.form.token)} name="token" type="hidden"${_scopeId}><div class="form-group"${_scopeId}><div class="input-box"${_scopeId}><input id="email"${ssrRenderAttr("value", $setup.form.email)} type="email" name="email" class="${ssrRenderClass([{ error: $setup.fieldErrors.email }, "style-large"])}" autocomplete="email"${ssrRenderAttr("placeholder", $setup.trans("Email"))}${ssrIncludeBooleanAttr($setup.form.processing) ? " disabled" : ""} required${_scopeId}></div>`);
        if ($setup.fieldErrors.email) {
          _push2(`<div class="field-error"${_scopeId}>${ssrInterpolate($setup.formatError($setup.fieldErrors.email))}</div>`);
        } else {
          _push2(`<!---->`);
        }
        _push2(`</div><div class="form-group"${_scopeId}>`);
        _push2(ssrRenderComponent(_component_PasswordInput, {
          id: "password",
          modelValue: $setup.form.password,
          "onUpdate:modelValue": ($event) => $setup.form.password = $event,
          name: "password",
          placeholder: $setup.trans("Password"),
          disabled: $setup.form.processing,
          autocomplete: "new-password",
          "show-label": $setup.trans("Show password"),
          "hide-label": $setup.trans("Hide password"),
          required: ""
        }, null, _parent2, _scopeId));
        if ($setup.fieldErrors.password) {
          _push2(`<div class="field-error"${_scopeId}>${ssrInterpolate($setup.formatError($setup.fieldErrors.password))}</div>`);
        } else {
          _push2(`<!---->`);
        }
        _push2(`</div><div class="form-group"${_scopeId}>`);
        _push2(ssrRenderComponent(_component_PasswordInput, {
          id: "password_confirmation",
          modelValue: $setup.form.password_confirmation,
          "onUpdate:modelValue": ($event) => $setup.form.password_confirmation = $event,
          name: "password_confirmation",
          placeholder: $setup.trans("Confirm Password"),
          disabled: $setup.form.processing,
          autocomplete: "new-password",
          "show-label": $setup.trans("Show password"),
          "hide-label": $setup.trans("Hide password"),
          required: ""
        }, null, _parent2, _scopeId));
        if ($setup.fieldErrors.password_confirmation) {
          _push2(`<div class="field-error"${_scopeId}>${ssrInterpolate($setup.formatError($setup.fieldErrors.password_confirmation))}</div>`);
        } else {
          _push2(`<!---->`);
        }
        _push2(`</div><div class="auth-page__actions"${_scopeId}><button class="thm-btn" type="submit"${ssrIncludeBooleanAttr($setup.form.processing) ? " disabled" : ""}${_scopeId}><span${_scopeId}>${ssrInterpolate($setup.form.processing ? $setup.trans("Resetting...") : $setup.trans("Reset Password"))}</span></button></div></form>`);
      } else {
        return [
          createVNode("form", {
            id: "reset-password-form",
            onSubmit: withModifiers($setup.submit, ["prevent"])
          }, [
            withDirectives(createVNode("input", {
              "onUpdate:modelValue": ($event) => $setup.form.token = $event,
              name: "token",
              type: "hidden"
            }, null, 8, ["onUpdate:modelValue"]), [
              [vModelText, $setup.form.token]
            ]),
            createVNode("div", { class: "form-group" }, [
              createVNode("div", { class: "input-box" }, [
                withDirectives(createVNode("input", {
                  id: "email",
                  "onUpdate:modelValue": ($event) => $setup.form.email = $event,
                  type: "email",
                  name: "email",
                  class: ["style-large", { error: $setup.fieldErrors.email }],
                  autocomplete: "email",
                  placeholder: $setup.trans("Email"),
                  disabled: $setup.form.processing,
                  required: ""
                }, null, 10, ["onUpdate:modelValue", "placeholder", "disabled"]), [
                  [vModelText, $setup.form.email]
                ])
              ]),
              $setup.fieldErrors.email ? (openBlock(), createBlock("div", {
                key: 0,
                class: "field-error"
              }, toDisplayString($setup.formatError($setup.fieldErrors.email)), 1)) : createCommentVNode("", true)
            ]),
            createVNode("div", { class: "form-group" }, [
              createVNode(_component_PasswordInput, {
                id: "password",
                modelValue: $setup.form.password,
                "onUpdate:modelValue": ($event) => $setup.form.password = $event,
                name: "password",
                placeholder: $setup.trans("Password"),
                disabled: $setup.form.processing,
                autocomplete: "new-password",
                "show-label": $setup.trans("Show password"),
                "hide-label": $setup.trans("Hide password"),
                required: ""
              }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder", "disabled", "show-label", "hide-label"]),
              $setup.fieldErrors.password ? (openBlock(), createBlock("div", {
                key: 0,
                class: "field-error"
              }, toDisplayString($setup.formatError($setup.fieldErrors.password)), 1)) : createCommentVNode("", true)
            ]),
            createVNode("div", { class: "form-group" }, [
              createVNode(_component_PasswordInput, {
                id: "password_confirmation",
                modelValue: $setup.form.password_confirmation,
                "onUpdate:modelValue": ($event) => $setup.form.password_confirmation = $event,
                name: "password_confirmation",
                placeholder: $setup.trans("Confirm Password"),
                disabled: $setup.form.processing,
                autocomplete: "new-password",
                "show-label": $setup.trans("Show password"),
                "hide-label": $setup.trans("Hide password"),
                required: ""
              }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder", "disabled", "show-label", "hide-label"]),
              $setup.fieldErrors.password_confirmation ? (openBlock(), createBlock("div", {
                key: 0,
                class: "field-error"
              }, toDisplayString($setup.formatError($setup.fieldErrors.password_confirmation)), 1)) : createCommentVNode("", true)
            ]),
            createVNode("div", { class: "auth-page__actions" }, [
              createVNode("button", {
                class: "thm-btn",
                type: "submit",
                disabled: $setup.form.processing
              }, [
                createVNode("span", null, toDisplayString($setup.form.processing ? $setup.trans("Resetting...") : $setup.trans("Reset Password")), 1)
              ], 8, ["disabled"])
            ])
          ], 40, ["onSubmit"])
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<!--]-->`);
}
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("Modules/User/resources/assets/js/Pages/Auth/ResetPassword.vue");
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : void 0;
};
const ResetPassword = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["ssrRender", _sfc_ssrRender$1]]);
const __vite_glob_0_25 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ResetPassword
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$e = {
  components: {
    AuthShell: _sfc_main$k,
    Head
  },
  setup() {
    const page = usePage();
    const useRecoveryCode = ref(false);
    const seo = computed(() => page.props.seo);
    const meta = computed(() => page.props.meta || {});
    const trans = (key) => {
      var _a;
      return ((_a = page.props.translations) == null ? void 0 : _a[key]) || key;
    };
    const metaTitle = computed(() => `${trans("Two-Factor Authentication")} | ${seo.value.website_name || ""}`.trim());
    const metaDescription = computed(() => {
      return meta.value.description || trans("Please confirm access to your account by entering the authentication code provided by your authenticator application.");
    });
    const form = useForm({
      code: "",
      recovery_code: ""
    });
    const toggleRecovery = () => {
      useRecoveryCode.value = !useRecoveryCode.value;
      form.code = "";
      form.recovery_code = "";
      form.clearErrors();
    };
    const submit = () => {
      form.post(route("two-factor.login.store"), {
        preserveScroll: true
      });
    };
    return {
      form,
      trans,
      metaTitle,
      metaDescription,
      useRecoveryCode,
      toggleRecovery,
      submit
    };
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Head = resolveComponent("Head");
  const _component_AuthShell = resolveComponent("AuthShell");
  _push(`<!--[-->`);
  _push(ssrRenderComponent(_component_Head, null, {
    default: withCtx((_2, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<title${_scopeId}>${ssrInterpolate($setup.metaTitle)}</title><meta name="description"${ssrRenderAttr("content", $setup.metaDescription)}${_scopeId}><meta name="robots" content="noindex, nofollow"${_scopeId}>`);
      } else {
        return [
          createVNode("title", null, toDisplayString($setup.metaTitle), 1),
          createVNode("meta", {
            name: "description",
            content: $setup.metaDescription
          }, null, 8, ["content"]),
          createVNode("meta", {
            name: "robots",
            content: "noindex, nofollow"
          })
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_AuthShell, {
    title: $setup.trans("Two-Factor Authentication"),
    subtitle: $setup.trans("Please confirm access to your account by entering the authentication code provided by your authenticator application.")
  }, {
    default: withCtx((_2, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<form${_scopeId}>`);
        if (!$setup.useRecoveryCode) {
          _push2(`<div class="form-group"${_scopeId}><div class="input-box"${_scopeId}><input${ssrRenderAttr("value", $setup.form.code)} type="text" class="style-large" inputmode="numeric" autocomplete="one-time-code"${ssrRenderAttr("placeholder", $setup.trans("Authentication Code"))}${ssrIncludeBooleanAttr($setup.form.processing) ? " disabled" : ""} required autofocus${_scopeId}></div>`);
          if ($setup.form.errors.code) {
            _push2(`<div class="field-error"${_scopeId}>${ssrInterpolate($setup.form.errors.code)}</div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div>`);
        } else {
          _push2(`<div class="form-group"${_scopeId}><div class="input-box"${_scopeId}><input${ssrRenderAttr("value", $setup.form.recovery_code)} type="text" class="style-large" autocomplete="one-time-code"${ssrRenderAttr("placeholder", $setup.trans("Recovery Code"))}${ssrIncludeBooleanAttr($setup.form.processing) ? " disabled" : ""} required autofocus${_scopeId}></div>`);
          if ($setup.form.errors.recovery_code) {
            _push2(`<div class="field-error"${_scopeId}>${ssrInterpolate($setup.form.errors.recovery_code)}</div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div>`);
        }
        _push2(`<div class="text-center mb-3"${_scopeId}><button type="button" class="btn-link"${ssrIncludeBooleanAttr($setup.form.processing) ? " disabled" : ""}${_scopeId}>${ssrInterpolate($setup.useRecoveryCode ? $setup.trans("Use an authentication code") : $setup.trans("Use a recovery code"))}</button></div><div class="auth-page__actions"${_scopeId}><button class="thm-btn" type="submit"${ssrIncludeBooleanAttr($setup.form.processing) ? " disabled" : ""}${_scopeId}><span${_scopeId}>${ssrInterpolate($setup.form.processing ? $setup.trans("Signing In...") : $setup.trans("Login"))}</span></button></div></form>`);
      } else {
        return [
          createVNode("form", {
            onSubmit: withModifiers($setup.submit, ["prevent"])
          }, [
            !$setup.useRecoveryCode ? (openBlock(), createBlock("div", {
              key: 0,
              class: "form-group"
            }, [
              createVNode("div", { class: "input-box" }, [
                withDirectives(createVNode("input", {
                  "onUpdate:modelValue": ($event) => $setup.form.code = $event,
                  type: "text",
                  class: "style-large",
                  inputmode: "numeric",
                  autocomplete: "one-time-code",
                  placeholder: $setup.trans("Authentication Code"),
                  disabled: $setup.form.processing,
                  required: "",
                  autofocus: ""
                }, null, 8, ["onUpdate:modelValue", "placeholder", "disabled"]), [
                  [vModelText, $setup.form.code]
                ])
              ]),
              $setup.form.errors.code ? (openBlock(), createBlock("div", {
                key: 0,
                class: "field-error"
              }, toDisplayString($setup.form.errors.code), 1)) : createCommentVNode("", true)
            ])) : (openBlock(), createBlock("div", {
              key: 1,
              class: "form-group"
            }, [
              createVNode("div", { class: "input-box" }, [
                withDirectives(createVNode("input", {
                  "onUpdate:modelValue": ($event) => $setup.form.recovery_code = $event,
                  type: "text",
                  class: "style-large",
                  autocomplete: "one-time-code",
                  placeholder: $setup.trans("Recovery Code"),
                  disabled: $setup.form.processing,
                  required: "",
                  autofocus: ""
                }, null, 8, ["onUpdate:modelValue", "placeholder", "disabled"]), [
                  [vModelText, $setup.form.recovery_code]
                ])
              ]),
              $setup.form.errors.recovery_code ? (openBlock(), createBlock("div", {
                key: 0,
                class: "field-error"
              }, toDisplayString($setup.form.errors.recovery_code), 1)) : createCommentVNode("", true)
            ])),
            createVNode("div", { class: "text-center mb-3" }, [
              createVNode("button", {
                type: "button",
                class: "btn-link",
                disabled: $setup.form.processing,
                onClick: $setup.toggleRecovery
              }, toDisplayString($setup.useRecoveryCode ? $setup.trans("Use an authentication code") : $setup.trans("Use a recovery code")), 9, ["disabled", "onClick"])
            ]),
            createVNode("div", { class: "auth-page__actions" }, [
              createVNode("button", {
                class: "thm-btn",
                type: "submit",
                disabled: $setup.form.processing
              }, [
                createVNode("span", null, toDisplayString($setup.form.processing ? $setup.trans("Signing In...") : $setup.trans("Login")), 1)
              ], 8, ["disabled"])
            ])
          ], 40, ["onSubmit"])
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<!--]-->`);
}
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("Modules/User/resources/assets/js/Pages/Auth/TwoFactorChallenge.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
const TwoFactorChallenge = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["ssrRender", _sfc_ssrRender]]);
const __vite_glob_0_26 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: TwoFactorChallenge
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$d = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    positions: { type: Object, required: true }
  },
  setup(__props) {
    const props = __props;
    const page = usePage();
    const trans = (key) => page.props.translations[key] || key;
    const seo = computed(() => page.props.seo || {});
    const settings = computed(() => page.props.settings || {});
    const locale = computed(() => page.props.locale || "en");
    const meta = computed(() => page.props.meta || {});
    const positions = computed(() => props.positions || { data: [] });
    const metaTitle = computed(() => meta.value.title || `${trans("Careers")} | ${seo.value.website_name || page.props.appName || ""}`.trim());
    const metaDescription = computed(() => meta.value.description || trans("Explore open roles and build your career with us.") || seo.value.website_desc || "");
    const metaKeywords = computed(() => meta.value.keywords || trans("careers, jobs, hiring, open positions") || seo.value.website_keywords || "");
    const metaImage = computed(() => {
      var _a, _b, _c, _d, _e;
      return ((_b = (_a = meta.value) == null ? void 0 : _a.og) == null ? void 0 : _b.image) || ((_d = (_c = meta.value) == null ? void 0 : _c.twitter) == null ? void 0 : _d.image) || ((_e = settings.value) == null ? void 0 : _e.meta_img) || "";
    });
    const metaCanonical = computed(() => meta.value.canonical || "");
    const metaRobots = computed(() => meta.value.robots || "index, follow");
    const formatDate = (value) => new Intl.DateTimeFormat(locale.value, {
      year: "numeric",
      month: "long",
      day: "numeric"
    }).format(/* @__PURE__ */ new Date(`${value}T00:00:00`));
    const formatEmploymentType = (value) => trans(
      String(value || "").replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
    );
    const stripPaginationLabel = (label) => String(label || "").replace(/&laquo;|&raquo;|<[^>]+>/g, "").trim();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), null, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<title data-v-f7515d23${_scopeId}>${ssrInterpolate(metaTitle.value)}</title><meta name="description"${ssrRenderAttr("content", metaDescription.value)} data-v-f7515d23${_scopeId}><meta name="keywords"${ssrRenderAttr("content", metaKeywords.value)} data-v-f7515d23${_scopeId}><meta name="robots"${ssrRenderAttr("content", metaRobots.value)} data-v-f7515d23${_scopeId}>`);
            if (metaCanonical.value) {
              _push2(`<link rel="canonical"${ssrRenderAttr("href", metaCanonical.value)} data-v-f7515d23${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<meta property="og:title"${ssrRenderAttr("content", metaTitle.value)} data-v-f7515d23${_scopeId}><meta property="og:description"${ssrRenderAttr("content", metaDescription.value)} data-v-f7515d23${_scopeId}>`);
            if (metaImage.value) {
              _push2(`<meta property="og:image"${ssrRenderAttr("content", metaImage.value)} data-v-f7515d23${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            if (metaCanonical.value) {
              _push2(`<meta property="og:url"${ssrRenderAttr("content", metaCanonical.value)} data-v-f7515d23${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<meta property="og:type" content="website" data-v-f7515d23${_scopeId}><meta name="twitter:card" content="summary_large_image" data-v-f7515d23${_scopeId}><meta name="twitter:title"${ssrRenderAttr("content", metaTitle.value)} data-v-f7515d23${_scopeId}><meta name="twitter:description"${ssrRenderAttr("content", metaDescription.value)} data-v-f7515d23${_scopeId}>`);
            if (metaImage.value) {
              _push2(`<meta name="twitter:image"${ssrRenderAttr("content", metaImage.value)} data-v-f7515d23${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("title", null, toDisplayString(metaTitle.value), 1),
              createVNode("meta", {
                name: "description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "keywords",
                content: metaKeywords.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "robots",
                content: metaRobots.value
              }, null, 8, ["content"]),
              metaCanonical.value ? (openBlock(), createBlock("link", {
                key: 0,
                rel: "canonical",
                href: metaCanonical.value
              }, null, 8, ["href"])) : createCommentVNode("", true),
              createVNode("meta", {
                property: "og:title",
                content: metaTitle.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              metaImage.value ? (openBlock(), createBlock("meta", {
                key: 1,
                property: "og:image",
                content: metaImage.value
              }, null, 8, ["content"])) : createCommentVNode("", true),
              metaCanonical.value ? (openBlock(), createBlock("meta", {
                key: 2,
                property: "og:url",
                content: metaCanonical.value
              }, null, 8, ["content"])) : createCommentVNode("", true),
              createVNode("meta", {
                property: "og:type",
                content: "website"
              }),
              createVNode("meta", {
                name: "twitter:card",
                content: "summary_large_image"
              }),
              createVNode("meta", {
                name: "twitter:title",
                content: metaTitle.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "twitter:description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              metaImage.value ? (openBlock(), createBlock("meta", {
                key: 3,
                name: "twitter:image",
                content: metaImage.value
              }, null, 8, ["content"])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$R, null, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$N, {
              title: trans("Careers")
            }, null, _parent2, _scopeId));
            _push2(`<section class="section-jobs flat-spacing-3" data-v-f7515d23${_scopeId}><div class="container" data-v-f7515d23${_scopeId}><div class="row" data-v-f7515d23${_scopeId}><div class="col-lg-10 mx-auto" data-v-f7515d23${_scopeId}><div class="sect-title wow fadeInUp text-center" data-v-f7515d23${_scopeId}><h2 class="s-title font-3 text-linear" data-v-f7515d23${_scopeId}>${ssrInterpolate(trans("Join Our Team"))}</h2><p class="s-sub_title" data-v-f7515d23${_scopeId}>${ssrInterpolate(trans("Explore current opportunities and help us build technology in perfect harmony."))}</p></div></div></div><div class="row" data-v-f7515d23${_scopeId}><div class="col-lg-10 col-xl-9 mx-auto" data-v-f7515d23${_scopeId}>`);
            if (positions.value.data.length) {
              _push2(`<div class="jobs-list px-16 px-xl-0" data-v-f7515d23${_scopeId}><!--[-->`);
              ssrRenderList(positions.value.data, (position) => {
                _push2(`<article class="jobs-list__item" data-v-f7515d23${_scopeId}><div class="jobs-list__body" data-v-f7515d23${_scopeId}><p class="text-caption font-2 text-main-5" data-v-f7515d23${_scopeId}>${ssrInterpolate(position.department)}</p><h3 class="jobs-list__title font-3 h5 text-main-2" data-v-f7515d23${_scopeId}>${ssrInterpolate(position.title)}</h3><ul class="jobs-list__meta text-body-3" data-v-f7515d23${_scopeId}><li data-v-f7515d23${_scopeId}><i class="icon icon-Tag" data-v-f7515d23${_scopeId}></i><span data-v-f7515d23${_scopeId}>${ssrInterpolate(position.location)}</span></li><li data-v-f7515d23${_scopeId}><i class="icon icon-User" data-v-f7515d23${_scopeId}></i><span data-v-f7515d23${_scopeId}>${ssrInterpolate(formatEmploymentType(position.employment_type))}</span></li><li data-v-f7515d23${_scopeId}><i class="icon icon-Clock" data-v-f7515d23${_scopeId}></i><span data-v-f7515d23${_scopeId}>${ssrInterpolate(trans("Posted"))}: ${ssrInterpolate(formatDate(position.posted_at))}</span></li></ul></div>`);
                _push2(ssrRenderComponent(unref(Link), {
                  href: _ctx.route("jobs.show", position.slug),
                  class: "tf-btn text-body-3 animate-btn"
                }, {
                  default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(trans("View & Apply"))}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(trans("View & Apply")), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`</article>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<div class="text-center py-5 px-16" data-v-f7515d23${_scopeId}><h3 class="s-title font-3 h4" data-v-f7515d23${_scopeId}>${ssrInterpolate(trans("No open positions"))}</h3><p class="s-sub_title" data-v-f7515d23${_scopeId}>${ssrInterpolate(trans("There are no open positions at the moment. Please check back soon."))}</p></div>`);
            }
            if (positions.value.last_page > 1) {
              _push2(`<div class="pagination-list jobs-list__pagination px-16 px-xl-0" data-v-f7515d23${_scopeId}>`);
              if (positions.value.prev_page_url) {
                _push2(ssrRenderComponent(unref(Link), {
                  href: positions.value.prev_page_url,
                  class: "pagination-item pagination-item--prev",
                  "aria-label": "Previous"
                }, {
                  default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<span class="icon icon-CaretDoubleRight fs-20" data-v-f7515d23${_scopeId2}></span>`);
                    } else {
                      return [
                        createVNode("span", { class: "icon icon-CaretDoubleRight fs-20" })
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`<!--[-->`);
              ssrRenderList(positions.value.links, (link, linkIndex) => {
                _push2(`<!--[-->`);
                if (link.url && linkIndex > 0 && linkIndex < positions.value.links.length - 1) {
                  _push2(ssrRenderComponent(unref(Link), {
                    href: link.url,
                    class: ["pagination-item", { active: link.active }]
                  }, {
                    default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`<span data-v-f7515d23${_scopeId2}>${ssrInterpolate(stripPaginationLabel(link.label))}</span>`);
                      } else {
                        return [
                          createVNode("span", null, toDisplayString(stripPaginationLabel(link.label)), 1)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<!--]-->`);
              });
              _push2(`<!--]-->`);
              if (positions.value.next_page_url) {
                _push2(ssrRenderComponent(unref(Link), {
                  href: positions.value.next_page_url,
                  class: "pagination-item",
                  "aria-label": "Next"
                }, {
                  default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<span class="icon icon-CaretDoubleRight fs-20" data-v-f7515d23${_scopeId2}></span>`);
                    } else {
                      return [
                        createVNode("span", { class: "icon icon-CaretDoubleRight fs-20" })
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div></div></section>`);
            _push2(ssrRenderComponent(_sfc_main$J, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$N, {
                title: trans("Careers")
              }, null, 8, ["title"]),
              createVNode("section", { class: "section-jobs flat-spacing-3" }, [
                createVNode("div", { class: "container" }, [
                  createVNode("div", { class: "row" }, [
                    createVNode("div", { class: "col-lg-10 mx-auto" }, [
                      createVNode("div", { class: "sect-title wow fadeInUp text-center" }, [
                        createVNode("h2", { class: "s-title font-3 text-linear" }, toDisplayString(trans("Join Our Team")), 1),
                        createVNode("p", { class: "s-sub_title" }, toDisplayString(trans("Explore current opportunities and help us build technology in perfect harmony.")), 1)
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "row" }, [
                    createVNode("div", { class: "col-lg-10 col-xl-9 mx-auto" }, [
                      positions.value.data.length ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "jobs-list px-16 px-xl-0"
                      }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(positions.value.data, (position) => {
                          return openBlock(), createBlock("article", {
                            key: position.id,
                            class: "jobs-list__item"
                          }, [
                            createVNode("div", { class: "jobs-list__body" }, [
                              createVNode("p", { class: "text-caption font-2 text-main-5" }, toDisplayString(position.department), 1),
                              createVNode("h3", { class: "jobs-list__title font-3 h5 text-main-2" }, toDisplayString(position.title), 1),
                              createVNode("ul", { class: "jobs-list__meta text-body-3" }, [
                                createVNode("li", null, [
                                  createVNode("i", { class: "icon icon-Tag" }),
                                  createVNode("span", null, toDisplayString(position.location), 1)
                                ]),
                                createVNode("li", null, [
                                  createVNode("i", { class: "icon icon-User" }),
                                  createVNode("span", null, toDisplayString(formatEmploymentType(position.employment_type)), 1)
                                ]),
                                createVNode("li", null, [
                                  createVNode("i", { class: "icon icon-Clock" }),
                                  createVNode("span", null, toDisplayString(trans("Posted")) + ": " + toDisplayString(formatDate(position.posted_at)), 1)
                                ])
                              ])
                            ]),
                            createVNode(unref(Link), {
                              href: _ctx.route("jobs.show", position.slug),
                              class: "tf-btn text-body-3 animate-btn"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(trans("View & Apply")), 1)
                              ]),
                              _: 1
                            }, 8, ["href"])
                          ]);
                        }), 128))
                      ])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "text-center py-5 px-16"
                      }, [
                        createVNode("h3", { class: "s-title font-3 h4" }, toDisplayString(trans("No open positions")), 1),
                        createVNode("p", { class: "s-sub_title" }, toDisplayString(trans("There are no open positions at the moment. Please check back soon.")), 1)
                      ])),
                      positions.value.last_page > 1 ? (openBlock(), createBlock("div", {
                        key: 2,
                        class: "pagination-list jobs-list__pagination px-16 px-xl-0"
                      }, [
                        positions.value.prev_page_url ? (openBlock(), createBlock(unref(Link), {
                          key: 0,
                          href: positions.value.prev_page_url,
                          class: "pagination-item pagination-item--prev",
                          "aria-label": "Previous"
                        }, {
                          default: withCtx(() => [
                            createVNode("span", { class: "icon icon-CaretDoubleRight fs-20" })
                          ]),
                          _: 1
                        }, 8, ["href"])) : createCommentVNode("", true),
                        (openBlock(true), createBlock(Fragment, null, renderList(positions.value.links, (link, linkIndex) => {
                          return openBlock(), createBlock(Fragment, { key: linkIndex }, [
                            link.url && linkIndex > 0 && linkIndex < positions.value.links.length - 1 ? (openBlock(), createBlock(unref(Link), {
                              key: 0,
                              href: link.url,
                              class: ["pagination-item", { active: link.active }]
                            }, {
                              default: withCtx(() => [
                                createVNode("span", null, toDisplayString(stripPaginationLabel(link.label)), 1)
                              ]),
                              _: 2
                            }, 1032, ["href", "class"])) : createCommentVNode("", true)
                          ], 64);
                        }), 128)),
                        positions.value.next_page_url ? (openBlock(), createBlock(unref(Link), {
                          key: 1,
                          href: positions.value.next_page_url,
                          class: "pagination-item",
                          "aria-label": "Next"
                        }, {
                          default: withCtx(() => [
                            createVNode("span", { class: "icon icon-CaretDoubleRight fs-20" })
                          ]),
                          _: 1
                        }, 8, ["href"])) : createCommentVNode("", true)
                      ])) : createCommentVNode("", true)
                    ])
                  ])
                ])
              ]),
              createVNode(_sfc_main$J)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("Modules/User/resources/assets/js/Pages/Jobs/Index.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const Index = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["__scopeId", "data-v-f7515d23"]]);
const __vite_glob_0_27 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$c = {
  __name: "Show",
  __ssrInlineRender: true,
  props: {
    position: { type: Object, required: true }
  },
  setup(__props) {
    const props = __props;
    const page = usePage();
    const trans = (key) => page.props.translations[key] || key;
    const seo = computed(() => page.props.seo || {});
    const settings = computed(() => page.props.settings || {});
    const locale = computed(() => page.props.locale || "en");
    const meta = computed(() => page.props.meta || {});
    const success = ref(false);
    const flashSuccess = computed(() => {
      var _a;
      return ((_a = page.props.flash) == null ? void 0 : _a.success) || "";
    });
    const metaTitle = computed(() => meta.value.title || `${props.position.title} | ${seo.value.website_name || page.props.appName || ""}`.trim());
    const metaDescription = computed(() => meta.value.description || trans("Apply for an open role and join our team.") || seo.value.website_desc || "");
    const metaKeywords = computed(() => meta.value.keywords || `${props.position.title}, ${props.position.department}, careers` || seo.value.website_keywords || "");
    const metaImage = computed(() => {
      var _a, _b, _c, _d, _e;
      return ((_b = (_a = meta.value) == null ? void 0 : _a.og) == null ? void 0 : _b.image) || ((_d = (_c = meta.value) == null ? void 0 : _c.twitter) == null ? void 0 : _d.image) || ((_e = settings.value) == null ? void 0 : _e.meta_img) || "";
    });
    const metaCanonical = computed(() => meta.value.canonical || "");
    const metaRobots = computed(() => meta.value.robots || "index, follow");
    const form = useForm({
      full_name: "",
      email: "",
      phone: "",
      expected_salary: "",
      motivation: "",
      cover_letter: "",
      resume: null
    });
    const formatDate = (value) => new Intl.DateTimeFormat(locale.value, {
      year: "numeric",
      month: "long",
      day: "numeric"
    }).format(/* @__PURE__ */ new Date(`${value}T00:00:00`));
    const formatEmploymentType = (value) => trans(
      String(value || "").replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
    );
    const submit = () => {
      form.post(route("jobs.apply", props.position.slug), {
        forceFormData: true,
        preserveScroll: true,
        onSuccess: () => {
          success.value = true;
          form.reset();
          form.clearErrors();
        },
        onError: () => {
          success.value = false;
        }
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), null, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<title data-v-4f47820d${_scopeId}>${ssrInterpolate(metaTitle.value)}</title><meta name="description"${ssrRenderAttr("content", metaDescription.value)} data-v-4f47820d${_scopeId}><meta name="keywords"${ssrRenderAttr("content", metaKeywords.value)} data-v-4f47820d${_scopeId}><meta name="robots"${ssrRenderAttr("content", metaRobots.value)} data-v-4f47820d${_scopeId}>`);
            if (metaCanonical.value) {
              _push2(`<link rel="canonical"${ssrRenderAttr("href", metaCanonical.value)} data-v-4f47820d${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<meta property="og:title"${ssrRenderAttr("content", metaTitle.value)} data-v-4f47820d${_scopeId}><meta property="og:description"${ssrRenderAttr("content", metaDescription.value)} data-v-4f47820d${_scopeId}>`);
            if (metaImage.value) {
              _push2(`<meta property="og:image"${ssrRenderAttr("content", metaImage.value)} data-v-4f47820d${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            if (metaCanonical.value) {
              _push2(`<meta property="og:url"${ssrRenderAttr("content", metaCanonical.value)} data-v-4f47820d${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<meta property="og:type" content="website" data-v-4f47820d${_scopeId}><meta name="twitter:card" content="summary_large_image" data-v-4f47820d${_scopeId}><meta name="twitter:title"${ssrRenderAttr("content", metaTitle.value)} data-v-4f47820d${_scopeId}><meta name="twitter:description"${ssrRenderAttr("content", metaDescription.value)} data-v-4f47820d${_scopeId}>`);
            if (metaImage.value) {
              _push2(`<meta name="twitter:image"${ssrRenderAttr("content", metaImage.value)} data-v-4f47820d${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("title", null, toDisplayString(metaTitle.value), 1),
              createVNode("meta", {
                name: "description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "keywords",
                content: metaKeywords.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "robots",
                content: metaRobots.value
              }, null, 8, ["content"]),
              metaCanonical.value ? (openBlock(), createBlock("link", {
                key: 0,
                rel: "canonical",
                href: metaCanonical.value
              }, null, 8, ["href"])) : createCommentVNode("", true),
              createVNode("meta", {
                property: "og:title",
                content: metaTitle.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              metaImage.value ? (openBlock(), createBlock("meta", {
                key: 1,
                property: "og:image",
                content: metaImage.value
              }, null, 8, ["content"])) : createCommentVNode("", true),
              metaCanonical.value ? (openBlock(), createBlock("meta", {
                key: 2,
                property: "og:url",
                content: metaCanonical.value
              }, null, 8, ["content"])) : createCommentVNode("", true),
              createVNode("meta", {
                property: "og:type",
                content: "website"
              }),
              createVNode("meta", {
                name: "twitter:card",
                content: "summary_large_image"
              }),
              createVNode("meta", {
                name: "twitter:title",
                content: metaTitle.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "twitter:description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              metaImage.value ? (openBlock(), createBlock("meta", {
                key: 3,
                name: "twitter:image",
                content: metaImage.value
              }, null, 8, ["content"])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$R, null, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$N, {
              title: __props.position.title,
              crumbs: [
                { label: trans("Careers"), href: _ctx.route("jobs.index") },
                { label: __props.position.title }
              ]
            }, null, _parent2, _scopeId));
            _push2(`<section class="section-job-detail flat-spacing-3" data-v-4f47820d${_scopeId}><div class="container" data-v-4f47820d${_scopeId}><div class="row" data-v-4f47820d${_scopeId}><div class="col-lg-10 mx-auto" data-v-4f47820d${_scopeId}><h2 class="s-title only-title font-3 text-linear px-16 px-xl-0" data-v-4f47820d${_scopeId}>${ssrInterpolate(__props.position.title)}</h2></div></div><div class="row" data-v-4f47820d${_scopeId}><div class="col-lg-4 offset-lg-1" data-v-4f47820d${_scopeId}><ul class="info-us-list px-16 px-lg-0 mb-lg-0" data-v-4f47820d${_scopeId}><li data-v-4f47820d${_scopeId}><p class="title-sub text-body-3" data-v-4f47820d${_scopeId}>${ssrInterpolate(trans("Department"))}</p><span class="h5 fw-medium text-white font-3" data-v-4f47820d${_scopeId}>${ssrInterpolate(__props.position.department)}</span></li><li class="br-line has-dot" data-v-4f47820d${_scopeId}></li><li data-v-4f47820d${_scopeId}><p class="title-sub text-body-3" data-v-4f47820d${_scopeId}>${ssrInterpolate(trans("Location"))}</p><span class="h5 fw-medium text-white font-3" data-v-4f47820d${_scopeId}>${ssrInterpolate(__props.position.location)}</span></li><li class="br-line has-dot" data-v-4f47820d${_scopeId}></li><li data-v-4f47820d${_scopeId}><p class="title-sub text-body-3" data-v-4f47820d${_scopeId}>${ssrInterpolate(trans("Employment Type"))}</p><span class="h5 fw-medium text-white font-3" data-v-4f47820d${_scopeId}>${ssrInterpolate(formatEmploymentType(__props.position.employment_type))}</span></li><li class="br-line has-dot" data-v-4f47820d${_scopeId}></li><li data-v-4f47820d${_scopeId}><p class="title-sub text-body-3" data-v-4f47820d${_scopeId}>${ssrInterpolate(trans("Posted"))}</p><span class="h5 fw-medium text-white font-3" data-v-4f47820d${_scopeId}>${ssrInterpolate(formatDate(__props.position.posted_at))}</span></li></ul><div class="job-detail__content px-16 px-lg-0" data-v-4f47820d${_scopeId}><h3 class="font-3 h5 text-linear mb-3" data-v-4f47820d${_scopeId}>${ssrInterpolate(trans("About the role"))}</h3><div class="job-rich-content text-main-2" data-v-4f47820d${_scopeId}>${__props.position.description ?? ""}</div>`);
            if (__props.position.requirements) {
              _push2(`<!--[--><div class="br-line has-dot my-4" data-v-4f47820d${_scopeId}></div><h3 class="font-3 h5 text-linear mb-3" data-v-4f47820d${_scopeId}>${ssrInterpolate(trans("Requirements"))}</h3><div class="job-rich-content text-main-2" data-v-4f47820d${_scopeId}>${__props.position.requirements ?? ""}</div><!--]-->`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><div class="col-lg-7" data-v-4f47820d${_scopeId}><form class="form-get_in px-16 px-xl-0" data-v-4f47820d${_scopeId}><h3 class="font-3 h5 text-linear mb-4" data-v-4f47820d${_scopeId}>${ssrInterpolate(trans("Apply for this role"))}</h3>`);
            if (success.value || flashSuccess.value) {
              _push2(`<div class="alert alert-success mb-4" data-v-4f47820d${_scopeId}>${ssrInterpolate(flashSuccess.value || trans("Your application has been submitted successfully."))}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="form-content-2" data-v-4f47820d${_scopeId}><div class="tf-grid-layout sm-col-2" data-v-4f47820d${_scopeId}><fieldset data-v-4f47820d${_scopeId}><label class="label-text text-body-3 text-white" for="full_name" data-v-4f47820d${_scopeId}>${ssrInterpolate(trans("Full Name"))} <span class="required-mark" data-v-4f47820d${_scopeId}>*</span></label><input id="full_name"${ssrRenderAttr("value", unref(form).full_name)} type="text"${ssrRenderAttr("placeholder", trans("Full Name"))} class="${ssrRenderClass({ error: unref(form).errors.full_name })}"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} required data-v-4f47820d${_scopeId}>`);
            if (unref(form).errors.full_name) {
              _push2(`<div class="text-danger mt-1 small" data-v-4f47820d${_scopeId}>${ssrInterpolate(unref(form).errors.full_name)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</fieldset><fieldset data-v-4f47820d${_scopeId}><label class="label-text text-body-3 text-white" for="email" data-v-4f47820d${_scopeId}>${ssrInterpolate(trans("Email"))} <span class="required-mark" data-v-4f47820d${_scopeId}>*</span></label><input id="email"${ssrRenderAttr("value", unref(form).email)} type="email"${ssrRenderAttr("placeholder", trans("Email"))} class="${ssrRenderClass({ error: unref(form).errors.email })}"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} required data-v-4f47820d${_scopeId}>`);
            if (unref(form).errors.email) {
              _push2(`<div class="text-danger mt-1 small" data-v-4f47820d${_scopeId}>${ssrInterpolate(unref(form).errors.email)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</fieldset></div><div class="tf-grid-layout sm-col-2" data-v-4f47820d${_scopeId}><fieldset data-v-4f47820d${_scopeId}><label class="label-text text-body-3 text-white" for="phone" data-v-4f47820d${_scopeId}>${ssrInterpolate(trans("Phone"))} <span class="required-mark" data-v-4f47820d${_scopeId}>*</span></label><input id="phone"${ssrRenderAttr("value", unref(form).phone)} type="tel"${ssrRenderAttr("placeholder", trans("Phone"))} class="${ssrRenderClass({ error: unref(form).errors.phone })}"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} required data-v-4f47820d${_scopeId}>`);
            if (unref(form).errors.phone) {
              _push2(`<div class="text-danger mt-1 small" data-v-4f47820d${_scopeId}>${ssrInterpolate(unref(form).errors.phone)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</fieldset><fieldset data-v-4f47820d${_scopeId}><label class="label-text text-body-3 text-white" for="expected_salary" data-v-4f47820d${_scopeId}>${ssrInterpolate(trans("Expected Salary"))}</label><input id="expected_salary"${ssrRenderAttr("value", unref(form).expected_salary)} type="number" min="0" step="0.01"${ssrRenderAttr("placeholder", `${trans("Expected Salary")} (USD)`)} class="${ssrRenderClass({ error: unref(form).errors.expected_salary })}"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} data-v-4f47820d${_scopeId}>`);
            if (unref(form).errors.expected_salary) {
              _push2(`<div class="text-danger mt-1 small" data-v-4f47820d${_scopeId}>${ssrInterpolate(unref(form).errors.expected_salary)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</fieldset></div><fieldset class="d-grid" data-v-4f47820d${_scopeId}><label class="label-text text-body-3 text-white" for="motivation" data-v-4f47820d${_scopeId}>${ssrInterpolate(trans("Why do you want to work with us?"))} <span class="required-mark" data-v-4f47820d${_scopeId}>*</span></label><textarea id="motivation" rows="4"${ssrRenderAttr("placeholder", trans("Why do you want to work with us?"))} class="${ssrRenderClass({ error: unref(form).errors.motivation })}"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} required data-v-4f47820d${_scopeId}>${ssrInterpolate(unref(form).motivation)}</textarea>`);
            if (unref(form).errors.motivation) {
              _push2(`<div class="text-danger mt-1 small" data-v-4f47820d${_scopeId}>${ssrInterpolate(unref(form).errors.motivation)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</fieldset><fieldset class="d-grid" data-v-4f47820d${_scopeId}><label class="label-text text-body-3 text-white" for="cover_letter" data-v-4f47820d${_scopeId}>${ssrInterpolate(trans("Cover Letter"))}</label><textarea id="cover_letter" rows="5"${ssrRenderAttr("placeholder", trans("Cover Letter"))} class="${ssrRenderClass({ error: unref(form).errors.cover_letter })}"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} data-v-4f47820d${_scopeId}>${ssrInterpolate(unref(form).cover_letter)}</textarea>`);
            if (unref(form).errors.cover_letter) {
              _push2(`<div class="text-danger mt-1 small" data-v-4f47820d${_scopeId}>${ssrInterpolate(unref(form).errors.cover_letter)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</fieldset><fieldset class="d-grid" data-v-4f47820d${_scopeId}><label class="label-text text-body-3 text-white" for="resume" data-v-4f47820d${_scopeId}>${ssrInterpolate(trans("Resume / CV"))} <span class="required-mark" data-v-4f47820d${_scopeId}>*</span></label><input id="resume" type="file" accept=".pdf,.doc,.docx" class="${ssrRenderClass({ error: unref(form).errors.resume })}"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} required data-v-4f47820d${_scopeId}><p class="text-body-3 text-main-2 mt-2 mb-0" data-v-4f47820d${_scopeId}>${ssrInterpolate(trans("Accepted file types: PDF, DOC, DOCX. Maximum size: 5 MB."))}</p>`);
            if (unref(form).errors.resume) {
              _push2(`<div class="text-danger mt-1 small" data-v-4f47820d${_scopeId}>${ssrInterpolate(unref(form).errors.resume)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</fieldset></div><button type="submit" class="tf-btn text-body-3 style-2 animate-btn animate-dark style-high"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} data-v-4f47820d${_scopeId}>${ssrInterpolate(unref(form).processing ? trans("Submitting...") : trans("Submit Application"))}</button></form></div></div></div></section>`);
            _push2(ssrRenderComponent(_sfc_main$J, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$N, {
                title: __props.position.title,
                crumbs: [
                  { label: trans("Careers"), href: _ctx.route("jobs.index") },
                  { label: __props.position.title }
                ]
              }, null, 8, ["title", "crumbs"]),
              createVNode("section", { class: "section-job-detail flat-spacing-3" }, [
                createVNode("div", { class: "container" }, [
                  createVNode("div", { class: "row" }, [
                    createVNode("div", { class: "col-lg-10 mx-auto" }, [
                      createVNode("h2", { class: "s-title only-title font-3 text-linear px-16 px-xl-0" }, toDisplayString(__props.position.title), 1)
                    ])
                  ]),
                  createVNode("div", { class: "row" }, [
                    createVNode("div", { class: "col-lg-4 offset-lg-1" }, [
                      createVNode("ul", { class: "info-us-list px-16 px-lg-0 mb-lg-0" }, [
                        createVNode("li", null, [
                          createVNode("p", { class: "title-sub text-body-3" }, toDisplayString(trans("Department")), 1),
                          createVNode("span", { class: "h5 fw-medium text-white font-3" }, toDisplayString(__props.position.department), 1)
                        ]),
                        createVNode("li", { class: "br-line has-dot" }),
                        createVNode("li", null, [
                          createVNode("p", { class: "title-sub text-body-3" }, toDisplayString(trans("Location")), 1),
                          createVNode("span", { class: "h5 fw-medium text-white font-3" }, toDisplayString(__props.position.location), 1)
                        ]),
                        createVNode("li", { class: "br-line has-dot" }),
                        createVNode("li", null, [
                          createVNode("p", { class: "title-sub text-body-3" }, toDisplayString(trans("Employment Type")), 1),
                          createVNode("span", { class: "h5 fw-medium text-white font-3" }, toDisplayString(formatEmploymentType(__props.position.employment_type)), 1)
                        ]),
                        createVNode("li", { class: "br-line has-dot" }),
                        createVNode("li", null, [
                          createVNode("p", { class: "title-sub text-body-3" }, toDisplayString(trans("Posted")), 1),
                          createVNode("span", { class: "h5 fw-medium text-white font-3" }, toDisplayString(formatDate(__props.position.posted_at)), 1)
                        ])
                      ]),
                      createVNode("div", { class: "job-detail__content px-16 px-lg-0" }, [
                        createVNode("h3", { class: "font-3 h5 text-linear mb-3" }, toDisplayString(trans("About the role")), 1),
                        createVNode("div", {
                          class: "job-rich-content text-main-2",
                          innerHTML: __props.position.description
                        }, null, 8, ["innerHTML"]),
                        __props.position.requirements ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                          createVNode("div", { class: "br-line has-dot my-4" }),
                          createVNode("h3", { class: "font-3 h5 text-linear mb-3" }, toDisplayString(trans("Requirements")), 1),
                          createVNode("div", {
                            class: "job-rich-content text-main-2",
                            innerHTML: __props.position.requirements
                          }, null, 8, ["innerHTML"])
                        ], 64)) : createCommentVNode("", true)
                      ])
                    ]),
                    createVNode("div", { class: "col-lg-7" }, [
                      createVNode("form", {
                        class: "form-get_in px-16 px-xl-0",
                        onSubmit: withModifiers(submit, ["prevent"])
                      }, [
                        createVNode("h3", { class: "font-3 h5 text-linear mb-4" }, toDisplayString(trans("Apply for this role")), 1),
                        success.value || flashSuccess.value ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "alert alert-success mb-4"
                        }, toDisplayString(flashSuccess.value || trans("Your application has been submitted successfully.")), 1)) : createCommentVNode("", true),
                        createVNode("div", { class: "form-content-2" }, [
                          createVNode("div", { class: "tf-grid-layout sm-col-2" }, [
                            createVNode("fieldset", null, [
                              createVNode("label", {
                                class: "label-text text-body-3 text-white",
                                for: "full_name"
                              }, [
                                createTextVNode(toDisplayString(trans("Full Name")) + " ", 1),
                                createVNode("span", { class: "required-mark" }, "*")
                              ]),
                              withDirectives(createVNode("input", {
                                id: "full_name",
                                "onUpdate:modelValue": ($event) => unref(form).full_name = $event,
                                type: "text",
                                placeholder: trans("Full Name"),
                                class: { error: unref(form).errors.full_name },
                                disabled: unref(form).processing,
                                required: ""
                              }, null, 10, ["onUpdate:modelValue", "placeholder", "disabled"]), [
                                [vModelText, unref(form).full_name]
                              ]),
                              unref(form).errors.full_name ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "text-danger mt-1 small"
                              }, toDisplayString(unref(form).errors.full_name), 1)) : createCommentVNode("", true)
                            ]),
                            createVNode("fieldset", null, [
                              createVNode("label", {
                                class: "label-text text-body-3 text-white",
                                for: "email"
                              }, [
                                createTextVNode(toDisplayString(trans("Email")) + " ", 1),
                                createVNode("span", { class: "required-mark" }, "*")
                              ]),
                              withDirectives(createVNode("input", {
                                id: "email",
                                "onUpdate:modelValue": ($event) => unref(form).email = $event,
                                type: "email",
                                placeholder: trans("Email"),
                                class: { error: unref(form).errors.email },
                                disabled: unref(form).processing,
                                required: ""
                              }, null, 10, ["onUpdate:modelValue", "placeholder", "disabled"]), [
                                [vModelText, unref(form).email]
                              ]),
                              unref(form).errors.email ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "text-danger mt-1 small"
                              }, toDisplayString(unref(form).errors.email), 1)) : createCommentVNode("", true)
                            ])
                          ]),
                          createVNode("div", { class: "tf-grid-layout sm-col-2" }, [
                            createVNode("fieldset", null, [
                              createVNode("label", {
                                class: "label-text text-body-3 text-white",
                                for: "phone"
                              }, [
                                createTextVNode(toDisplayString(trans("Phone")) + " ", 1),
                                createVNode("span", { class: "required-mark" }, "*")
                              ]),
                              withDirectives(createVNode("input", {
                                id: "phone",
                                "onUpdate:modelValue": ($event) => unref(form).phone = $event,
                                type: "tel",
                                placeholder: trans("Phone"),
                                class: { error: unref(form).errors.phone },
                                disabled: unref(form).processing,
                                required: ""
                              }, null, 10, ["onUpdate:modelValue", "placeholder", "disabled"]), [
                                [vModelText, unref(form).phone]
                              ]),
                              unref(form).errors.phone ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "text-danger mt-1 small"
                              }, toDisplayString(unref(form).errors.phone), 1)) : createCommentVNode("", true)
                            ]),
                            createVNode("fieldset", null, [
                              createVNode("label", {
                                class: "label-text text-body-3 text-white",
                                for: "expected_salary"
                              }, toDisplayString(trans("Expected Salary")), 1),
                              withDirectives(createVNode("input", {
                                id: "expected_salary",
                                "onUpdate:modelValue": ($event) => unref(form).expected_salary = $event,
                                type: "number",
                                min: "0",
                                step: "0.01",
                                placeholder: `${trans("Expected Salary")} (USD)`,
                                class: { error: unref(form).errors.expected_salary },
                                disabled: unref(form).processing
                              }, null, 10, ["onUpdate:modelValue", "placeholder", "disabled"]), [
                                [vModelText, unref(form).expected_salary]
                              ]),
                              unref(form).errors.expected_salary ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "text-danger mt-1 small"
                              }, toDisplayString(unref(form).errors.expected_salary), 1)) : createCommentVNode("", true)
                            ])
                          ]),
                          createVNode("fieldset", { class: "d-grid" }, [
                            createVNode("label", {
                              class: "label-text text-body-3 text-white",
                              for: "motivation"
                            }, [
                              createTextVNode(toDisplayString(trans("Why do you want to work with us?")) + " ", 1),
                              createVNode("span", { class: "required-mark" }, "*")
                            ]),
                            withDirectives(createVNode("textarea", {
                              id: "motivation",
                              "onUpdate:modelValue": ($event) => unref(form).motivation = $event,
                              rows: "4",
                              placeholder: trans("Why do you want to work with us?"),
                              class: { error: unref(form).errors.motivation },
                              disabled: unref(form).processing,
                              required: ""
                            }, null, 10, ["onUpdate:modelValue", "placeholder", "disabled"]), [
                              [vModelText, unref(form).motivation]
                            ]),
                            unref(form).errors.motivation ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "text-danger mt-1 small"
                            }, toDisplayString(unref(form).errors.motivation), 1)) : createCommentVNode("", true)
                          ]),
                          createVNode("fieldset", { class: "d-grid" }, [
                            createVNode("label", {
                              class: "label-text text-body-3 text-white",
                              for: "cover_letter"
                            }, toDisplayString(trans("Cover Letter")), 1),
                            withDirectives(createVNode("textarea", {
                              id: "cover_letter",
                              "onUpdate:modelValue": ($event) => unref(form).cover_letter = $event,
                              rows: "5",
                              placeholder: trans("Cover Letter"),
                              class: { error: unref(form).errors.cover_letter },
                              disabled: unref(form).processing
                            }, null, 10, ["onUpdate:modelValue", "placeholder", "disabled"]), [
                              [vModelText, unref(form).cover_letter]
                            ]),
                            unref(form).errors.cover_letter ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "text-danger mt-1 small"
                            }, toDisplayString(unref(form).errors.cover_letter), 1)) : createCommentVNode("", true)
                          ]),
                          createVNode("fieldset", { class: "d-grid" }, [
                            createVNode("label", {
                              class: "label-text text-body-3 text-white",
                              for: "resume"
                            }, [
                              createTextVNode(toDisplayString(trans("Resume / CV")) + " ", 1),
                              createVNode("span", { class: "required-mark" }, "*")
                            ]),
                            createVNode("input", {
                              id: "resume",
                              type: "file",
                              accept: ".pdf,.doc,.docx",
                              class: { error: unref(form).errors.resume },
                              disabled: unref(form).processing,
                              required: "",
                              onChange: ($event) => unref(form).resume = $event.target.files[0]
                            }, null, 42, ["disabled", "onChange"]),
                            createVNode("p", { class: "text-body-3 text-main-2 mt-2 mb-0" }, toDisplayString(trans("Accepted file types: PDF, DOC, DOCX. Maximum size: 5 MB.")), 1),
                            unref(form).errors.resume ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "text-danger mt-1 small"
                            }, toDisplayString(unref(form).errors.resume), 1)) : createCommentVNode("", true)
                          ])
                        ]),
                        createVNode("button", {
                          type: "submit",
                          class: "tf-btn text-body-3 style-2 animate-btn animate-dark style-high",
                          disabled: unref(form).processing
                        }, toDisplayString(unref(form).processing ? trans("Submitting...") : trans("Submit Application")), 9, ["disabled"])
                      ], 32)
                    ])
                  ])
                ])
              ]),
              createVNode(_sfc_main$J)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("Modules/User/resources/assets/js/Pages/Jobs/Show.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const Show = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["__scopeId", "data-v-4f47820d"]]);
const __vite_glob_0_28 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Show
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$b = {
  __name: "ConfirmPassword",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const { t: t3 } = usePortalTranslations();
    const seo = computed(() => page.props.seo || {});
    const metaTitle = computed(() => `${t3("profile.confirm_password_title")} | ${seo.value.website_name || ""}`.trim());
    const metaDescription = computed(() => t3("profile.confirm_password_description"));
    const form = useForm({
      password: ""
    });
    const submit = () => {
      form.post(route("password.confirm.store"), {
        preserveScroll: true
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$w, mergeProps({
        title: unref(t3)("profile.confirm_password_title"),
        subtitle: unref(t3)("profile.confirm_password_description"),
        active: "profile",
        breadcrumbs: [
          { label: unref(t3)("menu.profile"), href: _ctx.route("portal.profile.index") },
          { label: unref(t3)("profile.confirm_password_title") }
        ],
        "meta-title": metaTitle.value,
        "meta-description": metaDescription.value
      }, _attrs), {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="portal-panel portal-panel--narrow"${_scopeId}><div class="portal-panel__body"${_scopeId}><form class="portal-profile-form"${_scopeId}><div class="portal-form-group"${_scopeId}><label for="password"${_scopeId}>${ssrInterpolate(unref(t3)("profile.current_password"))} *</label><input id="password"${ssrRenderAttr("value", unref(form).password)} type="password" class="${ssrRenderClass([{ "portal-input--error": unref(form).errors.password }, "portal-input"])}" required autofocus autocomplete="current-password"${_scopeId}>`);
            if (unref(form).errors.password) {
              _push2(`<p class="portal-form-error"${_scopeId}>${ssrInterpolate(unref(form).errors.password)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="portal-profile-form__actions"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("portal.profile.index"),
              class: "portal-panel__action"
            }, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(t3)("profile.back_to_profile"))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(t3)("profile.back_to_profile")), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<button type="submit" class="thm-btn"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""}${_scopeId}>${ssrInterpolate(unref(t3)("profile.confirm_password_button"))}</button></div></form></div></div>`);
          } else {
            return [
              createVNode("div", { class: "portal-panel portal-panel--narrow" }, [
                createVNode("div", { class: "portal-panel__body" }, [
                  createVNode("form", {
                    class: "portal-profile-form",
                    onSubmit: withModifiers(submit, ["prevent"])
                  }, [
                    createVNode("div", { class: "portal-form-group" }, [
                      createVNode("label", { for: "password" }, toDisplayString(unref(t3)("profile.current_password")) + " *", 1),
                      withDirectives(createVNode("input", {
                        id: "password",
                        "onUpdate:modelValue": ($event) => unref(form).password = $event,
                        type: "password",
                        class: ["portal-input", { "portal-input--error": unref(form).errors.password }],
                        required: "",
                        autofocus: "",
                        autocomplete: "current-password"
                      }, null, 10, ["onUpdate:modelValue"]), [
                        [vModelText, unref(form).password]
                      ]),
                      unref(form).errors.password ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "portal-form-error"
                      }, toDisplayString(unref(form).errors.password), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "portal-profile-form__actions" }, [
                      createVNode(unref(Link), {
                        href: _ctx.route("portal.profile.index"),
                        class: "portal-panel__action"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(unref(t3)("profile.back_to_profile")), 1)
                        ]),
                        _: 1
                      }, 8, ["href"]),
                      createVNode("button", {
                        type: "submit",
                        class: "thm-btn",
                        disabled: unref(form).processing
                      }, toDisplayString(unref(t3)("profile.confirm_password_button")), 9, ["disabled"])
                    ])
                  ], 32)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("Modules/User/resources/assets/js/Pages/Portal/ConfirmPassword.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const __vite_glob_0_29 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$b
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$a = {
  __name: "Dashboard",
  __ssrInlineRender: true,
  props: {
    projects: { type: Array, default: () => [] },
    stats: { type: Object, required: true },
    notifications: { type: Array, default: () => [] },
    meta: { type: Object, default: () => ({}) }
  },
  setup(__props) {
    const props = __props;
    const page = usePage();
    const { t: t3 } = usePortalTranslations();
    const locale = computed(() => page.props.locale);
    const auth = computed(() => page.props.auth);
    const metaTitle = computed(() => {
      var _a;
      return ((_a = props.meta) == null ? void 0 : _a.title) || t3("pages.dashboard_title");
    });
    const metaDescription = computed(() => {
      var _a;
      return ((_a = props.meta) == null ? void 0 : _a.description) || t3("pages.dashboard_description");
    });
    const welcomeSubtitle = computed(() => {
      var _a;
      return `${t3("dashboard.welcome", { name: (_a = auth.value) == null ? void 0 : _a.name })} — ${t3("dashboard.subtitle")}`;
    });
    const formatMoney = (amount, currency) => `${Number(amount).toFixed(2)} ${currency || ""}`.trim();
    const markAllRead = () => router.post(route("portal.notifications.read-all"));
    const openNotification = (notification) => router.post(route("portal.notifications.read", notification.id));
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$w, mergeProps({
        title: unref(t3)("menu.my_dashboard"),
        subtitle: welcomeSubtitle.value,
        active: "dashboard",
        breadcrumbs: [{ label: unref(t3)("menu.my_dashboard") }],
        "meta-title": metaTitle.value,
        "meta-description": metaDescription.value
      }, _attrs), {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="portal-stats"${_scopeId}><div class="portal-stat"${_scopeId}><span class="portal-stat__icon"${_scopeId}><i class="fas fa-briefcase"${_scopeId}></i></span><span class="portal-stat__label"${_scopeId}>${ssrInterpolate(unref(t3)("dashboard.total_projects"))}</span><span class="portal-stat__value"${_scopeId}>${ssrInterpolate(__props.stats.total_projects)}</span></div><div class="portal-stat"${_scopeId}><span class="portal-stat__icon"${_scopeId}><i class="fas fa-spinner"${_scopeId}></i></span><span class="portal-stat__label"${_scopeId}>${ssrInterpolate(unref(t3)("dashboard.active_projects"))}</span><span class="portal-stat__value"${_scopeId}>${ssrInterpolate(__props.stats.active_projects)}</span></div><div class="portal-stat"${_scopeId}><span class="portal-stat__icon"${_scopeId}><i class="fas fa-bell"${_scopeId}></i></span><span class="portal-stat__label"${_scopeId}>${ssrInterpolate(unref(t3)("menu.notifications"))}</span><span class="portal-stat__value"${_scopeId}>${ssrInterpolate(__props.stats.unread_notifications)}</span></div></div><div class="row g-4"${_scopeId}><div class="col-lg-7"${_scopeId}><div class="portal-panel"${_scopeId}><div class="portal-panel__header"${_scopeId}><h2 class="portal-panel__title"${_scopeId}>${ssrInterpolate(unref(t3)("dashboard.recent_projects"))}</h2>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("portal.projects.index"),
              class: "portal-panel__action"
            }, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(t3)("dashboard.view_all_projects"))} <i class="${ssrRenderClass(`fas fa-arrow-${locale.value === "ar" ? "left" : "right"}`)}"${_scopeId2}></i>`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(t3)("dashboard.view_all_projects")) + " ", 1),
                    createVNode("i", {
                      class: `fas fa-arrow-${locale.value === "ar" ? "left" : "right"}`
                    }, null, 2)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="portal-panel__body"${_scopeId}>`);
            if (__props.projects.length === 0) {
              _push2(`<div class="portal-empty"${_scopeId}><i class="fas fa-folder-open"${_scopeId}></i> ${ssrInterpolate(unref(t3)("dashboard.no_projects"))}</div>`);
            } else {
              _push2(`<div class="portal-table-wrap"${_scopeId}><table class="portal-table"${_scopeId}><thead${_scopeId}><tr${_scopeId}><th${_scopeId}>${ssrInterpolate(unref(t3)("fields.status"))}</th><th${_scopeId}>${ssrInterpolate(unref(t3)("projects.title"))}</th><th${_scopeId}>${ssrInterpolate(unref(t3)("fields.remaining"))}</th><th${_scopeId}></th></tr></thead><tbody${_scopeId}><!--[-->`);
              ssrRenderList(__props.projects, (project) => {
                var _a, _b, _c;
                _push2(`<tr${_scopeId}><td${_scopeId}><span class="portal-badge" style="${ssrRenderStyle({ backgroundColor: (((_a = project.status) == null ? void 0 : _a.color_code) || "#6c757d") + "33", color: ((_b = project.status) == null ? void 0 : _b.color_code) || "#C5C8CD" })}"${_scopeId}>${ssrInterpolate((_c = project.status) == null ? void 0 : _c.name)}</span></td><td${_scopeId}>${ssrInterpolate(project.title)}</td><td${_scopeId}>${ssrInterpolate(formatMoney(project.collection.remaining, project.collection.currency))}</td><td class="text-end"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Link), {
                  href: _ctx.route("portal.projects.show", project.id),
                  class: "thm-btn",
                  style: { "padding": "10px 20px", "font-size": "14px" }
                }, {
                  default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(unref(t3)("projects.view_details"))}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(unref(t3)("projects.view_details")), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`</td></tr>`);
              });
              _push2(`<!--]--></tbody></table></div>`);
            }
            _push2(`</div></div></div><div class="col-lg-5"${_scopeId}><div class="portal-panel"${_scopeId}><div class="portal-panel__header"${_scopeId}><h2 class="portal-panel__title"${_scopeId}>${ssrInterpolate(unref(t3)("dashboard.recent_notifications"))}</h2>`);
            if (__props.notifications.length) {
              _push2(`<button type="button" class="portal-link-muted"${_scopeId}>${ssrInterpolate(unref(t3)("notifications.mark_all_read"))}</button>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="portal-panel__body"${_scopeId}>`);
            if (__props.notifications.length === 0) {
              _push2(`<div class="portal-empty"${_scopeId}><i class="fas fa-bell-slash"${_scopeId}></i> ${ssrInterpolate(unref(t3)("dashboard.no_notifications"))}</div>`);
            } else {
              _push2(`<div class="portal-notifications"${_scopeId}><!--[-->`);
              ssrRenderList(__props.notifications, (notification) => {
                _push2(`<button type="button" class="${ssrRenderClass([{ "portal-notification--unread": !notification.read_at }, "portal-notification"])}"${_scopeId}><div class="portal-notification__inner"${_scopeId}><span class="portal-notification__dot"${_scopeId}></span><div${_scopeId}><div class="portal-notification__message"${_scopeId}>${ssrInterpolate(notification.message)}</div><div class="portal-notification__time"${_scopeId}>${ssrInterpolate(notification.created_at)}</div></div></div></button>`);
              });
              _push2(`<!--]--></div>`);
            }
            _push2(`</div></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "portal-stats" }, [
                createVNode("div", { class: "portal-stat" }, [
                  createVNode("span", { class: "portal-stat__icon" }, [
                    createVNode("i", { class: "fas fa-briefcase" })
                  ]),
                  createVNode("span", { class: "portal-stat__label" }, toDisplayString(unref(t3)("dashboard.total_projects")), 1),
                  createVNode("span", { class: "portal-stat__value" }, toDisplayString(__props.stats.total_projects), 1)
                ]),
                createVNode("div", { class: "portal-stat" }, [
                  createVNode("span", { class: "portal-stat__icon" }, [
                    createVNode("i", { class: "fas fa-spinner" })
                  ]),
                  createVNode("span", { class: "portal-stat__label" }, toDisplayString(unref(t3)("dashboard.active_projects")), 1),
                  createVNode("span", { class: "portal-stat__value" }, toDisplayString(__props.stats.active_projects), 1)
                ]),
                createVNode("div", { class: "portal-stat" }, [
                  createVNode("span", { class: "portal-stat__icon" }, [
                    createVNode("i", { class: "fas fa-bell" })
                  ]),
                  createVNode("span", { class: "portal-stat__label" }, toDisplayString(unref(t3)("menu.notifications")), 1),
                  createVNode("span", { class: "portal-stat__value" }, toDisplayString(__props.stats.unread_notifications), 1)
                ])
              ]),
              createVNode("div", { class: "row g-4" }, [
                createVNode("div", { class: "col-lg-7" }, [
                  createVNode("div", { class: "portal-panel" }, [
                    createVNode("div", { class: "portal-panel__header" }, [
                      createVNode("h2", { class: "portal-panel__title" }, toDisplayString(unref(t3)("dashboard.recent_projects")), 1),
                      createVNode(unref(Link), {
                        href: _ctx.route("portal.projects.index"),
                        class: "portal-panel__action"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(unref(t3)("dashboard.view_all_projects")) + " ", 1),
                          createVNode("i", {
                            class: `fas fa-arrow-${locale.value === "ar" ? "left" : "right"}`
                          }, null, 2)
                        ]),
                        _: 1
                      }, 8, ["href"])
                    ]),
                    createVNode("div", { class: "portal-panel__body" }, [
                      __props.projects.length === 0 ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "portal-empty"
                      }, [
                        createVNode("i", { class: "fas fa-folder-open" }),
                        createTextVNode(" " + toDisplayString(unref(t3)("dashboard.no_projects")), 1)
                      ])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "portal-table-wrap"
                      }, [
                        createVNode("table", { class: "portal-table" }, [
                          createVNode("thead", null, [
                            createVNode("tr", null, [
                              createVNode("th", null, toDisplayString(unref(t3)("fields.status")), 1),
                              createVNode("th", null, toDisplayString(unref(t3)("projects.title")), 1),
                              createVNode("th", null, toDisplayString(unref(t3)("fields.remaining")), 1),
                              createVNode("th")
                            ])
                          ]),
                          createVNode("tbody", null, [
                            (openBlock(true), createBlock(Fragment, null, renderList(__props.projects, (project) => {
                              var _a, _b, _c;
                              return openBlock(), createBlock("tr", {
                                key: project.id
                              }, [
                                createVNode("td", null, [
                                  createVNode("span", {
                                    class: "portal-badge",
                                    style: { backgroundColor: (((_a = project.status) == null ? void 0 : _a.color_code) || "#6c757d") + "33", color: ((_b = project.status) == null ? void 0 : _b.color_code) || "#C5C8CD" }
                                  }, toDisplayString((_c = project.status) == null ? void 0 : _c.name), 5)
                                ]),
                                createVNode("td", null, toDisplayString(project.title), 1),
                                createVNode("td", null, toDisplayString(formatMoney(project.collection.remaining, project.collection.currency)), 1),
                                createVNode("td", { class: "text-end" }, [
                                  createVNode(unref(Link), {
                                    href: _ctx.route("portal.projects.show", project.id),
                                    class: "thm-btn",
                                    style: { "padding": "10px 20px", "font-size": "14px" }
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(unref(t3)("projects.view_details")), 1)
                                    ]),
                                    _: 1
                                  }, 8, ["href"])
                                ])
                              ]);
                            }), 128))
                          ])
                        ])
                      ]))
                    ])
                  ])
                ]),
                createVNode("div", { class: "col-lg-5" }, [
                  createVNode("div", { class: "portal-panel" }, [
                    createVNode("div", { class: "portal-panel__header" }, [
                      createVNode("h2", { class: "portal-panel__title" }, toDisplayString(unref(t3)("dashboard.recent_notifications")), 1),
                      __props.notifications.length ? (openBlock(), createBlock("button", {
                        key: 0,
                        type: "button",
                        class: "portal-link-muted",
                        onClick: markAllRead
                      }, toDisplayString(unref(t3)("notifications.mark_all_read")), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "portal-panel__body" }, [
                      __props.notifications.length === 0 ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "portal-empty"
                      }, [
                        createVNode("i", { class: "fas fa-bell-slash" }),
                        createTextVNode(" " + toDisplayString(unref(t3)("dashboard.no_notifications")), 1)
                      ])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "portal-notifications"
                      }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.notifications, (notification) => {
                          return openBlock(), createBlock("button", {
                            key: notification.id,
                            type: "button",
                            class: ["portal-notification", { "portal-notification--unread": !notification.read_at }],
                            onClick: ($event) => openNotification(notification)
                          }, [
                            createVNode("div", { class: "portal-notification__inner" }, [
                              createVNode("span", { class: "portal-notification__dot" }),
                              createVNode("div", null, [
                                createVNode("div", { class: "portal-notification__message" }, toDisplayString(notification.message), 1),
                                createVNode("div", { class: "portal-notification__time" }, toDisplayString(notification.created_at), 1)
                              ])
                            ])
                          ], 10, ["onClick"]);
                        }), 128))
                      ]))
                    ])
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("Modules/User/resources/assets/js/Pages/Portal/Dashboard.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const __vite_glob_0_30 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$a
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$9 = {
  __name: "Profile",
  __ssrInlineRender: true,
  props: {
    user: { type: Object, required: true },
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorPending: { type: Boolean, default: false },
    meta: { type: Object, default: () => ({}) }
  },
  setup(__props) {
    const props = __props;
    const page = usePage();
    const { t: t3 } = usePortalTranslations();
    const flash = computed(() => page.props.flash || {});
    const metaTitle = computed(() => {
      var _a;
      return ((_a = props.meta) == null ? void 0 : _a.title) || t3("pages.profile_title");
    });
    const metaDescription = computed(() => {
      var _a;
      return ((_a = props.meta) == null ? void 0 : _a.description) || t3("pages.profile_description");
    });
    const avatarPreview = ref(null);
    const twoFactorLoading = ref(false);
    const twoFactorError = ref("");
    const qrSvg = ref("");
    const recoveryCodes = ref([]);
    const twoFactorCode = ref("");
    const profileForm = useForm({
      name: props.user.name,
      email: props.user.email,
      mobile: props.user.mobile || "",
      avatar: null
    });
    const passwordForm = useForm({
      current_password: "",
      password: "",
      password_confirmation: ""
    });
    const onAvatarChange = (event) => {
      const file = event.target.files[0] || null;
      profileForm.avatar = file;
      if (file) {
        avatarPreview.value = URL.createObjectURL(file);
      }
    };
    const clearAvatar = () => {
      profileForm.avatar = null;
      avatarPreview.value = null;
    };
    const submitProfile = () => {
      profileForm.post(route("portal.profile.update"), {
        forceFormData: true,
        preserveScroll: true
      });
    };
    const submitPassword = () => {
      passwordForm.put(route("portal.profile.password"), {
        preserveScroll: true,
        onSuccess: () => passwordForm.reset()
      });
    };
    const fortifyHeaders = () => ({
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
      "X-CSRF-TOKEN": page.props.csrf
    });
    const loadQrCode = async () => {
      twoFactorLoading.value = true;
      twoFactorError.value = "";
      try {
        const response = await fetch(route("two-factor.qr-code"), {
          headers: fortifyHeaders(),
          credentials: "same-origin"
        });
        if (!response.ok) {
          throw new Error();
        }
        const data = await response.json();
        qrSvg.value = data.svg || "";
      } catch (error) {
        twoFactorError.value = t3("profile.two_factor_error");
      } finally {
        twoFactorLoading.value = false;
      }
    };
    const loadRecoveryCodes = async () => {
      twoFactorLoading.value = true;
      twoFactorError.value = "";
      try {
        const response = await fetch(route("two-factor.recovery-codes"), {
          headers: fortifyHeaders(),
          credentials: "same-origin"
        });
        if (!response.ok) {
          throw new Error();
        }
        const data = await response.json();
        recoveryCodes.value = data.recoveryCodes || [];
      } catch (error) {
        twoFactorError.value = t3("profile.two_factor_error");
      } finally {
        twoFactorLoading.value = false;
      }
    };
    const enableTwoFactor = () => {
      twoFactorLoading.value = true;
      twoFactorError.value = "";
      router.post(route("two-factor.enable"), {}, {
        preserveScroll: true,
        onFinish: () => {
          twoFactorLoading.value = false;
        },
        onError: () => {
          twoFactorError.value = t3("profile.two_factor_error");
        }
      });
    };
    const disableTwoFactor = () => {
      if (!window.confirm(t3("profile.disable_confirm"))) {
        return;
      }
      twoFactorLoading.value = true;
      twoFactorError.value = "";
      router.delete(route("two-factor.disable"), {
        preserveScroll: true,
        onFinish: () => {
          twoFactorLoading.value = false;
          qrSvg.value = "";
          recoveryCodes.value = [];
          twoFactorCode.value = "";
        },
        onError: () => {
          twoFactorError.value = t3("profile.two_factor_error");
        }
      });
    };
    const confirmTwoFactor = () => {
      twoFactorLoading.value = true;
      twoFactorError.value = "";
      router.post(route("two-factor.confirm"), { code: twoFactorCode.value }, {
        preserveScroll: true,
        onSuccess: () => {
          twoFactorCode.value = "";
          loadQrCode();
        },
        onFinish: () => {
          twoFactorLoading.value = false;
        },
        onError: () => {
          twoFactorError.value = t3("profile.confirm_code_error");
        }
      });
    };
    if (props.twoFactorPending) {
      loadQrCode();
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$w, mergeProps({
        title: unref(t3)("profile.title"),
        subtitle: unref(t3)("profile.subtitle"),
        active: "profile",
        breadcrumbs: [
          { label: unref(t3)("menu.my_dashboard"), href: _ctx.route("portal.dashboard") },
          { label: unref(t3)("profile.title") }
        ],
        "meta-title": metaTitle.value,
        "meta-description": metaDescription.value
      }, _attrs), {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (flash.value.success) {
              _push2(`<div class="portal-alert portal-alert--success" role="alert"${_scopeId}><i class="fas fa-check-circle"${_scopeId}></i> ${ssrInterpolate(flash.value.success)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="row g-4"${_scopeId}><div class="col-lg-6"${_scopeId}><div class="portal-panel"${_scopeId}><div class="portal-panel__header"${_scopeId}><h2 class="portal-panel__title"${_scopeId}>${ssrInterpolate(unref(t3)("profile.information"))}</h2></div><div class="portal-panel__body"${_scopeId}><form class="portal-profile-form"${_scopeId}><div class="portal-profile-avatar"${_scopeId}><div class="portal-profile-avatar__preview"${_scopeId}><img${ssrRenderAttr("src", avatarPreview.value || __props.user.avatar)}${ssrRenderAttr("alt", unref(t3)("profile.avatar"))}${_scopeId}></div><div class="portal-profile-avatar__actions"${_scopeId}><label class="portal-profile-avatar__upload thm-btn thm-btn--sm"${_scopeId}><i class="fas fa-camera"${_scopeId}></i> ${ssrInterpolate(unref(t3)("profile.change_photo"))} <input type="file" accept="image/jpeg,image/png,image/jpg,image/webp" class="d-none"${_scopeId}></label>`);
            if (avatarPreview.value) {
              _push2(`<button type="button" class="portal-panel__action"${_scopeId}>${ssrInterpolate(unref(t3)("profile.remove_photo"))}</button>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if (unref(profileForm).errors.avatar) {
              _push2(`<p class="portal-form-error"${_scopeId}>${ssrInterpolate(unref(profileForm).errors.avatar)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="portal-form-group"${_scopeId}><label for="profile-name"${_scopeId}>${ssrInterpolate(unref(t3)("profile.name"))} *</label><input id="profile-name"${ssrRenderAttr("value", unref(profileForm).name)} type="text" class="${ssrRenderClass([{ "portal-input--error": unref(profileForm).errors.name }, "portal-input"])}" required${_scopeId}>`);
            if (unref(profileForm).errors.name) {
              _push2(`<p class="portal-form-error"${_scopeId}>${ssrInterpolate(unref(profileForm).errors.name)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="portal-form-group"${_scopeId}><label for="profile-email"${_scopeId}>${ssrInterpolate(unref(t3)("profile.email"))} *</label><input id="profile-email"${ssrRenderAttr("value", unref(profileForm).email)} type="email" class="${ssrRenderClass([{ "portal-input--error": unref(profileForm).errors.email }, "portal-input"])}" required${_scopeId}>`);
            if (unref(profileForm).errors.email) {
              _push2(`<p class="portal-form-error"${_scopeId}>${ssrInterpolate(unref(profileForm).errors.email)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="portal-form-group"${_scopeId}><label for="profile-mobile"${_scopeId}>${ssrInterpolate(unref(t3)("profile.mobile"))}</label><input id="profile-mobile"${ssrRenderAttr("value", unref(profileForm).mobile)} type="text" class="${ssrRenderClass([{ "portal-input--error": unref(profileForm).errors.mobile }, "portal-input"])}"${_scopeId}>`);
            if (unref(profileForm).errors.mobile) {
              _push2(`<p class="portal-form-error"${_scopeId}>${ssrInterpolate(unref(profileForm).errors.mobile)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="portal-profile-form__actions"${_scopeId}><button type="submit" class="thm-btn"${ssrIncludeBooleanAttr(unref(profileForm).processing) ? " disabled" : ""}${_scopeId}>${ssrInterpolate(unref(t3)("profile.save_changes"))}</button></div></form></div></div></div><div class="col-lg-6"${_scopeId}><div class="portal-panel mb-4"${_scopeId}><div class="portal-panel__header"${_scopeId}><h2 class="portal-panel__title"${_scopeId}>${ssrInterpolate(unref(t3)("profile.change_password"))}</h2></div><div class="portal-panel__body"${_scopeId}><form class="portal-profile-form"${_scopeId}><div class="portal-form-group"${_scopeId}><label for="current-password"${_scopeId}>${ssrInterpolate(unref(t3)("profile.current_password"))} *</label><input id="current-password"${ssrRenderAttr("value", unref(passwordForm).current_password)} type="password" class="${ssrRenderClass([{ "portal-input--error": unref(passwordForm).errors.current_password }, "portal-input"])}" required autocomplete="current-password"${_scopeId}>`);
            if (unref(passwordForm).errors.current_password) {
              _push2(`<p class="portal-form-error"${_scopeId}>${ssrInterpolate(unref(passwordForm).errors.current_password)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="portal-form-group"${_scopeId}><label for="new-password"${_scopeId}>${ssrInterpolate(unref(t3)("profile.new_password"))} *</label><input id="new-password"${ssrRenderAttr("value", unref(passwordForm).password)} type="password" class="${ssrRenderClass([{ "portal-input--error": unref(passwordForm).errors.password }, "portal-input"])}" required autocomplete="new-password"${_scopeId}>`);
            if (unref(passwordForm).errors.password) {
              _push2(`<p class="portal-form-error"${_scopeId}>${ssrInterpolate(unref(passwordForm).errors.password)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="portal-form-group"${_scopeId}><label for="confirm-password"${_scopeId}>${ssrInterpolate(unref(t3)("profile.confirm_password"))} *</label><input id="confirm-password"${ssrRenderAttr("value", unref(passwordForm).password_confirmation)} type="password" class="portal-input" required autocomplete="new-password"${_scopeId}></div><div class="portal-profile-form__actions"${_scopeId}><button type="submit" class="thm-btn"${ssrIncludeBooleanAttr(unref(passwordForm).processing) ? " disabled" : ""}${_scopeId}>${ssrInterpolate(unref(t3)("profile.update_password"))}</button></div></form></div></div><div class="portal-panel"${_scopeId}><div class="portal-panel__header"${_scopeId}><h2 class="portal-panel__title"${_scopeId}>${ssrInterpolate(unref(t3)("profile.two_factor"))}</h2></div><div class="portal-panel__body"${_scopeId}><p class="portal-profile-2fa__text"${_scopeId}>${ssrInterpolate(unref(t3)("profile.two_factor_description"))}</p>`);
            if (__props.twoFactorEnabled) {
              _push2(`<div class="portal-profile-2fa__status"${_scopeId}><span class="portal-badge portal-badge--paid"${_scopeId}>${ssrInterpolate(unref(t3)("profile.two_factor_enabled"))}</span></div>`);
            } else if (__props.twoFactorPending) {
              _push2(`<div class="portal-profile-2fa__status"${_scopeId}><span class="portal-badge portal-badge--invoice"${_scopeId}>${ssrInterpolate(unref(t3)("profile.two_factor_pending"))}</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.twoFactorEnabled || __props.twoFactorPending) {
              _push2(`<div class="portal-profile-2fa__tools"${_scopeId}><button type="button" class="portal-panel__action"${ssrIncludeBooleanAttr(twoFactorLoading.value) ? " disabled" : ""}${_scopeId}><i class="fas fa-qrcode"${_scopeId}></i> ${ssrInterpolate(unref(t3)("profile.show_qr"))}</button>`);
              if (__props.twoFactorEnabled) {
                _push2(`<button type="button" class="portal-panel__action"${ssrIncludeBooleanAttr(twoFactorLoading.value) ? " disabled" : ""}${_scopeId}><i class="fas fa-key"${_scopeId}></i> ${ssrInterpolate(unref(t3)("profile.show_recovery_codes"))}</button>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (qrSvg.value) {
              _push2(`<div class="portal-profile-2fa__qr"${_scopeId}>${qrSvg.value ?? ""}</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (recoveryCodes.value.length) {
              _push2(`<div class="portal-profile-2fa__codes"${_scopeId}><p class="portal-form-hint"${_scopeId}>${ssrInterpolate(unref(t3)("profile.recovery_codes_hint"))}</p><ul${_scopeId}><!--[-->`);
              ssrRenderList(recoveryCodes.value, (code) => {
                _push2(`<li${_scopeId}><code${_scopeId}>${ssrInterpolate(code)}</code></li>`);
              });
              _push2(`<!--]--></ul></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.twoFactorPending) {
              _push2(`<form class="portal-profile-2fa__confirm"${_scopeId}><div class="portal-form-group"${_scopeId}><label for="two-factor-code"${_scopeId}>${ssrInterpolate(unref(t3)("profile.confirm_code"))} *</label><input id="two-factor-code"${ssrRenderAttr("value", twoFactorCode.value)} type="text" inputmode="numeric" maxlength="6" class="portal-input"${ssrRenderAttr("placeholder", unref(t3)("profile.confirm_code_placeholder"))} required${_scopeId}></div><button type="submit" class="thm-btn thm-btn--sm"${ssrIncludeBooleanAttr(twoFactorLoading.value) ? " disabled" : ""}${_scopeId}>${ssrInterpolate(unref(t3)("profile.confirm_two_factor"))}</button></form>`);
            } else {
              _push2(`<!---->`);
            }
            if (twoFactorError.value) {
              _push2(`<p class="portal-form-error"${_scopeId}>${ssrInterpolate(twoFactorError.value)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="portal-profile-2fa__actions"${_scopeId}>`);
            if (__props.twoFactorEnabled || __props.twoFactorPending) {
              _push2(`<button type="button" class="portal-profile-2fa__disable"${ssrIncludeBooleanAttr(twoFactorLoading.value) ? " disabled" : ""}${_scopeId}>${ssrInterpolate(unref(t3)("profile.disable_two_factor"))}</button>`);
            } else {
              _push2(`<button type="button" class="thm-btn"${ssrIncludeBooleanAttr(twoFactorLoading.value) ? " disabled" : ""}${_scopeId}>${ssrInterpolate(unref(t3)("profile.enable_two_factor"))}</button>`);
            }
            _push2(`</div></div></div></div></div>`);
          } else {
            return [
              flash.value.success ? (openBlock(), createBlock("div", {
                key: 0,
                class: "portal-alert portal-alert--success",
                role: "alert"
              }, [
                createVNode("i", { class: "fas fa-check-circle" }),
                createTextVNode(" " + toDisplayString(flash.value.success), 1)
              ])) : createCommentVNode("", true),
              createVNode("div", { class: "row g-4" }, [
                createVNode("div", { class: "col-lg-6" }, [
                  createVNode("div", { class: "portal-panel" }, [
                    createVNode("div", { class: "portal-panel__header" }, [
                      createVNode("h2", { class: "portal-panel__title" }, toDisplayString(unref(t3)("profile.information")), 1)
                    ]),
                    createVNode("div", { class: "portal-panel__body" }, [
                      createVNode("form", {
                        class: "portal-profile-form",
                        onSubmit: withModifiers(submitProfile, ["prevent"])
                      }, [
                        createVNode("div", { class: "portal-profile-avatar" }, [
                          createVNode("div", { class: "portal-profile-avatar__preview" }, [
                            createVNode("img", {
                              src: avatarPreview.value || __props.user.avatar,
                              alt: unref(t3)("profile.avatar")
                            }, null, 8, ["src", "alt"])
                          ]),
                          createVNode("div", { class: "portal-profile-avatar__actions" }, [
                            createVNode("label", { class: "portal-profile-avatar__upload thm-btn thm-btn--sm" }, [
                              createVNode("i", { class: "fas fa-camera" }),
                              createTextVNode(" " + toDisplayString(unref(t3)("profile.change_photo")) + " ", 1),
                              createVNode("input", {
                                type: "file",
                                accept: "image/jpeg,image/png,image/jpg,image/webp",
                                class: "d-none",
                                onChange: onAvatarChange
                              }, null, 32)
                            ]),
                            avatarPreview.value ? (openBlock(), createBlock("button", {
                              key: 0,
                              type: "button",
                              class: "portal-panel__action",
                              onClick: clearAvatar
                            }, toDisplayString(unref(t3)("profile.remove_photo")), 1)) : createCommentVNode("", true)
                          ]),
                          unref(profileForm).errors.avatar ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "portal-form-error"
                          }, toDisplayString(unref(profileForm).errors.avatar), 1)) : createCommentVNode("", true)
                        ]),
                        createVNode("div", { class: "portal-form-group" }, [
                          createVNode("label", { for: "profile-name" }, toDisplayString(unref(t3)("profile.name")) + " *", 1),
                          withDirectives(createVNode("input", {
                            id: "profile-name",
                            "onUpdate:modelValue": ($event) => unref(profileForm).name = $event,
                            type: "text",
                            class: ["portal-input", { "portal-input--error": unref(profileForm).errors.name }],
                            required: ""
                          }, null, 10, ["onUpdate:modelValue"]), [
                            [vModelText, unref(profileForm).name]
                          ]),
                          unref(profileForm).errors.name ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "portal-form-error"
                          }, toDisplayString(unref(profileForm).errors.name), 1)) : createCommentVNode("", true)
                        ]),
                        createVNode("div", { class: "portal-form-group" }, [
                          createVNode("label", { for: "profile-email" }, toDisplayString(unref(t3)("profile.email")) + " *", 1),
                          withDirectives(createVNode("input", {
                            id: "profile-email",
                            "onUpdate:modelValue": ($event) => unref(profileForm).email = $event,
                            type: "email",
                            class: ["portal-input", { "portal-input--error": unref(profileForm).errors.email }],
                            required: ""
                          }, null, 10, ["onUpdate:modelValue"]), [
                            [vModelText, unref(profileForm).email]
                          ]),
                          unref(profileForm).errors.email ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "portal-form-error"
                          }, toDisplayString(unref(profileForm).errors.email), 1)) : createCommentVNode("", true)
                        ]),
                        createVNode("div", { class: "portal-form-group" }, [
                          createVNode("label", { for: "profile-mobile" }, toDisplayString(unref(t3)("profile.mobile")), 1),
                          withDirectives(createVNode("input", {
                            id: "profile-mobile",
                            "onUpdate:modelValue": ($event) => unref(profileForm).mobile = $event,
                            type: "text",
                            class: ["portal-input", { "portal-input--error": unref(profileForm).errors.mobile }]
                          }, null, 10, ["onUpdate:modelValue"]), [
                            [vModelText, unref(profileForm).mobile]
                          ]),
                          unref(profileForm).errors.mobile ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "portal-form-error"
                          }, toDisplayString(unref(profileForm).errors.mobile), 1)) : createCommentVNode("", true)
                        ]),
                        createVNode("div", { class: "portal-profile-form__actions" }, [
                          createVNode("button", {
                            type: "submit",
                            class: "thm-btn",
                            disabled: unref(profileForm).processing
                          }, toDisplayString(unref(t3)("profile.save_changes")), 9, ["disabled"])
                        ])
                      ], 32)
                    ])
                  ])
                ]),
                createVNode("div", { class: "col-lg-6" }, [
                  createVNode("div", { class: "portal-panel mb-4" }, [
                    createVNode("div", { class: "portal-panel__header" }, [
                      createVNode("h2", { class: "portal-panel__title" }, toDisplayString(unref(t3)("profile.change_password")), 1)
                    ]),
                    createVNode("div", { class: "portal-panel__body" }, [
                      createVNode("form", {
                        class: "portal-profile-form",
                        onSubmit: withModifiers(submitPassword, ["prevent"])
                      }, [
                        createVNode("div", { class: "portal-form-group" }, [
                          createVNode("label", { for: "current-password" }, toDisplayString(unref(t3)("profile.current_password")) + " *", 1),
                          withDirectives(createVNode("input", {
                            id: "current-password",
                            "onUpdate:modelValue": ($event) => unref(passwordForm).current_password = $event,
                            type: "password",
                            class: ["portal-input", { "portal-input--error": unref(passwordForm).errors.current_password }],
                            required: "",
                            autocomplete: "current-password"
                          }, null, 10, ["onUpdate:modelValue"]), [
                            [vModelText, unref(passwordForm).current_password]
                          ]),
                          unref(passwordForm).errors.current_password ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "portal-form-error"
                          }, toDisplayString(unref(passwordForm).errors.current_password), 1)) : createCommentVNode("", true)
                        ]),
                        createVNode("div", { class: "portal-form-group" }, [
                          createVNode("label", { for: "new-password" }, toDisplayString(unref(t3)("profile.new_password")) + " *", 1),
                          withDirectives(createVNode("input", {
                            id: "new-password",
                            "onUpdate:modelValue": ($event) => unref(passwordForm).password = $event,
                            type: "password",
                            class: ["portal-input", { "portal-input--error": unref(passwordForm).errors.password }],
                            required: "",
                            autocomplete: "new-password"
                          }, null, 10, ["onUpdate:modelValue"]), [
                            [vModelText, unref(passwordForm).password]
                          ]),
                          unref(passwordForm).errors.password ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "portal-form-error"
                          }, toDisplayString(unref(passwordForm).errors.password), 1)) : createCommentVNode("", true)
                        ]),
                        createVNode("div", { class: "portal-form-group" }, [
                          createVNode("label", { for: "confirm-password" }, toDisplayString(unref(t3)("profile.confirm_password")) + " *", 1),
                          withDirectives(createVNode("input", {
                            id: "confirm-password",
                            "onUpdate:modelValue": ($event) => unref(passwordForm).password_confirmation = $event,
                            type: "password",
                            class: "portal-input",
                            required: "",
                            autocomplete: "new-password"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, unref(passwordForm).password_confirmation]
                          ])
                        ]),
                        createVNode("div", { class: "portal-profile-form__actions" }, [
                          createVNode("button", {
                            type: "submit",
                            class: "thm-btn",
                            disabled: unref(passwordForm).processing
                          }, toDisplayString(unref(t3)("profile.update_password")), 9, ["disabled"])
                        ])
                      ], 32)
                    ])
                  ]),
                  createVNode("div", { class: "portal-panel" }, [
                    createVNode("div", { class: "portal-panel__header" }, [
                      createVNode("h2", { class: "portal-panel__title" }, toDisplayString(unref(t3)("profile.two_factor")), 1)
                    ]),
                    createVNode("div", { class: "portal-panel__body" }, [
                      createVNode("p", { class: "portal-profile-2fa__text" }, toDisplayString(unref(t3)("profile.two_factor_description")), 1),
                      __props.twoFactorEnabled ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "portal-profile-2fa__status"
                      }, [
                        createVNode("span", { class: "portal-badge portal-badge--paid" }, toDisplayString(unref(t3)("profile.two_factor_enabled")), 1)
                      ])) : __props.twoFactorPending ? (openBlock(), createBlock("div", {
                        key: 1,
                        class: "portal-profile-2fa__status"
                      }, [
                        createVNode("span", { class: "portal-badge portal-badge--invoice" }, toDisplayString(unref(t3)("profile.two_factor_pending")), 1)
                      ])) : createCommentVNode("", true),
                      __props.twoFactorEnabled || __props.twoFactorPending ? (openBlock(), createBlock("div", {
                        key: 2,
                        class: "portal-profile-2fa__tools"
                      }, [
                        createVNode("button", {
                          type: "button",
                          class: "portal-panel__action",
                          disabled: twoFactorLoading.value,
                          onClick: loadQrCode
                        }, [
                          createVNode("i", { class: "fas fa-qrcode" }),
                          createTextVNode(" " + toDisplayString(unref(t3)("profile.show_qr")), 1)
                        ], 8, ["disabled"]),
                        __props.twoFactorEnabled ? (openBlock(), createBlock("button", {
                          key: 0,
                          type: "button",
                          class: "portal-panel__action",
                          disabled: twoFactorLoading.value,
                          onClick: loadRecoveryCodes
                        }, [
                          createVNode("i", { class: "fas fa-key" }),
                          createTextVNode(" " + toDisplayString(unref(t3)("profile.show_recovery_codes")), 1)
                        ], 8, ["disabled"])) : createCommentVNode("", true)
                      ])) : createCommentVNode("", true),
                      qrSvg.value ? (openBlock(), createBlock("div", {
                        key: 3,
                        class: "portal-profile-2fa__qr",
                        innerHTML: qrSvg.value
                      }, null, 8, ["innerHTML"])) : createCommentVNode("", true),
                      recoveryCodes.value.length ? (openBlock(), createBlock("div", {
                        key: 4,
                        class: "portal-profile-2fa__codes"
                      }, [
                        createVNode("p", { class: "portal-form-hint" }, toDisplayString(unref(t3)("profile.recovery_codes_hint")), 1),
                        createVNode("ul", null, [
                          (openBlock(true), createBlock(Fragment, null, renderList(recoveryCodes.value, (code) => {
                            return openBlock(), createBlock("li", { key: code }, [
                              createVNode("code", null, toDisplayString(code), 1)
                            ]);
                          }), 128))
                        ])
                      ])) : createCommentVNode("", true),
                      __props.twoFactorPending ? (openBlock(), createBlock("form", {
                        key: 5,
                        class: "portal-profile-2fa__confirm",
                        onSubmit: withModifiers(confirmTwoFactor, ["prevent"])
                      }, [
                        createVNode("div", { class: "portal-form-group" }, [
                          createVNode("label", { for: "two-factor-code" }, toDisplayString(unref(t3)("profile.confirm_code")) + " *", 1),
                          withDirectives(createVNode("input", {
                            id: "two-factor-code",
                            "onUpdate:modelValue": ($event) => twoFactorCode.value = $event,
                            type: "text",
                            inputmode: "numeric",
                            maxlength: "6",
                            class: "portal-input",
                            placeholder: unref(t3)("profile.confirm_code_placeholder"),
                            required: ""
                          }, null, 8, ["onUpdate:modelValue", "placeholder"]), [
                            [vModelText, twoFactorCode.value]
                          ])
                        ]),
                        createVNode("button", {
                          type: "submit",
                          class: "thm-btn thm-btn--sm",
                          disabled: twoFactorLoading.value
                        }, toDisplayString(unref(t3)("profile.confirm_two_factor")), 9, ["disabled"])
                      ], 32)) : createCommentVNode("", true),
                      twoFactorError.value ? (openBlock(), createBlock("p", {
                        key: 6,
                        class: "portal-form-error"
                      }, toDisplayString(twoFactorError.value), 1)) : createCommentVNode("", true),
                      createVNode("div", { class: "portal-profile-2fa__actions" }, [
                        __props.twoFactorEnabled || __props.twoFactorPending ? (openBlock(), createBlock("button", {
                          key: 0,
                          type: "button",
                          class: "portal-profile-2fa__disable",
                          disabled: twoFactorLoading.value,
                          onClick: disableTwoFactor
                        }, toDisplayString(unref(t3)("profile.disable_two_factor")), 9, ["disabled"])) : (openBlock(), createBlock("button", {
                          key: 1,
                          type: "button",
                          class: "thm-btn",
                          disabled: twoFactorLoading.value,
                          onClick: enableTwoFactor
                        }, toDisplayString(unref(t3)("profile.enable_two_factor")), 9, ["disabled"]))
                      ])
                    ])
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("Modules/User/resources/assets/js/Pages/Portal/Profile.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const __vite_glob_0_31 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$9
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$8 = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    subscriptions: { type: Object, required: true },
    meta: { type: Object, default: () => ({}) }
  },
  setup(__props) {
    const props = __props;
    const page = usePage();
    const { t: t3 } = usePortalTranslations();
    const locale = computed(() => page.props.locale);
    const metaTitle = computed(() => {
      var _a;
      return ((_a = props.meta) == null ? void 0 : _a.title) || t3("pages.subscriptions_title");
    });
    const metaDescription = computed(() => {
      var _a;
      return ((_a = props.meta) == null ? void 0 : _a.description) || t3("pages.subscriptions_description");
    });
    const formatMoney = (amount, currency) => `${Number(amount ?? 0).toFixed(2)} ${currency || ""}`.trim();
    const subscriptionBadgeClass = (status) => {
      if (status === "active" || status === "trial") return "portal-badge--paid";
      if (status === "cancelled" || status === "expired") return "portal-badge--overdue";
      return "portal-badge--invoice";
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$w, mergeProps({
        title: unref(t3)("subscriptions.title"),
        subtitle: unref(t3)("subscriptions.subtitle"),
        active: "subscriptions",
        breadcrumbs: [
          { label: unref(t3)("menu.my_dashboard"), href: _ctx.route("portal.dashboard") },
          { label: unref(t3)("subscriptions.title") }
        ],
        "meta-title": metaTitle.value,
        "meta-description": metaDescription.value
      }, _attrs), {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          var _a, _b;
          if (_push2) {
            if (__props.subscriptions.data.length === 0) {
              _push2(`<div class="portal-panel"${_scopeId}><div class="portal-empty"${_scopeId}><i class="fas fa-sync-alt"${_scopeId}></i> ${ssrInterpolate(unref(t3)("subscriptions.no_subscriptions"))}</div></div>`);
            } else {
              _push2(`<div class="row g-4"${_scopeId}><!--[-->`);
              ssrRenderList(__props.subscriptions.data, (subscription) => {
                var _a2;
                _push2(`<div class="col-md-6 col-xl-4"${_scopeId}><article class="portal-project-card"${_scopeId}><div class="portal-project-card__top"${_scopeId}><h3 class="portal-project-card__title"${_scopeId}>${ssrInterpolate(subscription.name)}</h3><span class="${ssrRenderClass([subscriptionBadgeClass(subscription.status), "portal-badge"])}"${_scopeId}>${ssrInterpolate(subscription.status_label)}</span></div>`);
                if ((_a2 = subscription.company) == null ? void 0 : _a2.name) {
                  _push2(`<div class="portal-project-card__company"${_scopeId}><i class="fas fa-building me-1"${_scopeId}></i>${ssrInterpolate(subscription.company.name)}</div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<div class="portal-project-card__meta"${_scopeId}><span${_scopeId}>${ssrInterpolate(unref(t3)("subscriptions.amount"))}</span><strong${_scopeId}>${ssrInterpolate(formatMoney(subscription.amount, subscription.currency))}</strong></div><div class="portal-project-card__meta"${_scopeId}><span${_scopeId}>${ssrInterpolate(unref(t3)("subscriptions.billing_cycle"))}</span><strong${_scopeId}>${ssrInterpolate(subscription.billing_cycle_label)}</strong></div>`);
                if (subscription.renewal_at) {
                  _push2(`<div class="portal-project-card__meta"${_scopeId}><span${_scopeId}>${ssrInterpolate(unref(t3)("subscriptions.renewal_at"))}</span><strong${_scopeId}>${ssrInterpolate(subscription.renewal_at)}</strong></div>`);
                } else {
                  _push2(`<!---->`);
                }
                if (subscription.service_name) {
                  _push2(`<div class="portal-project-card__meta"${_scopeId}><span${_scopeId}>${ssrInterpolate(unref(t3)("subscriptions.service"))}</span><strong${_scopeId}>${ssrInterpolate(subscription.service_name)}</strong></div>`);
                } else {
                  _push2(`<!---->`);
                }
                if (subscription.auto_renew) {
                  _push2(`<div class="portal-project-card__meta"${_scopeId}><span${_scopeId}>${ssrInterpolate(unref(t3)("subscriptions.auto_renew"))}</span><strong${_scopeId}>${ssrInterpolate(unref(t3)("subscriptions.auto_renew_enabled"))}</strong></div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<div class="portal-project-card__footer"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Link), {
                  href: _ctx.route("portal.subscriptions.show", subscription.id),
                  class: "thm-btn w-100 text-center"
                }, {
                  default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(unref(t3)("subscriptions.view_details"))} <span class="${ssrRenderClass(`icon-${locale.value === "ar" ? "left" : "right"}-arrow`)}"${_scopeId2}></span>`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(unref(t3)("subscriptions.view_details")) + " ", 1),
                        createVNode("span", {
                          class: `icon-${locale.value === "ar" ? "left" : "right"}-arrow`
                        }, null, 2)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`</div></article></div>`);
              });
              _push2(`<!--]--></div>`);
            }
            if (((_a = __props.subscriptions.links) == null ? void 0 : _a.length) > 3) {
              _push2(`<nav class="portal-pagination" aria-label="Pagination"${_scopeId}><!--[-->`);
              ssrRenderList(__props.subscriptions.links, (link) => {
                _push2(ssrRenderComponent(unref(Link), {
                  key: link.label,
                  href: link.url || "#",
                  class: ["portal-pagination__link", { "portal-pagination__link--active": link.active }]
                }, null, _parent2, _scopeId));
              });
              _push2(`<!--]--></nav>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              __props.subscriptions.data.length === 0 ? (openBlock(), createBlock("div", {
                key: 0,
                class: "portal-panel"
              }, [
                createVNode("div", { class: "portal-empty" }, [
                  createVNode("i", { class: "fas fa-sync-alt" }),
                  createTextVNode(" " + toDisplayString(unref(t3)("subscriptions.no_subscriptions")), 1)
                ])
              ])) : (openBlock(), createBlock("div", {
                key: 1,
                class: "row g-4"
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(__props.subscriptions.data, (subscription) => {
                  var _a2;
                  return openBlock(), createBlock("div", {
                    key: subscription.id,
                    class: "col-md-6 col-xl-4"
                  }, [
                    createVNode("article", { class: "portal-project-card" }, [
                      createVNode("div", { class: "portal-project-card__top" }, [
                        createVNode("h3", { class: "portal-project-card__title" }, toDisplayString(subscription.name), 1),
                        createVNode("span", {
                          class: ["portal-badge", subscriptionBadgeClass(subscription.status)]
                        }, toDisplayString(subscription.status_label), 3)
                      ]),
                      ((_a2 = subscription.company) == null ? void 0 : _a2.name) ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "portal-project-card__company"
                      }, [
                        createVNode("i", { class: "fas fa-building me-1" }),
                        createTextVNode(toDisplayString(subscription.company.name), 1)
                      ])) : createCommentVNode("", true),
                      createVNode("div", { class: "portal-project-card__meta" }, [
                        createVNode("span", null, toDisplayString(unref(t3)("subscriptions.amount")), 1),
                        createVNode("strong", null, toDisplayString(formatMoney(subscription.amount, subscription.currency)), 1)
                      ]),
                      createVNode("div", { class: "portal-project-card__meta" }, [
                        createVNode("span", null, toDisplayString(unref(t3)("subscriptions.billing_cycle")), 1),
                        createVNode("strong", null, toDisplayString(subscription.billing_cycle_label), 1)
                      ]),
                      subscription.renewal_at ? (openBlock(), createBlock("div", {
                        key: 1,
                        class: "portal-project-card__meta"
                      }, [
                        createVNode("span", null, toDisplayString(unref(t3)("subscriptions.renewal_at")), 1),
                        createVNode("strong", null, toDisplayString(subscription.renewal_at), 1)
                      ])) : createCommentVNode("", true),
                      subscription.service_name ? (openBlock(), createBlock("div", {
                        key: 2,
                        class: "portal-project-card__meta"
                      }, [
                        createVNode("span", null, toDisplayString(unref(t3)("subscriptions.service")), 1),
                        createVNode("strong", null, toDisplayString(subscription.service_name), 1)
                      ])) : createCommentVNode("", true),
                      subscription.auto_renew ? (openBlock(), createBlock("div", {
                        key: 3,
                        class: "portal-project-card__meta"
                      }, [
                        createVNode("span", null, toDisplayString(unref(t3)("subscriptions.auto_renew")), 1),
                        createVNode("strong", null, toDisplayString(unref(t3)("subscriptions.auto_renew_enabled")), 1)
                      ])) : createCommentVNode("", true),
                      createVNode("div", { class: "portal-project-card__footer" }, [
                        createVNode(unref(Link), {
                          href: _ctx.route("portal.subscriptions.show", subscription.id),
                          class: "thm-btn w-100 text-center"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(unref(t3)("subscriptions.view_details")) + " ", 1),
                            createVNode("span", {
                              class: `icon-${locale.value === "ar" ? "left" : "right"}-arrow`
                            }, null, 2)
                          ]),
                          _: 1
                        }, 8, ["href"])
                      ])
                    ])
                  ]);
                }), 128))
              ])),
              ((_b = __props.subscriptions.links) == null ? void 0 : _b.length) > 3 ? (openBlock(), createBlock("nav", {
                key: 2,
                class: "portal-pagination",
                "aria-label": "Pagination"
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(__props.subscriptions.links, (link) => {
                  return openBlock(), createBlock(unref(Link), {
                    key: link.label,
                    href: link.url || "#",
                    class: ["portal-pagination__link", { "portal-pagination__link--active": link.active }],
                    innerHTML: link.label
                  }, null, 8, ["href", "class", "innerHTML"]);
                }), 128))
              ])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("Modules/User/resources/assets/js/Pages/Portal/Subscriptions/Index.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const __vite_glob_0_32 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$8
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$7 = {
  __name: "Show",
  __ssrInlineRender: true,
  props: {
    subscription: { type: Object, required: true },
    invoices: { type: Array, default: () => [] },
    meta: { type: Object, default: () => ({}) }
  },
  setup(__props) {
    const props = __props;
    const { t: t3, invoiceStatusLabel } = usePortalTranslations();
    const metaTitle = computed(() => {
      var _a;
      return ((_a = props.meta) == null ? void 0 : _a.title) || props.subscription.name;
    });
    const metaDescription = computed(() => {
      var _a;
      return ((_a = props.meta) == null ? void 0 : _a.description) || t3("pages.subscriptions_description");
    });
    const invoiceList = computed(() => {
      if (Array.isArray(props.invoices)) {
        return props.invoices;
      }
      return Object.values(props.invoices ?? {});
    });
    const formatMoney = (amount, currency) => `${Number(amount ?? 0).toFixed(2)} ${currency || ""}`.trim();
    const subscriptionBadgeClass = (status) => {
      if (status === "active" || status === "trial") return "portal-badge--paid";
      if (status === "cancelled" || status === "expired") return "portal-badge--overdue";
      return "portal-badge--invoice";
    };
    const invoiceBadgeClass = (status) => {
      if (status === "paid") return "portal-badge--paid";
      if (status === "overdue") return "portal-badge--overdue";
      return "portal-badge--invoice";
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(ssrRenderComponent(_sfc_main$w, mergeProps({
        title: __props.subscription.name,
        subtitle: (_a = __props.subscription.company) == null ? void 0 : _a.name,
        active: "subscriptions",
        breadcrumbs: [
          { label: unref(t3)("menu.my_dashboard"), href: _ctx.route("portal.dashboard") },
          { label: unref(t3)("subscriptions.title"), href: _ctx.route("portal.subscriptions.index") },
          { label: __props.subscription.name }
        ],
        "meta-title": metaTitle.value,
        "meta-description": metaDescription.value
      }, _attrs), {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          var _a2, _b;
          if (_push2) {
            _push2(`<div class="portal-grid portal-grid--show"${_scopeId}><div${_scopeId}><div class="portal-panel"${_scopeId}><div class="portal-panel__header"${_scopeId}><h2 class="portal-panel__title"${_scopeId}>${ssrInterpolate(unref(t3)("subscriptions.details"))}</h2></div><div class="portal-panel__body"${_scopeId}><div class="portal-details"${_scopeId}><div class="portal-details__row"${_scopeId}><div class="portal-details__label"${_scopeId}>${ssrInterpolate(unref(t3)("fields.status"))}</div><div class="portal-details__value"${_scopeId}><span class="${ssrRenderClass([subscriptionBadgeClass(__props.subscription.status), "portal-badge"])}"${_scopeId}>${ssrInterpolate(__props.subscription.status_label)}</span></div></div>`);
            if ((_a2 = __props.subscription.company) == null ? void 0 : _a2.name) {
              _push2(`<div class="portal-details__row"${_scopeId}><div class="portal-details__label"${_scopeId}>${ssrInterpolate(unref(t3)("fields.company"))}</div><div class="portal-details__value"${_scopeId}>${ssrInterpolate(__props.subscription.company.name)}</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="portal-details__row"${_scopeId}><div class="portal-details__label"${_scopeId}>${ssrInterpolate(unref(t3)("subscriptions.amount"))}</div><div class="portal-details__value"${_scopeId}>${ssrInterpolate(formatMoney(__props.subscription.amount, __props.subscription.currency))}</div></div><div class="portal-details__row"${_scopeId}><div class="portal-details__label"${_scopeId}>${ssrInterpolate(unref(t3)("subscriptions.billing_cycle"))}</div><div class="portal-details__value"${_scopeId}>${ssrInterpolate(__props.subscription.billing_cycle_label)}</div></div>`);
            if (__props.subscription.service_name) {
              _push2(`<div class="portal-details__row"${_scopeId}><div class="portal-details__label"${_scopeId}>${ssrInterpolate(unref(t3)("subscriptions.service"))}</div><div class="portal-details__value"${_scopeId}>${ssrInterpolate(__props.subscription.service_name)}</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.subscription.starts_at) {
              _push2(`<div class="portal-details__row"${_scopeId}><div class="portal-details__label"${_scopeId}>${ssrInterpolate(unref(t3)("subscriptions.starts_at"))}</div><div class="portal-details__value"${_scopeId}>${ssrInterpolate(__props.subscription.starts_at)}</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.subscription.ends_at) {
              _push2(`<div class="portal-details__row"${_scopeId}><div class="portal-details__label"${_scopeId}>${ssrInterpolate(unref(t3)("subscriptions.ends_at"))}</div><div class="portal-details__value"${_scopeId}>${ssrInterpolate(__props.subscription.ends_at)}</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.subscription.renewal_at) {
              _push2(`<div class="portal-details__row"${_scopeId}><div class="portal-details__label"${_scopeId}>${ssrInterpolate(unref(t3)("subscriptions.renewal_at"))}</div><div class="portal-details__value"${_scopeId}>${ssrInterpolate(__props.subscription.renewal_at)}</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.subscription.auto_renew) {
              _push2(`<div class="portal-details__row"${_scopeId}><div class="portal-details__label"${_scopeId}>${ssrInterpolate(unref(t3)("subscriptions.auto_renew"))}</div><div class="portal-details__value"${_scopeId}>${ssrInterpolate(unref(t3)("subscriptions.auto_renew_enabled"))}</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div></div></div><div class="portal-grid__stack"${_scopeId}><div class="portal-panel"${_scopeId}><div class="portal-panel__header"${_scopeId}><h2 class="portal-panel__title"${_scopeId}>${ssrInterpolate(unref(t3)("subscriptions.invoices"))}</h2></div><div class="portal-panel__body"${_scopeId}>`);
            if (invoiceList.value.length === 0) {
              _push2(`<div class="portal-empty"${_scopeId}><span class="portal-empty__icon"${_scopeId}><i class="fas fa-file-alt"${_scopeId}></i></span> ${ssrInterpolate(unref(t3)("subscriptions.no_invoices"))}</div>`);
            } else {
              _push2(`<div class="portal-invoice-list"${_scopeId}><!--[-->`);
              ssrRenderList(invoiceList.value, (invoice) => {
                _push2(`<article class="portal-invoice-card"${_scopeId}><div class="portal-invoice-card__top"${_scopeId}><div${_scopeId}><div class="portal-invoice-card__number"${_scopeId}>${ssrInterpolate(invoice.invoice_number)}</div><span class="${ssrRenderClass([invoiceBadgeClass(invoice.status), "portal-badge mt-2"])}"${_scopeId}>${ssrInterpolate(unref(invoiceStatusLabel)(invoice.status))}</span></div><div class="portal-invoice-card__total"${_scopeId}>${ssrInterpolate(formatMoney(invoice.total, invoice.currency))}</div></div><div class="portal-invoice-card__meta"${_scopeId}><div class="portal-invoice-card__meta-item"${_scopeId}><span${_scopeId}>${ssrInterpolate(unref(t3)("fields.issued_at"))}</span><strong${_scopeId}>${ssrInterpolate(invoice.issued_at || "—")}</strong></div><div class="portal-invoice-card__meta-item"${_scopeId}><span${_scopeId}>${ssrInterpolate(unref(t3)("fields.due_at"))}</span><strong${_scopeId}>${ssrInterpolate(invoice.due_at || "—")}</strong></div><div class="portal-invoice-card__meta-item"${_scopeId}><span${_scopeId}>${ssrInterpolate(unref(t3)("fields.paid_at"))}</span><strong${_scopeId}>${ssrInterpolate(invoice.paid_at || "—")}</strong></div></div><a${ssrRenderAttr("href", invoice.pdf_url)} class="portal-panel__action" target="_blank" rel="noopener"${_scopeId}><i class="fas fa-download"${_scopeId}></i> ${ssrInterpolate(unref(t3)("subscriptions.download_pdf"))}</a></article>`);
              });
              _push2(`<!--]--></div>`);
            }
            _push2(`</div></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "portal-grid portal-grid--show" }, [
                createVNode("div", null, [
                  createVNode("div", { class: "portal-panel" }, [
                    createVNode("div", { class: "portal-panel__header" }, [
                      createVNode("h2", { class: "portal-panel__title" }, toDisplayString(unref(t3)("subscriptions.details")), 1)
                    ]),
                    createVNode("div", { class: "portal-panel__body" }, [
                      createVNode("div", { class: "portal-details" }, [
                        createVNode("div", { class: "portal-details__row" }, [
                          createVNode("div", { class: "portal-details__label" }, toDisplayString(unref(t3)("fields.status")), 1),
                          createVNode("div", { class: "portal-details__value" }, [
                            createVNode("span", {
                              class: ["portal-badge", subscriptionBadgeClass(__props.subscription.status)]
                            }, toDisplayString(__props.subscription.status_label), 3)
                          ])
                        ]),
                        ((_b = __props.subscription.company) == null ? void 0 : _b.name) ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "portal-details__row"
                        }, [
                          createVNode("div", { class: "portal-details__label" }, toDisplayString(unref(t3)("fields.company")), 1),
                          createVNode("div", { class: "portal-details__value" }, toDisplayString(__props.subscription.company.name), 1)
                        ])) : createCommentVNode("", true),
                        createVNode("div", { class: "portal-details__row" }, [
                          createVNode("div", { class: "portal-details__label" }, toDisplayString(unref(t3)("subscriptions.amount")), 1),
                          createVNode("div", { class: "portal-details__value" }, toDisplayString(formatMoney(__props.subscription.amount, __props.subscription.currency)), 1)
                        ]),
                        createVNode("div", { class: "portal-details__row" }, [
                          createVNode("div", { class: "portal-details__label" }, toDisplayString(unref(t3)("subscriptions.billing_cycle")), 1),
                          createVNode("div", { class: "portal-details__value" }, toDisplayString(__props.subscription.billing_cycle_label), 1)
                        ]),
                        __props.subscription.service_name ? (openBlock(), createBlock("div", {
                          key: 1,
                          class: "portal-details__row"
                        }, [
                          createVNode("div", { class: "portal-details__label" }, toDisplayString(unref(t3)("subscriptions.service")), 1),
                          createVNode("div", { class: "portal-details__value" }, toDisplayString(__props.subscription.service_name), 1)
                        ])) : createCommentVNode("", true),
                        __props.subscription.starts_at ? (openBlock(), createBlock("div", {
                          key: 2,
                          class: "portal-details__row"
                        }, [
                          createVNode("div", { class: "portal-details__label" }, toDisplayString(unref(t3)("subscriptions.starts_at")), 1),
                          createVNode("div", { class: "portal-details__value" }, toDisplayString(__props.subscription.starts_at), 1)
                        ])) : createCommentVNode("", true),
                        __props.subscription.ends_at ? (openBlock(), createBlock("div", {
                          key: 3,
                          class: "portal-details__row"
                        }, [
                          createVNode("div", { class: "portal-details__label" }, toDisplayString(unref(t3)("subscriptions.ends_at")), 1),
                          createVNode("div", { class: "portal-details__value" }, toDisplayString(__props.subscription.ends_at), 1)
                        ])) : createCommentVNode("", true),
                        __props.subscription.renewal_at ? (openBlock(), createBlock("div", {
                          key: 4,
                          class: "portal-details__row"
                        }, [
                          createVNode("div", { class: "portal-details__label" }, toDisplayString(unref(t3)("subscriptions.renewal_at")), 1),
                          createVNode("div", { class: "portal-details__value" }, toDisplayString(__props.subscription.renewal_at), 1)
                        ])) : createCommentVNode("", true),
                        __props.subscription.auto_renew ? (openBlock(), createBlock("div", {
                          key: 5,
                          class: "portal-details__row"
                        }, [
                          createVNode("div", { class: "portal-details__label" }, toDisplayString(unref(t3)("subscriptions.auto_renew")), 1),
                          createVNode("div", { class: "portal-details__value" }, toDisplayString(unref(t3)("subscriptions.auto_renew_enabled")), 1)
                        ])) : createCommentVNode("", true)
                      ])
                    ])
                  ])
                ]),
                createVNode("div", { class: "portal-grid__stack" }, [
                  createVNode("div", { class: "portal-panel" }, [
                    createVNode("div", { class: "portal-panel__header" }, [
                      createVNode("h2", { class: "portal-panel__title" }, toDisplayString(unref(t3)("subscriptions.invoices")), 1)
                    ]),
                    createVNode("div", { class: "portal-panel__body" }, [
                      invoiceList.value.length === 0 ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "portal-empty"
                      }, [
                        createVNode("span", { class: "portal-empty__icon" }, [
                          createVNode("i", { class: "fas fa-file-alt" })
                        ]),
                        createTextVNode(" " + toDisplayString(unref(t3)("subscriptions.no_invoices")), 1)
                      ])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "portal-invoice-list"
                      }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(invoiceList.value, (invoice) => {
                          return openBlock(), createBlock("article", {
                            key: invoice.id,
                            class: "portal-invoice-card"
                          }, [
                            createVNode("div", { class: "portal-invoice-card__top" }, [
                              createVNode("div", null, [
                                createVNode("div", { class: "portal-invoice-card__number" }, toDisplayString(invoice.invoice_number), 1),
                                createVNode("span", {
                                  class: ["portal-badge mt-2", invoiceBadgeClass(invoice.status)]
                                }, toDisplayString(unref(invoiceStatusLabel)(invoice.status)), 3)
                              ]),
                              createVNode("div", { class: "portal-invoice-card__total" }, toDisplayString(formatMoney(invoice.total, invoice.currency)), 1)
                            ]),
                            createVNode("div", { class: "portal-invoice-card__meta" }, [
                              createVNode("div", { class: "portal-invoice-card__meta-item" }, [
                                createVNode("span", null, toDisplayString(unref(t3)("fields.issued_at")), 1),
                                createVNode("strong", null, toDisplayString(invoice.issued_at || "—"), 1)
                              ]),
                              createVNode("div", { class: "portal-invoice-card__meta-item" }, [
                                createVNode("span", null, toDisplayString(unref(t3)("fields.due_at")), 1),
                                createVNode("strong", null, toDisplayString(invoice.due_at || "—"), 1)
                              ]),
                              createVNode("div", { class: "portal-invoice-card__meta-item" }, [
                                createVNode("span", null, toDisplayString(unref(t3)("fields.paid_at")), 1),
                                createVNode("strong", null, toDisplayString(invoice.paid_at || "—"), 1)
                              ])
                            ]),
                            createVNode("a", {
                              href: invoice.pdf_url,
                              class: "portal-panel__action",
                              target: "_blank",
                              rel: "noopener"
                            }, [
                              createVNode("i", { class: "fas fa-download" }),
                              createTextVNode(" " + toDisplayString(unref(t3)("subscriptions.download_pdf")), 1)
                            ], 8, ["href"])
                          ]);
                        }), 128))
                      ]))
                    ])
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("Modules/User/resources/assets/js/Pages/Portal/Subscriptions/Show.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const __vite_glob_0_33 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$7
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$6 = {
  __name: "SiteErrorPage",
  __ssrInlineRender: true,
  props: {
    status: { type: [Number, String], required: true },
    title: { type: String, required: true },
    heading: { type: String, required: true },
    message: { type: String, required: true },
    description: { type: String, default: "" },
    keywords: { type: String, default: "" },
    showImage: { type: Boolean, default: false },
    showDebug: { type: Boolean, default: false },
    secondaryHref: { type: String, default: "" },
    secondaryLabel: { type: String, default: "" }
  },
  setup(__props) {
    const props = __props;
    const page = usePage();
    const trans = (key) => {
      var _a;
      return ((_a = page.props.translations) == null ? void 0 : _a[key]) || key;
    };
    const asset_path = computed(() => page.props.asset_path || "/");
    const locale = computed(() => page.props.locale || "en");
    const seo = computed(() => page.props.seo || {});
    const meta = computed(() => page.props.meta || {});
    const siteName = computed(() => seo.value.website_name || page.props.appName || "Symfonix");
    const metaTitle = computed(() => `${props.title} | ${siteName.value}`);
    const metaDescription = computed(() => meta.value.description || props.description || props.message);
    const metaKeywords = computed(() => meta.value.keywords || props.keywords);
    const metaImage = computed(() => {
      var _a, _b, _c, _d;
      return ((_b = (_a = meta.value) == null ? void 0 : _a.og) == null ? void 0 : _b.image) || ((_d = (_c = meta.value) == null ? void 0 : _c.twitter) == null ? void 0 : _d.image) || "";
    });
    const metaCanonical = computed(() => meta.value.canonical || "");
    const metaRobots = computed(() => meta.value.robots || "noindex, nofollow");
    const homeUrl = computed(() => {
      try {
        return route("home");
      } catch (e2) {
        return `/${locale.value}`;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), null, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<title${_scopeId}>${ssrInterpolate(metaTitle.value)}</title><meta name="description"${ssrRenderAttr("content", metaDescription.value)}${_scopeId}><meta name="keywords"${ssrRenderAttr("content", metaKeywords.value)}${_scopeId}><meta name="robots"${ssrRenderAttr("content", metaRobots.value)}${_scopeId}>`);
            if (metaCanonical.value) {
              _push2(`<link rel="canonical"${ssrRenderAttr("href", metaCanonical.value)}${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<meta property="og:title"${ssrRenderAttr("content", metaTitle.value)}${_scopeId}><meta property="og:description"${ssrRenderAttr("content", metaDescription.value)}${_scopeId}>`);
            if (metaImage.value) {
              _push2(`<meta property="og:image"${ssrRenderAttr("content", metaImage.value)}${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            if (metaCanonical.value) {
              _push2(`<meta property="og:url"${ssrRenderAttr("content", metaCanonical.value)}${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<meta property="og:type" content="website"${_scopeId}><meta name="twitter:card" content="summary_large_image"${_scopeId}><meta name="twitter:title"${ssrRenderAttr("content", metaTitle.value)}${_scopeId}><meta name="twitter:description"${ssrRenderAttr("content", metaDescription.value)}${_scopeId}>`);
            if (metaImage.value) {
              _push2(`<meta name="twitter:image"${ssrRenderAttr("content", metaImage.value)}${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("title", null, toDisplayString(metaTitle.value), 1),
              createVNode("meta", {
                name: "description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "keywords",
                content: metaKeywords.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "robots",
                content: metaRobots.value
              }, null, 8, ["content"]),
              metaCanonical.value ? (openBlock(), createBlock("link", {
                key: 0,
                rel: "canonical",
                href: metaCanonical.value
              }, null, 8, ["href"])) : createCommentVNode("", true),
              createVNode("meta", {
                property: "og:title",
                content: metaTitle.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              metaImage.value ? (openBlock(), createBlock("meta", {
                key: 1,
                property: "og:image",
                content: metaImage.value
              }, null, 8, ["content"])) : createCommentVNode("", true),
              metaCanonical.value ? (openBlock(), createBlock("meta", {
                key: 2,
                property: "og:url",
                content: metaCanonical.value
              }, null, 8, ["content"])) : createCommentVNode("", true),
              createVNode("meta", {
                property: "og:type",
                content: "website"
              }),
              createVNode("meta", {
                name: "twitter:card",
                content: "summary_large_image"
              }),
              createVNode("meta", {
                name: "twitter:title",
                content: metaTitle.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "twitter:description",
                content: metaDescription.value
              }, null, 8, ["content"]),
              metaImage.value ? (openBlock(), createBlock("meta", {
                key: 3,
                name: "twitter:image",
                content: metaImage.value
              }, null, 8, ["content"])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$R, null, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$N, { title: __props.title }, null, _parent2, _scopeId));
            _push2(`<section class="section-404 flat-spacing-3"${_scopeId}><div class="container"${_scopeId}><div class="content px-16 px-lg-0"${_scopeId}>`);
            if (__props.showImage) {
              _push2(`<div class="image"${_scopeId}><img loading="lazy" width="544" height="180"${ssrRenderAttr("src", asset_path.value + "qore/images/section/404.png")}${ssrRenderAttr("alt", __props.title)}${_scopeId}></div>`);
            } else {
              _push2(`<h2 class="title text-linear font-3"${_scopeId}>${ssrInterpolate(__props.status)}</h2>`);
            }
            _push2(`<h2 class="title text-linear font-3"${_scopeId}>${ssrInterpolate(__props.heading)}</h2><p class="desc"${_scopeId}>${ssrInterpolate(__props.message)}</p>`);
            if (__props.showDebug && (((_b = (_a = unref(page)) == null ? void 0 : _a.props) == null ? void 0 : _b.error) || ((_d = (_c = unref(page)) == null ? void 0 : _c.props) == null ? void 0 : _d.trace))) {
              _push2(`<div class="alert alert-danger text-start"${_scopeId}><strong${_scopeId}>Debug Error:</strong>`);
              if ((_f = (_e = unref(page)) == null ? void 0 : _e.props) == null ? void 0 : _f.error) {
                _push2(`<div${_scopeId}>${ssrInterpolate(unref(page).props.error)}</div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="d-flex justify-content-center gap-3"${_scopeId}>`);
            if (__props.secondaryHref) {
              _push2(ssrRenderComponent(unref(Link), {
                class: "tf-btn text-body-3 animate-btn",
                href: __props.secondaryHref
              }, {
                default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(__props.secondaryLabel)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(__props.secondaryLabel), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(unref(Link), {
              class: "tf-btn text-body-3 style-2 style-high-2 animate-btn animate-dark",
              href: homeUrl.value
            }, {
              default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(trans("Back To Home"))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(trans("Back To Home")), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div></div></section>`);
          } else {
            return [
              createVNode(_sfc_main$N, { title: __props.title }, null, 8, ["title"]),
              createVNode("section", { class: "section-404 flat-spacing-3" }, [
                createVNode("div", { class: "container" }, [
                  createVNode("div", { class: "content px-16 px-lg-0" }, [
                    __props.showImage ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "image"
                    }, [
                      createVNode("img", {
                        loading: "lazy",
                        width: "544",
                        height: "180",
                        src: asset_path.value + "qore/images/section/404.png",
                        alt: __props.title
                      }, null, 8, ["src", "alt"])
                    ])) : (openBlock(), createBlock("h2", {
                      key: 1,
                      class: "title text-linear font-3"
                    }, toDisplayString(__props.status), 1)),
                    createVNode("h2", { class: "title text-linear font-3" }, toDisplayString(__props.heading), 1),
                    createVNode("p", { class: "desc" }, toDisplayString(__props.message), 1),
                    __props.showDebug && (((_h = (_g = unref(page)) == null ? void 0 : _g.props) == null ? void 0 : _h.error) || ((_j = (_i = unref(page)) == null ? void 0 : _i.props) == null ? void 0 : _j.trace)) ? (openBlock(), createBlock("div", {
                      key: 2,
                      class: "alert alert-danger text-start"
                    }, [
                      createVNode("strong", null, "Debug Error:"),
                      ((_l = (_k = unref(page)) == null ? void 0 : _k.props) == null ? void 0 : _l.error) ? (openBlock(), createBlock("div", { key: 0 }, toDisplayString(unref(page).props.error), 1)) : createCommentVNode("", true)
                    ])) : createCommentVNode("", true),
                    createVNode("div", { class: "d-flex justify-content-center gap-3" }, [
                      __props.secondaryHref ? (openBlock(), createBlock(unref(Link), {
                        key: 0,
                        class: "tf-btn text-body-3 animate-btn",
                        href: __props.secondaryHref
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(__props.secondaryLabel), 1)
                        ]),
                        _: 1
                      }, 8, ["href"])) : createCommentVNode("", true),
                      createVNode(unref(Link), {
                        class: "tf-btn text-body-3 style-2 style-high-2 animate-btn animate-dark",
                        href: homeUrl.value
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(trans("Back To Home")), 1)
                        ]),
                        _: 1
                      }, 8, ["href"])
                    ])
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/SiteErrorPage.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _sfc_main$5 = {
  __name: "Error",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const trans = (key) => {
      var _a;
      try {
        return ((_a = page.props.translations) == null ? void 0 : _a[key]) || key;
      } catch (e2) {
        return key;
      }
    };
    const status = computed(() => Number(page.props.status || 500));
    const appEnv = computed(() => page.props.app_env || "production");
    const locale = computed(() => page.props.locale || "en");
    const catalog = {
      400: {
        status: 400,
        title: "400 Bad Request",
        heading: "Bad Request",
        message: "The request could not be understood or was invalid. Please check and try again.",
        description: "The request could not be processed due to invalid input.",
        keywords: "400 error, bad request, invalid request",
        showImage: false,
        showDebug: false,
        secondary: null
      },
      401: {
        status: 401,
        title: "401 Unauthorized",
        heading: "Authentication Required",
        message: "You need to sign in to access this page.",
        description: "Authentication is required to access this resource.",
        keywords: "401 error, unauthorized, login required",
        showImage: false,
        showDebug: false,
        secondary: "login"
      },
      403: {
        status: 403,
        title: "403 Forbidden",
        heading: "Access Denied",
        message: "You do not have permission to access this page.",
        description: "You are not allowed to access this resource.",
        keywords: "403 error, forbidden, access denied",
        showImage: false,
        showDebug: false,
        secondary: null
      },
      404: {
        status: 404,
        title: "404 Error",
        heading: "Oops! Page Not Found!",
        message: "The page you are looking for does not exist. It might have been moved or deleted.",
        description: "The page you are looking for could not be found.",
        keywords: "404 error, page not found, missing page",
        showImage: true,
        showDebug: false,
        secondary: null
      },
      500: {
        status: 500,
        title: "500 Error",
        heading: "Internal Server Error",
        message: "We're sorry, but something went wrong on our end. Please try again later or contact support if the problem persists.",
        description: "An internal server error occurred. Please try again later.",
        keywords: "500 error, server error, internal error",
        showImage: false,
        showDebug: true,
        secondary: null
      },
      503: {
        status: 503,
        title: "503 Service Unavailable",
        heading: "Service Unavailable",
        message: "The service is temporarily unavailable. Please try again in a few moments.",
        description: "The service is temporarily unavailable. Please try again later.",
        keywords: "503 error, service unavailable, maintenance",
        showImage: false,
        showDebug: false,
        secondary: null
      }
    };
    const config = computed(() => {
      const entry = catalog[status.value] || catalog[500];
      return {
        ...entry,
        showDebug: entry.showDebug && appEnv.value !== "production"
      };
    });
    const secondaryHref = computed(() => {
      if (config.value.secondary !== "login") {
        return "";
      }
      try {
        return route("login");
      } catch (e2) {
        return `/${locale.value}/login`;
      }
    });
    const secondaryLabel = computed(() => {
      return config.value.secondary === "login" ? trans("Login") : "";
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$6, mergeProps({
        status: config.value.status,
        title: trans(config.value.title),
        heading: trans(config.value.heading),
        message: trans(config.value.message),
        description: trans(config.value.description),
        keywords: trans(config.value.keywords),
        "show-image": config.value.showImage,
        "show-debug": config.value.showDebug,
        "secondary-href": secondaryHref.value,
        "secondary-label": secondaryLabel.value
      }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Error.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __vite_glob_1_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$5
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$4 = {
  __name: "Error400",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$5, _attrs, null, _parent));
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Error400.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __vite_glob_1_1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$4
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$3 = {
  __name: "Error401",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$5, _attrs, null, _parent));
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Error401.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __vite_glob_1_2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$3
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$2 = {
  __name: "Error403",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$5, _attrs, null, _parent));
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Error403.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __vite_glob_1_3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$2
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1 = {
  __name: "Error404",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$5, _attrs, null, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Error404.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __vite_glob_1_4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$1
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main = {
  __name: "Error500",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$5, _attrs, null, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Error500.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __vite_glob_1_5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main
}, Symbol.toStringTag, { value: "Module" }));
async function resolvePageComponent(path, pages) {
  for (const p2 of Array.isArray(path) ? path : [path]) {
    const page = pages[p2];
    if (typeof page === "undefined") {
      continue;
    }
    return typeof page === "function" ? page() : page;
  }
  throw new Error(`Page not found: ${path}`);
}
function t() {
  return t = Object.assign ? Object.assign.bind() : function(t3) {
    for (var e2 = 1; e2 < arguments.length; e2++) {
      var o2 = arguments[e2];
      for (var n2 in o2) ({}).hasOwnProperty.call(o2, n2) && (t3[n2] = o2[n2]);
    }
    return t3;
  }, t.apply(null, arguments);
}
const e = String.prototype.replace, o = /%20/g, n = { RFC1738: function(t3) {
  return e.call(t3, o, "+");
}, RFC3986: function(t3) {
  return String(t3);
} };
var r = "RFC3986";
const i = Object.prototype.hasOwnProperty, s = Array.isArray, u = /* @__PURE__ */ new WeakMap();
var l = function(t3, e2) {
  return u.set(t3, e2), t3;
};
function c(t3) {
  return u.has(t3);
}
var a = function(t3) {
  return u.get(t3);
}, f = function(t3, e2) {
  u.set(t3, e2);
};
const p = function() {
  const t3 = [];
  for (let e2 = 0; e2 < 256; ++e2) t3.push("%" + ((e2 < 16 ? "0" : "") + e2.toString(16)).toUpperCase());
  return t3;
}(), y = function(t3, e2) {
  const o2 = e2 && e2.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
  for (let e3 = 0; e3 < t3.length; ++e3) void 0 !== t3[e3] && (o2[e3] = t3[e3]);
  return o2;
}, d = function t2(e2, o2, n2) {
  if (!o2) return e2;
  if ("object" != typeof o2) {
    if (s(e2)) e2.push(o2);
    else {
      if (!e2 || "object" != typeof e2) return [e2, o2];
      if (c(e2)) {
        var r2 = a(e2) + 1;
        e2[r2] = o2, f(e2, r2);
      } else (n2 && (n2.plainObjects || n2.allowPrototypes) || !i.call(Object.prototype, o2)) && (e2[o2] = true);
    }
    return e2;
  }
  if (!e2 || "object" != typeof e2) {
    if (c(o2)) {
      for (var u2 = Object.keys(o2), p2 = n2 && n2.plainObjects ? { __proto__: null, 0: e2 } : { 0: e2 }, d2 = 0; d2 < u2.length; d2++) p2[parseInt(u2[d2], 10) + 1] = o2[u2[d2]];
      return l(p2, a(o2) + 1);
    }
    return [e2].concat(o2);
  }
  let h2 = e2;
  return s(e2) && !s(o2) && (h2 = y(e2, n2)), s(e2) && s(o2) ? (o2.forEach(function(o3, r3) {
    if (i.call(e2, r3)) {
      const i2 = e2[r3];
      i2 && "object" == typeof i2 && o3 && "object" == typeof o3 ? e2[r3] = t2(i2, o3, n2) : e2.push(o3);
    } else e2[r3] = o3;
  }), e2) : Object.keys(o2).reduce(function(e3, r3) {
    const s2 = o2[r3];
    return e3[r3] = i.call(e3, r3) ? t2(e3[r3], s2, n2) : s2, e3;
  }, h2);
}, h = 1024, b = function(t3, e2, o2, n2) {
  if (c(t3)) {
    var r2 = a(t3) + 1;
    return t3[r2] = e2, f(t3, r2), t3;
  }
  var i2 = [].concat(t3, e2);
  return i2.length > o2 ? l(y(i2, { plainObjects: n2 }), i2.length - 1) : i2;
}, m = function(t3, e2) {
  if (s(t3)) {
    const o2 = [];
    for (let n2 = 0; n2 < t3.length; n2 += 1) o2.push(e2(t3[n2]));
    return o2;
  }
  return e2(t3);
}, g = Object.prototype.hasOwnProperty, w = { brackets: function(t3) {
  return t3 + "[]";
}, comma: "comma", indices: function(t3, e2) {
  return t3 + "[" + e2 + "]";
}, repeat: function(t3) {
  return t3;
} }, v = Array.isArray, j = Array.prototype.push, $$1 = function(t3, e2) {
  j.apply(t3, v(e2) ? e2 : [e2]);
}, E = Date.prototype.toISOString, O = { addQueryPrefix: false, allowDots: false, allowEmptyArrays: false, arrayFormat: "indices", charset: "utf-8", charsetSentinel: false, delimiter: "&", encode: true, encodeDotInKeys: false, encoder: function(t3, e2, o2, n2, r2) {
  if (0 === t3.length) return t3;
  let i2 = t3;
  if ("symbol" == typeof t3 ? i2 = Symbol.prototype.toString.call(t3) : "string" != typeof t3 && (i2 = String(t3)), "iso-8859-1" === o2) return escape(i2).replace(/%u[0-9a-f]{4}/gi, function(t4) {
    return "%26%23" + parseInt(t4.slice(2), 16) + "%3B";
  });
  let s2 = "";
  for (let t4 = 0; t4 < i2.length; t4 += h) {
    const e3 = i2.length >= h ? i2.slice(t4, t4 + h) : i2, o3 = [];
    for (let t5 = 0; t5 < e3.length; ++t5) {
      let n3 = e3.charCodeAt(t5);
      45 === n3 || 46 === n3 || 95 === n3 || 126 === n3 || n3 >= 48 && n3 <= 57 || n3 >= 65 && n3 <= 90 || n3 >= 97 && n3 <= 122 || "RFC1738" === r2 && (40 === n3 || 41 === n3) ? o3[o3.length] = e3.charAt(t5) : n3 < 128 ? o3[o3.length] = p[n3] : n3 < 2048 ? o3[o3.length] = p[192 | n3 >> 6] + p[128 | 63 & n3] : n3 < 55296 || n3 >= 57344 ? o3[o3.length] = p[224 | n3 >> 12] + p[128 | n3 >> 6 & 63] + p[128 | 63 & n3] : (t5 += 1, n3 = 65536 + ((1023 & n3) << 10 | 1023 & e3.charCodeAt(t5)), o3[o3.length] = p[240 | n3 >> 18] + p[128 | n3 >> 12 & 63] + p[128 | n3 >> 6 & 63] + p[128 | 63 & n3]);
    }
    s2 += o3.join("");
  }
  return s2;
}, encodeValuesOnly: false, format: r, formatter: n[r], indices: false, serializeDate: function(t3) {
  return E.call(t3);
}, skipNulls: false, strictNullHandling: false }, T = {}, R = function(t3, e2, o2, n2, r2, i2, s2, u2, l2, c2, a2, f2, p2, y2, d2, h2, b2, g2) {
  let w2 = t3, j2 = g2, E2 = 0, _2 = false;
  for (; void 0 !== (j2 = j2.get(T)) && !_2; ) {
    const e3 = j2.get(t3);
    if (E2 += 1, void 0 !== e3) {
      if (e3 === E2) throw new RangeError("Cyclic object value");
      _2 = true;
    }
    void 0 === j2.get(T) && (E2 = 0);
  }
  if ("function" == typeof c2 ? w2 = c2(e2, w2) : w2 instanceof Date ? w2 = p2(w2) : "comma" === o2 && v(w2) && (w2 = m(w2, function(t4) {
    return t4 instanceof Date ? p2(t4) : t4;
  })), null === w2) {
    if (i2) return l2 && !h2 ? l2(e2, O.encoder, b2, "key", y2) : e2;
    w2 = "";
  }
  if ("string" == typeof (I2 = w2) || "number" == typeof I2 || "boolean" == typeof I2 || "symbol" == typeof I2 || "bigint" == typeof I2 || function(t4) {
    return !(!t4 || "object" != typeof t4 || !(t4.constructor && t4.constructor.isBuffer && t4.constructor.isBuffer(t4)));
  }(w2)) return l2 ? [d2(h2 ? e2 : l2(e2, O.encoder, b2, "key", y2)) + "=" + d2(l2(w2, O.encoder, b2, "value", y2))] : [d2(e2) + "=" + d2(String(w2))];
  var I2;
  const S2 = [];
  if (void 0 === w2) return S2;
  let A2;
  if ("comma" === o2 && v(w2)) h2 && l2 && (w2 = m(w2, l2)), A2 = [{ value: w2.length > 0 ? w2.join(",") || null : void 0 }];
  else if (v(c2)) A2 = c2;
  else {
    const t4 = Object.keys(w2);
    A2 = a2 ? t4.sort(a2) : t4;
  }
  const D2 = u2 ? e2.replace(/\./g, "%2E") : e2, k2 = n2 && v(w2) && 1 === w2.length ? D2 + "[]" : D2;
  if (r2 && v(w2) && 0 === w2.length) return k2 + "[]";
  for (let e3 = 0; e3 < A2.length; ++e3) {
    const m2 = A2[e3], j3 = "object" == typeof m2 && void 0 !== m2.value ? m2.value : w2[m2];
    if (s2 && null === j3) continue;
    const O2 = f2 && u2 ? m2.replace(/\./g, "%2E") : m2, _3 = v(w2) ? "function" == typeof o2 ? o2(k2, O2) : k2 : k2 + (f2 ? "." + O2 : "[" + O2 + "]");
    g2.set(t3, E2);
    const I3 = /* @__PURE__ */ new WeakMap();
    I3.set(T, g2), $$1(S2, R(j3, _3, o2, n2, r2, i2, s2, u2, "comma" === o2 && h2 && v(w2) ? null : l2, c2, a2, f2, p2, y2, d2, h2, b2, I3));
  }
  return S2;
}, _ = Object.prototype.hasOwnProperty, I = Array.isArray, S = { allowDots: false, allowEmptyArrays: false, allowPrototypes: false, allowSparse: false, arrayLimit: 20, charset: "utf-8", charsetSentinel: false, comma: false, decodeDotInKeys: false, decoder: function(t3, e2, o2) {
  const n2 = t3.replace(/\+/g, " ");
  if ("iso-8859-1" === o2) return n2.replace(/%[0-9a-f]{2}/gi, unescape);
  try {
    return decodeURIComponent(n2);
  } catch (t4) {
    return n2;
  }
}, delimiter: "&", depth: 5, duplicates: "combine", ignoreQueryPrefix: false, interpretNumericEntities: false, parameterLimit: 1e3, parseArrays: true, plainObjects: false, strictNullHandling: false }, A = function(t3) {
  return t3.replace(/&#(\d+);/g, function(t4, e2) {
    return String.fromCharCode(parseInt(e2, 10));
  });
}, D = function(t3, e2) {
  return t3 && "string" == typeof t3 && e2.comma && t3.indexOf(",") > -1 ? t3.split(",") : t3;
}, k = function(t3, e2, o2, n2) {
  if (!t3) return;
  const r2 = o2.allowDots ? t3.replace(/\.([^.[]+)/g, "[$1]") : t3, i2 = /(\[[^[\]]*])/g;
  let s2 = o2.depth > 0 && /(\[[^[\]]*])/.exec(r2);
  const u2 = s2 ? r2.slice(0, s2.index) : r2, l2 = [];
  if (u2) {
    if (!o2.plainObjects && _.call(Object.prototype, u2) && !o2.allowPrototypes) return;
    l2.push(u2);
  }
  let a2 = 0;
  for (; o2.depth > 0 && null !== (s2 = i2.exec(r2)) && a2 < o2.depth; ) {
    if (a2 += 1, !o2.plainObjects && _.call(Object.prototype, s2[1].slice(1, -1)) && !o2.allowPrototypes) return;
    l2.push(s2[1]);
  }
  return s2 && l2.push("[" + r2.slice(s2.index) + "]"), function(t4, e3, o3, n3) {
    let r3 = n3 ? e3 : D(e3, o3);
    for (let e4 = t4.length - 1; e4 >= 0; --e4) {
      let n4;
      const i3 = t4[e4];
      if ("[]" === i3 && o3.parseArrays) n4 = c(r3) ? r3 : o3.allowEmptyArrays && ("" === r3 || o3.strictNullHandling && null === r3) ? [] : b([], r3, o3.arrayLimit, o3.plainObjects);
      else {
        n4 = o3.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
        const t5 = "[" === i3.charAt(0) && "]" === i3.charAt(i3.length - 1) ? i3.slice(1, -1) : i3, e5 = o3.decodeDotInKeys ? t5.replace(/%2E/g, ".") : t5, s3 = parseInt(e5, 10);
        o3.parseArrays || "" !== e5 ? !isNaN(s3) && i3 !== e5 && String(s3) === e5 && s3 >= 0 && o3.parseArrays && s3 <= o3.arrayLimit ? (n4 = [], n4[s3] = r3) : "__proto__" !== e5 && (n4[e5] = r3) : n4 = { 0: r3 };
      }
      r3 = n4;
    }
    return r3;
  }(l2, e2, o2, n2);
};
function N(t3, e2) {
  const o2 = /* @__PURE__ */ function(t4) {
    return S;
  }();
  if ("" === t3 || null == t3) return o2.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
  const n2 = "string" == typeof t3 ? function(t4, e3) {
    const o3 = { __proto__: null }, n3 = (e3.ignoreQueryPrefix ? t4.replace(/^\?/, "") : t4).split(e3.delimiter, Infinity === e3.parameterLimit ? void 0 : e3.parameterLimit);
    let r3, i3 = -1, s2 = e3.charset;
    if (e3.charsetSentinel) for (r3 = 0; r3 < n3.length; ++r3) 0 === n3[r3].indexOf("utf8=") && ("utf8=%E2%9C%93" === n3[r3] ? s2 = "utf-8" : "utf8=%26%2310003%3B" === n3[r3] && (s2 = "iso-8859-1"), i3 = r3, r3 = n3.length);
    for (r3 = 0; r3 < n3.length; ++r3) {
      if (r3 === i3) continue;
      const t5 = n3[r3], u2 = t5.indexOf("]="), l2 = -1 === u2 ? t5.indexOf("=") : u2 + 1;
      let c2, a2;
      -1 === l2 ? (c2 = e3.decoder(t5, S.decoder, s2, "key"), a2 = e3.strictNullHandling ? null : "") : (c2 = e3.decoder(t5.slice(0, l2), S.decoder, s2, "key"), a2 = m(D(t5.slice(l2 + 1), e3), function(t6) {
        return e3.decoder(t6, S.decoder, s2, "value");
      })), a2 && e3.interpretNumericEntities && "iso-8859-1" === s2 && (a2 = A(a2)), t5.indexOf("[]=") > -1 && (a2 = I(a2) ? [a2] : a2);
      const f2 = _.call(o3, c2);
      f2 && "combine" === e3.duplicates ? o3[c2] = b(o3[c2], a2, e3.arrayLimit, e3.plainObjects) : f2 && "last" !== e3.duplicates || (o3[c2] = a2);
    }
    return o3;
  }(t3, o2) : t3;
  let r2 = o2.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
  const i2 = Object.keys(n2);
  for (let e3 = 0; e3 < i2.length; ++e3) {
    const s2 = i2[e3], u2 = k(s2, n2[s2], o2, "string" == typeof t3);
    r2 = d(r2, u2, o2);
  }
  return true === o2.allowSparse ? r2 : function(t4) {
    const e3 = [{ obj: { o: t4 }, prop: "o" }], o3 = [];
    for (let t5 = 0; t5 < e3.length; ++t5) {
      const n3 = e3[t5], r3 = n3.obj[n3.prop], i3 = Object.keys(r3);
      for (let t6 = 0; t6 < i3.length; ++t6) {
        const n4 = i3[t6], s2 = r3[n4];
        "object" == typeof s2 && null !== s2 && -1 === o3.indexOf(s2) && (e3.push({ obj: r3, prop: n4 }), o3.push(s2));
      }
    }
    return function(t5) {
      for (; t5.length > 1; ) {
        const e4 = t5.pop(), o4 = e4.obj[e4.prop];
        if (s(o4)) {
          const t6 = [];
          for (let e5 = 0; e5 < o4.length; ++e5) void 0 !== o4[e5] && t6.push(o4[e5]);
          e4.obj[e4.prop] = t6;
        }
      }
    }(e3), t4;
  }(r2);
}
class x {
  constructor(t3, e2, o2) {
    var n2, r2;
    this.name = t3, this.definition = e2, this.bindings = null != (n2 = e2.bindings) ? n2 : {}, this.wheres = null != (r2 = e2.wheres) ? r2 : {}, this.config = o2;
  }
  get template() {
    const t3 = `${this.origin}/${this.definition.uri}`.replace(/\/+$/, "");
    return "" === t3 ? "/" : t3;
  }
  get origin() {
    return this.config.absolute ? this.definition.domain ? `${this.config.url.match(/^\w+:\/\//)[0]}${this.definition.domain}${this.config.port ? `:${this.config.port}` : ""}` : this.config.url : "";
  }
  get parameterSegments() {
    var t3, e2;
    return null != (t3 = null == (e2 = this.template.match(/{[^}?]+\??}/g)) ? void 0 : e2.map((t4) => ({ name: t4.replace(/{|\??}/g, ""), required: !/\?}$/.test(t4) }))) ? t3 : [];
  }
  matchesUrl(t3) {
    var e2;
    if (!this.definition.methods.includes("GET")) return false;
    const o2 = this.template.replace(/[.*+$()[\]]/g, "\\$&").replace(/(\/?){([^}?]*)(\??)}/g, (t4, e3, o3, n3) => {
      var r3;
      const i3 = `(?<${o3}>${(null == (r3 = this.wheres[o3]) ? void 0 : r3.replace(/(^\^)|(\$$)/g, "")) || "[^/?]+"})`;
      return n3 ? `(${e3}${i3})?` : `${e3}${i3}`;
    }).replace(/^\w+:\/\//, ""), [n2, r2] = t3.replace(/^\w+:\/\//, "").split("?"), i2 = null != (e2 = new RegExp(`^${o2}/?$`).exec(n2)) ? e2 : new RegExp(`^${o2}/?$`).exec(decodeURI(n2));
    if (i2) {
      for (const t4 in i2.groups) i2.groups[t4] = "string" == typeof i2.groups[t4] ? decodeURIComponent(i2.groups[t4]) : i2.groups[t4];
      return { params: i2.groups, query: N(r2) };
    }
    return false;
  }
  compile(t3) {
    return this.parameterSegments.length ? this.template.replace(/{([^}?]+)(\??)}/g, (e2, o2, n2) => {
      var r2, i2;
      if (!n2 && [null, void 0].includes(t3[o2])) throw new Error(`Ziggy error: '${o2}' parameter is required for route '${this.name}'.`);
      if (this.wheres[o2] && !new RegExp(`^${n2 ? `(${this.wheres[o2]})?` : this.wheres[o2]}$`).test(null != (i2 = t3[o2]) ? i2 : "")) throw new Error(`Ziggy error: '${o2}' parameter '${t3[o2]}' does not match required format '${this.wheres[o2]}' for route '${this.name}'.`);
      return encodeURI(null != (r2 = t3[o2]) ? r2 : "").replace(/%7C/g, "|").replace(/%25/g, "%").replace(/\$/g, "%24");
    }).replace(this.config.absolute ? /(\.[^/]+?)(\/\/)/ : /(^)(\/\/)/, "$1/").replace(/\/+$/, "") : this.template;
  }
}
class C extends String {
  constructor(e2, o2, n2 = true, r2) {
    if (super(), this.t = null != r2 ? r2 : "undefined" != typeof Ziggy ? Ziggy : null == globalThis ? void 0 : globalThis.Ziggy, !this.t && "undefined" != typeof document && document.getElementById("ziggy-routes-json") && (globalThis.Ziggy = JSON.parse(document.getElementById("ziggy-routes-json").textContent), this.t = globalThis.Ziggy), this.t = t({}, this.t, { absolute: n2 }), e2) {
      if (!this.t.routes[e2]) throw new Error(`Ziggy error: route '${e2}' is not in the route list.`);
      this.i = new x(e2, this.t.routes[e2], this.t), this.u = this.l(o2);
    }
  }
  toString() {
    const e2 = Object.keys(this.u).filter((t3) => !this.i.parameterSegments.some(({ name: e3 }) => e3 === t3)).filter((t3) => "_query" !== t3).reduce((e3, o2) => t({}, e3, { [o2]: this.u[o2] }), {});
    return this.i.compile(this.u) + function(t3, e3) {
      let o2 = t3;
      const i2 = function(t4) {
        if (!t4) return O;
        if (void 0 !== t4.allowEmptyArrays && "boolean" != typeof t4.allowEmptyArrays) throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
        if (void 0 !== t4.encodeDotInKeys && "boolean" != typeof t4.encodeDotInKeys) throw new TypeError("`encodeDotInKeys` option can only be `true` or `false`, when provided");
        if (null != t4.encoder && "function" != typeof t4.encoder) throw new TypeError("Encoder has to be a function.");
        const e4 = t4.charset || O.charset;
        if (void 0 !== t4.charset && "utf-8" !== t4.charset && "iso-8859-1" !== t4.charset) throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
        let o3 = r;
        if (void 0 !== t4.format) {
          if (!g.call(n, t4.format)) throw new TypeError("Unknown format option provided.");
          o3 = t4.format;
        }
        const i3 = n[o3];
        let s3, u3 = O.filter;
        if (("function" == typeof t4.filter || v(t4.filter)) && (u3 = t4.filter), s3 = t4.arrayFormat in w ? t4.arrayFormat : "indices" in t4 ? t4.indices ? "indices" : "repeat" : O.arrayFormat, "commaRoundTrip" in t4 && "boolean" != typeof t4.commaRoundTrip) throw new TypeError("`commaRoundTrip` must be a boolean, or absent");
        return { addQueryPrefix: "boolean" == typeof t4.addQueryPrefix ? t4.addQueryPrefix : O.addQueryPrefix, allowDots: void 0 === t4.allowDots ? true === t4.encodeDotInKeys || O.allowDots : !!t4.allowDots, allowEmptyArrays: "boolean" == typeof t4.allowEmptyArrays ? !!t4.allowEmptyArrays : O.allowEmptyArrays, arrayFormat: s3, charset: e4, charsetSentinel: "boolean" == typeof t4.charsetSentinel ? t4.charsetSentinel : O.charsetSentinel, commaRoundTrip: t4.commaRoundTrip, delimiter: void 0 === t4.delimiter ? O.delimiter : t4.delimiter, encode: "boolean" == typeof t4.encode ? t4.encode : O.encode, encodeDotInKeys: "boolean" == typeof t4.encodeDotInKeys ? t4.encodeDotInKeys : O.encodeDotInKeys, encoder: "function" == typeof t4.encoder ? t4.encoder : O.encoder, encodeValuesOnly: "boolean" == typeof t4.encodeValuesOnly ? t4.encodeValuesOnly : O.encodeValuesOnly, filter: u3, format: o3, formatter: i3, serializeDate: "function" == typeof t4.serializeDate ? t4.serializeDate : O.serializeDate, skipNulls: "boolean" == typeof t4.skipNulls ? t4.skipNulls : O.skipNulls, sort: "function" == typeof t4.sort ? t4.sort : null, strictNullHandling: "boolean" == typeof t4.strictNullHandling ? t4.strictNullHandling : O.strictNullHandling };
      }(e3);
      let s2, u2;
      "function" == typeof i2.filter ? (u2 = i2.filter, o2 = u2("", o2)) : v(i2.filter) && (u2 = i2.filter, s2 = u2);
      const l2 = [];
      if ("object" != typeof o2 || null === o2) return "";
      const c2 = w[i2.arrayFormat], a2 = "comma" === c2 && i2.commaRoundTrip;
      s2 || (s2 = Object.keys(o2)), i2.sort && s2.sort(i2.sort);
      const f2 = /* @__PURE__ */ new WeakMap();
      for (let t4 = 0; t4 < s2.length; ++t4) {
        const e4 = s2[t4];
        i2.skipNulls && null === o2[e4] || $$1(l2, R(o2[e4], e4, c2, a2, i2.allowEmptyArrays, i2.strictNullHandling, i2.skipNulls, i2.encodeDotInKeys, i2.encode ? i2.encoder : null, i2.filter, i2.sort, i2.allowDots, i2.serializeDate, i2.format, i2.formatter, i2.encodeValuesOnly, i2.charset, f2));
      }
      const p2 = l2.join(i2.delimiter);
      let y2 = true === i2.addQueryPrefix ? "?" : "";
      return i2.charsetSentinel && (y2 += "iso-8859-1" === i2.charset ? "utf8=%26%2310003%3B&" : "utf8=%E2%9C%93&"), p2.length > 0 ? y2 + p2 : "";
    }(t({}, e2, this.u._query), { addQueryPrefix: true, arrayFormat: "indices", encodeValuesOnly: true, skipNulls: true, encoder: (t3, e3) => "boolean" == typeof t3 ? Number(t3) : e3(t3) });
  }
  p(e2) {
    e2 ? this.t.absolute && e2.startsWith("/") && (e2 = this.h().host + e2) : e2 = this.m();
    let o2 = {};
    const [n2, r2] = Object.entries(this.t.routes).find(([t3, n3]) => o2 = new x(t3, n3, this.t).matchesUrl(e2)) || [void 0, void 0];
    return t({ name: n2 }, o2, { route: r2 });
  }
  m() {
    const { host: t3, pathname: e2, search: o2 } = this.h();
    return (this.t.absolute ? t3 + e2 : e2.replace(this.t.url.replace(/^\w*:\/\/[^/]+/, ""), "").replace(/^\/+/, "/")) + o2;
  }
  current(e2, o2) {
    const { name: n2, params: r2, query: i2, route: s2 } = this.p();
    if (!e2) return n2;
    const u2 = new RegExp(`^${e2.replace(/\./g, "\\.").replace(/\*/g, ".*")}$`).test(n2);
    if ([null, void 0].includes(o2) || !u2) return u2;
    const l2 = new x(n2, s2, this.t);
    o2 = this.l(o2, l2);
    const c2 = t({}, r2, i2);
    if (Object.values(o2).every((t3) => !t3) && !Object.values(c2).some((t3) => void 0 !== t3)) return true;
    const a2 = (t3, e3) => Object.entries(t3).every(([t4, o3]) => Array.isArray(o3) && Array.isArray(e3[t4]) ? o3.every((o4) => e3[t4].includes(o4) || e3[t4].includes(decodeURIComponent(o4))) : "object" == typeof o3 && "object" == typeof e3[t4] && null !== o3 && null !== e3[t4] ? a2(o3, e3[t4]) : e3[t4] == o3 || e3[t4] == decodeURIComponent(o3));
    return a2(o2, c2);
  }
  h() {
    var t3, e2, o2, n2, r2, i2;
    const { host: s2 = "", pathname: u2 = "", search: l2 = "" } = "undefined" != typeof window ? window.location : {};
    return { host: null != (t3 = null == (e2 = this.t.location) ? void 0 : e2.host) ? t3 : s2, pathname: null != (o2 = null == (n2 = this.t.location) ? void 0 : n2.pathname) ? o2 : u2, search: null != (r2 = null == (i2 = this.t.location) ? void 0 : i2.search) ? r2 : l2 };
  }
  get params() {
    const { params: e2, query: o2 } = this.p();
    return t({}, e2, o2);
  }
  get routeParams() {
    return this.p().params;
  }
  get queryParams() {
    return this.p().query;
  }
  has(t3) {
    return this.t.routes.hasOwnProperty(t3);
  }
  l(e2 = {}, o2 = this.i) {
    null != e2 || (e2 = {}), e2 = ["string", "number"].includes(typeof e2) ? [e2] : e2;
    const n2 = o2.parameterSegments.filter(({ name: t3 }) => !this.t.defaults[t3]);
    return Array.isArray(e2) ? e2 = e2.reduce((e3, o3, r2) => t({}, e3, n2[r2] ? { [n2[r2].name]: o3 } : "object" == typeof o3 ? o3 : { [o3]: "" }), {}) : 1 !== n2.length || e2.hasOwnProperty(n2[0].name) || !e2.hasOwnProperty(Object.values(o2.bindings)[0]) && !e2.hasOwnProperty("id") || (e2 = { [n2[0].name]: e2 }), t({}, this.v(o2), this.j(e2, o2));
  }
  v(e2) {
    return e2.parameterSegments.filter(({ name: t3 }) => this.t.defaults[t3]).reduce((e3, { name: o2 }, n2) => t({}, e3, { [o2]: this.t.defaults[o2] }), {});
  }
  j(e2, { bindings: o2, parameterSegments: n2 }) {
    return Object.entries(e2).reduce((e3, [r2, i2]) => {
      if (!i2 || "object" != typeof i2 || Array.isArray(i2) || !n2.some(({ name: t3 }) => t3 === r2)) return t({}, e3, { [r2]: i2 });
      const s2 = i2.hasOwnProperty(o2[r2]) ? o2[r2] : i2.hasOwnProperty("id") ? "id" : void 0;
      if (void 0 === s2) throw new Error(`Ziggy error: object passed as '${r2}' parameter is missing route model binding key '${o2[r2]}'.`);
      return t({}, e3, { [r2]: i2[s2] });
    }, {});
  }
  valueOf() {
    return this.toString();
  }
}
function P(t3, e2, o2, n2) {
  const r2 = new C(t3, e2, o2, n2);
  return t3 ? r2.toString() : r2;
}
const U = { install(t3, e2) {
  const o2 = (t4, o3, n2, r2 = e2) => P(t4, o3, n2, r2);
  parseInt(t3.version) > 2 ? (t3.config.globalProperties.route = o2, t3.provide("route", o2)) : t3.mixin({ methods: { route: o2 } });
} };
createServer(
  (page) => createInertiaApp({
    page,
    render: renderToString,
    resolve: (name) => {
      const modules = name.split("::");
      if (modules.length > 1) {
        return resolvePageComponent(
          `../../Modules/${modules[0]}/resources/assets/js/Pages/${modules[1]}.vue`,
          /* @__PURE__ */ Object.assign({
            "../../Modules/Base/resources/assets/js/Pages/Index.vue": __vite_glob_0_0,
            "../../Modules/CRM/resources/assets/js/Pages/Index.vue": __vite_glob_0_1,
            "../../Modules/CRM/resources/assets/js/Pages/QuoteShow.vue": __vite_glob_0_2,
            "../../Modules/Cms/resources/assets/js/Pages/AboutUs.vue": __vite_glob_0_3,
            "../../Modules/Cms/resources/assets/js/Pages/BlogIndex.vue": __vite_glob_0_4,
            "../../Modules/Cms/resources/assets/js/Pages/BlogShow.vue": __vite_glob_0_5,
            "../../Modules/Cms/resources/assets/js/Pages/Faq.vue": __vite_glob_0_6,
            "../../Modules/Cms/resources/assets/js/Pages/PageShow.vue": __vite_glob_0_7,
            "../../Modules/Cms/resources/assets/js/Pages/PrivacyPolicy.vue": __vite_glob_0_8,
            "../../Modules/Cms/resources/assets/js/Pages/Team.vue": __vite_glob_0_9,
            "../../Modules/Cms/resources/assets/js/Pages/Testimonials.vue": __vite_glob_0_10,
            "../../Modules/Product/resources/assets/js/Pages/ProductIndex.vue": __vite_glob_0_11,
            "../../Modules/Product/resources/assets/js/Pages/ProductShow.vue": __vite_glob_0_12,
            "../../Modules/Project/resources/assets/js/Pages/Portal/Projects/Index.vue": __vite_glob_0_13,
            "../../Modules/Project/resources/assets/js/Pages/Portal/Projects/Show.vue": __vite_glob_0_14,
            "../../Modules/Project/resources/assets/js/Pages/UseCaseIndex.vue": __vite_glob_0_15,
            "../../Modules/Project/resources/assets/js/Pages/UseCaseShow.vue": __vite_glob_0_16,
            "../../Modules/Services/resources/assets/js/Pages/ServiceIndex.vue": __vite_glob_0_17,
            "../../Modules/Services/resources/assets/js/Pages/ServiceShow.vue": __vite_glob_0_18,
            "../../Modules/Support/resources/assets/js/Pages/Portal/Tickets/Create.vue": __vite_glob_0_19,
            "../../Modules/Support/resources/assets/js/Pages/Portal/Tickets/Index.vue": __vite_glob_0_20,
            "../../Modules/Support/resources/assets/js/Pages/Portal/Tickets/Show.vue": __vite_glob_0_21,
            "../../Modules/User/resources/assets/js/Pages/Auth/ForgotPassword.vue": __vite_glob_0_22,
            "../../Modules/User/resources/assets/js/Pages/Auth/Login.vue": __vite_glob_0_23,
            "../../Modules/User/resources/assets/js/Pages/Auth/Register.vue": __vite_glob_0_24,
            "../../Modules/User/resources/assets/js/Pages/Auth/ResetPassword.vue": __vite_glob_0_25,
            "../../Modules/User/resources/assets/js/Pages/Auth/TwoFactorChallenge.vue": __vite_glob_0_26,
            "../../Modules/User/resources/assets/js/Pages/Jobs/Index.vue": __vite_glob_0_27,
            "../../Modules/User/resources/assets/js/Pages/Jobs/Show.vue": __vite_glob_0_28,
            "../../Modules/User/resources/assets/js/Pages/Portal/ConfirmPassword.vue": __vite_glob_0_29,
            "../../Modules/User/resources/assets/js/Pages/Portal/Dashboard.vue": __vite_glob_0_30,
            "../../Modules/User/resources/assets/js/Pages/Portal/Profile.vue": __vite_glob_0_31,
            "../../Modules/User/resources/assets/js/Pages/Portal/Subscriptions/Index.vue": __vite_glob_0_32,
            "../../Modules/User/resources/assets/js/Pages/Portal/Subscriptions/Show.vue": __vite_glob_0_33
          })
        );
      }
      return resolvePageComponent(
        `./Pages/${name}.vue`,
        /* @__PURE__ */ Object.assign({ "./Pages/Error.vue": __vite_glob_1_0, "./Pages/Error400.vue": __vite_glob_1_1, "./Pages/Error401.vue": __vite_glob_1_2, "./Pages/Error403.vue": __vite_glob_1_3, "./Pages/Error404.vue": __vite_glob_1_4, "./Pages/Error500.vue": __vite_glob_1_5 })
      );
    },
    setup({ App, props, plugin }) {
      var _a, _b, _c;
      const ziggyProps = ((_b = (_a = props.initialPage) == null ? void 0 : _a.props) == null ? void 0 : _b.ziggy) || ((_c = page.props) == null ? void 0 : _c.ziggy) || {};
      const ziggyConfig = {
        ...ziggyProps,
        location: new URL(ziggyProps.location || "http://localhost")
      };
      return createSSRApp({
        render: () => h$1(App, props)
      }).use(plugin).use(U, ziggyConfig);
    }
  })
);
