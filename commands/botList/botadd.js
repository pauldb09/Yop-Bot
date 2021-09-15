const { Client, Message, MessageEmbed } = require('discord.js'),
    bots = require("../../models/bots"),
    { prefix } = require("../../configs/config.json"),
    { botslogs } = require("../../configs/channels.json"),
    { verificator } = require("../../configs/roles.json");

module.exports = {
    name: 'botadd',
    aliases: ['badd', 'bota'],
    categories : 'botlist', 
    permissions : ' ', 
    description: 'Permet de rajouter un bot à la liste.',
    cooldown : 5,
    usage: 'botadd (id) (prefix)',
    /** 
     * @param {Client} client 
     * @param {Message} message
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        /* Verification */
        if (message.mentions.members.first() || message.mentions.users.first()) return message.reply({ content: `${client.no} | Désolé je ne prend pas en charge les mentions.` });
        if (!args[0]) return message.reply({ content: `${client.no} | Il manque l'id du bot dans la commande: \`${prefix}botadd (id) (prefix)\`` });
        if (args[0].length != 18 && !isNaN(parseInt(args[0]))) return message.reply({ content: `${client.no} | ${args[0]} n'est pas une id, raison: \`Ce n'est peut être pas un nombre ou la taille de l'id est trop petite.\`` });

        const user = await client.users.fetch(args[0]);

        if (!user) return message.reply({ content: `${client.no} | Aucun bot avec l'id ${args[0]} trouvé sur discord.` });
        if (!user.bot) return message.reply({ content: `${client.no} | ${args[0]} n'est pas un bot.` });

        if (!args[1]) return message.reply({ content: `${client.no} | Il manque le prefix du bot dans la commande: \`${prefix}botadd (id) (prefix)\`` });

        if (await bots.findOne({ botID: user.id })) return message.reply({ content: `${client.no} | ${user.tag} est déjà sur la liste.` });

        new bots({
            botID: args[0],
            prefix: args[1],
            ownerID: message.author.id,
            verified: false
        });

        /* Responses */

        client.channels.cache.get(botslogs).send({
            content: `<@${message.author.id}> / \`<@&${verificator}>\``,
            embeds: [
                new MessageEmbed()
                .setTitle("Demande d'ajout...")
                .setDescription(`<@${message.author.id}> a demandé à ajouter le bot [${user.username}#${user.discriminator}](https://discord.com/oauth2/authorize?client_id=${user.id}&scope=bot&permissions=-1). Un vérificateur va bientôt s’occuper de lui.`)
                .setColor("#66DA61")
                .setThumbnail(user.displayAvatarURL())
                .setTimestamp(new Date())
            ]
        });

        message.reply({ content: `${client.yes} | Votre bot \`${user.tag}\` vient juste d'être ajouté à la liste.` });
    }
}