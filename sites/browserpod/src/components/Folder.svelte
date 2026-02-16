<script>
  export let name = '';
  export let files = [];
  export let expanded = false;

  let open = expanded;
  const toggle = () => (open = !open);
</script>

<div class="bp-tree-folder">
  <button type="button" class="bp-tree-row" on:click={toggle} aria-expanded={open}>
    <span class="bp-tree-caret">{open ? '▾' : '▸'}</span>
    <span class="bp-tree-name">{name}</span>
  </button>

  {#if open}
    <ul class="bp-tree-children">
      {#each files as file}
        {#if file.type === 'folder'}
          <li>
            <Folder name={file.name} files={file.files} expanded={file.expanded} />
          </li>
        {:else}
          <li class="bp-tree-row bp-tree-file">
            <span class="bp-tree-bullet">•</span>
            <span class="bp-tree-name">{file.name}</span>
          </li>
        {/if}
      {/each}
    </ul>
  {/if}
</div>
