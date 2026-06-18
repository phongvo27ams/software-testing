import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  blackBoxSidebar: [
    'black-box-testing/index',
    {
      type: 'category',
      label: 'Boundary Value Analysis',
      items: [
        'black-box-testing/boundary-value-analysis/11267/index',
        'black-box-testing/boundary-value-analysis/50944/index',
      ],
    },
    {
      type: 'category',
      label: 'Equivalence Class Partitioning',
      items: [
        'black-box-testing/equivalence-class-partitioning/47382/index',
      ],
    },
  ],
  testAutomationSidebar: [
    'test-automation/index',
    {
      type: 'category',
      label: 'Pending',
      items: [
        'test-automation/pending-topics/00542/index',
        'test-automation/pending-topics/73752/index',
      ],
    },
  ],
};

export default sidebars;
