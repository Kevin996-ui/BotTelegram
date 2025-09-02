# 🤖 TechAcademy Bot

Bot de Telegram para gestionar suscripciones premium a TechAcademy.

## ✨ Características

- **Canal FREE**: Acceso gratuito al contenido básico
- **Canal PREMIUM**: Contenido exclusivo por suscripción ($5 USD)
- **Múltiples métodos de pago**: PayPal, Wise, Payoneer y criptomonedas
- **Gestión automática**: Notificaciones al administrador
- **Interfaz intuitiva**: Comandos simples y botones inline

## 🚀 Instalación

1. **Clona el repositorio:**
```bash
git clone https://github.com/Kevin996-ui/BotTelegram.git
cd BotTelegram
```

2. **Instala las dependencias:**
```bash
npm install
```

3. **Configura las variables de entorno:**
Crea un archivo `.env` en la raíz del proyecto:
```env
BOT_TOKEN=tu_token_del_bot_de_telegram
ADMIN_USERNAME=tu_usuario_admin
```

4. **Ejecuta el bot:**
```bash
node index.js
```

## 📱 Comandos Disponibles

- `/start` - Mensaje de bienvenida
- `/free` - Enlace al canal gratuito
- `/premium` - Información sobre el canal premium
- `/pago` - Métodos de pago disponibles
- `/payoneer` - Solicitar cobro por Payoneer
- `/cancel` - Cancelar operación actual
- `/help` - Ayuda y comandos disponibles

## 💳 Métodos de Pago

- **PayPal**: Pago directo de $5 USD
- **Wise**: Transferencia internacional de $5 USD
- **Payoneer**: Cobro por correo electrónico
- **Criptomonedas**: Binance Pay

## 🔧 Tecnologías Utilizadas

- **Node.js** - Runtime de JavaScript
- **Telegraf** - Framework para bots de Telegram
- **dotenv** - Gestión de variables de entorno

## 📁 Estructura del Proyecto

```
BotTelegram/
├── index.js          # Archivo principal del bot
├── package.json      # Dependencias y configuración
├── .env              # Variables de entorno (crear)
└── README.md         # Este archivo
```

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Haz un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Si tienes alguna pregunta o necesitas ayuda:
- Abre un issue en GitHub
- Contacta al administrador: @tu_usuario_admin

## ⚠️ Nota Importante

Asegúrate de configurar correctamente las variables de entorno antes de ejecutar el bot. El `BOT_TOKEN` es especialmente importante para el funcionamiento del bot.
