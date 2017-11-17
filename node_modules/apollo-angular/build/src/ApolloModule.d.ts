import { ModuleWithProviders, Provider } from '@angular/core';
import { SelectPipe } from './SelectPipe';
import { ClientWrapper, ClientMapWrapper } from './types';
export declare const APOLLO_DIRECTIVES: typeof SelectPipe[];
export declare const APOLLO_PROVIDERS: Provider[];
export declare function defaultApolloClient(clientFn: ClientWrapper): Provider;
export declare class ApolloModule {
    static withClient(clientFn: ClientWrapper): ModuleWithProviders;
    /**
     * Defines a map of ApolloClients or a single instance
     */
    static forRoot(clientMapFn: ClientMapWrapper | ClientWrapper): ModuleWithProviders;
}
