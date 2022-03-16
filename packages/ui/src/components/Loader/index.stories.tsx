// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';

import { Loader } from '.';

type Props = React.ComponentProps<typeof Loader>;

export default {
	title: 'lights/Loader',
	component: Loader,
} as Meta;

const Template: Story<Props> = (args) => <Loader {...args} />;

export const Default = Template.bind({});
