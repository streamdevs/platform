import React, { ReactElement } from 'react';

type Props = React.SelectHTMLAttributes<HTMLSelectElement> & {
	variant?: 'normal' | 'success' | 'warning' | 'error';
	options: { value: string; label: string }[];
	label: string;
	placeholder: string;
	className: string;
};

export function Select(props: Props): ReactElement {
	const { variant, options, label, placeholder, className, ...selectProps } = props;

	return (
		<div className={className}>
			<label htmlFor={selectProps.id} className={`nes-text is-${variant}`}>
				{label}
			</label>
			<div className={`nes-select is-${variant}`}>
				<select {...selectProps}>
					<option value="" disabled selected>
						{placeholder}
					</option>
					{options.map((option) => (
						<option value={option.value} key={option.value}>
							{option.label}
						</option>
					))}
				</select>
			</div>
		</div>
	);
}
