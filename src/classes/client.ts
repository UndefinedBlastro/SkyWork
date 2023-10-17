import * as color from '../auxiliar/colors'
import { Client, Collection, ClientOptions, IntentsBitField, Partials } from 'discord.js';
import { eventLoader, commandLoader } from './loaders';
import { cwd } from 'process';
import { SWStatus, SkyStatus } from './status';

export interface SWClientOptions extends ClientOptions {
    token?: string,
    prefix?: string[],
}

declare module 'discord.js' {
    interface Client {
        bot: Collection<string, any>;
        config: Collection<string, any>;
    }
}

export class SkyWork {
    public declare options: (Omit<ClientOptions, "intents" & "partials"> & { partials: Partials } & { intents: IntentsBitField }) & SWClientOptions
    public client: Client
    
    constructor(options: SWClientOptions){
        let { token, intents, prefix, partials } = options;
        const client = new Client({
            intents: intents,
            partials: partials,            
        });
        this.client = client
        client.bot = new Collection()
        client.bot.set(token ?? '', options)
        console.log(color.default.white + 'Booting up...')
        client.login(token)
        console.log(`${color.default.FrameWork} Core is running...`)
        new eventLoader(client, '/node_modules/SkyWork/dist/events', true)
    }
    config(name: string, options: object){
        this.client.config = new Collection()
        this.client.config.set(name, options)
    }
    eventLoader(dir: string){
        new eventLoader(this.client, dir)
    }
    commandLoader(dir: string){
        new commandLoader(this.client, dir)
    }
    clientStatus(status:Array<SWStatus>, time: string){
        new SkyStatus(this.client, status, time)
    }
}