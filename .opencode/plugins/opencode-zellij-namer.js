export const ZellijNamerPlugin = async ({ project, client, $, directory, worktree }) => {
  console.log("Zellij Namer plugin initialized")
  return {
    "tui.prompt.append": async (input, output) => {
      // Implement AI-powered session naming here
    }
  }
}