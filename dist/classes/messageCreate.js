"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Events, PermissionsBitField, ChannelType } = require("discord.js");
exports.default = {
    name: Events.MessageCreate,
    code: async (client, message) => {
        let bot = client.bot.get(client.token);
        let prefix = bot.prefix;
        let multiprefix = bot.multiprefix;
        if (message.author.id == client.user.id)
            return;
        const args = message.content.trim().split(/ +/);
        let elargs = args.shift().toLowerCase();
        const found_prefix = (multiprefix?.length ? multiprefix.find((x) => elargs.startsWith(x)) : null) || (elargs.startsWith(prefix) ? prefix : null);
        if (!found_prefix) {
            const commands = client.commands.filter((cmds) => cmds.data.alwaysExecute == true);
            if (!commands)
                return;
            commands.forEach((cmd) => {
                let msg = message;
                if (cmd.data.alwaysExecute == true) {
                    cmd.code(client, msg);
                }
            });
        }
        else {
            elargs = elargs.slice(found_prefix.length);
            const command = client.commands.filter((cmds) => cmds.data.type == undefined);
            const commands = command.filter((cmds) => cmds.data.name == elargs || cmds.data.aliases && cmds.data.aliases.includes(elargs) || cmds.data.alwaysExecute == true);
            if (!commands)
                return;
            commands.forEach((cmd) => {
                let msg = message;
                if (cmd.data.alwaysExecute == true) {
                    cmd.code(client, msg);
                }
                else {
                    if (cmd.data.disabled || message.author.bot || message.channel.type == ChannelType.DM)
                        return;
                    if (cmd.data.devOnly == true) {
                        if (!bot.developers.some((d) => d.id.includes(message.author.id)))
                            message.reply(':x: You are not my developer!').then((s) => setTimeout(() => s.delete().catch((err) => err), 5000));
                        else
                            cmd.code(client, msg, args);
                    }
                    else if (cmd.data.adminOnly == true) {
                        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator))
                            message.reply(':x: You are not an Admin').then((s) => setTimeout(() => s.delete().catch((err) => err), 5000));
                        else
                            cmd.code(client, msg, args);
                    }
                    else if (cmd.data.ownerOnly == true) {
                        console.log(message.guild.ownerId != message.author.id);
                        if (message.guild.ownerId != message.author.id)
                            message.reply(':x: You are not the server owner').then((s) => setTimeout(() => s.delete().catch((err) => err), 5000));
                        else
                            cmd.code(client, msg, args);
                    }
                    else {
                        cmd.code(client, msg, args);
                    }
                }
            });
        }
    }
};
//# sourceMappingURL=messageCreate.js.map