import React from 'react';
import ReactDOM from 'react-dom';
import { initializeIcons } from '@fluentui/react';

import "./style.css";

import { Example } from './Example';
import { BladeHost } from './lib';

initializeIcons();

ReactDOM.render(
	<React.StrictMode>
		<BladeHost>
			<Example />
		</BladeHost>
	</React.StrictMode>,
	document.getElementById('root')
);

