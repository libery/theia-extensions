import { inject, injectable } from "inversify";
import {
  Command,
  CommandContribution,
  CommandRegistry
} from "@theia/core/lib/common";
import { TaskService } from "@theia/task/lib/browser";

// Registering custom commands
export namespace CustomRunCommands {
  export const CUSTOM_RUN_APP: Command = {
    id: "custom:run:app",
    label: "Run"
  };

  export const CUSTOM_INSTALL_APP: Command = {
    id: "custom:install:app",
    label: "Install"
  };

  export const CUSTOM_TEST_APP: Command = {
    id: "custom:test:app",
    label: "Test"
  };
}

@injectable()
export class CustomRunCommandContribution implements CommandContribution {
  @inject(TaskService)
  protected readonly taskService: TaskService | undefined;

  registerCommands(registry: CommandRegistry): void {
    registry.registerCommand(CustomRunCommands.CUSTOM_RUN_APP, {
      execute: () => {
        if (this.taskService) {
          // @TODO workspace path if static will work, else need to parse path from this.taskService.workspaceRootUri
          this.taskService.run("che", "Run")
            .then(r => console.log("Ran Successfully", r))
            .catch(e => console.log("error: ", e));
        }
      }
    });

    registry.registerCommand(CustomRunCommands.CUSTOM_INSTALL_APP, {
      execute: () => {
        if (this.taskService) {
          this.taskService.run("che", "Install")
            .then(r => console.log("Ran Successfully", r))
            .catch(e => console.log("error: ", e));
        }
      }
    });

    registry.registerCommand(CustomRunCommands.CUSTOM_TEST_APP, {
      execute: () => {
        if (this.taskService) {
          this.taskService
            .run("che", "Test")
            .then(r => console.log("Ran Successfully", r))
            .catch(e => console.log("error: ", e));
        }
      }
    });
  }
}
