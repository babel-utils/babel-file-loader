// @flow
'use strict';
const {readFileSync} = require('fs');
const readFileAsync = require('read-file-async');
const {sync: resolveSync} = require('resolve');
const resolveAsync = require('resolve-async');
const createFile = require('babel-file');
const path = require('path');
const t = require('babel-types');

/*::
type Node = {
  type: string,
  [key: string]: any,
};

type Path = {
  type: string,
  node: Node,
  [key: string]: any,
};

type ParserOptions = {
  [key: string]: any,
};

type ResolveOptions = {
  package?: Object,
  extensions?: Array<string>,
  readFile?: Function,
  isFile?: Function,
  packageFilter?: Function,
  pathFilter?: Function,
  paths?: Array<string>,
  moduleDirectory?: string | Array<string>,
};
*/

function getPathFileName(path) {
  return path.hub.file.opts.filename;
}

function getImportSource(path) {
  return path.node.source.value;
}

function toResolveOptions(fromPath, resolveOpts) {
  return Object.assign({}, resolveOpts, {
    basedir: path.dirname(fromPath),
  });
}

function resolveFilePathAsync(
  path /*: Path */,
  filePath /*: string */,
  resolveOpts /*:? ResolveOptions */
) {
  let fromPath = getPathFileName(path);
  let opts = toResolveOptions(fromPath, resolveOpts);
  return resolveAsync(filePath, opts);
}

function resolveFilePathSync(
  path /*: Path */,
  filePath /*: string */,
  resolveOpts /*:? ResolveOptions */
) {
  let fromPath = getPathFileName(path);
  let opts = toResolveOptions(fromPath, resolveOpts);
  return resolveSync(filePath, opts);
}

function resolveImportFilePathAsync(
  importDeclaration /*: Path */,
  resolveOpts /*:? ResolveOptions */
) {
  let fromPath = getPathFileName(importDeclaration);
  let toPath = getImportSource(importDeclaration);
  let opts = toResolveOptions(fromPath, resolveOpts);
  return resolveAsync(toPath, opts);
}

function resolveImportFilePathSync(
  importDeclaration /*: Path */,
  resolveOpts /*:? ResolveOptions */
) {
  let fromPath = getPathFileName(importDeclaration);
  let toPath = getImportSource(importDeclaration);
  let opts = toResolveOptions(fromPath, resolveOpts);
  return resolveSync(toPath, opts);
}

function loadFileAsync(filePath /*: string */, parserOpts /*:? ParserOptions */) {
  return readFileAsync(filePath).then(buffer => {
    return createFile(buffer.toString(), {
      filename: filePath,
      parserOpts,
    });
  });
}

function loadFileSync(filePath /*: string */, parserOpts /*:? ParserOptions */) {
  let buffer = readFileSync(filePath);
  return createFile(buffer.toString(), {
    filename: filePath,
    parserOpts,
  });
}

function loadImportAsync(
  importDeclaration /*: Path */,
  resolveOpts /*:? ResolveOptions */,
  parserOpts /*:? ParserOptions */
) {
  return resolveImportFilePathAsync(
    importDeclaration,
    resolveOpts
  ).then(resolved => {
    return loadFileAsync(resolved, parserOpts);
  });
}

function loadImportSync(
  importDeclaration /*: Path */,
  resolveOpts /*:? ResolveOptions */,
  parserOpts /*:? ParserOptions */
) {
  const resolved = resolveImportFilePathSync(importDeclaration, resolveOpts);
  const file = loadFileSync(resolved, parserOpts);
  return file;
}

module.exports = {
  resolveFilePathAsync,
  resolveFilePathSync,
  resolveImportFilePathAsync,
  resolveImportFilePathSync,
  loadFileAsync,
  loadFileSync,
  loadImportAsync,
  loadImportSync,
};
