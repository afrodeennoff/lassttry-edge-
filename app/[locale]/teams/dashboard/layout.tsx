import { Suspense } from 'react'
import { TeamManagement } from '../components/team-management'
import { getUserTeams, getUserTeamAccess } from '@/app/[locale]/dashboard/settings/actions'

import { SidebarInset } from '@/components/ui/sidebar'
import { AIModelSidebar } from '@/components/sidebar/aimodel-sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    // Fetch initial data server-side for performance
    const teamsResult = await getUserTeams()
    const managedResult = await getUserTeamAccess()

    const initialUserTeams = teamsResult.success ? {
        ownedTeams: teamsResult.ownedTeams || [],
        joinedTeams: teamsResult.joinedTeams || []
    } : undefined

    const initialManagedTeams = managedResult.success ? managedResult.managedTeams : undefined

    return (
        <div className="flex min-h-screen w-full bg-[#020202] text-white">
            <AIModelSidebar />
            <SidebarInset className="flex-1 relative overflow-hidden bg-transparent">
                <div className="px-2 sm:px-6 lg:px-8 py-6 relative z-10">
                    <TeamManagement
                        initialUserTeams={initialUserTeams}
                        initialManagedTeams={initialManagedTeams}
                    />
                    {children}
                </div>
            </SidebarInset>
        </div>
    )
}
