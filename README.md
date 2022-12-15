# MarCNV - CNV evaluation web

CNV evaluation web for both ACMG criteria and machine learning prediction (ISV).

## Development

### with `yarn`

1. Install all dependencies

   ```shell
   yarn install
   ```

2. Create a `.env` file with following variables (this is a working example)

   ```shell
   REACT_APP_BACKEND_URL="0.0.0.0:8000"
   REACT_APP_ORIGIN_URL="0.0.0.0:8000"
   ```

3. Start app

   ```shell
   yarn start
   ```

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.
You will also see any lint/format errors in the console.

### `yarn lint`

Runs the linter (linter config is in .eslintrc.json). Make sure there are no linter errors or warnings in the production build.

### `yarn format`

Runs the code formatter (code formatter config is in .prettierrc).

### `yarn build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.
