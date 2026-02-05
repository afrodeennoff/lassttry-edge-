export const MicodePlugin = async ({ project, client, $, directory, worktree }) => {
  console.log("Micode plugin initialized")
  return {
    "session.compacted": async (input, output) => {
      // Implement structured Brainstorm → Plan → Implement workflow here
    }
  }
}