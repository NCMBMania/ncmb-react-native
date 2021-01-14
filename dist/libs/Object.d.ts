declare class NCMBObject {
    private className;
    private fields;
    constructor(name: string);
    set(name: string, value: any): NCMBObject;
    sets(json: Object): NCMBObject;
    get(name: string): any;
    static fetch(): NCMBObject;
    delete(): Promise<boolean>;
    toJSON(): object;
    save(): Promise<boolean>;
    path(): string;
    static path(): string;
}
export default NCMBObject;
