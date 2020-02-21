
const createMenuExplorer = require('../index');

let explorer;

beforeAll(() => {
    explorer = createMenuExplorer({ section: document });
});

describe('Mouse Explorer', () => {
    describe('#positionAt() & #coordinatesAt() / position & coordinates', () => {
        test('it returns a mouse explorer position', () => {
            expect(explorer.positionAt(0,0)).toHaveProperty('x');
            expect(explorer.positionAt(0,0)).toHaveProperty('y');
            expect(explorer.coordinatesAt(0,0)).toHaveProperty('x');
            expect(explorer.coordinatesAt(0,0)).toHaveProperty('y');

            expect(explorer.position).toHaveProperty('x');
            expect(explorer.position).toHaveProperty('y');
            expect(explorer.coordinates).toHaveProperty('x');
            expect(explorer.coordinates).toHaveProperty('y');
        });
    });

    describe('#coordinates', () => {
        test('coordinates never exceed [-1,1]', () => {
            const coordinates = explorer.coordinatesAt(997376);
            expect(coordinates.x).toBeLessThanOrEqual(1);
        });
    });
});