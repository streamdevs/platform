// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';

import { Card } from '.';

type Props = React.ComponentProps<typeof Card>;

export default {
	title: 'lights/Card',
	component: Card,
} as Meta;

const Template: Story<Props> = (args) => <Card {...args} />;

export const Default = Template.bind({});
Default.args = {
	children: 'content',
	title: '',
	centered: false,
};

export const WithTitle = Template.bind({});
WithTitle.args = {
	title: 'Title',
	children: 'content',
	centered: false,
};
