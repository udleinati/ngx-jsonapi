import { DocumentResource } from './document-resource';
import { Page } from './services/page';
import { Resource } from './resource';
import { Converter } from './services/converter';
import { IRelationships } from './interfaces/relationship';
import { DocumentCollection } from './document-collection';
import { Service } from './service';

export class MockResource extends Resource {
    public attributes = {
        name: '',
        description: ''
    };
    public type = 'resource';

    public relationships: IRelationships = {
        resource: new DocumentResource<MockResource>(),
        collection: new DocumentCollection<MockResource>()
    };
}

class MockResourcesService extends Service<MockResource> {
    public type = 'resource';
    public resource = MockResource;
}

describe('document resource', () => {
    let document_resource;

    beforeEach(() => {
        document_resource = new DocumentResource();
    });

    it('should be created', () => {
        expect(document_resource.builded).toBe(false);
        expect(document_resource.content).toBe('id');
    });
    it('data property should have a new resource instance', () => {
        const resource = new Resource();
        expect(document_resource.data).toEqual(resource);
    });
    it('page property should have a new page instance', () => {
        const page = new Page();
        expect(document_resource.page).toEqual(page);
    });
    it('fill method should call Resource class fill method with the passed IDataObject parameter and fill meta property', () => {
        const mockResourceService = new MockResourcesService();
        const resource = new MockResource();
        spyOn(mockResourceService, 'getOrCreateResource').and.returnValue(resource);
        spyOn(Converter, 'getService').and.returnValue(mockResourceService);
        const Resource_fill_spy = spyOn(resource, 'fill');
        document_resource.fill({
            data: {
                type: 'data',
                id: 'id'
            },
            meta: { meta: 'meta' }
        });
        expect(Resource_fill_spy).toHaveBeenCalled();
        expect(document_resource.meta).toEqual({ meta: 'meta' });
    });
    it('if passed IDataObject has no meta property, fill method should should assign an empty Object', () => {
        document_resource.meta = null;
        const mockResourceService = new MockResourcesService();
        const resource = new MockResource();
        spyOn(mockResourceService, 'getOrCreateResource').and.returnValue(resource);
        spyOn(Converter, 'getService').and.returnValue(mockResourceService);
        const Resource_fill_spy = spyOn(resource, 'fill');
        document_resource.fill({
            data: {
                type: 'data',
                id: 'id'
            }
        });
        expect(Resource_fill_spy).toHaveBeenCalled();
        expect(document_resource.meta).toEqual({});
    });
});
