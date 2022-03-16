// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';

import { Button } from '.';

type ButtonProps = React.ComponentProps<typeof Button>;

export default {
	title: 'lights/Button',
	component: Button,
} as Meta;

const Template: Story<ButtonProps> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
	variant: 'primary',
	children: 'Button',
};

export const Normal = Template.bind({});
Normal.args = {
	variant: 'normal',
	children: 'Button',
};

export const Success = Template.bind({});
Success.args = {
	variant: 'success',
	children: 'Button',
};

export const Warning = Template.bind({});
Warning.args = {
	variant: 'warning',
	children: 'Button',
};

export const Error = Template.bind({});
Error.args = {
	variant: 'error',
	children: 'Button',
};

export const Disabled = Template.bind({});
Disabled.args = {
	disabled: true,
	children: 'Button',
};
