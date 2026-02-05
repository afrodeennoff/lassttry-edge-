export const WorktreePlugin = async ({ project, client, $, directory, worktree }) => {
  console.log("Worktree plugin initialized")
  return {
    "git.command.executed": async (input, output) => {
      // Implement zero-friction git worktrees here
    }
  }
}