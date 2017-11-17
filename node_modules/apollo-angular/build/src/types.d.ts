import { ApolloClient } from 'apollo-client';
export declare type ClientMap = {
    [name: string]: ApolloClient;
};
export declare type ClientWrapper = () => ApolloClient;
export declare type ClientMapWrapper = () => ClientMap;
