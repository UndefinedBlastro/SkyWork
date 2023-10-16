import { ActivityType, Events } from "discord.js";
import ms from "ms";
import * as colors from '../auxiliar/colors'

export interface SWStatus {
    text?: string,
    type?: ActivityType,
    status?: "online" | "idle" | "dnd" | "offline",
    url?: string
}

export class SkyStatus {
    constructor(bot: any, status: Array<SWStatus>, time: string){
        bot.on(Events.ClientReady, (client:any) => {
            let text = status[0]?.text?.replace("{guilds}", Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1}).format(client.guilds.cache.size))
            text = text?.replace("{members}", Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1}).format(client.users.cache.size))
            client.user.setPresence({activities: [{name: text,type: status[0].type}],status: status[0].status})
            console.log(`${colors.default.FrameWork} ${colors.default.blue}Status ${colors.default.white}have been successfully set!`)
            setInterval(()=> {
                status.forEach((stat:any, number: number) => {
                    setTimeout(() => {
                        client.user.setPresence({
                            activities: [{
                                name: text,
                                type: stat.type,
                                url: stat.url ?? undefined
                            }],
                            status: stat.status
                        });
                    }, ms(time)*number)
                })
            }, ms(time)*status.length)
        })
    }
}