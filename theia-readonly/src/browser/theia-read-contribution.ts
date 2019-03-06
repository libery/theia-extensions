import { injectable, inject, named } from 'inversify';
import { Resource, ResourceResolver } from '@theia/core/lib/common';
import { ContributionProvider } from '@theia/core';
import { ReadOnlyConfiguration } from './theia-readonly';
import URI from '@theia/core/lib/common/uri';
import * as Minimatch from 'minimatch';

@injectable()
export class ReadOnlyResourceProvider {
    constructor(
        @inject(ReadOnlyConfiguration)
        protected readOnly: ReadOnlyConfiguration,
        @inject(ContributionProvider)
        @named(ResourceResolver)
        protected readonly resolversProvider: ContributionProvider<ResourceResolver>
    ) { }

    /**
     * Reject if a resource cannot be provided.
     */
    async get(uri: URI): Promise<Resource | any> {
        const readOnlyFiles = await this.readOnly.getReadOnlyFiles();

        const resolvers = this.resolversProvider.getContributions();

        for (const resolver of resolvers) {
            try {
                const output = await resolver.resolve(uri);
                const uriName = uri.toString();
                readOnlyFiles.forEach(pattern => {
                    if (
                        Minimatch(uriName, pattern, {
                            dot: true,
                            nocase: true
                        })
                    ) {
                        output.saveContents = undefined;
                    }
                });
                return output;
            } catch (err) {
                // no-op
            }
        }
        return Promise.reject(
            `A resource provider for '${uri.toString()}' is not registered.`
        );
    }
}
