import * as buttons from '../button/index.js';
import * as fields from '../field/index.js';
import * as inputs from '../input/index.js';

import React, { useMemo } from 'react';
import { SimpleForm, useResourceContext } from 'react-admin';

import Component from './Component';
import Input from './Input';
import TabbedForm from '../form/TabbedForm';
import Toolbar from '../form/Toolbar';
import useBackUrl from '../form/useBackUrl.js';
import { useCrudContext } from '../../data/crud/CrudContext';
import useCustomComponents from './useCustomComponents';
import useSaveMutation from '../../data/useSaveMutation';
import { useWorkflowContext } from '../../data/workflow/WorkflowContext';

const Form = ({ ...props }) => {
	const { getForm, components } = useCrudContext();
	const { getWorkflow } = useWorkflowContext();
	const resource = useResourceContext();
	const form = useMemo(() => getForm(resource), [resource, getForm]);
	const workflow = useMemo(
		() => (form?.useWorkflow ? getWorkflow(resource) : null),
		[resource, getWorkflow, form]
	);
	const customComponents = useCustomComponents(resource);
	const backUrl = useBackUrl({ ...props, ...form?.toolbar?.componentProps });
	const save = useSaveMutation({
		...props,
		refresh: form?.refresh,
		redirect: backUrl || form?.redirect
	});

	if (form === false || form === null) {
		return null;
	}

	return (
		<Component
			{...props}
			onSubmit={save}
			toolbar={
				<Component
					component={form?.toolbar?.component}
					componentProps={{
						useWorkflow: form?.useWorkflow,
						useCustomButtons: form?.useCustomButtons,
						buttons: form?.buttons,
						components: {
							...buttons,
							...customComponents
						},
						...form?.toolbar?.componentProps
					}}
					components={{
						Toolbar,
						...buttons,
						...customComponents
					}}
				/>
			}
			defaultValues={form?.defaultValues}
			sanitizeEmptyValues={form?.sanitizeEmptyValues}
			// FIXME: Disabled while this issue is not fixed:
			// https://github.com/marmelab/react-admin/issues/8819
			// warnWhenUnsavedChanges={form?.warnWhenUnsavedChanges}
			component={form?.component}
			componentProps={form?.componentProps}
			components={{
				SimpleForm,
				TabbedForm,
				...components,
				...customComponents
			}}
		>
			{form?.inputs?.map(
				({
					source,
					label,
					component,
					useWorkflow,
					componentProps: { fullWidth, ...restComponentProps }
				}) =>
					form?.useWorkflow && workflow !== null && useWorkflow === true ? (
						<Input
							key={source}
							source={source}
							fullWidth
							component={
								<Component
									key={source}
									source={source}
									label={label}
									fullWidth={fullWidth}
									component={component}
									componentProps={{
										fullWidth,
										components: {
											...fields,
											...inputs,
											...components,
											...customComponents
										},
										...restComponentProps
									}}
									components={{
										...fields,
										...inputs,
										...components,
										...customComponents
									}}
								/>
							}
						/>
					) : (
						<Component
							key={source}
							source={source}
							label={label}
							fullWidth={fullWidth}
							component={component}
							componentProps={{
								fullWidth,
								components: {
									...fields,
									...inputs,
									...components,
									...customComponents
								},
								...restComponentProps
							}}
							components={{
								...fields,
								...inputs,
								...components,
								...customComponents
							}}
						/>
					)
			)}
		</Component>
	);
};

export default Form;
