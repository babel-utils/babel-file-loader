# babel-file-loader

> Load files into memory to be parsed & traversed using [Babylon](https://github.com/babel/babylon)/Babel

```js
import {loadImportSync} from 'babel-file-loader';

export function plugin() {
  return {
    visitor: {
      ImportDefaultDeclaration(path) {
        let file = loadImportSync(path);

        file.path.traverse({
          ExportDefaultDeclaration() {
            console.log('Found matching export default');
          },
        });
      },
    },
  },
};
```

## API

#### `resolveFilePath{Async,Sync}(path, filePath, resolveOpts)`

Resolve a `filePath` relative to the file a `path` belongs to. Returns string.

#### `resolveImportFilePath{Async,Sync}(path, resolveOpts)`

Resolve an import declaration `path` to extract a file path. Returns string.

#### `loadFile{Async,Sync}(filePath, parserOpts)`

Load and parse a file from a `filePath`. Returns [File](https://github.com/babel-utils/babel-file).

#### `loadImport{Async,Sync}(path, resolveOpts, parserOpts)`

Load and parse a file from an import declaration `path`. Returns [File](https://github.com/babel-utils/babel-file).
