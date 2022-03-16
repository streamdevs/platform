import Link from 'next/link';
import React, { PropsWithChildren, ReactElement } from 'react';

import { Button } from '../Button';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: 'primary' | 'normal' | 'success' | 'warning' | 'error';
	href?: string;
};

export function ButtonLink(props: PropsWithChildren<Props>): ReactElement {
	const { children, href = '.', ...otherProps } = props;

	return (
		<Link href={href}>
			<a>
				<Button {...otherProps}>{children}</Button>
			</a>
		</Link>
	);
}
