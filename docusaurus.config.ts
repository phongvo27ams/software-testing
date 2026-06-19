import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const isProd = process.env.NODE_ENV === 'production';

const config: Config = {
  title: 'Software Testing',
  tagline: 'Practice notes and sample answers for software testing',
  favicon: 'img/favicon.ico',
  future: {
    v4: true,
  },
  markdown: {
    mermaid: true,
  },
  url: 'https://phongvo27ams.github.io',
  baseUrl: isProd ? '/software-testing/' : '/',
  organizationName: 'phongvo27ams',
  projectName: 'software-testing',
  onBrokenLinks: 'throw',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/phongvo27ams/software-testing/tree/main/',
          remarkPlugins: [require('remark-math')],
          rehypePlugins: [require('rehype-katex')],
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl: 'https://github.com/phongvo27ams/software-testing/tree/main/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  plugins: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        indexDocs: true,
        language: 'en',
        searchBarPosition: 'right',
      },
    ],
  ],
  themes: [require.resolve('@docusaurus/theme-mermaid')],
  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'Software Testing',
      logo: {
        alt: 'Software Testing Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'blackBoxSidebar',
          position: 'left',
          label: 'Black Box Testing',
        },
        {
          type: 'docSidebar',
          sidebarId: 'testAutomationSidebar',
          position: 'left',
          label: 'Test Automation',
        },
        {
          type: 'search',
          position: 'right',
        },
        {
          href: 'https://github.com/phongvo27ams/software-testing',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Black Box Testing',
              to: '/docs',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/docusaurus',
            },
            {
              label: 'X',
              href: 'https://x.com/docusaurus',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Test Automation',
              to: '/docs/test-automation',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/phongvo27ams/software-testing',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Software Testing Exercises. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.vsLight,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['java'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
