import { NextRequest, NextResponse } from "next/server";
import { whop } from "@/lib/whop";
import { PrismaClient } from "@/prisma/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

export async function POST(req: NextRequest) {
    const requestBodyText = await req.text();
    const headers = Object.fromEntries(req.headers);

    let event;
    try {
        // Verify the webhook signature
        event = whop.webhooks.unwrap(requestBodyText, { headers });
    } catch (err) {
        console.error('Whop Webhook Error:', err);
        return NextResponse.json(
            { message: `Webhook Error: ${err}` },
            { status: 400 },
        );
    }

    console.log("✅ Whop Webhook Success:", event.type);

    const pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
    });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    try {
        const data = event.data;

        switch (event.type) {
            case "membership.activated":
                console.log('membership.activated');
                // Narrow data to Membership
                if (event.type.startsWith('membership.')) {
                    const membership = data as any; // Use any for quick fix, or narrow to Membership if types allow
                    if (membership.user?.email) {
                        const email = membership.user.email;
                        const metadata = membership.metadata || {};
                        const userId = metadata.user_id;
                        const planName = metadata.plan || membership.product.title || 'PLUS';
                        // Default to 'month' if interval calculation fails
                        const interval = planName.toLowerCase().includes('monthly') ? 'month' :
                            planName.toLowerCase().includes('quarterly') ? 'quarter' :
                                planName.toLowerCase().includes('yearly') ? 'year' :
                                    planName.toLowerCase().includes('lifetime') ? 'lifetime' : 'month';

                        // Set end date based on interval
                        const endDate = new Date();
                        if (interval === 'lifetime') {
                            endDate.setFullYear(endDate.getFullYear() + 100);
                        } else if (interval === 'year') {
                            endDate.setFullYear(endDate.getFullYear() + 1);
                        } else if (interval === 'quarter') {
                            endDate.setMonth(endDate.getMonth() + 3);
                        } else {
                            endDate.setMonth(endDate.getMonth() + 1);
                        }

                        await prisma.subscription.upsert({
                            where: { email },
                            update: {
                                plan: planName.toUpperCase(),
                                endDate: endDate,
                                status: 'ACTIVE',
                                interval: interval,
                            },
                            create: {
                                email: email,
                                plan: planName.toUpperCase(),
                                userId: userId || '',
                                endDate: endDate,
                                status: 'ACTIVE',
                                interval: interval,
                            }
                        });
                    }
                }
                break;

            case "membership.deactivated":
                console.log('membership.deactivated');
                if (event.type.startsWith('membership.')) {
                    const membership = data as any;
                    if (membership.user?.email) {
                        const email = membership.user.email;
                        await prisma.subscription.update({
                            where: { email },
                            data: {
                                plan: 'FREE',
                                status: "CANCELLED",
                                endDate: new Date()
                            }
                        });
                    }
                }
                break;

            case "payment.succeeded":
                console.log('payment.succeeded');
                // Handle renewal / payment success
                if (event.type.startsWith('payment.')) {
                    const payment = data as any;
                    const membershipId = payment.membership_id;

                    if (membershipId) {
                        try {
                            // Fetch latest membership details to get the new renewal date
                            const membership = await (whop.memberships as any).retrieve({ id: membershipId }) as any;

                            if (membership && membership.user?.email) {
                                const email = membership.user.email;
                                const planName = membership.metadata?.plan || membership.product?.title || 'PLUS';
                                const interval = planName.toLowerCase().includes('monthly') ? 'month' :
                                    planName.toLowerCase().includes('quarterly') ? 'quarter' :
                                        planName.toLowerCase().includes('yearly') ? 'year' :
                                            planName.toLowerCase().includes('lifetime') ? 'lifetime' : 'month';

                                // Calculate end date
                                let endDate = new Date();
                                if (membership.renewal_period_end) {
                                    endDate = new Date(membership.renewal_period_end * 1000);
                                } else {
                                    // Fallback calculation if renewal date is missing
                                    if (interval === 'lifetime') {
                                        endDate.setFullYear(endDate.getFullYear() + 100);
                                    } else if (interval === 'year') {
                                        endDate.setFullYear(endDate.getFullYear() + 1);
                                    } else if (interval === 'quarter') {
                                        endDate.setMonth(endDate.getMonth() + 3);
                                    } else {
                                        endDate.setMonth(endDate.getMonth() + 1);
                                    }
                                }

                                await prisma.subscription.update({
                                    where: { email },
                                    data: {
                                        status: 'ACTIVE',
                                        endDate: endDate,
                                        plan: planName.toUpperCase(),
                                        interval: interval
                                    }
                                });
                                console.log(`Updated subscription for ${email} after payment success`);
                            }
                        } catch (err) {
                            console.error('Error fetching membership on payment success:', err);
                        }
                    }
                }
                break;

            default:
                console.log(`Unhandled Whop event type: ${event.type}`);
        }

        return NextResponse.json({ message: "Received" }, { status: 200 });
    } catch (error) {
        console.error('Whop Webhook handler failed:', error);
        return NextResponse.json(
            { message: "Webhook handler failed" },
            { status: 500 },
        );
    } finally {
        await pool.end();
    }
}
