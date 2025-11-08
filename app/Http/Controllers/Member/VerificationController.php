<?php

namespace App\Http\Controllers\Member;
use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class VerificationController extends Controller
{
    /**
     * Display the verification page for the logged-in member.
     */
    public function index()
    {
        /** @var User $user */
        $user = Auth::user();

        return Inertia::render('Members/Verification', [
            'user' => $user?->load('paylaterAccount'),
        ]);
    }

    /**
     * Handle verification submission request.
     */
    public function submit(Request $request)
    {
        $user = Auth::user();

        // Prevent duplicate verification if already verified
        if ($user->is_verified) {
            return back()->with('error', 'Akun sudah terverifikasi');
        }

        // Simulate verification processing delay
        sleep(2);

        // Return confirmation message for successful submission
        return back()->with('success', 'Pengajuan verifikasi berhasil dikirim! Tim kami akan memvalidasi identitas Anda dalam 1x24 jam. Setelah terverifikasi, Anda akan mendapatkan akses limit Paylater.');
    }
}
