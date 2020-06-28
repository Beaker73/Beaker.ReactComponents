import React from 'react';
import { Fabric } from '@fluentui/react';

import "./style.css";

import { BladeHost } from './lib';
import { RootBlade } from "./RootBlade";

export function Example() {
	return <Fabric>
		<BladeHost className="fullPage" root={{bladeType: RootBlade, bladeProps: {}}} />
	</Fabric>;
}
