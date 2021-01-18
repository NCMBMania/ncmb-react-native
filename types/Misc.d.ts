import NCMBObject from "../libs/Object";
import NCMBRole from "../libs/Role";
import NCMBUser from "../libs/User";

type allowType = string | Date | number | object | null | NCMBUser | NCMBAcl | NCMBObject;
type JsonObject = { [key:string] : allowType };

type NCMBResponse = {
  readonly code?: string;
  readonly error?: string;
  readonly results?: [JsonObject];
  readonly count?: number;
  readonly createDate: string;
  sessionToken?: string;
}

type NCMBPointer = {
  __type?: string;
  className?: string;
  objectId: string;
}

interface dateFormat {
  __type: string,
  iso: string
}

interface authData {
  id: string,
  access_token: string,
  expires?: number,
  expiration_date: dateFormat
}

interface NCMBBasicLogin {
  userName?: string;
  password: string;
  mailAddress?: string;
}

interface NCMBDate {
  __type: string;
  iso: string;
}

type NCMBAclFormatKey = {
  [key: string]: boolean
};

interface NCMBAclFormat {
  [key: string]: NCMBAclFormatKey
};

interface NCMBRelationFormat {
  __op: string;
  objects: NCMBPointer[]
};

interface NCMBGeoPointFormat {
  __type: string;
  longitude: number;
  latitude: number;
}

type NCMBStorage = {
  setItem(key: string, text: string): Promise<void>;
  getItem(key: string): Promise<string | null>;
  removeItem(key: string): Promise<void>;
}

interface SignatureString {
  [s: string]: string | number;
}
