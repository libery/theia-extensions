import { ContainerModule } from "inversify";
import {
    CommandContribution,
    MenuContribution
} from "@theia/core/lib/common";
import { TheiaRunMenuContribution } from './theia-run-contribution';
import { CustomRunCommandContribution } from "./theia-run-command";


export default new ContainerModule(bind => {
  bind(MenuContribution).to(TheiaRunMenuContribution);
  bind(CommandContribution).to(CustomRunCommandContribution)
});