<script>
  import { fade, fly } from "svelte/transition";
  import Toggle from "./Toggle.svelte";
  import Button from "./Button.svelte";
  import unoLogo from "./uno-logo.svg";
</script>

<Toggle let:show={hide} let:toggle>
  <div class="mb-10 flex space-x-10 justify-center">
    <img
      src={unoLogo}
      class="w-7em h-7em transform transition-300 hover:will-change-filter"
      alt="UnoCSS"
    />

    {#if !hide}
      <span class="logo drop-shadow-on-hover" in:fly={{ y: 200, duration: 2000 }} out:fade />
    {/if}
  </div>

  <Button onclick={toggle}>Toggle Svelte Logo</Button>
</Toggle>

<style>
  img:hover {
    filter: drop-shadow(0 0 5em gray);
  }

  /* .logo is a shortcut and will be hashed on compile so we can't use .logo:hover in a manually written class */
  .drop-shadow-on-hover:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
</style>
