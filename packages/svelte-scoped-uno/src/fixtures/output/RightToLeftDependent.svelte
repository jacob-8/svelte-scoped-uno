<script>
  import ReceivesClassProp from "./ReceivesClassProp.svelte";
</script>

<div class="uno-ek1oz3">
  <div class="uno-t0bcda">Green when RTL</div>
  <ReceivesClassProp class="uno-bys9v7" number={1} />
  <ReceivesClassProp class="uno-h7cqzm" number={2} />
  <ReceivesClassProp number={3} />
</div>

<div class="apply-spacing">
  <div class="uno-t0bcda">Green when RTL</div>
  <ReceivesClassProp class="uno-bys9v7" number={1} />
  <ReceivesClassProp class="uno-h7cqzm" number={2} />
  <ReceivesClassProp number={3} />
</div>

<style>
  :global(.uno-ek1oz3) {
    display: flex;
  }
  :global(.uno-ek1oz3 > :not([hidden]) ~ :not([hidden])) {
    --un-space-x-reverse: 0;
    margin-left: calc(0.25rem * calc(1 - var(--un-space-x-reverse)));
    margin-right: calc(0.25rem * var(--un-space-x-reverse));
  }
  :global([dir="rtl"] .uno-ek1oz3 > :not([hidden]) ~ :not([hidden])) {
    --un-space-x-reverse: 1;
  }
  :global(.uno-bys9v7) {
    font-weight: 600;
    --un-text-opacity: 1;
    color: rgba(59, 130, 246, var(--un-text-opacity));
  }
  :global(.uno-h7cqzm) {
    font-weight: 700;
    --un-text-opacity: 1;
    color: rgba(239, 68, 68, var(--un-text-opacity));
  }
  :global([dir="rtl"] .uno-t0bcda) {
    --un-text-opacity: 1;
    color: rgba(22, 163, 74, var(--un-text-opacity));
  }
  @media (min-width: 768px) {
    :global(.uno-ek1oz3 > :not([hidden]) ~ :not([hidden])) {
      --un-space-x-reverse: 0;
      margin-left: calc(1rem * calc(1 - var(--un-space-x-reverse)));
      margin-right: calc(1rem * var(--un-space-x-reverse));
    }
  }
  .apply-spacing {
    display: flex;
  }
  .apply-spacing > :not([hidden]) ~ :not([hidden]) {
    --un-space-x-reverse: 0;
    margin-left: calc(0.25rem * calc(1 - var(--un-space-x-reverse)));
    margin-right: calc(0.25rem * var(--un-space-x-reverse));
  }
  [dir="rtl"] .apply-spacing > :not([hidden]) ~ :not([hidden]) {
    --un-space-x-reverse: 1;
  }
  @media (min-width: 768px) {
    .apply-spacing > :not([hidden]) ~ :not([hidden]) {
      --un-space-x-reverse: 0;
      margin-left: calc(1rem * calc(1 - var(--un-space-x-reverse)));
      margin-right: calc(1rem * var(--un-space-x-reverse));
    }
  }
</style>
