export const SupermemoryPlugin = async ({ project, client, $, directory, worktree }) => {
  console.log("Supermemory plugin initialized")
  return {
    "session.compacted": async (input, output) => {
      // Implement persistent memory across sessions here
    }
  }
}