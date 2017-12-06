process.env.NODE_ENV = 'test';
let reactVersion = require('react/package.json').version;
const semver = require('semver');

require('babel-register')({
  presets: ['es2015', 'stage-0', 'react'],
  plugins: ['transform-decorators-legacy', 'lodash']
});

var jsdom = require('jsdom').jsdom;
var chai = require('chai');

const Enzyme = require('enzyme');
const Adapter = require(semver.lt(reactVersion, '16.0.0') ? 'enzyme-adapter-react-15' : 'enzyme-adapter-react-16');
Enzyme.configure({ adapter: new Adapter() });

chai.use(require('sinon-chai'));
chai.use(require('chai-enzyme')());

global.document = jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
global.navigator = global.window.navigator;
