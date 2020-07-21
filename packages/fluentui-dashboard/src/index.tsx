import React from 'react';
import ReactDOM from 'react-dom';
import { initializeIcons } from '@fluentui/react';

import "./Style.css";

import { Example } from './Example';

initializeIcons();

ReactDOM.render(
	<React.StrictMode>
		<Example />
	</React.StrictMode>,
	document.getElementById('root')
);

