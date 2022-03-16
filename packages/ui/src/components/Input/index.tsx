import React, { ReactElement } from 'react';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
	variant?: 'default' | 'success' | 'warning' | 'error';
	label: string;
};

export function Input(props: Props): ReactElement {
	const { variant, label, ...inputProps } = props;

	return (
		<div className="nes-field">
			<label htmlFor={inputProps.id}>{label}</label>
			<input {...inputProps} className={`nes-input is-${variant}`} />
		</div>
	);
}
