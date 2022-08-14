# Welcome to your VS Code Extension

## What's in the folder

- This folder contains all of the files necessary for your extension.
- `package.json` - this is the manifest file in which you declare your extension and command.
  - The sample plugin registers a command and defines its title and command name. With this information VS Code can show the command in the command palette. It doesn’t yet need to load the plugin.
- `src/extension.ts` - this is the main file where you will provide the implementation of your command.
  - The file exports one function, `activate`, which is called the very first time your extension is activated (in this case by executing the command). Inside the `activate` function we call `registerCommand`.
  - We pass the function containing the implementation of the command as the second parameter to `registerCommand`.

## Get up and running straight away

- Press `F5` to open a new window with your extension loaded.
- Run your command from the command palette by pressing (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac) and typing `Hello World`.
- Set breakpoints in your code inside `src/extension.ts` to debug your extension.
- Find output from your extension in the debug console.

## Make changes

- You can relaunch the extension from the debug toolbar after changing code in `src/extension.ts`.
- You can also reload (`Ctrl+R` or `Cmd+R` on Mac) the VS Code window with your extension to load your changes.

## Explore the API

- You can open the full set of our API when you open the file `node_modules/@types/vscode/index.d.ts`.

## Run tests

- Open the debug viewlet (`Ctrl+Shift+D` or `Cmd+Shift+D` on Mac) and from the launch configuration dropdown pick `Extension Tests`.
- Press `F5` to run the tests in a new window with your extension loaded.
- See the output of the test result in the debug console.
- Make changes to `src/test/suite/extension.test.ts` or create new test files inside the `test/suite` folder.
  - The provided test runner will only consider files matching the name pattern `**.test.ts`.
  - You can create folders inside the `test` folder to structure your tests any way you want.

## Go further

- [Follow UX guidelines](https://code.visualstudio.com/api/ux-guidelines/overview) to create extensions that seamlessly integrate with VS Code's native interface and patterns.
- Reduce the extension size and improve the startup time by [bundling your extension](https://code.visualstudio.com/api/working-with-extensions/bundling-extension).
- [Publish your extension](https://code.visualstudio.com/api/working-with-extensions/publishing-extension) on the VS Code extension marketplace.
- Automate builds by setting up [Continuous Integration](https://code.visualstudio.com/api/working-with-extensions/continuous-integration).

## Dev log

```bash
# Go to https://dev.azure.com/chneau/_usersSettings/tokens
```

## How do I build this theme?

- First, I get the default theme:
  - Run `code --disable-extensions`
  - `Ctrl+shift+p` and type `Generate Color`
  - Copy output and paste it to file `default-dark-theme-vscode.json`
  - Uncomment commented lines and remove null values
- Run the go code `cd code && go run . && cd -`
- Test by pressing `F5` and check the extension is packaging properly with `vsce package`
- Run `Github Action` to publish

## Programmaticaly, what does it do?

It reads the default theme as a json file configuration, and it adds saturation on each hex color found using the Hsv color (source wikipedia: "HSV (hue, saturation, value, also known as HSB or hue, saturation, brightness)").

```go
h, s, v := cf.Hsv()
cf = colorful.Hsv(h, s*value, v).Clamped() // value is 1.5 for theme.Colors and 2.3 for theme.TokenColors foregrounds
```
