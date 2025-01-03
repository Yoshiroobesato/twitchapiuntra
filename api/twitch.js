const twitch = require("twitch-m3u8");

module.exports = async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: "Falta el parámetro 'url'." });
    }

    try {
        let response = {};

        // Verificar si la URL es de un canal de Twitch
        if (url.includes("twitch.tv")) {
            const channelName = url.split("twitch.tv/")[1]; // Extraer el nombre del canal
            if (!channelName) {
                return res.status(400).json({ error: "El nombre del canal no es válido." });
            }

            // Obtener datos de la transmisión en vivo
            const streamInfo = await twitch.getStream(channelName);
            const streamM3u8 = await twitch.getStream(channelName, true);
            response = {
                type: "stream",
                info: streamInfo,
                m3u8: streamM3u8,
            };

            // Mostrar en consola
            console.log("Información de transmisión en vivo:", streamInfo);
            console.log("Datos .m3u8 de transmisión en vivo:", streamM3u8);
        } else {
            return res.status(400).json({ error: "La URL proporcionada no es válida." });
        }

        // Responder con la información en formato JSON
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: "Error general en el servidor.", details: error.message });
    }
};
