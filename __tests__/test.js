
const createMenuExplorer = require('../index');

let explorer;

beforeAll(() => {
    
});

describe('Mouse Explorer', () => {
    describe('#positionAt() / position', () => {
        explorer = createMenuExplorer({ section: document, viewport: { innerWidth: 0, innerHeight: 0} });
        
        test('it returns a mouse explorer position', () => {
            expect(explorer.positionAt(0,0)).toHaveProperty('x');
            expect(explorer.positionAt(0,0)).toHaveProperty('y');

            expect(explorer.position).toHaveProperty('x');
            expect(explorer.position).toHaveProperty('y');
        });
    });
});