
// scripts/seedDummyUsers.js
// Run: node scripts/seedDummyUsers.js
// Requires env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

import { createClient } from '@supabase/supabase-js'

const SUPA_URL = process.env.SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(SUPA_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
})

async function seedDummyUsers() {
  const users = [
    { email: 'agent@test.dev', role: 'agent' },
    { email: 'investor@test.dev', role: 'investor' },
    { email: 'buyer@test.dev', role: 'buyer' }
  ]

  for (const { email, role } of users) {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password: 'Test123!',
      email_confirm: true,
      user_metadata: { role }
    })

    if (error) {
      console.error(`❌ Failed to create ${role}:`, error.message)
    } else {
      console.log(`✅ Created ${role} (${email}) → UID: ${data.user.id}`)
    }
  }

  process.exit()
}

seedDummyUsers()
