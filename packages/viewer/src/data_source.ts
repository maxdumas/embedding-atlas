// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

import { type Coordinator } from "@uwdata/mosaic-core";
import type { ExportFormat } from "./lib/mosaic_exporter.js";

/** A key-value cache */
export interface Cache {
  /** Gets an object from the cache with the given key. Returns `null` if the entry is not found. */
  get(key: string): Promise<any | null>;

  /** Sets an object to the cache with the given key */
  set(key: string, value: any): Promise<void>;
}

export interface ViewerConfig {
  /** The column for unique identifiers */
  id: string;
  /** The columns for the embedding view */
  embedding?: {
    /** The column for X coordinates */
    x: string;
    /** The column for Y coordinates */
    y: string;
  };
  /** The column for text. The text will be used as content for the tooltip and search features. */
  text?: string;

  /** The column for pre-computed nearest neighbors */
  neighbors?: string;

  /** The point size for the embedding view */
  pointSize?: number;
}

/** A data source for the viewer */
export interface DataSource {
  /** Loads the dataset into the given table in the coordinator's database */
  initializeCoordinator(
    coordinator: Coordinator,
    table: string,
    onStatus: (message: string) => void,
  ): Promise<ViewerConfig>;

  /** Downloads a zip archive of the dataset plus static assets of the viewer */
  downloadArchive?: () => Promise<void>;

  /** Download the selection with the given predicate */
  downloadSelection?: (predicate: string | null, format: ExportFormat) => Promise<void>;

  /** A cache suitable for this data source */
  cache?: Cache;
}
