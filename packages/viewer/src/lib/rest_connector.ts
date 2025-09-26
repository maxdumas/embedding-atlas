import type { ExtractionOptions, Table } from "@uwdata/flechette";
import {
  decodeIPC,
  type ArrowQueryRequest,
  type Connector,
  type ConnectorQueryRequest,
  type ExecQueryRequest,
  type JSONQueryRequest,
} from "@uwdata/mosaic-core";

interface RestOptions {
  uri?: string;
  ipc?: ExtractionOptions;
}

/**
 * Inexplicably, the standard RestConnector exported from mosaic-core uses
 * credentials: 'omit' by default, and this is not configurable. We need to send
 * credentials when making calls to the server because we use cookie-based auth
 * via IAP!
 */
export class RestConnectorWithCredentials implements Connector {
  private _uri: string;
  private _ipc?: ExtractionOptions;

  constructor({ uri = "http://localhost:3000/", ipc = undefined }: RestOptions = {}) {
    this._uri = uri;
    this._ipc = ipc;
  }

  async query(query: ArrowQueryRequest): Promise<Table>;
  async query(query: ExecQueryRequest): Promise<void>;
  async query(query: JSONQueryRequest): Promise<Record<string, unknown>[]>;
  async query(query: ConnectorQueryRequest): Promise<unknown> {
    const req = fetch(this._uri, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(query),
    });

    const res = await req;

    if (!res.ok) {
      throw new Error(`Query failed with HTTP status ${res.status}: ${await res.text()}`);
    }

    return query.type === "exec"
      ? req
      : query.type === "arrow"
        ? decodeIPC(await res.arrayBuffer(), this._ipc)
        : res.json();
  }
}
