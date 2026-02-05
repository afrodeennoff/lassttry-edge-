export const MorphFastApplyPlugin = async ({ project, client, $, directory, worktree }) => {
  console.log("Morph Fast Apply plugin initialized")
  return {
    "tool.execute.before": async (input, output) => {
      // Implement fast apply logic here
    }
  }
}