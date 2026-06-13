<?php

namespace App\Http\Controllers\Api\Frontend;

use App\Enums\PageEnum;
use App\Enums\SectionEnum;
use App\Helpers\Helper;
use App\Http\Controllers\Controller;
use App\Models\CMS;
use App\Models\Property;
use App\Models\Setting;
use App\Traits\CMSData;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class HomeController extends Controller
{
    use CMSData;
    public function index()
    {
        $data = [];

        $cmsData = CMS::all()->makeHidden(['created_at', 'updated_at']);

        $data['home_example']  = $cmsData->where('page', PageEnum::HOME)->where('section', SectionEnum::EXAMPLE)->first();
        $data['home_examples'] = $cmsData->where('page', PageEnum::HOME)->where('section', SectionEnum::EXAMPLES)->values();
        $data['home_about']    = $cmsData->where('page', PageEnum::HOME)->where('section', SectionEnum::ABOUT)->first();
        $data['common']        = $cmsData->where('page', PageEnum::COMMON);

        $data['settings'] = Setting::first();

        return Helper::jsonResponse(true, 'Home Page', 200, $data);
    }

    public function footer()
    {
        $cmsData = CMS::all()->makeHidden(['created_at', 'updated_at']);

        $footer  = $cmsData->where('page', PageEnum::COMMON)->where('section', SectionEnum::FOOTER)->first();


        $data = [
            'description' => $footer->description ?? null,
            'twitter'     => $footer->metadata['twitter'] ?? null,
            'linkedin'    => $footer->metadata['linkedin'] ?? null,
        ];

        return Helper::jsonResponse(true, 'Footer Data', 200, $data);
    }


    public function divisions(Request $request)
    {


        $data = [];


        if ($request->type == 'division') {
            $data = DB::table('divisions')->get();
        }

        if ($request->type == 'district') {
            $data = DB::table('districts')->get();
        }

        if ($request->type == 'upazila') {
            $data = DB::table('upazilas')->get();
        }


        return Helper::jsonResponse(true, 'All Divisions', 200, [
            'data' => $data,
        ]);
    }


    public function propertyList(Request $request)
    {

        $query = Property::with('category', 'division', 'district', 'upazila', 'images');

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }


        if ($request->has('month_id')) {
            $query->where('month_id', $request->month_id);
        }


        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('division_id')) {
            $query->where('division_id', $request->division_id);
        }

        if ($request->has('district_id')) {
            $query->where('district_id', $request->district_id);
        }

        if ($request->has('upazila_id')) {
            $query->where('upazila_id', $request->upazila_id);
        }

        if ($request->has('price_min')) {
            $query->where('rent_amount', '>=', $request->price_min);
        }

        if ($request->has('price_max')) {
            $query->where('rent_amount', '<=', $request->price_max);
        }

        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%')
                ->orWhere('description', 'like', '%' . $request->search . '%');
        }




        if ($request->has('sort')) {
            $query->orderBy($request->sort, $request->sort_order ?? 'asc');
        }

        $properties = $query->get();

        return Helper::jsonResponse(true, 'Properties retrieved successfully', 200, $properties);
    }
}
