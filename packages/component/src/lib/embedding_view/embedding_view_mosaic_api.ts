// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

import type { Coordinator, Selection } from "@uwdata/mosaic-core";
import { createClassComponent } from "svelte/legacy";

import Component from "./EmbeddingViewMosaic.svelte";

import type { Point, Rectangle, ViewportState } from "../utils.js";
import type { Theme } from "./theme.js";
import type {
  AutomaticLabelsConfig,
  CustomComponent,
  DataField,
  DataPoint,
  DataPointID,
  OverlayProxy,
} from "./types.js";

export interface EmbeddingViewMosaicProps {
  /** The Mosaic Coordinator */
  coordinator?: Coordinator;

  /** The data table name. */
  table: string;

  /** The x column. */
  x: string;

  /** The y column. */
  y: string;

  /** The category column (optional).
   * If specified, color points by category.
   * Categories should be represented as integers starting from zero.
   * Currently we only support at most four categories. */
  category?: string | null;

  /** The text column (optional).
   * If specified, the text will be used as the default tooltip on hover. */
  text?: string | null;

  /** The id column (optional). */
  identifier?: string | null;

  /** Additional fields for the tooltip data element.
   * Each field can be specified as a column name or a SQL expression. */
  additionalFields?: Record<string, DataField> | null;

  /** Mosaic filter (optional). */
  filter?: Selection | null;

  /** The colors for the categories. */
  categoryColors?: string[] | null;

  /** The tooltip. Tooltip is triggered on hover.
   * If a Mosaic Selection is provided, the selection's value
   * will be used as the current tooltip; and when the tooltip
   * changes, the selection will be updated with a predicate. */
  tooltip?: Selection | DataPoint | DataPointID | null;

  /** The selection. Selection is triggered with click or shift/cmd-click.
   * If a Mosaic Selection is provided, the selection's value
   * will be used as the current selection; and when the tooltip
   * changes, the selection will be updated with a predicate. */
  selection?: Selection | DataPoint[] | DataPointID[] | null;

  /** The range selection. Shift-drag to create a range selection. */
  rangeSelection?: Selection | null;

  /** The value of the range selection. This is a rectangle in data coordinates.
   * When this property is changed, the range selection updates accordingly. */
  rangeSelectionValue?: Rectangle | Point[] | null;

  /** The width of the view. */
  width?: number | null;

  /** The height of the view. */
  height?: number | null;

  /** The pixel ratio of the view. */
  pixelRatio?: number | null;

  /** Color scheme. */
  colorScheme?: "light" | "dark" | null;

  /** Theme. */
  theme?: Theme | null;

  /** The viewport state. */
  viewportState?: ViewportState | null;

  /** Set to true to automatically create labels from the text field. */
  automaticLabels?: AutomaticLabelsConfig | boolean | null;

  /** View mode. */
  mode?: "points" | "density" | null;

  /** Minimum average density for density contours to show up.
   * The density is measured as number of points per square points (aka., px in CSS units). */
  minimumDensity?: number | null;

  /** Override the automatically calculated point size. If not specified, point size is calculated based on density. */
  pointSize?: number | null;

  /** A custom renderer to draw the tooltip content. */
  customTooltip?: CustomComponent<HTMLDivElement, { tooltip: DataPoint }> | null;

  /** A custom renderer to draw overlay on top of the embedding view. */
  customOverlay?: CustomComponent<HTMLDivElement, { proxy: OverlayProxy }> | null;

  /** A callback for when viewportState changes. */
  onViewportState?: ((value: ViewportState) => void) | null;

  /** A callback for when tooltip changes. */
  onTooltip?: ((value: DataPoint | null) => void) | null;

  /** A callback for when selection changes. */
  onSelection?: ((value: DataPoint[] | null) => void) | null;

  /** A callback for when range selection changes. */
  onRangeSelection?: ((value: Rectangle | Point[] | null) => void) | null;
}

export class EmbeddingViewMosaic {
  private component: any;
  private currentProps: EmbeddingViewMosaicProps;

  constructor(target: HTMLElement, props: EmbeddingViewMosaicProps) {
    this.currentProps = { ...props };
    this.component = createClassComponent({ component: Component, target: target, props: props });
  }

  update(props: Partial<EmbeddingViewMosaicProps>) {
    let updates: Partial<EmbeddingViewMosaicProps> = {};
    for (let key in props) {
      if ((props as any)[key] !== (this.currentProps as any)[key]) {
        (updates as any)[key] = (props as any)[key];
        (this.currentProps as any)[key] = (props as any)[key];
      }
    }
    this.component.$set(updates);
  }

  destroy() {
    this.component.$destroy();
  }
}
