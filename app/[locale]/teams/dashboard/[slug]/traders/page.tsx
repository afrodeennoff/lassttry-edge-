'use client'

import { Suspense, useState, useEffect } from 'react'
import { TeamEquityGridClient } from '../../../components/user-equity/team-equity-grid-client'

interface TeamTradersPageProps {
    params: Promise<{
        slug: string
    }>
}

export default function TeamTradersPage({ params }: TeamTradersPageProps) {
    const [slug, setSlug] = useState<string>('')

    // Handle async params
    useEffect(() => {
        params.then(({ slug }) => setSlug(slug))
    }, [params])

    if (!slug) {
        return <div>Loading...</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Traders Performance</h1>
            </div>
            <Suspense fallback={<div>Loading traders...</div>}>
                <TeamEquityGridClient teamId={slug} />
            </Suspense>
        </div>
    )
}
