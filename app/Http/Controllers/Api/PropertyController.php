<?php

namespace App\Http\Controllers\Api;

use App\Helpers\Helper;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Division;
use App\Models\Facility;
use App\Models\Property;
use App\Models\PropertyImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class PropertyController extends Controller
{
    /**
     * Get form dependencies (categories, facilities, divisions).
     */
    public function index()
    {
        $user = auth('api')->user();
        $properties = Property::where('user_id', $user->id)->with('category', 'division', 'district', 'upazila', 'images')->get();
        return Helper::jsonResponse(true, 'Properties retrieved successfully', 200, $properties);
    }

    /**
     * Get form dependencies (categories, facilities, divisions).
     */
    public function getFormData()
    {
        $categories = Category::select('id', 'name')->get();
        $facilities = Facility::select('id', 'name_en', 'name_bn', 'icon')->get();
        $divisions = Division::select('id', 'name_en', 'name_bn')->get();
        $months = \App\Models\Month::select('id', 'name_en', 'name_bn')->get();

        return Helper::jsonResponse(true, 'Form data retrieved successfully', 200, [
            'categories' => $categories,
            'facilities' => $facilities,
            'divisions' => $divisions,
            'months' => $months,
        ]);
    }

    /**
     * Store a new property listing.
     */
    public function store(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'category_id' => 'nullable|exists:categories,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'rent_amount' => 'required|numeric|min:0',
            'is_negotiable' => 'nullable|boolean',
            'for_whom' => 'nullable|string|max:100',
            'month_id' => 'nullable|integer|max:12',
            'is_available_immediately' => 'nullable|boolean',
            'advance_month' => 'nullable|integer|min:0',
            'service_charge' => 'nullable|numeric|min:0',
            'rent_type' => 'nullable|in:monthly,yearly',
            'beds' => 'nullable|integer|min:0',
            'baths' => 'nullable|integer|min:0',
            'balconies' => 'nullable|integer|min:0',
            'floor_no' => 'nullable|string|max:50',
            'size_sqft' => 'nullable|integer|min:0',
            'division_id' => 'nullable|exists:divisions,id',
            'district_id' => 'required|exists:districts,id',
            'upazila_id' => 'required|exists:upazilas,id',
            'area' => 'nullable|string|max:255',
            'address' => 'required|string',
            'map_link' => 'nullable|url',
            'gas_bill_included' => 'nullable|boolean',
            'electricity_bill_included' => 'nullable|boolean',
            'water_bill_included' => 'nullable|boolean',
            'market_distance_km' => 'nullable|numeric|min:0',
            'contact_name' => 'nullable|string|max:255',
            'contact_type' => 'nullable|string|max:50',
            'contact_mobile_number' => 'required|string|max:20',
            'contact_whatsapp_number' => 'nullable|string|max:20',
            'hide_contact_number' => 'nullable|boolean',
            'special_terms' => 'nullable|string',
            'facilities' => 'nullable|array',
            'facilities.*' => 'exists:facilities,id',
            'thumbnail' => 'nullable|file|mimes:jpeg,png,jpg|max:5120', // 5MB max
            'images' => 'nullable|array',
            'images.*' => 'file|mimes:jpeg,png,jpg,gif,mp4,mov,avi|max:20480', // 20MB max per file
        ]);

        if ($validator->fails()) {
            return Helper::jsonErrorResponse('Validation error', 422, $validator->errors()->toArray());
        }

        DB::beginTransaction();
        try {
            // Upload Thumbnail if provided
            $thumbnailPath = null;
            if ($request->hasFile('thumbnail')) {
                $thumbnailPath = Helper::fileUpload($request->file('thumbnail'), 'properties/thumbnails', 'thumb-' . uniqid());
            }

            // Create Property
            $property = Property::create([
                'user_id' => auth('api')->id() ?? 1,
                'category_id' => $request->category_id,
                'title' => $request->title,
                'slug' => Str::slug($request->title) . '-' . uniqid(),
                'thumbnail' => $thumbnailPath,
                'for_whom' => $request->for_whom,
                'month_id' => $request->month_id,
                'is_available_immediately' => $request->is_available_immediately ?? false,
                'rent_amount' => $request->rent_amount,
                'advance_month' => $request->advance_month,
                'service_charge' => $request->service_charge,
                'is_negotiable' => $request->is_negotiable ?? false,
                'rent_type' => $request->rent_type ?? 'monthly',
                'beds' => $request->beds,
                'baths' => $request->baths,
                'balconies' => $request->balconies,
                'floor_no' => $request->floor_no,
                'size_sqft' => $request->size_sqft,
                'division_id' => $request->division_id,
                'district_id' => $request->district_id,
                'upazila_id' => $request->upazila_id,
                'area' => $request->area,
                'address' => $request->address,
                'map_link' => $request->map_link,
                'gas_bill_included' => $request->gas_bill_included ?? false,
                'electricity_bill_included' => $request->electricity_bill_included ?? false,
                'water_bill_included' => $request->water_bill_included ?? false,
                'market_distance_km' => $request->market_distance_km,
                'contact_name' => $request->contact_name,
                'contact_type' => $request->contact_type,
                'contact_mobile_number' => $request->contact_mobile_number,
                'contact_whatsapp_number' => $request->contact_whatsapp_number,
                'hide_contact_number' => $request->hide_contact_number ?? false,
                'description' => $request->description,
                'special_terms' => $request->special_terms,
                'status' => 'pending', // Requires admin approval
            ]);

            // Sync Facilities
            if ($request->has('facilities')) {
                $property->facilities()->sync($request->facilities);
            }

            // Handle Media Uploads (Images/Videos)
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $index => $file) {


                    $imageName = 'images_' . Str::random(10);
                    $image = Helper::fileUpload($file, 'property-media', $imageName);


                    PropertyImage::create([
                        'property_id' => $property->id,
                        'file_path' => $image,
                    ]);
                }
            }

            DB::commit();

            return Helper::jsonResponse(true, 'Property listed successfully and is waiting for approval.', 201, $property->load('facilities', 'images'));
        } catch (\Exception $e) {
            DB::rollBack();
            return Helper::jsonErrorResponse($e->getMessage(), 500);
        }
    }
}
