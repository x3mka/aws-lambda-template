var f = require('../src/function2.js');

describe('function2', function() {

    beforeEach(function() {
        this.event = {};
        this.context = jasmine.createSpyObj('context', ['done', 'fail', 'success']);
    });

    it('should be ok', function() {
        f.handler(this.event, this.context);
        expect(this.context.done).toHaveBeenCalledWith(null, "test");
    });
})