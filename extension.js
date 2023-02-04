'use strict';

const vscode = require("vscode");

function getIndentLevel(/** @type {vscode.TextEditor} */ editor, /** @type {number} */ lineNo) {
  const line = editor.document.lineAt(lineNo);
  return line.isEmptyOrWhitespace ? -1 : line.firstNonWhitespaceCharacterIndex;
}

function moveTo(/** @type {vscode.TextEditor} */ editor, /** @type {number} */ line, /** @type {number} */ col) {
  const position = new vscode.Position(line, col);
  editor.selection = new vscode.Selection(position, position);
  editor.revealRange(new vscode.Range(position, position));
}

function jump(/** @type {vscode.TextEditor} */ editor, /** @type {number} */ dir) {
  let lineNo = editor.selection.start.line;
  const currentLevel = getIndentLevel(editor, lineNo);

  while (true) {
    lineNo += dir;
    if (lineNo < 0 || lineNo == editor.document.lineCount) {
      break;
    }

    const newLevel = getIndentLevel(editor, lineNo);

    if (newLevel != -1 && newLevel < currentLevel) {
      moveTo(editor, lineNo, newLevel);
      break;
    }
  }
}

function jumpBefore(/** @type {vscode.TextEditor} */ editor) {
  jump(editor, -1);
}

function jumpAfter(/** @type {vscode.TextEditor} */ editor) {
  jump(editor, 1);
}

exports.activate = function activate(/** @type {vscode.ExtensionContext} */ context) {
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand('jumpOutsideIndent.jumpBefore', jumpBefore),
    vscode.commands.registerTextEditorCommand('jumpOutsideIndent.jumpAfter', jumpAfter)
  );
};
