export interface ICommand {
  update(drawingCommand: any): void;
  undo(): void;
  execute(): void;
}
