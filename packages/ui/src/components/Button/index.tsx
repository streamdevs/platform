import React, { PropsWithChildren, ReactElement } from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: 'primary' | 'normal' | 'success' | 'warning' | 'error';
};

export function Button(props: PropsWithChildren<Props>): ReactElement {
	const { children, variant = 'normal', ...otherProps } = props;

	if (otherProps.disabled) {
		return (
			<button {...otherProps} className="nes-btn is-disabled">
				{children}
			</button>
		);
	}

	return (
		<button {...otherProps} className={`nes-btn is-${variant}`}>
			{children}
		</button>
	);
}
