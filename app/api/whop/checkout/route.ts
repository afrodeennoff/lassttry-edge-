import { NextResponse } from "next/server";
import { createClient, getWebsiteURL } from "@/server/auth";
import { whop } from "@/lib/whop";
import { getSubscriptionDetails } from "@/server/subscription";
import { getReferralBySlug } from "@/server/referral";

async function handleWhopCheckout(lookup_key: string, user: any, websiteURL: string, referral?: string | null) {
    const subscriptionDetails = await getSubscriptionDetails();

    if (subscriptionDetails?.isActive) {
        return NextResponse.redirect(
            `${websiteURL}dashboard?error=already_subscribed`,
            303
        );
    }

    // Map lookup_key to Whop Plan ID
    let planId = "";
    if (lookup_key.includes("monthly")) {
        planId = process.env.NEXT_PUBLIC_WHOP_MONTHLY_PLAN_ID || "plan_55MGVOxft6Ipz";
    } else if (lookup_key.includes("6month") || lookup_key.includes("quarterly")) {
        planId = process.env.NEXT_PUBLIC_WHOP_6MONTH_PLAN_ID || "plan_LqkGRNIhM2A2z";
    } else if (lookup_key.includes("yearly")) {
        planId = process.env.NEXT_PUBLIC_WHOP_YEARLY_PLAN_ID || "plan_JWhvqxtgDDqFf";
    } else if (lookup_key.includes("lifetime") || lookup_key.includes("elite")) {
        planId = process.env.NEXT_PUBLIC_WHOP_LIFETIME_PLAN_ID || "";
    }

    if (!planId) {
        return NextResponse.json({ message: "Plan ID not found for lookup key" }, { status: 404 });
    }

    // Validate referral if provided
    if (referral) {
        const referralData = await getReferralBySlug(referral);
        if (!referralData || (user?.id && referralData.userId === user.id)) {
            referral = null;
        }
    }

    const companyId = process.env.WHOP_COMPANY_ID || "biz_jh37YZGpH5dWIY";

    try {
        // Create checkout configuration
        const checkoutConfig = await whop.checkoutConfigurations.create({
            company_id: companyId,
            plan_id: planId,
            metadata: {
                user_id: user.id,
                email: user.email,
                plan: lookup_key,
                ...(referral && { referral_code: referral }),
            },
            // Whop uses success_url and cancel_url in the checkout configuration
            redirect_url: `${websiteURL}dashboard?success=true&referral_applied=${referral ? 'true' : 'false'}`,
        });

        // Redirect to Whop checkout URL
        return NextResponse.redirect(checkoutConfig.purchase_url, 303);
    } catch (error) {
        console.error("Error creating Whop checkout:", error);
        return NextResponse.json({ message: "Error creating checkout session" }, { status: 500 });
    }
}

import { z } from "zod"

// ... imports

export async function POST(req: Request) {
    const body = await req.formData();
    const websiteURL = await getWebsiteURL();

    const lookup_key = body.get('lookup_key') as string;
    const referral = body.get('referral') as string | null;

    const schema = z.object({
        lookup_key: z.string().min(1, "Lookup key is required"),
        referral: z.string().nullable().optional(),
    })

    const validation = schema.safeParse({ lookup_key, referral })

    if (!validation.success) {
        return NextResponse.json({ message: "Invalid input", errors: validation.error.format() }, { status: 400 });
    }

    // ... rest of the code

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        const referralParam = referral ? `&referral=${encodeURIComponent(referral)}` : '';
        return NextResponse.redirect(
            `${websiteURL}authentication?subscription=true&lookup_key=${lookup_key}${referralParam}`,
            303
        );
    }

    return handleWhopCheckout(lookup_key, user, websiteURL, referral);
}

export async function GET(req: Request) {
    const websiteURL = await getWebsiteURL();
    const { searchParams } = new URL(req.url);
    const lookup_key = searchParams.get('lookup_key');
    const referral = searchParams.get('referral');

    if (!lookup_key) {
        return NextResponse.json({ message: "Lookup key is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        const referralParam = referral ? `&referral=${encodeURIComponent(referral)}` : '';
        return NextResponse.redirect(
            `${websiteURL}authentication?subscription=true&lookup_key=${lookup_key}${referralParam}`,
            303
        );
    }

    return handleWhopCheckout(lookup_key, user, websiteURL, referral);
}
