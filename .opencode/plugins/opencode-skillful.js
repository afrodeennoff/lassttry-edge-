export const SkillfulPlugin = async ({ project, client, $, directory, worktree }) => {
  console.log("Skillful plugin initialized")
  return {
    "message.updated": async (input, output) => {
      // Implement lazy load prompts on demand here
    }
  }
}