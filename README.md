# github-material-icon-theme

![icons](/public/icons.png)

This is a web extension that adds awesome icons to GitHub.
It uses pure CSS icons so it's fast.

[vscode-material-icon-theme](https://github.com/PKief/vscode-material-icon-theme) for GitHub

Supports both light and dark themes.
Currently only supports GitHub.

## Download

### Chromium

[Install from Chrome Web Store](https://chromewebstore.google.com/detail/github-material-icon-them/hlgcfologjgpkkkokemkclndckfbbphb)

### Firefox

[Install from Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/github-material-icon-theme/)

### Edge

[Install from Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/githubmaterialiconthem/mladkedehngimbnkhcbjamaldmjcneaa)

## Benchmark

| Repository | Icons to render | Initial Load | Callback |
| ---------- | ------- | ------------ | -------- |
| this repo | 19 | 1ms | 0.35ms |
| [GPTs/prompts](https://github.com/linexjlin/GPTs/tree/main/prompts) | 500 | 10ms | 1.4ms |
| [vscode-material-icon-theme/icons](https://github.com/PKief/vscode-material-icon-theme/tree/main/icons) | 1800 | 33ms | 5.5ms |
| [DefinitelyTyped/types](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types) (truncated) | 2000 | 35ms | 7.5ms |

These are rough numbers.
Icons to render = files + folders. (note that those large repos are opened in tree view so the files are shown twice)

## Credits

- [vscode-material-icon-theme](https://github.com/PKief/vscode-material-icon-theme) for the amazing icon collection
- [pure CSS icons](https://antfu.me/posts/icons-in-pure-css) from antfu
- [Claudiohbsantos/github-material-icons-extension](https://github.com/Claudiohbsantos/github-material-icons-extension) for the ingenious way of generating the language map from vscode language contributions data
