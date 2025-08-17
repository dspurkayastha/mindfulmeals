import React from 'react';
import { ViewStyle } from 'react-native';
import { MotiView } from 'moti';

interface AnimatedSurfaceProps {
	children: React.ReactNode;
	style?: ViewStyle;
	delay?: number;
}

const AnimatedSurface: React.FC<AnimatedSurfaceProps> = ({ children, style, delay = 0 }) => {
	return (
		<MotiView
			from={{ opacity: 0, translateY: 8 }}
			animate={{ opacity: 1, translateY: 0 }}
			transition={{ type: 'timing', duration: 500, delay }}
			style={style}
		>
			{children}
		</MotiView>
	);
};

export default AnimatedSurface;