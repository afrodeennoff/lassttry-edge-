export async function signOutClient() {
  try {
    await fetch('/api/auth/signout', { method: 'POST' })
  } finally {
    window.location.assign('/')
  }
}
