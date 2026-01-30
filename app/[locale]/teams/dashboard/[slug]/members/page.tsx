'use client'

import { Suspense, useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface TeamMembersPageProps {
    params: Promise<{
        slug: string
    }>
}

export default function TeamMembersPage({ params }: TeamMembersPageProps) {
    const [slug, setSlug] = useState<string>('')

    useEffect(() => {
        params.then(({ slug }) => setSlug(slug))
    }, [params])

    if (!slug) return <div className="p-8">Loading members...</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Members & Roles</h1>
                {/* Placeholder for Invite Button */}
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">
                    Invite Member
                </button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Team Members</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-muted-foreground">Member management table coming soon... (Use /teams/manage for global access)</div>
                </CardContent>
            </Card>
        </div>
    )
}
