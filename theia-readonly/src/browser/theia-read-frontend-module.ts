import { ContainerModule, interfaces } from 'inversify';
import { ReadOnlyResourceProvider } from './theia-read-contribution';
import { ResourceProvider } from '@theia/core/lib/common';
import { ReadOnlyConfiguration } from './theia-readonly';



export default new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    unbind(ResourceProvider);
    bind(ReadOnlyConfiguration).toSelf();
    bind(ReadOnlyResourceProvider).toSelf().inSingletonScope();
    bind(ResourceProvider).toProvider(context =>
        uri => context.container.get(ReadOnlyResourceProvider).get(uri)
    );
});