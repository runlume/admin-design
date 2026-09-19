# 第三方许可与署名

本文件列出会随 `dist/` 一起分发的第三方组件（`package.json` 中 `dependencies` 的完整依赖闭包）及其许可。
`dist/licenses/` 下同时包含需要随产物一并分发的许可文本。

清点口径：从 `dependencies` 出发，按 `node_modules` 中实际解析到的版本遍历依赖闭包，读取每个包的
`license` 字段与 `LICENSE` 文件。开发依赖（Vite、TypeScript、Vitest、Playwright、VitePress 等）
不进入 `dist/`，不在本清单内。依赖升级后需要按同一口径重新清点。

## 许可文本

| 文件                                                       | 覆盖的组件                                              |
| ---------------------------------------------------------- | ------------------------------------------------------- |
| [Apache-2.0.txt](Apache-2.0.txt)                           | `class-variance-authority`                              |
| [MIT.txt](MIT.txt)                                         | 下表中许可为 MIT 的全部组件（版权声明见表中「版权」列） |
| [lucide-react-LICENSE.txt](lucide-react-LICENSE.txt)       | `lucide-react`（ISC 正文 + Feather 衍生图标的 MIT 部分） |
| [tslib-0BSD.txt](tslib-0BSD.txt)                           | `tslib`                                                 |
| [geist-OFL-1.1.txt](geist-OFL-1.1.txt)                     | `@fontsource-variable/geist` 字体文件                   |

## 组件清单

