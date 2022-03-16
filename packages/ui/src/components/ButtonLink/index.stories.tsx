// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';

import { ButtonLink } from '.';

type ButtonLinkProps = React.ComponentProps<typeof ButtonLink>;

export default {
	title: 'lights/ButtonLink',
	component: ButtonLink,
} as Meta;

const Template: Story<ButtonLinkProps> = (args) => <ButtonLink {...args} />;

export const Primary = Template.bind({});
Primary.args = {
	variant: 'primary',
	children: 'ButtonLink',
};

export const Normal = Template.bind({});
Normal.args = {
	variant: 'normal',
	children: 'ButtonLink',
};

export const Success = Template.bind({});
Success.args = {
	variant: 'success',
	children: 'ButtonLink',
};

export const Warning = Template.bind({});
Warning.args = {
	variant: 'warning',
	children: 'ButtonLink',
};

export const Error = Template.bind({});
Error.args = {
	variant: 'error',
	children: 'ButtonLink',
};

export const Disabled = Template.bind({});
Disabled.args = {
	disabled: true,
	children: 'ButtonLink',
};
