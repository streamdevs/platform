// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';

import { Input } from '.';

type Props = React.ComponentProps<typeof Input>;

export default {
	title: 'lights/Input',
	component: Input,
} as Meta;

const Template: Story<Props> = (args) => <Input {...args} />;

export const Default = Template.bind({});
Default.args = {
	label: 'label',
};
