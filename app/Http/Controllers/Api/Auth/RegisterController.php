<?php

namespace App\Http\Controllers\Api\Auth;

use Exception;
use Carbon\Carbon;
use App\Models\User;
use App\Mail\OtpMail;
use App\Helpers\Helper;
use App\Helpers\Notify;
use App\Traits\RewardTrait;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Services\CoinService;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class RegisterController extends Controller
{
  
    public $select;
    public function __construct()
    {
        $this->select = ['id', 'name', 'email', 'otp', 'avatar'];
    }

    public function register(Request $request)
    {
        
        $request->validate([
            'name'          => 'required|string|max:100',
            'email'         => 'required|string|email|max:150|unique:users',
            'password'      => 'required|string|min:6|confirmed',
            'phone'         => 'nullable|string|max:15|unique:users',
            
        ]);

     

         if (User::where('email', $request->input('email'))->exists()) {
            return Helper::jsonErrorResponse('Email already exists.', 422);
        }

        // Check phone if provided
        if ($request->has('phone') && User::where('phone', $request->input('phone'))->exists()) {
            return Helper::jsonErrorResponse('Phone number already exists.', 422);
        }

        // try {
        //     DB::beginTransaction();

            
            $user = User::create([
                'name'           => $request->input('name'),
                'slug'           => strtolower(Str::random(6)) . "-" . strtolower($request->input('name')),
                'email'          => strtolower($request->input('email')),
                'phone'          => $request->input('phone'),
                'password'       => Hash::make($request->input('password')),
                'otp'            => rand(1000, 9999),
                'otp_expires_at' => Carbon::now()->addMinutes(60*5),
                'otp_verified_at'=> Carbon::now(),
        
            ]);

           
            Mail::to($user->email)->send(new OtpMail($user->otp, $user, 'Verify Your Email Address'));

            return response()->json([
                'status'     => true,
                'message'    => 'User register in successfully.',
                'code'       => 200,
                'data' => $user
            ], 200);

        // } catch (Exception $e) {
        //     DB::rollBack();
        //     return Helper::jsonErrorResponse('User registration failed', 500, [$e->getMessage()]);
        // }
    }
    public function VerifyEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'otp'   => 'required|digits:4',
        ]);
        try {
            $user = User::where('email', $request->input('email'))->first();

            //! Check if email has already been verified
            if (!empty($user->otp_verified_at)) {
                return  Helper::jsonErrorResponse('Email already verified.', 409);
            }

            if ((string)$user->otp !== (string)$request->input('otp')) {
                return Helper::jsonErrorResponse('Invalid OTP code', 422);
            }

            //* Check if OTP has expired
            if (Carbon::parse($user->otp_expires_at)->isPast()) {
                return Helper::jsonErrorResponse('OTP has expired. Please request a new OTP.', 422);
            }

            //* Verify the email
            $user->otp_verified_at   = now();
            $user->otp               = null;
            $user->otp_expires_at    = null;
            $user->save();

            $token = auth('api')->login($user);

            return Helper::jsonResponse(true, 'Email verified successfully', 200, [
                'token_type' => 'bearer',
                'token' => $token,
                'expires_in' => auth('api')->factory()->getTTL() * 60,
                'data' => auth('api')->user()
            ]);
        } catch (Exception $e) {
            return Helper::jsonErrorResponse($e->getMessage(), $e->getCode());
        }
    }

    public function ResendOtp(Request $request)
    {

        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        try {
            $user = User::where('email', $request->input('email'))->first();

            if (!$user) {
                return Helper::jsonErrorResponse('User not found.', 404);
            }

            if ($user->otp_verified_at) {
                return Helper::jsonErrorResponse('Email already verified.', 409);
            }

            $newOtp               = rand(1000, 9999);
            $otpExpiresAt         = Carbon::now()->addMinutes(60*5);
            $user->otp            = $newOtp;
            $user->otp_expires_at = $otpExpiresAt;
            $user->save();

            //* Send the new OTP to the user's email
            Mail::to($user->email)->send(new OtpMail($newOtp, $user, 'Verify Your Email Address'));

            return Helper::jsonResponse(true, 'A new OTP has been sent to your email.', 200);
        } catch (Exception $e) {
            return Helper::jsonErrorResponse($e->getMessage(), 200);
        }
    }
}
