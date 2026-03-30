
import NewspaperModel from './js/modules/newspaper/NewspaperModel.js';

// Mock localStorage for DataService
global.localStorage = {
    getItem: () => null,
    setItem: () => {}
};

async function runBenchmark() {
    console.log('--- Performance Test ---');

    // 1. Benchmark addSpecialItem (Forward Shift)
    const modelAdd = new NewspaperModel();
    const numPagesAdd = 10000;
    const itemsPerPageAdd = 5;
    for (let p = 1; p <= numPagesAdd; p++) {
        modelAdd.itemsByPage[p] = [];
        for (let i = 0; i < itemsPerPageAdd; i++) {
            modelAdd.itemsByPage[p].push({ id: `add-${p}-${i}`, title: `Item ${p}-${i}` });
        }
    }

    const startAdd = performance.now();
    modelAdd.addSpecialItem({ title: 'Special Item' });
    const endAdd = performance.now();
    console.log(`addSpecialItem (Forward Shift) took: ${endAdd - startAdd}ms`);

    // Verify shift correctness for addSpecialItem
    if (modelAdd.itemsByPage[1][0].title !== 'Special Item' || modelAdd.itemsByPage[2][0].title !== 'Item 1-0') {
        console.error('VERIFICATION FAILED: addSpecialItem shift logic incorrect');
    }

    // 2. Benchmark shiftPagesBack (Backward Shift)
    const modelShift = new NewspaperModel();
    const numPagesShift = 10000;
    const itemsPerPageShift = 5;
    for (let p = 1; p <= numPagesShift; p++) {
        modelShift.itemsByPage[p] = [];
        for (let i = 0; i < itemsPerPageShift; i++) {
            modelShift.itemsByPage[p].push({ id: `shift-${p}-${i}`, title: `Item ${p}-${i}` });
        }
    }
    // Clear page 1 to trigger shiftPagesBack
    modelShift.itemsByPage[1] = [];

    const startShift = performance.now();
    modelShift.shiftPagesBack();
    const endShift = performance.now();
    console.log(`shiftPagesBack (Backward Shift) took: ${endShift - startShift}ms`);

    // Verify shift correctness for shiftPagesBack
    if (modelShift.itemsByPage[1][0].id !== 'shift-2-0') {
        console.error('VERIFICATION FAILED: shiftPagesBack logic incorrect');
    }
    if (modelShift.itemsByPage[numPagesShift]) {
        console.error('VERIFICATION FAILED: Last page not deleted in shiftPagesBack');
    }
}

runBenchmark().catch(console.error);
