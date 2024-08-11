// Author: Igor Dimitrijević (@igorskyflyer)

import { emojify } from '@igor.dvlpr/emojilyzer'
import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.emojifySelection', () => {
      const editor: vscode.TextEditor | undefined =
        vscode.window.activeTextEditor

      if (!editor) {
        return
      }

      const selections: readonly vscode.Selection[] = editor.selections
      const selectionsCount: number = selections.length

      if (selectionsCount < 1) {
        return
      }

      editor.edit((editBuilder: vscode.TextEditorEdit) => {
        for (let i = 0; i < selectionsCount; i++) {
          const selection: vscode.Selection = selections[i]
          const selectionRange = new vscode.Range(
            selection.start.line,
            selection.start.character,
            selection.end.line,
            selection.end.character
          )
          const selected: string = editor.document.getText(selectionRange)
          const emojified: string = emojify(selected)

          if (selected !== emojified) {
            editBuilder.replace(selectionRange, emojified)
          }
        }
      })
    })
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('extension.emojifyFile', () => {
      const editor: vscode.TextEditor | undefined =
        vscode.window.activeTextEditor

      if (!editor) {
        return
      }

      const file: string = editor.document.getText()
      const emojified: string = emojify(file)

      if (file !== emojified) {
        editor.edit((editBuilder: vscode.TextEditorEdit) => {
          const fileRange = new vscode.Range(
            editor.document.positionAt(0),
            editor.document.positionAt(file.length)
          )

          editBuilder.replace(fileRange, emojified)
        })
      }
    })
  )
}

export function deactivate() {}
