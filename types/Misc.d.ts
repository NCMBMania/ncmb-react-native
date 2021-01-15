type allowType = string | Date | number | object | null | NCMBUser | NCMBAcl | NCMBObject;
type JsonObject = { [key:string] : allowType };

type NCMBResponse = {
  readonly code?: string;
  readonly error?: string;
  readonly results?: [JsonObject];
  readonly count?: number;
}

type NCMBPointer = {
  __type?: string;
  className?: string;
  objectId: string;
}

