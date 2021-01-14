/// <reference types="ncmb-react-native/dist/libs/request" />
declare class DataStore {
    private where;
    private limit;
    private offset;
    private order;
    private include;
    constructor(name: string);
    set(name: string, value: any): DataStore;
    sets(json: Object): DataStore;
    get(name: string): any;
    static equalTo(name: string, value: any): DataStore;
    static notEqualTo(name: string, value: any): DataStore;
    static greaterThan(name: string, value: any): DataStore;
    static greaterThanOrEqualTo(name: string, value: any): DataStore;
    static lessThan(name: string, value: any): DataStore;
    static lessThanOrEqualTo(name: string, value: any): DataStore;
    static in(name: string, value: any): DataStore;
    static notIn(name: string, value: any): DataStore;
    static exists(name: string): DataStore;
    static notExists(name: string): DataStore;
    static inArray(name: string, value: any): DataStore;
    static notInArray(name: string, value: any): DataStore;
    static allInArray(name: string, value: any): DataStore;
    static setOperand(name: string, value: any, operand: any): DataStore;
    static limit(value: number): DataStore;
    static skip(value: number): DataStore;
    static order(name: string, desc?: boolean): DataStore;
    static include(name: String): DataStore;
    static fetch(): DataStore;
    static fetchAll(): [DataStore];
    delete(): boolean;
    toJSON(): object;
    save(): boolean;
    path(): string;
    static path(): string;
}
export default DataStore;
