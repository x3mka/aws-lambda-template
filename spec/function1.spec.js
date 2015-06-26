var f = require('../src/function1.js');

describe('function1', function() {

    beforeEach(function() {
        this.event = {};
        this.context = jasmine.createSpyObj('context', ['done', 'fail', 'success']);
    });

    it('ok', function() {
        f.handler(this.event, this.context);
        expect(this.context.done).toHaveBeenCalledWith(null, "function1");
    });
})