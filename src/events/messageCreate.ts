import { Events, PermissionsBitField, ChannelType } from "discord.js";

export default {
    name: Events.MessageCreate,
    code: async(client: any, message: any) => {
        if(client.bot.find((s:any) => s.token).disableDefaults) return;
        let bot = client.bot.get(client.token)
        let prefix = bot.prefix
        let multiprefix = bot.multiprefix;
        if(message.author.id == client.user.id) return;
        const args = message.content.trim().split(/ +/)
        let elargs = args.shift().toLowerCase();
        const found_prefix = (multiprefix?.length ? multiprefix.find((x:any) => elargs.startsWith(x)) : null) || (elargs.startsWith(prefix) ? prefix : null)
        if (! found_prefix) { 
            const commands = client.commands.filter((cmds:any) =>cmds.data.name == '')
            if(!commands) return;
            commands.forEach((cmd:any) => {
                if(cmd.data.name == ''){
                    if(message.author.id == client.user.id) return;
                    cmd.code(client, message);
                }
                })
        } else {
            elargs = elargs.slice(found_prefix.length);
            const command = client.commands.filter((cmds:any) => cmds.data.type == undefined)
            const commands = command.filter((cmds:any) => cmds.data.name == elargs || cmds.data.aliases && cmds.data.aliases.includes(elargs) || cmds.data.name == '' == true)
            
            if(!commands) return;
            commands.forEach((cmd:any) => {
                if(cmd.data.name == ''){
                    if(message.author.id == client.user.id) return;
                    cmd.code(client, message)
                }
                else {
                    if(cmd.data.disabled || message.author.bot || message.channel.type == ChannelType.DM) return;
                    if(cmd.data.devOnly == true){
                        if(!bot.developers.includes(message.author.id)) message.reply(':x: You are not my developer!').then((s:any)=> setTimeout(() => s.delete().catch((err:any) => err), 5000));
                        else cmd.code(client, message, args)
                    } else if(cmd.data.adminOnly == true) {
                        if(!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) message.reply(':x: You are not an Admin').then((s:any)=> setTimeout(() => s.delete().catch((err:any) => err), 5000));
                        else cmd.code(client, message, args)
                    } else if(cmd.data.ownerOnly == true) {
                        if(message.guild.ownerId != message.author.id) message.reply(':x: You are not the server owner').then((s:any)=> setTimeout(() => s.delete().catch((err:any) => err), 5000));
                        else cmd.code(client, message, args)
                    } else {
                        cmd.code(client, message, args)
                    }
                }
            })        
        }
    }
}