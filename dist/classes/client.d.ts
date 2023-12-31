import { Client, Collection, ClientOptions, IntentsBitField } from 'discord.js';
import { SWStatus } from './status';
export interface SWClientOptions extends ClientOptions {
    token?: string;
    prefix?: string | string[];
    disableDefaults?: boolean;
    developers?: string[];
}
declare module 'discord.js' {
    interface Client {
        bot: Collection<string, any>;
        config: Collection<string, any>;
    }
}
export declare class SkyWork {
    options: (Omit<ClientOptions, "intents"> & {
        intents: IntentsBitField;
    }) & SWClientOptions;
    client: Client;
    constructor(options: SWClientOptions);
    config(name: string, options: object): void;
    eventLoader(dir: string): void;
    commandLoader(dir: string): void;
    clientStatus(status: Array<SWStatus>, time: string): void;
}
//# sourceMappingURL=client.d.ts.map