| 组件 | 版本 | 许可 | 版权 |
| --- | --- | --- | --- |
| `@babel/runtime` | 7.29.7 | MIT | Copyright (c) 2014-present Sebastian McKenzie and other contributors |
| `@floating-ui/core` | 1.8.0 | MIT | Copyright (c) 2021-present Floating UI contributors |
| `@floating-ui/dom` | 1.8.0 | MIT | Copyright (c) 2021-present Floating UI contributors |
| `@floating-ui/react-dom` | 2.1.9 | MIT | Copyright (c) 2021-present Floating UI contributors |
| `@floating-ui/utils` | 0.2.12 | MIT | Copyright (c) 2021-present Floating UI contributors |
| `@fontsource-variable/geist` | 5.3.0 | OFL-1.1 | Copyright 2024 The Geist Project Authors (https://github.com/vercel/geist-font) |
| `@hookform/resolvers` | 5.9.1 | MIT | Copyright (c) 2019-present Beier(Bill) Luo |
| `@radix-ui/number` | 1.1.3 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/primitive` | 1.1.7 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-accessible-icon` | 1.1.15 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-accordion` | 1.2.20 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-alert-dialog` | 1.1.23 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-arrow` | 1.1.15 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-aspect-ratio` | 1.1.15 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-avatar` | 1.2.6 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-checkbox` | 1.3.11 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-collapsible` | 1.1.20 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-collection` | 1.1.15 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-compose-refs` | 1.1.5 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-context` | 1.2.2 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-context-menu` | 2.3.7 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-dialog` | 1.1.23 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-direction` | 1.1.4 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-dismissable-layer` | 1.1.19 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-dropdown-menu` | 2.1.24 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-focus-guards` | 1.1.6 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-focus-scope` | 1.1.16 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-form` | 0.1.16 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-hover-card` | 1.1.23 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-id` | 1.1.4 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-label` | 2.1.15 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-menu` | 2.1.24 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-menubar` | 1.1.24 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-navigation-menu` | 1.2.22 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-one-time-password-field` | 0.1.16 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-password-toggle-field` | 0.1.11 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-popover` | 1.1.23 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-popper` | 1.3.7 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-portal` | 1.1.17 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-presence` | 1.1.10 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-primitive` | 2.1.10 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-progress` | 1.1.16 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-radio-group` | 1.4.7 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-roving-focus` | 1.1.19 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-scroll-area` | 1.2.18 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-select` | 2.3.7 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-separator` | 1.1.15 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-slider` | 1.4.7 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-slot` | 1.3.3 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-switch` | 1.3.7 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-tabs` | 1.1.21 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-toast` | 1.2.23 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-toggle` | 1.1.18 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-toggle-group` | 1.1.19 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-toolbar` | 1.1.19 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-tooltip` | 1.2.16 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-use-callback-ref` | 1.1.4 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-use-controllable-state` | 1.2.6 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-use-effect-event` | 0.0.5 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-use-escape-keydown` | 1.1.5 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-use-is-hydrated` | 0.1.3 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-use-layout-effect` | 1.1.4 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-use-previous` | 1.1.4 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-use-rect` | 1.1.4 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-use-size` | 1.1.4 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/react-visually-hidden` | 1.2.11 | MIT | Copyright (c) 2022 WorkOS |
| `@radix-ui/rect` | 1.1.3 | MIT | Copyright (c) 2022 WorkOS |
| `@standard-schema/utils` | 0.3.0 | MIT | Copyright (c) 2024 Fabian Hiller |
| `@tanstack/react-table` | 8.21.3 | MIT | Copyright (c) 2016 Tanner Linsley |
| `@tanstack/table-core` | 8.21.3 | MIT | Copyright (c) 2016 Tanner Linsley |
| `aria-hidden` | 1.2.6 | MIT | Copyright (c) 2017 Anton Korzunov |
| `class-variance-authority` | 0.7.1 | Apache-2.0 | Copyright (c) Joe Bell |
| `clsx` | 2.1.1 | MIT | Copyright (c) Luke Edwards <luke.edwards05@gmail.com> (lukeed.com) |
| `cookie` | 1.1.1 | MIT | Copyright (c) 2012-2014 Roman Shtylman <shtylman@gmail.com> |
| `detect-node-es` | 1.1.0 | MIT | Copyright (c) 2017 Ilya Kantor |
| `get-nonce` | 1.0.1 | MIT | Copyright (c) 2020 Anton Korzunov |
| `html-parse-stringify` | 4.0.1 | MIT | Copyright (c) 2025 Henrik Joreteg <henrik@joreteg.com> |
| `i18next` | 26.4.2 | MIT | Copyright (c) 2011-present i18next |
| `lucide-react` | 1.44.0 | ISC | Copyright (c) 2026 Lucide Icons and Contributors |
| `pinyin-pro` | 3.28.1 | MIT | Copyright (c) 2022-present zh-lx |
| `radix-ui` | 1.6.7 | MIT | Copyright (c) 2022 WorkOS |
| `react` | 19.3.0 | MIT | Copyright (c) Meta Platforms, Inc. and affiliates. |
| `react-dom` | 19.3.0 | MIT | Copyright (c) Meta Platforms, Inc. and affiliates. |
| `react-hook-form` | 7.87.0 | MIT | Copyright (c) 2019-present Beier(Bill) Luo |
| `react-i18next` | 17.0.13 | MIT | Copyright (c) 2015-present i18next |
| `react-remove-scroll` | 2.7.2 | MIT | Copyright (c) 2017 Anton Korzunov |
| `react-remove-scroll-bar` | 2.3.8 | MIT | Copyright (c) Anton Korzunov <thekashey@gmail.com> |
| `react-router` | 7.18.3 | MIT | Copyright (c) React Training LLC 2015-2019 |
| `react-style-singleton` | 2.2.3 | MIT | Copyright (c) 2017 Anton Korzunov |
| `scheduler` | 0.28.0 | MIT | Copyright (c) Meta Platforms, Inc. and affiliates. |
| `set-cookie-parser` | 2.7.2 | MIT | Copyright (c) 2015 Nathan Friedly <nathan@nfriedly.com> (http://nfriedly.com/) |
| `sonner` | 2.0.8 | MIT | Copyright (c) 2023 Emil Kowalski |
| `tailwind-merge` | 3.6.0 | MIT | Copyright (c) 2021 Dany Castillo |
| `tslib` | 2.8.1 | 0BSD | Copyright (c) Microsoft Corporation. |
| `use-callback-ref` | 1.3.3 | MIT | Copyright (c) 2017 Anton Korzunov |
| `use-sidecar` | 1.1.3 | MIT | Copyright (c) 2017 Anton Korzunov |
| `use-sync-external-store` | 1.7.0 | MIT | Copyright (c) Meta Platforms, Inc. and affiliates. |
| `zod` | 4.6.1 | MIT | Copyright (c) 2025 Colin McDonnell |
| `zustand` | 5.0.15 | MIT | Copyright (c) 2019 Paul Henschel |

## 分发时需要注意

1. `dist/` 整目录分发时，`licenses/` 必须一起保留 —— 本清单与五份许可文本都在其中。
2. `@fontsource-variable/geist` 分发的是字体文件，OFL-1.1 要求随字体附带其版权声明与许可文本，
   见 `geist-OFL-1.1.txt`；替换成其他字体时对应义务随之消失。
3. `lucide-react` 的许可文件包含两段：ISC 正文，以及从 Feather 项目衍生图标的 MIT 正文，
   两者都需要随产物保留，见 `lucide-react-LICENSE.txt`。
4. 只有把模板复制进业务系统后才接入的依赖（图表库、二维码、代码高亮、Iconify 等）不在本清单内，
   接入后需要按同一口径补录。
