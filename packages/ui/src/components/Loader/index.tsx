import React, { ReactElement, useEffect, useState } from 'react';

interface Props {
	variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'pattern';
}

export function Loader(props: Props): ReactElement {
	const { variant = 'default' } = props;
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setProgress((actual) => (actual === 100 ? 0 : actual + 10));
		}, 500);

		return () => clearTimeout(timeout);
	}, [progress]);

	return <progress className={`nes-progress is-${variant}`} value={progress} max="100" />;
}
