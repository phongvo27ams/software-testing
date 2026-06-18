import type {ReactNode} from 'react';
import Admonition from '@theme/Admonition';

type HintCalloutProps = {
  title?: string;
  children: ReactNode;
};

export default function HintCallout({
  title = 'Approach guide',
  children,
}: HintCalloutProps) {
  return (
    <Admonition type="tip" title={title}>
      {children}
    </Admonition>
  );
}
