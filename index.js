require('dotenv').config()
const { Telegraf, Markup } = require('telegraf')

const bot = new Telegraf(process.env.BOT_TOKEN)
const ADMIN = (process.env.ADMIN_USERNAME || '').toLowerCase()
const WEBHOOK_MODE = String(process.env.WEBHOOK_MODE || '').toLowerCase() === 'true'

// Estado simple por usuario para pedir email de Payoneer
const state = new Map() // userId -> 'await_email'
const isAdmin = (ctx) => (ctx.from?.username || '').toLowerCase() === ADMIN

// /start
bot.start(ctx =>
  ctx.reply('👋 ¡Bienvenido a TechAcademy!\nUsa /premium, /help')
)

// /free
bot.command('free', ctx =>
  ctx.reply('📢 Canal FREE: https://t.me/tu_canal_free')
)

// /premium
bot.command('premium', ctx =>
  ctx.reply('🔒 Para acceder al canal PREMIUM, suscríbete. Usa /pago para ver métodos o /payoneer para pagar por correo.')
)

// /pago (botones con montos fijos y contacto)
bot.command('pago', ctx =>
  ctx.reply(
    '💳 Métodos de suscripción PREMIUM ($5 USD):\n\n' +
    '• PayPal y Wise te llevan directo al pago.\n' +
    '• Payoneer: usa /payoneer para enviarnos tu correo y te mandamos el link de cobro.\n',
    Markup.inlineKeyboard([
      [Markup.button.url('PayPal $5', 'https://paypal.me/kevin98019/5')],
      [Markup.button.url('Wise $5', 'https://wise.com/pay/me/kevinc3012')],
      [Markup.button.url('Cripto (Binance Pay)', 'https://t.me/tu_usuario_admin')],
    ])
  )
)

// /payoneer: pedir correo al usuario
bot.command('payoneer', async (ctx) => {
  state.set(ctx.from.id, 'await_email')
  await ctx.reply(
    '✉️ Envía tu *correo electrónico* para generar el cobro Payoneer por **$5 USD**.\n' +
    'Ejemplo: correo@dominio.com\n\n' +
    'Si te equivocaste, usa /cancel para cancelar.',
    { parse_mode: 'Markdown' }
  )
})

// /cancel: limpiar estado
bot.command('cancel', (ctx) => {
  state.delete(ctx.from.id)
  ctx.reply('❎ Operación cancelada. Puedes volver a usar /payoneer cuando quieras.')
})

// Captura de texto: validar email si estamos esperando
bot.on('text', async (ctx) => {
  const expecting = state.get(ctx.from.id)
  if (expecting !== 'await_email') return

  const msg = (ctx.message.text || '').trim()
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(msg)
  if (!isEmail) {
    return ctx.reply('⚠️ Ese no parece un correo válido. Intenta de nuevo o usa /cancel.')
  }

  // OK: notificamos al admin y confirmamos al usuario
  state.delete(ctx.from.id)
  await ctx.reply('✅ Gracias. Te enviaremos un enlace de pago de Payoneer por $5 a ese correo en breve.')

  const u = ctx.from
  const adminTarget = ADMIN ? `@${ADMIN}` : u.id // fallback
  const info =
    `📬 *Solicitud Payoneer*\n` +
    `• Usuario: ${u.first_name || ''} ${u.last_name || ''} (@${u.username || 'sin_username'})\n` +
    `• ID: ${u.id}\n` +
    `• Email: ${msg}\n` +
    `• Monto: USD 5\n\n` +
    `Crea el Payment Request en Payoneer y luego otorga acceso.\n`
  try {
    await bot.telegram.sendMessage(adminTarget, info, { parse_mode: 'Markdown' })
  } catch (e) {
    console.error('No pude notificar al admin:', e)
  }
})

// /help
bot.command('help', ctx =>
  ctx.reply(
    '🆘 Ayuda:\n' +
    '• /pago → métodos de pago (PayPal, Wise, Cripto)\n' +
    '• /payoneer → envía tu correo para cobro por Payoneer ($5)\n' +
    '• /premium → cómo acceder al canal premium\n' +
    '• /cancel → cancelar operación actual\n\n' +
    'Contacto: @tu_usuario_admin'
  )
)

// === Arranque: polling (local/worker) o webhook (web service) ===
;(async () => {
  try {
    if (WEBHOOK_MODE) {
      // Modo WEBHOOK (para Web Service en Render)
      const express = require('express')
      const app = express()
      app.use(express.json())

      const SECRET = process.env.WEBHOOK_SECRET || 'hook'
      const PUBLIC_URL = process.env.PUBLIC_URL
      const PORT = process.env.PORT || 3000

      if (!PUBLIC_URL) {
        throw new Error('Falta PUBLIC_URL para webhook.')
      }

      // Registrar webhook
      await bot.telegram.setWebhook(`${PUBLIC_URL}/${SECRET}`)
      // Ruta webhook
      app.post(`/${SECRET}`, (req, res) => bot.handleUpdate(req.body, res))
      // Salud
      app.get('/', (_, res) => res.send('OK'))

      app.listen(PORT, () => console.log(`✅ Webhook ON en :${PORT}`))
    } else {
      // Modo POLLING (local o Background Worker)
      await bot.telegram.deleteWebhook()
      await bot.launch({ dropPendingUpdates: true })
      console.log('✅ Bot ON (long polling)')
    }
  } catch (e) {
    console.error('❌ Error al iniciar bot:', e)
  }
})()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

