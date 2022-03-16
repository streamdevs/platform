// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';

import { Select } from '.';

type SelectProps = React.ComponentProps<typeof Select>;

export default {
	title: 'lights/Select',
	component: Select,
} as Meta;

const Template: Story<SelectProps> = (args) => <Select {...args} />;

export const Normal = Template.bind({});
Normal.args = {
	id: 'id',
	options: [{ label: 'option 1', value: 'option 1' }],
	label: 'Select',
	variant: 'normal',
	placeholder: 'Select one...',
};

export const Success = Template.bind({});
Success.args = {
	id: 'id',
	options: [{ label: 'option 1', value: 'option 1' }],
	label: 'Select',
	variant: 'success',
	placeholder: 'Select one...',
};

export const Warning = Template.bind({});
Warning.args = {
	id: 'id',
	options: [{ label: 'option 1', value: 'option 1' }],
	label: 'Select',
	variant: 'warning',
	placeholder: 'Select one...',
};

export const Error = Template.bind({});
Error.args = {
	id: 'id',
	options: [{ label: 'option 1', value: 'option 1' }],
	label: 'Select',
	variant: 'error',
	placeholder: 'Select one...',
};
