import { Suspense } from 'react'
import { TeamManagement } from '../components/team-management'
import { getUserTeams, getUserTeamAccess } from '@/app/[locale]/dashboard/settings/actions'

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { TeamsSidebar } from '../components/teams-sidebar'

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
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-muted/40 text-foreground">
                <TeamsSidebar />
                <SidebarInset className="flex-1 overflow-x-hidden">
                    <div className="px-2 sm:px-6 lg:px-8 py-6">
                        <TeamManagement
                            initialUserTeams={initialUserTeams}
                            initialManagedTeams={initialManagedTeams}
                        />
                        {children}
                    </div>
                </SidebarInset>
            </div>
        </SidebarProvider>
    )
}
