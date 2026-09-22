<?php

namespace Modules\Product\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Base\Models\Seo;
use Modules\Base\Support\Meta;
use Modules\Base\Support\Schema;
use Modules\Product\Models\Product;
use Modules\Product\Models\ProductCategory;
use Modules\SearchEngine\Models\SearchKeyword;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $locale = app()->getLocale();
        $query = Product::query()
            ->published()
            ->active()
            ->with('category:id,name,slug');

        if ($request->filled('search')) {
            $search = mb_strtolower(trim((string) $request->search), 'UTF-8');
            $locales = array_keys(config('laravellocalization.supportedLocales', ['en' => [], 'ar' => []]));

            $query->where(function ($q) use ($search, $locales) {
                $q->where('sku', 'like', "%{$search}%");

                foreach ($locales as $loc) {
                    $q->orWhereRaw("LOWER(JSON_UNQUOTE(JSON_EXTRACT(name, '$.{$loc}'))) LIKE ?", ["%{$search}%"])
                        ->orWhereRaw("LOWER(JSON_UNQUOTE(JSON_EXTRACT(short_description, '$.{$loc}'))) LIKE ?", ["%{$search}%"])
                        ->orWhereRaw("LOWER(JSON_UNQUOTE(JSON_EXTRACT(description, '$.{$loc}'))) LIKE ?", ["%{$search}%"]);
                }
            });

            if ($search !== '') {
                $keyword = SearchKeyword::firstOrNew(['keyword' => $search]);
                $keyword->count = ($keyword->count ?? 0) + 1;
                $keyword->save();
            }
        }

        if ($request->filled('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        $totalProductsCount = Product::query()->published()->active()->count();
        $products = $query->latest()->paginate(12)->through(
            fn (Product $product) => $this->mapProduct($product, $locale)
        );

        $categories = ProductCategory::query()
            ->withCount(['products' => function ($q) {
                $q->published()->active();
            }])
            ->get()
            ->map(function (ProductCategory $category) use ($locale) {
                return [
                    'id' => $category->id,
                    'name' => $category->getTranslation('name', $locale),
                    'slug' => $category->slug,
                    'products_count' => $category->products_count,
                ];
            });

        $recentProducts = Product::query()
            ->published()
            ->active()
            ->latest()
            ->limit(6)
            ->get()
            ->map(fn (Product $product) => $this->mapProduct($product, $locale));

        $siteName = Seo::get('website_name', config('app.name'));
        $canonical = route('product.index');
        $meta = (new Meta)
            ->title(__('product::product.pages.catalog_title').' | '.$siteName)
            ->description(__('product::product.meta.index_description'))
            ->keywords(__('product::product.meta.index_keywords'))
            ->ogImage()
            ->twitterImage()
            ->canonical($canonical)
            ->toArray();

        $listItems = collect($products->items())->take(20)->map(function (array $product) {
            return [
                'name' => $product['name'] ?? '',
                'url' => isset($product['slug']) ? route('product.show', ['slug' => $product['slug']]) : '',
            ];
        })->filter(fn ($item) => $item['name'] !== '' && $item['url'] !== '')->values()->all();

        return $this->inertia('Product::ProductIndex', [
            'products' => $products,
            'categories' => $categories,
            'recentProducts' => $recentProducts,
            'totalProductsCount' => $totalProductsCount,
            'filters' => [
                'search' => $request->search,
                'category' => $request->category,
            ],
            'structuredData' => [
                Schema::breadcrumbs([
                    ['name' => __('Home'), 'url' => route('home')],
                    ['name' => __('product::product.pages.catalog_title'), 'url' => $canonical],
                ]),
                Schema::itemList(__('product::product.pages.catalog_title'), $listItems, $canonical),
            ],
        ], $meta);
    }

    public function show(string $slug)
    {
        $locale = app()->getLocale();
        $product = Product::query()
            ->published()
            ->active()
            ->where('slug', $slug)
            ->with('category:id,name,slug')
            ->firstOrFail();

        $related = Product::query()
            ->published()
            ->active()
            ->where('id', '!=', $product->id)
            ->when($product->product_category_id, fn ($query) => $query->where('product_category_id', $product->product_category_id))
            ->with('category:id,name,slug')
            ->latest()
            ->limit(3)
            ->get()
            ->map(fn (Product $item) => $this->mapProduct($item, $locale));

        $canonical = route('product.show', ['slug' => $product->slug]);

        $meta = (new Meta)
            ->title($product->seoTitle($locale).' | '.Seo::get('website_name', config('app.name')))
            ->description($product->seoDescription($locale))
            ->keywords($product->seoKeywords($locale))
            ->ogImage($product->seoMetaImageLink())
            ->twitterImage($product->seoMetaImageLink())
            ->type('product')
            ->canonical($canonical)
            ->toArray();

        $structuredData = [
            Schema::breadcrumbs([
                ['name' => __('Home'), 'url' => route('home')],
                ['name' => __('product::product.pages.catalog_title'), 'url' => route('product.index')],
                ['name' => $product->getTranslation('name', $locale), 'url' => $canonical],
            ]),
            Schema::product([
                'name' => $product->getTranslation('name', $locale),
                'description' => $product->seoDescription($locale) ?: $product->getTranslation('short_description', $locale),
                'image' => $product->main_image_link,
                'url' => $canonical,
                'sku' => $product->sku,
                'category' => $product->category?->getTranslation('name', $locale),
                'price' => $product->price,
                'currency' => $product->currency ?: 'USD',
                'availability' => $product->status === Product::STATUS_ACTIVE
                    ? 'https://schema.org/InStock'
                    : 'https://schema.org/OutOfStock',
                'locale' => $locale,
            ]),
        ];

        return $this->inertia('Product::ProductShow', [
            'structuredData' => $structuredData,
            'product' => $this->mapProduct($product, $locale, detailed: true),
            'relatedProducts' => $related,
        ], $meta);
    }

    private function mapProduct(Product $product, string $locale, bool $detailed = false): array
    {
        $data = [
            'id' => $product->id,
            'name' => $product->getTranslation('name', $locale),
            'slug' => $product->slug,
            'short_description' => $product->getTranslation('short_description', $locale),
            'main_image_link' => $product->main_image_link,
            'is_featured' => $product->is_featured,
            'price' => $product->price,
            'currency' => $product->currency ?: 'USD',
            'billing_type' => $product->billing_type,
            'created_at' => $product->created_at?->format('d M Y'),
            'category' => $product->category ? [
                'id' => $product->category->id,
                'name' => $product->category->getTranslation('name', $locale),
                'slug' => $product->category->slug,
            ] : null,
        ];

        if ($detailed) {
            $data['description'] = $product->getTranslation('description', $locale);
            $data['sku'] = $product->sku;
            $data['seo_title'] = $product->seoTitle($locale);
            $data['seo_description'] = $product->seoDescription($locale);
        }

        return $data;
    }
}
