import { inject, injectable } from "inversify";
import {
  Command,
  CommandContribution,
  CommandRegistry,
  MessageService
} from "@theia/core/lib/common";
import { WorkspaceService } from "@theia/workspace/lib/browser/workspace-service";
import { TaskService } from "@theia/task/lib/browser";
import URI from "@theia/core/lib/common/uri";

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

  constructor(
    @inject(WorkspaceService)
    protected readonly workspaceService: WorkspaceService,
    @inject(MessageService)
    private readonly messageService: MessageService,
  ) { }

  getWorkspaceUri(): URI | null {
    this.workspaceService.roots;
    const workspace = this.workspaceService.workspace;
    let uri: URI;
    if (workspace) {
      uri = new URI(workspace.uri);
      return uri;
    }
    return null;
  }

  registerCommands(registry: CommandRegistry): void {
    registry.registerCommand(CustomRunCommands.CUSTOM_RUN_APP, {
      execute: () => {
        let workspaceuri = this.getWorkspaceUri();
        if (workspaceuri) {
          const workspacepath = workspaceuri["path"]["raw"];
          if (this.taskService) {
            this.taskService
              .run(workspacepath, "Run")
              .then(r => console.log("Ran Successfully", r))
              .catch(e => console.log("error: ", e));
          }
        } else {
          this.messageService.info('Unable to Run command. \n Go To Terminal > Run Task')
        }
      }
    });

    registry.registerCommand(CustomRunCommands.CUSTOM_INSTALL_APP, {
      execute: () => {
        let workspaceuri = this.getWorkspaceUri();
        if (workspaceuri) {
          const workspacepath = workspaceuri["path"]["raw"];
          if (this.taskService) {
            this.taskService
              .run(workspacepath, "Install")
              .then(r => console.log("Ran Successfully", r))
              .catch(e => console.log("error: ", e));
          }
        } else {
          this.messageService.info('Unable to Run command. \n Go To Terminal > Run Task')
        }
      }
    });

    registry.registerCommand(CustomRunCommands.CUSTOM_TEST_APP, {
      execute: () => {
        let workspaceuri = this.getWorkspaceUri();
        if (workspaceuri) {
          const workspacepath = workspaceuri["path"]["raw"];
          if (this.taskService) {
            this.taskService
              .run(workspacepath, "Test")
              .then(r => console.log("Ran Successfully", r))
              .catch(e => console.log("error: ", e));
          }
        } else {
          this.messageService.info('Unable to Run command. \n Go To Terminal > Run Task')
        }
      }
    });

  }
}
