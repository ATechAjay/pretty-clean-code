# pretty-clean-code

> Opinionated Prettier initializer for modern JavaScript projects.
> Supports Node.js, React, Next.js, TypeScript, HTML, CSS and Tailwind.

---

## ✨ Features

- Clean, sensible Prettier defaults
- Automatic import sorting
- Tailwind class sorting
- Node & Next.js presets
- Detects npm / yarn / pnpm automatically
- Creates `prettier.config.js`
- Creates `.prettierignore`
- Adds `format` and `format:check` scripts
- Optional instant project formatting
- Zero manual config writing

---

## 🚀 Quick Start

```bash
npx pretty-clean-code next
```

or

```bash
npx pretty-clean-code node
```

---

## 📦 What Happens Automatically

The CLI will:

1. Install Prettier and required plugins
2. Create `prettier.config.js` (if not exists)
3. Create `.prettierignore` (if not exists)
4. Inject formatting scripts into `package.json`
5. Ask if you want to format the project immediately

---

## 📂 Available Presets

### Base

```bash
npx pretty-clean-code base
```

### Node

```bash
npx pretty-clean-code node
```

### Next.js

```bash
npx pretty-clean-code next
```

---

## 🧪 Formatting Commands

```bash
npm run format
npm run format:check
npx prettier --write <file>
```

---

## 📄 License

MIT
