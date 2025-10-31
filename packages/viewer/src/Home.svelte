<!-- Copyright (c) 2025 Apple Inc. Licensed under MIT License. -->
<script lang="ts">
  import Viewer from "./Viewer.svelte";

  import { BackendDataSource } from "./backend_data_source.js";
  import { BackendSearcher } from "./lib/ant/backend_searcher.js";

  let serverUrl = "./data/";
  if (import.meta.env.MODE == "development") {
    serverUrl = "http://localhost:5055/data/";
  }

  let dataSource = new BackendDataSource(serverUrl);
  let searcher = new BackendSearcher("./search");
</script>

<Viewer dataSource={dataSource} searcher={searcher} />
