import React, { PropsWithChildren, ReactElement } from 'react';

interface Props {
	title?: string;
	centered?: boolean;
}

export function Card(props: PropsWithChildren<Props>): ReactElement {
	const { children, title, centered } = props;

	return (
		<div
			className={`nes-container is-rounded ${title && 'with-title'} ${centered && `is-centered`}`}
		>
			{title && <p className="title">{title}</p>}
			<div className={`${centered && 'text-center flex justify-center'}`}>{children}</div>
		</div>
	);
}
