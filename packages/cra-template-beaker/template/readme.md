# TypeError: Cannot assign to read only property 'jsx' of object '#<Object>'

Until the issue is fixed, we can work arround it by doing the manual change below:

[Github Issue](https://github.com/facebook/create-react-app/issues/10110#issuecomment-731150528)

> I've just had this exact error, the problem is in `create-react-app\packages\react-scripts\scripts\utils\verifyTypeScriptSetup.js` on Line 151 (to find it search for ts.JsxEmit.ReactJ) it was using `ts.JsxEmit.ReactJsx` but should use `ts.JsxEmit.ReactJSX` (JSX being upper case)