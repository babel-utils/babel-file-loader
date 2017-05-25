// @flow
'use strict';
const {
  resolveFilePathAsync,
  resolveFilePathSync,
  resolveImportFilePathAsync,
  resolveImportFilePathSync,
  loadFileAsync,
  loadFileSync,
  loadImportAsync,
  loadImportSync,
} = require('./');
const path = require('path');
const createFile = require('babel-file');

let isFile = (fileName, cb) => cb(null, true);
let isFileSync = fileName => true;

test('resolveFilePathAsync()', () => {
  let file = createFile('foo;', {
    filename: 'foo.js',
  });

  return resolveFilePathAsync(file.path, './bar.js', {
    isFile: isFile,
  }).then(result => {
    expect(result).toMatch(/\/bar\.js$/)
  });
});

test('resolveFilePathSync()', () => {
  let file = createFile('foo;', {
    filename: 'foo.js',
  });

  let result = resolveFilePathSync(file.path, './bar.js', {
    isFile: isFileSync,
  });

  expect(result).toMatch(/\/bar\.js$/);
});

test('resolveImportFilePathAsync()', () => {
  let file = createFile('import "./bar";', {
    filename: 'foo.js',
  });

  let importDeclaration = file.path.get('body')[0];

  return resolveImportFilePathAsync(importDeclaration, {
    isFile: isFile,
  }).then(result => {
    expect(result).toMatch(/\/bar$/)
  });
});

test('resolveImportFilePathSync()', () => {
  let file = createFile('import "./bar";', {
    filename: 'foo.js',
  });

  let importDeclaration = file.path.get('body')[0];

  let result = resolveImportFilePathSync(importDeclaration, {
    isFile: isFileSync,
  });

  expect(result).toMatch(/\/bar$/);
});

test('loadFileAsync()', () => {
  return loadFileAsync('fixture.js').then(result => {
    expect(result.code).toContain('// fixture');
    expect(result).toHaveProperty('path');
  });
});

test('loadFileSync()', () => {
  let result = loadFileSync('fixture.js');
  expect(result.code).toContain('// fixture');
  expect(result).toHaveProperty('path');
});

test('loadImportAsync()', () => {
  let file = createFile('import "./fixture";', {
    filename: path.join(__dirname, 'test.js'),
  });

  let importDeclaration = file.path.get('body')[0];
  return loadImportAsync(importDeclaration).then(result => {
    expect(result.code).toContain('// fixture');
    expect(result).toHaveProperty('path');
  });
});

test('loadImportSync()', () => {
  let file = createFile('import "./fixture";', {
    filename: path.join(__dirname, 'test.js'),
  });

  let importDeclaration = file.path.get('body')[0];
  let result = loadImportSync(importDeclaration);
  expect(result.code).toContain('// fixture');
  expect(result).toHaveProperty('path');
});
