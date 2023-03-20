# Why?

## Scoping utility classes by component unleashes creativity

A global css file that only includes used utilities is great for small and medium apps, but there will come a point in a large project's life when every time you start to write a class like `.md:max-w-[50vw]` that you know is only going to be used once you start to cringe as you feel the size of your global style sheet getting larger and larger. This inhibits creativity. Sure, you could use `@apply md:max-w-[50vw]` in the style block but that gets tedious, and styles in context are so useful. Furthermore, if you would like to include a great variety of icons in your project, you will begin to feel the weight of adding them to the global stylesheet. When each component bears the weight of its own styles and icons you can continue to expand your project without building an evergrowing global stylesheet.

Another benefit is that if used to build a component library, your library won't need to match the particular Uno, Windi, Tailwind setup/version of your sites. This allows for easier of upgrades of all parts of your ecosystem, because they work well together but aren't dependent on each other. You also won't need to include a global stylesheet alongside your components for them to be used properly. You only need to pay attention to global theme variables and style resets.

## Completely isolated styles are impractical

There is a problem with purely isolated styles. Many styles are dependent on elements and styles set in a parent or child component, such as `dark:`, `rtl:`, and `.space-x-1`. The issue of how to easily pass styles down to children components is still being wrestled with in the Svelte world. Fortunately `svelte-scoped` mode solves all of these problems as each utility class (or set of classes) is scoped based on filename + class name(s) hashes and made global. Because they are global they will have influence everywhere and because their names are unique they will conflict nowhere.