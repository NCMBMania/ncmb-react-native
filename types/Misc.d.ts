import NCMBInstallation from "../libs/Installation";
import NCMBObject from "../libs/Object";
import NCMBRole from "../libs/Role";
import NCMBUser from "../libs/User";

type allowType = string | Date | number | object | null | NCMBUser | NCMBAcl | NCMBObject | NCMBPush | NCMBInstallation;
type JsonObject = { [key:string] : allowType };

type NCMBResponse = {
  readonly code?: string;
  readonly error?: string;
  readonly results?: [JsonObject];
  readonly count?: number;
  readonly createDate?: string;
  readonly updateDate?: string;
  sessionToken?: string;
}

type NCMBPointer = {
  objectId: string;
  __type?: string;
  className?: string;
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

type expoMediaFormat = {
  cancelled: boolean;
  type: string;
  uri: string;
  width: number;
  height: number;
  exif: object;
  base64: string;
  duration: number;
}