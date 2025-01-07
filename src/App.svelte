<script lang="ts">
  import { onMount } from 'svelte';
  import { WindowsAPI } from './lib/winapi';

  let screenSize = { width: 0, height: 0 };
  let error = '';
  let loading = false;

  async function showMessage() {
    if (loading) return;
    
    try {
      loading = true;
      error = '';
      await WindowsAPI.showMessage('Hello from Windows API!');
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to show message';
    } finally {
      loading = false;
    }
  }

  onMount(async () => {
    try {
      screenSize = await WindowsAPI.getScreenSize();
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to get screen size';
    }
  });
</script>

<main>
  <h1>Svelte Windows API Demo</h1>
  
  <div class="card">
    <button on:click={showMessage} disabled={loading}>
      {#if loading}Loading...{:else}Show Message{/if}
    </button>
    
    <p>Screen Resolution: {screenSize.width} x {screenSize.height}</p>
    
    {#if error}
      <p class="error">{error}</p>
    {/if}
  </div>

  <p class="read-the-docs">
    Click the button to test Windows API integration
  </p>
</main>

<style>
  .card {
    padding: 2em;
  }

  button {
    padding: 0.6em 1.2em;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
    background-color: #1a1a1a;
    cursor: pointer;
    transition: border-color 0.25s;
    border: 1px solid transparent;
    border-radius: 8px;
    color: white;
  }
  button:hover:not(:disabled) {
    border-color: #646cff;
  }
  button:focus,
  button:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
  }
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .error {
    color: #ff3e00;
    margin-top: 1em;
  }
</style>
