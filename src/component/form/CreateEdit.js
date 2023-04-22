import React from 'react';

import PropTypes from 'prop-types';
import {
  Create as RaCreate,
  CreateBase,
  Edit as RaEdit,
  EditBase,
  useResourceContext,
} from 'react-admin';

import {
  Card,
  styled,
} from '@mui/material';

import FormHeader from './FormHeader';

const StyledRoot = styled("div", {
	// Configure which props should be forwarded on DOM
	shouldForwardProp: (prop) =>
		prop !== "color" && prop !== "variant" && prop !== "sx",
	slot: "Root",
	name: "FobForm",
	// We are specifying here how the styleOverrides are being applied based on props
	overridesResolver: (props, styles) => [styles.root],
})(({ theme }) => ({}));

const CreateEdit = ({
	component: Root = "div",
	mode,
	actions,
	title,
	children,
	leftSide,
	rightSide,
	...props
}) => {
	const resource = useResourceContext(props);
	const ActionComponent = mode === "create" ? CreateBase : EditBase;
	const defaultTitle = `resources.${resource}.name`;
	return (
		<StyledRoot className="FobForm">
			<ActionComponent {...props}>
				<FormHeader title={title || defaultTitle} actions={actions} />
				{leftSide && React.cloneElement(leftSide)}
				<Root>
					{React.cloneElement(children, {
						mode,
					})}
				</Root>
				{rightSide && React.cloneElement(rightSide)}
			</ActionComponent>
		</StyledRoot>
	);
};

CreateEdit.defaultProps = {
	mode: "create",
	component: Card,
	actions: [],
	leftSide: false,
	rightSide: false,
	mutationMode: "pessimistic",
};

CreateEdit.propTypes = {
	...RaCreate.propTypes,
	...RaEdit.propTypes,
	mode: PropTypes.oneOf(["create", "edit"]),
	component: PropTypes.object,
	actions: PropTypes.arrayOf(PropTypes.element),
	title: PropTypes.string,
	leftSide: PropTypes.oneOfType([PropTypes.bool, PropTypes.element]),
	rightSide: PropTypes.oneOfType([PropTypes.bool, PropTypes.element]),
};

export default CreateEdit;
