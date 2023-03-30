<script lang="ts">
  export let onclick: () => any;
</script>

<button
  class="font-semibold classes-needing-global-context-must-use-global-to-avoid-being-stripped-out-by-consuming-library"
  on:click={onclick}
  type="button"
>
  <span class="i-logos:svelte-icon" />
  <slot /></button
>

<style>
  button {
    --at-apply: bg-red-100 hover:bg-red-200 p-3 rounded
  }
  :global(.classes-needing-global-context-must-use-global-to-avoid-being-stripped-out-by-consuming-library) {
    --at-apply: dark:bg-red-700 dark:hover:bg-red-600
  }
</style>
