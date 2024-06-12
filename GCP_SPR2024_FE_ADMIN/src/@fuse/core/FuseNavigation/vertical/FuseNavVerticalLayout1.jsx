import List from '@mui/material/List';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import FuseNavItem from '../FuseNavItem';
import { userRoles } from './roles';
import { useEffect, useState } from 'react';

const StyledList = styled(List)(({ theme }) => ({
	'& .fuse-list-item': {
		'&:hover': {
			backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0,0,0,.04)'
		},
		'&:focus:not(.active)': {
			backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0,0,0,.05)'
		}
	},
	'& .fuse-list-item-text': {
		margin: 0
	},
	'& .fuse-list-item-text-primary': {
		lineHeight: '20px'
	},
	'&.active-square-list': {
		'& .fuse-list-item, & .active.fuse-list-item': {
			width: '100%',
			borderRadius: '0'
		}
	},
	'&.dense': {
		'& .fuse-list-item': {
			paddingTop: 0,
			paddingBottom: 0,
			height: 32
		}
	}
}));

/**
 * FuseNavVerticalLayout1
 * This component is used to render vertical navigations using
 * the Material-UI List component. It accepts the FuseNavigationProps props
 * and renders the FuseNavItem components accordingly
 */
function FuseNavVerticalLayout1(props) {
	const { navigation, active, dense, className, onItemClick, checkPermission } = props;
	const [organizatorPermissionsExist, setOrganizatorPermissionsExist] = useState([]);

	function handleItemClick(item) {
		onItemClick?.(item);
	}

	useEffect(() => {
		const user = JSON.parse(localStorage.getItem('USER')) || {};

		if (user == null || Object.keys(user).length === 0) {
			localStorage.removeItem('USER');
			window.open('/sign-in', '_self');
		}

		const organizatorPermissions = userRoles[user.role];

		const organizatorPermissionsExist = navigation.map(group => {
			const filteredChildren = group.children.filter(child => organizatorPermissions?.includes(child.id));
			return {
				...group,
				children: filteredChildren
			};
		});
		setOrganizatorPermissionsExist(organizatorPermissionsExist);
	}, [])


	return (
		<StyledList
			className={clsx(
				'navigation whitespace-nowrap px-12 py-0',
				`active-${active}-list`,
				dense && 'dense',
				className
			)}
		>
			{organizatorPermissionsExist.map((_item) => (
				<FuseNavItem
					key={_item.id}
					type={`vertical-${_item.type}`}
					item={_item}
					nestedLevel={0}
					onItemClick={handleItemClick}
					checkPermission={checkPermission}
				/>
			))}
		</StyledList>
	);
}

export default FuseNavVerticalLayout1;