#!/usr/bin/env node
// Registers (or updates) the Stripe webhook endpoint for this project.
// Usage: node scripts/setup-stripe-webhook.mjs https://your-domain.com

import Stripe from 'stripe'

const url = process.argv[2]
if (!url) {
  console.error('Usage: node scripts/setup-stripe-webhook.mjs https://your-domain.com')
  process.exit(1)
}

const secretKey = process.env.STRIPE_SECRET_KEY
if (!secretKey) {
  console.error('STRIPE_SECRET_KEY env var is required')
  process.exit(1)
}

const stripe = new Stripe(secretKey)
const endpointUrl = `${url.replace(/\/$/, '')}/api/webhooks/stripe`

const events = ['checkout.session.completed']

const { data: existing } = await stripe.webhookEndpoints.list({ limit: 100 })
const current = existing.find((e) => e.url === endpointUrl)

let endpoint
if (current) {
  endpoint = await stripe.webhookEndpoints.update(current.id, { enabled_events: events })
  console.log(`Updated existing webhook endpoint: ${endpoint.id}`)
} else {
  endpoint = await stripe.webhookEndpoints.create({ url: endpointUrl, enabled_events: events })
  console.log(`Created webhook endpoint: ${endpoint.id}`)
  console.log(`\nSTRIPE_WEBHOOK_SECRET=${endpoint.secret}`)
  console.log('\nAdd this secret to your production environment variables.')
}
